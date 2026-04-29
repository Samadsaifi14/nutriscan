"use client"
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const streamRef   = useRef<MediaStream | null>(null)
  const mountedRef  = useRef(true)

  const [status,        setStatus]        = useState('Starting camera...')
  const [failureTip,    setFailureTip]    = useState<string | null>(null)
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const [isCapturing,   setIsCapturing]   = useState(false)

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
        if (mountedRef.current) setStatus('❌ Camera access denied.')
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

    setStatus('Point camera at barcode or label, then tap Capture')
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  async function handleCapture() {
    if (!videoRef.current || isCapturing) return
    setIsCapturing(true)
    setFailureTip(null)
    setStatus('📸 Capturing...')

    const canvas = document.createElement('canvas')
    canvas.width  = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) { setIsCapturing(false); return }

    if (isFrontCamera) { ctx.translate(canvas.width, 0); ctx.scale(-1, 1) }
    ctx.drawImage(videoRef.current, 0, 0)
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1]

    setStatus('🤖 Gemini is reading the barcode...')

    try {
      // Pass 1 — barcode only
      const res  = await fetch('/api/scan-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mode: 'barcode_only' }),
      })
      const json = await res.json()

      if (json.success && json.data?.barcode) {
        setStatus(`✅ Barcode found!`)
        stopCamera()
        onDetected(json.data.barcode)
        return
      }

      // Pass 2 — full label
      setStatus('🔍 Reading full label...')
      const res2  = await fetch('/api/scan-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mode: 'full_label' }),
      })
      const json2 = await res2.json()

      if (json2.success && json2.data?.barcode) {
        setStatus(`✅ Barcode found!`)
        stopCamera()
        onDetected(json2.data.barcode)
        return
      }

      if (json2.success && json2.data?.name) {
        setStatus('💾 Saving from label...')
        const submitRes  = await fetch('/api/products/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json2.data),
        })
        const submitJson = await submitRes.json()
        if (submitJson.success) {
          stopCamera()
          onDetected(submitJson.data.barcode)
          return
        }
      }

      // Both passes failed — show helpful tip, no manual entry
      const tip = json2.tip || json.tip || 'Try better lighting or move closer to the label.'
      setStatus('❌ Could not read the label')
      setFailureTip(tip)
      toast.error('Could not read label — see tip below')

    } catch {
      setStatus('❌ Something went wrong.')
      setFailureTip('Check your internet connection, then try again.')
    }

    setIsCapturing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161a20] rounded-2xl overflow-hidden w-full max-w-md border border-[#2a3545]">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#2a3545]">
          <h2 className="text-base font-bold text-white">📷 Scan Food Product</h2>
          <button
            onClick={() => { stopCamera(); onClose() }}
            className="text-[#7a8fa6] hover:text-white text-lg transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2a3545]"
          >
            ✕
          </button>
        </div>

        {/* Camera viewfinder */}
        <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

          {/* Barcode targeting overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-32 relative">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br" />
              {/* Scan line */}
              {!isCapturing && (
                <div className="absolute left-1 right-1 top-1/2 h-px bg-emerald-400/60" />
              )}
            </div>
          </div>

          {/* Status pill */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <span className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-full border border-white/10">
              {status}
            </span>
          </div>
        </div>

        {/* Failure tip — dark background, readable */}
        {failureTip && !isCapturing && (
          <div className="px-4 py-3 bg-[#1a1f2a] border-b border-amber-500/30">
            <p className="text-xs text-amber-300 text-center">
              💡 {failureTip}
            </p>
          </div>
        )}

        {/* Capture button */}
        <div className="p-4 bg-[#161a20]">
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {isCapturing ? '⏳ Reading...' : '📸 Capture & Read'}
          </button>
        </div>

      </div>
    </div>
  )
}