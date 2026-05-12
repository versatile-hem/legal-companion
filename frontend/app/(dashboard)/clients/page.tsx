'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Plus, Filter, RefreshCw, ChevronLeft, ChevronRight,
  Mail, Phone, MapPin, ClipboardList, Receipt, Activity, Edit, Trash2, Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { DataTable, Column } from '@/components/ui/DataTable';
import { FormDrawer } from '@/components/ui/FormDrawer';
import { StatusBadge, jobStatusBadge, invoiceStatusBadge, priorityBadge } from '@/components/ui/StatusBadge';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader, KpiCard } from '@/components/ui/PageHeader';
import { clientsApi, jobsApi, invoicesApi, apiMethods } from '@/lib/api';
import type { Client, ClientRequest } from '@/types/client';
import type { ComplianceJob } from '@/types/compliance';
import type { Invoice } from '@/types/billing';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d?: string | null) => {
  if (!d) return '—';
  try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
};
const fmtCurrency = (n?: number) =>
  n == null ? '—' : '₹' + n.toLocaleString('en-IN');

function clientStatusVariant(s: string): 'success' | 'neutral' | 'danger' {
  if (s === 'ACTIVE') return 'success';
  if (s === 'INACTIVE') return 'neutral';
  return 'danger';
}

// ─── Client Form ──────────────────────────────────────────────────────────────
function ClientForm({ initial, onSave, onCancel, loading }: {
  initial?: Partial<ClientRequest>;
  onSave: (r: ClientRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<ClientRequest>({ name: '', entityType: 'PRIVATE_LIMITED', ...initial });
  const set = (k: keyof ClientRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-4 px-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Client Name *</label>
          <input value={form.name} onChange={set('name')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acme Corp Pvt Ltd" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Entity Type *</label>
          <select value={form.entityType} onChange={set('entityType')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['PRIVATE_LIMITED','PUBLIC_LIMITED','LLP','OPC','PARTNERSHIP','PROPRIETORSHIP','SECTION_8','TRUST'].map(t => (
              <option key={t} value={t}>{t.replace(/_/g,' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">CIN</label>
          <input value={form.cin ?? ''} onChange={set('cin')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="U67190HR2022PTC102061" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">PAN</label>
          <input value={form.pan ?? ''} onChange={set('pan')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="ABCDE1234F" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">GST</label>
          <input value={form.gst ?? ''} onChange={set('gst')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="29ABCDE1234F1Z5" />
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
          <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
          <input value={form.city ?? ''} onChange={set('city')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">State</label>
          <input value={form.state ?? ''} onChange={set('state')} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
          <textarea value={form.address ?? ''} onChange={set('address')} rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none resize-none" />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button onClick={onCancel} className="px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition">Cancel</button>
        <button onClick={() => onSave(form)} disabled={loading || !form.name} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
          {loading ? 'Saving…' : 'Save Client'}
        </button>
      </div>
    </div>
  );
}

// ─── Client Detail Drawer Tabs ────────────────────────────────────────────────
type Tab = 'overview' | 'entities' | 'jobs' | 'billing' | 'timeline';

function SkeletonRows({ n }: { n: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function OverviewTab({ client }: { client: Client }) {
  const F = ({ l, v }: { l: string; v?: string | null }) => (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{l}</p>
      <p className="text-sm font-medium text-slate-800">{v || '—'}</p>
    </div>
  );
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <F l="CIN" v={client.cin} />
          <F l="PAN" v={client.pan} />
          <F l="GST" v={client.gst} />
          <F l="Entity Type" v={client.entityType?.replace(/_/g,' ')} />
          <F l="Assigned To" v={client.assignedManagerName} />
          <F l="Client Since" v={fmt(client.createdAt)} />
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Contact Details</h3>
        <div className="space-y-2">
          {client.email && <div className="flex items-center gap-2 text-sm text-slate-700"><Mail className="w-4 h-4 text-slate-400" />{client.email}</div>}
          {client.phone && <div className="flex items-center gap-2 text-sm text-slate-700"><Phone className="w-4 h-4 text-slate-400" />{client.phone}</div>}
          {(client.city || client.state) && (
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              {[client.city, client.state].filter(Boolean).join(', ')}
            </div>
          )}
          {client.address && <p className="text-sm text-slate-600 pl-6">{client.address}</p>}
        </div>
      </div>
    </div>
  );
}

function EntitiesTab({ clientId }: { clientId: string }) {
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiMethods.get<any>(`/entities?clientOwnerId=${clientId}&size=50`)
      .then((r: any) => setEntities(r?.data?.content ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [clientId]);

  if (loading) return <SkeletonRows n={3} />;
  if (entities.length === 0)
    return <EmptyState icon={<Building2 className="w-5 h-5" />} title="No entities" description="Entities linked to this client will appear here." />;

  return (
    <div className="p-4 space-y-2">
      {entities.map((e: any) => (
        <div key={e.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">{e.entityName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{e.entityType?.replace(/_/g,' ')} · {e.cinLlpin || e.cin || '—'}</p>
          </div>
          <StatusBadge
            label={e.complianceStatus || e.status || ''}
            variant={e.complianceStatus === 'HEALTHY' ? 'success' : e.complianceStatus === 'OVERDUE' ? 'danger' : 'warning'}
          />
        </div>
      ))}
    </div>
  );
}

function TimelineTab({ client }: { client: Client }) {
  const events = [
    { date: client.updatedAt, action: 'Client record last updated', emoji: '✏️' },
    { date: client.createdAt, action: 'Client onboarded', emoji: '🎉' },
  ].filter(e => e.date);
  return (
    <div className="p-6">
      <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
        {events.map((ev, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[1.625rem] w-5 h-5 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-xs">
              {ev.emoji}
            </div>
            <p className="text-sm font-medium text-slate-800">{ev.action}</p>
            <p className="text-xs text-slate-400 mt-0.5">{fmt(ev.date)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientDetailDrawer({ client, onEdit }: { client: Client; onClose: () => void; onEdit: () => void }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [jobs, setJobs] = useState<ComplianceJob[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'jobs' && jobs.length === 0) {
      setLoading(true);
      jobsApi.list({ clientId: client.id, size: 50 })
        .then(r => setJobs((r.data as any).content ?? []))
        .finally(() => setLoading(false));
    }
    if (tab === 'billing' && invoices.length === 0) {
      setLoading(true);
      invoicesApi.list({ clientId: client.id, size: 50 })
        .then(r => setInvoices((r.data as any).content ?? []))
        .finally(() => setLoading(false));
    }
  }, [tab, client.id]);

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'entities', label: 'Entities', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'jobs', label: 'Jobs', icon: <ClipboardList className="w-3.5 h-3.5" /> },
    { id: 'billing', label: 'Billing', icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: 'timeline', label: 'Timeline', icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full -m-6">
      {/* Drawer subheader */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center font-bold">
              {client.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{client.name}</p>
              <p className="text-xs text-white/60">{client.entityType?.replace(/_/g,' ')} · {client.clientCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge label={client.status} variant={clientStatusVariant(client.status)} dot />
            <button onClick={onEdit} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition">
              <Edit className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition ${
                tab === t.id ? 'bg-white/20 font-medium' : 'text-white/60 hover:bg-white/10'
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        {tab === 'overview' && <OverviewTab client={client} />}
        {tab === 'entities' && <EntitiesTab clientId={client.id} />}
        {tab === 'jobs' && (
          loading ? <SkeletonRows n={4} /> :
          jobs.length === 0 ? (
            <EmptyState icon={<ClipboardList className="w-5 h-5" />} title="No jobs" description="Compliance jobs for this client will appear here." />
          ) : (
            <div className="p-4 space-y-2">
              {jobs.map(j => (
                <div key={j.id} className="p-3 bg-white border border-slate-100 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{j.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{j.jobNumber} · Due {fmt(j.dueDate)}</p>
                    </div>
                    {jobStatusBadge(j.status)}
                  </div>
                  <div className="flex gap-2 mt-2">{priorityBadge(j.priority)}</div>
                </div>
              ))}
            </div>
          )
        )}
        {tab === 'billing' && (
          loading ? <SkeletonRows n={4} /> :
          invoices.length === 0 ? (
            <EmptyState icon={<Receipt className="w-5 h-5" />} title="No invoices" description="Invoices for this client will appear here." />
          ) : (
            <div className="p-4 space-y-2">
              {invoices.map(inv => (
                <div key={inv.id} className="p-3 bg-white border border-slate-100 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-400">Due {fmt(inv.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{fmtCurrency(inv.totalAmount)}</p>
                    {invoiceStatusBadge(inv.status)}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        {tab === 'timeline' && <TimelineTab client={client} />}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const r = await clientsApi.list({ page, size: 15, ...(search ? { name: search } : {}), ...(filterStatus ? { status: filterStatus } : {}) });
      setClients((r.data as any).content ?? []);
      setTotal((r.data as any).totalElements ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleCreate = async (req: ClientRequest) => {
    setSaving(true);
    try { await clientsApi.create(req); setCreateOpen(false); fetchClients(); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (req: ClientRequest) => {
    if (!editClient) return;
    setSaving(true);
    try { await clientsApi.update(editClient.id, req); setEditClient(null); fetchClients(); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client? This cannot be undone.')) return;
    await clientsApi.delete(id);
    fetchClients();
  };

  const cols: Column<Client>[] = [
    {
      key: 'name', header: 'Client', sortable: true,
      render: c => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {c.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm">{c.name}</p>
            <p className="text-xs text-slate-400">{(c as any).clientCode ?? c.id.slice(0,8)}</p>
          </div>
        </div>
      ),
    },
    { key: 'entityType', header: 'Type', sortable: true,
      render: c => <span className="text-xs text-slate-600">{String(c.entityType||'').replace(/_/g,' ')}</span> },
    { key: 'state', header: 'State', sortable: true,
      render: c => <span className="text-sm text-slate-600">{c.state || '—'}</span> },
    { key: 'status', header: 'Status',
      render: c => <StatusBadge label={c.status} variant={clientStatusVariant(c.status)} dot /> },
    { key: 'createdAt', header: 'Since', sortable: true,
      render: c => <span className="text-xs text-slate-400">{fmt(c.createdAt)}</span> },
    {
      key: '_actions' as any, header: '',
      render: c => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={e => { e.stopPropagation(); setViewClient(c); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye className="w-3.5 h-3.5" /></button>
          <button onClick={e => { e.stopPropagation(); setEditClient(c); }} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"><Edit className="w-3.5 h-3.5" /></button>
          <button onClick={e => { e.stopPropagation(); handleDelete(c.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ),
    },
  ];

  const pageCount = Math.ceil(total / 15);
  const activeCount = clients.filter(c => c.status === 'ACTIVE').length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Clients"
        subtitle={`${total} total clients`}
        breadcrumb={['Platform', 'Clients']}
        actions={
          <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />New Client
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total Clients" value={total} icon={<Building2 className="w-5 h-5 text-blue-500" />} />
        <KpiCard label="Active" value={activeCount} variant="green" icon={<Activity className="w-5 h-5 text-white/80" />} />
        <KpiCard label="With GST" value={clients.filter(c => c.gst).length} icon={<Receipt className="w-5 h-5 text-slate-400" />} />
        <KpiCard label="Page" value={clients.length} sub={`Page ${page + 1} of ${Math.max(1, pageCount)}`} icon={<Filter className="w-5 h-5 text-slate-400" />} />
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(0); }} placeholder="Search clients…" className="w-64" />
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }} className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button onClick={fetchClients} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition">
          <RefreshCw className="w-3.5 h-3.5" />Refresh
        </button>
      </div>

      <DataTable
        columns={cols}
        data={clients}
        loading={loading}
        onRowClick={c => setViewClient(c)}
        rowClassName={() => 'group'}
        emptyMessage="No clients found. Click 'New Client' to add one."
      />

      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Showing {page * 15 + 1}–{Math.min((page + 1) * 15, total)} of {total}</span>
          <div className="flex items-center gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-2 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3">{page + 1} / {pageCount}</span>
            <button disabled={page >= pageCount - 1} onClick={() => setPage(p => p + 1)} className="p-2 border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* View Drawer */}
      <FormDrawer open={!!viewClient} onClose={() => setViewClient(null)} title={viewClient?.name ?? ''} subtitle="Client Profile" width="lg">
        {viewClient && (
          <ClientDetailDrawer
            client={viewClient}
            onClose={() => setViewClient(null)}
            onEdit={() => { setEditClient(viewClient); setViewClient(null); }}
          />
        )}
      </FormDrawer>

      {/* Create Drawer */}
      <FormDrawer open={createOpen} onClose={() => setCreateOpen(false)} title="New Client" subtitle="Add a new client to the platform">
        <ClientForm onSave={handleCreate} onCancel={() => setCreateOpen(false)} loading={saving} />
      </FormDrawer>

      {/* Edit Drawer */}
      <FormDrawer open={!!editClient} onClose={() => setEditClient(null)} title={`Edit — ${editClient?.name}`} subtitle="Update client information">
        {editClient && (
          <ClientForm
            initial={editClient as unknown as ClientRequest}
            onSave={handleUpdate}
            onCancel={() => setEditClient(null)}
            loading={saving}
          />
        )}
      </FormDrawer>
    </div>
  );
}
