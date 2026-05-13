'use client';

import React, { useState } from 'react';
import { X, Search, Plus, Loader2, DollarSign } from 'lucide-react';
import { useFetchAssignmentTasks, useAddTask, useSearchTaskTemplates } from '@/hooks/useTaskApi';

interface TaskSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentId: string;
}

export default function TaskSelectionModal({ isOpen, onClose, assignmentId }: TaskSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [estimatedFee, setEstimatedFee] = useState<number | ''>('');
  const [outOfPocketExpense, setOutOfPocketExpense] = useState<number | ''>('');
  const [taskCategory, setTaskCategory] = useState('');
  const [description, setDescription] = useState('');

  const { data: templates, isLoading: templatesLoading } = useSearchTaskTemplates(searchQuery, isOpen);
  const { mutate: addTask, isPending: isAdding } = useAddTask();
  const { refetch: refetchTasks } = useFetchAssignmentTasks(assignmentId, false);

  if (!isOpen) return null;

  const handleAddTask = async () => {
    if (!selectedTemplate) {
      alert('Please select a task template');
      return;
    }

    addTask(
      {
        assignmentId,
        data: {
          title: selectedTemplate,
          description: description || undefined,
          taskCategory: taskCategory || undefined,
          taskTemplate: selectedTemplate,
          estimatedFee: estimatedFee !== '' ? Number(estimatedFee) : undefined,
          outOfPocketExpense: outOfPocketExpense !== '' ? Number(outOfPocketExpense) : undefined,
        },
      },
      {
        onSuccess: () => {
          setSelectedTemplate(null);
          setEstimatedFee('');
          setOutOfPocketExpense('');
          setTaskCategory('');
          setDescription('');
          setSearchQuery('');
          refetchTasks();
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-white">Add Task</h2>
            <p className="text-xs text-blue-200">Select a task template and set financial details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Search Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Task Template *</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search task templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Template List */}
            <div className="border border-slate-300 rounded-lg divide-y max-h-48 overflow-y-auto">
              {templatesLoading ? (
                <div className="p-4 text-center text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                  Loading templates...
                </div>
              ) : templates && templates.length > 0 ? (
                templates.map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full px-4 py-3 text-left text-sm font-medium transition ${
                      selectedTemplate === template
                        ? 'bg-blue-100 text-blue-900 border-l-2 border-blue-600'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {template}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500">
                  {searchQuery ? 'No templates found' : 'Start typing to search'}
                </div>
              )}
            </div>
          </div>

          {/* Task Details Section */}
          {selectedTemplate && (
            <>
              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add task details or notes..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <input
                  type="text"
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  placeholder="e.g., Incorporation, Compliance, Annual..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Financial Fields */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 space-y-3">
                <h3 className="flex items-center gap-2 font-semibold text-slate-700">
                  <DollarSign className="w-4 h-4" />
                  Financial Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Estimated Fee */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Estimated Fee (Template Default)
                    </label>
                    <input
                      type="number"
                      value={estimatedFee}
                      onChange={(e) => setEstimatedFee(e.target.value ? Number(e.target.value) : '')}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  {/* Out of Pocket Expense */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Out of Pocket Expense
                    </label>
                    <input
                      type="number"
                      value={outOfPocketExpense}
                      onChange={(e) => setOutOfPocketExpense(e.target.value ? Number(e.target.value) : '')}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                {/* Financial Summary */}
                {(estimatedFee !== '' || outOfPocketExpense !== '') && (
                  <div className="border-t border-amber-200 pt-3 text-sm">
                    <div className="flex justify-between text-slate-700">
                      <span>Total Financial Commitment:</span>
                      <span className="font-semibold text-amber-700">
                        ₹{((Number(estimatedFee) || 0) + (Number(outOfPocketExpense) || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTask}
            disabled={!selectedTemplate || isAdding}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
