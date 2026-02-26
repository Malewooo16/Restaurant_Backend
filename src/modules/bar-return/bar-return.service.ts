import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

export const getAllBarReturns = async () => {
  return prisma.barReturn.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getBarReturnById = async (id: number) => {
  return prisma.barReturn.findUnique({
    where: { id },
  });
};

export const createBarReturn = async (data: { orderId: number; tableNumber: number; itemName: string; reason: string }, userId: number) => {
  return prisma.barReturn.create({
    data: {
      orderId: data.orderId,
      tableNumber: data.tableNumber,
      itemName: data.itemName,
      reason: data.reason,
      createdById: userId,
      updatedById: userId,
    },
  });
};

export const updateBarReturn = async (id: number, data: { status?: string; resolution?: string }, userId: number) => {
  const existingBarReturn = await prisma.barReturn.findUnique({
    where: { id },
  });
  if (!existingBarReturn) {
    throw new Error('Bar return not found');
  }

  return prisma.barReturn.update({
    where: { id },
    data: {
      status: data.status as any,
      resolution: data.resolution,
      updatedById: userId,
    },
  });
};

export const updateBarReturnStatus = async (id: number, status: string, resolution: string | undefined, userId: number) => {
  const existingBarReturn = await prisma.barReturn.findUnique({
    where: { id },
  });
  if (!existingBarReturn) {
    throw new Error('Bar return not found');
  }

  return prisma.barReturn.update({
    where: { id },
    data: {
      status: status as any,
      resolution,
      updatedById: userId,
    },
  });
};

export const deleteBarReturn = async (id: number) => {
  return prisma.barReturn.delete({
    where: { id },
  });
};

export const getBarReturnsByStatus = async (status: string) => {
  return prisma.barReturn.findMany({
    where: { status: status as any },
    orderBy: {
      createdAt: 'desc',
    },
  });
};