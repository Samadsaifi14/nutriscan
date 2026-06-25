import type { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import BottomNav from '@/components/BottomNav'
import FloatingScanButton from '@/components/FloatingScanButton'
import ErrorBoundary from '@/components/ErrorBoundary'
import GrainOverlay from '@/components/GrainOverlay'
import { CookieBanner } from '@/components/CookieBanner'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

export const metadata: Metadata = {
  title:       'Bio You — Scan. Know. Choose Better.',
  description: 'AI-powered food scanner for Indian consumers. Scan any packaged food for instant health scores, additive alerts, and personalised insights.',
  manifest:    '/manifest.json',
  appleWebApp: {
    capable:          true,
    statusBarStyle:   'black-translucent',
    title:            'Bio You',
  },
  icons: {
    apple: '/icon-192.png',
    icon:  '/icon-192.png',
  },
}

export const viewport: Viewport = {
  width:          'device-width',
  initialScale:   1,
  viewportFit:    'cover',
  userScalable:   false,
  themeColor:     '#0A0806',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className="bg-[var(--bg)] text-[var(--cream)] overflow-x-hidden overscroll-none">
        <Providers>
          <ErrorBoundary>
            <GrainOverlay />
            {children}
            <ServiceWorkerRegister />
            <CookieBanner />
          </ErrorBoundary>
        </Providers>
        <BottomNav />
        <FloatingScanButton />
      </body>
    </html>
  )
}
