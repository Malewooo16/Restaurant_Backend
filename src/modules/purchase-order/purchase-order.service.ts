import { Prisma, PurchaseOrderStatus } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

interface PurchaseOrderItemInput {
  inventoryItemId: number;
  quantityOrdered: number;
  unitPrice: number;
}

export const createPurchaseOrder = async (
  data: Omit<Prisma.PurchaseOrderCreateInput, 'items'>, // Exclude 'items' from data as we handle them separately
  items: PurchaseOrderItemInput[]
) => {
  return prisma.$transaction(async (tx) => {
    const purchaseOrder = await tx.purchaseOrder.create({
      data: {
        ...data,
        items: {
          create: items.map(item => ({
            inventoryItem: { connect: { id: item.inventoryItemId } },
            quantityOrdered: item.quantityOrdered,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return purchaseOrder;
  });
};

export const getAllPurchaseOrders = async () => {
  return prisma.purchaseOrder.findMany({
    include: {
      supplier: true,
      items: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });
};

export const getPurchaseOrderById = async (id: number) => {
  return prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      supplier: true,
      items: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });
};

export const updatePurchaseOrder = async (
  id: number,
  data: Omit<Prisma.PurchaseOrderUpdateInput, 'items'>, // Exclude 'items' from data as we handle them separately
  items: PurchaseOrderItemInput[]
) => {
  return prisma.$transaction(async (tx) => {
    // Delete existing purchase order items
    await tx.purchaseOrderItem.deleteMany({
      where: { purchaseOrderId: id },
    });

    const purchaseOrder = await tx.purchaseOrder.update({
      where: { id },
      data: {
        ...data,
        items: {
          create: items.map(item => ({
            inventoryItem: { connect: { id: item.inventoryItemId } },
            quantityOrdered: item.quantityOrdered,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return purchaseOrder;
  });
};

export const deletePurchaseOrder = async (id: number) => {
  return prisma.purchaseOrder.delete({
    where: { id },
  });
};
