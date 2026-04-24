import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { validateBody, createExpenseSchema } from '../middleware/validation';

/**
 * Creates the expense router with all route definitions.
 */
export function createExpenseRouter(controller: ExpenseController): Router {
  const router = Router();

  router.post('/', validateBody(createExpenseSchema), controller.createExpense);
  router.get('/', controller.getExpenses);

  return router;
}
