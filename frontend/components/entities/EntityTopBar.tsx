'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, Download, Plus, X, ChevronDown, Building2 } from 'lucide-react';
import { useEntityStore } from '@/store/entityStore';
import {
  ENTITY_TYPE_LABELS,
  COMPLIANCE_STATUS_CONFIG,
  ENTITY_STATUS_CONFIG,
  INDIAN_STATES,
} from '@/types/legalEntity';

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function EntityTopBar() {
  const { filters, setFilter, clearFilters, openCreate, totalElements } = useEntityStore();
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounced(searchInput, 350);

  useEffect(() => {
    setFilter('search', debouncedSearch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const activeFilterCount = [
    filters.entityType,
    filters.state,
    filters.status,
    filters.complianceStatus,
  ].filter(Boolean).length;

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
      {/* Primary bar */}
      <div className="flex items-center gap-3 px-6 py-3">
        {/* Title */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 leading-tight">Entities</h1>
            <p className="text-xs text-slate-500">{totalElements} records</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, CIN, PAN, email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition ${
            showFilters || activeFilterCount > 0
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition">
            <X className="w-3 h-3" /> Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Entity
          </button>
        </div>
      </div>

      {/* Filter drawer */}
      {showFilters && (
        <div className="border-t border-slate-100 px-6 py-3 flex flex-wrap gap-3 bg-slate-50/80">
          <FilterSelect
            label="Entity Type"
            value={filters.entityType}
            onChange={(v) => setFilter('entityType', v)}
            options={Object.entries(ENTITY_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }))}
          />
          <FilterSelect
            label="State"
            value={filters.state}
            onChange={(v) => setFilter('state', v)}
            options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(v) => setFilter('status', v)}
            options={Object.entries(ENTITY_STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))}
          />
          <FilterSelect
            label="Compliance"
            value={filters.complianceStatus}
            onChange={(v) => setFilter('complianceStatus', v)}
            options={Object.entries(COMPLIANCE_STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))}
          />
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-500 font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-slate-200 rounded-lg py-1.5 px-2.5 bg-white focus:border-blue-500 outline-none min-w-[140px]"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
