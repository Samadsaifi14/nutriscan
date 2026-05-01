// src/components/FloatingScanButton.tsx
"use client"
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

const BarcodeScanner = dynamic(() => import('@/components/scanner/BarcodeScanner'), { ssr: false })

export default function FloatingScanButton() {
  const pathname = usePathname()
  const [showScanner, setShowScanner] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  // Don't show on auth pages
  if (pathname?.startsWith('/auth')) return null

  function handleBarcodeDetected(barcode: string) {
    setShowScanner(false)
    window.location.href = `/results?barcode=${barcode}`
  }

  return (
    <>
      {/* Floating Scan Button - Centered */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => { setShowMenu(!showMenu); setShowScanner(true) }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.9) 0%, rgba(5,150,105,0.95) 100%)',
          }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20" />
          
          {/* Scan icon */}
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
            <rect x="7" y="7" width="10" height="10" rx="1"/>
          </svg>
          
          {/* Pulse animation */}
          <span className="absolute w-16 h-16 rounded-full bg-emerald-400/40 animate-ping" />
        </button>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner 
          onDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)} 
        />
      )}
    </>
  )
}