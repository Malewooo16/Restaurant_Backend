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

export const getExpiringBatches = async (days: number) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return prisma.batch.findMany({
    where: {
      expiryDate: {
        lte: futureDate,
        gte: new Date(), // Only include batches with expiryDate in the future
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
