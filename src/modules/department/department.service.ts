import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

export const getAllDepartments = async () => {
  return prisma.department.findMany({
    where: {
      isActive: true,
    },
    include: {
      staffRoles: {
        where: {
          isActive: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const getDepartmentById = async (id: number) => {
  return prisma.department.findUnique({
    where: { id },
    include: {
      staffRoles: true,
    },
  });
};

export const createDepartment = async (data: Prisma.DepartmentCreateInput) => {
  const nameExists = await prisma.department.findFirst({
    where: { name: data.name },
  });
  if (nameExists) {
    throw new Error('Department with this name already exists');
  }
  return prisma.department.create({
    data,
    include: {
      staffRoles: true,
    },
  });
};

export const updateDepartment = async (id: number, data: Prisma.DepartmentUpdateInput) => {
  const existing = await prisma.department.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Department not found');
  }

  if (typeof data.name === 'string') {
    const nameExists = await prisma.department.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });
    if (nameExists) {
      throw new Error('Department with this name already exists');
    }
  }

  return prisma.department.update({
    where: { id },
    data,
    include: {
      staffRoles: true,
    },
  });
};

export const deleteDepartment = async (id: number) => {
  return prisma.department.delete({
    where: { id },
  });
};