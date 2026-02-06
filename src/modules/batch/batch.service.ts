import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createBatch = async (data: Prisma.BatchCreateInput) => {
  return prisma.batch.create({
    data,
  });
};

export const getAllBatches = async () => {
  return prisma.batch.findMany({
    include: {
      inventoryItem: true,
      goodsReceivingItem: true,
    },
  });
};

export const getBatchesByItemId = async (itemId: number) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return prisma.batch.findMany({
    where: {
      inventoryItemId: itemId,
      quantity: { gt: 0 },
      OR: [
        { expiryDate: null },
        { expiryDate: { gt: tomorrow } },
      ],
    },
    include: {
      inventoryItem: true,
      goodsReceivingItem: true,
    },
    orderBy: [
      { expiryDate: 'asc' },
    ],
  });
};

export const getExpiringBatches = async (days: number) => {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + days);

  return prisma.batch.findMany({
    where: {
      quantity: {
        gt: 0, // 👈 exclude quantity === 0
      },
      expiryDate: {
        gte: now,       // not expired yet
        lte: futureDate, // expiring within X days
      },
    },
    include: {
      inventoryItem: true,
      goodsReceivingItem: true,
    },
  });
};


export const getBatchById = async (id: number) => {
  return prisma.batch.findUnique({
    where: { id },
    include: {
      inventoryItem: true,
      goodsReceivingItem: true,
    },
  });
};

export const updateBatch = async (id: number, data: Prisma.BatchUpdateInput) => {
  return prisma.batch.update({
    where: { id },
    data,
  });
};

export const deleteBatch = async (id: number) => {
  return prisma.batch.delete({
    where: { id },
  });
};
