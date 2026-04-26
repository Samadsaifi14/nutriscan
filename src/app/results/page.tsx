// src/app/results/page.tsx
"use client"
import { useEffect, useState } from 'react'
import { useRouter }            from 'next/navigation'
import { useSession }           from 'next-auth/react'
import toast                    from 'react-hot-toast'
import { event, AnalyticsEvents } from '@/lib/analytics'
import { readScanResult, ScanResultPayload } from '@/types/scanResult'
import { ProductCard }          from '@/components/results/ProductCard'
import { AnalysisCard }         from '@/components/results/AnalysisCard'

export default function ResultsPage() {
  const router          = useRouter()
  const { status }      = useSession()
  const isGuest         = status === 'unauthenticated'

  const [payload,     setPayload]     = useState<ScanResultPayload | null>(null)
  const [quantity,    setQuantity]    = useState(100)
  const [loggedMeal,  setLoggedMeal]  = useState<string | null>(null)
  const [hydrated,    setHydrated]    = useState(false)

  useEffect(() => {
    const data = readScanResult()
    if (!data) {
      setHydrated(true)
      return
    }
    setPayload(data)
    setQuantity(data.quantity)
    setHydrated(true)
  }, [])

  async function handleLogMeal(mealType: string) {
    if (!payload) return
    if (isGuest) { toast.error('Please sign in to log meals and track calories'); return }

    const { product } = payload
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
        event(AnalyticsEvents.LOG_MEAL, {
          product_name: product.name,
          meal_type:    mealType,
          quantity_g:   quantity,
          calories:     Math.round((product.nutrition?.calories || 0) * quantity / 100),
        })
      } else {
        toast.error(json.error || 'Failed to log meal.')
      }
    } catch { toast.error('Network error. Please try again.') }
  }

  // Not hydrated yet — show nothing to avoid flash
  if (!hydrated) return null

  // No valid payload — fallback CTA
  if (!payload) {
    return (
      <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-5">📭</div>
        <h2 className="text-lg font-semibold mb-2">No scan result found</h2>
        <p className="text-sm text-[#7a8fa6] mb-8 leading-relaxed">
          Scan a product first to see your health analysis here.
        </p>
        <button
          onClick={() => router.push('/scan')}
          className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-2xl text-sm transition-colors shadow-lg shadow-emerald-500/20"
        >
          📷 Go to Scanner
        </button>
      </div>
    )
  }

  const { product, analysis } = payload

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] font-sans">

      {/* Header */}
      <div className="px-5 pt-12 pb-5 border-b border-[#2a3545]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/scan')}
            className="flex items-center gap-2 text-[#7a8fa6] hover:text-[#f0f4f8] text-sm transition-colors"
          >
            ← Scan again
          </button>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-emerald-400 font-medium">Result</span>
          </div>
        </div>
        <h1 className="text-lg font-bold text-[#f0f4f8] mt-3 tracking-tight">
          health<span className="text-emerald-400">OX</span> Analysis
        </h1>
        <p className="text-xs text-[#7a8fa6] mt-0.5">
          {new Date(payload.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
      </div>

      <div className="px-4 py-5 max-w-lg mx-auto">
        <ProductCard
          product={product}
          quantity={quantity}
          loggedMeal={loggedMeal}
          isGuest={isGuest}
          onQuantityChange={setQuantity}
          onLogMeal={handleLogMeal}
          onClearLog={() => setLoggedMeal(null)}
        />
        <AnalysisCard analysis={analysis} />
      </div>
    </div>
  )
}