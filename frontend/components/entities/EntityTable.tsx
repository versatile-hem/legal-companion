'use client';

import React from 'react';
import { Eye, Pencil, ClipboardList, ChevronLeft, ChevronRight, Building2, AlertCircle } from 'lucide-react';
import { useEntityStore } from '@/store/entityStore';
import { ENTITY_TYPE_LABELS, COMPLIANCE_STATUS_CONFIG, ENTITY_STATUS_CONFIG, LegalEntity } from '@/types/legalEntity';
import { format } from 'date-fns';

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(10)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function ComplianceBadge({ status }: { status: string }) {
  const cfg = COMPLIANCE_STATUS_CONFIG[status as keyof typeof COMPLIANCE_STATUS_CONFIG];
  if (!cfg) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 rounded-full" />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = ENTITY_STATUS_CONFIG[status as keyof typeof ENTITY_STATUS_CONFIG];
  if (!cfg) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const label = ENTITY_TYPE_LABELS[type as keyof typeof ENTITY_TYPE_LABELS] ?? type;
  return (
    <span className="inline-flex text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
      {label}
    </span>
  );
}

export default function EntityTable() {
  const {
    entities, isLoading, totalElements, totalPages, page, pageSize,
    setPage, openView, openEdit, openCompliance,
  } = useEntityStore();

  const startRow = page * pageSize + 1;
  const endRow = Math.min((page + 1) * pageSize, totalElements);

  function fmtDate(d?: string | null) {
    if (!d) return '—';
    try { return format(new Date(d), 'dd MMM yyyy'); } catch { return d; }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse min-w-[1100px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-10">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Entity Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Inc. Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">CIN / LLPIN</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">PAN</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">State</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Compliance</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Next Due</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && entities.length === 0 && (
              [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
            )}
            {!isLoading && entities.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Building2 className="w-12 h-12 text-slate-200" />
                    <p className="font-medium text-slate-500">No entities found</p>
                    <p className="text-xs">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
            {entities.map((entity, idx) => (
              <EntityRow
                key={entity.id}
                entity={entity}
                index={page * pageSize + idx + 1}
                fmtDate={fmtDate}
                onView={() => openView(entity)}
                onEdit={() => openEdit(entity)}
                onCompliance={() => openCompliance(entity)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-white shrink-0">
        <span className="text-xs text-slate-500">
          {totalElements === 0 ? '0 results' : `${startRow}–${endRow} of ${totalElements}`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const pg = totalPages <= 7 ? i : Math.max(0, Math.min(page - 3, totalPages - 7)) + i;
            return (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`text-xs w-7 h-7 rounded font-medium transition ${
                  pg === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {pg + 1}
              </button>
            );
          })}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EntityRow({
  entity, index, fmtDate, onView, onEdit, onCompliance,
}: {
  entity: LegalEntity;
  index: number;
  fmtDate: (d?: string | null) => string;
  onView: () => void;
  onEdit: () => void;
  onCompliance: () => void;
}) {
  const isOverdue =
    entity.nextDueDate && new Date(entity.nextDueDate) < new Date();

  return (
    <tr className="hover:bg-slate-50/60 group transition-colors">
      <td className="px-4 py-3 text-xs text-slate-400 font-mono">{index}</td>
      <td className="px-4 py-3">
        <div>
          <button
            onClick={onView}
            className="font-medium text-slate-900 hover:text-blue-600 transition text-left leading-snug"
          >
            {entity.entityName}
          </button>
          {entity.email && (
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{entity.email}</p>
          )}
        </div>
      </td>
      <td className="px-4 py-3"><TypeBadge type={entity.entityType} /></td>
      <td className="px-4 py-3 text-xs text-slate-600">{fmtDate(entity.incorporationDate)}</td>
      <td className="px-4 py-3 font-mono text-xs text-slate-700">{entity.cinLlpin ?? '—'}</td>
      <td className="px-4 py-3 font-mono text-xs text-slate-700">{entity.pan ?? '—'}</td>
      <td className="px-4 py-3 text-xs text-slate-600 truncate max-w-[100px]">{entity.state ?? '—'}</td>
      <td className="px-4 py-3">
        <ComplianceBadge status={entity.complianceStatus} />
      </td>
      <td className="px-4 py-3">
        {entity.nextDueDate ? (
          <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
            {isOverdue && <AlertCircle className="w-3 h-3" />}
            {fmtDate(entity.nextDueDate)}
          </span>
        ) : <span className="text-xs text-slate-400">—</span>}
      </td>
      <td className="px-4 py-3"><StatusBadge status={entity.status} /></td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionButton label="View" icon={Eye} onClick={onView} />
          <ActionButton label="Edit" icon={Pencil} onClick={onEdit} />
          <ActionButton label="Compliance" icon={ClipboardList} onClick={onCompliance} color="text-indigo-600 hover:bg-indigo-50" />
        </div>
      </td>
    </tr>
  );
}

function ActionButton({
  label, icon: Icon, onClick, color = 'text-slate-600 hover:bg-slate-100',
}: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded transition ${color}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
