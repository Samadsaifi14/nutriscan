// src/app/contribute/page.tsx
"use client"

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { createClient } from '@supabase/supabase-js'
import { parseIndianNutritionLabel, type ParsedNutrition } from '@/lib/ocr/indian-label-parser'
import { enhanceImage, hasGlare } from '@/lib/ocr/image-enhancer'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface CapturedImage {
  dataUrl: string
}

interface ParsedData {
  nutrition: ParsedNutrition
  rawText: string
}

function ContributePageContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const barcode = searchParams?.get('barcode') || ''
  
  const [step, setStep] = useState<'capture_front' | 'capture_nutrition' | 'review' | 'done'>('capture_front')
  const [loading, setLoading] = useState(false)
  const [capturedImages, setCapturedImages] = useState<{
    front: CapturedImage | null
    nutrition: CapturedImage | null
  }>({ front: null, nutrition: null })
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
  })
  
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [correctedNutrition, setCorrectedNutrition] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/contribute')
    }
  }, [status, router])

  // Auto-start camera on mount
  useEffect(() => {
    if (status === 'authenticated' && step === 'capture_front') {
      // Camera starts automatically
    }
  }, [status, step])

  async function handlePhotoCapture(imageDataUrl: string) {
    if (step === 'capture_front') {
      setCapturedImages({ ...capturedImages, front: { dataUrl: imageDataUrl } })
      
      // Pre-fill brand from barcode
      if (barcode && barcode.startsWith('890')) {
        // Could lookup brand from barcode-intelligence
        setFormData({ ...formData, brand: '' })
      }
      
      // Move to nutrition capture
      setStep('capture_nutrition')
      
    } else if (step === 'capture_nutrition') {
      setCapturedImages({ ...capturedImages, nutrition: { dataUrl: imageDataUrl } })
      
      // Process the nutrition label with OCR
      await processNutritionLabel(imageDataUrl)
      setStep('review')
    }
  }

  async function processNutritionLabel(imageDataUrl: string) {
    setLoading(true)
    
    try {
      // Step 1: Check for glare
      const glareDetected = await hasGlare(imageDataUrl)
      if (glareDetected) {
        toast.error('⚠️ Glare detected! Please retake the photo without flash.')
        setLoading(false)
        return
      }

      // Step 2: Enhance image for better OCR
      let enhancedDataUrl = imageDataUrl
      try {
        const enhanced = await enhanceImage(imageDataUrl)
        enhancedDataUrl = enhanced.dataUrl
      } catch (e) {
        console.log('Enhancement failed, using original', e)
      }

      // Step 3: Use AI to extract text from the enhanced image
      const response = await fetch('/api/scan-product-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: enhancedDataUrl })
      })
      
      const json = await response.json()
      
      if (json.success && json.data) {
        const data = json.data
        const nutritionText = (data.ingredients_text || '') + ' ' + JSON.stringify(data.nutrition_per_100g || {})
        const parsed = parseIndianNutritionLabel(nutritionText)
        
        setParsedData({
          nutrition: parsed,
          rawText: data.ingredients_text || ''
        })
        
        // Set initial corrected values from parsed data
        const np = data.nutrition_per_100g || {}
        setCorrectedNutrition({
          calories: np.calories || null,
          protein: np.protein || null,
          fat: np.fat || null,
          saturated_fat: null,
          trans_fat: null,
          carbohydrates: np.carbs || np.carbohydrates || null,
          sugar: np.sugar || null,
          fiber: np.fiber || null,
          sodium: np.sodium || null,
        })
        
        // Pre-fill name if available
        if (data.name && !formData.name) {
          setFormData({ ...formData, name: data.name, brand: data.brand || '' })
        }
      }
    } catch (err) {
      console.error('OCR error:', err)
      toast.error('Could not read nutrition label')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    const userId = (session?.user as any)?.id
    if (!userId) {
      toast.error('Please sign in to contribute')
      return
    }

    if (!capturedImages.front || !capturedImages.nutrition) {
      toast.error('Please capture both photos')
      return
    }

    if (!formData.name.trim()) {
      toast.error('Product name is required')
      return
    }

    setLoading(true)

    try {
      // Upload images
      const userIdStr = userId as string
      const timestamp = Date.now()
      
      const frontUrl = await uploadImage(capturedImages.front.dataUrl, `front_${timestamp}.jpg`, userIdStr)
      const nutritionUrl = await uploadImage(capturedImages.nutrition.dataUrl, `nutrition_${timestamp}.jpg`, userIdStr)

      // Save to community_products - status = 'unverified' (shows immediately with badge)
      const { error } = await supabase.from('community_products').insert({
        barcode: barcode || null,
        name: formData.name,
        brand: formData.brand || null,
        front_label_url: frontUrl,
        nutrition_label_url: nutritionUrl,
        ingredients_text: parsedData?.rawText || null,
        nutrition: correctedNutrition,
        submitted_by: userId,
        status: 'unverified', // Shows with warning badge immediately!
      })

      if (error) throw error

      // Update user stats
      await supabase.rpc('increment_contributions', { user_id: userId })

      // Check for new badges
      try {
        const badgeRes = await fetch('/api/profile/badges', { method: 'POST' })
        const badgeJson = await badgeRes.json()
        if (badgeJson.newBadges?.length > 0) {
          const badgeNames = badgeJson.newBadges.map((b: any) => `${b.emoji} ${b.name}`).join(', ')
          setTimeout(() => toast.success(`🏅 New badge earned: ${badgeNames}`), 500)
        }
      } catch {}

      // Show impact immediately
      setStep('done')
      setLoading(false)

    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(error.message || 'Failed to submit')
      setLoading(false)
    }
  }

  async function uploadImage(dataUrl: string, filename: string, userId: string): Promise<string> {
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    
    const { data, error } = await supabase.storage
      .from('community-products')
      .upload(`${userId}/${filename}`, blob, { cacheControl: '3600', upsert: false })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('community-products')
      .getPublicUrl(`${userId}/${filename}`)

    return urlData.publicUrl
  }

  if (status === 'loading') {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] pb-24">
      
      {/* Step 1: Capture Front Label */}
      {step === 'capture_front' && (
        <CameraCapturePage
          title="📷 Scan Front of Package"
          description="Take a photo of the front of the product packet"
          onCapture={handlePhotoCapture}
          onSkip={() => { setStep('capture_nutrition') }}
        />
      )}

      {/* Step 2: Capture Nutrition Label */}
      {step === 'capture_nutrition' && (
        <CameraCapturePage
          title="📷 Scan Nutrition Label"
          description="Take a photo of the nutrition facts table on the back"
          onCapture={handlePhotoCapture}
          onSkip={() => { 
            setParsedData({ 
              nutrition: {
                calories: null,
                protein: null,
                fat: null,
                saturated_fat: null,
                trans_fat: null,
                carbohydrates: null,
                sugar: null,
                fiber: null,
                sodium: null,
                serving_size: null,
                ingredients_text: null,
                fssai_license: null,
                mrp: null,
                confidence: {}
              }, 
              rawText: '' 
            })
            setCorrectedNutrition({})
            setStep('review')
          }}
        />
      )}

      {/* Step 3: Review & Correct */}
      {step === 'review' && (
        <ReviewPage
          formData={formData}
          setFormData={setFormData}
          parsedData={parsedData}
          correctedNutrition={correctedNutrition}
          setCorrectedNutrition={setCorrectedNutrition}
          onSubmit={handleSubmit}
          onBack={() => setStep('capture_nutrition')}
          loading={loading}
          barcode={barcode}
        />
      )}

      {/* Step 4: Success */}
      {step === 'done' && (
        <SuccessPage 
          productName={formData.name}
          onContributeMore={() => {
            setStep('capture_front')
            setCapturedImages({ front: null, nutrition: null })
            setFormData({ name: '', brand: '' })
            setParsedData(null)
            setCorrectedNutrition(null)
          }}
          onGoHome={() => router.push('/dashboard')}
        />
      )}
    </div>
  )
}

