'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '@/store/assignmentStore';
import AssignmentHeader from '@/components/assignments/AssignmentHeader';
import AssignmentCard from '@/components/assignments/AssignmentCard';
import { Loader2 } from 'lucide-react';

export default function AssignmentsPage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    assignments,
    filters,
    isLoading,
    error,
    total,
    page,
    pageSize,
    fetchAssignments,
    setFilter,
    openCreateModal,
    deleteAssignment,
    setPage,
  } = useAssignmentStore();

  // Fetch assignments on mount and when filters/page change
  useEffect(() => {
    fetchAssignments();
  }, [filters, page, fetchAssignments]);

  // Keyboard shortcut: Cmd+Shift+N to create
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        openCreateModal();
      }
      // Cmd+K for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('assignment-search')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCreateModal]);

  const handleViewDetails = (id: string) => {
    router.push(`/assignments/${id}`);
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit modal
    console.log('Edit assignment:', id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      await deleteAssignment(id);
    }
  };

  const handleAddTask = (assignmentId: string) => {
    // Navigate to detail page with task modal open
    router.push(`/assignments/${assignmentId}#tasks`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AssignmentHeader
        onCreateClick={openCreateModal}
        onSearchChange={(query) => setFilter('search', query)}
        onFilterChange={(newFilters) => {
          setFilter('status', newFilters.status);
          setFilter('assignmentType', newFilters.assignmentType);
          setFilter('priority', newFilters.priority);
        }}
        filters={filters}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading && assignments.length === 0 ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <div className="text-red-600">
              <p className="font-semibold">Failed to load assignments</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => fetchAssignments()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : assignments.length === 0 ? (
          // Empty State
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No assignments yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first assignment
            </p>
            <button
              onClick={openCreateModal}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Assignment
            </button>
          </div>
        ) : (
          // Assignment List
          <div className="space-y-3">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                isExpanded={expandedId === assignment.id}
                onExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddTask={handleAddTask}
              />
            ))}

            {/* Pagination */}
            {total > pageSize && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * pageSize >= total}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TODO: Create Assignment Modal - will implement in next phase */}
    </div>
  );
}
