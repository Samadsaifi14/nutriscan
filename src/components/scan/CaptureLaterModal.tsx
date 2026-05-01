// Capture Later Modal - Quick capture for background processing
"use client"

import { useState, useRef } from 'react'
import { Camera, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface CaptureLaterModalProps {
  onCapture: (imageData: string, barcode?: string) => Promise<void>
  onClose: () => void
}

export function CaptureLaterModal({ onCapture, onClose }: CaptureLaterModalProps) {
  const [capturing, setCapturing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [barcode, setBarcode] = useState('')

  // Start camera on mount
  useState(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error('Camera error:', err)
        toast.error('Could not access camera')
      }
    }
    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  })

  async function handleCapture() {
    if (!videoRef.current || !canvasRef.current) return

    setCapturing(true)
    
    try {
      // Capture frame
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No canvas context')
      
      ctx.drawImage(video, 0, 0)
      
      // Get base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      
      // Stop camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      
      // Queue for background processing
      await onCapture(imageData, barcode || undefined)
    } catch (err) {
      console.error('Capture error:', err)
      toast.error('Failed to capture')
    } finally {
      setCapturing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <button onClick={onClose} className="p-2">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">📸 Capture for Later</h2>
        <div className="w-10" />
      </div>

      {/* Camera Preview */}
      <div className="flex-1 relative">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Overlay guide */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-40 border-2 border-white/50 rounded-lg" />
        </div>
      </div>

      {/* Barcode Input */}
      <div className="p-4 bg-black">
        <input
          type="text"
          placeholder="Enter barcode (optional)"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4"
        />
        
        <button
          onClick={handleCapture}
          disabled={capturing}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          {capturing ? (
            <>
              <span className="animate-spin">⏳</span>
              Processing...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Capture & Queue
            </>
          )}
        </button>
        
        <p className="text-center text-gray-400 text-sm mt-3">
          Quick capture - we'll process it in the background
        </p>
      </div>
    </div>
  )
}