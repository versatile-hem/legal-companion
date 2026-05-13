'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Plus, Download, Trash2, Edit2 } from 'lucide-react';
import TaskSelectionModal from '@/components/assignments/TaskSelectionModal';
import TaskList from '@/components/assignments/TaskList';

export default function AssignmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'documents' | 'team'>('overview');
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Check if we should open tasks tab from URL hash
  React.useEffect(() => {
    if (searchParams.get('tab') === 'tasks') {
      setActiveTab('tasks');
    }
  }, [searchParams]);

  // Mock assignment data - will be replaced with real API calls
  const assignment = {
    id: params.id,
    assignmentNumber: 'ASG-2024-001',
    name: 'Legal Entity Formation - Tech Startup',
    description: 'Complete legal entity formation and compliance setup for a new technology startup including C-Corporation formation, registered agent setup, and initial compliance calendars.',
    status: 'in-progress',
    priority: 'high',
    assignmentType: 'formation',
    estimatedHours: 40,
    estimatedCost: 5000,
    clientBillingAmount: 7500,
    startDate: '2024-05-01',
    targetDate: '2024-06-01',
    estimatedDays: 31,
    riskAssessment: 'medium',
    taskCount: 5,
    clientName: 'TechStart Inc.', 
    director: {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com'
    },
    documents: [],
    team: [
      {
        id: '1',
        name: 'John Smith',
        role: 'Primary Director',
        email: 'john@example.com'
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'documents', label: 'Documents' },
    { id: 'team', label: 'Team' }
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{assignment.name}</h1>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                  {assignment.status === 'in-progress' ? 'In Progress' : assignment.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{assignment.assignmentNumber}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 pt-4 border-t border-gray-200 -mx-6 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Description */}
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
                </section>

                {/* Timeline */}
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Start Date</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(assignment.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Target Date</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(assignment.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated Days</p>
                      <p className="text-base font-medium text-gray-900">{assignment.estimatedDays}</p>
                    </div>
                  </div>
                </section>

                {/* Financial Summary */}
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Estimated Hours</p>
                      <p className="text-2xl font-bold text-blue-600">{assignment.estimatedHours}h</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Est. Cost</p>
                      <p className="text-2xl font-bold text-purple-600">${assignment.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Client Billing</p>
                      <p className="text-2xl font-bold text-green-600">${assignment.clientBillingAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </section>

                {/* Risk Assessment */}
                <section className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h2>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      assignment.riskAssessment === 'high' ? 'bg-red-100 text-red-700' :
                      assignment.riskAssessment === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {assignment.riskAssessment.charAt(0).toUpperCase() + assignment.riskAssessment.slice(1)} Risk
                    </div>
                    <p className="text-gray-700">Requires close monitoring and regular compliance checks</p>
                  </div>
                </section>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Tasks ({assignment.taskCount})</h2>
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </div>
                <TaskList assignmentId={assignment.id} />
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents</h3>
                <p className="text-gray-600">Documents will appear here as they are uploaded with tasks</p>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-4">
                {assignment.team.map((member) => (
                  <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-lg font-medium text-blue-600">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Details</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Client</p>
                  <p className="text-sm text-gray-900">{assignment.clientName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Primary Director</p>
                  <p className="text-sm text-gray-900">{assignment.director.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Priority</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    assignment.priority === 'high' ? 'bg-red-100 text-red-700' :
                    assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Type</p>
                  <p className="text-sm text-gray-900 capitalize">{assignment.assignmentType.replace('-', ' ')}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm">
                  Close Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Selection Modal */}
      {showTaskModal && (
        <TaskSelectionModal
          isOpen={showTaskModal}
          assignmentId={assignment.id}
          onClose={() => setShowTaskModal(false)}
        />
      )}
    </div>
  );
}
