// src/app/scan/page.tsx
"use client"
import { useState, useEffect }            from 'react'
import { useRouter }                       from 'next/navigation'
import dynamic                             from 'next/dynamic'
import toast                               from 'react-hot-toast'
import { useSession }                      from 'next-auth/react'
import { event, AnalyticsEvents }          from '@/lib/analytics'
import { compressImageBase64 }             from '@/lib/imageUtils'
import { writeScanResult }                 from '@/types/scanResult'
import type { Product, Analysis, ScanResultPayload } from '@/types/scanResult'

import { ScanHeader }                      from '@/components/scan/ScanHeader'
import { ScanModeButtons }                 from '@/components/scan/ScanModeButtons'
import { LoadingProduct, LoadingAnalysis } from '@/components/scan/LoadingState'
import { ScanErrorBanner, AnalysisErrorBanner } from '@/components/scan/ScanErrorBanner'
import { VisionCapturePanel }              from '@/components/scan/VisionCaptureModal'
import { ProductPhotoCaptureModal }        from '@/components/scan/ProductPhotoCaptureModal'
import { CaptureLaterModal }               from '@/components/scan/CaptureLaterModal'
import { ProductCard }                     from '@/components/results/ProductCard'
import { AnalysisCard }                    from '@/components/results/AnalysisCard'

const BarcodeScanner = dynamic(
  () => import('@/components/scanner/BarcodeScanner'),
  { ssr: false }
)

