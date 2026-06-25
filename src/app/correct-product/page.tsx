"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import PageShell from '@/components/PageShell'

interface Nutrition {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  sugar?: number
  sodium?: number
}

interface Product {
  name: string
  brand?: string
  barcode: string
  ingredients_text?: string
  nutrition?: Nutrition
}

function CorrectProductPageContent() {
  const router = useRouter()
  const { status } = useSession()
  const searchParams = useSearchParams()
  
  const [product, setProduct] = useState<Product>({
    name: '',
    brand: '',
    barcode: '',
    ingredients_text: '',
    nutrition: {}
  })
  const [activeSection, setActiveSection] = useState<'basic' | 'nutrition'>('basic')
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    const stored = localStorage.getItem('last_scan_product')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setProduct({
          name: parsed.name || '',
          brand: parsed.brand || '',
          barcode: parsed.barcode || '',
          ingredients_text: parsed.ingredients_text || '',
          nutrition: parsed.nutrition || {}
        })
      } catch (e) {
        console.error('Failed to parse stored product:', e)
      }
    }
  }, [])

  const updateNutrition = (field: keyof Nutrition, value: string) => {
    const numValue = parseFloat(value) || 0
    setProduct(prev => ({
      ...prev,
      nutrition: { ...prev.nutrition, [field]: numValue }
    }))
  }

  const handleSubmit = async () => {
    if (!product.name.trim()) {
      toast.error('Product name is required')
      return
    }
    if (!product.barcode.trim()) {
      toast.error('Barcode is required')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/products/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })
      const json = await res.json()

      if (json.success) {
        setStep(2)
        toast.success('Correction submitted!')
      } else {
        toast.error(json.error || 'Failed to submit')
      }
    } catch {
      toast.error('Network error. Please try again.')
    }
    setSaving(false)
  }

  return (
    <PageShell variant="default" title="Correct Product" showBack>
      <div className="px-4">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-sm text-[var(--muted-2)] mb-4">
                Help improve our database by correcting wrong information.
              </p>

              {/* Tab Switcher */}
              <div className="flex gap-2 p-1 bg-[var(--card)] rounded-xl">
                <button
                  onClick={() => setActiveSection('basic')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeSection === 'basic' 
                      ? 'bg-[var(--clay)] text-white' 
                      : 'text-[var(--muted-2)] hover:text-[var(--foreground)]'
                  }`}
                >
                  📝 Basic Info
                </button>
                <button
                  onClick={() => setActiveSection('nutrition')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeSection === 'nutrition' 
                      ? 'bg-[var(--clay)] text-white' 
                      : 'text-[var(--muted-2)] hover:text-[var(--foreground)]'
                  }`}
                >
                  📊 Nutrition
                </button>
              </div>

              {activeSection === 'basic' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--muted-2)] mb-1.5">Product Name *</label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:border-[var(--clay)]/50 outline-none"
                      placeholder="e.g., Parle-G Chocolate"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--muted-2)] mb-1.5">Brand</label>
                    <input
                      type="text"
                      value={product.brand}
                      onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:border-[var(--clay)]/50 outline-none"
                      placeholder="e.g., Britannia"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--muted-2)] mb-1.5">Barcode *</label>
                    <input
                      type="text"
                      value={product.barcode}
                      onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:border-[var(--clay)]/50 outline-none"
                      placeholder="8901234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--muted-2)] mb-1.5">Ingredients (comma separated)</label>
                    <textarea
                      value={product.ingredients_text}
                      onChange={(e) => setProduct({ ...product, ingredients_text: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm h-24 resize-none focus:border-[var(--clay)]/50 outline-none"
                      placeholder="Sugar, Wheat Flour, Cocoa Butter, etc."
                    />
                  </div>

                  <button
                    onClick={() => setActiveSection('nutrition')}
                    className="w-full py-2.5 rounded-xl border border-[var(--border)] text-[var(--muted-2)] text-sm font-bold hover:border-[var(--clay)]/30 transition-colors"
                  >
                    Next: Add Nutrition →
                  </button>
                </div>
              )}

              {activeSection === 'nutrition' && (
                <div className="space-y-3">
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                    <h3 className="text-sm font-bold text-[var(--foreground)] mb-3">Nutrition per 100g</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'calories', label: 'Calories', unit: 'kcal', color: 'text-orange-400' },
                        { key: 'protein', label: 'Protein', unit: 'g', color: 'text-blue-400' },
                        { key: 'carbs', label: 'Carbs', unit: 'g', color: 'text-amber-400' },
                        { key: 'fat', label: 'Fat', unit: 'g', color: 'text-rose-400' },
                        { key: 'sugar', label: 'Sugar', unit: 'g', color: 'text-pink-400' },
                        { key: 'sodium', label: 'Sodium', unit: 'mg', color: 'text-purple-400' },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-[10px] text-[var(--muted-2)] mb-1">{field.label}</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={product.nutrition?.[field.key as keyof Nutrition] || ''}
                              onChange={(e) => updateNutrition(field.key as keyof Nutrition, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:border-[var(--clay)]/50 outline-none"
                              placeholder="0"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-2)]">
                              {field.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveSection('basic')}
                    className="w-full py-2.5 rounded-xl border border-[var(--border)] text-[var(--muted-2)] text-sm font-bold hover:border-[var(--clay)]/30 transition-colors"
                  >
                    ← Back to Details
                  </button>
                </div>
              )}

              {/* Submit */}
              {activeSection === 'nutrition' && (
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--clay)] to-[var(--bark)] text-white font-bold text-sm disabled:opacity-50 shadow-lg shadow-[var(--clay)]/20"
                >
                  {saving ? 'Submitting...' : 'Submit Correction ✓'}
                </button>
              )}

              <p className="text-[11px] text-[var(--muted-2)] text-center">
                Corrections are reviewed by our team before going live.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-xl font-black text-[var(--foreground)] mb-2">Submitted!</h2>
              <p className="text-sm text-[var(--muted-2)] mb-6">
                Your correction has been submitted for review.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/results')}
                  className="w-full py-3 rounded-xl bg-[var(--clay)] text-white font-bold text-sm"
                >
                  View Results
                </button>
                <button
                  onClick={() => {
                    setStep(1)
                    setProduct({
                      name: '',
                      brand: '',
                      barcode: '',
                      ingredients_text: '',
                      nutrition: {}
                    })
                  }}
                  className="w-full py-3 rounded-xl border border-[var(--border)] text-[var(--muted-2)] font-bold text-sm"
                >
                  Correct Another Product
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  )
}

function LoadingFallback() {
  return (
    <PageShell variant="no-header">
      <div className="flex items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div className="w-8 h-8 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin" />
      </div>
    </PageShell>
  )
}

export default function CorrectProductPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CorrectProductPageContent />
    </Suspense>
  )
}