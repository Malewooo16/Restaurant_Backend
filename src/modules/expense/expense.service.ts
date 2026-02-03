import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createExpense = async (
  data: Prisma.ExpenseCreateInput
) => {
  return prisma.expense.create({
    data,
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
    },
  });
};

export const updateExpense = async (
  id: number,
  data: Prisma.ExpenseUpdateInput
) => {
  return prisma.expense.update({
    where: { id },
    data,
  });
};

export const deleteExpense = (id: number) => {
  return prisma.expense.delete({
    where: { id },
  });
};
