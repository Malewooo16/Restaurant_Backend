import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    tableId: z.number().optional(),
    tableNumber: z.number().optional(),
    customerName: z.string().nullish(),
    waiter: z.string().optional(),
    guestCount: z.number().optional(),
    orderItems: z.array(
      z.object({
        menuItemId: z.number(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        notes: z.string().nullish(),
        selectedSideDishes: z.array(z.number().positive("Side dish ID must be positive")).optional(),
        selectedAddons: z.array(z.number().positive("Addon ID must be positive")).optional(),
      })
    ).min(1, "Order must contain at least one item"),
  }),
});

export const updateOrderSchema = z.object({
  body: z.object({
    tableNumber: z.number().optional(),
    customerName: z.string().optional(),
    waiter: z.string().optional(),
    guestCount: z.number().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SERVED', 'PAID', 'CANCELLED']).optional(),
  }).partial(),
});

export const updateKitchenOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PREPARING', 'READY']).optional(),
  }),
});

export const updateBarOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'READY']).optional(),
  }),
});

export const updateOrderItemStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED']).optional(),
  }),
});