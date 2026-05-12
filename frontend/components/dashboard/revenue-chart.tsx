'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 4000, filings: 24, invoices: 12 },
  { month: 'Feb', revenue: 5200, filings: 28, invoices: 15 },
  { month: 'Mar', revenue: 4800, filings: 22, invoices: 14 },
  { month: 'Apr', revenue: 6100, filings: 31, invoices: 18 },
  { month: 'May', revenue: 7200, filings: 35, invoices: 21 },
  { month: 'Jun', revenue: 8400, filings: 38, invoices: 24 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value}K
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Revenue Analytics
          </h3>
          <p className="text-sm text-gray-500 mt-1">Last 6 months performance</p>
        </div>
        <select className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-gray-300 transition-colors bg-white">
          <option>Last 6 months</option>
          <option>Last 12 months</option>
          <option>Year to date</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs text-gray-600 font-medium">Total Revenue</p>
          <p className="text-xl font-bold text-blue-600 mt-1">₹35.7L</p>
        </div>
        <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
          <p className="text-xs text-gray-600 font-medium">Total Filings</p>
          <p className="text-xl font-bold text-green-600 mt-1">178</p>
        </div>
        <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
          <p className="text-xs text-gray-600 font-medium">Avg. Invoice</p>
          <p className="text-xl font-bold text-purple-600 mt-1">₹15.5K</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            dot={{ fill: '#2563eb', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
