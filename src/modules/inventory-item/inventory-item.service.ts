import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createInventoryItem = async (
  data: {
    name: string;
    description?: string;
    sku?: string;
    categoryId?: number;
    unit: string;
    department?: string[];
    quantity?: number;
    minStock?: number;
    maxStock?: number;
    price?: number;
    supplier?: string;
    location?: string;
    storageLocation?: string;
  },
  userId: number
) => {
  const nameExists = await prisma.inventoryItem.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Inventory item with this name already exists');
  }
  return prisma.inventoryItem.create({
    data: {
      name: data.name,
      description: data.description,
      sku: data.sku,
      categoryId: data.categoryId,
      unit: data.unit,
      department: data.department,
      quantity: data.quantity,
      minStock: data.minStock,
      maxStock: data.maxStock,
      price: data.price,
      supplier: data.supplier,
      location: data.location as any,
      storageLocation: data.storageLocation,
      createdById: userId,
      updatedById: userId,
    },
  });
};

export const getAllInventoryItems = () => {
  return prisma.inventoryItem.findMany({
    where:{
      name: {
        mode: 'insensitive',
      }
    },
    include: {
      category: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const getInventoryItemById = (id: number) => {
  return prisma.inventoryItem.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
};

export const updateInventoryItem = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    sku?: string;
    categoryId?: number;
    unit?: string;
    department?: string[];
    quantity?: number;
    minStock?: number;
    maxStock?: number;
    price?: number;
    supplier?: string;
    location?: string;
    storageLocation?: string;
    status?: string;
  },
  userId: number
) => {
  if (data.name) {
    const nameExists = await prisma.inventoryItem.findFirst({
      where: {
        name: data.name,
        NOT: {
          id,
        },
      },
    });
    if (nameExists) {
      throw new Error('Inventory item with this name already exists');
    }
  }
  return prisma.inventoryItem.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      sku: data.sku,
      categoryId: data.categoryId,
      unit: data.unit,
      department: data.department,
      quantity: data.quantity,
      minStock: data.minStock,
      maxStock: data.maxStock,
      price: data.price,
      supplier: data.supplier,
      location: data.location as any,
      storageLocation: data.storageLocation,
      status: data.status as any,
      updatedById: userId,
    },
  });
};

export const deleteInventoryItem = (id: number) => {
  return prisma.inventoryItem.delete({
    where: { id },
  });
};
