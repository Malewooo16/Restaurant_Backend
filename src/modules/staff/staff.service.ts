import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

export const getAllStaff = async () => {
  const staff = await prisma.staff.findMany({
    include: {
      role: { include: { department: true } },
      department: true,
    },
  });

  staff.sort((a, b) =>
    a.firstName.localeCompare(b.firstName, undefined, { sensitivity: "base" })
  );
  return staff;
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

export const createStaff = async (
  data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    roleId?: number;
    departmentId?: number;
    hireDate?: Date;
    status?: string;
    imageUrl?: string;
    address?: string;
    emergencyContact?: string;
    notes?: string;
  },
  userId: number
) => {
  if (data.email) {
    const emailExists = await prisma.staff.findFirst({
      where: { email: data.email },
    });
    if (emailExists) {
      throw new Error("Staff member with this email already exists");
    }
  }

  return prisma.staff.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      roleId: data.roleId,
      departmentId: data.departmentId,
      hireDate: data.hireDate,
      status: data.status,
      imageUrl: data.imageUrl,
      address: data.address,
      emergencyContact: data.emergencyContact,
      notes: data.notes,
      createdById: userId,
      updatedById: userId,
    },
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

export const updateStaff = async (
  id: number,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    roleId?: number;
    departmentId?: number;
    hireDate?: Date;
    status?: string;
    imageUrl?: string;
    address?: string;
    emergencyContact?: string;
    notes?: string;
  },
  userId: number
) => {
  // Check if staff exists
  const existingStaff = await prisma.staff.findUnique({
    where: { id },
  });
  if (!existingStaff) {
    throw new Error("Staff member not found");
  }

  // Check for duplicate email if email is being updated
  if (data.email) {
    const emailExists = await prisma.staff.findFirst({
      where: {
        email: data.email,
        NOT: { id },
      },
    });
    if (emailExists) {
      throw new Error("Staff member with this email already exists");
    }
  }

  return prisma.staff.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      roleId: data.roleId,
      departmentId: data.departmentId,
      hireDate: data.hireDate,
      status: data.status,
      imageUrl: data.imageUrl,
      address: data.address,
      emergencyContact: data.emergencyContact,
      notes: data.notes,
      updatedById: userId,
    },
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
