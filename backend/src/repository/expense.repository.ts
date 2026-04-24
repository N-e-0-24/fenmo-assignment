import { Expense, ExpenseFilters } from '../models/expense';

/**
 * Repository interface — swap this implementation for SQLite/Postgres later.
 */
export interface IExpenseRepository {
  create(expense: Expense): Expense;
  findAll(filters?: ExpenseFilters): Expense[];
  findByIdempotencyKey(key: string): Expense | null;
}

/**
 * In-memory implementation of the expense repository.
 *
 * Concurrency note: Node.js is single-threaded for JS execution,
 * so synchronous operations on arrays/maps are inherently atomic.
 * For a DB-backed implementation, use transactions instead.
 */
export class InMemoryExpenseRepository implements IExpenseRepository {
  private expenses: Expense[] = [];
  private idempotencyMap: Map<string, Expense> = new Map();

  create(expense: Expense): Expense {
    this.expenses.push({ ...expense });
    this.idempotencyMap.set(expense.idempotency_key, { ...expense });
    return expense;
  }

  findAll(filters?: ExpenseFilters): Expense[] {
    let result = [...this.expenses];

    // Filter by category (case-insensitive)
    if (filters?.category) {
      const cat = filters.category.toLowerCase();
      result = result.filter(
        (e) => e.category.toLowerCase() === cat
      );
    }

    // Sort by date (default: newest first)
    const sortOrder = filters?.sort ?? 'date_desc';
    result.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortOrder === 'date_desc' ? -diff : diff;
    });

    return result;
  }

  findByIdempotencyKey(key: string): Expense | null {
    return this.idempotencyMap.get(key) ?? null;
  }
}
