'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, RefreshCw, Edit, Trash2, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Clock, ShieldAlert, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { DataTable, Column } from '@/components/ui/DataTable';
import { FormDrawer } from '@/components/ui/FormDrawer';
import { StatusBadge, kycStatusBadge } from '@/components/ui/StatusBadge';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader, KpiCard } from '@/components/ui/PageHeader';
import { DirectorEntitiesModal } from '@/components/directors/DirectorEntitiesModal';
import { directorsApi } from '@/lib/api';
import type { Director, DirectorRequest } from '@/types/director';

const fmt = (d?: string | null) => {
  if (!d) return '—';
  try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
};

function DirectorForm({ initial, onSave, onCancel, loading }: {
  initial?: Partial<DirectorRequest>;
  onSave: (r: DirectorRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<DirectorRequest>({ fullName: '', ...initial });
  const set = (k: keyof DirectorRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-4 px-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Full Name *</label>
          <input value={form.fullName} onChange={set('fullName')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Narayan Murthy" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">DIN</label>
          <input value={form.din ?? ''} onChange={set('din')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="00000000" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">PAN</label>
          <input value={form.pan ?? ''} onChange={set('pan')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="ABCDE1234F" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
          <input type="email" value={form.email ?? ''} onChange={set('email')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
          <input value={form.phone ?? ''} onChange={set('phone')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Designation</label>
          <input value={form.designation ?? ''} onChange={set('designation')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="Managing Director" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">KYC Status</label>
          <select value={form.kycStatus ?? 'PENDING'} onChange={set('kycStatus')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="VERIFIED">Verified</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">KYC Due Date</label>
          <input type="date" value={form.kycDueDate ?? ''} onChange={set('kycDueDate')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">DSC Valid Until</label>
          <input type="date" value={form.dscValidUntil ?? ''} onChange={set('dscValidUntil')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Designation</label>
          <input value={form.designation ?? ''} onChange={set('designation')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="Managing Director" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button onClick={onCancel} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition">Cancel</button>
        <button onClick={() => onSave(form)} disabled={loading || !form.fullName} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? 'Saving…' : 'Save Director'}
        </button>
      </div>
    </div>
  );
}

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filterKyc, setFilterKyc] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDir, setEditDir] = useState<Director | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [entitiesModalOpen, setEntitiesModalOpen] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);

  const fetchDirectors = useCallback(async () => {
    setLoading(true);
    try {
      const r = await directorsApi.list({ page, size: 15, ...(search ? { name: search } : {}), ...(filterKyc ? { kycStatus: filterKyc } : {}) });
      setDirectors((r.data as any).content ?? []);
      setTotal((r.data as any).totalElements ?? 0);
    } finally { setLoading(false); }
  }, [page, search, filterKyc]);

  useEffect(() => { fetchDirectors(); }, [fetchDirectors]);

  const handleCreate = async (req: DirectorRequest) => {
    setSaving(true);
    try { await directorsApi.create(req); setCreateOpen(false); fetchDirectors(); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (req: DirectorRequest) => {
    if (!editDir) return;
    setSaving(true);
    try { await directorsApi.update(editDir.id, req); setEditDir(null); fetchDirectors(); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this director?')) return;
    await directorsApi.delete(id);
    fetchDirectors();
  };

  const verified = directors.filter(d => d.kycStatus === 'VERIFIED').length;
  const pending = directors.filter(d => d.kycStatus === 'PENDING').length;
  const expired = directors.filter(d => d.kycStatus === 'EXPIRED').length;

  const cols: Column<Director>[] = [
    {
      key: 'name', header: 'Director', sortable: true,
      render: d => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {d.fullName?.split(' ').map(n => n[0]).slice(0,2).join('') || 'D'}
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm">{d.fullName}</p>
            <p className="text-xs text-slate-400">{d.designation || 'Director'}</p>
          </div>
        </div>
      ),
    },
    { key: 'din', header: 'DIN', render: d => <span className="text-xs font-mono text-slate-600">{d.din || '—'}</span> },
    { key: 'pan', header: 'PAN', render: d => <span className="text-xs font-mono text-slate-600">{d.pan || '—'}</span> },
    { key: 'kycStatus', header: 'KYC Status', sortable: true,
      render: d => kycStatusBadge(d.kycStatus) },
    { key: 'kycDueDate', header: 'KYC Due', sortable: true,
      render: d => <span className="text-xs text-slate-500">{fmt(d.kycDueDate)}</span> },
    { key: 'dscValidUntil', header: 'DSC Valid', sortable: true,
      render: d => <span className="text-xs text-slate-500">{fmt(d.dscValidUntil)}</span> },
    {
      key: '_actions' as any, header: '',
      render: d => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={e => { e.stopPropagation(); setSelectedDirector(d); setEntitiesModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View companies">
            <Building2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={e => { e.stopPropagation(); setEditDir(d); }} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button onClick={e => { e.stopPropagation(); handleDelete(d.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const pageCount = Math.ceil(total / 15);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Directors"
        subtitle={`${total} total directors`}
        breadcrumb={['Platform', 'Directors']}
        actions={
          <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />New Director
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total Directors" value={total} icon={<Users className="w-5 h-5 text-violet-500" />} />
        <KpiCard label="KYC Verified" value={verified} variant="green" icon={<CheckCircle className="w-5 h-5 text-white/80" />} />
        <KpiCard label="KYC Pending" value={pending} variant="amber" icon={<Clock className="w-5 h-5 text-white/80" />} />
        <KpiCard label="KYC Expired" value={expired} variant="red" icon={<ShieldAlert className="w-5 h-5 text-white/80" />} />
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(0); }} placeholder="Search directors…" className="w-64" />
        <select value={filterKyc} onChange={e => { setFilterKyc(e.target.value); setPage(0); }} className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="">All KYC Status</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="EXPIRED">Expired</option>
        </select>
        <button onClick={fetchDirectors} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition">
          <RefreshCw className="w-3.5 h-3.5" />Refresh
        </button>
      </div>

      <DataTable
        columns={cols}
        data={directors}
        loading={loading}
        rowClassName={() => 'group'}
        emptyMessage="No directors found. Click 'New Director' to add one."
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

      <FormDrawer open={createOpen} onClose={() => setCreateOpen(false)} title="New Director" subtitle="Add a director profile">
        <DirectorForm onSave={handleCreate} onCancel={() => setCreateOpen(false)} loading={saving} />
      </FormDrawer>

      <FormDrawer open={!!editDir} onClose={() => setEditDir(null)} title={`Edit — ${editDir?.fullName}`} subtitle="Update director information">
        {editDir && (
          <DirectorForm
            initial={editDir as unknown as DirectorRequest}
            onSave={handleUpdate}
            onCancel={() => setEditDir(null)}
            loading={saving}
          />
        )}
      </FormDrawer>

      {selectedDirector && (
        <DirectorEntitiesModal
          isOpen={entitiesModalOpen}
          onClose={() => {
            setEntitiesModalOpen(false);
            setSelectedDirector(null);
          }}
          directorId={selectedDirector.id}
          directorName={selectedDirector.fullName}
        />
      )}
    </div>
  );
}
