import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import BottomNav from '@/components/BottomNav'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NutriScan — AI Food Health Advisor',
  description: 'Scan any packaged food and get an instant AI health rating',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NutriScan',
  },
}

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            <main className="pb-20">
              {children}
            </main>
            <BottomNav />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
