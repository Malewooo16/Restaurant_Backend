import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validate =
  (schema: z.ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
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
