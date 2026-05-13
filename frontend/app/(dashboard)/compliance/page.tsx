'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList, Plus, RefreshCw, Edit, Trash2, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, Clock, PlayCircle, XCircle, Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { DataTable, Column } from '@/components/ui/DataTable';
import { FormDrawer } from '@/components/ui/FormDrawer';
import { jobStatusBadge, priorityBadge } from '@/components/ui/StatusBadge';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader, KpiCard } from '@/components/ui/PageHeader';
import { jobsApi } from '@/lib/api';
import type { ComplianceJob, ComplianceJobRequest } from '@/types/compliance';

const fmt = (d?: string | null) => {
  if (!d) return '—';
  try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
};

const JOB_TYPES = [
  'MGT_7', 'AOC_4', 'DIR_3_KYC', 'FORM_INC_20A', 'FORM_PAS_3', 'ANNUAL_RETURN',
  'GST_RETURN', 'TDS_RETURN', 'BOARD_MEETING', 'AGM', 'ROC_FILING', 'OTHER',
];

const JOB_STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED', 'ON_HOLD'];

function JobForm({ initial, onSave, onCancel, loading }: {
  initial?: Partial<ComplianceJobRequest>;
  onSave: (r: ComplianceJobRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<ComplianceJobRequest>({
    title: '', jobType: 'MGT_7', status: 'PENDING', priority: 'MEDIUM', financialYear: '2024-25', ...initial,
  });
  const set = (k: keyof ComplianceJobRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-4 px-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
          <input value={form.title} onChange={set('title')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="MGT-7 Annual Return 2024-25" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Job Type *</label>
          <select value={form.jobType} onChange={set('jobType')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
            {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, '-')}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select value={form.status} onChange={set('status')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
            {JOB_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
          <select value={form.priority} onChange={set('priority')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Financial Year</label>
          <input value={form.financialYear ?? ''} onChange={set('financialYear')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="2024-25" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label>
          <input type="date" value={form.dueDate ?? ''} onChange={set('dueDate')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Remarks</label>
          <textarea value={form.remarks ?? ''} onChange={set('remarks')} rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button onClick={onCancel} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition">Cancel</button>
        <button onClick={() => onSave(form)} disabled={loading || !form.title} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? 'Saving…' : 'Save Job'}
        </button>
      </div>
    </div>
  );
}

export default function CompliancePage() {
  const [jobs, setJobs] = useState<ComplianceJob[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editJob, setEditJob] = useState<ComplianceJob | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await jobsApi.list({
        page, size: 15,
        ...(search ? { title: search } : {}),
        ...(filterStatus ? { status: filterStatus } : {}),
        ...(filterType ? { jobType: filterType } : {}),
      });
      setJobs((r.data as any).content ?? []);
      setTotal((r.data as any).totalElements ?? 0);
    } finally { setLoading(false); }
  }, [page, search, filterStatus, filterType]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleCreate = async (req: ComplianceJobRequest) => {
    setSaving(true);
    try { await jobsApi.create(req); setCreateOpen(false); fetchJobs(); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (req: ComplianceJobRequest) => {
    if (!editJob) return;
    setSaving(true);
    try { await jobsApi.update(editJob.id, req); setEditJob(null); fetchJobs(); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this compliance job?')) return;
    await jobsApi.delete(id);
    fetchJobs();
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await jobsApi.status(id, status);
    fetchJobs();
  };

  const overdueCount = jobs.filter(j => j.status === 'OVERDUE').length;
  const inProgressCount = jobs.filter(j => j.status === 'IN_PROGRESS').length;
  const completedCount = jobs.filter(j => j.status === 'COMPLETED').length;

  const STATUS_NEXT: Record<string, string | null> = {
    PENDING: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED', OVERDUE: 'IN_PROGRESS',
    COMPLETED: null, CANCELLED: null, ON_HOLD: 'IN_PROGRESS',
  };

  const cols: Column<ComplianceJob>[] = [
    {
      key: 'title', header: 'Job', sortable: true,
      render: j => (
        <div>
          <p className="font-medium text-slate-900 text-sm">{j.title}</p>
          <p className="text-xs text-slate-400">{j.jobNumber} · {j.financialYear}</p>
        </div>
      ),
    },
    { key: 'jobType', header: 'Type', sortable: true,
      render: j => <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-mono">{String(j.jobType).replace(/_/g,'-')}</span> },
    { key: 'entityName', header: 'Entity',
      render: j => <span className="text-sm text-slate-600">{j.entityName || '—'}</span> },
    { key: 'status', header: 'Status', sortable: true,
      render: j => jobStatusBadge(j.status) },
    { key: 'priority', header: 'Priority',
      render: j => priorityBadge(j.priority) },
    { key: 'dueDate', header: 'Due Date', sortable: true,
      render: j => <span className={`text-xs ${j.status === 'OVERDUE' ? 'text-red-600 font-medium' : 'text-slate-500'}`}>{fmt(j.dueDate)}</span> },
    {
      key: '_actions' as any, header: '',
      render: j => {
        const next = STATUS_NEXT[j.status];
        return (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            {next && (
              <button
                onClick={e => { e.stopPropagation(); handleStatusUpdate(j.id, next); }}
                title={`Mark as ${next.replace(/_/g,' ')}`}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                <PlayCircle className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={e => { e.stopPropagation(); setEditJob(j); }} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"><Edit className="w-3.5 h-3.5" /></button>
            <button onClick={e => { e.stopPropagation(); handleDelete(j.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        );
      },
    },
  ];

  const pageCount = Math.ceil(total / 15);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Compliance Jobs"
        subtitle={`${total} total jobs`}
        breadcrumb={['Platform', 'Compliance']}
        actions={
          <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />New Job
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total Jobs" value={total} icon={<ClipboardList className="w-5 h-5 text-blue-500" />} />
        <KpiCard label="In Progress" value={inProgressCount} variant="blue" icon={<Loader2 className="w-5 h-5 text-white/80" />} />
        <KpiCard label="Completed" value={completedCount} variant="green" icon={<CheckCircle className="w-5 h-5 text-white/80" />} />
        <KpiCard label="Overdue" value={overdueCount} variant="red" icon={<AlertTriangle className="w-5 h-5 text-white/80" />} />
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(0); }} placeholder="Search jobs…" className="w-64" />
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }} className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="">All Status</option>
          {JOB_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
        </select>
        <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(0); }} className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="">All Types</option>
          {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g,'-')}</option>)}
        </select>
        <button onClick={fetchJobs} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition">
          <RefreshCw className="w-3.5 h-3.5" />Refresh
        </button>
      </div>

      <DataTable
        columns={cols}
        data={jobs}
        loading={loading}
        rowClassName={() => 'group'}
        emptyMessage="No compliance jobs found. Click 'New Job' to create one."
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

      <FormDrawer open={createOpen} onClose={() => setCreateOpen(false)} title="New Compliance Job" subtitle="Create a new compliance filing job">
        <JobForm onSave={handleCreate} onCancel={() => setCreateOpen(false)} loading={saving} />
      </FormDrawer>

      <FormDrawer open={!!editJob} onClose={() => setEditJob(null)} title={`Edit — ${editJob?.title}`} subtitle="Update job details">
        {editJob && (
          <JobForm
            initial={editJob as unknown as ComplianceJobRequest}
            onSave={handleUpdate}
            onCancel={() => setEditJob(null)}
            loading={saving}
          />
        )}
      </FormDrawer>
    </div>
  );
}