export default function ScanPage() {
  const router              = useRouter()
  const { status }          = useSession()
  const isGuest             = status === 'unauthenticated'

  const [showScanner,     setShowScanner]     = useState(false)
  const [showPhotoMode,   setShowPhotoMode]   = useState(false)
  const [loadingProduct,  setLoadingProduct]  = useState(false)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingPhoto,    setLoadingPhoto]    = useState(false)
  const [error,           setError]           = useState<string | null>(null)
  const [analysisError,   setAnalysisError]   = useState<string | null>(null)
  const [showVisionMode,  setShowVisionMode]  = useState(false)
  const [notFoundBarcode, setNotFoundBarcode] = useState<string | null>(null)
  const [visionStatus,    setVisionStatus]    = useState('')
  const [photoStatus,     setPhotoStatus]     = useState('')
  const [showDisclaimer,  setShowDisclaimer]  = useState(false)

  // ── Inline result state (shown on /scan if navigation fails) ──────────────
  const [scanResult,  setScanResult]  = useState<ScanResultPayload | null>(null)
  const [quantity,    setQuantity]    = useState(100)
  const [loggedMeal,  setLoggedMeal]  = useState<string | null>(null)

  const [pendingProduct, setPendingProduct] = useState<Product | null>(null)

  // Background scan state
  const [showCaptureLater, setShowCaptureLater] = useState(false)
  const [captureLaterSuccess, setCaptureLaterSuccess] = useState(false)

  // Capture and scan later handler
  async function handleCaptureLater(imageData: string, barcode?: string) {
    try {
      setLoadingPhoto(true)
      const res = await fetch('/api/background-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: barcode || null,
          image_data: imageData,
          scan_type: barcode ? 'barcode' : 'photo',
        }),
      })
      const json = await res.json()
      
      if (json.success) {
        setCaptureLaterSuccess(true)
        setShowCaptureLater(false)
        toast.success('📸 Capture queued! We\'ll notify you when it\'s done.')
        setTimeout(() => setCaptureLaterSuccess(false), 5000)
      } else {
        toast.error(json.error || 'Failed to queue scan')
      }
    } catch {
      toast.error('Failed to queue scan')
    } finally {
      setLoadingPhoto(false)
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('hox_disclaimer')) {
      setShowDisclaimer(true)
      localStorage.setItem('hox_disclaimer', '1')
    }
  }, [])

  function resetScan() {
    setError(null)
    setAnalysisError(null)
    setShowVisionMode(false)
    setNotFoundBarcode(null)
    setPendingProduct(null)
    setScanResult(null)
    setLoggedMeal(null)
  }

  // ── Log meal (inline result card) ─────────────────────────────────────────

  async function handleLogMeal(mealType: string) {
    if (!scanResult) return
    if (isGuest) { toast.error('Please sign in to log meals and track calories'); return }
    const { product } = scanResult
    try {
      const res  = await fetch('/api/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name:      product.name,
          barcode:           product.barcode || null,
          quantity_g:        quantity,
          calories_per_100g: product.nutrition?.calories || 0,
          protein_per_100g:  product.nutrition?.protein  || 0,
          carbs_per_100g:    product.nutrition?.carbs    || 0,
          fat_per_100g:      product.nutrition?.fat      || 0,
          sodium_per_100g:   product.nutrition?.sodium   || 0,
          meal_type:         mealType,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setLoggedMeal(mealType)
        toast.success(`✅ Logged ${quantity}g as ${mealType}!`)
      } else {
        toast.error(json.error || 'Failed to log meal.')
      }
    } catch { toast.error('Network error. Please try again.') }
  }

  // ── AI analysis ────────────────────────────────────────────────────────────

  async function runAnalysis(productData: Product) {
    setLoadingAnalysis(true)
    setAnalysisError(null)
    try {
      const res = await fetch('/api/analyze', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            barcode:           productData.barcode,
            name:              productData.name,
            brand:             productData.brand             ?? undefined,
            category:          productData.category          ?? undefined,
            country_of_origin: productData.country_of_origin ?? undefined,
            image_url:         productData.image_url         ?? undefined,
            nutrition: {
              calories: productData.nutrition?.calories ?? 0,
              protein:  productData.nutrition?.protein  ?? 0,
              carbs:    productData.nutrition?.carbs    ?? 0,
              fat:      productData.nutrition?.fat      ?? 0,
              sugar:    productData.nutrition?.sugar    ?? undefined,
              sodium:   productData.nutrition?.sodium   ?? undefined,
              fiber:    productData.nutrition?.fiber    ?? undefined,
            },
            ingredients_text: productData.ingredients_text ?? undefined,
            allergens:        productData.allergens         ?? [],
            additives:        productData.additives         ?? [],
          },
        }),
      })

      const text = await res.text()
      let json: { success: boolean; data?: Analysis; error?: string; details?: string }
      try { json = JSON.parse(text) } catch {
        const msg = 'Server returned an invalid response.'
        setAnalysisError(msg); toast.error(msg); return
      }

      if (!res.ok || !json.success || !json.data) {
        const msg = json.error || json.details || `Server error (${res.status})`
        setAnalysisError(msg); toast.error(msg); return
      }

      const analysis: Analysis = { ...json.data, analyzed_at: new Date().toISOString() }

      event(AnalyticsEvents.VIEW_ANALYSIS, {
        product_name:  productData.name,
        health_rating: analysis.health_rating,
        health_score:  analysis.health_score,
        source:        productData.source || 'unknown',
      })

      if (!isGuest && productData.barcode) {
        fetch('/api/scan-session', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            barcode:          productData.barcode,
            product_name:     productData.name,
            product_image:    productData.image_url,
            ai_health_rating: analysis.health_rating,
            ai_health_score:  analysis.health_score,
          }),
        }).catch(console.error)
      }

      // Build the full payload
      const payload: ScanResultPayload = {
        version:   1,
        timestamp: new Date().toISOString(),
        product:   productData,
        analysis,
        quantity:  productData.serving_size_g || 100,
      }

      // 1. Write to localStorage (persists across navigation)
      writeScanResult({ product: productData, analysis, quantity: productData.serving_size_g || 100 })

      // 2. Show inline immediately (works even if navigation fails)
      setScanResult(payload)
      setQuantity(productData.serving_size_g || 100)

      // 3. Navigate to /results after a short delay so localStorage write completes
      setTimeout(() => {
        router.push('/results')
      }, 100)

    } catch (e: unknown) {
      const msg = (e instanceof Error) ? e.message : String(e)
      setAnalysisError('Analysis failed: ' + msg)
      toast.error('Analysis failed: ' + msg)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  // ── Barcode ────────────────────────────────────────────────────────────────

  async function handleBarcode(barcode: string) {
    setShowScanner(false); resetScan(); setLoadingProduct(true)
    event(AnalyticsEvents.SCAN_BARCODE, { barcode })
    try {
      const res  = await fetch(`/api/scan?barcode=${barcode}`)
      const json = await res.json()
      setLoadingProduct(false)

      if (!json.success && json.error === 'PRODUCT_NOT_FOUND') {
        setNotFoundBarcode(barcode); setShowVisionMode(true); return
      }
      if (!json.success) { setError(json.message || 'Something went wrong.'); return }

      const product: Product = json.data
      setPendingProduct(product)

      if (json.data.ai_analysis) {
        const analysis: Analysis = { ...json.data.ai_analysis, analyzed_at: new Date().toISOString() }
        const payload: ScanResultPayload = {
          version: 1, timestamp: new Date().toISOString(),
          product, analysis, quantity: product.serving_size_g || 100,
        }
        writeScanResult({ product, analysis, quantity: product.serving_size_g || 100 })
        setScanResult(payload)
        setQuantity(product.serving_size_g || 100)
        setTimeout(() => router.push('/results'), 100)
      } else {
        await runAnalysis(product)
      }
    } catch {
      setLoadingProduct(false)
      setError(navigator.onLine ? 'Network error. Please check your connection.' : 'You appear to be offline.')
    }
  }

  // ── Photo ──────────────────────────────────────────────────────────────────

  async function handleProductPhoto(imageBase64: string) {
    setShowPhotoMode(false); resetScan(); setLoadingPhoto(true)
    setPhotoStatus('🗜️ Compressing image...')
    const compressed = await compressImageBase64(imageBase64, 1024, 0.82)
    setPhotoStatus('🤖 Gemini is reading the product...')
    event(AnalyticsEvents.SCAN_PHOTO, {})
    try {
      const res  = await fetch('/api/scan-product-photo', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageBase64: compressed }),
      })
      const json = await res.json()
      if (!json.success) {
        setLoadingPhoto(false)
        setError(res.status === 401
          ? 'Please sign in to scan product photos.'
          : json.error || 'Could not read the product.')
        return
      }
      const extracted = json.data
      setPhotoStatus('✅ Product identified! Running AI analysis...')
      if (json.message) toast.success(json.message)

      if (extracted.barcode) {
        const scanRes  = await fetch(`/api/scan?barcode=${extracted.barcode}`)
        const scanJson = await scanRes.json()
        if (scanJson.success) {
          setLoadingPhoto(false)
          await runAnalysis(scanJson.data)
          return
        }
      }

      const photoProduct: Product = {
        barcode:  extracted.barcode || `photo-${Date.now()}`,
        name:     extracted.name    || 'Unknown Product',
        brand:    extracted.brand   || null,
        category: null,
        country_of_origin: extracted.country_of_origin || null,
        image_url: null,
        source: 'gemini_photo',
        nutrition: {
          calories: extracted.nutrition_per_100g?.calories ?? 0,
          protein:  extracted.nutrition_per_100g?.protein  ?? 0,
          carbs:    extracted.nutrition_per_100g?.carbs    ?? 0,
          fat:      extracted.nutrition_per_100g?.fat      ?? 0,
          sugar:    extracted.nutrition_per_100g?.sugar    ?? null,
          sodium:   extracted.nutrition_per_100g?.sodium   ?? null,
          fiber:    extracted.nutrition_per_100g?.fiber    ?? null,
        },
        serving_size_g:   extracted.serving_size_g   || null,
        ingredients_text: extracted.ingredients_text || null,
        allergens:        extracted.allergens         || [],
        additives:        extracted.additives         || [],
        _photo_extras: {
          mrp:              extracted.mrp_rupees,
          fssai:            extracted.fssai_number,
          net_weight:       extracted.net_weight_g,
          health_claims:    extracted.health_claims,
          certifications:   extracted.certifications,
          variant:          extracted.variant,
          confidence:       extracted.confidence,
          image_quality:    extracted.image_quality,
          what_was_visible: extracted.what_was_visible,
        },
      }

      fetch('/api/products/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: photoProduct.barcode, name: photoProduct.name, brand: photoProduct.brand,
          ingredients_text: photoProduct.ingredients_text, allergens: photoProduct.allergens,
          additives: photoProduct.additives, nutrition_per_100g: extracted.nutrition_per_100g,
          source: 'gemini_photo',
        }),
      }).catch(() => {})

      await runAnalysis(photoProduct)
      setLoadingPhoto(false)
    } catch (e: unknown) {
      console.error('Photo scan error:', e)
      setLoadingPhoto(false)
      setError('Something went wrong. Please try again.')
    }
  }

  // ── Vision ─────────────────────────────────────────────────────────────────

  async function handleVisionCapture(imageBase64: string) {
    setVisionStatus('🗜️ Compressing image...')
    const compressed = await compressImageBase64(imageBase64, 1024, 0.82)
    setVisionStatus('🤖 Gemini is reading the label...')
    try {
      const res  = await fetch('/api/scan-vision', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body:   JSON.stringify({ imageBase64: compressed, mode: 'full_label' }),
      })
      const json = await res.json()
      if (!json.success || !json.data) {
        setVisionStatus(`❌ ${json.error || 'Could not read label'}`)
        toast.error(json.tip || 'Try better lighting or use manual barcode entry')
        if (res.status === 401) toast.error('Please sign in to scan product labels')
        return
      }
      const extracted = json.data
      setVisionStatus('✅ Label read! Looking up product...')

      if (extracted.barcode) {
        setShowVisionMode(false); setLoadingProduct(true)
        const scanRes  = await fetch(`/api/scan?barcode=${extracted.barcode}`)
        const scanJson = await scanRes.json()
        setLoadingProduct(false)
        if (scanJson.success) {
          await runAnalysis(scanJson.data); return
        }
      }

      setVisionStatus('💾 Saving product to Indian database...')
      const submitRes  = await fetch('/api/products/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...extracted, barcode: extracted.barcode || notFoundBarcode || `vision-${Date.now()}` }),
      })
      const submitJson = await submitRes.json()

      if (submitJson.success) {
        setShowVisionMode(false)
        const visionProduct: Product = {
          barcode: submitJson.data.barcode,
          name:    submitJson.data.name || extracted.name,
          brand:   submitJson.data.brand,
          source:  'gemini_vision',
          nutrition: {
            calories: submitJson.data.calories_per_100g ?? 0,
            protein:  submitJson.data.protein_per_100g  ?? 0,
            carbs:    submitJson.data.carbs_per_100g    ?? 0,
            fat:      submitJson.data.fat_per_100g      ?? 0,
            sugar:    submitJson.data.sugar_per_100g    ?? null,
            sodium:   submitJson.data.sodium_per_100g   ?? null,
          },
          ingredients_text: submitJson.data.ingredients_text,
          allergens:        submitJson.data.allergens || [],
          additives:        submitJson.data.additives || [],
        }
        await runAnalysis(visionProduct)
      }
    } catch { setVisionStatus('❌ Something went wrong. Please try again.') }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  // If we have a result and navigation is happening, show a loading screen
  // so the user sees something while router.push('/results') completes
  if (scanResult && !loadingAnalysis) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] font-sans">
        <div className="px-5 pt-12 pb-5 border-b border-[#2a3545]">
          <div className="flex items-center justify-between">
            <button
              onClick={resetScan}
              className="flex items-center gap-2 text-[#7a8fa6] hover:text-[#f0f4f8] text-sm transition-colors"
            >
              ← Scan again
            </button>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-medium">Result</span>
            </div>
          </div>
          <h1 className="text-lg font-bold text-[#f0f4f8] mt-3 tracking-tight">
            health<span className="text-emerald-400">OX</span> Analysis
          </h1>
          <p className="text-xs text-[#7a8fa6] mt-0.5">
            {new Date(scanResult.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <div className="px-4 py-5 max-w-lg mx-auto">
          <ProductCard
            product={scanResult.product}
            quantity={quantity}
            loggedMeal={loggedMeal}
            isGuest={isGuest}
            onQuantityChange={setQuantity}
            onLogMeal={handleLogMeal}
            onClearLog={() => setLoggedMeal(null)}
          />
          <AnalysisCard analysis={scanResult.analysis} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] font-sans">

      {/* Disclaimer */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end p-4">
          <div className="bg-[#161a20] border border-[#2a3545] rounded-3xl p-6 w-full max-w-sm mx-auto">
            <p className="text-3xl mb-3 text-center">⚕️</p>
            <h3 className="text-base font-semibold text-center mb-2">Health Disclaimer</h3>
            <p className="text-sm text-[#7a8fa6] text-center leading-relaxed mb-5">
              HealthOX provides AI-generated food health information for{' '}
              <strong className="text-[#f0f4f8]">educational purposes only.</strong>{' '}
              This is <strong className="text-[#f0f4f8]">not medical advice.</strong>{' '}
              Consult a nutritionist or doctor before making dietary changes.
            </p>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl text-sm transition-colors"
            >
              I Understand — Continue
            </button>
          </div>
        </div>
      )}

      <ScanHeader isGuest={isGuest} />

      <div className="px-4 py-5 max-w-lg mx-auto">

        <ScanModeButtons
          onBarcode={()   => { setShowScanner(true);  resetScan() }}
          onPhotoMode={() => { setShowPhotoMode(true); resetScan() }}
          onCaptureLater={() => { setShowCaptureLater(true); resetScan() }}
        />

        {(loadingProduct || loadingPhoto) && <LoadingProduct status={loadingPhoto ? photoStatus : undefined} />}
        {loadingAnalysis && <LoadingAnalysis />}

        {analysisError && !loadingAnalysis && (
          <AnalysisErrorBanner
            error={analysisError}
            onRetry={() => pendingProduct && runAnalysis(pendingProduct)}
          />
        )}

        {error && (
          <ScanErrorBanner
            error={error}
            onDismiss={()    => setError(null)}
            onRetry={()      => { setError(null); setShowScanner(true) }}
            onPhotoMode={()  => { setError(null); setShowPhotoMode(true) }}
          />
        )}

        {showVisionMode && (
          <VisionCapturePanel
            notFoundBarcode={notFoundBarcode}
            visionStatus={visionStatus}
            onCapture={handleVisionCapture}
          />
        )}
      </div>

      {showScanner && (
        <BarcodeScanner onDetected={handleBarcode} onClose={() => setShowScanner(false)} />
      )}
      {showPhotoMode && (
        <ProductPhotoCaptureModal onCapture={handleProductPhoto} onClose={() => setShowPhotoMode(false)} />
      )}
      {showCaptureLater && (
        <CaptureLaterModal 
          onCapture={handleCaptureLater} 
          onClose={() => setShowCaptureLater(false)} 
        />
      )}
      {captureLaterSuccess && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl text-center max-w-sm mx-4">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">Queued!</h3>
            <p className="text-gray-400">We'll process your scan in the background.</p>
          </div>
        </div>
      )}
    </div>
  )
}