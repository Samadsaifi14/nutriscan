// src/components/scan/VisionCaptureModal.tsx
"use client"
import { useState } from 'react'
import toast from 'react-hot-toast'

interface VisionCaptureProps {
  notFoundBarcode: string | null
  visionStatus:    string
  onCapture:       (b64: string) => void
}

export function VisionCapturePanel({ notFoundBarcode, visionStatus, onCapture }: VisionCaptureProps) {
  return (
    <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-5 mb-4">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">🇮🇳</span>
        <div>
          <p className="text-sm font-semibold text-[#f0f4f8]">Product not in database</p>
          <p className="text-xs text-[#7a8fa6] mt-0.5">
            Barcode <span className="font-mono text-emerald-400">{notFoundBarcode}</span> was not found.
            Photograph the nutrition label to add it to our Indian database.
          </p>
        </div>
      </div>
      {visionStatus && (
        <div className="px-4 py-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 mb-3">
          {visionStatus}
        </div>
      )}
      <VisionCapture onCapture={onCapture} />
    </div>
  )
}

function VisionCapture({ onCapture }: { onCapture: (b64: string) => void }) {
  const [stream,  setStream]  = useState<MediaStream | null>(null)
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
  const [active,  setActive]  = useState(false)

  async function start() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setStream(s); setActive(true)
    } catch { toast.error('Camera access denied') }
  }

  function stop() { stream?.getTracks().forEach(t => t.stop()); setStream(null); setActive(false) }

  function capture() {
    if (!videoEl) return
    const canvas = document.createElement('canvas')
    canvas.width = videoEl.videoWidth; canvas.height = videoEl.videoHeight
    canvas.getContext('2d')?.drawImage(videoEl, 0, 0)
    const b64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
    stop(); onCapture(b64)
  }

  return (
    <div>
      {!active ? (
        <button onClick={start}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold transition-colors">
          📸 Open Camera — Read Nutrition Label
        </button>
      ) : (
        <div>
          <video
            ref={el => { if (el && stream) { el.srcObject = stream; el.play(); setVideoEl(el) } }}
            className="w-full rounded-xl mb-2 bg-black" muted playsInline
          />
          <div className="flex gap-2">
            <button onClick={capture}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors">
              📸 Capture
            </button>
            <button onClick={stop}
              className="px-4 py-3 rounded-xl bg-[#1e242d] border border-[#2a3545] text-[#7a8fa6] text-sm hover:border-[#3a4555] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}