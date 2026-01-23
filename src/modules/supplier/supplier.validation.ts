import { z } from 'zod';

export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    contactPerson: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const updateSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    contactPerson: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).partial(), // All fields are optional for update
});
