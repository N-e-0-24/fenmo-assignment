'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fetchExpenses, createExpense, dollarsToCents } from '@/lib/api';
import type { CreateExpensePayload } from '@/lib/types';

/**
 * Central hook for all expense operations.
 * Manages fetching, creating, filtering, and idempotency keys.
 */
export function useExpenses() {
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [idempotencyKey, setIdempotencyKey] = useState<string>(uuidv4());

  // Fetch expenses with category filter
  const {
    data: expensesData,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['expenses', categoryFilter],
    queryFn: () => fetchExpenses(categoryFilter),
  });

  // Create expense mutation
  const mutation = useMutation({
    mutationFn: ({
      payload,
      key,
    }: {
      payload: CreateExpensePayload;
      key: string;
    }) => createExpense(payload, key),
    onSuccess: () => {
      // Refresh expense list
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      // Generate new idempotency key for next submission
      setIdempotencyKey(uuidv4());
    },
    // On error, keep the SAME idempotency key so retry is safe
  });

  const submitExpense = useCallback(
    (formData: {
      amount: string;
      category: string;
      description: string;
      date: string;
    }) => {
      const cents = dollarsToCents(formData.amount);
      if (cents <= 0) {
        throw new Error('Amount must be greater than $0.00');
      }

      const payload: CreateExpensePayload = {
        amount: cents,
        category: formData.category,
        description: formData.description,
        date: formData.date,
      };

      mutation.mutate({ payload, key: idempotencyKey });
    },
    [mutation, idempotencyKey]
  );

  const expenses = expensesData?.data ?? [];

  // Compute total from filtered list using integer arithmetic
  const totalCents = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return {
    expenses,
    totalCents,
    isLoading,
    isSubmitting: mutation.isPending,
    fetchError: fetchError ? (fetchError as Error).message : null,
    submitError: mutation.error ? (mutation.error as Error).message : null,
    submitSuccess: mutation.isSuccess,
    categoryFilter,
    setCategoryFilter,
    submitExpense,
    resetSubmitState: mutation.reset,
  };
}
