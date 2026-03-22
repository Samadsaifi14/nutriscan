"use client"
import { useEffect, useRef, useState } from 'react'

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void
  onClose: () => void
}

export default function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mountedRef = useRef(true)
  const [status, setStatus] = useState('Starting camera...')
  const [manualBarcode, setManualBarcode] = useState('')
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [mode, setMode] = useState<'scan' | 'photo'>('scan')

  useEffect(() => {
    mountedRef.current = true
    startScanner()
    return () => {
      mountedRef.current = false
      stopScanner()
    }
  }, [])

  async function startScanner() {
    let stream: MediaStream | null = null
    let usingFront = false

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } }
      })
    } catch {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
        usingFront = true
      } catch {
        if (mountedRef.current) {
          setStatus('Camera access denied. Use manual entry below.')
        }
        return
      }
    }

    if (!mountedRef.current) {
      stream?.getTracks().forEach(t => t.stop())
      return
    }

    streamRef.current = stream
    setIsFrontCamera(usingFront)

    if (videoRef.current) {
      videoRef.current.srcObject = stream
      try {
        await videoRef.current.play()
      } catch (e: any) {
        if (e?.name === 'AbortError') return
        return
      }
    }

    if (!mountedRef.current) return

    if ('BarcodeDetector' in window) {
      setStatus('Point camera at barcode and hold steady...')
      runNativeScanner()
    } else {
      setStatus('Auto-scan not supported. Use photo mode or manual entry.')
    }
  }

  function runNativeScanner() {
    // @ts-ignore
    const detector = new BarcodeDetector({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39']
    })
    const interval = setInterval(async () => {
      if (!mountedRef.current || !videoRef.current) {
        clearInterval(interval)
        return
      }
      try {
        const barcodes = await detector.detect(videoRef.current)
        if (barcodes.length > 0) {
          clearInterval(interval)
          stopScanner()
          onDetected(barcodes[0].rawValue)
        }
      } catch { }
    }, 250)
  }

  // Capture photo and send to Gemini Vision
  async function captureAndAnalyze() {
    if (!videoRef.current || !canvasRef.current) return
    setIsCapturing(true)
    setStatus('Reading label with Gemini AI...')

    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // If front camera flip the image back
    if (isFrontCamera) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)

    // Get base64 image
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]

    try {
      const res = await fetch('/api/scan-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      })

      const json = await res.json()

      if (json.success && json.data) {
        const extracted = json.data

        // If Gemini found a barcode number use it directly
        if (extracted.barcode) {
          setStatus(`Found barcode: ${extracted.barcode}`)
          stopScanner()
          onDetected(extracted.barcode)
          return
        }

        // If no barcode but found nutrition data — submit as new product
        if (extracted.name) {
          setStatus('Saving product to database...')
          const submitRes = await fetch('/api/products/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(extracted)
          })
          const submitJson = await submitRes.json()
          if (submitJson.success) {
            setStatus('Product saved!')
            stopScanner()
            onDetected(submitJson.data.barcode)
            return
          }
        }

        setStatus('Could not read barcode. Try manual entry below.')
      } else {
        setStatus('Could not read label. Try again or use manual entry.')
      }
    } catch (e) {
      setStatus('Vision failed. Try manual entry below.')
    }

    setIsCapturing(false)
  }

  function stopScanner() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  function handleManualSubmit() {
    const code = manualBarcode.trim()
    if (code.length < 8) {
      alert('Please enter a valid barcode (at least 8 digits)')
      return
    }
    stopScanner()
    onDetected(code)
  }

  function handleClose() {
    stopScanner()
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 50,
      padding: '16px'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px',
        overflow: 'hidden', width: '100%', maxWidth: '400px'
      }}>

        {/* Header */}
        <div style={{
          padding: '14px 16px', borderBottom: '1px solid #e5e7eb',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontWeight: 600, fontSize: '15px' }}>📷 Scan Barcode</span>
          <button onClick={handleClose} style={{
            background: 'none', border: 'none',
            fontSize: '22px', cursor: 'pointer',
            color: '#6b7280', lineHeight: 1
          }}>✕</button>
        </div>

        {/* Mode Tabs */}
        <div style={{
          display: 'flex', borderBottom: '1px solid #e5e7eb'
        }}>
          {[
            { key: 'scan', label: '🔍 Auto Scan' },
            { key: 'photo', label: '📸 Photo Mode' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setMode(tab.key as any)}
              style={{
                flex: 1, padding: '10px',
                background: mode === tab.key ? '#f0fdf4' : 'white',
                border: 'none',
                borderBottom: mode === tab.key ? '2px solid #16a34a' : '2px solid transparent',
                fontSize: '13px', fontWeight: mode === tab.key ? 600 : 400,
                color: mode === tab.key ? '#16a34a' : '#6b7280',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Camera View */}
        <div style={{ position: 'relative', background: '#000', aspectRatio: '4/3' }}>
          <video
            ref={videoRef}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
              transform: isFrontCamera ? 'scaleX(-1)' : 'none'
            }}
            muted playsInline
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Guide overlay */}
          <div style={{
            position: 'absolute',
            top: '20%', left: '8%', right: '8%', bottom: '20%',
            border: `2px solid ${mode === 'photo' ? '#f59e0b' : '#16a34a'}`,
            borderRadius: '10px',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)'
          }} />

          {/* Status */}
          <div style={{
            position: 'absolute', bottom: '8px',
            left: 0, right: 0, textAlign: 'center'
          }}>
            <span style={{
              background: 'rgba(0,0,0,0.6)', color: 'white',
              fontSize: '12px', padding: '4px 12px', borderRadius: '20px'
            }}>
              {status}
            </span>
          </div>
        </div>

        {/* Photo Mode Button */}
        {mode === 'photo' && (
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>
              Point camera at the <strong>barcode</strong> or <strong>nutrition label</strong> then tap capture.
              Gemini AI will read it automatically.
            </p>
            <button
              onClick={captureAndAnalyze}
              disabled={isCapturing}
              style={{
                width: '100%', padding: '12px',
                background: isCapturing ? '#9ca3af' : '#f59e0b',
                color: 'white', border: 'none',
                borderRadius: '10px', fontSize: '15px',
                fontWeight: 600, cursor: isCapturing ? 'not-allowed' : 'pointer'
              }}
            >
              {isCapturing ? '🤖 Gemini is reading...' : '📸 Capture & Read Label'}
            </button>
          </div>
        )}

        {/* Manual entry — always visible */}
        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
            Or enter barcode number manually:
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '10px' }}>
            Find the number printed below the barcode lines on the packet
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 8901719110023"
              value={manualBarcode}
              onChange={e => setManualBarcode(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleManualSubmit() }}
              autoComplete="off"
              style={{
                flex: 1, padding: '10px 12px',
                border: '1.5px solid #d1d5db',
                borderRadius: '8px', fontSize: '15px',
                outline: 'none', color: '#111827', background: 'white'
              }}
            />
            <button
              onClick={handleManualSubmit}
              style={{
                padding: '10px 20px',
                background: '#16a34a', color: 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '15px', fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Go →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
