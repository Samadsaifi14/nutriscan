// src/components/FloatingScanButton.tsx
"use client"
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Scan } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const BarcodeScanner = dynamic(
  () => import('@/components/scanner/BarcodeScanner'),
  { ssr: false }
)

export default function FloatingScanButton() {
  const pathname = usePathname()
  const [showScanner, setShowScanner] = useState(false)

  // Don't show on auth pages or scanner page
  if (pathname?.startsWith('/auth') || pathname === '/scan') return null

  return (
    <>
      {/* Floating Scan Button - Positioned at bottom center, overlapping */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowScanner(true)}
          className="group relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.9) 0%, rgba(5,150,105,0.95) 100%)',
          }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20" />
          
          {/* Scan icon */}
          <Scan className="w-7 h-7 text-white drop-shadow-lg" strokeWidth={2.5} />
          
          {/* Pulse animation */}
          <span className="absolute w-20 h-20 rounded-full bg-emerald-400/40 animate-ping" />
          
          {/* Label */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/50 px-2 py-1 rounded-full">
            Scan Product
          </span>
        </button>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner 
          onDetected={(barcode) => {
            setShowScanner(false)
            window.location.href = `/results?barcode=${barcode}`
          }} 
          onClose={() => setShowScanner(false)} 
        />
      )}
    </>
  )
}