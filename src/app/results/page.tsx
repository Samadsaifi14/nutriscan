// src/app/results/page.tsx
"use client"
import { useEffect, useState }  from 'react'
import { useRouter, useSearchParams }             from 'next/navigation'
import { useSession }            from 'next-auth/react'
import toast                     from 'react-hot-toast'
import { readScanResult, ScanResultPayload } from '@/types/scanResult'
import { IngredientChip } from '@/components/IngredientChip'
import { ShareButton } from '@/components/ShareButton'
import { ShoppingLinks } from '@/components/ShoppingLinks'
import { UNIVERSAL_FALLBACK } from '@/lib/curated-alternatives'
import { event, AnalyticsEvents } from '@/lib/analytics'
import { useOffline } from '@/hooks/useOffline'
import { supabase } from '@/lib/supabase'

// ── Score helpers ─────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 7.5) return '#22c55e'
  if (s >= 5.5) return '#f59e0b'
  if (s >= 3.5) return '#fb923c'
  return '#ef4444'
}
function scoreLabel(s: number) {
  if (s >= 7.5) return 'Healthy'
  if (s >= 5.5) return 'Moderate'
  if (s >= 3.5) return 'Caution'
  return 'Unhealthy'
}
function scoreBg(rating: string) {
  if (rating === 'healthy')   return 'from-emerald-500/20 to-emerald-500/5'
  if (rating === 'moderate')  return 'from-amber-500/20 to-amber-500/5'
  return 'from-red-500/20 to-red-500/5'
}
function suitabilityColor(v: string) {
  if (v === 'suitable')             return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: '✓' }
  if (v === 'consume_with_caution') return { bg: 'bg-amber-500/10',   text: 'text-amber-400',   icon: '⚠' }
  return                                   { bg: 'bg-red-500/10',     text: 'text-red-400',     icon: '✗' }
}
function severityStyle(s: string) {
  if (s === 'high')   return { dot: 'bg-red-500',    text: 'text-red-400',    badge: 'bg-red-500/10 text-red-400' }
  if (s === 'medium') return { dot: 'bg-amber-500',  text: 'text-amber-400',  badge: 'bg-amber-500/10 text-amber-400' }
  return                     { dot: 'bg-slate-500',  text: 'text-slate-400',  badge: 'bg-slate-500/10 text-slate-400' }
}

// ── Score Ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score, rating }: { score: number; rating: string }) {
  const r   = 54
  const circ = 2 * Math.PI * r
  const pct  = (Math.min(Math.max(score, 0), 10) / 10) * circ
  const hex  = scoreColor(score)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
          <circle cx="72" cy="72" r={r} fill="none" stroke="#1e2a35" strokeWidth="10" />
          <circle cx="72" cy="72" r={r} fill="none" stroke={hex} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${pct} ${circ - pct}`}
            style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black tabular-nums" style={{ color: hex }}>{score}</span>
          <span className="text-xs text-[#7a8fa6] font-medium">/10</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-bold tracking-wide" style={{ color: hex }}>
        {scoreLabel(score)}
      </span>
    </div>
  )
}

// ── Mini score bar ────────────────────────────────────────────────────────────

function MiniBar({ label, score }: { label: string; score: number }) {
  const hex = scoreColor(score)
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11px] text-[#7a8fa6]">{label}</span>
        <span className="text-[11px] font-bold" style={{ color: hex }}>{score}/10</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#1e2a35] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score * 10}%`, backgroundColor: hex }} />
      </div>
    </div>
  )
}

// ── Skeleton components ───────────────────────────────────────────────────────

