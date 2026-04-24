'use client';

import { CATEGORIES } from '@/lib/types';

interface ExpenseFiltersProps {
  category: string;
  onCategoryChange: (category: string) => void;
  totalCount: number;
}

export default function ExpenseFilters({
  category,
  onCategoryChange,
  totalCount,
}: ExpenseFiltersProps) {
  const allCategories = ['All', ...CATEGORIES];

  return (
    <div className="expense-filters" id="expense-filters">
      <div className="filters-left">
        <h3 className="filters-title">
          Expenses
          <span className="filters-count">{totalCount}</span>
        </h3>
      </div>
      <div className="filters-right">
        <label htmlFor="filter-category" className="sr-only">
          Filter by category
        </label>
        <select
          id="filter-category"
          className="filter-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? '🏷️ All Categories' : cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
