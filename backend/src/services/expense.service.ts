import { v4 as uuidv4 } from 'uuid';
import { IExpenseRepository } from '../repository/expense.repository';
import { Expense, CreateExpenseDTO, ExpenseFilters } from '../models/expense';

interface CreateResult {
  expense: Expense;
  isNew: boolean;
}

/**
 * Business logic layer for expenses.
 * Handles idempotency checks and delegates persistence to the repository.
 */
export class ExpenseService {
  constructor(private readonly repository: IExpenseRepository) {}

  /**
   * Create an expense with idempotency guarantee.
   * If the idempotency key already exists, returns the previously created expense.
   */
  createExpense(dto: CreateExpenseDTO, idempotencyKey: string): CreateResult {
    // Check for existing submission with this idempotency key
    const existing = this.repository.findByIdempotencyKey(idempotencyKey);
    if (existing) {
      return { expense: existing, isNew: false };
    }

    const expense: Expense = {
      id: uuidv4(),
      amount: dto.amount,
      category: dto.category,
      description: dto.description,
      date: dto.date,
      created_at: new Date().toISOString(),
      idempotency_key: idempotencyKey,
    };

    const created = this.repository.create(expense);
    return { expense: created, isNew: true };
  }

  /**
   * Retrieve expenses with optional filtering and sorting.
   */
  getExpenses(filters?: ExpenseFilters): Expense[] {
    return this.repository.findAll(filters);
  }
}
