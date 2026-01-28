import { z } from 'zod';
import { Departments } from '../../../generated/prisma/client';

export const getDepartmentInventorySchema = z.object({
  query: z.object({
    department: z.nativeEnum(Departments), // Department query parameter is now required
  }),
});

export const updateDepartmentInventorySchema = z.object({
  params: z.object({
    departmentInventoryId: z.string().refine(val => !isNaN(Number(val)), {
      message: 'departmentInventoryId must be a number',
    }).transform(Number),
  }),
  body: z.object({
    quantity: z.number().min(0, 'Quantity cannot be negative'),
  }),
});