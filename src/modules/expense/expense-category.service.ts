import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createExpenseCategory = async (
  data: Prisma.ExpenseCategoryCreateInput
) => {
  const nameExists = await prisma.expenseCategory.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Expense category with this name already exists');
  }
  return prisma.expenseCategory.create({
    data,
  });
};

export const getAllExpenseCategories = () => {
  return prisma.expenseCategory.findMany();
};

export const getExpenseCategoryById = (id: number) => {
  return prisma.expenseCategory.findUnique({
    where: { id },
  });
};

export const updateExpenseCategory = async (
  id: number,
  data: Prisma.ExpenseCategoryUpdateInput
) => {
  if (typeof data.name === 'string') {
    const nameExists = await prisma.expenseCategory.findFirst({
      where: {
        name: data.name,
        NOT: {
          id,
        },
      },
    });
    if (nameExists) {
      throw new Error('Expense category with this name already exists');
    }
  }
  return prisma.expenseCategory.update({
    where: { id },
    data,
  });
};

export const deleteExpenseCategory = (id: number) => {
  return prisma.expenseCategory.delete({
    where: { id },
  });
};
