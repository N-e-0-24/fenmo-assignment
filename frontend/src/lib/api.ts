import { CreateExpensePayload, CreateExpenseResponse, ExpensesResponse } from './types';

const API_BASE = '/api';

/**
 * Fetch all expenses with optional category filter.
 */
export async function fetchExpenses(category?: string): Promise<ExpensesResponse> {
  const params = new URLSearchParams();
  if (category && category !== 'All') {
    params.set('category', category);
  }
  params.set('sort', 'date_desc');

  const url = `${API_BASE}/expenses?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to fetch expenses (${res.status})`);
  }

  return res.json();
}

/**
 * Create a new expense with idempotency key.
 * The same idempotency key can be retried safely.
 */
export async function createExpense(
  payload: CreateExpensePayload,
  idempotencyKey: string
): Promise<CreateExpenseResponse> {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to create expense (${res.status})`);
  }

  return res.json();
}

/**
 * Convert a dollar string to integer cents without floating-point errors.
 * Examples: "12.50" → 1250, "5" → 500, "0.99" → 99
 */
export function dollarsToCents(dollars: string): number {
  const trimmed = dollars.trim();
  if (!trimmed || isNaN(Number(trimmed))) return 0;

  const parts = trimmed.split('.');
  const whole = parseInt(parts[0] || '0', 10);
  const frac = parts[1] ? parts[1].padEnd(2, '0').slice(0, 2) : '00';
  return Math.abs(whole) * 100 + parseInt(frac, 10);
}

/**
 * Format integer cents as a dollar string.
 * Example: 1250 → "$12.50"
 */
export function formatCents(cents: number): string {
  const dollars = Math.floor(Math.abs(cents) / 100);
  const remaining = Math.abs(cents) % 100;
  return `$${dollars.toLocaleString()}.${remaining.toString().padStart(2, '0')}`;
}
