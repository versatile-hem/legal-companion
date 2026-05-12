'use client';

import React from 'react';
import { X, ClipboardList, AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useEntityStore } from '@/store/entityStore';
import { COMPLIANCE_STATUS_CONFIG, ENTITY_TYPE_LABELS } from '@/types/legalEntity';
import { format } from 'date-fns';

function fmtDate(d?: string | null) {
  if (!d) return '—';
  try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
}

const RISK_COLOR: Record<string, string> = {
  LOW:      'bg-green-50 text-green-700',
  MEDIUM:   'bg-amber-50 text-amber-700',
  HIGH:     'bg-red-50 text-red-700',
  CRITICAL: 'bg-red-100 text-red-800',
};

const STATUS_ICON: Record<string, React.ElementType> = {
  PENDING:    Clock,
  IN_PROGRESS: Clock,
  COMPLETED:  CheckCircle2,
  OVERDUE:    AlertTriangle,
  WAIVED:     XCircle,
};

export default function EntityComplianceModal() {
  const { complianceEntity, closeAll } = useEntityStore();
  if (!complianceEntity) return null;

  const e = complianceEntity;
  const items = e.compliances ?? [];

  const stats = {
    total:     items.length,
    pending:   items.filter((c) => c.status === 'PENDING' || c.status === 'IN_PROGRESS').length,
    overdue:   items.filter((c) => c.status === 'OVERDUE').length,
    completed: items.filter((c) => c.status === 'COMPLETED').length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3 px-6 py-4 border-b border-slate-200">
          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-slate-900">{e.entityName}</h2>
            <p className="text-xs text-slate-400">
              {ENTITY_TYPE_LABELS[e.entityType as keyof typeof ENTITY_TYPE_LABELS] ?? e.entityType} · Compliance Overview
            </p>
          </div>
          <button onClick={closeAll} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-200">
          <Stat label="Total" value={stats.total} />
          <Stat label="Pending" value={stats.pending} valueColor="text-amber-600" />
          <Stat label="Overdue" value={stats.overdue} valueColor="text-red-600" />
          <Stat label="Completed" value={stats.completed} valueColor="text-green-600" />
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <ClipboardList className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-sm">No compliance items recorded</p>
            </div>
          )}
          {items.map((c) => {
            const cfg = COMPLIANCE_STATUS_CONFIG[c.status as keyof typeof COMPLIANCE_STATUS_CONFIG];
            const Icon = STATUS_ICON[c.status] ?? Clock;
            const isOverdue = c.status === 'OVERDUE' || (c.dueDate && new Date(c.dueDate) < new Date() && c.status !== 'COMPLETED');

            return (
              <div
                key={c.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                  isOverdue ? 'border-red-100 bg-red-50/30' : 'border-slate-100 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg ? cfg.bg : 'bg-slate-100'}`}>
                  <Icon className={`w-4 h-4 ${cfg ? cfg.color : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{c.complianceName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.formName}</p>
                    </div>
                    {cfg && (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-slate-500">Due: <strong className={isOverdue ? 'text-red-600' : 'text-slate-700'}>{fmtDate(c.dueDate)}</strong></span>
                    {c.riskLevel && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RISK_COLOR[c.riskLevel] ?? 'bg-slate-100 text-slate-600'}`}>
                        {c.riskLevel} Risk
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50/50">
          <button
            onClick={closeAll}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, valueColor = 'text-slate-800' }: { label: string; value: number; valueColor?: string }) {
  return (
    <div className="flex flex-col items-center py-3">
      <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}
