'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react';
import StatusBadge from './status-badge';

interface Assignment {
  id: string;
  name: string;
  client: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  status: 'Pending' | 'In Review' | 'Filed' | 'Completed' | 'Overdue';
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    name: 'DIR-3 KYC Filing',
    client: 'Acme Corporation',
    assignedTo: 'Raj Kumar',
    priority: 'High',
    dueDate: '2026-05-15',
    status: 'In Review',
  },
  {
    id: '2',
    name: 'Annual Return (MGT-7)',
    client: 'Tech Innovations Ltd',
    assignedTo: 'Priya Sharma',
    priority: 'Urgent',
    dueDate: '2026-05-10',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Board Resolution Draft',
    client: 'Global Solutions Inc',
    assignedTo: 'Amit Patel',
    priority: 'Medium',
    dueDate: '2026-05-20',
    status: 'Pending',
  },
  {
    id: '4',
    name: 'Share Transfer Documentation',
    client: 'StartUp Ventures',
    assignedTo: 'Neha Gupta',
    priority: 'Low',
    dueDate: '2026-05-25',
    status: 'Filed',
  },
  {
    id: '5',
    name: 'Compliance Audit Report',
    client: 'Finance Corp',
    assignedTo: 'Vikram Singh',
    priority: 'High',
    dueDate: '2026-05-12',
    status: 'Overdue',
  },
];

const priorityColors = {
  Low: 'text-gray-500',
  Medium: 'text-blue-600',
  High: 'text-amber-600',
  Urgent: 'text-red-600',
};

export default function AssignmentTable() {
  const [sortBy, setSortBy] = useState<'name' | 'dueDate' | 'priority'>('dueDate');
  const [sortDesc, setSortDesc] = useState(false);

  const sorted = [...mockAssignments].sort((a, b) => {
    let aVal, bVal;

    if (sortBy === 'name') {
      aVal = a.name;
      bVal = b.name;
    } else if (sortBy === 'dueDate') {
      aVal = new Date(a.dueDate).getTime();
      bVal = new Date(b.dueDate).getTime();
    } else {
      const priorityOrder = { Low: 0, Medium: 1, High: 2, Urgent: 3 };
      aVal = priorityOrder[a.priority];
      bVal = priorityOrder[b.priority];
    }

    return sortDesc ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1);
  });

  const SortHeader = ({ label, sortKey }: { label: string; sortKey: typeof sortBy }) => (
    <button
      onClick={() => {
        if (sortBy === sortKey) {
          setSortDesc(!sortDesc);
        } else {
          setSortBy(sortKey);
          setSortDesc(false);
        }
      }}
      className="flex items-center gap-2 font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      {label}
      {sortBy === sortKey && (
        sortDesc ? <ChevronDown size={16} /> : <ChevronUp size={16} />
      )}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Open Assignments</h3>
        <p className="text-sm text-gray-500 mt-1">{mockAssignments.length} active tasks</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr className="text-left text-xs uppercase tracking-wider text-gray-600 font-semibold">
              <td className="px-6 py-4">
                <SortHeader label="Assignment" sortKey="name" />
              </td>
              <td className="px-6 py-4">Client</td>
              <td className="px-6 py-4">Assigned To</td>
              <td className="px-6 py-4">
                <SortHeader label="Priority" sortKey="priority" />
              </td>
              <td className="px-6 py-4">
                <SortHeader label="Due Date" sortKey="dueDate" />
              </td>
              <td className="px-6 py-4">Status</td>
              <td className="px-6 py-4 text-center">Actions</td>
            </tr>
          </thead>
          <tbody>
            {sorted.map((assignment, idx) => (
              <motion.tr
                key={assignment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{assignment.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{assignment.client}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                      {assignment.assignedTo.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-gray-700">{assignment.assignedTo}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-semibold ${priorityColors[assignment.priority]}`}>
                    {assignment.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">
                    {new Date(assignment.dueDate).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={assignment.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MoreHorizontal size={18} className="text-gray-400" />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {sorted.length} of {mockAssignments.length} assignments
        </p>
        <motion.button
          whileHover={{ x: 4 }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          View All <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}
