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

export const createSplitPaymentSchema = z.object({
  body: z.object({
    orderId: z.number(),
    payments: z.array(
      z.object({
        amount: z.number().positive(),
        paymentMethod: z.enum(['CASH', 'CARD', 'ONLINE']),
        transactionId: z.string().optional(),
      })
    ).min(1).max(5),
  }),
});

export const processPaymentSchema = z.object({
  body: z.object({
    orderId: z.number(),
    amount: z.number().positive(),
    paymentMethod: z.enum(['CASH', 'CARD', 'ONLINE']),
    transactionId: z.string().optional(),
  }),
});
