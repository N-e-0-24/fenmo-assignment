/** Expense as returned from the API (amount in integer cents) */
export interface Expense {
  id: string;
  amount: number; // integer cents
  category: string;
  description: string;
  date: string;
  created_at: string;
}

/** Payload for creating a new expense */
export interface CreateExpensePayload {
  amount: number; // integer cents
  category: string;
  description: string;
  date: string;
}

/** API list response shape */
export interface ExpensesResponse {
  data: Expense[];
  total: number;
}

/** API single expense response shape */
export interface CreateExpenseResponse {
  data: Expense;
  idempotent?: boolean;
}

/** Available expense categories */
export const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Bills',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Category color mapping for UI badges */
export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#ec4899',
  Health: '#10b981',
  Education: '#06b6d4',
  Bills: '#eab308',
  Other: '#6b7280',
};

/** Category icon mapping */
export const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔',
  Transport: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Health: '💊',
  Education: '📚',
  Bills: '📄',
  Other: '📌',
};
