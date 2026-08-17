'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Analytics } from './Analytics'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Analytics />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bg)',
              color: 'var(--cream)',
              border: '1px solid var(--border-2)',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#4A6B3A', secondary: 'white' } },
            error: { iconTheme: { primary: '#C04028', secondary: 'white' } },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
