import { z } from 'zod';

export const createInventoryAdjustmentSchema = z.object({
  body: z.object({
    inventoryItemId: z.number().min(1, 'Inventory item ID is required'),
    adjustmentReasonId: z.number().min(1, 'Adjustment reason ID is required'),
    adjustmentType: z.enum(['increase', 'decrease']),
    quantity: z.number().positive('Quantity must be positive'),
    batchId: z.number().optional(),
    notes: z.string().optional(),
    adjustedBy: z.string().optional(),
  }),
});