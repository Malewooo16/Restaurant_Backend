import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const getAllInventoryAdjustments = async (inventoryItemId?: number, batchId?: number, fromDate?: Date, toDate?: Date) => {
  return prisma.inventoryAdjustment.findMany({
    where: {
      ...(inventoryItemId && { inventoryItemId }),
      ...(batchId && { batchId }),
      ...(fromDate && toDate && {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      }),
    },
    include: {
      inventoryItem: true,
      batch: true,
      adjustmentReason: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getInventoryAdjustmentById = async (id: number) => {
  return prisma.inventoryAdjustment.findUnique({
    where: { id },
    include: {
      inventoryItem: true,
      batch: true,
      adjustmentReason: true,
    },
  });
};

export const createInventoryAdjustment = async (data: {
  inventoryItemId: number;
  adjustmentReasonId: number;
  adjustmentType: string;
  quantity: number;
  batchId?: number;
  notes?: string;
  adjustedBy?: string;
}) => {
  const { inventoryItemId, adjustmentReasonId, adjustmentType, quantity, batchId, notes, adjustedBy } = data;

  // Get the inventory item with current quantity
  const inventoryItem = await prisma.inventoryItem.findUnique({
    where: { id: inventoryItemId },
  });

  if (!inventoryItem) {
    throw new Error('Inventory item not found');
  }

  const previousQuantity = inventoryItem.quantity;
  let newQuantity: number;
  let batch = null;

  // If decreasing and batchId is provided, check batch quantity
  if (adjustmentType === 'decrease' && batchId) {
    batch = await prisma.batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) {
      throw new Error('Batch not found');
    }

    if (batch.quantity < quantity) {
      throw new Error(`Insufficient batch quantity. Available: ${batch.quantity}, Requested: ${quantity}`);
    }

    // Update batch quantity
    await prisma.batch.update({
      where: { id: batchId },
      data: { quantity: batch.quantity - quantity },
    });
  }

  // Calculate new quantity for inventory item
  if (adjustmentType === 'increase') {
    newQuantity = previousQuantity + quantity;
  } else if (adjustmentType === 'decrease') {
    if (previousQuantity < quantity) {
      throw new Error(`Insufficient inventory quantity. Available: ${previousQuantity}, Requested: ${quantity}`);
    }
    newQuantity = previousQuantity - quantity;
  } else {
    throw new Error('Invalid adjustment type');
  }

  // Generate adjustment number
  const count = await prisma.inventoryAdjustment.count();
  const adjustmentNumber = `ADJ-${String(count + 1).padStart(6, '0')}`;

  // Create the adjustment record
  const adjustment = await prisma.inventoryAdjustment.create({
    data: {
      adjustmentNumber,
      inventoryItemId,
      batchId,
      adjustmentReasonId,
      adjustmentType,
      quantity,
      previousQuantity,
      newQuantity,
      notes,
      adjustedBy,
    },
  });

  // Update inventory item quantity
  await prisma.inventoryItem.update({
    where: { id: inventoryItemId },
    data: { quantity: newQuantity },
  });

  // Create inventory transaction record
  await prisma.inventoryTransaction.create({
    data: {
      itemId: inventoryItemId,
      quantity: adjustmentType === 'increase' ? quantity : -quantity,
      transactionType: 'ADJUSTMENT',
      reference: adjustmentNumber,
      notes: notes || `Adjustment: ${adjustmentType}`,
    },
  });

  return prisma.inventoryAdjustment.findUnique({
    where: { id: adjustment.id },
    include: {
      inventoryItem: true,
      batch: true,
      adjustmentReason: true,
    },
  });
};