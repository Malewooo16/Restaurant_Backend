
import {
  Prisma,
  OrderStatus,
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

  return prisma.$transaction(async (tx) => {
    // Find table by tableId or tableNumber
    let tableId: number | undefined;
    if (data.tableId) {
      tableId = data.tableId;
    } else if (data.tableNumber) {
      const table = await tx.table.findUnique({
        where: { number: data.tableNumber },
      });
      if (table) {
        tableId = table.id;
      }
    }

    // Set tableNumber from the found table
    let tableNumber: number | undefined;
    if (tableId) {
      const table = await tx.table.findUnique({
        where: { id: tableId },
      });
      if (table) {
        tableNumber = table.number;
        // Update table status to OCCUPIED
        await tx.table.update({
          where: { id: tableId },
          data: { status: TableStatus.OCCUPIED },
        });
      }
    }

    const { tableId: _tableId, ...orderData } = data;
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

    if (kitchenItemIds.length > 0) {
      await tx.order.update({
        where: { id: order.id },
        data: {
          kitchenOrder: {
            create: {
              items: {
                connect: kitchenItemIds,
              },
            },
          },
        },
      });
    }

    if (barItemIds.length > 0) {
      await tx.order.update({
        where: { id: order.id },
        data: {
          barOrder: {
            create: {
              items: {
                connect: barItemIds,
              },
            },
          },
        },
      });
    }

    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: true,
        kitchenOrder: { include: { items: true } },
        barOrder: { include: { items: true } },
      },
    });
  });
};

export const getAllOrders = () => {
  return prisma.order.findMany({
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
    },
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

export const updateOrderItemStatus = (
  id: number,
  data: Prisma.OrderItemUpdateInput
) => {
  return prisma.orderItem.update({
    where: { id },
    data,
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
    },
  });
};

