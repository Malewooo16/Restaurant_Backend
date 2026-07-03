
import {
  Prisma,
  OrderStatus,
  OrderItemStatus,
  KitchenOrderStatus,
  BarOrderStatus,
  TableStatus,
} from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";


const getTodayOrders = async () => {
  const todayUTC = new Date().toISOString().slice(0, 10); // "2026-01-07"

  const start = new Date(`${todayUTC}T00:00:00.000Z`);
  const end = new Date(`${todayUTC}T23:59:59.999Z`);

  return prisma.order.count({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });
};


export const createOrder = async (
  data: Prisma.OrderCreateInput & { tableId?: number; tableNumber?: number },
  orderItems: {
    menuItemId: number;
    quantity: number;
    notes?: string;
    selectedSideDishes?: number[];
    selectedAddons?: number[];
  }[]
) => {
  let total = 0;

  const orderItemCreateInputs = await Promise.all(
    orderItems.map(async (item) => {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
        include: { sideDishes: true, addons: true },
      });
      if (!menuItem) {
        throw new Error(`Menu item with id ${item.menuItemId} not found`);
      }

      if (item.selectedSideDishes && item.selectedSideDishes.length > 0) {
        if (!menuItem.requiresSideDish) {
          throw new Error(`Menu item ${menuItem.name} does not support side dishes`);
        }
        const availableSideDishIds = menuItem.sideDishes.map((sd) => sd.id);
        const invalidSideDishes = item.selectedSideDishes.filter(
          (id) => !availableSideDishIds.includes(id)
        );
        if (invalidSideDishes.length > 0) {
          throw new Error(`Side dish(es) ${invalidSideDishes.join(", ")} are not available for ${menuItem.name}`);
        }
      }

      if (item.selectedAddons && item.selectedAddons.length > 0) {
        if (!menuItem.hasAddons) {
          throw new Error(`Menu item ${menuItem.name} does not support addons`);
        }
        const availableAddonIds = menuItem.addons.map((addon) => addon.id);
        const invalidAddons = item.selectedAddons.filter(
          (id) => !availableAddonIds.includes(id)
        );
        if (invalidAddons.length > 0) {
          throw new Error(`Addon(s) ${invalidAddons.join(", ")} are not available for ${menuItem.name}`);
        }
      }

      let itemTotal = menuItem.price;

      if (item.selectedSideDishes && item.selectedSideDishes.length > 0) {
        const sideDishes = await prisma.menuSideDish.findMany({
          where: { id: { in: item.selectedSideDishes } },
        });
        itemTotal += sideDishes.reduce((sum, sd) => sum + sd.price, 0);
      }

      if (item.selectedAddons && item.selectedAddons.length > 0) {
        const addons = await prisma.menuAddon.findMany({
          where: { id: { in: item.selectedAddons } },
        });
        itemTotal += addons.reduce((sum, addon) => sum + addon.price, 0);
      }

      total += itemTotal * item.quantity;

      return {
        quantity: item.quantity,
        price: itemTotal,
        notes: item.notes,
        prepArea: menuItem.prepArea,
        menuItem: { connect: { id: menuItem.id } },
        selectedSideDishes: item.selectedSideDishes,
        selectedAddons: item.selectedAddons,
      };
    })
  );

  const todaysOrders = await getTodayOrders();
  const orderNumber = todaysOrders + 1;

  // Find table info before transaction
  let tableId: number | undefined;
  let tableNumber: number | undefined;
  if (data.tableId) {
    tableId = data.tableId;
  } else if (data.tableNumber) {
    const table = await prisma.table.findUnique({
      where: { number: data.tableNumber },
    });
    if (table) {
      tableId = table.id;
    }
  }

  if (tableId) {
    const table = await prisma.table.findUnique({
      where: { id: tableId },
    });
    if (table) {
      tableNumber = table.number;
    }
  }

  const { tableId: _tableId, ...orderData } = data;

  return prisma.$transaction(async (tx) => {
    // Update table status to OCCUPIED if tableId exists
    // if (tableId) {
    //   await tx.table.update({
    //     where: { id: tableId },
    //     data: { status: TableStatus.OCCUPIED },
    //   });
    // }

    // Create the order with items
    const order = await tx.order.create({
      data: {
        ...orderData,
        tableNumber,
        total,
        orderNumber,
        orderItems: {
          create: orderItemCreateInputs,
        },
      },
      include: {
        orderItems: true,
      },
    });

    const kitchenItemIds = order.orderItems
      .filter((item) => item.prepArea === "KITCHEN")
      .map((item) => ({ id: item.id }));

    const barItemIds = order.orderItems
      .filter((item) => item.prepArea === "BAR")
      .map((item) => ({ id: item.id }));

    // Create kitchen order if needed
    if (kitchenItemIds.length > 0) {
      const kitchenOrder = await tx.kitchenOrder.create({
        data: {
          orderId: order.id,
          items: {
            connect: kitchenItemIds,
          },
        },
        include: { items: true },
      });
      
      // Update items with kitchenOrderId
      await tx.orderItem.updateMany({
        where: { id: { in: kitchenItemIds.map(i => i.id) } },
        data: { kitchenOrderId: kitchenOrder.id },
      });
    }

    // Create bar order if needed
    if (barItemIds.length > 0) {
      const barOrder = await tx.barOrder.create({
        data: {
          orderId: order.id,
          items: {
            connect: barItemIds,
          },
        },
        include: { items: true },
      });
      
      // Update items with barOrderId
      await tx.orderItem.updateMany({
        where: { id: { in: barItemIds.map(i => i.id) } },
        data: { barOrderId: barOrder.id },
      });
    }

    // Return the complete order
    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            menuItem: { select: { name: true, id: true } },
          },
        },
        kitchenOrder: { include: { items: true } },
        barOrder: { include: { items: true } },
      },
    });
  }, {maxWait: 5000, timeout: 15000});
};

