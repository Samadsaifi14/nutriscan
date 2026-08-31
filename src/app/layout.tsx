import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { GrainOverlay } from "@/components/GrainOverlay";
import { FloatingScanButton } from "@/components/FloatingScanButton";
import { BottomNav } from "@/components/BottomNav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieBanner } from "@/components/CookieBanner";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "NutriScan — Scan. Understand. Choose better.",
  description: "Scan any packaged food and get an instant, India-specific health verdict.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#050505",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
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
          <FloatingScanButton />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
