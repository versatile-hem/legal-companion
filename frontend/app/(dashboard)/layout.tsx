'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/dashboard/sidebar';
import AIChatPanel from '@/components/dashboard/ai-chat-panel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Welcome, {user?.firstName || 'User'}</h2>
          <button
            onClick={() => {
              useAuthStore.getState().logout();
              router.push('/login');
            }}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90"
          >
            Logout
          </button>
        </header>

        {/* Page Content with Chat */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
          
          {/* AI Chat Panel */}
          <AIChatPanel />
        </div>
      </div>
    </div>
  );
}
