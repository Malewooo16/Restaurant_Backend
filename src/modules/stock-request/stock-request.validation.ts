import { z } from 'zod';

export const getAllStockRequestsSchema = z.object({
  query: z.object({
    department: z.enum(['KITCHEN', 'BAR', 'SERVICE', 'OPERATIONS', 'MANAGEMENT']).optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'fulfilled']).optional(),
  }),
});

export const createStockRequestSchema = z.object({
  body: z.object({
    // requestId is generated in service
    status: z.enum(['pending', 'approved', 'rejected']).default('pending').optional(),
    requestedBy: z.string().optional(),
    requestedFrom: z.enum(['KITCHEN', 'BAR']).optional(), // Assuming PrepArea enum
    requestItems: z.array(
      z.object({
        itemId: z.number().int().positive(),
        quantity: z.number().positive(),
        status: z.enum(['pending', 'approved']).default('pending').optional(),
      })
    ),
  }),
});

export const updateStockRequestStatusSchema = z.object({
  params: z.object({
    id: z.string().transform(Number), // ID from path is string, convert to number
  }),
  body: z.object({
    status: z.enum(['pending', 'approved', 'rejected']),
  }),
});