function SkeletonBar({ className }: { className?: string }) {
  return <div className={`h-4 rounded-full bg-[#1e2a35] animate-pulse ${className || ''}`} />
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`bg-[#161a20] border border-[#2a3545] rounded-2xl p-4 ${className || ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#1e2a35] animate-pulse" />
        <div className="flex-1 space-y-2">
          <SkeletonBar className="w-3/4" />
          <SkeletonBar className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2 ml-12">
        <SkeletonBar className="w-full" />
        <SkeletonBar className="w-5/6" />
      </div>
    </div>
  )
}

function MacroGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-[#1e242d] rounded-xl p-3 space-y-2">
          <SkeletonBar className="w-12 h-6" />
          <SkeletonBar className="w-16" />
        </div>
      ))}
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2a3545] bg-[#1a1f28]">
        <span className="text-base">{icon}</span>
        <h2 className="text-sm font-bold text-[#f0f4f8]">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Ingredients', 'Nutrition', 'Alternatives'] as const
type Tab = typeof TABS[number]

interface TabMeta {
  key: Tab
  locked: boolean
  reason: string
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const { status }    = useSession()
  const isGuest       = status === 'unauthenticated'

const [payload,    setPayload]    = useState<ScanResultPayload | null>(null)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [scanFailed, setScanFailed] = useState(false)
  const [scanLoading, setScanLoading] = useState(false)
  const [scanConfidence, setScanConfidence] = useState<string>('none')
  const [ingredientList, setIngredientList] = useState<Array<{ name: string; status: 'harmful'|'safe'|'unknown' }>>([])
  const [aiInsights, setAiInsights] = useState<Array<any>>([])
  const [hydrated,   setHydrated]   = useState(false)
  const [apiAlternatives, setApiAlternatives] = useState<any>(null)
  const [altLoading, setAltLoading] = useState(false)
  const [altError, setAltError] = useState(false)

  // Offline support
  const { online, cacheProduct } = useOffline()
  const [activeTab,  setActiveTab]  = useState<Tab>('Overview')
  const [quantity,   setQuantity]   = useState(100)
  const [loggedMeal, setLoggedMeal] = useState<string | null>(null)
  const [logging,    setLogging]    = useState(false)

useEffect(() => {
    const barcode = searchParams?.get('barcode')
    const mode = searchParams?.get('mode')
    
    // If there's a barcode in URL, fetch and save the product
    if (barcode) {
      setScannedBarcode(barcode)
      setScanLoading(true)
      fetch(`/api/scan?barcode=${encodeURIComponent(barcode)}`)
        .then(r => r.json())
        .then(async (res) => {
          if (res.success && res.data) {
            setScanFailed(false)
            setScanConfidence(res.confidence || 'high')
            const product = res.data.product || res.data
            
            // Build product data (API nests nutrition under product.nutrition)
            const productData = {
              name: product.name || 'Unknown',
              brand: product.brand || null,
              category: product.category || null,
              barcode: product.barcode || barcode,
              source: product.source || 'api',
              nutrition: {
                calories: product.nutrition?.calories ?? product.calories_per_100g ?? 0,
                protein: product.nutrition?.protein ?? product.protein_per_100g ?? 0,
                carbs: product.nutrition?.carbs ?? product.carbs_per_100g ?? 0,
                fat: product.nutrition?.fat ?? product.fat_per_100g ?? 0,
                sugar: product.nutrition?.sugar ?? product.sugar_per_100g ?? null,
                sodium: product.nutrition?.sodium ?? product.sodium_per_100g ?? null,
                fiber: product.nutrition?.fiber ?? product.fiber_per_100g ?? null,
              },
              serving_size_g: product.serving_size_g || null,
              ingredients_text: product.ingredients_text || null,
              allergens: product.allergens || [],
              additives: product.additives || [],
              image_url: product.image_url || null,
            }
            
            // Fetch full analysis from /api/analyze to get harmful_ingredients
            let analysis: any = { health_score: 5, health_rating: 'moderate', summary: 'Analyzed by HealthOX', analyzed_at: new Date().toISOString(), harmful_ingredients: [] }
            try {
              const analyzeRes = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
              })
              const analyzeJson = await analyzeRes.json()
              if (analyzeJson.success && analyzeJson.data) {
                const a = analyzeJson.data
                analysis = {
                  health_score: a.health_score ?? a.score ?? 5,
                  health_rating: a.health_rating ?? a.rating ?? 'moderate',
                  summary: a.summary || 'Analyzed by HealthOX',
                  analyzed_at: new Date().toISOString(),
                  harmful_ingredients: a.harmful_ingredients || [],
                  positives: a.positives || [],
                  long_term_risks: a.long_term_risks || [],
                }
              }
            } catch {}
            
            // Format for scan result payload
            const payload: ScanResultPayload = {
              version: 1,
              timestamp: new Date().toISOString(),
              product: productData,
              analysis: analysis,
              quantity: 100,
            }
            
              // Save to localStorage
            localStorage.setItem('hox_scan_result_v1', JSON.stringify(payload))
            setPayload(payload)
            setQuantity(100)
          } else {
            // API returned no data — product not found
            setScanFailed(true)
            const data = readScanResult()
            setPayload(data)
            if (data) setQuantity(data.quantity || 100)
          }
          setScanLoading(false)
          setHydrated(true)
        })
        .catch(() => {
          setScanFailed(true)
          setScanLoading(false)
          setHydrated(true)
          const data = readScanResult()
          setPayload(data)
          if (data) setQuantity(data.quantity || 100)
        })
      return
    }
    
    // Default: read from localStorage
    const data = readScanResult()
    setPayload(data)
    if (data) setQuantity(data.quantity || 100)
    setHydrated(true)
  }, [searchParams])

  // Build all-ingredients labelling from payload when available
  useEffect(() => {
    if (!payload) return
    const ingText = payload.product?.ingredients_text || ''
    const ings = ingText.split(',').map(s => s.trim()).filter(Boolean)
    const harmfulSet = new Set<string>((payload.analysis.harmful_ingredients || []).filter(h => h.found_in_product !== false).map(h => (h.name || '').toLowerCase()))
    const list = ings.map(name => {
      const lower = name.toLowerCase()
      const status: 'harmful'|'safe'|'unknown' = harmfulSet.has(lower) || Array.from(harmfulSet).some(h => lower.includes(h)) ? 'harmful' : 'safe'
      return { name, status }
    })
    setIngredientList(list)
  }, [payload])

// Lightweight AI-health insights for the ingredients via API
  useEffect(() => {
    if (!payload) return
    const text = payload.product?.ingredients_text || ''
    const ings = text.split(',').map(s => s.trim()).filter(Boolean)
    if (ings.length === 0) return
    const query = encodeURIComponent(ings.join(','))
    fetch(`/api/ingredients-health?ingredients=${query}`)
      .then(r => r.json())
      .then((d) => {
        if (d?.success) setAiInsights(d.data || [])
      })
      .catch(() => {})
  }, [payload])

  // Realtime subscription for enrich completion
  useEffect(() => {
    if (!scannedBarcode) return

    const channel = supabase
      .channel(`product-updates-${scannedBarcode}`)
      .on('postgres_changes' as any, {
        event: 'UPDATE',
        schema: 'public',
        table: 'products',
        filter: `barcode=eq.${scannedBarcode}`,
      }, (payload: any) => {
        const newData = payload.new as any
        if (newData?.health_score != null && newData?.source !== 'ai_estimated') {
          toast.success('✨ Product info updated! New nutrition data available.')
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [scannedBarcode])

  // Fetch alternatives from API when Alternatives tab is active
  useEffect(() => {
    if (activeTab !== 'Alternatives' || !payload || apiAlternatives) return
    setAltLoading(true)
    setAltError(false)
    fetch('/api/alternatives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.product.name,
        brand: payload.product.brand,
        category: payload.product.category,
        barcode: payload.product.barcode,
        nutrition_per_100g: payload.product.nutrition,
        ingredients_text: payload.product.ingredients_text,
        current_score: payload.analysis?.health_score,
      }),
    })
    .then(r => r.json())
    .then(d => {
      if (d?.success && d?.data) {
        setApiAlternatives(d.data)
      } else {
        setAltError(true)
      }
    })
    .catch(() => setAltError(true))
    .finally(() => setAltLoading(false))
  }, [activeTab, payload, apiAlternatives])

async function handleLogMeal(mealType: string) {
    if (!payload || isGuest || logging) return
    setLogging(true)
    const { product, analysis } = payload
    const timestamp = new Date().toISOString()
    try {
      const res  = await fetch('/api/log', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name:      product.name,
          barcode:           product.barcode  || null,
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
        event(AnalyticsEvents.LOG_MEAL, { product_name: product.name, meal_type: mealType, quantity_g: quantity })
        
        // Save payload for history click viewing
        const logId = json.data?.id || `meal_${timestamp}`
        try {
          localStorage.setItem(`meal_${logId}`, JSON.stringify(payload))
        } catch {}
      } else {
        toast.error(json.error || 'Failed to log meal.')
      }
    } catch { toast.error('Network error.') }
    finally { setLogging(false) }
  }

  if (!hydrated && !scanLoading) return null

  // ── Loading state ─────────────────────────────────────────────────────────

  if (scanLoading) {
    return (
      <div className="min-h-screen bg-[#0d0f12] flex flex-col items-center justify-center px-6 text-center pb-24">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-lg font-bold text-[#f0f4f8] mb-2">Analyzing Product...</h2>
        <p className="text-sm text-[#7a8fa6] mb-8 leading-relaxed max-w-xs">
          Scanning databases and running health analysis
        </p>
      </div>
    )
  }

  // ── Empty state ───────────────────────────────────────────────────────────

  if (!payload) {
    if (scanFailed && scannedBarcode) {
      return (
        <div className="min-h-screen bg-[#0d0f12] flex flex-col items-center justify-center px-6 text-center pb-24">
          <div className="w-20 h-20 rounded-full bg-[#161a20] border border-[#2a3545] flex items-center justify-center mb-5 text-3xl">
            📦
          </div>
          <h2 className="text-lg font-bold text-[#f0f4f8] mb-2">Product Not Found</h2>
          <p className="text-sm text-[#7a8fa6] mb-2 leading-relaxed max-w-sm">
            This product (barcode: {scannedBarcode}) isn't in our database yet.
          </p>
          <p className="text-xs text-[#4a5a6a] mb-6 leading-relaxed max-w-xs">
            Help the community! Contribute this product's details so others can check its health score.
          </p>
          <div className="flex gap-3">
            <button onClick={() => router.push(`/contribute?barcode=${scannedBarcode}`)}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-sm transition-colors">
              📸 Add This Product
            </button>
            <button onClick={() => router.push('/scan')}
              className="px-6 py-3.5 bg-[#252c38] hover:bg-[#2a3545] text-[#c8d6e0] font-bold rounded-2xl text-sm transition-colors">
              Scan Another
            </button>
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-screen bg-[#0d0f12] flex flex-col items-center justify-center px-6 text-center pb-24">
        <div className="w-20 h-20 rounded-full bg-[#161a20] border border-[#2a3545] flex items-center justify-center mb-5 text-3xl">
          🔍
        </div>
        <h2 className="text-lg font-bold text-[#f0f4f8] mb-2">No scan result yet</h2>
        <p className="text-sm text-[#7a8fa6] mb-8 leading-relaxed max-w-xs">
          Scan a product to see its full health analysis, ingredient breakdown, and personalised advice here.
        </p>
        <button onClick={() => router.push('/scan')}
          className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl text-sm transition-colors">
          📷 Scan a Product
        </button>
      </div>
    )
  }

  const { product, analysis, timestamp } = payload
  const harmfulCount = analysis.harmful_ingredients?.filter(h => h.found_in_product !== false).length || 0
  const highSevCount = analysis.harmful_ingredients?.filter(h => h.severity === 'high' && h.found_in_product !== false).length || 0

  const totalCals    = Math.round((product.nutrition?.calories || 0) * quantity / 100)

  // Tab metadata for graceful degradation
  const tabsMeta: TabMeta[] = TABS.map(tab => {
    if (tab === 'Ingredients') {
      const locked = !product.ingredients_text && (!analysis.harmful_ingredients || analysis.harmful_ingredients.length === 0)
      return { key: tab, locked, reason: 'No ingredient data — contribute to unlock' }
    }
    if (tab === 'Nutrition') {
      const locked = !product.nutrition?.calories && !product.nutrition?.protein && !product.nutrition?.carbs
      return { key: tab, locked, reason: 'No nutrition data — contribute to unlock' }
    }
    return { key: tab, locked: false, reason: '' }
  })

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] font-sans pb-28">

      {/* ── Hero header ───────────────────────────────────────────────────── */}
      <div className={`bg-gradient-to-b ${scoreBg(analysis.health_rating)} px-5 pt-14 pb-6`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.push('/scan')}
            className="text-[#7a8fa6] hover:text-[#f0f4f8] text-sm transition-colors flex items-center gap-1">
            ← Scan again
          </button>
          <div className="flex items-center gap-3">
            <ShareButton 
              productName={product.name} 
              healthScore={Number(analysis.health_score)} 
              healthRating={analysis.health_rating} 
            />
            <span className="text-[11px] text-[#7a8fa6]">
              {new Date(timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
        </div>

        {/* Product name + score ring */}
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#7a8fa6] font-medium uppercase tracking-widest mb-1">
              {product.source === 'ai_estimated' ? '🤖 AI Estimated' :
               product.source === 'gemini_photo' ? '📸 Photo scan' :
               product.source === 'gemini_vision' ? '👁 Label scan' :
               product.source === 'open_food_facts' ? '🌐 Open Food Facts' : '✅ Database'}
            </p>
            <h1 className="text-xl font-black text-[#f0f4f8] leading-tight">{product.name}</h1>
            {product.brand && <p className="text-sm text-[#7a8fa6] mt-0.5">{product.brand}</p>}

            {scanConfidence === 'low' && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs font-bold text-amber-400 mb-1">🤖 AI-Estimated Data</p>
                <p className="text-[11px] text-[#7a8fa6] leading-relaxed">
                  This product wasn't found in any database. The name and nutrition shown were estimated by AI based on the barcode prefix.
                  <button onClick={() => router.push(`/contribute?barcode=${product.barcode || scannedBarcode}`)}
                    className="ml-1 text-amber-400 underline font-medium">Help improve it →</button>
                </p>
              </div>
            )}

            {/* Alert badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {highSevCount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/20">
                  🚨 {highSevCount} High Risk
                </span>
              )}
              {harmfulCount > 0 && harmfulCount > highSevCount && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  ⚠ {harmfulCount} Concerns
                </span>
              )}
              {analysis.personalized && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  ✨ Personalised
                </span>
              )}
              {harmfulCount === 0 && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  ✅ Clean ingredients
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <ScoreRing score={Number(analysis.health_score)} rating={analysis.health_rating} />
            <p className="text-[10px] text-[#4a5a6a] text-center mt-2">* Score is algorithm-generated for informational purposes only.</p>
          </div>
        </div>
      </div>

      {/* ── Score breakdown strip ─────────────────────────────────────────── */}
      {analysis.health_score_breakdown && (
        <div className="mx-4 -mt-2 mb-4 bg-[#161a20] border border-[#2a3545] rounded-2xl p-4 space-y-2.5">
          <MiniBar label="Nutrition Quality"  score={analysis.health_score_breakdown.nutrition_score} />
          <MiniBar label="Ingredient Safety"  score={analysis.health_score_breakdown.ingredient_safety_score} />
          <MiniBar label="Processing Level"   score={analysis.health_score_breakdown.processing_score} />
        </div>
      )}

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#0d0f12] border-b border-[#2a3545] px-4">
        <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
          {tabsMeta.map(({ key, locked, reason }) => (
            <button key={key} onClick={() => { if (!locked) setActiveTab(key) }}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === key
                  ? 'bg-emerald-500 text-white'
                  : locked
                    ? 'text-[#4a5a6a] bg-[#161a20] cursor-not-allowed opacity-50'
                    : 'text-[#7a8fa6] hover:text-[#f0f4f8] bg-[#161a20]'
              }`}
              title={locked ? reason : ''}>
              {key === 'Ingredients' && harmfulCount > 0 ? `Ingredients (${harmfulCount})` : key}
              {locked && <span className="ml-1 text-[10px]">🔒</span>}
            </button>
          ))}
        </div>
        {/* Show lock reason bar when active tab is locked */}
        {tabsMeta.find(t => t.key === activeTab)?.locked && (
          <div className="bg-amber-500/10 border-t border-amber-500/20 px-4 py-2 text-center">
            <p className="text-xs text-amber-400">
              🔒 {tabsMeta.find(t => t.key === activeTab)?.reason}
              <button onClick={() => router.push(`/contribute?barcode=${product.barcode || scannedBarcode || ''}`)}
                className="ml-2 underline font-bold">Contribute now</button>
            </p>
          </div>
        )}
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ════════════════════════════════════════════════════════════════
            OVERVIEW TAB
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Overview' && (
          <>
            {/* Summary */}
            <Section title="AI Summary" icon="🤖">
              <p className="text-sm text-[#f0f4f8] leading-relaxed">{analysis.summary}</p>
              {analysis.confidence && analysis.confidence !== 'high' && (
                <div className="mt-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-[11px] text-amber-400">⚠ {analysis.confidence === 'medium' ? 'Some fields were unreadable — verify manually' : 'Low confidence result'}</p>
                </div>
              )}
            </Section>

