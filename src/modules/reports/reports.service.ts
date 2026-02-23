import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// Order Summary Report - Paid orders with order #, date, item count, total, waiter
export const getOrderSummaryReport = async (params: DateRangeParams) => {
  const where: any = {
    status: 'PAID',
  };

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform data to match expected format
  return orders.map(order => ({
    orderNumber: order.orderNumber,
    date: order.createdAt,
    itemCount: order.orderItems.length,
    total: order.total,
    waiter: order.waiter || 'N/A',
  }));
};

// Order Detailed Report - Paid order items with date, item, quantity, price
export const getOrderDetailedReport = async (params: DateRangeParams) => {
  const whereClause: any = {
    order: {
      status: 'PAID',
    },
  };

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    whereClause.order.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const orderItems = await prisma.orderItem.findMany({
    where: whereClause,
    include: {
      menuItem: {
        select: {
          name: true,
        },
      },
      order: {
        select: {
          orderNumber: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      order: {
        createdAt: 'desc',
      },
    },
  });

  // Transform data to match expected format
  return orderItems.map(item => ({
    date: item.order.createdAt,
    orderNumber: item.order.orderNumber,
    item: item.menuItem.name,
    quantity: item.quantity,
    price: item.price,
  }));
};

// Payments Report - Paid orders with payment details
export const getPaymentsReport = async (params: DateRangeParams) => {
  const whereClause: any = {
    status: 'COMPLETED',
    order: {
      status: 'PAID',
    },
  };

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    whereClause.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const payments = await prisma.payment.findMany({
    where: whereClause,
    include: {
      order: {
        select: {
          orderNumber: true,
          waiter: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform data to match expected format
  return payments.map(payment => ({
    orderNumber: payment.order.orderNumber,
    date: payment.createdAt,
    amount: payment.amount,
    paymentMethod: payment.paymentMethod,
    waiter: payment.order.waiter || 'N/A',
  }));
};

// Refund Report - Dissatisfactions with REFUNDED status
export const getRefundsReport = async (params: DateRangeParams) => {
  const where: any = {
    status: 'REFUNDED',
  };

  // Add date range filter
  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.createdAt = {
      gte: start,
      lte: end,
    };
  }

  const refunds = await prisma.dissatisfaction.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Transform data to match expected format
  return refunds.map(refund => ({
    orderNumber: refund.orderId,
    date: refund.createdAt,
    item: refund.itemName,
    price: 0, // Dissatisfaction doesn't track price, set to 0
    reason: refund.reason,
    waiter: 'N/A', // Dissatisfaction doesn't track waiter
  }));
};