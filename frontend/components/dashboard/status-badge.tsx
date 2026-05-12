'use client';

import React from 'react';

interface StatusBadgeProps {
  status: 'Pending' | 'In Review' | 'Filed' | 'Completed' | 'Overdue';
}

const statusConfig = {
  Pending: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  'In Review': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  Filed: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  Completed: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Overdue: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <div className={`${config.bg} ${config.border} border rounded-full px-3 py-1 inline-flex items-center gap-2`}>
      <span className={`${config.dot} w-2 h-2 rounded-full`}></span>
      <span className={`${config.text} text-xs font-semibold`}>{status}</span>
    </div>
  );
}
