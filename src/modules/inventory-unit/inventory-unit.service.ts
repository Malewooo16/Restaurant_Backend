import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createInventoryUnit = async (
  data: Prisma.InventoryUnitCreateInput
) => {
  const nameExists = await prisma.inventoryUnit.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Inventory unit with this name already exists');
  }
  return prisma.inventoryUnit.create({
    data,
  });
};

export const getAllInventoryUnits = () => {
  return prisma.inventoryUnit.findMany();
};

export const getInventoryUnitById = (id: number) => {
  return prisma.inventoryUnit.findUnique({
    where: { id },
  });
};

export const updateInventoryUnit = async (
  id: number,
  data: Prisma.InventoryUnitUpdateInput
) => {
  if (typeof data.name === 'string') {
    const nameExists = await prisma.inventoryUnit.findFirst({
      where: {
        name: data.name,
        NOT: {
          id,
        },
      },
    });
    if (nameExists) {
      throw new Error('Inventory unit with this name already exists');
    }
  }
  return prisma.inventoryUnit.update({
    where: { id },
    data,
  });
};

export const deleteInventoryUnit = (id: number) => {
  return prisma.inventoryUnit.delete({
    where: { id },
  });
};
