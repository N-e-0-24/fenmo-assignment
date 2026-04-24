'use client';

import { formatCents } from '@/lib/api';

interface TotalDisplayProps {
  totalCents: number;
}

export default function TotalDisplay({ totalCents }: TotalDisplayProps) {
  return (
    <div className="total-display" id="total-display">
      <div className="total-label">Total Spent</div>
      <div className="total-amount">{formatCents(totalCents)}</div>
      <div className="total-glow" />
    </div>
  );
}
