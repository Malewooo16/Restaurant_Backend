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

export const createBarReturn = async (data: Prisma.BarReturnCreateInput) => {
  return prisma.barReturn.create({
    data,
  });
};

export const updateBarReturn = async (id: number, data: Prisma.BarReturnUpdateInput) => {
  const existingBarReturn = await prisma.barReturn.findUnique({
    where: { id },
  });
  if (!existingBarReturn) {
    throw new Error('Bar return not found');
  }

  return prisma.barReturn.update({
    where: { id },
    data,
  });
};

export const updateBarReturnStatus = async (id: number, status: string, resolution?: string) => {
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