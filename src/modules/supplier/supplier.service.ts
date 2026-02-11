import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const createSupplier = async (data: { 
  name: string; 
  contactPerson?: string; 
  email?: string; 
  phone?: string; 
  address?: string; 
  categories?: number[] 
}) => {
  try {
    const { categories, ...supplierData } = data;

    // 1. Check for existing supplier
    const supplierExists = await prisma.supplier.findFirst({
      where: {
        OR: [
          { name: supplierData.name },
          ...(supplierData.email ? [{ email: supplierData.email }] : []),
        ]
      }
    });

    if (supplierExists) {
      throw new Error('Supplier with the same name or email already exists.');
    }

    // 2. Create the supplier
    return await prisma.supplier.create({
      data: {
        ...supplierData,
        ...(categories && categories.length > 0 && {
          inventoryCategories: {
            connect: categories.map((id) => ({ id })),
          },
        }),
      },
      include: {
        inventoryCategories: true,
      },
    });
  } catch (error: any) {
    // 3. Log the error for debugging and re-throw
    console.error("Error creating supplier:", error.message);
    throw new Error(error.message || "An unexpected error occurred while creating the supplier.");
  }
};
export const getAllSuppliers = async () => {
  return prisma.supplier.findMany({
    where:{
      name:{
        mode: 'insensitive',
      }
    },
    include: {
      inventoryCategories: true,
    },
    orderBy:{
      name: 'asc',
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

export const updateSupplier = async (id: number, data: { name?: string; contactPerson?: string; email?: string; phone?: string; address?: string; categories?: number[] }) => {
  const { categories, ...supplierData } = data;
  
  return prisma.supplier.update({
    where: { id },
    data: {
      ...supplierData,
      ...(categories && {
        inventoryCategories: {
          set: categories.map((catId) => ({ id: catId })),
        },
      }),
    },
    include: {
      inventoryCategories: true,
    },
  });
};

export const deleteSupplier = async (id: number) => {
  return prisma.supplier.delete({
    where: { id },
  });
};
