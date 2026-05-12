'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, Save, Loader2 } from 'lucide-react';
import { useEntityStore } from '@/store/entityStore';
import {
  ENTITY_TYPE_LABELS,
  INDIAN_STATES,
  LegalEntityRequest,
} from '@/types/legalEntity';

export default function EntityEditModal() {
  const { editEntity, updateEntity, closeAll, isLoading } = useEntityStore();
  if (!editEntity) return null;

  const e = editEntity;

  const [form, setForm] = useState<LegalEntityRequest>({
    entityName: e.entityName ?? '',
    entityType: e.entityType ?? 'PRIVATE_LIMITED',
    incorporationDate: e.incorporationDate?.split('T')[0] ?? '',
    financialYearEnd: e.financialYearEnd ?? '',
    rocCode: e.rocCode ?? '',
    cinLlpin: e.cinLlpin ?? '',
    pan: e.pan ?? '',
    tan: e.tan ?? '',
    gstin: e.gstin ?? '',
    registeredOffice: e.registeredOffice ?? '',
    state: e.state ?? '',
    email: e.email ?? '',
    phone: e.phone ?? '',
    website: e.website ?? '',
  });

  function set(field: keyof LegalEntityRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    await updateEntity(e.id, form);
    closeAll();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900">Edit Entity</h2>
            <p className="text-xs text-slate-400">{e.entityName}</p>
          </div>
          <button onClick={closeAll} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <FormSection title="Basic Information">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField label="Entity Name *">
                  <input
                    type="text"
                    value={form.entityName}
                    onChange={(e) => set('entityName', e.target.value)}
                    required
                    className={inputCls}
                  />
                </FormField>
              </div>
              <FormField label="Entity Type *">
                <select
                  value={form.entityType}
                  onChange={(e) => set('entityType', e.target.value)}
                  required
                  className={inputCls}
                >
                  {Object.entries(ENTITY_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Incorporation Date">
                <input type="date" value={form.incorporationDate} onChange={(e) => set('incorporationDate', e.target.value)} className={inputCls} />
              </FormField>
              <FormField label="Financial Year End">
                <input type="text" placeholder="e.g. 31-Mar" value={form.financialYearEnd} onChange={(e) => set('financialYearEnd', e.target.value)} className={inputCls} />
              </FormField>
              <FormField label="ROC">
                <input type="text" value={form.rocCode} onChange={(e) => set('rocCode', e.target.value)} className={inputCls} />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Tax & Registration">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="CIN / LLPIN">
                <input type="text" value={form.cinLlpin} onChange={(e) => set('cinLlpin', e.target.value)} className={inputCls} />
              </FormField>
              <FormField label="PAN">
                <input type="text" value={form.pan} onChange={(e) => set('pan', e.target.value)} className={inputCls} />
              </FormField>
              <FormField label="TAN">
                <input type="text" value={form.tan} onChange={(e) => set('tan', e.target.value)} className={inputCls} />
              </FormField>
              <FormField label="GSTIN">
                <input type="text" value={form.gstin} onChange={(e) => set('gstin', e.target.value)} className={inputCls} />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Contact & Address">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Email">
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
              </FormField>
              <FormField label="Phone">
                <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
              </FormField>
              <FormField label="Website">
                <input type="url" value={form.website} onChange={(e) => set('website', e.target.value)} className={inputCls} />
              </FormField>
              <FormField label="State">
                <select value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
              <div className="col-span-2">
                <FormField label="Registered Address">
                  <textarea
                    rows={3}
                    value={form.registeredOffice}
                    onChange={(e) => set('registeredOffice', e.target.value)}
                    className={inputCls + ' resize-none'}
                  />
                </FormField>
              </div>
            </div>
          </FormSection>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={closeAll}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit as any}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white';

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}
