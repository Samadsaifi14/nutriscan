"use client"
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import PageShell from '@/components/PageShell'
import { parseIndianNutritionLabel } from '@/lib/ocr/indian-label-parser'
import { enhanceImage, hasGlare } from '@/lib/ocr/image-enhancer'
import { supabase } from '@/lib/supabase'

const STEPS = ['Info', 'Ingr', 'Nutr', 'Review']

function ContributePageContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const barcode = searchParams?.get('barcode') || ''

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [capturedImages, setCapturedImages] = useState<{ front: string | null; nutrition: string | null }>({ front: null, nutrition: null })
  const [formData, setFormData] = useState({ name: '', brand: '', category: '' })
  const [parsedData, setParsedData] = useState<any>(null)
  const [correctedNutrition, setCorrectedNutrition] = useState<any>({})

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin?callbackUrl=/contribute')
  }, [status, router])

  const openCamera = (type: 'front' | 'nutrition') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = async () => {
        const dataUrl = reader.result as string
        if (type === 'front') {
          setCapturedImages(prev => ({ ...prev, front: dataUrl }))
        } else {
          setCapturedImages(prev => ({ ...prev, nutrition: dataUrl }))
          await processNutritionLabel(dataUrl)
        }
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  async function processNutritionLabel(imageDataUrl: string) {
    setLoading(true)
    try {
      const enhanced = await enhanceImage(imageDataUrl)
      const glareDetected = await hasGlare(imageDataUrl)
      if (glareDetected) toast.error('Glare detected! Please retake without flash.')

      const response = await fetch('/api/scan-product-photo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: enhanced.dataUrl })
      })
      if (!response.ok) throw new Error('Failed to scan photo')
      const json = await response.json()

      if (json.success && json.data) {
        const data = json.data
        const nutritionText = (data.ingredients_text || '') + ' ' + JSON.stringify(data.nutrition_per_100g || {})
        const parsed = parseIndianNutritionLabel(nutritionText)
        setParsedData({ nutrition: parsed, rawText: data.ingredients_text || '' })

        const np = data.nutrition_per_100g || {}
        setCorrectedNutrition({
          calories: np.calories || null, protein: np.protein || null,
          fat: np.fat || null, saturated_fat: null, trans_fat: null,
          carbohydrates: np.carbs || np.carbohydrates || null,
          sugar: np.sugar || null, fiber: np.fiber || null, sodium: np.sodium || null,
        })
        if (data.name && !formData.name) setFormData(prev => ({ ...prev, name: data.name, brand: data.brand || '' }))
      }
    } catch (err) { console.error('OCR error:', err); toast.error('Could not read nutrition label') }
    finally { setLoading(false) }
  }

  async function handleSubmit() {
    const userId = (session?.user as any)?.id
    if (!userId) { toast.error('Please sign in'); return }
    if (!capturedImages.front || !capturedImages.nutrition) { toast.error('Please add both photos'); return }
    if (!formData.name.trim()) { toast.error('Product name is required'); return }
    setLoading(true)
    try {
      const ts = Date.now()
      const frontUrl = await uploadImage(capturedImages.front, `front_${ts}.jpg`, userId)
      const nutritionUrl = await uploadImage(capturedImages.nutrition, `nutrition_${ts}.jpg`, userId)
      const { error } = await supabase.from('community_products').insert({
        barcode: barcode || null, name: formData.name, brand: formData.brand || null,
        front_label_url: frontUrl, nutrition_label_url: nutritionUrl,
        ingredients_text: parsedData?.rawText || null, nutrition: correctedNutrition,
        submitted_by: userId, status: 'unverified',
      })
      if (error) throw error
      await supabase.rpc('increment_contributions', { user_id: userId })
      try { await fetch('/api/profile/badges', { method: 'POST' }) } catch {}
      setStep(4)
    } catch (err: any) { toast.error(err.message || 'Failed to submit') }
    finally { setLoading(false) }
  }

  async function uploadImage(dataUrl: string, filename: string, userId: string): Promise<string> {
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    const { error } = await supabase.storage.from('community-products').upload(`${userId}/${filename}`, blob, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data } = supabase.storage.from('community-products').getPublicUrl(`${userId}/${filename}`)
    return data.publicUrl
  }

  if (status === 'loading') return (
    <PageShell variant="no-header">
      <div className="flex items-center justify-center" style={{ minHeight: '100dvh' }}>
        <div className="w-6 h-6 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin" />
      </div>
    </PageShell>
  )

  return (
    <PageShell variant="default" title="Contribute" showBack={false}
      left={<button onClick={() => step > 0 ? setStep(s => Math.max(0, s - 1)) : router.back()} className="text-base text-[var(--sand)]">←</button>}
      right={<span className="text-xs text-[var(--sand)]">{step < 4 ? `Step ${step + 1} of 4` : 'Done'}</span>}
    >
      {/* Progress bar */}
      {step < 4 && (
        <div className="px-4 pt-3 pb-2">
          <div style={{ display: 'flex', gap: 0, position: 'relative', marginBottom: 10 }}>
            <div style={{ position: 'absolute', top: 9, left: '10%', right: '10%', height: 2, background: 'var(--surface-3)', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: 9, left: '10%', width: `${(step / 3) * 80}%`, height: 2, background: 'var(--clay)', zIndex: 1, transition: 'width .3s' }} />
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', zIndex: 2 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: i === step ? 'var(--clay)' : i < step ? 'var(--moss)' : 'var(--surface-3)',
                  border: `0.5px solid ${i === step ? 'var(--clay)' : 'var(--border-2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 11, color: i <= step ? '#fff' : 'var(--muted)', fontWeight: 700 }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 11, color: i === step ? 'var(--clay)' : 'var(--muted)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pt-1 pb-6 space-y-4">

        {/* ═══ STEP 0 — Info ═══ */}
        {step === 0 && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="text-sm font-bold text-[var(--foreground)] mb-1">Product Information</h2>
            <p className="text-xs text-[var(--sand)] mb-4">Tell us about the product</p>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-[var(--sand)] font-bold block mb-1">Product name *</span>
                <div style={{ height: 32, borderRadius: 8, background: 'var(--surface-2)', border: '0.5px solid var(--border-2)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maggi 2-Minute Noodles"
                    className="w-full bg-transparent text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]" />
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--sand)] font-bold block mb-1">Brand name *</span>
                <div style={{ height: 32, borderRadius: 8, background: 'var(--surface-2)', border: '0.5px solid var(--border-2)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                  <input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Nestlé India"
                    className="w-full bg-transparent text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]" />
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--sand)] font-bold block mb-1">Barcode</span>
                <div style={{ height: 32, borderRadius: 8, background: 'var(--surface-2)', border: '0.5px solid var(--border-2)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                  <input type="text" defaultValue={barcode} placeholder="Scan or enter barcode"
                    className="w-full bg-transparent text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]" />
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--sand)] font-bold block mb-1">Category *</span>
                <div style={{ height: 32, borderRadius: 8, background: 'var(--surface-2)', border: '0.5px solid var(--border-2)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                  <span className="text-xs text-[var(--muted)]">Select...</span>
                </div>
              </div>
            </div>

            <button onClick={() => {
              if (!formData.name.trim()) { toast.error('Product name is required'); return }
              setStep(1)
            }} className="w-full mt-4 h-9 rounded-lg bg-[var(--clay)] text-white text-xs font-bold">
              Continue →
            </button>
          </div>
        )}

        {/* ═══ STEP 1 — Photo / Ingredient Capture ═══ */}
        {step === 1 && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="text-sm font-bold text-[var(--foreground)] mb-1">Front Label Photo</h2>
            <p className="text-xs text-[var(--sand)] mb-4">Upload product front image</p>

            <div onClick={() => openCamera('front')} style={{
              height: 60, borderRadius: 10, border: '1.5px dashed var(--border-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12, cursor: 'pointer'
            }}>
              {capturedImages.front ? (
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 15 }}>✅</span>
                  <span className="text-xs text-[var(--clay)]">Photo captured</span>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: 15 }}>📷</span>
                  <span className="text-xs text-[var(--sand)]">Add product photo</span>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 h-9 rounded-lg border border-[var(--border-2)] text-[var(--sand)] text-xs font-bold bg-[var(--surface-2)]">← Back</button>
              <button onClick={() => { if (!capturedImages.front) { toast.error('Please add a photo'); return }; setStep(2) }}
                className="flex-1 h-9 rounded-lg bg-[var(--clay)] text-white text-xs font-bold">Continue →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2 — Nutrition Label Capture ═══ */}
        {step === 2 && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="text-sm font-bold text-[var(--foreground)] mb-1">Nutrition Label Photo</h2>
            <p className="text-xs text-[var(--sand)] mb-4">Upload the nutrition table</p>

            <div onClick={() => openCamera('nutrition')} style={{
              height: 60, borderRadius: 10, border: '1.5px dashed var(--border-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12, cursor: 'pointer'
            }}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-[var(--sand)]">Processing...</span>
                </div>
              ) : capturedImages.nutrition ? (
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 15 }}>✅</span>
                  <span className="text-xs text-[var(--clay)]">Nutrition parsed</span>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: 15 }}>📷</span>
                  <span className="text-xs text-[var(--sand)]">Add nutrition photo</span>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 h-9 rounded-lg border border-[var(--border-2)] text-[var(--sand)] text-xs font-bold bg-[var(--surface-2)]">← Back</button>
              <button onClick={() => { if (!capturedImages.nutrition) { toast.error('Please add a nutrition photo'); return }; setStep(3) }}
                className="flex-1 h-9 rounded-lg bg-[var(--clay)] text-white text-xs font-bold">Review →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3 — Review ═══ */}
        {step === 3 && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="text-sm font-bold text-[var(--foreground)] mb-1">Review & Correct</h2>
            <p className="text-xs text-[var(--sand)] mb-4">Verify the extracted values</p>

            <div className="space-y-3 mb-4">
              <div>
                <span className="text-xs text-[var(--sand)] font-bold block mb-1">Product name</span>
                <div style={{ height: 32, borderRadius: 8, background: 'var(--surface-2)', border: '0.5px solid var(--border-2)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent text-xs text-[var(--foreground)] outline-none" />
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--sand)] font-bold block mb-1">Brand</span>
                <div style={{ height: 32, borderRadius: 8, background: 'var(--surface-2)', border: '0.5px solid var(--border-2)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                  <input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-transparent text-xs text-[var(--foreground)] outline-none" />
                </div>
              </div>
            </div>

            {parsedData?.rawText && (
              <div className="mb-4 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border-2)]">
                <span className="text-xs text-[var(--sand)] font-bold block mb-1">Extracted Ingredients</span>
                <p className="text-xs text-[var(--sand)] leading-relaxed">{parsedData.rawText}</p>
              </div>
            )}

            <div className="mb-4">
              <span className="text-xs text-[var(--sand)] font-bold block mb-2">Nutrition (per 100g)</span>
              <div className="space-y-2">
                {[
                  { key: 'calories', label: 'Energy', unit: 'kcal' },
                  { key: 'protein', label: 'Protein', unit: 'g' },
                  { key: 'fat', label: 'Total Fat', unit: 'g' },
                  { key: 'carbohydrates', label: 'Carbs', unit: 'g' },
                  { key: 'sugar', label: 'Sugar', unit: 'g' },
                  { key: 'sodium', label: 'Sodium', unit: 'mg' },
                ].map(f => (
                  <div key={f.key} className="flex items-center justify-between py-1.5 border-b border-[var(--border-2)] last:border-0">
                    <span className="text-xs text-[var(--sand)]">{f.label}</span>
                    <div className="flex items-center gap-2">
                      <input type="number" value={correctedNutrition[f.key] || ''}
                        onChange={e => setCorrectedNutrition({ ...correctedNutrition, [f.key]: e.target.value ? parseFloat(e.target.value) : null })}
                        className="w-20 h-7 px-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border-2)] text-xs text-right text-[var(--foreground)] outline-none" placeholder="—" />
                      <span className="text-xs text-[var(--muted)] w-5">{f.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 h-9 rounded-lg border border-[var(--border-2)] text-[var(--sand)] text-xs font-bold bg-[var(--surface-2)]">← Back</button>
              <button onClick={handleSubmit} disabled={loading || !formData.name}
                className="flex-1 h-9 rounded-lg bg-[var(--clay)] text-white text-xs font-bold disabled:opacity-50">
                {loading ? 'Submitting...' : '✓ Submit Product'}
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 4 — Success ═══ */}
        {step === 4 && (
          <div className="text-center pt-8">
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'var(--clay)', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
            }}>
              <span>🎉</span>
            </div>
            <p className="text-sm font-bold text-[var(--foreground)] mb-1">You're the First!</p>
            <p className="text-xs text-[var(--sand)] mb-6">
              You added <span className="text-[var(--clay)] font-bold">{formData.name}</span> to Bio You.
            </p>
            <div style={{
              background: 'var(--surface-2)', borderRadius: 10,
              border: '0.5px solid var(--border-2)', padding: 10,
              marginBottom: 12
            }}>
              <p className="text-xs text-[var(--sand)] mb-1">Your Impact</p>
              <p className="text-xs font-bold text-[var(--clay)]">Help the community!</p>
              <p className="text-xs text-[var(--sand)]">Others can now validate this product</p>
            </div>
            <button onClick={() => router.push('/dashboard')}
              className="w-full h-9 rounded-lg bg-[var(--clay)] text-white text-xs font-bold mb-3">
              Back to Dashboard
            </button>
          </div>
        )}

      </div>
    </PageShell>
  )
}

export default function ContributePage() {
  return (
    <Suspense fallback={<PageShell variant="no-header"><div className="flex items-center justify-center" style={{ minHeight: '100dvh' }}><div className="w-6 h-6 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin" /></div></PageShell>}>
      <ContributePageContent />
    </Suspense>
  )
}
