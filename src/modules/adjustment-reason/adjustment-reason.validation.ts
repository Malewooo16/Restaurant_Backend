import { z } from 'zod';

export const createAdjustmentReasonSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['increase', 'decrease', 'both']),
    description: z.string().optional(),
  }),
});

export const updateAdjustmentReasonSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    type: z.enum(['increase', 'decrease', 'both']).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});