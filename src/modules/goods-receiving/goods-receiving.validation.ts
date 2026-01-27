import { z } from 'zod';

export const goodsReceivingItemSchema = z.object({
  inventoryItemId: z.number().int().positive('Inventory Item ID must be a positive integer'),
  quantityReceived: z.number().positive('Quantity received must be a positive number'),
  batchNumber: z.string().optional(),
  expiryDate: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
});

export const createGoodsReceivingSchema = z.object({
    grnNumber: z.string().min(1, 'GRN Number is required'),
    purchaseOrderId: z.number().int().positive('Purchase Order ID must be a positive integer').optional(),
    supplierId: z.number().int().positive('Supplier ID must be a positive integer'),
    receivedAt: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
    notes: z.string().optional(),
    receivedItems: z.array(goodsReceivingItemSchema).min(1, 'At least one received item is required'),
});

export const updateGoodsReceivingSchema = z.object({
    grnNumber: z.string().min(1, 'GRN Number is required').optional(),
    purchaseOrderId: z.number().int().positive('Purchase Order ID must be a positive integer').optional(),
    supplierId: z.number().int().positive('Supplier ID must be a positive integer').optional(),
    receivedAt: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
    notes: z.string().optional(),
    receivedItems: z.array(goodsReceivingItemSchema).min(1, 'At least one received item is required').optional(),
}).partial();

export const validateGoodsReceivingItems = z.array(goodsReceivingItemSchema).min(1, 'At least one received item is required');