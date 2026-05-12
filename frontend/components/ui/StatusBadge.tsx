import React from 'react';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

const VARIANTS: Record<Variant, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200/60',
  danger:  'bg-red-50 text-red-700 ring-red-200/60',
  info:    'bg-blue-50 text-blue-700 ring-blue-200/60',
  neutral: 'bg-slate-50 text-slate-600 ring-slate-200/60',
  purple:  'bg-purple-50 text-purple-700 ring-purple-200/60',
};

const DOTS: Record<Variant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  neutral: 'bg-slate-400',
  purple:  'bg-purple-500',
};

interface StatusBadgeProps {
  label: string;
  variant?: Variant;
  dot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ label, variant = 'neutral', dot = false, size = 'sm', className = '' }: StatusBadgeProps) {
  const sz = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ring-1 ${sz} ${VARIANTS[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOTS[variant]}`} />}
      {label}
    </span>
  );
}

// --- Pre-mapped status helpers ---

export function jobStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: Variant }> = {
    DRAFT:        { label: 'Draft',        variant: 'neutral' },
    PENDING_DOCS: { label: 'Pending Docs', variant: 'warning' },
    IN_PROGRESS:  { label: 'In Progress',  variant: 'info' },
    REVIEW:       { label: 'Review',       variant: 'purple' },
    FILED:        { label: 'Filed',        variant: 'success' },
    COMPLETED:    { label: 'Completed',    variant: 'success' },
    REJECTED:     { label: 'Rejected',     variant: 'danger' },
  };
  const cfg = map[status] ?? { label: status, variant: 'neutral' as Variant };
  return <StatusBadge label={cfg.label} variant={cfg.variant} dot />;
}

export function kycStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: Variant }> = {
    COMPLETED: { label: 'Completed', variant: 'success' },
    PENDING:   { label: 'Pending',   variant: 'warning' },
    OVERDUE:   { label: 'Overdue',   variant: 'danger' },
    EXPIRED:   { label: 'Expired',   variant: 'danger' },
  };
  const cfg = map[status] ?? { label: status, variant: 'neutral' as Variant };
  return <StatusBadge label={cfg.label} variant={cfg.variant} dot />;
}

export function invoiceStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: Variant }> = {
    DRAFT:     { label: 'Draft',     variant: 'neutral' },
    SENT:      { label: 'Sent',      variant: 'info' },
    PAID:      { label: 'Paid',      variant: 'success' },
    OVERDUE:   { label: 'Overdue',   variant: 'danger' },
    CANCELLED: { label: 'Cancelled', variant: 'neutral' },
  };
  const cfg = map[status] ?? { label: status, variant: 'neutral' as Variant };
  return <StatusBadge label={cfg.label} variant={cfg.variant} dot />;
}

export function priorityBadge(priority: string) {
  const map: Record<string, { label: string; variant: Variant }> = {
    LOW:      { label: 'Low',      variant: 'neutral' },
    MEDIUM:   { label: 'Medium',   variant: 'info' },
    HIGH:     { label: 'High',     variant: 'warning' },
    CRITICAL: { label: 'Critical', variant: 'danger' },
  };
  const cfg = map[priority] ?? { label: priority, variant: 'neutral' as Variant };
  return <StatusBadge label={cfg.label} variant={cfg.variant} />;
}
