import { Prisma, PaymentStatus, OrderStatus } from "../../../generated/prisma/client";
import { generatePaymentCode } from "../../../lib/functions";
import { prisma } from "../../../lib/prisma";

export const createPayment = async (
  data: Prisma.PaymentUncheckedCreateInput
) => {
  return prisma.$transaction(
    async (tx) => {
      // 1️⃣ Get order total (minimal read)
      const order = await tx.order.findUnique({
        where: { id: data.orderId },
        select: { total: true, status: true },
      });

      if (!order) {
        throw new Error(`Order with id ${data.orderId} not found`);
      }

      if (order.status === OrderStatus.PAID) {
        throw new Error('Order is already fully paid');
      }

      const totalAmount = order.total ?? 0;

      // 2️⃣ Aggregate total paid so far (DB does the math)
      const paymentAgg = await tx.payment.aggregate({
        where: { orderId: data.orderId },
        _sum: { amount: true },
      });

      const totalPaid = paymentAgg._sum.amount ?? 0;
      const remainingAmount = totalAmount - totalPaid;

      if (remainingAmount <= 0) {
        throw new Error('Order is already fully paid');
      }

      if (data.amount > remainingAmount) {
        throw new Error(
          `Payment amount (${data.amount}) exceeds remaining amount (${remainingAmount})`
        );
      }

      // 3️⃣ Create payment with generated code
      const payment = await tx.payment.create({
        data: {
          ...data,
          status: PaymentStatus.COMPLETED,
          receiptNumber: generatePaymentCode(8), // 👈 HERE
        },
      });

      // 4️⃣ Mark order as PAID if fully settled
      if (totalPaid + data.amount >= totalAmount) {
        await tx.order.update({
          where: { id: data.orderId },
          data: { status: OrderStatus.PAID },
        });
      }

      return payment;
    },
    {
      timeout: 10000, // safe upper bound
      maxWait: 3000,
    }
  );
};


export const getOrderPaymentSummary = async (orderId: number) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }

  const totalPaid = order.payments.reduce((acc, p) => acc + p.amount, 0);
  const totalAmount = order.total ?? 0;
  const remainingAmount = Math.max(0, totalAmount - totalPaid);

  return {
    orderId: order.id,
    totalAmount,
    amountPaid: totalPaid,
    remainingAmount,
    isFullyPaid: totalPaid >= totalAmount,
    payments: order.payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      paymentMethod: p.paymentMethod,
      status: p.status,
      createdAt: p.createdAt,
    })),
  };
};

export const getPaymentsByOrderId = (orderId: number) => {
  return prisma.payment.findMany({
    where: { orderId },
    orderBy: { createdAt: "asc" },
  });
};

export const getAllPayments = () => {
  return prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getPaymentById = (id: number) => {
  return prisma.payment.findUnique({
    where: { id },
    include: { order: true },
  });
};

export const refundPayment = async (paymentId: number) => {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new Error(`Payment with id ${paymentId} not found`);
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new Error(`Payment with status ${payment.status} cannot be refunded.`);
    }

    // Update payment status to REFUNDED
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.REFUNDED },
    });

    // Get all completed payments for the order, excluding the refunded one
    const completedPayments = await tx.payment.findMany({
        where: {
            orderId: payment.orderId,
            status: PaymentStatus.COMPLETED,
            id: { not: paymentId }
        }
    });

    const totalPaid = completedPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalAmount = payment.order.total ?? 0;

    // If the order was PAID and now is not fully paid, update its status
    if (payment.order.status === OrderStatus.PAID && totalPaid < totalAmount) {
      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: OrderStatus.COMPLETED },
      });
    }

    return updatedPayment;
  });
};
