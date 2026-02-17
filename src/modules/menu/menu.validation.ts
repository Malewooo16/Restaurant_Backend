import { z } from 'zod';

export const createMenuItemSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().nullish(),
    price: z.number(),
    isAvailable: z.boolean().optional(),
    prepArea: z.enum(['KITCHEN', 'BAR']),
    categoryId: z.number(),
    rating: z.number().nullish(),
    cost: z.number().nullish(),
    prepTime: z.number().nullish(),
    calories: z.number().nullish(),
    servingSize: z.string().nullish(),
    ingredients: z.array(z.string()).nullish(),
    allergens: z.array(z.string()).nullish(),
    dietaryOptions: z.array(z.string()).nullish(),
    featured: z.boolean().optional(),
    seasonal: z.boolean().optional(),
    hasAddons: z.boolean().optional(),
    requiresSideDish: z.boolean().optional(),
    addonIds: z.array(z.number()).nullish(),
    sideDishIds: z.array(z.number()).nullish(),
  }),
});

export const updateMenuItemSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    isAvailable: z.boolean().optional(),
    prepArea: z.enum(['KITCHEN', 'BAR']).optional(),
    categoryId: z.number().optional(),
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
    hasAddons: z.boolean().optional(),
    requiresSideDish: z.boolean().optional(),
    addonIds: z.array(z.number()).optional(),
    sideDishIds: z.array(z.number()).optional(),
  }).partial(),
});

export const createMenuAddonSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().nullish(),
    price: z.number(),
    isAvailable: z.boolean().optional(),
    seasonal: z.boolean().optional(),
  }),
});

export const updateMenuAddonSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().nullish(),
    price: z.number().optional(),
    isAvailable: z.boolean().optional(),
    seasonal: z.boolean().optional(),
  }).partial(),
});

export const createMenuSideDishSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().nullish(),
    price: z.number(),
    isAvailable: z.boolean().optional(),
    seasonal: z.boolean().optional(),
  }),
});

export const updateMenuSideDishSchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().nullish(),
    price: z.number().optional(),
    isAvailable: z.boolean().optional(),
    seasonal: z.boolean().optional(),
  }).partial(),
});

export const createMenuCategorySchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().nullish(),
    prepArea: z.enum(['KITCHEN', 'BAR']).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateMenuCategorySchema = z.object({
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().nullish(),
    prepArea: z.enum(['KITCHEN', 'BAR']).optional(),
    isActive: z.boolean().optional(),
  }).partial(),
});
