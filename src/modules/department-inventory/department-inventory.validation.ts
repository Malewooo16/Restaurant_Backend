import { z } from 'zod';
import { Departments } from '../../../generated/prisma/client';

export const getDepartmentInventorySchema = z.object({
  query: z.object({
    department: z.nativeEnum(Departments), // Department query parameter is now required
  }),
});

export const updateDepartmentInventorySchema = z.object({
  body: z.object({
    quantity: z.union([
      z.number().min(0, 'Quantity cannot be negative'),
      z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
        message: 'Quantity must be a valid non-negative number',
      }).transform(Number),
    ]),
  }),
});