'use client';

import { motion } from 'framer-motion';

export default function DocumentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
        <p className="text-gray-600 mb-8">Manage and organize documents and attachments.</p>
        
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Documents Management</h2>
          <p className="text-gray-600">This page is coming soon. You'll be able to manage documents here.</p>
        </div>
      </div>
    </motion.div>
  );
}
