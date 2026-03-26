"use client"
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mountedRef = useRef(true)
  const [status, setStatus] = useState('Starting camera...')
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [manualBarcode, setManualBarcode] = useState('')
  const [tab, setTab] = useState<'photo' | 'manual'>('photo')
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    startCamera()

    // Start pulsing the button after 2 seconds to draw attention
    const pulseTimer = setTimeout(() => {
      if (mountedRef.current) setPulse(true)
    }, 2000)

    return () => {
      mountedRef.current = false
      stopCamera()
      clearTimeout(pulseTimer)
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
        if (mountedRef.current) setStatus('Camera denied. Use manual entry.')
        return
      }
    }
    if (!mountedRef.current) { s?.getTracks().forEach(t => t.stop()); return }
    streamRef.current = s
    setIsFrontCamera(front)
    if (videoRef.current) {
      videoRef.current.srcObject = s
      try { await videoRef.current.play() } catch { }
    }
    if (mountedRef.current) setStatus('Point camera at barcode or label, then tap Capture')
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  async function handleCapture() {
    if (!videoRef.current || isCapturing) return
    setIsCapturing(true)
    setPulse(false)
    setStatus('🤖 Gemini is reading the barcode...')

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) { setIsCapturing(false); return }

    if (isFrontCamera) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(videoRef.current, 0, 0)
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1]

    try {
      // First try barcode only
      const res = await fetch('/api/scan-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mode: 'barcode_only' })
      })
      const json = await res.json()

      if (json.success && json.data?.barcode) {
        setStatus(`✅ Found barcode: ${json.data.barcode}`)
        stopCamera()
        onDetected(json.data.barcode)
        return
      }

      // Try full label extraction
      setStatus('Trying full label extraction...')
      const res2 = await fetch('/api/scan-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mode: 'full_label' })
      })
      const json2 = await res2.json()

      if (json2.success && json2.data?.barcode) {
        setStatus(`✅ Found barcode: ${json2.data.barcode}`)
        stopCamera()
        onDetected(json2.data.barcode)
        return
      }

      if (json2.success && json2.data?.name) {
        setStatus('No barcode visible. Saving from label data...')
        const submitRes = await fetch('/api/products/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(json2.data)
        })
        const submitJson = await submitRes.json()
        if (submitJson.success) {
          stopCamera()
          onDetected(submitJson.data.barcode)
          return
        }
      }

      setStatus('Could not read barcode. Try better lighting or manual entry below.')
      setPulse(true)
    } catch {
      setStatus('Something went wrong. Try again or use manual entry.')
    }

    setIsCapturing(false)
  }

  function handleManualSubmit() {
    const code = manualBarcode.trim()
    if (code.length < 8) {
      toast.error('Please enter at least 8 digits')
      return
    }
    stopCamera()
    onDetected(code)
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-2xl overflow-hidden w-full max-w-md">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--card-border)]">
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)]">📷 Scan Food Product</h2>
            <p className="text-xs text-[var(--muted)]">Works on all Indian products</p>
          </div>
          <button
            onClick={() => { stopCamera(); onClose() }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--card-border)]">
          {[
            { key: 'photo', label: '📸 Photo Scan' },
            { key: 'manual', label: '⌨️ Manual Entry' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'photo' | 'manual')}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                tab === t.key
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 bg-green-50 dark:bg-green-900/20'
                  : 'text-[var(--muted)] border-b-2 border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'photo' && (
          <>
            {/* Camera view */}
            <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ transform: isFrontCamera ? 'scaleX(-1)' : 'none' }}
                muted
                playsInline
              />

              {/* Scanning guide box */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="border-2 border-green-400 rounded-xl"
                  style={{
                    width: '80%',
                    height: '60%',
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                  }}
                >
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-green-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-green-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-green-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-green-400 rounded-br-lg" />
                </div>
              </div>

              {/* Status overlay */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                  {status}
                </span>
              </div>
            </div>

            {/* Instruction banner */}
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-400 text-center font-medium">
                👇 Point at the barcode or nutrition label, then tap the button below
              </p>
            </div>

            {/* Capture button — highlighted with pulse animation */}
            <div className="p-4">
              <div className="relative">
                {/* Glow ring behind button when pulsing */}
                {pulse && !isCapturing && (
                  <div
                    className="absolute inset-0 rounded-xl bg-green-500 opacity-30"
                    style={{
                      animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
                    }}
                  />
                )}

                <button
                  onClick={handleCapture}
                  disabled={isCapturing}
                  className={`relative w-full py-4 rounded-xl text-white text-base font-bold transition-all flex items-center justify-center gap-2 ${
                    isCapturing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : pulse
                      ? 'bg-green-600 shadow-lg shadow-green-500/50 scale-105'
                      : 'bg-green-600 hover:bg-green-700 active:scale-95'
                  }`}
                  style={{
                    boxShadow: pulse && !isCapturing
                      ? '0 0 0 4px rgba(22, 163, 74, 0.3), 0 8px 24px rgba(22, 163, 74, 0.4)'
                      : undefined,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isCapturing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Gemini AI is reading...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">📸</span>
                      Capture &amp; Read
                      {pulse && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Tap here!</span>}
                    </>
                  )}
                </button>
              </div>

              {/* Helper text below button */}
              {!isCapturing && (
                <p className="text-xs text-center text-[var(--muted)] mt-2">
                  Gemini AI will automatically read the barcode and nutrition info
                </p>
              )}
            </div>
          </>
        )}

        {tab === 'manual' && (
          <div className="p-5">
            <p className="text-sm font-semibold text-[var(--foreground)] mb-1">
              Enter barcode number:
            </p>
            <p className="text-xs text-[var(--muted)] mb-4">
              Find the number printed directly below the barcode lines on the packet
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 8901030814091"
                value={manualBarcode}
                onChange={e => setManualBarcode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
                autoFocus
                className="flex-1 px-3 py-3 border-2 border-[var(--card-border)] focus:border-green-500 rounded-xl text-sm text-[var(--foreground)] bg-[var(--card)] outline-none transition-colors"
              />
              <button
                onClick={handleManualSubmit}
                className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors"
              >
                Go →
              </button>
            </div>

            {/* Quick test barcodes */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3">
              <p className="text-xs font-semibold text-[var(--muted)] mb-2">
                Popular Indian products to test:
              </p>
              <div className="flex flex-col gap-1.5">
                {[
                  { name: 'Parle-G Biscuits', code: '8901719110023' },
                  { name: "Lay's Chips", code: '8901491981552' },
                  { name: 'Maggi Noodles', code: '8901030814091' },
                ].map(item => (
                  <button
                    key={item.code}
                    onClick={() => { stopCamera(); onDetected(item.code) }}
                    className="flex items-center justify-between px-3 py-2 bg-[var(--card)] border border-[var(--card-border)] rounded-lg hover:border-green-300 dark:hover:border-green-700 transition-colors text-left"
                  >
                    <span className="text-xs font-medium text-[var(--foreground)]">{item.name}</span>
                    <span className="text-xs text-[var(--muted)] font-mono">{item.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Global pulse animation style */}
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
