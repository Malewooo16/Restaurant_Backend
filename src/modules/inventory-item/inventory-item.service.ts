import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createInventoryItem = async (
  data: Prisma.InventoryItemCreateInput
) => {
  const nameExists = await prisma.inventoryItem.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Inventory item with this name already exists');
  }
  return prisma.inventoryItem.create({
    data,
  });
};

export const getAllInventoryItems = () => {
  return prisma.inventoryItem.findMany();
};

export const getInventoryItemById = (id: number) => {
  return prisma.inventoryItem.findUnique({
    where: { id },
  });
};

export const updateInventoryItem = async (
  id: number,
  data: Prisma.InventoryItemUpdateInput
) => {
  if (typeof data.name === 'string') {
    const nameExists = await prisma.inventoryItem.findFirst({
      where: {
        name: data.name,
        NOT: {
          id,
        },
      },
    });
    if (nameExists) {
      throw new Error('Inventory item with this name already exists');
    }
  }
  return prisma.inventoryItem.update({
    where: { id },
    data,
  });
};

export const deleteInventoryItem = (id: number) => {
  return prisma.inventoryItem.delete({
    where: { id },
  });
};
