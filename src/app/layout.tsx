import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import BottomNav from '@/components/BottomNav'
import ErrorBoundary from '@/components/ErrorBoundary'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'NutriScan — AI Food Health Advisor',
    template: '%s | NutriScan',
  },
  description: 'Scan any packaged food and get an instant AI health rating powered by Gemini. Detect harmful ingredients, get healthier alternatives, and track your meals.',
  keywords: ['food scanner', 'nutrition analyzer', 'AI health', 'food labels', 'harmful ingredients', 'calorie tracker', 'India FSSAI', 'Gemini AI'],
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NutriScan',
  },
  openGraph: {
    title: 'NutriScan — AI Food Health Advisor',
    description: 'Scan any packaged food and get an instant AI health rating',
    type: 'website',
    siteName: 'NutriScan',
  },
  robots: {
    index: true,
    follow: true,
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
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ErrorBoundary>
            <main className="pb-20 min-h-screen">
              {children}
            </main>
            <BottomNav />
            <ServiceWorkerRegister />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}