"use client"
import { useEffect, useRef, useState } from 'react'

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
      // First try to extract just the barcode number
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

      // Barcode not found in image — try full label extraction
      setStatus('Barcode not clear. Trying to read full label...')
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
        // No barcode but got product info — save directly
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

      setStatus('Could not read barcode. Try better lighting or manual entry.')
    } catch {
      setStatus('Something went wrong. Try again or use manual entry.')
    }

    setIsCapturing(false)
  }

  function handleManualSubmit() {
    const code = manualBarcode.trim()
    if (code.length < 8) {
      alert('Please enter at least 8 digits')
      return
    }
    stopCamera()
    onDetected(code)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 50, padding: '16px'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px',
        overflow: 'hidden', width: '100%', maxWidth: '420px'
      }}>

        {/* Header */}
        <div style={{
          padding: '14px 16px', borderBottom: '1px solid #e5e7eb',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>📷 Scan Food Product</span>
          <button onClick={() => { stopCamera(); onClose() }} style={{
            background: 'none', border: 'none',
            fontSize: '22px', cursor: 'pointer', color: '#6b7280'
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          {[
            { key: 'photo', label: '📸 Photo Scan' },
            { key: 'manual', label: '⌨️ Manual Entry' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} style={{
              flex: 1, padding: '10px',
              background: tab === t.key ? '#f0fdf4' : 'white',
              border: 'none',
              borderBottom: tab === t.key ? '2px solid #16a34a' : '2px solid transparent',
              fontSize: '13px', fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? '#16a34a' : '#6b7280',
              cursor: 'pointer'
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'photo' && (
          <>
            {/* Camera */}
            <div style={{ position: 'relative', background: '#000', aspectRatio: '4/3' }}>
              <video ref={videoRef} style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                transform: isFrontCamera ? 'scaleX(-1)' : 'none'
              }} muted playsInline />
              <div style={{
                position: 'absolute',
                top: '15%', left: '5%', right: '5%', bottom: '15%',
                border: '2px solid #16a34a', borderRadius: '10px',
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
              }} />
              <div style={{
                position: 'absolute', bottom: '8px',
                left: 0, right: 0, textAlign: 'center'
              }}>
                <span style={{
                  background: 'rgba(0,0,0,0.7)', color: 'white',
                  fontSize: '12px', padding: '4px 12px', borderRadius: '20px'
                }}>
                  {status}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div style={{ padding: '12px 16px', background: '#f9fafb', fontSize: '12px', color: '#6b7280' }}>
              💡 Point camera at the <strong>barcode</strong> or <strong>nutrition label</strong> on the packet. Works on all Indian products!
            </div>

            {/* Capture Button */}
            <div style={{ padding: '16px' }}>
              <button
                onClick={handleCapture}
                disabled={isCapturing}
                style={{
                  width: '100%', padding: '14px',
                  background: isCapturing ? '#9ca3af' : '#16a34a',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '16px', fontWeight: 700,
                  cursor: isCapturing ? 'not-allowed' : 'pointer'
                }}
              >
                {isCapturing ? '🤖 Gemini is reading...' : '📸 Capture & Read'}
              </button>
            </div>
          </>
        )}

        {tab === 'manual' && (
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px', fontWeight: 500 }}>
              Enter the barcode number:
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '14px' }}>
              Find the number printed directly below the barcode lines on the packet
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 8901030814091"
                value={manualBarcode}
                onChange={e => setManualBarcode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
                autoFocus
                style={{
                  flex: 1, padding: '12px',
                  border: '1.5px solid #d1d5db',
                  borderRadius: '8px', fontSize: '15px',
                  outline: 'none', color: '#111827'
                }}
              />
              <button onClick={handleManualSubmit} style={{
                padding: '12px 20px',
                background: '#16a34a', color: 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '15px', fontWeight: 700,
                cursor: 'pointer'
              }}>
                Go →
              </button>
            </div>

            <div style={{ marginTop: '16px', padding: '12px', background: '#f0fdf4', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500, marginBottom: '4px' }}>
                Popular Indian product barcodes to test:
              </p>
              {[
                { name: 'Parle-G', code: '8901719110023' },
                { name: 'Lay\'s', code: '8901491981552' },
                { name: 'Maggi', code: '8901030814091' },
              ].map(item => (
                <button
                  key={item.code}
                  onClick={() => { stopCamera(); onDetected(item.code) }}
                  style={{
                    display: 'block', width: '100%',
                    padding: '8px 10px', marginBottom: '4px',
                    background: 'white', border: '1px solid #d1fae5',
                    borderRadius: '6px', textAlign: 'left',
                    fontSize: '13px', color: '#374151', cursor: 'pointer'
                  }}
                >
                  {item.name} — <span style={{ color: '#9ca3af', fontFamily: 'monospace' }}>{item.code}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
