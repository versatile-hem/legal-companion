'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MoreVertical, AlertTriangle } from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { cn } from '@/lib/utils';

interface AssignmentCardProps {
  assignment: Assignment;
  isExpanded?: boolean;
  onExpand?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    WAITING_FOR_CLIENT: 'bg-orange-100 text-orange-800',
    UNDER_REVIEW: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    BLOCKED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getPrioritColor = (priority: string) => {
  const colors: Record<string, string> = {
    LOW: 'text-gray-500',
    MEDIUM: 'text-blue-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-red-600',
  };
  return colors[priority] || 'text-gray-500';
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    MGT_7: '📋',
    INCORPORATION: '🏢',
    TRADEMARK: '™️',
    DIRECTORS: '👔',
    COMPLIANCE: '✅',
    ANNUAL: '📅',
    TAX: '💰',
    OTHER: '📌',
  };
  return icons[type] || '📌';
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  WAITING_FOR_CLIENT: 'Waiting',
  UNDER_REVIEW: 'Under Review',
  COMPLETED: 'Completed',
  BLOCKED: 'Blocked',
  CANCELLED: 'Cancelled',
};

const typeLabels: Record<string, string> = {
  MGT_7: 'MGT-7',
  INCORPORATION: 'Incorporation',
  TRADEMARK: 'Trademark',
  DIRECTORS: 'Directors',
  COMPLIANCE: 'Compliance',
  ANNUAL: 'Annual',
  TAX: 'Tax',
  OTHER: 'Other',
};

const priorityLabels: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export default function AssignmentCard({
  assignment,
  isExpanded = false,
  onExpand,
  onEdit,
  onDelete,
}: AssignmentCardProps) {
  const [showMenus, setShowMenus] = useState(false);

  // Calculate progress
  const totalTasks = assignment.tasks?.length || 0;
  const completedTasks = assignment.tasks?.filter((t) => t.status === 'COMPLETED').length || 0;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Check if overdue
  const isOverdue =
    assignment.targetCompletionDate &&
    new Date(assignment.targetCompletionDate) < new Date() &&
    assignment.status !== 'COMPLETED';

  // Format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div
      className={cn(
        'border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200',
        isExpanded ? 'bg-blue-50 border-blue-200' : 'bg-white hover:shadow-sm'
      )}
    >
      {/* Main Card Row */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => onExpand?.(assignment.id)}
      >
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Card Content */}
          <div className="col-span-8">
            {/* Title Row */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{getTypeIcon(assignment.assignmentType)}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate">
                  {assignment.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {assignment.client?.name || 'N/A'}
                </p>
              </div>
            </div>

            {/* Status & Progress Row */}
            <div className="flex items-center gap-3 text-sm">
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', getStatusColor(assignment.status))}>
                {statusLabels[assignment.status] || assignment.status}
              </span>

              {/* Progress Bar */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {completedTasks}/{totalTasks}
                </span>
              </div>
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                👤 {assignment.owner?.firstName || 'Unassigned'}
              </span>
              {assignment.riskLevel && assignment.riskLevel === 'HIGH' && (
                <span className="flex items-center gap-1 text-red-600 font-medium">
                  <AlertTriangle size={14} /> High Risk
                </span>
              )}
            </div>
          </div>

          {/* Right Side: Type & Date & Actions */}
          <div className="col-span-4 flex flex-col items-end gap-2">
            {/* Type & Date Row */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-medium">
                {typeLabels[assignment.assignmentType] || assignment.assignmentType}
              </span>
              <span
                className={cn(
                  'font-medium',
                  isOverdue ? 'text-red-600' : 'text-gray-600'
                )}
              >
                Due: {formatDate(assignment.targetCompletionDate)}
              </span>
            </div>

            {/* Priority & Actions Row */}
            <div className="flex items-center gap-2">
              <span className={cn('font-semibold text-xs', getPrioritColor(assignment.priority))}>
                {priorityLabels[assignment.priority] || assignment.priority}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand?.(assignment.id);
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp size={18} className="text-gray-600" />
                ) : (
                  <ChevronDown size={18} className="text-gray-600" />
                )}
              </button>

              {/* More Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenus(!showMenus);
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <MoreVertical size={18} className="text-gray-600" />
                </button>

                {showMenus && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(assignment.id);
                        setShowMenus(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(assignment.id);
                        setShowMenus(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-blue-50 p-4 space-y-4">
          {/* Description */}
          {assignment.description && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Description</p>
              <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
            </div>
          )}

          {/* Tasks */}
          {totalTasks > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Tasks ({completedTasks}/{totalTasks})</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {assignment.tasks?.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 bg-white rounded text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={task.status === 'COMPLETED'}
                      className="w-4 h-4 rounded cursor-pointer"
                      readOnly
                    />
                    <span className="flex-1 truncate">{task.name}</span>
                    {task.estimatedHours && (
                      <span className="text-xs text-gray-500">{task.estimatedHours}h</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onEdit?.(assignment.id)}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            <button className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
              View Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
