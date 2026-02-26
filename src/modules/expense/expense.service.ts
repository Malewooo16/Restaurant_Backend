import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createExpense = async (
  data: {
    amount: number;
    date: string | Date;
    description?: string;
    paymentMethod: string;
    categoryId: number;
  },
  userId: number
) => {
  return prisma.expense.create({
    data: {
      amount: data.amount,
      date: new Date(data.date),
      description: data.description,
      paymentMethod: data.paymentMethod as any,
      categoryId:data.categoryId,
      createdById:userId,
      updatedById:userId
    },
  });
};

interface GetAllExpensesParams {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
}

export const getAllExpenses = (params?: GetAllExpensesParams) => {
  const where: Prisma.ExpenseWhereInput = {};

  if (params?.startDate && params?.endDate) {
    const start = new Date(`${params.startDate}T00:00:00.000Z`);
    const end = new Date(`${params.endDate}T23:59:59.999Z`);
    where.date = {
      gte: start,
      lte: end,
    };
  }

  if (params?.categoryId) {
    where.categoryId = params.categoryId;
  }

  return prisma.expense.findMany({
    where,
    include: {
      category: true,
      createdBy: true,
      updatedBy: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
};

export const getExpenseById = (id: number) => {
  return prisma.expense.findUnique({
    where: { id },
    include: {
      category: true,
      createdBy: true,
      updatedBy: true,
    },
  });
};

export const updateExpense = async (
  id: number,
  data: {
    amount?: number;
    date?: string | Date;
    description?: string;
    paymentMethod?: string;
    categoryId?: number;
  },
  userId: number
) => {
  return prisma.expense.update({
    where: { id },
    data: {
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod as any }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      updatedById: userId,
    },
  });
};

export const deleteExpense = (id: number) => {
  return prisma.expense.delete({
    where: { id },
  });
};