interface GetOrdersParams {
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const getAllOrders = (params?: GetOrdersParams) => {
  const where: any = {};

  // Add date range filter
  if (params?.startDate && params?.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    where.createdAt = {
      gte: start,
      lte: end,
    };
  } else if (params?.startDate) {
    const start = new Date(params.startDate);
    where.createdAt = {
      gte: start,
    };
  } else if (params?.endDate) {
    const end = new Date(params.endDate);
    where.createdAt = {
      lte: end,
    };
  }

  // Add status filter
  if (params?.status) {
    where.status = params.status;
  }

  return prisma.order.findMany({
    where,
    include: {
      orderItems:{
         include: {
          menuItem: {
            select: {
              name: true,
            },
          },
        },
      },
      kitchenOrder: true,
      barOrder: true,
      payments: true,
    },
    orderBy:{
      createdAt:"desc"
      }
  });
};

export const getOrderById = (id: number) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          menuItem: {
            select: {
              name: true,
            },
          },
        },
      },
      kitchenOrder: true,
      barOrder: true,
      payments: true,
    },
  });
};

export const updateOrder = async (
  id: number,
  data: Prisma.OrderUpdateInput
) => {
  return prisma.order.update({
    where: { id },
    data,
  });
};


export const deleteOrder = (id: number) => {
  return prisma.order.delete({
    where: { id },
  });
};

