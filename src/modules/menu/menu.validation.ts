import { z } from 'zod';

export const createMenuItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  isAvailable: z.boolean().optional(),
  prepArea: z.enum(['KITCHEN', 'BAR']),
  category: z.string().optional(),
  rating: z.number().optional(),
  cost: z.number().optional(),
  prepTime: z.number().optional(),
  calories: z.number().optional(),
  servingSize: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  dietaryOptions: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  seasonal: z.boolean().optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();
