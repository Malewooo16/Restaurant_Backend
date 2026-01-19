import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";


export const getAllMenuItems = async () => {
  return prisma.menuItem.findMany();
};

export const getMenuItemById = async (id: number) => {
  return prisma.menuItem.findUnique({
    where: { id },
  });
};

export const createMenuItem = async (data: Prisma.MenuItemCreateInput) => {
 
  const nameExists = await prisma.menuItem.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Menu item with this name already exists');
  }
  return prisma.menuItem.create({
    data,
  });
};

export const updateMenuItem = async (
  id: number,
  data: Prisma.MenuItemUpdateInput
) => {
  if (typeof data.name === 'string') {
    const nameExists = await prisma.menuItem.findFirst({
      where: {
        name: data.name,
        NOT: {
          id,
        },
      },
    });
    if (nameExists) {
      throw new Error('Menu item with this name already exists');
    }
  }
  return prisma.menuItem.update({
    where: { id },
    data,
  });
};

export const deleteMenuItem = async (id: number) => {
  return prisma.menuItem.delete({
    where: { id },
  });
};
