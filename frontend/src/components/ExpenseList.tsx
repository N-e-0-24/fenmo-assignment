'use client';

import { Expense, CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/types';
import { formatCents } from '@/lib/api';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
}

export default function ExpenseList({ expenses, isLoading }: ExpenseListProps) {
  if (isLoading) {
    return (
      <div className="expense-list-loading">
        <div className="loading-skeleton" />
        <div className="loading-skeleton" />
        <div className="loading-skeleton" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <div className="empty-icon">📭</div>
        <h3>No expenses yet</h3>
        <p>Add your first expense to get started!</p>
      </div>
    );
  }

  return (
    <div className="expense-list" id="expense-list">
      {expenses.map((expense, index) => (
        <div
          key={expense.id}
          className="expense-card"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="expense-card-left">
            <span className="expense-icon">
              {CATEGORY_ICONS[expense.category] || '📌'}
            </span>
            <div className="expense-info">
              <h4 className="expense-description">{expense.description}</h4>
              <span
                className="expense-category-badge"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[expense.category] || '#6b7280'}20`,
                  color: CATEGORY_COLORS[expense.category] || '#6b7280',
                  borderColor: `${CATEGORY_COLORS[expense.category] || '#6b7280'}40`,
                }}
              >
                {expense.category}
              </span>
            </div>
          </div>
          <div className="expense-card-right">
            <span className="expense-amount">{formatCents(expense.amount)}</span>
            <span className="expense-date">
              {new Date(expense.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