{/* AI Deep Analysis (from unified Groq call) */}
            {((analysis.personalizedWarnings?.length ?? 0) > 0 || (analysis.ai_ingredients?.length ?? 0) > 0 || (analysis.recommendations?.length ?? 0) > 0) && (
              <Section title="AI Deep Analysis" icon="🧠">
                <div className="space-y-4">
                  {/* Personalized Warnings */}
                  {(analysis.personalizedWarnings?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-xs font-bold text-amber-400 mb-2">⚠️ Personalized For You</p>
                      <div className="space-y-2">
                        {analysis.personalizedWarnings!.map((warn: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 p-2 bg-amber-500/10 rounded-lg">
                            <span className="text-amber-400">→</span>
                            <span className="text-xs text-[#f0f4f8]">{warn}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Positives */}
                  {(analysis.positives?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-xs font-bold text-emerald-400 mb-2">✅ Positives</p>
                      <div className="space-y-1">
                        {analysis.positives!.slice(0, 3).map((pos: string, i: number) => (
                          <p key={i} className="text-xs text-emerald-300">• {pos}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Ingredient Analysis */}
                  {(analysis.ai_ingredients?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-xs font-bold text-[#7a8fa6] mb-2">🔬 Ingredient Breakdown</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.ai_ingredients!.slice(0, 8).map((ing: any, i: number) => (
                          <span key={i} className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            ing.status === 'harmful' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            ing.status === 'concern' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {ing.ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {(analysis.recommendations?.length ?? 0) > 0 && (
                    <div className="pt-2 border-t border-[#2a3545]">
                      <p className="text-xs font-bold text-sky-400 mb-2">💡 Recommendations</p>
                      <div className="space-y-1">
                        {analysis.recommendations!.slice(0, 2).map((rec: string, i: number) => (
                          <p key={i} className="text-xs text-[#7a8fa6]">• {rec}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Negatives Section in Overview */}
            {analysis.long_term_risks && analysis.long_term_risks.length > 0 && (
              <Section title="Negatives" icon="⚠️">
                <div className="space-y-2">
                  {analysis.long_term_risks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                      <span className="text-red-400">•</span>
                      <span className="text-sm text-[#f0f4f8]">{risk}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Safe consumption */}
            {analysis.safe_consumption && (
              <Section title="Safe Consumption" icon="✅">
                <div className="space-y-2">
                  {analysis.safe_consumption.amount && (
                    <div className="flex items-start gap-3">
                      <span className="text-[11px] font-bold text-[#7a8fa6] w-20 flex-shrink-0 pt-0.5">Amount</span>
                      <span className="text-sm text-[#f0f4f8]">{analysis.safe_consumption.amount}</span>
                    </div>
                  )}
                  {analysis.safe_consumption.frequency && (
                    <div className="flex items-start gap-3">
                      <span className="text-[11px] font-bold text-[#7a8fa6] w-20 flex-shrink-0 pt-0.5">Frequency</span>
                      <span className="text-sm text-[#f0f4f8]">{analysis.safe_consumption.frequency}</span>
                    </div>
                  )}
                  {analysis.safe_consumption.notes && (
                    <div className="pt-2 mt-2 border-t border-[#2a3545]">
                      <p className="text-[11px] text-[#7a8fa6] leading-relaxed">💡 {analysis.safe_consumption.notes}</p>
                    </div>
                  )}
                  {analysis.safe_consumption.personalized_for_user && (
                    <div className="pt-2 mt-2 border-t border-[#2a3545] bg-emerald-500/5 rounded-xl p-3">
                      <p className="text-[11px] text-emerald-400 font-bold mb-1">✨ Personalised for you</p>
                      <p className="text-xs text-[#f0f4f8]">{analysis.safe_consumption.personalized_for_user}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Suitability - Removed as Personalized For You in AI Analysis covers this */}

            {/* Positives */}
            {analysis.positives && analysis.positives.length > 0 && (
              <Section title="What's Good" icon="👍">
                <div className="space-y-2">
                  {analysis.positives.map((p, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2 border-b border-[#2a3545] last:border-0">
                      <span className="text-emerald-400 flex-shrink-0 mt-0.5">•</span>
                      <p className="text-sm text-[#f0f4f8]">{p}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Long term risks */}
            {analysis.long_term_risks && analysis.long_term_risks.length > 0 && (
              <Section title="Long-Term Risks" icon="⏳">
                <div className="space-y-2">
                  {analysis.long_term_risks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                      <span className="text-red-400 flex-shrink-0 text-sm mt-0.5">⚠</span>
                      <p className="text-sm text-[#f0f4f8]">{risk}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* FSSAI */}
            {analysis.fssai_compliance && analysis.fssai_compliance !== 'unknown' && (
              <div className={`px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium border ${
                analysis.fssai_compliance === 'compliant'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
              }`}>
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="font-bold">FSSAI Compliance</p>
                  <p className="text-[11px] opacity-80">
                    {analysis.fssai_compliance === 'compliant'
                      ? 'No compliance concerns detected'
                      : 'Possible FSSAI compliance concern — verify label'}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════
            INGREDIENTS TAB
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Ingredients' && (
          <>
            {analysis.harmful_ingredients === undefined || analysis.harmful_ingredients === null ? (
              <div className="space-y-3">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : harmfulCount === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-base font-bold text-emerald-400 mb-1">No harmful ingredients</p>
                <p className="text-sm text-[#7a8fa6]">This product passed our 20+ substance screen</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-sm font-bold text-[#f0f4f8]">🚨 Harmful Ingredients Found</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-red-500 text-white">{harmfulCount}</span>
                </div>
                {(analysis.harmful_ingredients || [])
                  .filter(h => h.found_in_product !== false)
                  .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]))
                  .map((h, i) => {
                    const sty = severityStyle(h.severity)
                    return (
                      <div key={i} className="bg-[#161a20] border border-[#2a3545] rounded-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1f28]">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sty.dot}`} />
                            <div>
                              <p className="text-sm font-bold text-[#f0f4f8]">{h.name}</p>
                              {h.also_known_as && h.also_known_as.length > 0 && (
                                <p className="text-[10px] text-[#7a8fa6]">Also: {h.also_known_as.slice(0, 2).join(', ')}</p>
                              )}
                            </div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${sty.badge}`}>
                            {h.severity} risk
                          </span>
                        </div>
                        {/* Concern */}
                        <div className="px-4 py-3 border-t border-[#2a3545]">
                          <p className="text-sm text-[#f0f4f8] leading-relaxed">{h.concern}</p>
                        </div>
                        {/* Amount */}
                        {h.amount_in_this_product && (
                          <div className="px-4 py-2 border-t border-[#2a3545] bg-[#1e242d]">
                            <p className="text-[11px] text-[#7a8fa6]">
                              📊 In this product: <span className="font-bold text-[#f0f4f8]">{h.amount_in_this_product}</span>
                              {h.percentage_of_daily_limit && <span> · {h.percentage_of_daily_limit} of daily limit</span>}
                            </p>
                          </div>
                        )}
                        {/* Limits */}
                        {(h.global_safe_limit || h.personalized_safe_limit) && (
                          <div className="px-4 py-3 border-t border-[#2a3545] space-y-2">
                            {h.global_safe_limit && (
                              <div>
                                <p className="text-[10px] font-bold text-[#7a8fa6] mb-0.5">🌍 Global Safe Limit</p>
                                <p className="text-xs text-[#f0f4f8]">{h.global_safe_limit}</p>
                              </div>
                            )}
                            {h.personalized_safe_limit && (
                              <div className="pt-2 border-t border-[#2a3545]">
                                <p className="text-[10px] font-bold text-emerald-400 mb-0.5">✨ Your limit</p>
                                <p className="text-xs text-[#f0f4f8]">{h.personalized_safe_limit}</p>
                              </div>
                            )}
                          </div>
                        )}
                        {/* Source */}
                        {h.scientific_source && (
                          <div className="px-4 py-3 border-t border-[#2a3545] bg-sky-500/5">
                            <p className="text-[10px] text-[#7a8fa6] mb-1">📚 Source</p>
                            <p className="text-xs font-bold text-[#f0f4f8]">{h.scientific_source}</p>
                            {h.source_url && (
                              <a href={h.source_url} target="_blank" rel="noopener noreferrer"
                                className="text-[10px] text-sky-400 underline break-all mt-1 block">{h.source_url}</a>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}

            {/* All Ingredients List with Color Coding */}
            {ingredientList && ingredientList.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-[#7a8fa6] mb-2">📋 All Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {ingredientList.map((ing, idx) => (
                    <span 
                      key={idx} 
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        ing.status === 'harmful' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {ing.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Negatives Section */}
            {(analysis.long_term_risks && analysis.long_term_risks.length > 0) && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-sm font-bold text-red-400 mb-2">⚠️ Negatives</p>
                <div className="space-y-2">
                  {analysis.long_term_risks.map((risk, i) => (
                    <p key={i} className="text-xs text-[#7a8fa6]">• {risk}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Other warnings */}
            {analysis.ingredient_warnings && analysis.ingredient_warnings.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-[#f0f4f8] mb-2 px-1">⚠️ Other Notes</p>
                <div className="space-y-2">
                  {analysis.ingredient_warnings.map((w, i) => {
                    const sty = severityStyle(w.severity)
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 bg-[#161a20] border border-[#2a3545] rounded-xl">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${sty.dot}`} />
                        <div>
                          <p className="text-xs font-bold text-[#f0f4f8]">{w.ingredient}</p>
                          <p className="text-[11px] text-[#7a8fa6]">{w.concern}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}



            <div className="p-3 bg-[#161a20] border border-[#2a3545] rounded-xl text-[11px] text-[#7a8fa6] leading-relaxed">
              ℹ️ Based on WHO, FSSAI, ICMR and EFSA guidelines. Not medical advice.
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════
            NUTRITION TAB
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Nutrition' && (
          <>
            {/* Quantity adjuster */}
            <Section title="Serving Size" icon="⚖️">
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => setQuantity(q => Math.max(10, q - 10))}
                  className="w-10 h-10 rounded-xl bg-[#1e242d] border border-[#2a3545] text-lg font-bold text-[#f0f4f8] hover:border-emerald-500/40 transition-colors flex items-center justify-center">−</button>
                <input type="number" value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 text-center py-2.5 rounded-xl bg-[#1e242d] border border-[#2a3545] focus:border-emerald-500/60 text-[#f0f4f8] text-sm font-bold outline-none" />
                <button onClick={() => setQuantity(q => Math.min(2000, q + 10))}
                  className="w-10 h-10 rounded-xl bg-[#1e242d] border border-[#2a3545] text-lg font-bold text-[#f0f4f8] hover:border-emerald-500/40 transition-colors flex items-center justify-center">+</button>
                <span className="text-sm text-[#7a8fa6] font-medium">g</span>
              </div>
              <p className="text-center text-emerald-400 font-bold text-lg">
                {totalCals} <span className="text-sm font-medium text-[#7a8fa6]">kcal total</span>
              </p>
            </Section>

            {/* Macro grid */}
            <Section title="Macronutrients (per 100g)" icon="📊">
              {(!product.nutrition?.calories && !product.nutrition?.protein && !product.nutrition?.carbs) ? (
                <MacroGridSkeleton />
              ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Calories', value: product.nutrition?.calories, unit: 'kcal', color: 'text-orange-400' },
                  { label: 'Protein',  value: product.nutrition?.protein,  unit: 'g',    color: 'text-blue-400'   },
                  { label: 'Carbs',    value: product.nutrition?.carbs,    unit: 'g',    color: 'text-amber-400'  },
                  { label: 'Fat',      value: product.nutrition?.fat,      unit: 'g',    color: 'text-rose-400'   },
                  { label: 'Sugar',    value: product.nutrition?.sugar,    unit: 'g',    color: 'text-pink-400'   },
                  { label: 'Sodium',   value: product.nutrition?.sodium,   unit: 'mg',   color: 'text-purple-400' },
                  { label: 'Fiber',    value: product.nutrition?.fiber,    unit: 'g',    color: 'text-emerald-400'},
                ].filter(m => m.value != null).map(m => (
                  <div key={m.label} className="bg-[#1e242d] rounded-xl p-3">
                    <p className={`text-xl font-black tabular-nums ${m.color}`}>{m.value}<span className="text-xs font-medium text-[#7a8fa6] ml-0.5">{m.unit}</span></p>
                    <p className="text-[11px] text-[#7a8fa6] mt-0.5">{m.label}</p>
                    <p className="text-[10px] text-[#7a8fa6] mt-1">
                      = {Math.round((Number(m.value) || 0) * quantity / 100)}{m.unit} in {quantity}g
                    </p>
                  </div>
                ))}
              </div>
              )}
            </Section>

            {/* AI detailed breakdown */}
            {analysis.detailed_breakdown && (
              <Section title="AI Breakdown" icon="🧬">
                <div className="space-y-0">
                  {(['calories', 'protein', 'sugar', 'sodium', 'fat', 'fiber'] as const).map(key => {
                    const val = analysis.detailed_breakdown![key]
                    if (!val) return null
                    const lower  = val.toLowerCase()
                    const isGood = lower.startsWith('good') || lower.startsWith('low')
                    const isBad  = lower.startsWith('high') || lower.startsWith('very high')
                    return (
                      <div key={key} className="flex items-start gap-3 py-2.5 border-b border-[#2a3545] last:border-0">
                        <span className="text-[11px] w-14 font-bold text-[#7a8fa6] capitalize flex-shrink-0 pt-0.5">{key}</span>
                        <span className={`text-sm ${isGood ? 'text-emerald-400' : isBad ? 'text-red-400' : 'text-[#f0f4f8]'}`}>{val}</span>
                      </div>
                    )
                  })}
                  {analysis.detailed_breakdown.processing_level && (
                    <div className="flex items-center gap-3 pt-2.5 border-t border-[#2a3545]">
                      <span className="text-[11px] w-14 font-bold text-[#7a8fa6] flex-shrink-0">Level</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        analysis.detailed_breakdown.processing_level === 'minimally_processed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : analysis.detailed_breakdown.processing_level === 'moderately_processed'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {analysis.detailed_breakdown.processing_level.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Log meal */}
            <Section title="Log This Meal" icon="📝">
              {isGuest ? (
                <p className="text-sm text-[#7a8fa6] text-center py-2">
                  <a href="/auth/signin" className="text-emerald-400 font-bold underline">Sign in</a> to log meals and track calories
                </p>
              ) : loggedMeal ? (
                <div className="text-center py-2">
                  <p className="text-sm font-bold text-emerald-400">✅ Logged {quantity}g as {loggedMeal}!</p>
                  <button onClick={() => setLoggedMeal(null)} className="text-xs text-[#7a8fa6] underline mt-1">Log again</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {[{ type: 'breakfast', icon: '🌅' }, { type: 'lunch', icon: '☀️' }, { type: 'dinner', icon: '🌙' }, { type: 'snack', icon: '🍎' }].map(m => (
                    <button key={m.type} onClick={() => handleLogMeal(m.type)} disabled={logging}
                      className="py-2.5 rounded-xl text-xs font-bold capitalize bg-[#1e242d] border border-emerald-500/25 text-emerald-400 hover:border-emerald-500/50 hover:bg-[#252c38] transition-all active:scale-95 disabled:opacity-50">
                      {m.icon} {m.type}
                    </button>
                  ))}
                </div>
              )}
            </Section>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ALTERNATIVES TAB
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Alternatives' && (
          <>
            {altLoading && (
              <div className="flex items-center gap-3 py-8 justify-center">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#7a8fa6]">Finding healthier alternatives...</p>
              </div>
            )}

            {/* Score comparison bar (only when we have both scores) */}
            {apiAlternatives?.current_score != null && apiAlternatives?.alternatives?.[0]?.score != null && (
              <div className="mb-4 p-4 bg-[#161a20] border border-[#2a3545] rounded-2xl">
                <p className="text-xs font-bold text-[#7a8fa6] mb-3">📊 Score Comparison</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-[#7a8fa6]">Current</span>
                      <span className={`text-[11px] font-bold ${scoreColor(apiAlternatives.current_score) === '#ef4444' ? 'text-red-400' : scoreColor(apiAlternatives.current_score) === '#fb923c' ? 'text-orange-400' : scoreColor(apiAlternatives.current_score) === '#f59e0b' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {apiAlternatives.current_score}/10
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1e2a35] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${apiAlternatives.current_score * 10}%`, backgroundColor: scoreColor(apiAlternatives.current_score) }} />
                    </div>
                  </div>
                  <span className="text-[#7a8fa6] text-lg">→</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-emerald-400">Alternative</span>
                      <span className="text-[11px] font-bold text-emerald-400">
                        {Math.round(apiAlternatives.alternatives[0].score * 10) / 10}/10
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1e2a35] overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(apiAlternatives.alternatives[0].score * 10, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic alternatives from API */}
            {apiAlternatives?.alternatives?.length > 0 && apiAlternatives?.source !== 'curated' && (
              <div className="space-y-3">
                <p className="text-xs text-[#7a8fa6] px-1">Healthier alternatives found for you</p>
                {apiAlternatives.alternatives.map((alt: any, i: number) => (
                  <div key={i} className="bg-[#161a20] border border-[#2a3545] hover:border-emerald-500/20 rounded-2xl p-4 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-base flex-shrink-0 overflow-hidden">
                          {alt.image_url ? <img src={alt.image_url} alt="" className="w-full h-full object-cover" /> : '✅'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#f0f4f8]">{alt.name}</p>
                          {alt.score != null && (
                            <p className="text-[11px]" style={{ color: scoreColor(alt.score) }}>
                              Score: {Math.round(alt.score * 10) / 10}/10 · Grade: {alt.grade || scoreLabel(alt.score)}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-[#252c38] border border-[#2a3545] text-[#7a8fa6] rounded-full flex-shrink-0">
                        {alt.brand || 'Branded'}
                      </span>
                    </div>

                    {/* Nutrition comparison chips */}
                    {alt.nutrition_per_100g && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-12">
                        {alt.nutrition_per_100g.calories && (
                          <span className="px-2 py-0.5 rounded-md bg-[#1e242d] text-[10px] text-[#7a8fa6]">🔥 {alt.nutrition_per_100g.calories} kcal</span>
                        )}
                        {alt.nutrition_per_100g.protein && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-[10px] text-blue-400">💪 {alt.nutrition_per_100g.protein}g protein</span>
                        )}
                        {alt.nutrition_per_100g.sugar != null && (
                          <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-[10px] text-pink-400">🍬 {alt.nutrition_per_100g.sugar}g sugar</span>
                        )}
                        {alt.nutrition_per_100g.fiber && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] text-emerald-400">🌾 {alt.nutrition_per_100g.fiber}g fiber</span>
                        )}
                      </div>
                    )}

                    {/* Why better */}
                    {alt.reason && <p className="text-xs text-[#7a8fa6] leading-relaxed mt-2 ml-12">{alt.reason}</p>}

                    {/* Availability */}
                    {alt.availability && (
                      <p className="text-[11px] text-emerald-400 mt-1.5 ml-12">📍 {alt.availability}</p>
                    )}

                    {/* Shopping link */}
                    {alt.name && (
                      <div className="mt-2 ml-12">
                        <ShoppingLinks productName={alt.name} brand={alt.brand || undefined} compact />
                      </div>
                    )}
                  </div>
                ))}

                {/* Why better detailed comparison */}
                {apiAlternatives.why_better?.length > 0 && (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl">
                    <p className="text-xs font-bold text-emerald-400 mb-2">📈 What makes them better</p>
                    <div className="space-y-2">
                      {apiAlternatives.why_better.map((w: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-[#7a8fa6]">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{w.metric}: <span className="text-red-400 line-through">{w.current}</span> → <span className="text-emerald-400">{w.alternative}</span> ({w.improvement})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Curated / fallback alternatives (always shown when no dynamic alternatives) */}
            {(!apiAlternatives?.alternatives || apiAlternatives?.source === 'curated') && apiAlternatives?.alternatives?.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-[#7a8fa6] px-1">🛒 Curated healthier options</p>
                {apiAlternatives.alternatives.map((alt: any, i: number) => {
                  const typeIcon: Record<string, string> = { branded: '🏷️', homemade: '🏠', whole_food: '🌾' }
                  const typeLabel: Record<string, string> = { branded: 'Branded', homemade: 'Homemade', whole_food: 'Whole food' }
                  const altScore = alt.score
                  return (
                    <div key={i} className="bg-[#161a20] border border-[#2a3545] hover:border-emerald-500/20 rounded-2xl p-4 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-base flex-shrink-0">
                            {alt.type ? (typeIcon[alt.type] || '✅') : '✅'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#f0f4f8]">{alt.name}</p>
                            {altScore != null && (
                              <p className="text-[11px] text-emerald-400">Score: {Math.round(altScore * 10) / 10}/10</p>
                            )}
                          </div>
                        </div>
                        {alt.type && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#252c38] border border-[#2a3545] text-[#7a8fa6] rounded-full flex-shrink-0">
                            {typeLabel[alt.type] || alt.type}
                          </span>
                        )}
                      </div>

                      {/* Nutrition mini chips */}
                      {alt.nutrition_per_100g && (
                        <div className="flex flex-wrap gap-2 mt-2 ml-12">
                          {alt.nutrition_per_100g.calories && <span className="px-2 py-0.5 rounded-md bg-[#1e242d] text-[10px] text-[#7a8fa6]">🔥 {alt.nutrition_per_100g.calories} kcal</span>}
                          {alt.nutrition_per_100g.protein && <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-[10px] text-blue-400">💪 {alt.nutrition_per_100g.protein}g</span>}
                          {alt.nutrition_per_100g.sugar != null && <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-[10px] text-pink-400">🍬 {alt.nutrition_per_100g.sugar}g</span>}
                          {alt.nutrition_per_100g.fiber && <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] text-emerald-400">🌾 {alt.nutrition_per_100g.fiber}g</span>}
                        </div>
                      )}

                      {alt.reason && <p className="text-xs text-[#7a8fa6] leading-relaxed mt-2 ml-12">{alt.reason}</p>}
                      {alt.availability && (
                        <p className="text-[11px] text-emerald-400 mt-1.5 ml-12">📍 {alt.availability.replace(/_/g, ' ')}</p>
                      )}

                      {/* Shopping link for branded items */}
                      {alt.type === 'branded' && alt.name && (
                        <div className="mt-2 ml-12">
                          <ShoppingLinks productName={alt.name} brand={alt.name.split(' ')[0]} compact />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Failed to load alternatives */}
            {altError && (
              <div className="text-center py-8 text-[#7a8fa6]">
                <p className="text-sm mb-3">Could not load alternatives</p>
                <button onClick={() => { setApiAlternatives(null); setAltError(false) }}
                  className="px-4 py-2 bg-[#252c38] hover:bg-[#2a3545] text-[#c8d6e0] font-bold rounded-xl text-sm transition-colors">
                  Retry
                </button>
              </div>
            )}

            {/* Alternatives returned but empty */}
            {apiAlternatives && apiAlternatives?.alternatives?.length === 0 && (
              <div className="text-center py-8 text-[#7a8fa6]">
                <p className="text-sm">No specific alternatives found for this product</p>
              </div>
            )}

            {/* If alternatives is null/loading not yet started, show nothing (loading state above handles it) */}
            {apiAlternatives === null && !altLoading && !altError && (
              <div className="text-center py-8 text-[#7a8fa6]">
                <p className="text-sm">Loading alternatives...</p>
              </div>
            )}

            {/* Universal fallback — always visible */}
            <div className="pt-2">
              <p className="text-xs text-emerald-400 font-bold mb-2">🌿 Universal Healthy Options</p>
              <p className="text-[10px] text-[#7a8fa6] mb-3">These whole food alternatives are always healthier choices:</p>
              <div className="space-y-2">
                {UNIVERSAL_FALLBACK.slice(0, 3).map((alt, i) => (
                  <div key={i} className="bg-[#161a20] border border-[#2a3545] hover:border-emerald-500/20 rounded-xl p-3 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{i === 0 ? '🥜' : i === 1 ? '🍎' : '🌱'}</span>
                      <div>
                        <p className="text-sm font-bold text-[#f0f4f8]">{alt.name}</p>
                        <p className="text-[11px] text-[#7a8fa6]">{alt.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {analysis.health_rating !== 'healthy' && (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl mt-3">
                <p className="text-xs font-bold text-emerald-400 mb-1">💚 Why switch?</p>
                <p className="text-[11px] text-[#7a8fa6] leading-relaxed">
                  Switching to healthier alternatives even 2–3 times a week can significantly reduce your
                  intake of harmful additives. Small changes add up over time.
                </p>
              </div>
            )}

            {/* Shopping Links */}
            <div className="mt-6">
              <ShoppingLinks productName={product.name} brand={product.brand || undefined} />
            </div>
          </>
        )}

      </div>
    </div>
  )
}
