import { z } from 'zod';

export const createInventoryUnitSchema = z.object({
    body: z.object({
        name: z.string(),
        type: z.string(),
        symbol: z.string().optional(),
        description: z.string().optional(),
    }),
});

export const updateInventoryUnitSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        type: z.string().optional(),
        symbol: z.string().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
    }).partial(),
});
