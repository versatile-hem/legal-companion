'use client';

import React, { useState } from 'react';
import { X, Building2, Plus, Loader2 } from 'lucide-react';
import { useEntityStore } from '@/store/entityStore';
import {
  ENTITY_TYPE_LABELS,
  INDIAN_STATES,
  LegalEntityRequest,
} from '@/types/legalEntity';

const INITIAL: LegalEntityRequest = {
  entityName: '',
  entityType: 'PRIVATE_LIMITED',
  incorporationDate: '',
  financialYearEnd: '',
  rocCode: '',
  cinLlpin: '',
  pan: '',
  tan: '',
  gstin: '',
  registeredOffice: '',
  state: '',
  email: '',
  phone: '',
  website: '',
};

export default function EntityCreateModal() {
  const { createModalOpen, createEntity, closeAll, isLoading } = useEntityStore();
  const [form, setForm] = useState<LegalEntityRequest>(INITIAL);
  const [step, setStep] = useState(0);

  if (!createModalOpen) return null;

  function set(field: keyof LegalEntityRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    await createEntity(form);
    setForm(INITIAL);
    setStep(0);
    closeAll();
  }

  function handleClose() {
    setForm(INITIAL);
    setStep(0);
    closeAll();
  }

  const steps = ['Basic Info', 'Registration', 'Contact'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-white">New Entity</h2>
            <p className="text-xs text-blue-200">Add a legal entity to the portfolio</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/20 transition">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-slate-200">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`flex-1 py-2.5 text-sm font-medium transition border-b-2 ${
                step === i
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4">
            {step === 0 && (
              <>
                <FormField label="Entity Name *">
                  <input
                    type="text"
                    value={form.entityName}
                    onChange={(e) => set('entityName', e.target.value)}
                    placeholder="e.g. Acme Technologies Pvt Ltd"
                    required
                    className={inputCls}
                  />
                </FormField>
                <FormField label="Entity Type *">
                  <select value={form.entityType} onChange={(e) => set('entityType', e.target.value)} required className={inputCls}>
                    {Object.entries(ENTITY_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Incorporation Date">
                    <input type="date" value={form.incorporationDate} onChange={(e) => set('incorporationDate', e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="Financial Year End">
                    <input type="text" placeholder="31-Mar" value={form.financialYearEnd} onChange={(e) => set('financialYearEnd', e.target.value)} className={inputCls} />
                  </FormField>
                </div>
                <FormField label="ROC">
                  <input type="text" placeholder="Registrar of Companies" value={form.rocCode} onChange={(e) => set('rocCode', e.target.value)} className={inputCls} />
                </FormField>
              </>
            )}

            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="CIN / LLPIN">
                    <input type="text" placeholder="U12345MH2020PTC123456" value={form.cinLlpin} onChange={(e) => set('cinLlpin', e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="PAN">
                    <input type="text" placeholder="AAAAA9999A" value={form.pan} onChange={(e) => set('pan', e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="TAN">
                    <input type="text" value={form.tan} onChange={(e) => set('tan', e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="GSTIN">
                    <input type="text" value={form.gstin} onChange={(e) => set('gstin', e.target.value)} className={inputCls} />
                  </FormField>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Email">
                    <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="Phone">
                    <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="Website">
                    <input type="url" placeholder="https://" value={form.website} onChange={(e) => set('website', e.target.value)} className={inputCls} />
                  </FormField>
                  <FormField label="State">
                    <select value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </FormField>
                </div>
                <FormField label="Registered Address">
                  <textarea
                    rows={3}
                    value={form.registeredOffice}
                    onChange={(e) => set('registeredOffice', e.target.value)}
                    className={inputCls + ' resize-none'}
                  />
                </FormField>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition ${i === step ? 'bg-blue-600' : 'bg-slate-200'}`} />
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                Cancel
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 0 && !form.entityName}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !form.entityName}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
                  Create Entity
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = 'w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none bg-white';

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}
