"use client"
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { event, AnalyticsEvents } from '@/lib/analytics'

const BarcodeScanner = dynamic(
  () => import('@/components/scanner/BarcodeScanner'),
  { ssr: false }
)

// ── Types ─────────────────────────────────────────────────────────────────────

interface Nutrition {
  calories: number
  protein:  number
  carbs:    number
  fat:      number
  sugar?:   number | null
  sodium?:  number | null
  fiber?:   number | null
}

interface PhotoExtras {
  mrp?:            number | null
  fssai?:          string | null
  net_weight?:     number | null
  health_claims?:  string[] | null
  certifications?: string[] | null
  variant?:        string | null
  confidence?:     string | null
  image_quality?:  string | null
  what_was_visible?: string | null
}

interface Product {
  barcode?:         string
  name:             string
  brand?:           string | null
  category?:        string | null
  country_of_origin?: string | null
  image_url?:       string | null
  source?:          string
  nutrition:        Nutrition
  serving_size_g?:  number | null
  ingredients_text?: string | null
  allergens?:       string[]
  additives?:       string[]
  _photo_extras?:   PhotoExtras
}

interface HarmfulIngredient {
  name:                     string
  also_known_as?:           string[]
  found_in_product?:        boolean
  concern:                  string
  severity:                 'high' | 'medium' | 'low'
  scientific_source?:       string
  source_url?:              string
  global_safe_limit?:       string
  amount_in_this_product?:  string
  personalized_safe_limit?: string
  percentage_of_daily_limit?: string
}

interface IngredientWarning {
  ingredient: string
  concern:    string
  severity:   'high' | 'medium' | 'low'
}

interface Alternative {
  name:          string
  reason?:       string
  availability?: string
  type?:         string
}

interface Analysis {
  health_rating:    'healthy' | 'moderate' | 'unhealthy'
  health_score:     number
  summary:          string
  personalized?:    boolean
  analyzed_at:      string
  health_score_breakdown?: {
    nutrition_score:         number
    ingredient_safety_score: number
    processing_score:        number
  }
  safe_consumption?: {
    amount?:                string
    frequency?:             string
    notes?:                 string
    personalized_for_user?: string
  }
  harmful_ingredients?:   HarmfulIngredient[]
  ingredient_warnings?:   IngredientWarning[]
  long_term_risks?:       string[]
  positives?:             string[]
  healthier_alternatives?: Alternative[]
  detailed_breakdown?:    Record<string, string>
  diabetic_suitability?:  string
  bp_suitability?:        string
  child_suitability?:     string
  pregnancy_suitability?: string
  fssai_compliance?:      string
}

// ── Colour helpers ────────────────────────────────────────────────────────────

const ratingColors: Record<string, string> = {
  healthy:   '#059669',
  moderate:  '#d97706',
  unhealthy: '#dc2626',
}
const ratingEmoji: Record<string, string> = {
  healthy:   '✅',
  moderate:  '⚠️',
  unhealthy: '❌',
}
const ratingBg: Record<string, string> = {
  healthy:   'rgba(5,150,105,0.08)',
  moderate:  'rgba(217,119,6,0.08)',
  unhealthy: 'rgba(220,38,38,0.08)',
}

function scoreColor(s: number) {
  if (s >= 7.5) return '#059669'
  if (s >= 5.5) return '#d97706'
  if (s >= 3.5) return '#f97316'
  return '#dc2626'
}

const severityBorderColor = { high: 'rgba(220,38,38,0.3)', medium: 'rgba(217,119,6,0.3)', low: 'rgba(156,163,175,0.3)' }
const severityBg          = { high: 'rgba(220,38,38,0.08)', medium: 'rgba(217,119,6,0.08)', low: 'rgba(156,163,175,0.06)' }
const severityDotColor    = { high: '#dc2626', medium: '#d97706', low: '#6b7280' }
const severityDotEmoji    = { high: '🔴', medium: '🟡', low: '🟢' }

const suitabilityColor = (v: string) =>
  v === 'suitable' ? '#059669' : v === 'consume_with_caution' ? '#d97706' : '#dc2626'
const suitabilityBg = (v: string) =>
  v === 'suitable' ? 'rgba(5,150,105,0.1)' : v === 'consume_with_caution' ? 'rgba(217,119,6,0.1)' : 'rgba(220,38,38,0.1)'
const suitabilityIcon = (v: string) =>
  v === 'suitable' ? '✓' : v === 'consume_with_caution' ? '⚠' : '✗'

// ── Sub-components ────────────────────────────────────────────────────────────

