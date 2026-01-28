import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validate =
  (schema: z.ZodObject) => // Use AnyZodObject to allow schema to define body, query, params
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.issues,
        });
      }
      next(error);
    }
  };