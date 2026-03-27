import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import BottomNav from '@/components/BottomNav'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'HealthOX — AI Food Health Advisor',
  description: 'Scan any packaged food and get an instant AI health rating powered by Gemini',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HealthOX',
  },
  openGraph: {
    title: 'HealthOX — AI Food Health Advisor',
    description: 'Scan any packaged food and get an instant AI health rating',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            <main className="pb-20 min-h-screen">
              {children}
            </main>
            <BottomNav />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}