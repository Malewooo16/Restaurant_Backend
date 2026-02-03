import { Prisma, PaymentStatus, OrderStatus } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

export const createPayment = async (data: Prisma.PaymentUncheckedCreateInput) => {
  // By default, a new payment is considered completed
  const paymentData = { ...data, status: PaymentStatus.COMPLETED };

  return prisma.$transaction(async (tx) => {
    // Get order with existing payments
    const order = await tx.order.findUnique({
      where: { id: data.orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new Error(`Order with id ${data.orderId} not found`);
    }

    const totalPaid = order.payments.reduce((acc, p) => acc + p.amount, 0);
    const totalAmount = order.total ?? 0;
    const remainingAmount = totalAmount - totalPaid;

    // Check if order is already fully paid
    if (totalPaid >= totalAmount) {
      throw new Error("Order is already fully paid");
    }

    // Validate payment amount doesn't exceed remaining
    if (data.amount > remainingAmount) {
      throw new Error(
        `Payment amount (${data.amount}) exceeds remaining amount (${remainingAmount})`
      );
    }

    // Create the payment
    const payment = await tx.payment.create({
      data: paymentData,
    });

    // Check if order is now fully paid
    const newTotalPaid = totalPaid + data.amount;
    if (newTotalPaid >= totalAmount) {
      await tx.order.update({
        where: { id: data.orderId },
        data: { status: OrderStatus.PAID },
      });
    }

    return payment;
  });
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
