'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Users2,
  CreditCard,
  CheckSquare,
  FileCheck,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Assignment Register', href: '/assignments', icon: <FileText size={20} /> },
  { name: 'Clients', href: '/clients', icon: <Users size={20} /> },
  { name: 'Entities', href: '/entities', icon: <Building2 size={20} /> },
  { name: 'Directors', href: '/directors', icon: <Users2 size={20} /> },
  { name: 'Billing', href: '/billing', icon: <CreditCard size={20} /> },
  { name: 'Compliance', href: '/compliance', icon: <CheckSquare size={20} /> },
  { name: 'Documents', href: '/documents', icon: <FileCheck size={20} /> },
  { name: 'Notifications', href: '/notifications', icon: <Bell size={20} /> },
  { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="lg:hidden fixed top-6 left-6 z-50 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`${
          isOpen ? 'fixed' : 'hidden'
        } lg:relative lg:flex w-64 h-screen bg-white border-r border-gray-200 flex-col overflow-hidden z-40`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Suits In</h1>
              <p className="text-xs text-gray-500">Professional Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1 h-6 bg-blue-600 rounded-full"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-3 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              CS
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">Civil Services</p>
              <p className="text-xs text-gray-500">ADMIN</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </motion.button>

          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 py-2 border-t border-gray-200"
            >
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors flex items-center gap-2">
                <Settings size={16} />
                Profile Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-2">
                <LogOut size={16} />
                Sign Out
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
