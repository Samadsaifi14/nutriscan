"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function CorrectProductPage() {
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
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8]">
      <div className="max-w-md mx-auto p-4 pb-28">
        {/* Header */}
        <div className="flex items-center justify-between py-4 mb-2">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-xl bg-[#161a20] text-[#7a8fa6] hover:text-[#f0f4f8] transition-colors"
          >
            ←
          </button>
          <h1 className="text-lg font-black">Correct Product</h1>
          <div className="w-9" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-sm text-[#7a8fa6] mb-4">
                Help improve our database by correcting wrong information.
              </p>

              {/* Tab Switcher */}
              <div className="flex gap-2 p-1 bg-[#161a20] rounded-xl">
                <button
                  onClick={() => setActiveSection('basic')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeSection === 'basic' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-[#7a8fa6] hover:text-[#f0f4f8]'
                  }`}
                >
                  📝 Basic Info
                </button>
                <button
                  onClick={() => setActiveSection('nutrition')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeSection === 'nutrition' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-[#7a8fa6] hover:text-[#f0f4f8]'
                  }`}
                >
                  📊 Nutrition
                </button>
              </div>

              {activeSection === 'basic' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#7a8fa6] mb-1.5">Product Name *</label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161a20] border border-[#2a3545] text-[#f0f4f8] text-sm focus:border-emerald-500/50 outline-none"
                      placeholder="e.g., Parle-G Chocolate"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7a8fa6] mb-1.5">Brand</label>
                    <input
                      type="text"
                      value={product.brand}
                      onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161a20] border border-[#2a3545] text-[#f0f4f8] text-sm focus:border-emerald-500/50 outline-none"
                      placeholder="e.g., Britannia"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7a8fa6] mb-1.5">Barcode *</label>
                    <input
                      type="text"
                      value={product.barcode}
                      onChange={(e) => setProduct({ ...product, barcode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161a20] border border-[#2a3545] text-[#f0f4f8] text-sm focus:border-emerald-500/50 outline-none"
                      placeholder="8901234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7a8fa6] mb-1.5">Ingredients (comma separated)</label>
                    <textarea
                      value={product.ingredients_text}
                      onChange={(e) => setProduct({ ...product, ingredients_text: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#161a20] border border-[#2a3545] text-[#f0f4f8] text-sm h-24 resize-none focus:border-emerald-500/50 outline-none"
                      placeholder="Sugar, Wheat Flour, Cocoa Butter, etc."
                    />
                  </div>

                  <button
                    onClick={() => setActiveSection('nutrition')}
                    className="w-full py-2.5 rounded-xl border border-[#2a3545] text-[#7a8fa6] text-sm font-bold hover:border-emerald-500/30 transition-colors"
                  >
                    Next: Add Nutrition →
                  </button>
                </div>
              )}

              {activeSection === 'nutrition' && (
                <div className="space-y-3">
                  <div className="bg-[#161a20] border border-[#2a3545] rounded-xl p-4">
                    <h3 className="text-sm font-bold text-[#f0f4f8] mb-3">Nutrition per 100g</h3>
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
                          <label className="block text-[10px] text-[#7a8fa6] mb-1">{field.label}</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={product.nutrition?.[field.key as keyof Nutrition] || ''}
                              onChange={(e) => updateNutrition(field.key as keyof Nutrition, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[#1e242d] border border-[#2a3545] text-[#f0f4f8] text-sm focus:border-emerald-500/50 outline-none"
                              placeholder="0"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#7a8fa6]">
                              {field.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveSection('basic')}
                    className="w-full py-2.5 rounded-xl border border-[#2a3545] text-[#7a8fa6] text-sm font-bold hover:border-emerald-500/30 transition-colors"
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
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-bold text-sm disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  {saving ? 'Submitting...' : 'Submit Correction ✓'}
                </button>
              )}

              <p className="text-[11px] text-[#7a8fa6] text-center">
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
              <h2 className="text-xl font-black text-[#f0f4f8] mb-2">Submitted!</h2>
              <p className="text-sm text-[#7a8fa6] mb-6">
                Your correction has been submitted for review.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/results')}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm"
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
                  className="w-full py-3 rounded-xl border border-[#2a3545] text-[#7a8fa6] font-bold text-sm"
                >
                  Correct Another Product
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}