import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: string[];
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {breadcrumb && (
          <p className="text-xs text-slate-400 mb-1">{breadcrumb.join(' / ')}</p>
        )}
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0 ml-4">{actions}</div>}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  sub,
  icon,
  trend,
  variant = 'default',
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  variant?: 'default' | 'blue' | 'green' | 'red' | 'amber';
}) {
  const variants = {
    default: 'bg-white border-slate-100',
    blue:    'bg-blue-600 border-blue-500 text-white',
    green:   'bg-emerald-600 border-emerald-500 text-white',
    red:     'bg-red-50 border-red-100',
    amber:   'bg-amber-50 border-amber-100',
  };

  const isColored = variant === 'blue' || variant === 'green';

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${variants[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wide mb-1.5 ${isColored ? 'text-white/70' : 'text-slate-500'}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold ${isColored ? 'text-white' : 'text-slate-900'}`}>
            {value}
          </p>
          {sub && <p className={`text-xs mt-1 ${isColored ? 'text-white/60' : 'text-slate-400'}`}>{sub}</p>}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isColored ? 'bg-white/20' : 'bg-slate-100'}`}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs ${trend.value >= 0 ? (isColored ? 'text-white/80' : 'text-emerald-600') : (isColored ? 'text-white/80' : 'text-red-500')}`}>
          <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          <span className={isColored ? 'text-white/50' : 'text-slate-400'}>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
