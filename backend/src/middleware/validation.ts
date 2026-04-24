import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Zod schema for expense creation.
 * - amount must be a positive integer (cents)
 * - date must be a valid ISO date string
 */
export const createExpenseSchema = z.object({
  amount: z
    .number()
    .int('Amount must be an integer (cents)')
    .positive('Amount must be greater than 0'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be 50 characters or less'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),
  date: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      { message: 'Invalid date format. Use ISO 8601 (e.g. 2024-01-15)' }
    ),
});

/**
 * Express middleware factory for Zod schema validation.
 * Rejects requests with 400 if body doesn't match schema.
 */
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
