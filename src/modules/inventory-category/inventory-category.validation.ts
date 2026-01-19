import { z } from 'zod';

export const createInventoryCategorySchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
  }),
});

export const updateInventoryCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
