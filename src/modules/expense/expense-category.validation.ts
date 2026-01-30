import { z } from 'zod';

export const createExpenseCategorySchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().optional(),
    }),
});

export const updateExpenseCategorySchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
    }).partial(),
});
