'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface Event {
  date: number;
  title: string;
  type: 'deadline' | 'filing' | 'meeting' | 'review';
}

const monthData = {
  'May 2026': [
    { date: 10, title: 'DIR-3 Filing', type: 'filing' },
    { date: 15, title: 'Board Meeting', type: 'meeting' },
    { date: 20, title: 'Annual Return', type: 'deadline' },
    { date: 25, title: 'Compliance Review', type: 'review' },
  ],
};

const eventColors: Record<'deadline' | 'filing' | 'meeting' | 'review', string> = {
  deadline: 'bg-red-100 text-red-700',
  filing: 'bg-green-100 text-green-700',
  meeting: 'bg-blue-100 text-blue-700',
  review: 'bg-amber-100 text-amber-700',
};

export default function ComplianceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4)); // May 2026

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const monthKey = monthName;
  const events = monthData[monthKey as keyof typeof monthData] || [];

  const getEventForDay = (day: number) => events.find(e => e.date === day);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar size={20} className="text-blue-600" />
          Compliance Calendar
        </h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* Month Name */}
      <p className="text-sm font-medium text-gray-700 mb-4 text-center">{monthName}</p>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map(day => (
            <div key={`empty-${day}`} className="aspect-square" />
          ))}
          {days.map(day => {
            const event = getEventForDay(day);
            const isToday = day === 12; // Mock today
            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.05 }}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                  isToday
                    ? 'border-blue-400 bg-blue-50'
                    : event
                    ? `border-gray-200 ${eventColors[event.type as keyof typeof eventColors]} font-medium`
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{day}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-3">Upcoming Events</p>
        {events.slice(0, 3).map((event, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-2 text-xs"
          >
            <span className={`px-2 py-1 rounded text-xs font-medium ${eventColors[event.type as keyof typeof eventColors]}`}>
              {event.date}
            </span>
            <span className="text-gray-700 truncate">{event.title}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
