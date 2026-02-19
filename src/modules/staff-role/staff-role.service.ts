import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

export const getAllStaffRoles = async () => {
  return prisma.staffRole.findMany({
    where: {
      isActive: true,
    },
    include: {
      department: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const getStaffRoleById = async (id: number) => {
  return prisma.staffRole.findUnique({
    where: { id },
    include: {
      department: true,
    },
  });
};

export const getStaffRolesByDepartment = async (departmentId: number) => {
  return prisma.staffRole.findMany({
    where: {
      departmentId,
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const createStaffRole = async (data: Prisma.StaffRoleCreateInput) => {
  const nameExists = await prisma.staffRole.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Staff role with this name already exists');
  }
  return prisma.staffRole.create({
    data,
    include: {
      department: true,
    },
  });
};

export const updateStaffRole = async (id: number, data: Prisma.StaffRoleUpdateInput) => {
  const existing = await prisma.staffRole.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Staff role not found');
  }

  if (typeof data.name === 'string') {
    const nameExists = await prisma.staffRole.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });
    if (nameExists) {
      throw new Error('Staff role with this name already exists');
    }
  }

  return prisma.staffRole.update({
    where: { id },
    data,
    include: {
      department: true,
    },
  });
};

export const deleteStaffRole = async (id: number) => {
  return prisma.staffRole.delete({
    where: { id },
  });
};