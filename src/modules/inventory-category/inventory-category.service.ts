import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createInventoryCategory = async (
  data: Prisma.InventoryCategoryCreateInput
) => {
  const nameExists = await prisma.inventoryCategory.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Inventory category with this name already exists');
  }
  return prisma.inventoryCategory.create({
    data,
  });
};

export const getAllInventoryCategories = () => {
  return prisma.inventoryCategory.findMany();
};

export const getInventoryCategoryById = (id: number) => {
  return prisma.inventoryCategory.findUnique({
    where: { id },
  });
};

export const updateInventoryCategory = async (
  id: number,
  data: Prisma.InventoryCategoryUpdateInput
) => {
  if (typeof data.name === 'string') {
    const nameExists = await prisma.inventoryCategory.findFirst({
      where: {
        name: data.name,
        NOT: {
          id,
        },
      },
    });
    if (nameExists) {
      throw new Error('Inventory category with this name already exists');
    }
  }
  return prisma.inventoryCategory.update({
    where: { id },
    data,
  });
};

export const deleteInventoryCategory = (id: number) => {
  return prisma.inventoryCategory.delete({
    where: { id },
  });
};
