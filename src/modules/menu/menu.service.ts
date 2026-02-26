import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";


export const getAllMenuItems = async () => {
  return prisma.menuItem.findMany({
    where:{
      name:{
        mode:"insensitive"
      }
    },
    include: {
      addons: true,
      sideDishes: true,
      menuCategory: true,
    },
    orderBy:{
      name:"asc"
    }
  });
};

export const getMenuItemById = async (id: number) => {
  return prisma.menuItem.findUnique({
    where: { id },
    include: {
      addons: true,
      sideDishes: true,
      menuCategory: true,
    },
  });
};

export const createMenuItem = async (
  data: Prisma.MenuItemCreateInput & { addonIds?: number[]; sideDishIds?: number[]; categoryId: number },
  userId: number
) => {
  const { addonIds, sideDishIds, categoryId, ...menuItemData } = data;

  const nameExists = await prisma.menuItem.findFirst({
    where: { name: menuItemData.name },
  });
  if (nameExists) {
    throw new Error('Menu item with this name already exists');
  }

  return prisma.menuItem.create({
    data: {
      ...menuItemData,
      createdBy: { connect: { id: userId } },
      updatedBy: { connect: { id: userId } },
      menuCategory: {
        connect: { id: categoryId },
      },
      addons: {
        connect: addonIds?.map((id) => ({ id })),
      },
      sideDishes: {
        connect: sideDishIds?.map((id) => ({ id })),
      },
    },
    include: {
      addons: true,
      sideDishes: true,
      menuCategory: true,
    },
  });
};

export const updateMenuItem = async (
  id: number,
  data: Prisma.MenuItemUpdateInput & { addonIds?: number[]; sideDishIds?: number[]; categoryId?: number },
  userId: number
) => {
  const { addonIds, sideDishIds, categoryId, ...menuItemData } = data;

  if (typeof menuItemData.name === 'string') {
    const nameExists = await prisma.menuItem.findFirst({
      where: {
        name: menuItemData.name,
        NOT: {
          id,
        },
      },
    });
    if (nameExists) {
      throw new Error('Menu item with this name already exists');
    }
  }

  // Disconnect existing relations before connecting new ones if addonIds or sideDishIds are provided
  const disconnectAddons = addonIds ? { set: [] } : undefined;
  const disconnectSideDishes = sideDishIds ? { set: [] } : undefined;

  return prisma.menuItem.update({
    where: { id },
    data: {
      ...menuItemData,
      updatedBy: { connect: { id: userId } },
      menuCategory: categoryId ? { connect: { id: categoryId } } : undefined,
      addons: {
        ...disconnectAddons,
        connect: addonIds?.map((id) => ({ id })),
      },
      sideDishes: {
        ...disconnectSideDishes,
        connect: sideDishIds?.map((id) => ({ id })),
      },
    },
    include: {
      addons: true,
      sideDishes: true,
      menuCategory: true,
    },
  });
};

export const deleteMenuItem = async (id: number) => {
  return prisma.menuItem.delete({
    where: { id },
  });
};

// MenuAddon Services
export const createMenuAddon = async (data: Prisma.MenuAddonCreateInput, userId: number) => {
  const nameExists = await prisma.menuAddon.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Menu addon with this name already exists');
  }
  return prisma.menuAddon.create({
    data: {
      ...data,
      createdBy: { connect: { id: userId } },
      updatedBy: { connect: { id: userId } },
    },
  });
};

export const getAllMenuAddons = async () => {
  return prisma.menuAddon.findMany();
};

export const getMenuAddonById = async (id: number) => {
  return prisma.menuAddon.findUnique({ where: { id } });
};

export const updateMenuAddon = async (
  id: number,
  data: Prisma.MenuAddonUpdateInput,
  userId: number
) => {
  if (typeof data.name === 'string') {
    const nameExists = await prisma.menuAddon.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });
    if (nameExists) {
      throw new Error('Menu addon with this name already exists');
    }
  }
  return prisma.menuAddon.update({
    where: { id },
    data: {
      ...data,
      updatedBy: { connect: { id: userId } },
    },
  });
};

export const deleteMenuAddon = async (id: number) => {
  return prisma.menuAddon.delete({ where: { id } });
};

// MenuSideDish Services
export const createMenuSideDish = async (data: Prisma.MenuSideDishCreateInput, userId: number) => {
  const nameExists = await prisma.menuSideDish.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Menu side dish with this name already exists');
  }
  return prisma.menuSideDish.create({
    data: {
      ...data,
      createdBy: { connect: { id: userId } },
      updatedBy: { connect: { id: userId } },
    },
  });
};

export const getAllMenuSideDishes = async () => {
  return prisma.menuSideDish.findMany();
};

export const getMenuSideDishById = async (id: number) => {
  return prisma.menuSideDish.findUnique({ where: { id } });
};

export const updateMenuSideDish = async (
  id: number,
  data: Prisma.MenuSideDishUpdateInput,
  userId: number
) => {
  if (typeof data.name === 'string') {
    const nameExists = await prisma.menuSideDish.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });
    if (nameExists) {
      throw new Error('Menu side dish with this name already exists');
    }
  }
  return prisma.menuSideDish.update({
    where: { id },
    data: {
      ...data,
      updatedBy: { connect: { id: userId } },
    },
  });
};

export const deleteMenuSideDish = async (id: number) => {
  return prisma.menuSideDish.delete({ where: { id } });
};

// MenuCategory Services
export const createMenuCategory = async (data: Prisma.MenuCategoryCreateInput, userId: number) => {
  const nameExists = await prisma.menuCategory.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Menu category with this name already exists');
  }
  return prisma.menuCategory.create({
    data: {
      ...data,
      createdBy: { connect: { id: userId } },
      updatedBy: { connect: { id: userId } },
    },
  });
};

export const getAllMenuCategories = async () => {
  return prisma.menuCategory.findMany();
};

export const getMenuCategoryById = async (id: number) => {
  return prisma.menuCategory.findUnique({ where: { id } });
};

export const updateMenuCategory = async (
  id: number,
  data: Prisma.MenuCategoryUpdateInput,
  userId: number
) => {
  if (typeof data.name === 'string') {
    const nameExists = await prisma.menuCategory.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });
    if (nameExists) {
      throw new Error('Menu category with this name already exists');
    }
  }
  return prisma.menuCategory.update({
    where: { id },
    data: {
      ...data,
      updatedBy: { connect: { id: userId } },
    },
  });
};

export const deleteMenuCategory = async (id: number) => {
  return prisma.menuCategory.delete({ where: { id } });
};
