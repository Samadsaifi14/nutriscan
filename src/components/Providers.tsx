"use client"
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        retry: 1,
      }
    }
  }))

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 500,
              },
              success: { iconTheme: { primary: '#16a34a', secondary: 'white' } },
              error: { iconTheme: { primary: '#dc2626', secondary: 'white' } },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}