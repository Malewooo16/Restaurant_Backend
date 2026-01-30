import { z } from 'zod';
import { ReservationStatus } from '../../../generated/prisma/client';

export const createReservationSchema = z.object({
    body: z.object({
        customerName: z.string(),
        customerPhone: z.string(),
        customerEmail: z.string().email().optional(),
        date: z.string(), // Assuming date is passed as a string (e.g., ISO 8601)
        numberOfGuests: z.number().int(),
        status: z.nativeEnum(ReservationStatus).optional(),
        notes: z.string().optional(),
        tableIds: z.array(z.number().int()),
    }),
});

export const updateReservationSchema = z.object({
    body: z.object({
        customerName: z.string().optional(),
        customerPhone: z.string().optional(),
        customerEmail: z.string().email().optional(),
        date: z.string().optional(),
        numberOfGuests: z.number().int().optional(),
        status: z.nativeEnum(ReservationStatus).optional(),
        notes: z.string().optional(),
        tableIds: z.array(z.number().int()).optional(),
    }).partial(),
});
