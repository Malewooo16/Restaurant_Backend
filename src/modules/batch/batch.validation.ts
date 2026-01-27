import { z } from 'zod';

export const createBatchSchema = z.object({
    batchNumber: z.string().min(1, 'Batch Number is required'),
    inventoryItemId: z.number().int().positive('Inventory Item ID must be a positive integer'),
    quantity: z.number().positive('Quantity must be a positive number'),
    receivedAt: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
    expiryDate: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
});

export const updateBatchSchema = z.object({
    batchNumber: z.string().min(1, 'Batch Number is required').optional(),
    inventoryItemId: z.number().int().positive('Inventory Item ID must be a positive integer').optional(),
    quantity: z.number().positive('Quantity must be a positive number').optional(),
    receivedAt: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
    expiryDate: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
}).partial();