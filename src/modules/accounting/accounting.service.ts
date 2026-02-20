import { prisma } from "../../../lib/prisma";
import { PurchaseOrderStatus } from "../../../generated/prisma/client";

export interface AccountingSummary {
  totalRevenue: number;
  totalExpenses: number;
  totalPurchases: number;
  netProfit: number;
  revenueChange: number;
  expenseChange: number;
  purchaseChange: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export interface DailySummary {
  date: string;
  revenue: number;
  expenses: number;
  purchases: number;
}

// Get accounting summary for a date range
export const getAccountingSummary = async (startDate?: Date, endDate?: Date): Promise<AccountingSummary> => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Get current month data - Revenue from paid orders
  const currentMonthOrders = await prisma.order.aggregate({
    where: {
      status: { in: ['PAID'] as any },
      createdAt: {
        gte: startDate || currentMonthStart,
        lte: endDate || now,
      },
    },
    _sum: { total: true },
  });

  // Get current month expenses
  const currentMonthExpenses = await prisma.expense.aggregate({
    where: {
      date: {
        gte: startDate || currentMonthStart,
        lte: endDate || now,
      },
    },
    _sum: { amount: true },
  });

  // Calculate purchases from goods receiving items (unit price from purchase order items)
  const currentMonthGRNItems = await prisma.goodsReceivingItem.findMany({
    where: {
      goodsReceiving: {
        receivedAt: {
          gte: startDate || currentMonthStart,
          lte: endDate || now,
        },
      },
    },
    include: {
      inventoryItem: true,
    },
  });
  const totalPurchases = currentMonthGRNItems.reduce((sum, item) => sum + (item.quantityReceived * (item.inventoryItem?.price || 0)), 0);

  // Get previous month data for comparison
  const previousMonthOrders = await prisma.order.aggregate({
    where: {
      status: { in: ['PAID', 'COMPLETED'] as any },
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
    _sum: { total: true },
  });

  const previousMonthExpenses = await prisma.expense.aggregate({
    where: {
      date: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
    _sum: { amount: true },
  });

  const prevMonthGRNItems = await prisma.goodsReceivingItem.findMany({
    where: {
      goodsReceiving: {
        receivedAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    },
    include: {
      inventoryItem: true,
    },
  });
  const prevMonthPurchases = prevMonthGRNItems.reduce((sum, item) => sum + (item.quantityReceived * (item.inventoryItem?.price || 0)), 0);

  const totalRevenue = currentMonthOrders._sum.total || 0;
  const totalExpenses = currentMonthExpenses._sum.amount || 0;
  const netProfit = totalRevenue - totalExpenses - totalPurchases;

  // Calculate percentage changes
  const prevRevenue = previousMonthOrders._sum.total || 0;
  const prevExpenses = previousMonthExpenses._sum.amount || 0;

  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
  const expenseChange = prevExpenses > 0 ? ((totalExpenses - prevExpenses) / prevExpenses) * 100 : 0;
  const purchaseChange = prevMonthPurchases > 0 ? ((totalPurchases - prevMonthPurchases) / prevMonthPurchases) * 100 : 0;

  return {
    totalRevenue,
    totalExpenses,
    totalPurchases,
    netProfit,
    revenueChange,
    expenseChange,
    purchaseChange,
  };
};

// Get recent transactions
export const getRecentTransactions = async (limit: number = 10): Promise<Transaction[]> => {
  const transactions: Transaction[] = [];

  // Get recent paid orders (as revenue)
  const recentOrders = await prisma.order.findMany({
    where: { status: { in: ['PAID', 'COMPLETED'] as any } },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      total: true,
      createdAt: true,
    },
  });

  recentOrders.forEach((order: { id: number; total: number | null; createdAt: Date }) => {
    transactions.push({
      id: `order-${order.id}`,
      description: `Order #${order.id} - Sales`,
      amount: order.total || 0,
      type: 'income',
      date: order.createdAt.toISOString(),
    });
  });

  // Get recent expenses
  const recentExpenses = await prisma.expense.findMany({
    orderBy: { date: 'desc' },
    take: limit,
    include: { category: true },
  });

  recentExpenses.forEach((expense: { id: number; description: string | null; amount: number | null; date: Date; category: { name: string | null } | null }) => {
    transactions.push({
      id: `expense-${expense.id}`,
      description: expense.description || expense.category?.name || 'Expense',
      amount: -(expense.amount || 0),
      type: 'expense',
      date: expense.date.toISOString(),
    });
  });

  // Get recent goods receiving (as purchases)
  const recentGRN = await prisma.goodsReceiving.findMany({
    orderBy: { receivedAt: 'desc' },
    take: limit,
    include: { supplier: true },
  });

  recentGRN.forEach((grn: { id: number; grnNumber: string; receivedAt: Date; supplier: { name: string | null } | null }) => {
    transactions.push({
      id: `grn-${grn.id}`,
      description: `GRN - ${grn.supplier?.name || 'Supplier'}`,
      amount: 0, // Would need to calculate from items
      type: 'expense',
      date: grn.receivedAt.toISOString(),
    });
  });

  // Sort by date and take top results
  return transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

// Get daily summary for the last N days
export const getDailySummary = async (days: number = 30): Promise<DailySummary[]> => {
  const summaries: DailySummary[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Get revenue for the day
    const dailyOrders = await prisma.order.aggregate({
      where: {
        status: { in: ['PAID', 'COMPLETED'] as any },
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: { total: true },
    });

    // Get expenses for the day
    const dailyExpenses = await prisma.expense.aggregate({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: { amount: true },
    });

    summaries.push({
      date: startOfDay.toISOString().split('T')[0],
      revenue: dailyOrders._sum.total || 0,
      expenses: dailyExpenses._sum.amount || 0,
      purchases: 0,
    });
  }

  return summaries.reverse();
};

// Get expense breakdown by category
export const getExpenseBreakdown = async (startDate?: Date, endDate?: Date): Promise<{ category: string; amount: number; percentage: number }[]> => {
  const now = new Date();
  
  const expenses = await prisma.expense.groupBy({
    by: ['categoryId'],
    where: {
      date: {
        gte: startDate || new Date(now.getFullYear(), now.getMonth(), 1),
        lte: endDate || now,
      },
    },
    _sum: { amount: true },
  });

  const totalExpenses = expenses.reduce((sum: number, e: { _sum: { amount: number | null } }) => sum + (e._sum.amount || 0), 0);

  const breakdown = await Promise.all(
    expenses.map(async (e: { categoryId: number; _sum: { amount: number | null } }) => {
      const category = await prisma.expenseCategory.findUnique({
        where: { id: e.categoryId },
      });
      return {
        category: category?.name || 'Other',
        amount: e._sum.amount || 0,
        percentage: totalExpenses > 0 ? ((e._sum.amount || 0) / totalExpenses) * 100 : 0,
      };
    })
  );

  return breakdown.sort((a: { amount: number }, b: { amount: number }) => b.amount - a.amount);
};