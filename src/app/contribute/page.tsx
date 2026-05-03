// src/app/contribute/page.tsx
"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface CapturedImage {
  dataUrl: string
  file?: File
}

export default function ContributePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const barcode = searchParams?.get('barcode') || ''
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [capturedImages, setCapturedImages] = useState<{
    front: CapturedImage | null
    nutrition: CapturedImage | null
  }>({ front: null, nutrition: null })
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    ingredients: '',
  })

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/contribute')
    }
  }, [status, router])

async function handleSubmit() {
    const userId = (session?.user as any)?.id
    if (!userId) {
      toast.error('Please sign in to contribute')
      return
    }

    setLoading(true)

    try {
      // Upload images to Supabase Storage
      const timestamp = Date.now()
      
      const frontUrl = await uploadImage(capturedImages.front!.dataUrl, `front_${timestamp}.jpg`, userId)
      const nutritionUrl = await uploadImage(capturedImages.nutrition!.dataUrl, `nutrition_${timestamp}.jpg`, userId)

      // Extract ingredients from nutrition label image using AI
      let extractedIngredients = formData.ingredients
      let nutritionData = {}
      
      if (capturedImages.nutrition?.dataUrl) {
        try {
          const nutritionRes = await fetch('/api/scan-product-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: capturedImages.nutrition.dataUrl })
          })
          const nutritionJson = await nutritionRes.json()
          
          if (nutritionJson.success && nutritionJson.data) {
            extractedIngredients = nutritionJson.data.ingredients_text || formData.ingredients
            nutritionData = nutritionJson.data.nutrition_per_100g || {}
          }
        } catch (e) {
          console.log('Could not extract from photo, using manual input')
        }
      }

      // Save to community_products table
      const { error } = await supabase.from('community_products').insert({
        barcode: barcode || null,
        name: formData.name,
        brand: formData.brand || null,
        front_label_url: frontUrl,
        nutrition_label_url: nutritionUrl,
        ingredients_text: extractedIngredients || null,
        nutrition: nutritionData,
        submitted_by: userId,
        status: 'pending',
      })

      if (error) throw error

      // Update user's contribution count
      await supabase.rpc('increment_contributions', { user_id: userId })

      toast.success('🎉 Thank you! Your contribution helps 10 crore Indians!')
      setStep(4) // Success screen

    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(error.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function uploadImage(dataUrl: string, filename: string, userId: string): Promise<string> {
    // Convert base64 to blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    
    const { data, error } = await supabase.storage
      .from('community-products')
      .upload(`${userId}/${filename}`, blob, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('community-products')
      .getPublicUrl(`${userId}/${filename}`)

    return urlData.publicUrl
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-emerald-500/20 to-transparent px-5 pt-12 pb-6">
        <button onClick={() => router.back()} className="text-[#7a8fa6] text-sm mb-4">
          ← Go back
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">
            🇮🇳
          </div>
          <div>
            <h1 className="text-xl font-black">Help Build India's DB</h1>
            <p className="text-sm text-[#7a8fa6]">Help 10 crore Indians eat healthier</p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 h-1.5 rounded-full bg-[#2a3545] overflow-hidden">
              <div className={`h-full transition-all ${step >= s ? 'bg-emerald-500' : 'bg-transparent'}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-[#7a8fa6]">
          <span>Details</span>
          <span>Photos</span>
          <span>Review</span>
        </div>
      </div>

      <div className="px-5 pt-4">
        
        {/* Step 1: Product Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-4">
              <h2 className="text-sm font-bold mb-4">📝 Product Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-[#7a8fa6] font-bold uppercase mb-1.5 block">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Parle-G Glucose Biscuits"
                    className="w-full px-3 py-2.5 bg-[#1a1f28] border border-[#2a3545] rounded-xl text-sm text-[#f0f4f8] placeholder-[#7a8fa6]/50 outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#7a8fa6] font-bold uppercase mb-1.5 block">
                    Brand (if known)
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Parle"
                    className="w-full px-3 py-2.5 bg-[#1a1f28] border border-[#2a3545] rounded-xl text-sm text-[#f0f4f8] placeholder-[#7a8fa6]/50 outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#7a8fa6] font-bold uppercase mb-1.5 block">
                    Ingredients (if you know them)
                  </label>
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="e.g., Wheat Flour, Sugar, Glucose, Vegetable Oil..."
                    rows={3}
                    className="w-full px-3 py-2.5 bg-[#1a1f28] border border-[#2a3545] rounded-xl text-sm text-[#f0f4f8] placeholder-[#7a8fa6]/50 outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => formData.name.trim() && setStep(2)}
              disabled={!formData.name.trim()}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-[#2a3545] disabled:text-[#7a8fa6] text-white font-bold rounded-xl transition-colors"
            >
              Continue to Photos →
            </button>
          </div>
        )}

        {/* Step 2: Photo Capture */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Front Label */}
            <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-4">
              <h2 className="text-sm font-bold mb-3">📷 Photo 1: Front of Package</h2>
              
              {capturedImages.front ? (
                <div className="relative">
                  <img 
                    src={capturedImages.front.dataUrl} 
                    alt="Front label" 
                    className="w-full rounded-xl"
                  />
                  <button
                    onClick={() => setCapturedImages({ ...capturedImages, front: null })}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <CameraCapture 
                  onCapture={(dataUrl) => setCapturedImages({ ...capturedImages, front: { dataUrl } })}
                  label="Capture front of package"
                />
              )}
            </div>

            {/* Nutrition Label */}
            <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-4">
              <h2 className="text-sm font-bold mb-3">📷 Photo 2: Nutrition Label</h2>
              
              {capturedImages.nutrition ? (
                <div className="relative">
                  <img 
                    src={capturedImages.nutrition.dataUrl} 
                    alt="Nutrition label" 
                    className="w-full rounded-xl"
                  />
                  <button
                    onClick={() => setCapturedImages({ ...capturedImages, nutrition: null })}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <CameraCapture 
                  onCapture={(dataUrl) => setCapturedImages({ ...capturedImages, nutrition: { dataUrl } })}
                  label="Capture nutrition facts table"
                />
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 bg-[#1a1f28] border border-[#2a3545] text-[#7a8fa6] font-bold rounded-xl"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!capturedImages.front || !capturedImages.nutrition}
                className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-[#2a3545] disabled:text-[#7a8fa6] text-white font-bold rounded-xl transition-colors"
              >
                Review →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-4">
              <h2 className="text-sm font-bold mb-4">✅ Review Your Contribution</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[11px] text-[#7a8fa6]">Product</span>
                  <span className="text-sm font-bold text-[#f0f4f8]">{formData.name}</span>
                </div>
                {formData.brand && (
                  <div className="flex justify-between">
                    <span className="text-[11px] text-[#7a8fa6]">Brand</span>
                    <span className="text-sm text-[#f0f4f8]">{formData.brand}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[11px] text-[#7a8fa6]">Front Photo</span>
                  <span className="text-sm text-emerald-400">✓ Captured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-[#7a8fa6]">Nutrition Photo</span>
                  <span className="text-sm text-emerald-400">✓ Captured</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-[11px] text-amber-400">
                📋 Your submission will be reviewed by the community. 
                Once 3 users approve, it goes live and helps all NutriScan users!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 bg-[#1a1f28] border border-[#2a3545] text-[#7a8fa6] font-bold rounded-xl"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-[#2a3545] text-white font-bold rounded-xl transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Contribution'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-5xl mb-6 mx-auto">
              🎉
            </div>
            <h2 className="text-xl font-black text-[#f0f4f8] mb-2">Thank You, Contributor!</h2>
            <p className="text-sm text-[#7a8fa6] mb-6">
              You've helped build India's food database. Your contribution will help millions make healthier choices!
            </p>
            
            <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-4 mb-6">
              <p className="text-[11px] text-[#7a8fa6] mb-2">Your contribution count</p>
              <p className="text-3xl font-black text-emerald-400">+1</p>
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Camera capture component
function CameraCapture({ onCapture, label }: { onCapture: (data: string) => void; label: string }) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showCamera, setShowCamera] = useState(false)

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
      toast.error('Could not access camera')
    }
  }

  function capture() {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(videoRef.current, 0, 0)
    onCapture(canvas.toDataURL('image/jpeg', 0.8))
    stopCamera()
    setShowCamera(false)
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="flex-1 relative">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
        <div className="p-4 bg-black/80 flex gap-3">
          <button onClick={() => { stopCamera(); setShowCamera(false) }} className="flex-1 py-3 bg-gray-600 text-white font-bold rounded-xl">
            Cancel
          </button>
          <button onClick={capture} className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl">
            📸 Capture
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => { startCamera(); setShowCamera(true) }}
      className="w-full py-8 border-2 border-dashed border-[#2a3545] rounded-xl text-[#7a8fa6] hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
    >
      📷 {label}
    </button>
  )
}