export const getAllKitchenOrders = () => {
  return prisma.kitchenOrder.findMany({
    where: {
      status: {
        notIn: [KitchenOrderStatus.READY, KitchenOrderStatus.CANCELLED],
      },
    },
    include: {
      items: {
        include: {
          menuItem: {
            select: {
              name: true,
              id: true,
              hasAddons: true,
              requiresSideDish: true,
              addons: true,
              sideDishes: true,
            },
          },
        },
      },
      order: {
        include: {
          orderItems: {
            include: {
              menuItem: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy:{
      createdAt:"desc"
    }
  });
};

export const getAllKitchenOrdersWithDetails = async () => {
  return prisma.kitchenOrder.findMany({
    where: {
      status: {
        notIn: [KitchenOrderStatus.READY, KitchenOrderStatus.CANCELLED],
      },
    },
    include: {
      items: {
        include: {
          menuItem: {
            select: {
              name: true,
              id: true,
              hasAddons: true,
              requiresSideDish: true,
              addons: true,
              sideDishes: true,
            },
          },
        },
      },
      order: {
        include: {
          orderItems: {
            include: {
              menuItem: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const getAllBarOrders = () => {
  return prisma.barOrder.findMany({
    where: {
      status: {
        notIn: [BarOrderStatus.READY, BarOrderStatus.CANCELLED],
      },
    },
    include: {
      items: {
        include: {
          menuItem: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
      order: {
        include: {
          orderItems: {
            include: {
              menuItem: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy:{
      createdAt:"desc"
    }
  });
};

export const getKitchenOrderById = (id: number) => {
  return prisma.kitchenOrder.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });
};

export const getBarOrderById = (id: number) => {
  return prisma.barOrder.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });
};

export const updateKitchenOrderStatus = (
  id: number,
  data: Prisma.KitchenOrderUpdateInput
) => {
  return prisma.kitchenOrder.update({
    where: { id },
    data,
    include: {
      items: true,
    },
  });
};

export const updateBarOrderStatus = (
  id: number,
  data: Prisma.BarOrderUpdateInput
) => {
  return prisma.barOrder.update({
    where: { id },
    data,
    include: {
      items: true,
    },
  });
};

  export const updateOrderItemStatus = async (
    id: number,
    data: Prisma.OrderItemUpdateInput
  ) => {
    // Get the order item first to find order/kitchen/bar IDs
    const existingItem = await prisma.orderItem.findUnique({
      where: { id },
      select: {
        id: true,
        orderId: true,
        kitchenOrderId: true,
        barOrderId: true,
        status: true,
      },
    });

    if (!existingItem) {
      throw new Error('Order item not found');
    }

    // Check if the new status is CANCELLED (for special handling)
    const newStatus = data.status;
    let isCancelled = false;
    
    if (typeof newStatus === 'string') {
      // Plain string format: { status: "CANCELLED" }
      isCancelled = newStatus === OrderItemStatus.CANCELLED;
    } else if (typeof newStatus === 'object' && newStatus !== null && 'set' in newStatus) {
      // Prisma format: { status: { set: "CANCELLED" } }
      isCancelled = (newStatus as any).set === OrderItemStatus.CANCELLED;
    }

    // Check if the new status is PREPARING and update order status accordingly
    // Handle both plain string format (from HTTP request) and Prisma format (with { set: ... })
    let isPreparing = false;
    
    if (typeof newStatus === 'string') {
      // Plain string format: { status: "PREPARING" }
      isPreparing = newStatus === OrderItemStatus.PREPARING;
    } else if (typeof newStatus === 'object' && newStatus !== null && 'set' in newStatus) {
      // Prisma format: { status: { set: "PREPARING" } }
      isPreparing = (newStatus as any).set === OrderItemStatus.PREPARING;
    }

    // Update the order item status
    const orderItem = await prisma.orderItem.update({
      where: { id },
      data,
      include: {
        order: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    return prisma.$transaction(async (tx) => {
      // If an order item is being set to PREPARING, update the order status to IN_PROGRESS
      if (isPreparing && orderItem.order.status !== OrderStatus.IN_PROGRESS) {
        await tx.order.update({
          where: { id: orderItem.order.id },
          data: { status: OrderStatus.IN_PROGRESS },
        });
      }

      // Check and update kitchen order status if all items are ready/cancelled/served
      if (existingItem.kitchenOrderId) {
        const kitchenOrder = await tx.kitchenOrder.findUnique({
          where: { id: existingItem.kitchenOrderId },
          include: { items: { select: { status: true } } },
        });

        if (kitchenOrder) {
          const allItemsReady = kitchenOrder.items.every(
            (item) =>
              item.status === 'READY' ||
              item.status === 'CANCELLED' ||
              item.status === 'SERVED'
          );

          if (allItemsReady && kitchenOrder.status !== KitchenOrderStatus.READY) {
            await tx.kitchenOrder.update({
              where: { id: kitchenOrder.id },
              data: { status: KitchenOrderStatus.READY },
            });
          }
        }
      }

      // Check and update bar order status if all items are ready/cancelled/served
      if (existingItem.barOrderId) {
        const barOrder = await tx.barOrder.findUnique({
          where: { id: existingItem.barOrderId },
          include: { items: { select: { status: true } } },
        });

        if (barOrder) {
          const allItemsReady = barOrder.items.every(
            (item) =>
              item.status === 'READY' ||
              item.status === 'CANCELLED' ||
              item.status === 'SERVED'
          );

          if (allItemsReady && barOrder.status !== BarOrderStatus.READY) {
            await tx.barOrder.update({
              where: { id: barOrder.id },
              data: { status: BarOrderStatus.READY },
            });
          }
        }
      }

      // Check if main order should be completed by checking ALL order items for this order
      const allOrderItems = await tx.orderItem.findMany({
        where: { orderId: orderItem.orderId },
        select: { status: true, prepArea: true },
      });

      // Check if all items are ready, served, or cancelled
      const allItemsReadyOrServedOrCancelled = allOrderItems.every(
        (item) =>
          item.status === OrderItemStatus.READY ||
          item.status === OrderItemStatus.SERVED ||
          item.status === OrderItemStatus.CANCELLED
      );

      // Also check if there are any pending items
      const hasPendingItems = allOrderItems.some(
        (item) =>
          item.status === OrderItemStatus.PENDING ||
          item.status === OrderItemStatus.PREPARING
      );

      // Special case: If cancelling an item, check if ALL items are now cancelled
      if (isCancelled) {
        // Check if all items (including the one being cancelled) are CANCELLED
        const allItemsCancelled = allOrderItems.every(
          (item) => item.status === OrderItemStatus.CANCELLED
        );
        
        if (allItemsCancelled && orderItem.order.status !== OrderStatus.CANCELLED) {
          // Update the entire order to CANCELLED
          await tx.order.update({
            where: { id: orderItem.order.id },
            data: { status: OrderStatus.CANCELLED },
          });
        } else {
          // Check if remaining items (excluding cancelled) are all SERVED/READY
          const remainingItems = allOrderItems.filter(
            (item) => item.status !== OrderItemStatus.CANCELLED
          );
          
          const allRemainingServed = remainingItems.length > 0 && remainingItems.every(
            (item) => item.status === OrderItemStatus.READY
          );
          
          if (allRemainingServed && orderItem.order.status !== OrderStatus.COMPLETED) {
            await tx.order.update({
              where: { id: orderItem.order.id },
              data: { status: OrderStatus.COMPLETED },
            });
          }
        }
      } else if (allItemsReadyOrServedOrCancelled && !hasPendingItems && orderItem.order.status !== OrderStatus.COMPLETED) {
        await tx.order.update({
          where: { id: orderItem.order.id },
          data: { status: OrderStatus.COMPLETED },
        });
      }

      return orderItem;
    });
  };

export const getRecentOrders = () => {
  const todayUTC = new Date().toISOString().slice(0, 10); // "2026-01-07"

  const start = new Date(`${todayUTC}T00:00:00.000Z`);
  const end = new Date(`${todayUTC}T23:59:59.999Z`);

  return prisma.order.findMany({
    where: {
      status: {
        notIn: [OrderStatus.PAID, OrderStatus.CANCELLED],
      },
      createdAt:{
        gte: start,
        lte: end,
      }
    },
    include: {
      orderItems: {
         include: {
          menuItem: {
            select: {
              name: true,
            },
          },
        },
      },
      kitchenOrder: true,
      barOrder: true,
      payments: true,
    },
    orderBy:{
      createdAt:"desc"
    }
  });
};

