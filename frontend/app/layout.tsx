'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { queryClient } from '@/lib/api';
import '@/styles/globals.css';

// Note: Metadata should be in a server component
// export const metadata: Metadata = {
//   title: 'Suits In - Compliance & Operations Platform',
//   description: 'AI-First Compliance & Operations Platform for CA/CS Firms',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hydrate: hydrateAuth } = useAuthStore();
  const { hydrate: hydrateUI } = useUIStore();

  useEffect(() => {
    // Hydrate stores on mount
    hydrateAuth();
    hydrateUI();
  }, [hydrateAuth, hydrateUI]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Suits In - Compliance & Operations Platform</title>
        <meta
          name="description"
          content="AI-First Compliance & Operations Platform for CA/CS Firms"
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
