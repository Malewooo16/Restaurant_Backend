import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

export const getAllStaff = async () => {
  return prisma.staff.findMany({
    include: {
      role: {
        include: {
          department: true,
        },
      },
      department: true,
    },
    orderBy: {
      firstName: 'asc',
    },
  });
};

export const getStaffById = async (id: number) => {
  return prisma.staff.findUnique({
    where: { id },
    include: {
      role: {
        include: {
          department: true,
        },
      },
      department: true,
    },
  });
};

export const createStaff = async (data: Prisma.StaffCreateInput) => {
  if (data.email) {
    const emailExists = await prisma.staff.findFirst({
      where: { email: data.email as string },
    });
    if (emailExists) {
      throw new Error('Staff member with this email already exists');
    }
  }

  return prisma.staff.create({
    data,
    include: {
      role: {
        include: {
          department: true,
        },
      },
      department: true,
    },
  });
};

export const updateStaff = async (id: number, data: Prisma.StaffUpdateInput) => {
  // Check if staff exists
  const existingStaff = await prisma.staff.findUnique({
    where: { id },
  });
  if (!existingStaff) {
    throw new Error('Staff member not found');
  }

  // Check for duplicate email if email is being updated
  if (typeof data.email === 'string') {
    const emailExists = await prisma.staff.findFirst({
      where: {
        email: data.email,
        NOT: { id },
      },
    });
    if (emailExists) {
      throw new Error('Staff member with this email already exists');
    }
  }

  return prisma.staff.update({
    where: { id },
    data,
    include: {
      role: {
        include: {
          department: true,
        },
      },
      department: true,
    },
  });
};

export const deleteStaff = async (id: number) => {
  return prisma.staff.delete({
    where: { id },
  });
};