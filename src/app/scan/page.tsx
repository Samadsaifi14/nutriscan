// src/app/scan/page.tsx
"use client"
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import scanner to avoid SSR issues with QuaggaJS
const BarcodeScanner = dynamic(
  () => import('@/components/scanner/BarcodeScanner'),
  { ssr: false, loading: () => <ScannerPlaceholder /> }
)

function ScannerPlaceholder() {
  return (
    <div className="w-full aspect-video bg-[#161a20] rounded-2xl border border-[#2a3545] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function ScanPage() {
  const router = useRouter()
  const [scanning, setScanning] = useState(true)

  const handleDetected = useCallback((barcode: string) => {
    if (!barcode || !scanning) return
    setScanning(false)
    router.push(`/results?barcode=${encodeURIComponent(barcode)}`)
  }, [router, scanning])

  return (
    <div className="min-h-[100svh] pb-28">
      <div className="app-container pt-14 pb-4">
        <button
          onClick={() => router.back()}
          className="text-[var(--muted)] hover:text-[var(--foreground)] text-sm transition-colors flex items-center gap-1 mb-6"
        >
          ← Back
        </button>

        <h1 className="text-xl font-black text-[var(--foreground)] mb-1">Scan Product</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Point your camera at the barcode on the packaging
        </p>

        <div className="rounded-2xl overflow-hidden border border-[var(--card-border)] bg-[var(--card)] mb-4">
          {scanning && (
            <BarcodeScanner
              onDetected={handleDetected}
              onClose={() => router.back()}
            />
          )}
          {!scanning && (
            <div className="w-full aspect-video bg-[var(--card)] flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-emerald-400 font-medium">Barcode detected! Loading...</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {[
            '📦 Hold the barcode steady in the frame',
            '💡 Make sure there is good lighting',
            '↔️ Try moving closer or further away',
          ].map((tip, i) => (
            <p key={i} className="text-xs text-[var(--muted-2)]">{tip}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
