'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { CATEGORIES } from '@/lib/types';

interface ExpenseFormProps {
  onSubmit: (data: {
    amount: string;
    category: string;
    description: string;
    date: string;
  }) => void;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  onReset: () => void;
}

export default function ExpenseForm({
  onSubmit,
  isSubmitting,
  error,
  success,
  onReset,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onReset(); // Clear previous success/error states

      if (!amount || !description || !date) return;

      onSubmit({ amount, category, description, date });

      // Clear form on submit (will only persist if API succeeds via parent)
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    },
    [amount, category, description, date, onSubmit, onReset]
  );

  // Validate amount input: allow digits and one decimal point
  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    // Prevent multiple dots
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return;
    setAmount(cleaned);
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit} id="expense-form">
      <h2 className="form-title">
        <span className="form-title-icon">✨</span>
        Add New Expense
      </h2>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <div className="input-wrapper">
            <span className="input-prefix">$</span>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              required
              disabled={isSubmitting}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-group-wide">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isSubmitting}
            maxLength={500}
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group form-submit-group">
          <button
            type="submit"
            id="submit-expense"
            disabled={isSubmitting || !amount || !description}
            className="btn-submit"
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Adding...
              </>
            ) : (
              <>
                <span>+</span>
                Add Expense
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="form-message form-error" role="alert">
          <span>⚠️</span> {error}
        </div>
      )}
      {success && (
        <div className="form-message form-success" role="status">
          <span>✅</span> Expense added successfully!
        </div>
      )}
    </form>
  );
}
