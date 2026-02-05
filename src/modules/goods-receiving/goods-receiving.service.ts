import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

interface GoodsReceivingItemInput {
  inventoryItemId: number;
  quantityReceived: number;
  batchNumber?: string; // Optional batch number for creating a new batch
  expiryDate?: Date;    // Optional expiry date for creating a new batch
}

// Helper function to update purchase order status based on received quantities
async function updatePurchaseOrderStatus(tx: Prisma.TransactionClient, purchaseOrderId: number) {
  // Get all goods receiving items for this PO
  const allReceivings = await tx.goodsReceiving.findMany({
    where: { purchaseOrderId },
    include: {
      receivedItems: true,
    },
  });

  // Get the purchase order items
  const purchaseOrder = await tx.purchaseOrder.findUnique({
    where: { id: purchaseOrderId },
    include: { items: true },
  });

  if (!purchaseOrder) return;

  // Calculate total received per item
  const receivedByItem: Record<number, number> = {};
  allReceivings.forEach(gr => {
    gr.receivedItems.forEach(item => {
      receivedByItem[item.inventoryItemId] = (receivedByItem[item.inventoryItemId] || 0) + item.quantityReceived;
    });
  });

  // Check if all items are fully received
  let allReceived = true;
  let anyReceived = false;

  for (const poItem of purchaseOrder.items) {
    const received = receivedByItem[poItem.inventoryItemId] || 0;
    if (received >= poItem.quantityOrdered) {
      anyReceived = true;
    } else {
      allReceived = false;
    }
  }

  // Update PO status
  const newStatus = allReceived ? 'COMPLETED' as const : anyReceived ? 'PARTIALLY_RECEIVED' as const : 'ORDERED' as const;
  
  await tx.purchaseOrder.update({
    where: { id: purchaseOrderId },
    data: { status: newStatus },
  });
}

