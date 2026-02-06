import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const getAllAdjustmentReasons = async () => {
  return prisma.adjustmentReason.findMany({
    orderBy: { name: 'asc' },
  });
};

export const getAdjustmentReasonById = async (id: number) => {
  return prisma.adjustmentReason.findUnique({
    where: { id },
  });
};

export const createAdjustmentReason = async (data: Prisma.AdjustmentReasonCreateInput) => {
  return prisma.adjustmentReason.create({
    data,
  });
};

export const updateAdjustmentReason = async (id: number, data: Prisma.AdjustmentReasonUpdateInput) => {
  return prisma.adjustmentReason.update({
    where: { id },
    data,
  });
};

export const deleteAdjustmentReason = async (id: number) => {
  return prisma.adjustmentReason.delete({
    where: { id },
  });
};