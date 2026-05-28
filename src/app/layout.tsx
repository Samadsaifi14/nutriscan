import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import BottomNav from '@/components/BottomNav'
import FloatingScanButton from '@/components/FloatingScanButton'
import ErrorBoundary from '@/components/ErrorBoundary'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'BioYou — Scan. Know. Choose Better',
    template: '%s | BioYou',
  },
  description: 'Scan packaged foods to analyze ingredients, detect harmful additives, and get health scores. Made for India.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#1a4d32',
  width: 'device-width',
  initialScale: 1,
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
            <Footer />
            <BottomNav />
            <FloatingScanButton />
            <ServiceWorkerRegister />
            <CookieBanner />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}