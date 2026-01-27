import { z } from 'zod';
import { PurchaseOrderStatus } from '../../../generated/prisma/client';

export const purchaseOrderItemSchema = z.object({
  inventoryItemId: z.number().int().positive('Inventory Item ID must be a positive integer'),
  quantityOrdered: z.number().positive('Quantity ordered must be a positive number'),
  unitPrice: z.number().positive('Unit price must be a positive number'),
});

export const createPurchaseOrderSchema = z.object({
    poNumber: z.string().min(1, 'Purchase Order Number is required'),
    supplierId: z.number().int().positive('Supplier ID must be a positive integer'),
    status: z.nativeEnum(PurchaseOrderStatus).default(PurchaseOrderStatus.PENDING).optional(),
    notes: z.string().optional(),
    orderedAt: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
    expectedDeliveryAt: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
    items: z.array(purchaseOrderItemSchema).min(1, 'At least one item is required for a purchase order'),
});

export const updatePurchaseOrderSchema = z.object({
    poNumber: z.string().min(1, 'Purchase Order Number is required').optional(),
    supplierId: z.number().int().positive('Supplier ID must be a positive integer').optional(),
    status: z.nativeEnum(PurchaseOrderStatus).optional(),
    notes: z.string().optional(),
    orderedAt: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
    expectedDeliveryAt: z.preprocess((arg) => new Date(arg as string), z.date()).optional(),
    items: z.array(purchaseOrderItemSchema).min(1, 'At least one item is required for a purchase order').optional(),
}).partial();

// Assuming a separate validation for items in the controller if items are passed
export const validatePurchaseOrderItems = z.array(purchaseOrderItemSchema).min(1, 'At least one item is required for a purchase order');