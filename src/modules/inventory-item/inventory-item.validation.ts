import { z } from 'zod';

export const createInventoryItemSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
    sku: z.string().optional(),
    category: z.string(),
    unit: z.string(),
    quantity: z.number().optional(),
    minStock: z.number().optional(),
    maxStock: z.number().optional(),
    price: z.number().optional(),
    supplier: z.string().optional(),
    location: z.enum(['KITCHEN', 'BAR', 'STORAGE', 'WALKIN_COOLER', 'FREEZER', 'DRY_STORAGE']).optional(),
    storageLocation: z.string().optional(),
  }),
});

export const updateInventoryItemSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    sku: z.string().optional(),
    category: z.string().optional(),
    unit: z.string().optional(),
    quantity: z.number().optional(),
    minStock: z.number().optional(),
    maxStock: z.number().optional(),
    price: z.number().optional(),
    supplier: z.string().optional(),
    location: z.enum(['KITCHEN', 'BAR', 'STORAGE', 'WALKIN_COOLER', 'FREEZER', 'DRY_STORAGE']).optional(),
    storageLocation: z.string().optional(),
    status: z.enum(['NORMAL', 'LOW', 'CRITICAL']).optional(),
  }),
});
