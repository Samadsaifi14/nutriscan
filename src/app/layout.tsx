import type { Metadata, Viewport } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

export const dynamic = 'force-dynamic'
import { BottomNav } from '@/components/BottomNav'
import { FloatingScanButton } from '@/components/FloatingScanButton'
import { GrainOverlay } from '@/components/GrainOverlay'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { CookieBanner } from '@/components/CookieBanner'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'HealthOX — Scan. Know. Choose Better.',
  description: 'AI-powered food scanner for Indian consumers. Scan any packaged food for instant health scores, additive alerts, and personalised insights.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HealthOX',
  },
  icons: {
    apple: '/icon-192.png',
    icon: '/icon-192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
  themeColor: '#0B0907',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body>
        <Providers>
          <ErrorBoundary>
            <GrainOverlay />
            {children}
            <ServiceWorkerRegister />
            <CookieBanner />
          </ErrorBoundary>
        </Providers>
        <FloatingScanButton />
        <BottomNav />
      </body>
    </html>
  )
}
