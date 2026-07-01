'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Flashlight, Image as ImageIcon, Settings } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { writeScanResult } from '@/types/scanResult'

export default function Scan() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [torch, setTorch] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [mode, setMode] = useState<'barcode' | 'photo'>('barcode')
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      if (videoRef.current) videoRef.current.srcObject = stream
      setError(null)
    } catch {
      setError('Camera access denied. Please grant camera permissions.')
    }
  }, [])

  useEffect(() => {
    startCamera()
    const video = videoRef.current
    return () => {
      if (video?.srcObject instanceof MediaStream) {
        video.srcObject.getTracks().forEach((t: MediaStreamTrack) => t.stop())
      }
    }
  }, [startCamera])

  const handleDetected = useCallback(async (barcode: string) => {
    if (scanning) return
    setScanning(true)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, mode }),
      })
      const data = await res.json()
      if (data?.product && data?.analysis) {
        writeScanResult({ product: data.product, analysis: data.analysis, quantity: 1, alternatives: data.alternatives })
        router.replace('/results')
      } else {
        router.replace(`/correct-product?barcode=${barcode}`)
      }
    } catch {
      setError('Scan failed. Try again.')
      setScanning(false)
    }
  }, [scanning, mode, router])

  useEffect(() => {
    if (mode !== 'barcode' || !('BarcodeDetector' in window)) return
    const detector = new (window as unknown as { BarcodeDetector: new (a: string[]) => unknown })['BarcodeDetector'](['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'])
    const interval = setInterval(async () => {
      if (!videoRef.current) return
      try {
        const codes = await (detector as { detect: (v: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> }).detect(videoRef.current)
        if (codes.length > 0) handleDetected(codes[0]!.rawValue)
      } catch {
        // frame skip
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [mode, handleDetected])

  return (
    <PageShell variant="fullscreen">
      <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7), transparent)',
        padding: 'calc(env(safe-area-inset-top, 0px) + 12px) 16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button className="icon-btn" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => router.back()}>
          <ArrowLeft size={20} color="#fff" />
        </button>
        <button
          className="icon-btn"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setTorch((t) => !t)}
        >
          <Flashlight size={18} color={torch ? 'var(--clay)' : '#fff'} />
        </button>
      </div>

      {/* Scan frame */}
      <div className="scan-frame">
        <div className="scan-corner--tl" />
        <div className="scan-corner--tr" />
        <div className="scan-corner--bl" />
        <div className="scan-corner--br" />
        {mode === 'barcode' && <div className="scan-line" />}
      </div>

      {/* Error */}
      {error && (
        <div style={{ position: 'absolute', bottom: 180, left: 16, right: 16, zIndex: 10 }}>
          <div className="alert alert--danger">{error}</div>
        </div>
      )}

      {/* Bottom controls */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        background: 'linear-gradient(0deg, rgba(0,0,0,0.8), transparent)',
        padding: '40px 16px calc(env(safe-area-inset-bottom, 0px) + 16px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        {/* Mode pills */}
        <div className="tab-bar" style={{ width: '100%', maxWidth: 280 }}>
          {(['barcode', 'photo'] as const).map((m) => (
            <button
              key={m}
              className={`tab-bar__item ${mode === m ? 'tab-bar__item--active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m === 'barcode' ? 'Barcode' : 'Photo Label'}
            </button>
          ))}
          {/* Sliding indicator */}
          <div
            style={{
              position: 'absolute', top: 4, bottom: 4,
              width: 'calc(50% - 4px)', borderRadius: 9,
              background: 'var(--clay)',
              left: mode === 'barcode' ? 4 : 'calc(50% + 0px)',
              transition: 'left 0.2s var(--ease-out)',
              zIndex: 0,
            }}
          />
        </div>

        {/* Shutter + side icons */}
        <div className="row--md" style={{ gap: 24 }}>
          <button className="icon-btn" style={{ width: 44, height: 44, background: 'rgba(0,0,0,0.4)' }} onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = async () => {
              const file = input.files?.[0]
              if (!file) return
              const formData = new FormData()
              formData.append('image', file)
              try {
                const res = await fetch('/api/scan-product-photo', { method: 'POST', body: formData })
                const data = await res.json()
                if (data?.product && data?.analysis) {
                  writeScanResult({ product: data.product, analysis: data.analysis, quantity: 1, alternatives: data.alternatives })
                  router.replace('/results')
                }
              } catch {
                setError('Photo analysis failed')
              }
            }
            input.click()
          }}>
            <ImageIcon size={18} color="#fff" />
          </button>
          <button
            onClick={async () => {
              if (mode === 'photo') {
                const canvas = document.createElement('canvas')
                const video = videoRef.current
                if (!video) return
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                canvas.getContext('2d')?.drawImage(video, 0, 0)
                canvas.toBlob(async (blob) => {
                  if (!blob) return
                  const formData = new FormData()
                  formData.append('image', blob, 'capture.jpg')
                  try {
                    const res = await fetch('/api/scan-product-photo', { method: 'POST', body: formData })
                    const data = await res.json()
                    if (data?.product && data?.analysis) {
                      writeScanResult({ product: data.product, analysis: data.analysis, quantity: 1, alternatives: data.alternatives })
                      router.replace('/results')
                    }
                  } catch {
                    setError('Photo analysis failed')
                  }
                }, 'image/jpeg')
              }
            }}
            style={{
              width: 64, height: 64, borderRadius: '9999px',
              background: '#fff', border: '4px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Capture"
          >
            <Camera size={28} color="#000" />
          </button>
          <button className="icon-btn" style={{ width: 44, height: 44, background: 'rgba(0,0,0,0.4)' }}>
            <Settings size={18} color="#fff" />
          </button>
        </div>
      </div>
    </PageShell>
  )
}
