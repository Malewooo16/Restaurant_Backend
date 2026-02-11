import { Prisma, PurchaseOrderStatus } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

interface PurchaseOrderItemInput {
  inventoryItemId: number;
  quantityOrdered: number;
  unitPrice: number;
}

// Helper function to generate unique PO number
async function generatePONumber(tx: Prisma.TransactionClient): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const candidate = `PO-${year}${month}${day}-${random}`;
  
  // Check if it exists, if so, generate a new one
  const existing = await tx.purchaseOrder.findFirst({
    where: { poNumber: candidate },
  });
  
  if (existing) {
    // Try again with different random
    const newRandom = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PO-${year}${month}${day}-${newRandom}`;
  }
  return candidate;
}

export const createPurchaseOrder = async (
  data: Omit<Prisma.PurchaseOrderCreateInput, 'items' | 'poNumber'>, // Exclude 'items' and 'poNumber' as we handle them separately
  items: PurchaseOrderItemInput[]
) => {
  return prisma.$transaction(async (tx) => {
    // Auto-generate PO number if not provided
    const poNumber = (data as any).poNumber || await generatePONumber(tx);
    
    const purchaseOrder = await tx.purchaseOrder.create({
      data: {
        ...data,
        poNumber,
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

export const getAllPurchaseOrders = async (
  status?: string,
  startDate?: string,
  endDate?: string
) => {
  // Build date filter using local dates (not UTC) to match calendar selection
  let dateFilter = {};
  if (startDate || endDate) {
    // Use local time by appending time without 'Z' suffix
    const start = startDate ? new Date(`${startDate}T00:00:00`) : undefined;
    const end = endDate ? new Date(`${endDate}T23:59:59.999`) : undefined;
    
    if (start && end) {
      dateFilter = {
        orderedAt: {
          gte: start,
          lte: end,
        },
      };
    } else if (start) {
      dateFilter = {
        orderedAt: {
          gte: start,
        },
      };
    } else if (end) {
      dateFilter = {
        orderedAt: {
          lte: end,
        },
      };
    }
  }

  return prisma.purchaseOrder.findMany({
    where: {
      status: status as PurchaseOrderStatus || undefined,
      ...dateFilter,
    },
    include: {
      supplier: true,
      items: {
        include: {
          inventoryItem: true,
        },
      },
    },
    orderBy: {
      orderedAt: 'desc',
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

export const approvePurchaseOrder = async (id: number) => {
  return prisma.purchaseOrder.update({
    where: { id },
    data: {
      status: 'APPROVED',
    },
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

export const rejectPurchaseOrder = async (id: number, reason?: string) => {
  return prisma.purchaseOrder.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      notes: reason ? `${reason}` : undefined,
    },
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

export const markPartiallyReceived = async (id: number) => {
  return prisma.purchaseOrder.update({
    where: { id },
    data: {
      status: 'PARTIALLY_RECEIVED',
    },
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

export const markCompleted = async (id: number) => {
  return prisma.purchaseOrder.update({
    where: { id },
    data: {
      status: 'COMPLETED',
    },
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
