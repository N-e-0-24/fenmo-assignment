import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from '../services/expense.service';
import { ExpenseFilters, Expense, ExpenseResponse } from '../models/expense';
import { AppError } from '../middleware/errorHandler';

/**
 * HTTP controller — translates HTTP requests into service calls.
 * No business logic lives here.
 */
export class ExpenseController {
  constructor(private readonly service: ExpenseService) {}

  createExpense = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const idempotencyKey = req.headers['idempotency-key'];
      if (!idempotencyKey || typeof idempotencyKey !== 'string') {
        throw new AppError(400, 'Idempotency-Key header is required');
      }

      const { expense, isNew } = this.service.createExpense(
        req.body,
        idempotencyKey
      );

      const statusCode = isNew ? 201 : 200;
      res.status(statusCode).json({
        data: this.toResponse(expense),
        ...(isNew ? {} : { idempotent: true }),
      });
    } catch (error) {
      next(error);
    }
  };

  getExpenses = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const filters: ExpenseFilters = {
        category: req.query.category as string | undefined,
        sort:
          (req.query.sort as string) === 'date_asc' ? 'date_asc' : 'date_desc',
      };

      const expenses = this.service.getExpenses(filters);

      res.json({
        data: expenses.map((e) => this.toResponse(e)),
        total: expenses.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /** Strip internal fields from API responses */
  private toResponse(expense: Expense): ExpenseResponse {
    return {
      id: expense.id,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
      created_at: expense.created_at,
    };
  }
}
