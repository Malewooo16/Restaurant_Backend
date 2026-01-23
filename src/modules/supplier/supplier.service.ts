import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createSupplier = async (data: Prisma.SupplierCreateInput) => {
  return prisma.supplier.create({
    data,
  });
};

export const getAllSuppliers = async () => {
  return prisma.supplier.findMany({
    include: {
      inventoryCategories: true,
    }
  });
};

export const getSupplierById = async (id: number) => {
  return prisma.supplier.findUnique({
    where: { id },
    include: {
      inventoryCategories: true,
    },
  });
};

export const updateSupplier = async (id: number, data: Prisma.SupplierUpdateInput) => {
  return prisma.supplier.update({
    where: { id },
    data,
  });
};

export const deleteSupplier = async (id: number) => {
  return prisma.supplier.delete({
    where: { id },
  });
};
