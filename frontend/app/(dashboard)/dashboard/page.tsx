'use client';

import React from 'react';
import { motion } from 'framer-motion';
import KPICard from '@/components/dashboard/kpi-card';
import AssignmentTable from '@/components/dashboard/assignment-table';
import ComplianceCalendar from '@/components/dashboard/compliance-calendar';
import ActivityFeed from '@/components/dashboard/activity-feed';
import RevenueChart from '@/components/dashboard/revenue-chart';
import {
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Users,
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function DashboardPage() {
  const kpiData = [
    {
      title: 'Open Assignments',
      value: '24',
      trend: '+12%',
      icon: Clock,
      color: 'blue' as const,
      description: 'This month',
    },
    {
      title: 'Pending Payments',
      value: '₹8.4L',
      trend: '-5%',
      icon: TrendingUp,
      color: 'emerald' as const,
      description: 'Outstanding invoices',
    },
    {
      title: 'Upcoming Compliances',
      value: '12',
      trend: '+3%',
      icon: AlertCircle,
      color: 'amber' as const,
      description: 'Next 30 days',
    },
    {
      title: 'Completed Filings',
      value: '156',
      trend: '+8%',
      icon: CheckCircle,
      color: 'green' as const,
      description: 'This year',
    },
    {
      title: 'Overdue Tasks',
      value: '3',
      trend: '-2%',
      icon: AlertTriangle,
      color: 'red' as const,
      description: 'Requires attention',
    },
    {
      title: 'Active Clients',
      value: '42',
      trend: '+15%',
      icon: Users,
      color: 'purple' as const,
      description: 'Growing portfolio',
    },
  ];

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {/* Welcome Section */}
      <motion.div variants={item} className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome back, Civil
        </h1>
        <p className="text-gray-500 mt-2">
          Here's what's happening with your compliance operations today.
        </p>
      </motion.div>

      {/* KPI Cards Grid */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </motion.div>

      {/* Charts and Analytics Section */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <ComplianceCalendar />
        </div>
      </motion.div>

      {/* Activity and Assignment Section */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AssignmentTable />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </motion.div>
    </motion.div>
  );
}
