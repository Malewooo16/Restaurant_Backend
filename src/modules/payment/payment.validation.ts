import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    orderId: z.number(),
    amount: z.number(),
    paymentMethod: z.enum(['CASH', 'CARD', 'ONLINE']),
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED']).optional(),
    transactionId: z.string().optional(),
  }),
});
