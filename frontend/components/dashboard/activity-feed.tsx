'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  User,
  TrendingUp,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'completion' | 'pending' | 'warning' | 'success' | 'comment' | 'user' | 'metric';
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'success',
    title: 'DIR-3 KYC Filing Completed',
    description: 'Acme Corporation',
    timestamp: '2 hours ago',
    user: 'Priya Sharma',
  },
  {
    id: '2',
    type: 'completion',
    title: 'Board Resolution Approved',
    description: 'Tech Innovations Ltd',
    timestamp: '4 hours ago',
    user: 'Amit Patel',
  },
  {
    id: '3',
    type: 'pending',
    title: 'New Client Onboarded',
    description: 'Global Solutions Inc',
    timestamp: '6 hours ago',
    user: 'Neha Gupta',
  },
  {
    id: '4',
    type: 'metric',
    title: 'Revenue Goal Achieved',
    description: '₹50L milestone reached',
    timestamp: '1 day ago',
  },
  {
    id: '5',
    type: 'warning',
    title: 'Overdue Compliance Task',
    description: 'Annual Return filing pending',
    timestamp: '1 day ago',
    user: 'Vikram Singh',
  },
];

const activityIcons = {
  completion: FileCheck,
  pending: Clock,
  warning: AlertCircle,
  success: CheckCircle,
  comment: MessageSquare,
  user: User,
  metric: TrendingUp,
};

const activityColors = {
  completion: 'text-blue-600 bg-blue-50',
  pending: 'text-yellow-600 bg-yellow-50',
  warning: 'text-red-600 bg-red-50',
  success: 'text-green-600 bg-green-50',
  comment: 'text-purple-600 bg-purple-50',
  user: 'text-indigo-600 bg-indigo-50',
  metric: 'text-emerald-600 bg-emerald-50',
};

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-6"
    >
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>

      {/* Activity List */}
      <div className="space-y-4">
        {mockActivities.map((activity, idx) => {
          const IconComponent = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                <IconComponent size={20} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                {activity.description && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {activity.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  {activity.user && (
                    <>
                      <span className="text-gray-300">•</span>
                      <p className="text-xs text-gray-600">{activity.user}</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Link */}
      <motion.button
        whileHover={{ x: 4 }}
        className="w-full mt-4 py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        View all activities →
      </motion.button>
    </motion.div>
  );
}
