import { prisma } from "../../../lib/prisma";

export const getAllPermissions = async () => {
  return prisma.permission.findMany({
    orderBy: { category: 'asc' },
  });
};

export const getPermissionById = async (id: number) => {
  return prisma.permission.findUnique({
    where: { id },
  });
};

export const getPermissionsByCategory = async (category: string) => {
  return prisma.permission.findMany({
    where: { category },
    orderBy: { name: 'asc' },
  });
};

export const createPermission = async (data: { name: string; description?: string; category: string }) => {
  return prisma.permission.create({
    data,
  });
};

export const updatePermission = async (id: number, data: { name?: string; description?: string; category?: string; isActive?: boolean }) => {
  return prisma.permission.update({
    where: { id },
    data,
  });
};

export const deletePermission = async (id: number) => {
  return prisma.permission.delete({
    where: { id },
  });
};