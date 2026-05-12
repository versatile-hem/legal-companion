'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Bell,
  Zap,
  Plus,
  ChevronDown,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface AssignmentHeaderProps {
  onCreateClick: () => void;
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: any) => void;
  filters: any;
}

const statusOptions = [
  { id: 'PENDING', label: 'Pending', color: 'bg-yellow-50 text-yellow-700' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-50 text-blue-700' },
  { id: 'WAITING_FOR_CLIENT', label: 'Waiting for Client', color: 'bg-orange-50 text-orange-700' },
  { id: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-purple-50 text-purple-700' },
  { id: 'COMPLETED', label: 'Completed', color: 'bg-green-50 text-green-700' },
  { id: 'BLOCKED', label: 'Blocked', color: 'bg-red-50 text-red-700' },
];

const assignmentTypes = [
  { id: 'MGT_7', label: 'MGT-7' },
  { id: 'INCORPORATION', label: 'Incorporation' },
  { id: 'TRADEMARK', label: 'Trademark' },
  { id: 'DIRECTORS', label: 'Directors' },
  { id: 'COMPLIANCE', label: 'Compliance' },
  { id: 'ANNUAL', label: 'Annual' },
];

const priorityOptions = [
  { id: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { id: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { id: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { id: 'CRITICAL', label: 'Critical', color: 'bg-red-100 text-red-700' },
];

export default function AssignmentHeader({
  onCreateClick,
  onSearchChange,
  onFilterChange,
  filters,
}: AssignmentHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s: string) => s !== status)
      : [...filters.status, status];
    onFilterChange({ ...filters, status: newStatuses });
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.assignmentType.includes(type)
      ? filters.assignmentType.filter((t: string) => t !== type)
      : [...filters.assignmentType, type];
    onFilterChange({ ...filters, assignmentType: newTypes });
  };

  const handlePriorityToggle = (priority: string) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter((p: string) => p !== priority)
      : [...filters.priority, priority];
    onFilterChange({ ...filters, priority: newPriorities });
  };

  const activeFilterCount =
    filters.status.length + filters.assignmentType.length + filters.priority.length;

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Header Row */}
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Left: Title & Search */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">Assignments</h1>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search... (Cmd+K)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* AI Assistant */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Zap size={20} className="text-amber-500" />
          </button>

          {/* Create Assignment Button */}
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={18} />
            Create
          </button>

          {/* User Profile */}
          <button className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold flex items-center justify-center text-sm hover:shadow-md transition-shadow">
            JD
          </button>
        </div>
      </div>

      {/* Filter Bar Row */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-3 overflow-x-auto">
        {/* Main Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
              isFilterOpen || activeFilterCount > 0
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Filter size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Filter Dropdown Menu */}
          {isFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-4">
              {/* Status Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.id}
                      onClick={() => handleStatusToggle(status.id)}
                      className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-all ${
                        filters.status.includes(status.id)
                          ? `${status.color} border-current`
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Section */}
              <div className="pt-3 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">Type</h3>
                <div className="flex flex-wrap gap-2">
                  {assignmentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeToggle(type.id)}
                      className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-all ${
                        filters.assignmentType.includes(type.id)
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Section */}
              <div className="pt-3 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">Priority</h3>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map((priority) => (
                    <button
                      key={priority.id}
                      onClick={() => handlePriorityToggle(priority.id)}
                      className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-all ${
                        filters.priority.includes(priority.id)
                          ? `${priority.color} border-current`
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <button
                    onClick={() =>
                      onFilterChange({
                        status: [],
                        assignmentType: [],
                        priority: [],
                      })
                    }
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Status Pills */}
        <div className="flex gap-2 ml-2 pl-2 border-l border-gray-200">
          {['All', 'Active', 'My Tasks', 'Overdue'].map((pill) => (
            <button
              key={pill}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
