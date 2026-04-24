/**
 * Core expense data model.
 * Amount is stored as integer cents to avoid floating-point errors.
 */
export interface Expense {
  id: string;
  amount: number; // integer cents — NEVER float
  category: string;
  description: string;
  date: string; // ISO 8601 string
  created_at: string; // ISO 8601 timestamp
  idempotency_key: string;
}

/** DTO for creating a new expense (validated input) */
export interface CreateExpenseDTO {
  amount: number; // integer cents
  category: string;
  description: string;
  date: string;
}

/** Query filters for listing expenses */
export interface ExpenseFilters {
  category?: string;
  sort?: 'date_desc' | 'date_asc';
}

/** API response shape (excludes internal fields) */
export interface ExpenseResponse {
  id: string;
  amount: number; // integer cents
  category: string;
  description: string;
  date: string;
  created_at: string;
}
