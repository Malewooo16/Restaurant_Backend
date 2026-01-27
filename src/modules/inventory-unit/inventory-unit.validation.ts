import { z } from 'zod';

export const createInventoryUnitSchema = z.object({
    name: z.string(),
    type: z.string(),
    symbol: z.string().optional(),
    description: z.string().optional(),
});

export const updateInventoryUnitSchema = z.object({
    name: z.string().optional(),
    type: z.string().optional(),
    symbol: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
});
