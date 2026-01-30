import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createExpense = async (
  data: Prisma.ExpenseCreateInput
) => {
  return prisma.expense.create({
    data,
  });
};

export const getAllExpenses = () => {
  return prisma.expense.findMany({
    include: {
      category: true,
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
