import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

export const getAllDissatisfactions = async () => {
  return prisma.dissatisfaction.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getDissatisfactionById = async (id: number) => {
  return prisma.dissatisfaction.findUnique({
    where: { id },
  });
};

export const createDissatisfaction = async (data: { orderId: number; tableNumber: number; itemName: string; reason: string }, userId: number) => {
  return prisma.dissatisfaction.create({
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

export const updateDissatisfaction = async (id: number, data: { status?: string; resolution?: string }, userId: number) => {
  const existingDissatisfaction = await prisma.dissatisfaction.findUnique({
    where: { id },
  });
  if (!existingDissatisfaction) {
    throw new Error('Dissatisfaction not found');
  }

  return prisma.dissatisfaction.update({
    where: { id },
    data: {
      status: data.status as any,
      resolution: data.resolution,
      updatedById: userId,
    },
  });
};

export const updateDissatisfactionStatus = async (id: number, status: string, resolution: string | undefined, userId: number) => {
  const existingDissatisfaction = await prisma.dissatisfaction.findUnique({
    where: { id },
  });
  if (!existingDissatisfaction) {
    throw new Error('Dissatisfaction not found');
  }

  return prisma.dissatisfaction.update({
    where: { id },
    data: {
      status: status as any,
      resolution,
      updatedById: userId,
    },
  });
};

export const deleteDissatisfaction = async (id: number) => {
  return prisma.dissatisfaction.delete({
    where: { id },
  });
};

export const getDissatisfactionsByStatus = async (status: string) => {
  return prisma.dissatisfaction.findMany({
    where: { status: status as any },
    orderBy: {
      createdAt: 'desc',
    },
  });
};