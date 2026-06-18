"use client"
import { useState, useEffect, useRef } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const BarcodeScanner = dynamic(() => import('@/components/scanner/BarcodeScanner'), { ssr: false })

export default function FloatingScanButton() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [showScanner, setShowScanner] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [mode, setMode] = useState<'barcode' | 'photo'>('barcode')

  useEffect(() => {
    if (searchParams?.get('mode') === 'photo') {
      setMode('photo')
      setShowScanner(true)
      router.replace(pathname || '/dashboard')
    }
  }, [searchParams, pathname, router])

  if (pathname?.startsWith('/auth')) return null

  function handleBarcodeDetected(barcode: string) {
    setShowScanner(false)
    setShowMenu(false)
    window.location.href = `/results?barcode=${barcode}`
  }

  function handlePhotoCapture(imageData: string) {
    setShowScanner(false)
    setShowMenu(false)
    sessionStorage.setItem('photoScanData', imageData)
    window.location.href = '/results?mode=photo'
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        {showMenu && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col gap-2 mb-2">
            <button
              onClick={() => { setMode('photo'); setShowScanner(true); setShowMenu(false) }}
              className="flex items-center gap-2 px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl shadow-lg hover:bg-[color-mix(in_oklab,var(--card),black_6%)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg" style={{ background: 'rgba(196,113,74,0.15)' }}>
                <svg className="w-5 h-5 p-2.5" style={{ color: 'var(--clay)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold" style={{ color: 'var(--bark)' }}>Scan Label</p>
                <p className="text-[10px]" style={{ color: 'var(--muted-2)' }}>Take photo of nutrition label</p>
              </div>
            </button>

            <button
              onClick={() => { setMode('barcode'); setShowScanner(true); setShowMenu(false) }}
              className="flex items-center gap-2 px-4 py-3 bg-[var(--card)] border border-[var(--card-border)] rounded-xl shadow-lg hover:bg-[color-mix(in_oklab,var(--card),black_6%)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg" style={{ background: 'rgba(61,92,46,0.15)' }}>
                <svg className="w-5 h-5 p-2.5" style={{ color: 'var(--moss)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
                  <rect x="7" y="7" width="10" height="10" rx="1"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold" style={{ color: 'var(--bark)' }}>Scan Barcode</p>
                <p className="text-[10px]" style={{ color: 'var(--muted-2)' }}>Scan product barcode</p>
              </div>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          aria-label={showMenu ? 'Close scan menu' : 'Open scan menu'}
          aria-expanded={showMenu}
          className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(196,113,74,0.9) 0%, rgba(196,113,74,0.95) 100%)',
            boxShadow: '0 8px 24px rgba(196,113,74,0.3)',
          }}
        >
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
          {!showMenu && <span className="absolute w-16 h-16 rounded-full animate-ping" style={{ background: 'rgba(196,113,74,0.3)' }} />}
        </button>
      </div>

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

function LabelScanner({ onCapture, onClose }: { onCapture: (data: string) => void; onClose: () => void }) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [captured, setCaptured] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let mounted = true
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        if (!mounted) { mediaStream.getTracks().forEach(t => t.stop()); return }
        setStream(mediaStream)
        setTimeout(() => {
          if (videoRef.current && mounted) {
            videoRef.current.srcObject = mediaStream
            videoRef.current.play().catch(() => {})
          }
        }, 100)
      } catch (err: any) {
        setCameraError(err.message || 'Could not access camera')
      }
    }
    startCamera()
    return () => { mounted = false; if (stream) stream.getTracks().forEach(track => track.stop()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="flex items-center justify-between p-4 bg-black/50">
        <button type="button" onClick={onClose} className="text-white font-bold" aria-label="Close camera">✕ Close</button>
        <p className="text-white text-sm font-bold" style={{ fontFamily: 'var(--font-display)' }}>Scan Nutrition Label</p>
        <div className="w-16" />
      </div>
      <div className="flex-1 relative">
        {cameraError ? (
          <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
            <p className="text-lg font-bold mb-2">Camera Error</p>
            <p className="text-sm text-gray-300 mb-4">{cameraError}</p>
            <button onClick={() => setCameraError(null)} className="px-4 py-2 rounded-lg font-bold" style={{ background: 'var(--clay)' }}>Try Again</button>
          </div>
        ) : stream ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-4/5 h-1/2 border-2 border-white/50 rounded-lg bg-transparent" />
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-lg inline-block">
            Position the nutrition label inside the frame
          </p>
        </div>
      </div>
      <div className="p-6 bg-black/50">
        <button onClick={captureImage} disabled={captured}
          className="w-16 h-16 rounded-full bg-white mx-auto block hover:opacity-80 transition-opacity disabled:opacity-50"
          style={{ border: '4px solid var(--clay)' }}>
          <div className="w-12 h-12 rounded-full mx-auto" style={{ background: 'var(--clay)' }} />
        </button>
        <p className="text-white text-center text-xs mt-2">Tap to capture</p>
      </div>
    </div>
  )
}
