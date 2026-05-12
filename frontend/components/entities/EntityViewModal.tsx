'use client';

import React from 'react';
import {
  X, Building2, MapPin, Hash, FileText, Users, ClipboardList, Cpu, AlertTriangle,
} from 'lucide-react';
import { useEntityStore } from '@/store/entityStore';
import {
  ENTITY_TYPE_LABELS,
  COMPLIANCE_STATUS_CONFIG,
  ENTITY_STATUS_CONFIG,
} from '@/types/legalEntity';
import { format } from 'date-fns';

function fmtDate(d?: string | null) {
  if (!d) return '—';
  try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
}

function Field({ label, value, children }: { label: string; value?: string | null; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      {children ?? <p className="text-sm text-slate-800 font-medium">{value || '—'}</p>}
    </div>
  );
}

export default function EntityViewModal() {
  const { viewEntity, closeAll } = useEntityStore();
  if (!viewEntity) return null;

  const e = viewEntity;
  const compliance = COMPLIANCE_STATUS_CONFIG[e.complianceStatus as keyof typeof COMPLIANCE_STATUS_CONFIG];
  const status = ENTITY_STATUS_CONFIG[e.status as keyof typeof ENTITY_STATUS_CONFIG];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={closeAll} />

      {/* Drawer */}
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-200">
        {/* Header */}
        <div className="flex items-start gap-4 px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{e.entityName}</h2>
            <p className="text-sm text-blue-100 mt-0.5">
              {ENTITY_TYPE_LABELS[e.entityType as keyof typeof ENTITY_TYPE_LABELS] ?? e.entityType}
              {e.state && ` · ${e.state}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {compliance && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${compliance.bg} ${compliance.color}`}>
                {compliance.label}
              </span>
            )}
            <button onClick={closeAll} className="p-1.5 rounded-lg hover:bg-white/20 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Basic Info */}
          <Section title="Basic Information" icon={FileText}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Entity Name" value={e.entityName} />
              <Field label="Entity Type" value={ENTITY_TYPE_LABELS[e.entityType as keyof typeof ENTITY_TYPE_LABELS]} />
              <Field label="Incorporation Date" value={fmtDate(e.incorporationDate)} />
              <Field label="Financial Year End" value={e.financialYearEnd} />
              <Field label="ROC" value={e.rocCode} />
              <Field label="Status">
                {status && (
                  <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                )}
              </Field>
            </div>
          </Section>

          {/* Tax Registration */}
          <Section title="Tax & Registration" icon={Hash}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="CIN / LLPIN" value={e.cinLlpin} />
              <Field label="PAN" value={e.pan} />
              <Field label="TAN" value={e.tan} />
              <Field label="GSTIN" value={e.gstin} />
            </div>
          </Section>

          {/* Contact */}
          <Section title="Contact & Address" icon={MapPin}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email" value={e.email} />
              <Field label="Phone" value={e.phone} />
              <Field label="Website" value={e.website} />
              <Field label="State" value={e.state} />
              <div className="col-span-2">
                <Field label="Registered Address" value={e.registeredOffice} />
              </div>
            </div>
          </Section>

          {/* Directors */}
          {e.directors && e.directors.length > 0 && (
            <Section title={`Directors (${e.directors.length})`} icon={Users}>
              <div className="space-y-2">
                {e.directors.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      {d.directorName?.charAt(0) ?? 'D'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{d.directorName}</p>
                      <p className="text-xs text-slate-500">{d.designation} · DIN: {d.din ?? '—'}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${d.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Compliance Summary */}
          {e.compliances && e.compliances.length > 0 && (
            <Section title="Recent Compliance" icon={ClipboardList}>
              <div className="space-y-2">
                {e.compliances.map((c) => {
                  const cfg = COMPLIANCE_STATUS_CONFIG[c.status as keyof typeof COMPLIANCE_STATUS_CONFIG];
                  return (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.complianceName}</p>
                        <p className="text-xs text-slate-400">{c.formName} · Due: {fmtDate(c.dueDate)}</p>
                      </div>
                      {cfg && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* AI Insights */}
          {(e.aiSummary || e.aiRiskScore != null) && (
            <Section title="AI Insights" icon={Cpu}>
              {e.aiRiskScore != null && (
                <div className="flex items-center gap-3 mb-3">
                  <RiskGauge score={e.aiRiskScore} />
                </div>
              )}
              {e.aiSummary && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 text-sm text-slate-700 leading-relaxed">
                  {e.aiSummary}
                </div>
              )}
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs text-slate-400">
            Last updated: {fmtDate(e.updatedAt)}
          </span>
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

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function RiskGauge({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const color = pct < 30 ? 'text-green-600 bg-green-50' : pct < 60 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  const label = pct < 30 ? 'Low Risk' : pct < 60 ? 'Medium Risk' : 'High Risk';
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${color}`}>
      <AlertTriangle className="w-4 h-4" />
      AI Risk Score: {score} — {label}
    </div>
  );
}


