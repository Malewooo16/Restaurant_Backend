import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createInventoryCategory = async (
  data: { name: string; description?: string; supplierId?: number },
  userId: number
) => {
  const nameExists = await prisma.inventoryCategory.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Inventory category with this name already exists');
  }
  return prisma.inventoryCategory.create({
    data: {
      name: data.name,
      description: data.description,
      supplierId: data.supplierId,
      createdById: userId,
      updatedById: userId,
    },
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
  data: { name?: string; description?: string; supplierId?: number; isActive?: boolean },
  userId: number
) => {
  if (data.name) {
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
    data: {
      name: data.name,
      description: data.description,
      supplierId: data.supplierId,
      isActive: data.isActive,
      updatedById: userId,
    },
  });
};

export const deleteInventoryCategory = (id: number) => {
  return prisma.inventoryCategory.delete({
    where: { id },
  });
};