// Camera Capture Component
function CameraCapturePage({ title, description, onCapture, onSkip }: {
  title: string
  description: string
  onCapture: (data: string) => void
  onSkip?: () => void
}) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      setStream(mediaStream)
      if (videoRef.current) videoRef.current.srcObject = mediaStream
    } catch (err) {
      console.error('Camera error:', err)
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
    if (stream) stream.getTracks().forEach(t => t.stop())
    onCapture(canvas.toDataURL('image/jpeg', 0.85))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex-1 relative">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11/12 h-2/3 border-2 border-white/40 rounded-lg" />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-center bg-black/60 px-4 py-2 rounded-lg text-sm">{description}</p>
        </div>
      </div>
      <div className="p-4 bg-black flex gap-3">
        {onSkip && (
          <button onClick={onSkip} className="flex-1 py-3 bg-gray-700 text-white font-bold rounded-xl">
            Skip / Don't have
          </button>
        )}
        <button onClick={capture} className="flex-1 py-3 bg-[var(--clay)] text-white font-bold rounded-xl">
          📸 Capture
        </button>
      </div>
    </div>
  )
}

// Review & Correction Page
function ReviewPage({ formData, setFormData, parsedData, correctedNutrition, setCorrectedNutrition, onSubmit, onBack, loading, barcode }: any) {
  return (
    <div className="px-4 pt-8 pb-6">
      <h1 className="text-xl font-black mb-2">✅ Review & Correct</h1>
      <p className="text-sm text-[#7a8fa6] mb-6">Please verify the extracted values</p>

      {/* Product Details */}
      <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-4 mb-4">
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-[#7a8fa6] font-bold uppercase">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1f28] border border-[#2a3545] rounded-xl text-sm mt-1"
              placeholder="e.g., Parle-G Glucose Biscuits"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#7a8fa6] font-bold uppercase">Brand</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1f28] border border-[#2a3545] rounded-xl text-sm mt-1"
              placeholder="e.g., Parle"
            />
          </div>
        </div>
      </div>

      {/* Nutrition Correction */}
      <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">📊 Nutrition (per 100g)</h2>
          <span className="text-[10px] text-amber-400">Tap to correct</span>
        </div>
        
        <div className="space-y-2">
          {[
            { key: 'calories', label: 'Energy', unit: 'kcal' },
            { key: 'protein', label: 'Protein', unit: 'g' },
            { key: 'fat', label: 'Total Fat', unit: 'g' },
            { key: 'carbohydrates', label: 'Carbs', unit: 'g' },
            { key: 'sugar', label: 'Sugar', unit: 'g' },
            { key: 'sodium', label: 'Sodium', unit: 'mg' },
          ].map((field) => (
            <div key={field.key} className="flex items-center justify-between py-2 border-b border-[#2a3545] last:border-0">
              <span className="text-sm text-[#7a8fa6]">{field.label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={correctedNutrition[field.key] || ''}
                  onChange={(e) => setCorrectedNutrition({ ...correctedNutrition, [field.key]: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-20 px-2 py-1 bg-[#1a1f28] border border-[#2a3545] rounded-lg text-sm text-right"
                  placeholder="—"
                />
                <span className="text-xs text-[#7a8fa6] w-6">{field.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      {parsedData?.rawText && (
        <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-4 mb-4">
          <h2 className="text-sm font-bold mb-2">📋 Ingredients</h2>
          <p className="text-xs text-[#7a8fa6] leading-relaxed">{parsedData.rawText}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 bg-[#1a1f28] border border-[#2a3545] text-[#7a8fa6] font-bold rounded-xl">
          ← Back
        </button>
        <button onClick={onSubmit} disabled={loading || !formData.name} className="flex-1 py-3 bg-[var(--clay)] disabled:bg-[#2a3545] text-white font-bold rounded-xl">
          {loading ? 'Submitting...' : '✅ Submit'}
        </button>
      </div>
    </div>
  )
}

// Success Page with Impact
function SuccessPage({ productName, onContributeMore, onGoHome }: { productName: string; onContributeMore: () => void; onGoHome: () => void }) {
  const [impact] = useState(Math.floor(Math.random() * 1000) + 100) // Simulated

  return (
    <div className="px-4 pt-12 pb-6 text-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[var(--clay)] to-[color-mix(in_oklab,var(--clay),black_15%)] mx-auto mb-6 flex items-center justify-center text-6xl">
        🎉
      </div>
      
      <h1 className="text-2xl font-black mb-2">You're the First!</h1>
      <p className="text-[#7a8fa6] mb-6">
        You added <span className="text-[var(--clay)] font-bold">{productName}</span> to HealthOX.
      </p>

      <div className="bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-4 mb-6">
        <p className="text-amber-400 text-sm font-bold mb-2">🇮🇳 Helping 10 crore Indians!</p>
        <p className="text-xs text-[#7a8fa6]">
          When 2 more people confirm this product, it goes live and helps everyone make healthier choices.
        </p>
      </div>

      <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl p-4 mb-6">
        <p className="text-xs text-[#7a8fa6] mb-1">Your Impact</p>
        <p className="text-2xl font-black text-[var(--clay)]">{impact}+ people</p>
        <p className="text-[10px] text-[#7a8fa6]">will see this product when it goes live</p>
      </div>

      <button onClick={onGoHome} className="w-full py-3 bg-[var(--clay)] text-white font-bold rounded-xl mb-3">
        Back to Home
      </button>
      <button onClick={onContributeMore} className="text-sm text-[var(--clay)] font-bold">
        Add another product →
      </button>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function ContributePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ContributePageContent />
    </Suspense>
  )
}