// src/components/scan/ProductPhotoCaptureModal.tsx
"use client"
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ProductPhotoCaptureModalProps {
  onCapture: (b64: string) => void
  onClose:   () => void
}

export function ProductPhotoCaptureModal({ onCapture, onClose }: ProductPhotoCaptureModalProps) {
  const [stream,        setStream]        = useState<MediaStream | null>(null)
  const [videoEl,       setVideoEl]       = useState<HTMLVideoElement | null>(null)
  const [cameraStarted, setCameraStarted] = useState(false)
  const [capturing,     setCapturing]     = useState(false)

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      setStream(s); setCameraStarted(true)
    } catch {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true })
        setStream(s); setCameraStarted(true)
      } catch { toast.error('Camera access denied. Please allow camera permission.') }
    }
  }

  function stopCamera() { stream?.getTracks().forEach(t => t.stop()); setStream(null); setCameraStarted(false) }

  function handleCapture() {
    if (!videoEl) return
    setCapturing(true)
    const canvas = document.createElement('canvas')
    canvas.width = videoEl.videoWidth; canvas.height = videoEl.videoHeight
    canvas.getContext('2d')?.drawImage(videoEl, 0, 0)
    const b64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1]
    stopCamera(); onCapture(b64)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl overflow-hidden w-full max-w-md">

        <div className="flex justify-between items-center px-5 py-4 border-b border-[#2a3545]">
          <div>
            <h2 className="text-sm font-semibold text-[#f0f4f8]">🖼️ Product Photo Mode</h2>
            <p className="text-[11px] text-[#7a8fa6]">Take a photo of the whole product</p>
          </div>
          <button onClick={() => { stopCamera(); onClose() }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1e242d] border border-[#2a3545] text-[#7a8fa6] hover:text-[#f0f4f8] transition-colors text-sm">
            ✕
          </button>
        </div>

        {!cameraStarted ? (
          <div className="p-6">
            <p className="text-xs font-semibold text-[#f0f4f8] mb-3">Gemini AI will read and extract:</p>
            <div className="space-y-2 mb-5">
              {[
                '📦 Product name and brand',
                '🔢 Barcode number',
                '📊 Full nutrition facts per 100g',
                '🧪 Ingredients and additives',
                '⚠️ Allergen information',
                '💰 MRP and net weight',
                '🏷️ FSSAI license number',
                '🌿 Veg/Non-veg certification',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                  <p className="text-[11px] text-[#7a8fa6]">{item}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl mb-5 text-[11px] text-emerald-400 leading-relaxed">
              💡 <strong>Tip:</strong> Photograph the back or side where the nutrition table and ingredients are printed. Good lighting is important!
            </div>
            <button onClick={startCamera}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/20">
              📷 Open Camera
            </button>
          </div>
        ) : (
          <div>
            <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
              <video
                ref={el => { if (el && stream) { el.srcObject = stream; el.play(); setVideoEl(el) } }}
                className="w-full h-full object-cover" muted playsInline
              />
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
              </div>
              <div className="absolute bottom-3 inset-x-0 flex justify-center">
                <span className="bg-black/70 text-white text-[11px] px-3 py-1.5 rounded-full">
                  Point at product label or nutrition table
                </span>
              </div>
            </div>
            <div className="p-4">
              <button onClick={handleCapture} disabled={capturing}
                className={`w-full py-4 rounded-2xl text-white text-sm font-semibold transition-all ${
                  capturing
                    ? 'bg-[#2a3545] text-[#7a8fa6] cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95'
                }`}>
                {capturing ? '⏳ Processing…' : '📸 Capture Product'}
              </button>
              <p className="text-[11px] text-center text-[#7a8fa6] mt-2">
                Gemini AI will read everything visible on the product
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}