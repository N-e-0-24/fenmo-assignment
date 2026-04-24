'use client';

import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseFilters from '@/components/ExpenseFilters';
import TotalDisplay from '@/components/TotalDisplay';
import { useExpenses } from '@/hooks/useExpenses';

export default function HomePage() {
  const {
    expenses,
    totalCents,
    isLoading,
    isSubmitting,
    fetchError,
    submitError,
    submitSuccess,
    categoryFilter,
    setCategoryFilter,
    submitExpense,
    resetSubmitState,
  } = useExpenses();

  return (
    <main className="app-container">
      {/* Background effects */}
      <div className="bg-gradient-1" />
      <div className="bg-gradient-2" />

      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">💰</span>
            <h1>Expense Tracker</h1>
          </div>
          <p className="header-subtitle">
            Track, filter, and manage your spending with precision
          </p>
        </div>
      </header>

      <div className="app-content">
        <div className="content-grid">
          {/* Left Column — Form & Total */}
          <aside className="sidebar">
            <ExpenseForm
              onSubmit={submitExpense}
              isSubmitting={isSubmitting}
              error={submitError}
              success={submitSuccess}
              onReset={resetSubmitState}
            />
            <TotalDisplay totalCents={totalCents} />
          </aside>

          {/* Right Column — Filters & List */}
          <section className="main-section">
            <ExpenseFilters
              category={categoryFilter}
              onCategoryChange={setCategoryFilter}
              totalCount={expenses.length}
            />

            {fetchError && (
              <div className="form-message form-error" role="alert">
                <span>⚠️</span> {fetchError}
              </div>
            )}

            <ExpenseList expenses={expenses} isLoading={isLoading} />
          </section>
        </div>
      </div>
    </main>
  );
}
