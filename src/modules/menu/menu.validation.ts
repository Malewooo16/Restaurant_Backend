import { z } from 'zod';

export const createMenuItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  isAvailable: z.boolean().optional(),
  prepArea: z.enum(['KITCHEN', 'BAR']),
  categoryId: z.number(), // Added categoryId
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
  addonIds: z.array(z.number()).optional(),
  sideDishIds: z.array(z.number()).optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export const createMenuAddonSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  isAvailable: z.boolean().optional(),
});

export const updateMenuAddonSchema = createMenuAddonSchema.partial();

export const createMenuSideDishSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  isAvailable: z.boolean().optional(),
});

export const updateMenuSideDishSchema = createMenuSideDishSchema.partial();

export const createMenuCategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateMenuCategorySchema = createMenuCategorySchema.partial();
