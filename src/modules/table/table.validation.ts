import { z } from 'zod';
import { TableStatus } from '../../../generated/prisma/client';

export const createTableSchema = z.object({
    body: z.object({
        number: z.number().int(),
        capacity: z.number().int(),
        status: z.nativeEnum(TableStatus).optional(),
    }),
});

export const updateTableSchema = z.object({
    body: z.object({
        number: z.number().int().optional(),
        capacity: z.number().int().optional(),
        status: z.nativeEnum(TableStatus).optional(),
    }).partial(),
});
