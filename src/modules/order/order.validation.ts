import { z } from 'zod';

export const createOrderSchema = z.object({
  tableNumber: z.number().optional(),
  customerName: z.string().optional(),
  waiter: z.string().optional(),
  guestCount: z.number().optional(),
  orderItems: z.array(
    z.object({
      menuItemId: z.number(),
      quantity: z.number(),
      notes: z.string().optional(),
    })
  ),
});

export const updateOrderSchema = z.object({
  tableNumber: z.number().optional(),
  customerName: z.string().optional(),
  waiter: z.string().optional(),
  guestCount: z.number().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SERVED', 'PAID', 'CANCELLED']).optional(),
});

export const updateKitchenOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'READY']).optional(),
});

export const updateBarOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'READY']).optional(),
});
