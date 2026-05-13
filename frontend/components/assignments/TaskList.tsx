'use client';

import React, { useState } from 'react';
import { Trash2, Edit, ChevronDown, ChevronUp, FileText, CheckSquare, DollarSign, Plus } from 'lucide-react';
import { Task } from '@/types/entities';
import { useFetchAssignmentTasks, useDeleteTask } from '@/hooks/useTaskApi';

interface TaskListProps {
  assignmentId: string;
  onAddTask?: () => void;
}

export default function TaskList({ assignmentId, onAddTask }: TaskListProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const { data: tasks, isLoading, error } = useFetchAssignmentTasks(assignmentId);
  const { mutate: deleteTask } = useDeleteTask();

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask({ assignmentId, taskId });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading tasks. Please try again.
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 mb-4">No tasks yet</p>
        <button
          onClick={onAddTask}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add First Task
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">Tasks ({tasks.length})</h3>
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border border-slate-200 rounded-lg bg-white overflow-hidden hover:shadow-md transition"
          >
            {/* Task Row */}
            <div
              className="p-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50"
              onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
            >
              {/* Expand Button */}
              <div className="flex-shrink-0 pt-1">
                {expandedTaskId === task.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 truncate">
                      {task.title || task.name}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                      {task.description}
                    </p>
                  </div>

                  {/* Status and Priority */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`text-xs font-bold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                {/* Financial Info (Visible by default) - Hidden in list, shown only in detail */}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                  {task.dueDate && (
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                  {task.taskCategory && (
                    <span className="inline-block px-2 py-1 bg-slate-100 rounded text-slate-600">
                      {task.taskCategory}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 flex gap-2">
                <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedTaskId === task.id && (
              <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-4">
                {/* Financial Details */}
                {(task.estimatedFee || task.outOfPocketExpense) && (
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <h5 className="flex items-center gap-2 font-medium text-sm text-slate-700 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Financial Details
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {task.estimatedFee && (
                        <div>
                          <span className="text-slate-600">Estimated Fee:</span>
                          <p className="font-semibold text-slate-900">₹{task.estimatedFee.toFixed(2)}</p>
                        </div>
                      )}
                      {task.outOfPocketExpense && (
                        <div>
                          <span className="text-slate-600">Out of Pocket:</span>
                          <p className="font-semibold text-slate-900">₹{task.outOfPocketExpense.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                    {task.estimatedFee && task.outOfPocketExpense && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <span className="text-slate-600">Total:</span>
                        <p className="font-semibold text-amber-700">
                          ₹{(task.estimatedFee + task.outOfPocketExpense).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Documents */}
                {task.documents && task.documents.length > 0 && (
                  <div>
                    <h5 className="flex items-center gap-2 font-medium text-sm text-slate-700 mb-2">
                      <FileText className="w-4 h-4" />
                      Documents ({task.documents.length})
                    </h5>
                    <div className="space-y-1">
                      {task.documents.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-600 hover:text-blue-700 truncate"
                        >
                          📎 {doc.documentName}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checklists */}
                {task.checklists && task.checklists.length > 0 && (
                  <div>
                    <h5 className="flex items-center gap-2 font-medium text-sm text-slate-700 mb-2">
                      <CheckSquare className="w-4 h-4" />
                      Checklist ({task.checklists.filter((c) => c.isCompleted).length}/{task.checklists.length})
                    </h5>
                    <div className="space-y-1.5">
                      {task.checklists.map((item) => (
                        <label key={item.id} className="flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={item.isCompleted}
                            readOnly
                            className="w-4 h-4 rounded text-blue-600 border-slate-300"
                          />
                          <span className={item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}>
                            {item.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
