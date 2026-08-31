"use client"
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Camera, Lightbulb, ScanLine, X } from 'lucide-react'

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void
  onClose: () => void
}

// TypeScript declaration for BarcodeDetector API
declare global {
  interface Window {
    BarcodeDetector?: new (options: { formats: string[] }) => {
      detect(video: HTMLVideoElement): Promise<Array<{ rawValue: string }>>
    }
  }
}

// Client-side barcode detection using BarcodeDetector API
async function detectBarcode(video: HTMLVideoElement): Promise<string | null> {
  if (!('BarcodeDetector' in window)) {
    console.log('BarcodeDetector not supported')
    return null
  }
  
  try {
    const barcodeDetector = new window.BarcodeDetector!({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'],
    })
    
    const barcodes = await barcodeDetector.detect(video)
    
    if (barcodes.length > 0) {
      console.log('Detected barcode:', barcodes[0]!.rawValue)
      return barcodes[0]!.rawValue
    }
  } catch (err) {
    console.warn('Barcode detection error:', err)
  }
  
  return null
}

export default function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const streamRef  = useRef<MediaStream | null>(null)
  const mountedRef = useRef(true)
  const detectorRef = useRef<any>(null)

  const [status,        setStatus]        = useState('Starting camera...')
  const [failureTip,    setFailureTip]    = useState<string | null>(null)
  const [isFrontCamera, setIsFrontCamera] = useState(false)

  // Setup BarcodeDetector once
  useEffect(() => {
    if ('BarcodeDetector' in window) {
      detectorRef.current = new (window as any).BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'],
      })
    }
  }, [])

  // Real-time barcode detection
  useEffect(() => {
    if (!videoRef.current || !detectorRef.current) return
    
    const video = videoRef.current
    let animationId: number
    
    const detectLoop = async () => {
      if (!mountedRef.current || !video.srcObject) return
      
      try {
        const barcodes = await detectorRef.current.detect(video)
        
        if (barcodes.length > 0 && mountedRef.current) {
          const barcode = barcodes[0].rawValue
          console.log('Live barcode detected:', barcode)
          setStatus('Barcode found')
          stopCamera()
          onDetected(barcode)
          return
        }
      } catch (err) {
        // Ignore detection errors during scanning
      }
      
      if (mountedRef.current) {
        animationId = requestAnimationFrame(detectLoop)
      }
    }
    
    // Start detection after video is playing
    video.onplaying = () => {
      detectLoop()
    }
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [onDetected])

  useEffect(() => {
    mountedRef.current = true
    startCamera()
    return () => {
      mountedRef.current = false
      stopCamera()
    }
  }, [])

  async function startCamera() {
    let s: MediaStream | null = null
    let front = false
    try {
      s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' }, width: { ideal: 1280 } }
      })
    } catch {
      try {
        s = await navigator.mediaDevices.getUserMedia({ video: true })
        front = true
      } catch {
        if (mountedRef.current) setStatus('Camera access denied')
        return
      }
    }

    if (!mountedRef.current) { s?.getTracks().forEach(t => t.stop()); return }

    streamRef.current = s
    setIsFrontCamera(front)

    if (videoRef.current) {
      videoRef.current.srcObject = s
      try { await videoRef.current.play() } catch {}
    }

    setStatus('Point camera at barcode, then tap Capture')
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  // Manual capture fallback (for browsers without BarcodeDetector)
  async function handleManualCapture() {
    if (!videoRef.current) return
    
    setStatus('Checking for barcode...')
    
    // Try client-side detection first
    const barcode = await detectBarcode(videoRef.current)
    
    if (barcode) {
      setStatus('Barcode found')
      stopCamera()
      onDetected(barcode)
      return
    }
    
    // If no barcode detected, show message
    setStatus('Point camera at barcode')
    setFailureTip('Make sure barcode is clearly visible and well-lit')
    toast.error('No barcode detected - try moving closer')
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-2xl overflow-hidden w-full max-w-md border border-[var(--card-border)] shadow-2xl">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--card-border)]">
          <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2"><Camera size={18} /> Scan food product</h2>
          <button
            onClick={() => { stopCamera(); onClose() }}
            className="text-[var(--muted)] hover:text-[var(--foreground)] text-lg transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[color-mix(in_oklab,var(--card),black_8%)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Camera viewfinder */}
        <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

          {/* Targeting overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-32 relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--clay)] rounded-tl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[var(--clay)] rounded-tr" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[var(--clay)] rounded-bl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--clay)] rounded-br" />
              <div className="absolute left-1 right-1 top-1/2 h-px bg-[var(--clay)]/60" />
            </div>
          </div>

          {/* Status pill */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <span className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-full border border-white/10">
              {status}
            </span>
          </div>
        </div>

        {/* Failure tip */}
        {failureTip && (
          <div className="px-4 py-3 bg-[color-mix(in_oklab,var(--card),black_6%)] border-b border-amber-500/30">
            <p className="text-xs text-amber-300 text-center flex items-center justify-center gap-2"><Lightbulb size={14} /> {failureTip}</p>
          </div>
        )}

        {/* Capture button - fallback for browsers without auto-detection */}
        <div className="p-4 bg-[var(--card)]">
          <button
            onClick={handleManualCapture}
            className="w-full py-4 bg-[var(--clay)] hover:bg-[color-mix(in_oklab,var(--clay),black_15%)] text-black font-semibold rounded-full transition-colors text-sm flex items-center justify-center gap-2"
          >
            <ScanLine size={18} /> Manual scan
          </button>
        </div>

      </div>
    </div>
  )
}