function HealthScoreRing({ score, rating }: { score: number; rating: string }) {
  const color        = scoreColor(score)
  const radius       = 36
  const circumference = 2 * Math.PI * radius
  const progress     = (Math.min(Math.max(score, 0), 10) / 10) * circumference
  const gap          = circumference - progress

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${gap}`}
            style={{ transition: 'stroke-dasharray 1.2s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>{score}</span>
          <span className="text-xs text-[var(--muted)]">/10</span>
        </div>
      </div>
      <span className="text-sm font-bold capitalize mt-1" style={{ color }}>
        {ratingEmoji[rating]} {rating}
      </span>
    </div>
  )
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[var(--muted)]">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{score}/10</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score * 10}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ScanPage() {
  const { data: session, status } = useSession()
  const isGuest = status === 'unauthenticated'

  const [showScanner,     setShowScanner]     = useState(false)
  const [showPhotoMode,   setShowPhotoMode]   = useState(false)
  const [product,         setProduct]         = useState<Product | null>(null)
  const [analysis,        setAnalysis]        = useState<Analysis | null>(null)
  const [loadingProduct,  setLoadingProduct]  = useState(false)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingPhoto,    setLoadingPhoto]    = useState(false)
  const [error,           setError]           = useState<string | null>(null)
  const [analysisError,   setAnalysisError]   = useState<string | null>(null)
  const [showVisionMode,  setShowVisionMode]  = useState(false)
  const [notFoundBarcode, setNotFoundBarcode] = useState<string | null>(null)
  const [visionStatus,    setVisionStatus]    = useState('')
  const [photoStatus,     setPhotoStatus]     = useState('')
  const [quantity,        setQuantity]        = useState(100)
  const [loggedMeal,      setLoggedMeal]      = useState<string | null>(null)
  const [activeTab,       setActiveTab]       = useState<'overview' | 'ingredients' | 'alternatives'>('overview')
  const [debugLog,        setDebugLog]        = useState<string[]>([])
  const [showDisclaimer,  setShowDisclaimer]  = useState(false)

  // Show disclaimer once per device
  useEffect(() => {
    if (!localStorage.getItem('hox_disclaimer')) {
      setShowDisclaimer(true)
      localStorage.setItem('hox_disclaimer', '1')
    }
  }, [])

  function debug(msg: string) {
    setDebugLog(prev => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  function resetScan() {
    setProduct(null)
    setAnalysis(null)
    setAnalysisError(null)
    setError(null)
    setShowVisionMode(false)
    setNotFoundBarcode(null)
    setLoggedMeal(null)
    setActiveTab('overview')
    setQuantity(100)
  }

  // ── AI analysis ────────────────────────────────────────────────────────────
  async function runAnalysis(productData: Product) {
    setLoadingAnalysis(true)
    setAnalysisError(null)
    setAnalysis(null)

    try {
      debug('Sending to AI analysis...')
      debug(`Product: name="${productData.name}", nutrition keys=${Object.keys(productData.nutrition).join(',')}`)

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
      try {
        json = JSON.parse(text)
      } catch {
        debug(`ERROR: non-JSON response (${res.status}): ${text.slice(0, 200)}`)
        const msg = 'Server returned an invalid response. Check server logs.'
        setAnalysisError(msg)
        toast.error(msg)
        return
      }

      debug(`Analyze API: status=${res.status}, success=${json.success}`)

      if (!res.ok) {
        const errMsg = json.error || json.details || `Server error (${res.status})`
        debug(`ERROR: ${errMsg}`)
        setAnalysisError(errMsg)
        toast.error(errMsg)
        return
      }

      if (json.success && json.data) {
        const data = json.data
        debug(`Analysis: rating=${data.health_rating}, score=${data.health_score}`)
        debug(`  harmful_ingredients: ${data.harmful_ingredients?.length || 0}`)
        debug(`  alternatives: ${data.healthier_alternatives?.length || 0}`)

        setAnalysis(data)

        event(AnalyticsEvents.VIEW_ANALYSIS, {
          product_name:  productData.name,
          health_rating: data.health_rating,
          health_score:  data.health_score,
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
              ai_health_rating: data.health_rating,
              ai_health_score:  data.health_score,
            }),
          }).catch(console.error)
        }
      } else {
        const errMsg = json.error || 'AI analysis failed. Please try again.'
        const detail = json.details ? ` — ${json.details}` : ''
        debug(`ERROR: ${errMsg}${detail}`)
        setAnalysisError(errMsg + detail)
        toast.error(errMsg)
      }
    } catch (e: unknown) {
      const msg = (e instanceof Error) ? e.message : String(e)
      debug(`FATAL: ${msg}`)
      setAnalysisError('Analysis failed: ' + msg)
      toast.error('Analysis failed: ' + msg)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  // ── Barcode detected ────────────────────────────────────────────────────────
  async function handleBarcode(barcode: string) {
    setShowScanner(false)
    resetScan()
    setLoadingProduct(true)

    event(AnalyticsEvents.SCAN_BARCODE, { barcode })

    try {
      const res  = await fetch(`/api/scan?barcode=${barcode}`)
      const json = await res.json()
      setLoadingProduct(false)
      debug(`Scan API: success=${json.success}, source=${json.source}`)

      if (!json.success && json.error === 'PRODUCT_NOT_FOUND') {
        setNotFoundBarcode(barcode)
        setShowVisionMode(true)
        return
      }
      if (!json.success) {
        setError(json.message || 'Something went wrong. Please try again.')
        return
      }

      setProduct(json.data)
      setQuantity(json.data.serving_size_g || 100)
      debug(`Product: ${json.data.name}`)

      // Use cached AI analysis if already stored, otherwise run fresh
      if (json.data.ai_analysis) {
        setAnalysis(json.data.ai_analysis)
      } else {
        await runAnalysis(json.data)
      }
    } catch (e: unknown) {
      setLoadingProduct(false)
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
      setError(
        isOffline
          ? 'You appear to be offline. Check your connection and try again.'
          : 'Network error. Please check your connection and try again.'
      )
    }
  }

  // ── Product photo ───────────────────────────────────────────────────────────
  async function handleProductPhoto(imageBase64: string) {
    setShowPhotoMode(false)
    resetScan()
    setLoadingPhoto(true)
    setPhotoStatus('🤖 Gemini is reading the product...')

    event(AnalyticsEvents.SCAN_PHOTO, {})

    try {
      const res  = await fetch('/api/scan-product-photo', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageBase64 }),
      })
      const json = await res.json()

      if (!json.success) {
        setLoadingPhoto(false)
        setError(
          res.status === 401
            ? 'Please sign in to scan product photos.'
            : json.error || 'Could not read the product. Try better lighting or a clearer angle.'
        )
        return
      }

      const extracted = json.data
      setPhotoStatus('✅ Product identified! Running AI analysis...')
      if (json.message) toast.success(json.message)

      // If barcode extracted, try DB first
      if (extracted.barcode) {
        const scanRes  = await fetch(`/api/scan?barcode=${extracted.barcode}`)
        const scanJson = await scanRes.json()
        if (scanJson.success) {
          setLoadingPhoto(false)
          setProduct(scanJson.data)
          setQuantity(scanJson.data.serving_size_g || 100)
          await runAnalysis(scanJson.data)
          return
        }
      }

      const photoProduct: Product = {
        barcode:          extracted.barcode || `photo-${Date.now()}`,
        name:             extracted.name    || 'Unknown Product',
        brand:            extracted.brand   || null,
        category:         null,
        country_of_origin: extracted.country_of_origin || null,
        image_url:        null,
        source:           'gemini_photo',
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
          mrp:             extracted.mrp_rupees,
          fssai:           extracted.fssai_number,
          net_weight:      extracted.net_weight_g,
          health_claims:   extracted.health_claims,
          certifications:  extracted.certifications,
          variant:         extracted.variant,
          confidence:      extracted.confidence,
          image_quality:   extracted.image_quality,
          what_was_visible: extracted.what_was_visible,
        },
      }

      setProduct(photoProduct)
      setQuantity(extracted.serving_size_g || 100)

      // Save to DB for future scans (fire-and-forget)
      fetch('/api/products/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode:          photoProduct.barcode,
          name:             photoProduct.name,
          brand:            photoProduct.brand,
          ingredients_text: photoProduct.ingredients_text,
          allergens:        photoProduct.allergens,
          additives:        photoProduct.additives,
          nutrition_per_100g: extracted.nutrition_per_100g,
          source:           'gemini_photo',
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

  // ── Vision label capture (not-found flow) ──────────────────────────────────
  async function handleVisionCapture(imageBase64: string) {
    setVisionStatus('🤖 Gemini is reading the label...')

    try {
      const res  = await fetch('/api/scan-vision', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageBase64, mode: 'full_label' }),
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
        setShowVisionMode(false)
        setLoadingProduct(true)
        const scanRes  = await fetch(`/api/scan?barcode=${extracted.barcode}`)
        const scanJson = await scanRes.json()
        setLoadingProduct(false)
        if (scanJson.success) {
          setProduct(scanJson.data)
          setQuantity(scanJson.data.serving_size_g || 100)
          await runAnalysis(scanJson.data)
          return
        }
      }

      setVisionStatus('💾 Saving product to Indian database...')
      const submitRes  = await fetch('/api/products/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...extracted,
          barcode: extracted.barcode || notFoundBarcode || `vision-${Date.now()}`,
        }),
      })
      const submitJson = await submitRes.json()

      if (submitJson.success) {
        setShowVisionMode(false)
        const visionProduct: Product = {
          barcode:         submitJson.data.barcode,
          name:            submitJson.data.name || extracted.name,
          brand:           submitJson.data.brand,
          source:          'gemini_vision',
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
        setProduct(visionProduct)
        await runAnalysis(visionProduct)
      }
    } catch {
      setVisionStatus('❌ Something went wrong. Please try again.')
    }
  }

  // ── Meal logging ───────────────────────────────────────────────────────────
  async function handleLogMeal(mealType: string) {
    if (!product) return
    if (isGuest) {
      toast.error('Please sign in to log meals and track calories')
      return
    }

    try {
      const res  = await fetch('/api/log', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
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
        event(AnalyticsEvents.LOG_MEAL, {
          product_name: product.name,
          meal_type:    mealType,
          quantity_g:   quantity,
          calories:     Math.round((product.nutrition?.calories || 0) * quantity / 100),
        })
      } else {
        toast.error(json.error || 'Failed to log. Make sure you are signed in.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    }
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const gradStyle    = { background: 'linear-gradient(135deg, #059669, #0ea5e9)' }
  const harmfulCount = analysis?.harmful_ingredients?.filter(h => h.found_in_product !== false).length || 0
  const highSevCount = analysis?.harmful_ingredients?.filter(h => h.severity === 'high' && h.found_in_product !== false).length || 0

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* ── Health disclaimer (once per device) ──────────────────────────── */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end p-4">
          <div className="bg-[var(--card)] rounded-2xl p-6 w-full max-w-sm mx-auto shadow-2xl">
            <p className="text-2xl mb-3 text-center">⚕️</p>
            <h3 className="text-base font-bold text-[var(--foreground)] text-center mb-2">Health Disclaimer</h3>
            <p className="text-sm text-[var(--muted)] text-center leading-relaxed mb-5">
              HealthOX provides AI-generated food health information for{' '}
              <strong>educational purposes only.</strong>{' '}
              This is <strong>not medical advice.</strong> Consult a nutritionist or doctor before making dietary changes.
            </p>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full py-3 text-white font-bold rounded-xl text-sm"
              style={gradStyle}
            >
              I Understand — Continue
            </button>
          </div>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="px-5 pt-12 pb-6" style={gradStyle}>
        <h1 className="text-2xl font-black text-white mb-1">HealthOX Scanner</h1>
        <p className="text-emerald-100 text-sm">
          {isGuest
            ? 'Guest mode — sign in to save and track your meals'
            : 'Scan barcodes or take a product photo for instant AI health ratings'}
        </p>
        {isGuest && (
          <div className="mt-3 px-3 py-2 bg-white/20 rounded-xl border border-white/30">
            <p className="text-white text-xs">
              👤 You are in guest mode.{' '}
              <a href="/auth/signin" className="underline font-bold">Sign in</a>
              {' '}to save history and track calories.
            </p>
          </div>
        )}
      </div>

      <div className="px-4 py-5 max-w-lg mx-auto">

        {/* ── Scan mode buttons ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => { setShowScanner(true); resetScan() }}
            className="flex flex-col items-center gap-2 py-5 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
            style={{ ...gradStyle, boxShadow: '0 8px 24px rgba(5,150,105,0.3)' }}
          >
            <span className="text-3xl">📷</span>
            <span>Scan Barcode</span>
            <span className="text-xs opacity-80 font-normal">Point at barcode</span>
          </button>

          <button
            onClick={() => { setShowPhotoMode(true); resetScan() }}
            className="flex flex-col items-center gap-2 py-5 rounded-2xl font-bold text-sm transition-all active:scale-95 border-2"
            style={{
              borderColor: 'rgba(5,150,105,0.3)',
              background:  'rgba(5,150,105,0.06)',
              color:       '#059669',
            }}
          >
            <span className="text-3xl">🖼️</span>
            <span>Photo Mode</span>
            <span className="text-xs opacity-70 font-normal">Snap the whole product</span>
          </button>
        </div>

        {/* ── Loading: product lookup ───────────────────────────────────── */}
        {(loadingProduct || loadingPhoto) && (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
            <p className="text-sm text-[var(--muted)]">
              {loadingPhoto ? photoStatus : '🔍 Looking up product...'}
            </p>
          </div>
        )}

        {/* ── Loading: AI analysis ─────────────────────────────────────── */}
        {loadingAnalysis && (
          <div className="rounded-2xl p-6 bg-[var(--card)] border border-[var(--card-border)] shadow-sm mb-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-36 h-36 relative">
                <svg className="w-full h-full -rotate-90 animate-spin" viewBox="0 0 120 120"
                  style={{ animationDuration: '2s' }}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10"
                    className="text-gray-100 dark:text-gray-800" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#10b981" strokeWidth="10"
                    strokeLinecap="round" strokeDasharray="326" strokeDashoffset="244" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-emerald-500 text-center leading-tight px-2">
                    Analysing...
                  </span>
                </div>
              </div>
              <div className="space-y-2.5 w-full">
                {['Checking ingredients...', 'Detecting harmful additives...', 'Calculating health score...'].map((msg, i) => (
                  <div key={i} className="flex items-center gap-2.5 animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}>
                    <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0" />
                    <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 flex-grow" />
                    <span className="text-xs text-gray-400 whitespace-nowrap">{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Analysis error ────────────────────────────────────────────── */}
        {analysisError && !loadingAnalysis && (
          <div className="rounded-2xl p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <p className="flex-1 text-sm font-semibold text-red-700 dark:text-red-400">{analysisError}</p>
              <button
                onClick={() => product && runAnalysis(product)}
                className="flex-shrink-0 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400
                  text-xs font-semibold rounded-xl hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* ── Scan error ────────────────────────────────────────────────── */}
        {error && (
          <div className="p-4 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 mb-4">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">❌ {error}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setError(null)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700
                  dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-200 transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={() => { setError(null); setShowScanner(true) }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-gray-800
                  text-[var(--foreground)] border border-[var(--card-border)] hover:bg-gray-50 transition-colors"
              >
                🔄 Try Again
              </button>
              <button
                onClick={() => { setError(null); setShowPhotoMode(true) }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-gray-800
                  text-[var(--foreground)] border border-[var(--card-border)] hover:bg-gray-50 transition-colors"
              >
                📷 Photo Mode
              </button>
            </div>
          </div>
        )}

        {/* ── Vision mode (product not found) ──────────────────────────── */}
        {showVisionMode && (
          <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] mb-4">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🇮🇳</span>
              <div>
                <p className="text-sm font-bold text-[var(--foreground)]">Product not in database</p>
                <p className="text-xs text-[var(--muted)]">
                  Barcode <span className="font-mono text-[var(--foreground)]">{notFoundBarcode}</span> was not found.
                  Take a photo of the nutrition label to add it to our Indian database.
                </p>
              </div>
            </div>
            {visionStatus && (
              <div className="p-3 rounded-xl text-xs mb-3"
                style={{ background: 'rgba(5,150,105,0.08)', color: '#059669' }}>
                {visionStatus}
              </div>
            )}
            <VisionCapture onCapture={handleVisionCapture} />
          </div>
        )}

        {/* ── Product card ─────────────────────────────────────────────── */}
        {product && !loadingProduct && !loadingPhoto && (
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--card-border)] shadow-sm mb-4 overflow-hidden">

            {product.image_url && (
              <div className="relative w-full h-48 bg-gray-50 dark:bg-slate-800">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 520px) 100vw, 520px"
                />
              </div>
            )}

            <div className="p-5">

              {/* Source badge */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {product.source === 'gemini_vision' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-amber-700 dark:text-amber-400"
                    style={{ background: 'rgba(245,158,11,0.1)' }}>
                    🇮🇳 Added to Indian DB
                  </span>
                )}
                {product.source === 'gemini_photo' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-sky-700 dark:text-sky-400"
                    style={{ background: 'rgba(14,165,233,0.1)' }}>
                    📸 Read from photo
                  </span>
                )}
                {product.source === 'cache' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-400"
                    style={{ background: 'rgba(5,150,105,0.1)' }}>
                    ✅ In our database
                  </span>
                )}
                {product.source === 'open_food_facts' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-purple-700 dark:text-purple-400"
                    style={{ background: 'rgba(139,92,246,0.1)' }}>
                    🌐 Open Food Facts
                  </span>
                )}
                {product.source === 'upc_item_db' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-blue-700 dark:text-blue-400"
                    style={{ background: 'rgba(59,130,246,0.1)' }}>
                    🔍 UPC Database
                  </span>
                )}
              </div>

              <h2 className="text-xl font-black text-[var(--foreground)] mb-1">{product.name}</h2>
              {product.brand && (
                <p className="text-sm text-[var(--muted)] mb-4">{product.brand}</p>
              )}

              {/* Photo extras (MRP, FSSAI, etc.) */}
              {product._photo_extras && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {product._photo_extras.mrp && (
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <p className="text-xs text-[var(--muted)]">MRP</p>
                      <p className="text-sm font-bold text-[var(--foreground)]">₹{product._photo_extras.mrp}</p>
                    </div>
                  )}
                  {product._photo_extras.net_weight && (
                    <div className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <p className="text-xs text-[var(--muted)]">Net Weight</p>
                      <p className="text-sm font-bold text-[var(--foreground)]">{product._photo_extras.net_weight}g</p>
                    </div>
                  )}
                  {product._photo_extras.fssai && (
                    <div className="col-span-2 p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <p className="text-xs text-[var(--muted)]">FSSAI License</p>
                      <p className="text-xs font-mono text-[var(--foreground)]">{product._photo_extras.fssai}</p>
                    </div>
                  )}
                  {product._photo_extras.certifications && product._photo_extras.certifications.length > 0 && (
                    <div className="col-span-2 p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                      <p className="text-xs text-[var(--muted)] mb-1">Certifications</p>
                      <div className="flex gap-1 flex-wrap">
                        {product._photo_extras.certifications.map((c, i) => (
                          <span key={i}
                            className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Macros grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: 'Calories', value: Math.round(product.nutrition?.calories || 0), unit: 'kcal' },
                  { label: 'Protein',  value: product.nutrition?.protein ?? 0,              unit: 'g'    },
                  { label: 'Carbs',    value: product.nutrition?.carbs   ?? 0,              unit: 'g'    },
                  { label: 'Fat',      value: product.nutrition?.fat     ?? 0,              unit: 'g'    },
                ].map(item => (
                  <div key={item.label} className="rounded-xl p-2 text-center"
                    style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.1)' }}>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{item.value}</p>
                    <p className="text-xs text-[var(--muted)]">{item.unit}</p>
                    <p className="text-xs text-[var(--muted)]">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Sugar / sodium / fiber row */}
              {(product.nutrition?.sugar != null || product.nutrition?.sodium != null || product.nutrition?.fiber != null) && (
                <div className="flex gap-3 mb-4 flex-wrap">
                  {product.nutrition?.sugar  != null && (
                    <div className="text-xs text-[var(--muted)]">
                      Sugar: <span className="font-bold text-[var(--foreground)]">{product.nutrition.sugar}g</span>
                    </div>
                  )}
                  {product.nutrition?.sodium != null && (
                    <div className="text-xs text-[var(--muted)]">
                      Sodium: <span className="font-bold text-[var(--foreground)]">{product.nutrition.sodium}mg</span>
                    </div>
                  )}
                  {product.nutrition?.fiber  != null && (
                    <div className="text-xs text-[var(--muted)]">
                      Fiber: <span className="font-bold text-[var(--foreground)]">{product.nutrition.fiber}g</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-[var(--muted)] mb-4">Per 100g · Source: {product.source}</p>

              {/* Quantity selector */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[var(--foreground)] mb-2">
                  How much did you eat?
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(10, q - 10))}
                    className="w-10 h-10 rounded-xl border-2 border-[var(--card-border)] flex items-center justify-center
                      text-lg font-bold text-[var(--foreground)] hover:border-emerald-400 transition-colors"
                  >−</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center py-2.5 rounded-xl border-2 border-[var(--card-border)]
                      focus:border-emerald-500 bg-[var(--card)] text-[var(--foreground)] text-sm font-bold outline-none"
                  />
                  <button
                    onClick={() => setQuantity(q => Math.min(2000, q + 10))}
                    className="w-10 h-10 rounded-xl border-2 border-[var(--card-border)] flex items-center justify-center
                      text-lg font-bold text-[var(--foreground)] hover:border-emerald-400 transition-colors"
                  >+</button>
                  <span className="text-sm font-bold text-[var(--muted)]">g</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1.5 text-center">
                  = {Math.round((product.nutrition?.calories || 0) * quantity / 100)} kcal total
                </p>
              </div>

              {/* Meal log buttons */}
              {loggedMeal ? (
                <div className="p-3 rounded-xl text-center text-sm font-bold text-emerald-700 dark:text-emerald-400"
                  style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)' }}>
                  ✅ Logged {quantity}g as {loggedMeal}!
                  <button
                    onClick={() => setLoggedMeal(null)}
                    className="block mx-auto mt-1 text-xs font-normal text-[var(--muted)] underline"
                  >
                    Log again with different meal type
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-[var(--foreground)] mb-2">Log as:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'breakfast', icon: '🌅' },
                      { type: 'lunch',     icon: '☀️' },
                      { type: 'dinner',    icon: '🌙' },
                      { type: 'snack',     icon: '🍎' },
                    ].map(m => (
                      <button
                        key={m.type}
                        onClick={() => handleLogMeal(m.type)}
                        className="py-2.5 rounded-xl text-xs font-bold capitalize transition-all active:scale-95 border-2"
                        style={{
                          borderColor: 'rgba(5,150,105,0.3)',
                          background:  'rgba(5,150,105,0.06)',
                          color:       '#059669',
                        }}
                      >
                        {m.icon} {m.type}
                      </button>
                    ))}
                  </div>
                  {isGuest && (
                    <p className="text-xs text-center text-[var(--muted)] mt-2">
                      <a href="/auth/signin" className="text-emerald-600 underline font-bold">Sign in</a> to save meal logs
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            AI ANALYSIS CARD
            ═══════════════════════════════════════════════ */}
        {analysis && (
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--card-border)] shadow-sm mb-4 overflow-hidden">

            {/* Header with score ring */}
            <div className="p-5 border-b border-[var(--card-border)]"
              style={{ background: ratingBg[analysis.health_rating] || 'rgba(107,114,128,0.04)' }}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-[var(--muted)] mb-1">🤖 AI Health Analysis</p>
                  <p className="text-sm text-[var(--foreground)] leading-relaxed">{analysis.summary}</p>
                  {analysis.personalized && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>
                      ✨ Personalised for your profile
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <HealthScoreRing score={Number(analysis.health_score) || 0} rating={analysis.health_rating} />
                </div>
              </div>
            </div>

            {/* Score breakdown bars */}
            {analysis.health_score_breakdown && (
              <div className="px-5 py-4 border-b border-[var(--card-border)]">
                <p className="text-xs font-bold text-[var(--foreground)] mb-3">📊 Score Breakdown</p>
                <div className="space-y-2">
                  <ScoreBar label="Nutrition Quality"  score={analysis.health_score_breakdown.nutrition_score}         color="#059669" />
                  <ScoreBar label="Ingredient Safety"  score={analysis.health_score_breakdown.ingredient_safety_score}
                    color={scoreColor(analysis.health_score_breakdown.ingredient_safety_score)} />
                  <ScoreBar label="Processing Level"   score={analysis.health_score_breakdown.processing_score}        color="#0ea5e9" />
                </div>
              </div>
            )}

            {/* Harmful count banner */}
            {harmfulCount > 0 && (
              <div className="px-5 py-3 border-b border-[var(--card-border)]"
                style={{ background: highSevCount > 0 ? 'rgba(220,38,38,0.06)' : 'rgba(217,119,6,0.06)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{highSevCount > 0 ? '🚨' : '⚠️'}</span>
                  <div>
                    <p className="text-xs font-bold"
                      style={{ color: highSevCount > 0 ? '#dc2626' : '#d97706' }}>
                      {harmfulCount} harmful ingredient{harmfulCount > 1 ? 's' : ''} detected
                      {highSevCount > 0 ? ` · ${highSevCount} high severity` : ''}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      Tap &quot;Ingredients&quot; tab below for detailed scientific analysis
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-[var(--card-border)]">
              {[
                { key: 'overview',      label: '📋 Overview' },
                { key: 'ingredients',   label: `🧪 Ingredients${harmfulCount > 0 ? ` (${harmfulCount})` : ''}` },
                { key: 'alternatives',  label: '🥗 Alternatives' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className="flex-1 py-2.5 text-xs font-bold transition-all"
                  style={{
                    color:        activeTab === tab.key ? '#059669' : 'var(--muted)',
                    borderBottom: activeTab === tab.key ? '2px solid #059669' : '2px solid transparent',
                    background:   activeTab === tab.key ? 'rgba(5,150,105,0.04)' : 'transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ───────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="p-5 space-y-4">

                {/* Suitability badges */}
                {[analysis.diabetic_suitability, analysis.bp_suitability, analysis.child_suitability, analysis.pregnancy_suitability].some(Boolean) && (
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-2">👤 Suitability</p>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { key: 'diabetic_suitability', label: '🩸 Diabetic'  },
                        { key: 'bp_suitability',       label: '💊 BP'        },
                        { key: 'child_suitability',    label: '👶 Children'  },
                        { key: 'pregnancy_suitability',label: '🤰 Pregnancy' },
                      ].map(item => {
                        const val = analysis[item.key as keyof Analysis] as string | undefined
                        if (!val) return null
                        return (
                          <span key={item.key} className="px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: suitabilityBg(val), color: suitabilityColor(val) }}>
                            {item.label} {suitabilityIcon(val)}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Safe consumption */}
                {analysis.safe_consumption && (
                  <div className="p-4 rounded-xl"
                    style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)' }}>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-3">✅ Safe Consumption</p>
                    <div className="space-y-1.5">
                      {analysis.safe_consumption.amount && (
                        <p className="text-xs text-[var(--foreground)]">
                          <strong>Amount:</strong> {analysis.safe_consumption.amount}
                        </p>
                      )}
                      {analysis.safe_consumption.frequency && (
                        <p className="text-xs text-[var(--foreground)]">
                          <strong>Frequency:</strong> {analysis.safe_consumption.frequency}
                        </p>
                      )}
                      {analysis.safe_consumption.notes && (
                        <p className="text-xs text-[var(--muted)] pt-1 border-t border-[var(--card-border)]">
                          💡 {analysis.safe_consumption.notes}
                        </p>
                      )}
                      {analysis.safe_consumption.personalized_for_user && (
                        <div className="pt-2 border-t border-[var(--card-border)]">
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1"
                            style={{ background: 'rgba(5,150,105,0.15)', color: '#059669' }}>
                            ✨ Your personalised limit
                          </span>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                            {analysis.safe_consumption.personalized_for_user}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Positives */}
                {analysis.positives && analysis.positives.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-2">👍 What is good</p>
                    <div className="space-y-1">
                      {analysis.positives.map((p, i) => (
                        <div key={i} className="text-xs text-[var(--foreground)] px-3 py-2 rounded-lg flex items-start gap-2"
                          style={{ background: 'rgba(5,150,105,0.06)' }}>
                          <span className="text-emerald-500 flex-shrink-0">•</span> {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Long-term risks */}
                {analysis.long_term_risks && analysis.long_term_risks.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-2">⏳ Long-Term Risks</p>
                    <div className="space-y-1">
                      {analysis.long_term_risks.map((risk, i) => (
                        <div key={i} className="text-xs text-[var(--foreground)] px-3 py-2 rounded-lg flex items-start gap-2"
                          style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.1)' }}>
                          <span className="text-red-400 flex-shrink-0 mt-0.5">⚠</span> {risk}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed breakdown */}
                {analysis.detailed_breakdown && (
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-2">📊 Detailed Breakdown</p>
                    <div className="space-y-2">
                      {(['calories', 'protein', 'sugar', 'sodium', 'fat', 'fiber'] as const).map(key => {
                        const val = analysis.detailed_breakdown![key]
                        if (!val) return null
                        const lower  = val.toLowerCase()
                        const isGood = lower.startsWith('good') || lower.startsWith('low')
                        const isBad  = lower.startsWith('high') || lower.startsWith('very high')
                        return (
                          <div key={key} className="flex items-start gap-2 py-1.5 border-b border-[var(--card-border)] last:border-0">
                            <span className="text-xs flex-shrink-0 w-14 font-bold text-[var(--muted)] capitalize">{key}</span>
                            <span className="text-xs"
                              style={{ color: isGood ? '#059669' : isBad ? '#dc2626' : 'var(--foreground)' }}>
                              {val}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* FSSAI compliance */}
                {analysis.fssai_compliance && analysis.fssai_compliance !== 'unknown' && (
                  <div className={`rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-medium ${
                    analysis.fssai_compliance === 'compliant'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                    style={{
                      background: analysis.fssai_compliance === 'compliant' ? 'rgba(5,150,105,0.06)' : 'rgba(217,119,6,0.06)',
                      border:     analysis.fssai_compliance === 'compliant' ? '1px solid rgba(5,150,105,0.15)' : '1px solid rgba(217,119,6,0.15)',
                    }}>
                    🛡️ FSSAI:{' '}
                    {analysis.fssai_compliance === 'compliant'
                      ? 'No compliance concerns detected'
                      : 'Possible FSSAI compliance concern'}
                  </div>
                )}

                <p className="text-xs text-[var(--muted)]">
                  Analysed by Gemini AI · {new Date(analysis.analyzed_at).toLocaleDateString()}
                  {analysis.personalized && ' · Personalised analysis'}
                </p>
              </div>
            )}

            {/* ── INGREDIENTS TAB ────────────────────────────────────────── */}
            {activeTab === 'ingredients' && (
              <div className="p-5 space-y-4">

                {harmfulCount > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs font-bold text-[var(--foreground)]">🚨 Harmful Ingredients Found</p>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ background: '#dc2626' }}>
                        {harmfulCount}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(analysis.harmful_ingredients || [])
                        .filter(h => h.found_in_product !== false)
                        .sort((a, b) => {
                          const order = { high: 0, medium: 1, low: 2 }
                          return order[a.severity] - order[b.severity]
                        })
                        .map((h, i) => (
                          <div key={i} className="rounded-2xl overflow-hidden border"
                            style={{ borderColor: severityBorderColor[h.severity] }}>

                            <div className="px-4 py-3 flex items-center justify-between"
                              style={{ background: severityBg[h.severity] }}>
                              <div className="flex items-center gap-2">
                                <span className="text-base">{severityDotEmoji[h.severity]}</span>
                                <div>
                                  <p className="text-sm font-black text-[var(--foreground)]">{h.name}</p>
                                  {h.also_known_as && h.also_known_as.length > 0 && (
                                    <p className="text-xs text-[var(--muted)]">
                                      Also: {h.also_known_as.slice(0, 2).join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize text-white"
                                style={{ background: severityDotColor[h.severity] }}>
                                {h.severity} risk
                              </span>
                            </div>

                            <div className="px-4 py-3 border-b border-[var(--card-border)]">
                              <p className="text-xs text-[var(--foreground)] leading-relaxed">{h.concern}</p>
                            </div>

                            {h.amount_in_this_product && (
                              <div className="px-4 py-2 border-b border-[var(--card-border)] bg-gray-50 dark:bg-slate-800/50">
                                <p className="text-xs text-[var(--muted)]">
                                  📊 <span className="font-bold text-[var(--foreground)]">{h.amount_in_this_product}</span>
                                  {h.percentage_of_daily_limit && ` · ${h.percentage_of_daily_limit}`}
                                </p>
                              </div>
                            )}

                            <div className="px-4 py-3 border-b border-[var(--card-border)]">
                              {h.global_safe_limit && (
                                <div className="mb-2">
                                  <p className="text-xs font-bold text-[var(--muted)] mb-0.5">🌍 Global Safe Limit</p>
                                  <p className="text-xs text-[var(--foreground)]">{h.global_safe_limit}</p>
                                </div>
                              )}
                              {h.personalized_safe_limit && (
                                <div className="pt-2 border-t border-[var(--card-border)]">
                                  <p className="text-xs font-bold mb-0.5" style={{ color: '#059669' }}>
                                    ✨ Your personalised limit
                                  </p>
                                  <p className="text-xs text-[var(--foreground)]">{h.personalized_safe_limit}</p>
                                </div>
                              )}
                            </div>

                            {h.scientific_source && (
                              <div className="px-4 py-2.5" style={{ background: 'rgba(14,165,233,0.04)' }}>
                                <p className="text-xs text-[var(--muted)] mb-1">📚 Scientific Source</p>
                                <p className="text-xs font-bold text-[var(--foreground)] mb-1">{h.scientific_source}</p>
                                {h.source_url && (
                                  <a href={h.source_url} target="_blank" rel="noopener noreferrer"
                                    className="text-xs underline break-all" style={{ color: '#0ea5e9' }}>
                                    {h.source_url}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      No harmful ingredients detected
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      This product does not contain any of the 20+ harmful substances we screen for
                    </p>
                  </div>
                )}

                {/* Ingredient warnings (minor) */}
                {analysis.ingredient_warnings && analysis.ingredient_warnings.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)] mb-2">⚠️ Other Ingredient Notes</p>
                    <div className="space-y-2">
                      {analysis.ingredient_warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl border-l-4"
                          style={{
                            background:   severityBg[w.severity],
                            borderColor:  severityDotColor[w.severity],
                          }}>
                          <span className="text-sm flex-shrink-0">{severityDotEmoji[w.severity]}</span>
                          <div>
                            <p className="text-xs font-bold text-[var(--foreground)]">{w.ingredient}</p>
                            <p className="text-xs text-[var(--muted)]">{w.concern}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl text-xs text-[var(--muted)] leading-relaxed"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--card-border)' }}>
                  ℹ️ Analysis based on WHO, FSSAI, ICMR and EFSA guidelines. Sources are provided for verification.
                  This is informational — consult a healthcare professional for medical advice.
                </div>
              </div>
            )}

            {/* ── ALTERNATIVES TAB ───────────────────────────────────────── */}
            {activeTab === 'alternatives' && (
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-bold text-[var(--foreground)] mb-1">🥗 Healthier Alternatives</p>
                  <p className="text-xs text-[var(--muted)] mb-3">
                    Specific Indian alternatives that are better for your health
                  </p>

                  {analysis.healthier_alternatives && analysis.healthier_alternatives.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.healthier_alternatives.map((alt, i) => {
                        const typeColors: Record<string, string> = {
                          branded:    'rgba(139,92,246,0.1)',
                          homemade:   'rgba(5,150,105,0.1)',
                          whole_food: 'rgba(14,165,233,0.1)',
                        }
                        const typeLabels: Record<string, string> = {
                          branded:    '🏷️ Brand',
                          homemade:   '🏠 Homemade',
                          whole_food: '🌾 Whole food',
                        }
                        return (
                          <div key={i} className="p-4 rounded-2xl border border-[var(--card-border)]"
                            style={{ background: 'rgba(5,150,105,0.03)' }}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                  style={{ background: 'rgba(5,150,105,0.1)' }}>
                                  {alt.type === 'homemade' ? '🏠' : alt.type === 'whole_food' ? '🌾' : '✅'}
                                </div>
                                <p className="text-sm font-bold text-[var(--foreground)]">{alt.name}</p>
                              </div>
                              {alt.type && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                                  style={{
                                    background: typeColors[alt.type] || 'rgba(0,0,0,0.06)',
                                    color: 'var(--foreground)',
                                  }}>
                                  {typeLabels[alt.type] || alt.type}
                                </span>
                              )}
                            </div>
                            {alt.reason && (
                              <p className="text-xs text-[var(--muted)] leading-relaxed ml-10">{alt.reason}</p>
                            )}
                            {alt.availability && (
                              <p className="text-xs ml-10 mt-1" style={{ color: '#059669' }}>
                                📍 {alt.availability.replace(/_/g, ' ')}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-[var(--muted)] text-sm">
                      No alternatives available for this product
                    </div>
                  )}
                </div>

                {analysis.health_rating !== 'healthy' && (
                  <div className="p-4 rounded-2xl"
                    style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)' }}>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">💚 Why switch?</p>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      Switching to healthier alternatives even 2–3 times a week can significantly reduce your
                      intake of harmful additives and improve your overall nutrition. Small changes add up.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* ── Debug log ─────────────────────────────────────────────────── */}
        {debugLog.length > 0 && (
          <details className="mt-2 mb-6 p-3 rounded-xl bg-gray-900 text-green-400 text-xs font-mono">
            <summary className="cursor-pointer font-bold text-green-300 mb-2 select-none">
              🔧 Debug Log ({debugLog.length} entries)
            </summary>
            <div className="space-y-0.5">
              {debugLog.map((line, i) => <div key={i} className="break-all">{line}</div>)}
            </div>
          </details>
        )}

      </div>{/* /max-w-lg */}

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      {showScanner && (
        <BarcodeScanner
          onDetected={handleBarcode}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showPhotoMode && (
        <ProductPhotoCapture
          onCapture={handleProductPhoto}
          onClose={() => setShowPhotoMode(false)}
        />
      )}

    </div>
  )
}

// ─── Vision Label Capture ─────────────────────────────────────────────────────
function VisionCapture({ onCapture }: { onCapture: (b64: string) => void }) {
  const [stream,   setStream]   = useState<MediaStream | null>(null)
  const [videoEl,  setVideoEl]  = useState<HTMLVideoElement | null>(null)
  const [active,   setActive]   = useState(false)

  async function start() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setStream(s)
      setActive(true)
    } catch {
      toast.error('Camera access denied')
    }
  }

  function stop() {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setActive(false)
  }

  function capture() {
    if (!videoEl) return
    const canvas = document.createElement('canvas')
    canvas.width  = videoEl.videoWidth
    canvas.height = videoEl.videoHeight
    canvas.getContext('2d')?.drawImage(videoEl, 0, 0)
    const b64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
    stop()
    onCapture(b64)
  }

  return (
    <div>
      {!active ? (
        <button onClick={start}
          className="w-full py-3 rounded-xl text-white text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
          📸 Open Camera — Read Nutrition Label
        </button>
      ) : (
        <div>
          <video
            ref={el => { if (el && stream) { el.srcObject = stream; el.play(); setVideoEl(el) } }}
            className="w-full rounded-xl mb-2 bg-black"
            muted playsInline
          />
          <div className="flex gap-2">
            <button onClick={capture}
              className="flex-1 py-3 rounded-xl text-white text-sm font-bold"
              style={{ background: '#16a34a' }}>
              📸 Capture
            </button>
            <button onClick={stop}
              className="px-4 py-3 rounded-xl text-sm bg-gray-100 dark:bg-slate-700 text-[var(--foreground)]">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Full Product Photo Capture Modal ────────────────────────────────────────
function ProductPhotoCapture({
  onCapture,
  onClose,
}: {
  onCapture: (b64: string) => void
  onClose: () => void
}) {
  const [stream,         setStream]         = useState<MediaStream | null>(null)
  const [videoEl,        setVideoEl]        = useState<HTMLVideoElement | null>(null)
  const [cameraStarted,  setCameraStarted]  = useState(false)
  const [capturing,      setCapturing]      = useState(false)

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      })
      setStream(s)
      setCameraStarted(true)
    } catch {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true })
        setStream(s)
        setCameraStarted(true)
      } catch {
        toast.error('Camera access denied. Please allow camera permission.')
      }
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setCameraStarted(false)
  }

  function handleCapture() {
    if (!videoEl) return
    setCapturing(true)
    const canvas = document.createElement('canvas')
    canvas.width  = videoEl.videoWidth
    canvas.height = videoEl.videoHeight
    canvas.getContext('2d')?.drawImage(videoEl, 0, 0)
    const b64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1]
    stopCamera()
    onCapture(b64)
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-2xl overflow-hidden w-full max-w-md">

        <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--card-border)]">
          <div>
            <h2 className="text-base font-bold text-[var(--foreground)]">🖼️ Product Photo Mode</h2>
            <p className="text-xs text-[var(--muted)]">Take a photo of the whole product</p>
          </div>
          <button onClick={() => { stopCamera(); onClose() }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700 text-[var(--muted)]">
            ✕
          </button>
        </div>

        {!cameraStarted ? (
          <div className="p-6">
            <p className="text-sm font-bold text-[var(--foreground)] mb-3">Gemini AI will read and extract:</p>
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
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#059669' }} />
                  <p className="text-xs text-[var(--muted)]">{item}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl mb-5 text-xs leading-relaxed"
              style={{ background: 'rgba(5,150,105,0.06)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)' }}>
              💡 <strong>Tip:</strong> Photograph the back or side where the nutrition table and ingredients are printed. Good lighting is important!
            </div>

            <button onClick={startCamera}
              className="w-full py-4 rounded-2xl text-white text-sm font-bold"
              style={{
                background:  'linear-gradient(135deg, #059669, #0ea5e9)',
                boxShadow:   '0 8px 24px rgba(5,150,105,0.3)',
              }}>
              📷 Open Camera
            </button>
          </div>
        ) : (
          <div>
            <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
              <video
                ref={el => {
                  if (el && stream) { el.srcObject = stream; el.play(); setVideoEl(el) }
                }}
                className="w-full h-full object-cover"
                muted playsInline
              />
              {/* Corner guides */}
              <div className="absolute inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
              </div>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-full">
                  Point at product label or nutrition table
                </span>
              </div>
            </div>

            <div className="p-4">
              <button
                onClick={handleCapture}
                disabled={capturing}
                className="w-full py-4 rounded-2xl text-white text-base font-bold transition-all"
                style={{
                  background: capturing ? '#9ca3af' : 'linear-gradient(135deg, #059669, #0ea5e9)',
                  boxShadow:  capturing ? 'none' : '0 0 0 4px rgba(5,150,105,0.2), 0 8px 24px rgba(5,150,105,0.4)',
                  cursor:     capturing ? 'not-allowed' : 'pointer',
                }}
              >
                {capturing ? '⏳ Processing...' : '📸 Capture Product'}
              </button>
              <p className="text-xs text-center text-[var(--muted)] mt-2">
                Gemini AI will read everything visible on the product
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}