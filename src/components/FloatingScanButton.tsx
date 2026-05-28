// src/components/FloatingScanButton.tsx
"use client"
import { useState, useEffect, useRef } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'

const BarcodeScanner = dynamic(() => import('@/components/scanner/BarcodeScanner'), { ssr: false })

export default function FloatingScanButton() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [showScanner, setShowScanner] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [mode, setMode] = useState<'barcode' | 'photo'>('barcode')

  // Check if we should open camera mode from URL param
  useEffect(() => {
    if (searchParams?.get('mode') === 'photo') {
      setMode('photo')
      setShowScanner(true)
      // Clean up the URL
      router.replace(pathname || '/dashboard')
    }
  }, [searchParams, pathname, router])

  // Don't show on auth pages
  if (pathname?.startsWith('/auth')) return null

  function handleBarcodeDetected(barcode: string) {
    setShowScanner(false)
    setShowMenu(false)
    window.location.href = `/results?barcode=${barcode}`
  }

  function handlePhotoCapture(imageData: string) {
    setShowScanner(false)
    setShowMenu(false)
    // Store image data and redirect to processing
    sessionStorage.setItem('photoScanData', imageData)
    window.location.href = '/results?mode=photo'
  }

  return (
    <>
      {/* Floating Scan Button with Menu */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        
        {/* Menu Options - Show when clicked */}
        {showMenu && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col gap-2 mb-2">
            {/* Photo/Label Scan Option */}
            <button
              onClick={() => { setMode('photo'); setShowScanner(true); setShowMenu(false) }}
              className="flex items-center gap-2 px-4 py-3 bg-[#1a1f28] border border-[#2a3545] rounded-xl shadow-lg hover:bg-[#252c38] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#f0f4f8]">📷 Scan Label</p>
                <p className="text-[10px] text-[#7a8fa6]">Take photo of nutrition label</p>
              </div>
            </button>
            
            {/* Barcode Scan Option */}
            <button
              onClick={() => { setMode('barcode'); setShowScanner(true); setShowMenu(false) }}
              className="flex items-center gap-2 px-4 py-3 bg-[#1a1f28] border border-[#2a3545] rounded-xl shadow-lg hover:bg-[#252c38] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                  <rect x="7" y="7" width="10" height="10" rx="1"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#f0f4f8]">🏷️ Scan Barcode</p>
                <p className="text-[10px] text-[#7a8fa6]">Scan product barcode</p>
              </div>
            </button>
          </div>
        )}

        {/* Main Button */}
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          aria-label={showMenu ? 'Close scan menu' : 'Open scan menu'}
          aria-expanded={showMenu}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.9) 0%, rgba(5,150,105,0.95) 100%)',
          }}
        >
          {/* X icon when menu is open */}
          {showMenu ? (
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
              <rect x="7" y="7" width="10" height="10" rx="1"/>
            </svg>
          )}
          
          {/* Pulse animation */}
          {!showMenu && <span className="absolute w-16 h-16 rounded-full bg-emerald-400/40 animate-ping" />}
        </button>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        mode === 'barcode' ? (
          <BarcodeScanner 
            onDetected={handleBarcodeDetected}
            onClose={() => { setShowScanner(false); setShowMenu(false) }} 
          />
        ) : (
          <LabelScanner 
            onCapture={handlePhotoCapture}
            onClose={() => { setShowScanner(false); setShowMenu(false) }} 
          />
        )
      )}
    </>
  )
}

// Label Scanner Component - Uses device camera to capture nutrition label
function LabelScanner({ onCapture, onClose }: { onCapture: (data: string) => void; onClose: () => void }) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [captured, setCaptured] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let mounted = true
    
    async function startCamera() {
      try {
        console.log('Starting camera...')
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        })
        
        if (!mounted) {
          mediaStream.getTracks().forEach(t => t.stop())
          return
        }
        
        console.log('Camera started, stream:', mediaStream.id)
        setStream(mediaStream)
        
        // Wait for video element to be ready
        setTimeout(() => {
          if (videoRef.current && mounted) {
            console.log('Setting video srcObject')
            videoRef.current.srcObject = mediaStream
            videoRef.current.play().catch(e => console.log('Play error:', e))
          }
        }, 100)
        
      } catch (err: any) {
        console.error('Camera error:', err)
        setCameraError(err.message || 'Could not access camera')
      }
    }
    
    startCamera()

    return () => {
      mounted = false
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  function captureImage() {
    if (!videoRef.current) return
    
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.drawImage(videoRef.current, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setCaptured(true)
    onCapture(dataUrl)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <button type="button" onClick={onClose} className="text-white font-bold" aria-label="Close camera">
          ✕ Close
        </button>
        <p className="text-white text-sm font-bold">📷 Scan Nutrition Label</p>
        <div className="w-16" />
      </div>

      {/* Camera Preview */}
      <div className="flex-1 relative">
        {cameraError ? (
          <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
            <div className="text-4xl mb-4">📷</div>
            <p className="text-lg font-bold mb-2">Camera Error</p>
            <p className="text-sm text-gray-300 mb-4">{cameraError}</p>
            <button 
              onClick={() => setCameraError(null)}
              className="px-4 py-2 bg-emerald-500 rounded-lg font-bold"
            >
              Try Again
            </button>
          </div>
        ) : stream ? (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Overlay guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-4/5 h-1/2 border-2 border-white/50 rounded-lg bg-transparent" />
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-lg inline-block">
            Position the nutrition label inside the frame
          </p>
        </div>
      </div>

      {/* Capture Button */}
      <div className="p-6 bg-black/50">
        <button
          onClick={captureImage}
          disabled={captured}
          className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 mx-auto block hover:bg-emerald-100 transition-colors disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500 mx-auto" />
        </button>
        <p className="text-white text-center text-xs mt-2">Tap to capture</p>
      </div>
    </div>
  )
}