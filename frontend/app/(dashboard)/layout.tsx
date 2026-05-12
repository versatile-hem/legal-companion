'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/dashboard/sidebar';
import Header from '@/components/dashboard/header';
import AIChatPanel from '@/components/dashboard/ai-chat-panel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, hydrate } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  // Show blank while hydrating to avoid flash
  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onChatToggle={() => setChatOpen(v => !v)} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
      {chatOpen && <AIChatPanel />}
    </div>
  );
}
