import { z } from 'zod';
import { PaymentMethod } from '../../../generated/prisma/enums';

export const createExpenseSchema = z.object({
    body: z.object({
        amount: z.number(),
        date: z.string(), // Assuming date is passed as a string (e.g., ISO 8601)
        description: z.string().optional(),
        paymentMethod: z.string(),
        categoryId: z.number(),
    }),
});

export const updateExpenseSchema = z.object({
    body: z.object({
        amount: z.number().optional(),
        date: z.string().optional(),
        description: z.string().optional(),
        categoryId: z.number().optional(),
    }).partial(),
});
