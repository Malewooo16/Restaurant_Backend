import { z } from 'zod';

export const createInventoryItemSchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().optional(),
        sku: z.string().optional(),
        categoryId: z.number().int().positive('Category ID must be a positive integer'),
        unit: z.string(),
        quantity: z.number().optional(),
        minStock: z.number().optional(),
        maxStock: z.number().optional(),
        price: z.number().optional(),
        supplier: z.string().optional(),
        location: z.enum(['KITCHEN', 'BAR', 'STORAGE', 'WALKIN_COOLER', 'FREEZER', 'DRY_STORAGE']).optional(),
        storageLocation: z.string().optional(),
        department: z.array(z.enum(['KITCHEN', 'BAR', 'SERVICE', 'OPERATIONS', 'MANAGEMENT'])).optional(),
    }),
});

export const updateInventoryItemSchema = z.object({
    params: z.object({
        id: z.string().transform(Number),
    }),
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        sku: z.string().optional(),
        categoryId: z.number().int().positive('Category ID must be a positive integer').optional(),
        unit: z.string().optional(),
        quantity: z.number().optional(),
        minStock: z.number().optional(),
        maxStock: z.number().optional(),
        price: z.number().optional(),
        supplier: z.string().optional(),
        location: z.enum(['KITCHEN', 'BAR', 'STORAGE', 'WALKIN_COOLER', 'FREEZER', 'DRY_STORAGE']).optional(),
        storageLocation: z.string().optional(),
        status: z.enum(['NORMAL', 'LOW', 'CRITICAL']).optional(),
        department: z.array(z.enum(['KITCHEN', 'BAR', 'SERVICE', 'OPERATIONS', 'MANAGEMENT'])).optional(),
    }).partial(),
});

export const getInventoryItemSchema = z.object({
    query: z.object({
        department: z.enum(['KITCHEN', 'BAR', 'SERVICE', 'OPERATIONS', 'MANAGEMENT']).optional(),
        categoryId: z.string().transform(Number).optional(),
        search: z.string().optional(),
    }).optional(),
});
