import { Departments, Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

export const getAllStockRequests = async (
  department?: string,
  status?: string,
  startDate?: string,
  endDate?: string
) => {
  // Build date filter
  let dateFilter = {};
  if (startDate || endDate) {
    // Parse dates directly - ISO strings from frontend include timezone info
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    if (start && end) {
      dateFilter = {
        requestedAt: {
          gte: start,
          lte: end,
        },
      };
    } else if (start) {
      dateFilter = {
        requestedAt: {
          gte: start,
        },
      };
    } else if (end) {
      dateFilter = {
        requestedAt: {
          lte: end,
        },
      };
    }
  }

  return prisma.stockRequest.findMany({
    where: {
      requestedFrom: department ? (department.toUpperCase() as Departments) : undefined,
      status: status || undefined,
      ...dateFilter,
    },
    include: {
      requestItems: {
        include: {
          item: true,
        },
      },
    },
    orderBy: {
      requestedAt: 'desc',
    },
  });
};

export const createStockRequest = async (data: any) => {
  const { requestItems, ...rest } = data;
  const requestId = `SR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Ensure status is always 'pending' when creating - cannot start as 'fulfilled'
  const status = rest.status === 'fulfilled' ? 'pending' : (rest.status || 'pending');

  return prisma.stockRequest.create({
    data: {
      ...rest,
      requestId,
      status,
      requestItems: {
        create: requestItems,
      },
    },
    include: {
      requestItems: true,
    },
  });
};

export const updateStockRequestStatus = async (id: number, status: string) => {
  const stockRequest = await prisma.stockRequest.findUnique({
    where: { id },
    include: {
      requestItems: {
        include: {
          item: true,
        },
      },
    },
  });

  if (!stockRequest) {
    throw new Error('Stock Request not found');
  }

  const currentStatus = stockRequest.status;

  if (currentStatus === 'fulfilled' || currentStatus === 'rejected') {
    throw new Error(`Stock Request is already ${currentStatus} and cannot be updated.`);
  }

  // Allow status update to approved or rejected regardless of current status (unless fulfilled/rejected)
  if (status === 'approved') {
    const department = stockRequest.requestedFrom;
    if (!department) {
      throw new Error('RequestedFrom department is not specified for the stock request.');
    }

    // Validate that requested quantities don't exceed available main inventory
    for (const requestItem of stockRequest.requestItems) {
      const inventoryItem = await prisma.inventoryItem.findUnique({
        where: { id: requestItem.itemId },
      });

      if (!inventoryItem) {
        throw new Error(`Item with ID ${requestItem.itemId} not found`);
      }

      if (requestItem.quantity > inventoryItem.quantity) {
        throw new Error(
          `Requested quantity (${requestItem.quantity}) for "${inventoryItem.name}" exceeds available stock (${inventoryItem.quantity})`
        );
      }
    }

    // Process all inventory updates in a single transaction
    await prisma.$transaction(async (tx) => {
      // Update the StockRequest status to approved
      await tx.stockRequest.update({
        where: { id },
        data: { status: 'approved', approvedAt: new Date() },
      });

      // Process each item
      for (const requestItem of stockRequest.requestItems) {
        // Decrease main InventoryItem quantity
        await tx.inventoryItem.update({
          where: { id: requestItem.itemId },
          data: {
            quantity: {
              decrement: requestItem.quantity,
            },
          },
        });

        // Use upsert for DepartmentInventory - more efficient
        await tx.departmentInventory.upsert({
          where: {
            inventoryItemId_department: {
              inventoryItemId: requestItem.itemId,
              department: department,
            },
          },
          update: {
            quantity: {
              increment: requestItem.quantity,
            },
          },
          create: {
            inventoryItemId: requestItem.itemId,
            department: department,
            quantity: requestItem.quantity,
          },
        });
      }
    });

    // After successful transaction, set stock request status to 'fulfilled'
    return prisma.stockRequest.update({
      where: { id },
      data: { status: 'fulfilled', fulfilledAt: new Date() },
      include: {
        requestItems: {
          include: {
            item: true,
          },
        },
      },
    });

  } else if (status === 'rejected') {
    return prisma.stockRequest.update({
      where: { id },
      data: { status: 'rejected' },
      include: {
        requestItems: {
          include: {
            item: true,
          },
        },
      },
    });
  } else {
    // If status is neither approved nor rejected, just update the status as provided.
    return prisma.stockRequest.update({
      where: { id },
      data: { status: status },
      include: {
        requestItems: {
          include: {
            item: true,
          },
        },
      },
    });
  }
};
