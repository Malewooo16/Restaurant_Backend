import { prisma } from "../../../lib/prisma";

export const getAllUserGroups = async () => {
  return prisma.userGroup.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
      _count: {
        select: { users: true },
      },
    },
    orderBy: { name: 'asc' },
  });
};

export const getUserGroupById = async (id: number) => {
  return prisma.userGroup.findUnique({
    where: { id },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
      users: true,
    },
  });
};

export const createUserGroup = async (data: { name: string; description?: string; isDefault?: boolean; permissionIds?: number[] }) => {
  const { permissionIds, ...groupData } = data;
   
  return prisma.userGroup.create({
    data: {
      ...groupData,
      permissions: permissionIds ? {
        create: permissionIds.map(permissionId => ({
          permissionId,
        })),
      } : undefined,
    },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
};

export const updateUserGroup = async (id: number, data: { name?: string; description?: string; isDefault?: boolean; isActive?: boolean; permissionIds?: number[] }) => {
  const { permissionIds, ...groupData } = data;

  if (permissionIds) {
    await prisma.userGroupPermission.deleteMany({
      where: { userGroupId: id },
    });
    
    await prisma.userGroupPermission.createMany({
      data: permissionIds.map(permissionId => ({
        userGroupId: id,
        permissionId,
      })),
    });
  }

  return prisma.userGroup.update({
    where: { id },
    data: groupData,
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
};

export const deleteUserGroup = async (id: number) => {
  return prisma.userGroup.delete({
    where: { id },
  });
};

export const setDefaultUserGroup = async (id: number) => {
  await prisma.userGroup.updateMany({
    where: { isDefault: true },
    data: { isDefault: false },
  });

  return prisma.userGroup.update({
    where: { id },
    data: { isDefault: true },
  });
};