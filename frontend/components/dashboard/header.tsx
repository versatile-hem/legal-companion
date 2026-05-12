'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  Plus,
  ChevronDown,
  X,
} from 'lucide-react';

interface HeaderProps {
  onChatToggle?: () => void;
}

export default function Header({ onChatToggle }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [notificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  const quickActions = [
    { label: 'Create Job', description: 'Start a new assignment' },
    { label: 'Generate Invoice', description: 'Create billing document' },
    { label: 'Add Client', description: 'Onboard new client' },
    { label: 'Draft Resolution', description: 'Create board resolution' },
  ];

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between gap-6"
    >
      {/* Left Section: Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search assignments, clients, entities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full pl-4 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-300 focus:bg-white transition-colors"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Actions Button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Plus size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">New</span>
          </motion.button>

          {isActionsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50"
            >
              <div className="p-2">
                {quickActions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 4 }}
                    onClick={() => setIsActionsOpen(false)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-blue-500">
                      {action.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Bell size={20} className="text-gray-600" />
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold"
            >
              {notificationCount}
            </motion.span>
          )}
        </motion.button>

        {/* Workspace Info */}
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Suits & Co</p>
            <p className="text-xs text-gray-500">Professional Suite</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            SC
          </div>
        </div>

        {/* Chat Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onChatToggle}
          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
          title="Toggle AI Assistant"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 1H17C18.1046 1 19 1.89543 19 3V13C19 14.1046 18.1046 15 17 15H5L2.17157 17.8284C1.77205 18.2279 1.25518 18.4 0.707107 18.4C0.31623 18.4 0 18.0838 0 17.6929V3C0 1.89543 0.89543 1 2 1H3Z" fill="currentColor"/>
          </svg>
        </motion.button>
      </div>
    </motion.header>
  );
}
