'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T, idx: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  stickyHeader?: boolean;
}

export function DataTable<T extends object>({
  columns,
  data,
  keyField = 'id' as keyof T,
  loading,
  emptyMessage = 'No records found',
  onRowClick,
  rowClassName,
  stickyHeader,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = (a as any)[sortKey]; const bv = (b as any)[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: string }) => {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-blue-500" />
      : <ChevronDown className="w-3 h-3 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="overflow-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {columns.map(c => (
                <th key={String(c.key)} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-slate-50">
                {columns.map((c, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${40 + (j * 15) % 40}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-sm min-w-max">
        <thead className={`bg-slate-50 border-b border-slate-100 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
          <tr>
            {columns.map(c => (
              <th
                key={String(c.key)}
                className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap ${c.sortable ? 'cursor-pointer hover:text-slate-800 select-none' : ''}`}
                style={c.width ? { width: c.width } : undefined}
                onClick={() => c.sortable && handleSort(String(c.key))}
              >
                <div className="flex items-center gap-1">
                  {c.header}
                  {c.sortable && <SortIcon col={String(c.key)} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : sorted.map((row, idx) => (
            <tr
              key={String(row[keyField] ?? idx)}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors hover:bg-slate-50/80 ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName?.(row) ?? ''}`}
            >
              {columns.map(c => (
                <td key={String(c.key)} className="px-4 py-3 text-slate-700 whitespace-nowrap">
                  {c.render
                    ? c.render(row, idx)
                    : String((row as any)[String(c.key)] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
