'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Receipt, Plus, RefreshCw, Edit, Trash2, ChevronLeft, ChevronRight,
  TrendingUp, AlertCircle, CheckCircle, DollarSign, Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { DataTable, Column } from '@/components/ui/DataTable';
import { FormDrawer } from '@/components/ui/FormDrawer';
import { invoiceStatusBadge } from '@/components/ui/StatusBadge';
import { SearchInput } from '@/components/ui/SearchInput';
import { PageHeader, KpiCard } from '@/components/ui/PageHeader';
import { invoicesApi } from '@/lib/api';
import type { Invoice, InvoiceRequest, BillingSummary } from '@/types/billing';

const fmt = (d?: string | null) => {
  if (!d) return '—';
  try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
};
const fmtCurrency = (n?: number) =>
  n == null ? '—' : '₹' + n.toLocaleString('en-IN');

const INVOICE_STATUSES = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'PARTIALLY_PAID'];

function InvoiceForm({ initial, onSave, onCancel, loading }: {
  initial?: Partial<InvoiceRequest>;
  onSave: (r: InvoiceRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<InvoiceRequest>({
    status: 'DRAFT', subtotal: 0, taxAmount: 0, totalAmount: 0, ...initial,
  });
  const set = (k: keyof InvoiceRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f: InvoiceRequest) => ({ ...f, [k]: e.target.value }));
  const setNum = (k: keyof InvoiceRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f: InvoiceRequest) => ({ ...f, [k]: parseFloat(e.target.value) || 0 }));

  return (
    <div className="space-y-4 px-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Issue Date</label>
          <input type="date" value={form.issueDate ?? ''} onChange={set('issueDate')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label>
          <input type="date" value={form.dueDate ?? ''} onChange={set('dueDate')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select value={form.status} onChange={set('status')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
            {INVOICE_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Subtotal (₹)</label>
          <input type="number" value={form.subtotal} onChange={setNum('subtotal')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" min="0" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Tax Amount (₹)</label>
          <input type="number" value={form.taxAmount} onChange={setNum('taxAmount')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" min="0" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Total Amount (₹)</label>
          <input type="number" value={form.totalAmount} onChange={setNum('totalAmount')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" min="0" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Paid Amount (₹)</label>
          <input type="number" value={form.paidAmount ?? 0} onChange={setNum('paidAmount')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" min="0" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Payment Date</label>
          <input type="date" value={form.paymentDate ?? ''} onChange={set('paymentDate')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
          <textarea value={form.notes ?? ''} onChange={set('notes')} rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button onClick={onCancel} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition">Cancel</button>
        <button onClick={() => onSave(form)} disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? 'Saving…' : 'Save Invoice'}
        </button>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editInv, setEditInv] = useState<Invoice | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, sumRes] = await Promise.all([
        invoicesApi.list({
          page, size: 15,
          ...(filterStatus ? { status: filterStatus } : {}),
        }),
        invoicesApi.summary(),
      ]);
      setInvoices((listRes.data as any).content ?? []);
      setTotal((listRes.data as any).totalElements ?? 0);
      setSummary(sumRes.data as BillingSummary);
    } finally { setLoading(false); }
  }, [page, filterStatus]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const handleCreate = async (req: InvoiceRequest) => {
    setSaving(true);
    try { await invoicesApi.create(req); setCreateOpen(false); fetchInvoices(); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (req: InvoiceRequest) => {
    if (!editInv) return;
    setSaving(true);
    try { await invoicesApi.update(editInv.id, req); setEditInv(null); fetchInvoices(); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    await invoicesApi.delete(id);
    fetchInvoices();
  };

  const cols: Column<Invoice>[] = [
    {
      key: 'invoiceNumber', header: 'Invoice', sortable: true,
      render: inv => (
        <div>
          <p className="font-medium text-slate-900 text-sm">{inv.invoiceNumber}</p>
          <p className="text-xs text-slate-400">{inv.clientName}</p>
        </div>
      ),
    },
    { key: 'issueDate', header: 'Issued', sortable: true,
      render: inv => <span className="text-xs text-slate-500">{fmt(inv.issueDate)}</span> },
    { key: 'dueDate', header: 'Due', sortable: true,
      render: inv => <span className={`text-xs ${inv.status === 'OVERDUE' ? 'text-red-600 font-medium' : 'text-slate-500'}`}>{fmt(inv.dueDate)}</span> },
    { key: 'subtotal', header: 'Subtotal',
      render: inv => <span className="text-sm text-slate-600">{fmtCurrency(inv.subtotal)}</span> },
    { key: 'totalAmount', header: 'Total', sortable: true,
      render: inv => <span className="text-sm font-semibold text-slate-900">{fmtCurrency(inv.totalAmount)}</span> },
    { key: 'status', header: 'Status',
      render: inv => invoiceStatusBadge(inv.status) },
    {
      key: '_actions' as any, header: '',
      render: inv => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={e => { e.stopPropagation(); setEditInv(inv); }} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"><Edit className="w-3.5 h-3.5" /></button>
          <button onClick={e => { e.stopPropagation(); handleDelete(inv.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ),
    },
  ];

  const pageCount = Math.ceil(total / 15);
  const overdueCount = invoices.filter(i => i.status === 'OVERDUE').length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Billing & Invoices"
        subtitle={`${total} total invoices`}
        breadcrumb={['Platform', 'Billing']}
        actions={
          <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />New Invoice
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Revenue Collected"
          value={fmtCurrency(summary?.totalPaid)}
          variant="green"
          icon={<CheckCircle className="w-5 h-5 text-white/80" />}
        />
        <KpiCard
          label="Outstanding"
          value={fmtCurrency(summary?.totalOutstanding)}
          variant="amber"
          icon={<TrendingUp className="w-5 h-5 text-white/80" />}
        />
        <KpiCard
          label="Overdue Invoices"
          value={overdueCount}
          variant="red"
          icon={<AlertCircle className="w-5 h-5 text-white/80" />}
        />
        <KpiCard
          label="Total Invoices"
          value={total}
          icon={<Receipt className="w-5 h-5 text-slate-400" />}
        />
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(0); }} placeholder="Search invoices…" className="w-64" />
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }} className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="">All Status</option>
          {INVOICE_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
        </select>
        <button onClick={fetchInvoices} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition">
          <RefreshCw className="w-3.5 h-3.5" />Refresh
        </button>
      </div>

      <DataTable
        columns={cols}
        data={invoices}
        loading={loading}
        rowClassName={() => 'group'}
        emptyMessage="No invoices found. Click 'New Invoice' to create one."
      />

      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Showing {page * 15 + 1}–{Math.min((page + 1) * 15, total)} of {total}</span>
          <div className="flex items-center gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-2 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3">{page + 1} / {pageCount}</span>
            <button disabled={page >= pageCount - 1} onClick={() => setPage(p => p + 1)} className="p-2 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <FormDrawer open={createOpen} onClose={() => setCreateOpen(false)} title="New Invoice" subtitle="Create a new billing invoice">
        <InvoiceForm onSave={handleCreate} onCancel={() => setCreateOpen(false)} loading={saving} />
      </FormDrawer>

      <FormDrawer open={!!editInv} onClose={() => setEditInv(null)} title={`Edit — ${editInv?.invoiceNumber}`} subtitle="Update invoice details">
        {editInv && (
          <InvoiceForm
            initial={editInv as unknown as InvoiceRequest}
            onSave={handleUpdate}
            onCancel={() => setEditInv(null)}
            loading={saving}
          />
        )}
      </FormDrawer>
    </div>
  );
}
