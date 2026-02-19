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

export const createDissatisfaction = async (data: Prisma.DissatisfactionCreateInput) => {
  return prisma.dissatisfaction.create({
    data,
  });
};

export const updateDissatisfaction = async (id: number, data: Prisma.DissatisfactionUpdateInput) => {
  const existingDissatisfaction = await prisma.dissatisfaction.findUnique({
    where: { id },
  });
  if (!existingDissatisfaction) {
    throw new Error('Dissatisfaction not found');
  }

  return prisma.dissatisfaction.update({
    where: { id },
    data,
  });
};

export const updateDissatisfactionStatus = async (id: number, status: string, resolution?: string) => {
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