import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createExpenseCategory = async (
  data: { name: string; description?: string },
  userId: number
) => {
  const nameExists = await prisma.expenseCategory.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Expense category with this name already exists');
  }
  return prisma.expenseCategory.create({
    data: {
      name: data.name,
      description: data.description,
      createdById: userId,
      updatedById: userId,
    },
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
  data: { name?: string; description?: string },
  userId: number
) => {
  if (data.name) {
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
    data: {
      name: data.name,
      description: data.description,
      updatedById: userId,
    },
  });
};

export const deleteExpenseCategory = (id: number) => {
  return prisma.expenseCategory.delete({
    where: { id },
  });
};
