import {
  Prisma,
  OrderStatus,
  KitchenOrderStatus,
  BarOrderStatus,
} from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

export const createOrder = async (
  data: Prisma.OrderCreateInput,
  orderItems: { menuItemId: number; quantity: number; notes?: string }[]
) => {
  let total = 0;
  const kitchenOrderItems: any[] = [];
  const barOrderItems: any[] = [];

  const orderItemData = await Promise.all(
    orderItems.map(async (item) => {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });
      if (!menuItem) {
        throw new Error(`Menu item with id ${item.menuItemId} not found`);
      }
      total += menuItem.price * item.quantity;
      const orderItem = {
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes,
        prepArea: menuItem.prepArea,
        menuItem: {
          connect: {
            id: menuItem.id,
          },
        },
      };

      if (menuItem.prepArea === "KITCHEN") {
        kitchenOrderItems.push(orderItem);
      } else if (menuItem.prepArea === "BAR") {
        barOrderItems.push(orderItem);
      }
      return orderItem;
    })
  );

  const orderNumber = (await prisma.order.count()) + 1000;

  return prisma.order.create({
    data: {
      ...data,
      total,
      orderNumber,
      orderItems: {
        create: orderItemData,
      },
      kitchenOrder:
        kitchenOrderItems.length > 0
          ? {
              create: {},
            }
          : undefined,
      barOrder:
        barOrderItems.length > 0
          ? {
              create: {},
            }
          : undefined,
    },
    include: {
      orderItems: true,
      kitchenOrder: true,
      barOrder: true,
    },
  });
};

export const getAllOrders = () => {
  return prisma.order.findMany({
    include: {
      orderItems: true,
      kitchenOrder: true,
      barOrder: true,
    },
  });
};

export const getOrderById = (id: number) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: true,
      kitchenOrder: true,
      barOrder: true,
    },
  });
};

export const updateOrder = (id: number, data: Prisma.OrderUpdateInput) => {
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
      items: true,
      order: true, // Include the parent order to verify the status filtering
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
      items: true,
      order: true, // Include the parent order to verify the status filtering
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
  return prisma.order.findMany({
    where: {
      status: {
        notIn: [OrderStatus.PAID, OrderStatus.CANCELLED],
      },
    },
    include: {
      orderItems: true,
      kitchenOrder: true,
      barOrder: true,
    },
  });
};