// Helper function to generate unique GRN number
async function generateGRNNumber(tx: Prisma.TransactionClient): Promise<string> {
  const timestamp = Date.now().toString(36).toUpperCase().replace(/^0+/, '');
  const prefix = 'GRN';
  const candidate = `${prefix}-${timestamp}`;
  
  // Check if it exists, if so, append a random suffix
  const existing = await tx.goodsReceiving.findFirst({
    where: { grnNumber: candidate },
  });
  
  if (existing) {
    return `${candidate}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  }
  return candidate;
}

export const createGoodsReceiving = async (
  data: Omit<Prisma.GoodsReceivingCreateInput, 'receivedItems'>,
  receivedItems: GoodsReceivingItemInput[]
) => {
  return prisma.$transaction(async (tx) => {
    // Auto-generate GRN number if not provided
    const grnNumber = data.grnNumber || await generateGRNNumber(tx);
    
    const goodsReceiving = await tx.goodsReceiving.create({
      data: {
        ...data,
        grnNumber,
        receivedItems: {
          create: await Promise.all(receivedItems.map(async (item) => {
            const receivedItemData: Prisma.GoodsReceivingItemCreateWithoutGoodsReceivingInput = {
              inventoryItem: { connect: { id: item.inventoryItemId } },
              quantityReceived: item.quantityReceived,
            };

            // If expiryDate is provided, create a new batch and link it
            if (item.expiryDate || item.batchNumber) {
              const newBatch = await tx.batch.create({
                data: {
                  inventoryItem: { connect: { id: item.inventoryItemId } },
                  quantity: item.quantityReceived, // Initial quantity of the batch is what's received
                  batchNumber: item.batchNumber || `AUTO_BATCH_${Date.now()}`, // Generate if not provided
                  expiryDate: item.expiryDate,
                  receivedAt: (data as any).receivedAt || new Date(),
                },
              });
              receivedItemData.batch = { connect: { id: newBatch.id } };
            }

            // Update inventoryItem quantity
            await tx.inventoryItem.update({
              where: { id: item.inventoryItemId },
              data: {
                quantity: {
                  increment: item.quantityReceived,
                },
              },
            });
            // TODO: Create InventoryTransaction

            return receivedItemData;
          })),
        },
      },
      include: {
        receivedItems: true,
      },
    });

    // Auto-update PO status if this GRN is linked to a PO
    if ((data as any).purchaseOrderId) {
      await updatePurchaseOrderStatus(tx, (data as any).purchaseOrderId);
    }

    return goodsReceiving;
  });
};

export const getAllGoodsReceiving = async () => {
  return prisma.goodsReceiving.findMany({
    include: {
      supplier: true,
      purchaseOrder: true,
      receivedItems: {
        include: {
          inventoryItem: true,
          batch: true,
        },
      },
    },
  });
};

export const getGoodsReceivingByPurchaseOrderId = async (purchaseOrderId: number) => {
  return prisma.goodsReceiving.findMany({
    where: { purchaseOrderId },
    include: {
      supplier: true,
      purchaseOrder: true,
      receivedItems: {
        include: {
          inventoryItem: true,
          batch: true,
        },
      },
    },
  });
};

export const getGoodsReceivingById = async (id: number) => {
  return prisma.goodsReceiving.findUnique({
    where: { id },
    include: {
      supplier: true,
      purchaseOrder: true,
      receivedItems: {
        include: {
          inventoryItem: true,
          batch: true,
        },
      },
    },
  });
};

export const updateGoodsReceiving = async (
  id: number,
  data: Omit<Prisma.GoodsReceivingUpdateInput, 'receivedItems'>,
  receivedItems: GoodsReceivingItemInput[]
) => {
  return prisma.$transaction(async (tx) => {
    // Before updating, we need to revert previous inventory changes and batch quantities
    // This is complex and requires careful consideration of what was previously received.
    // For simplicity in this initial implementation, we'll assume received items are just replaced,
    // and inventory/batch adjustments are not automatically rolled back.
    // A full implementation would involve:
    // 1. Fetching old receivedItems.
    // 2. Decrementing inventory quantities and adjusting batch quantities.
    // 3. Creating "negative" inventory transactions.

    // Delete existing goods receiving items
    await tx.goodsReceivingItem.deleteMany({
      where: { goodsReceivingId: id },
    });
    // TODO: Consider how to handle batches if old items are deleted. Should batches be deleted too?
    // For now, batches created are independent. If GRN item is deleted, batch remains.

    const goodsReceiving = await tx.goodsReceiving.update({
      where: { id },
      data: {
        ...data,
        receivedItems: {
          create: await Promise.all(receivedItems.map(async (item) => {
            const receivedItemData: Prisma.GoodsReceivingItemCreateWithoutGoodsReceivingInput = {
              inventoryItem: { connect: { id: item.inventoryItemId } },
              quantityReceived: item.quantityReceived,
            };

            if (item.expiryDate || item.batchNumber) {
              const newBatch = await tx.batch.create({
                data: {
                  inventoryItem: { connect: { id: item.inventoryItemId } },
                  quantity: item.quantityReceived,
                  batchNumber: item.batchNumber || `AUTO_BATCH_${Date.now()}`,
                  expiryDate: item.expiryDate,
                  receivedAt: (data as any).receivedAt || new Date(),
                },
              });
              receivedItemData.batch = { connect: { id: newBatch.id } };
            }
            
            // Update inventoryItem quantity
            await tx.inventoryItem.update({
              where: { id: item.inventoryItemId },
              data: {
                quantity: {
                  increment: item.quantityReceived,
                },
              },
            });
            // TODO: Create InventoryTransaction
            // This would increment for new items, but the old ones were not decremented above.
            // This highlights the complexity of updates with inventory.

            return receivedItemData;
          })),
        },
      },
      include: {
        receivedItems: true,
      },
    });
    return goodsReceiving;
  });
};

export const deleteGoodsReceiving = async (id: number) => {
  return prisma.goodsReceiving.delete({
    where: { id },
  });
};
