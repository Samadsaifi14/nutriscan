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
  const [failureTip, setFailureTip] = useState<string | null>(null)
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [manualBarcode, setManualBarcode] = useState('')
  const [tab, setTab] = useState<'photo' | 'manual'>('photo')
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    mountedRef.current = true
    startCamera()

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

    if (!mountedRef.current) {
      s?.getTracks().forEach(t => t.stop())
      return
    }

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

  // ✅ UPDATED HANDLE CAPTURE
  async function handleCapture() {
    if (!videoRef.current || isCapturing) return
    setIsCapturing(true)
    setPulse(false)
    setFailureTip(null)
    setStatus('📸 Capturing...')

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

    setStatus('🤖 Gemini is reading the barcode...')

    try {
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

      setStatus('🔍 Trying full label extraction...')
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
        setStatus('💾 Saving from label data...')
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

      const failureMessage = json2.error || json.error || 'Could not read the label'
      const tipMessage = json2.tip || json.tip || 'Try manual entry below'

      setStatus(`❌ ${failureMessage}`)
      setFailureTip(tipMessage)
      setPulse(true)
      toast.error(failureMessage)

    } catch {
      setStatus('❌ Something went wrong. Try again.')
      setFailureTip('Check your internet connection and try again.')
      setPulse(true)
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
          <h2 className="text-base font-bold">📷 Scan Food Product</h2>
          <button onClick={() => { stopCamera(); onClose() }}>✕</button>
        </div>

        {tab === 'photo' && (
          <>
            <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
              <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                  {status}
                </span>
              </div>
            </div>

            {/* ✅ FAILURE TIP UI */}
            {failureTip && !isCapturing && (
              <div className="px-4 py-2 bg-amber-50 border-b">
                <p className="text-xs text-center">💡 {failureTip}</p>
              </div>
            )}

            <div className="p-4">
              <button onClick={handleCapture} className="w-full py-4 bg-green-600 text-white rounded-xl">
                📸 Capture & Read
              </button>
            </div>
          </>
        )}

        {tab === 'manual' && (
          <div className="p-5">
            <input
              value={manualBarcode}
              onChange={e => setManualBarcode(e.target.value)}
              placeholder="Enter barcode"
              className="w-full p-3 border"
            />
            <button onClick={handleManualSubmit}>Submit</button>
          </div>
        )}

      </div>
    </div>
  )
}