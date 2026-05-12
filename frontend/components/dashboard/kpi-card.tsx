'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'emerald';
  description?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    icon: 'text-blue-600',
    accent: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-100',
    icon: 'text-green-600',
    accent: 'bg-green-100',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    icon: 'text-amber-600',
    accent: 'bg-amber-100',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-100',
    icon: 'text-red-600',
    accent: 'bg-red-100',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    icon: 'text-purple-600',
    accent: 'bg-purple-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    icon: 'text-emerald-600',
    accent: 'bg-emerald-100',
  },
};

export default function KPICard({
  title,
  value,
  trend,
  icon: Icon,
  color,
  description,
}: KPICardProps) {
  const isPositive = trend.startsWith('+');
  const classes = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`${classes.bg} ${classes.border} border rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`${classes.accent} rounded-lg p-3`}>
          <Icon size={24} className={classes.icon} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : (
              <TrendingDown size={16} className="text-red-600" />
            )}
            <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
