// src/app/results/page.tsx
"use client"
import { useEffect, useState }  from 'react'
import { useRouter }             from 'next/navigation'
import { useSession }            from 'next-auth/react'
import toast                     from 'react-hot-toast'
import { readScanResult, ScanResultPayload } from '@/types/scanResult'
import { event, AnalyticsEvents } from '@/lib/analytics'

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

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const router        = useRouter()
  const { status }    = useSession()
  const isGuest       = status === 'unauthenticated'

  const [payload,    setPayload]    = useState<ScanResultPayload | null>(null)
  const [hydrated,   setHydrated]   = useState(false)
  const [activeTab,  setActiveTab]  = useState<Tab>('Overview')
  const [quantity,   setQuantity]   = useState(100)
  const [loggedMeal, setLoggedMeal] = useState<string | null>(null)
  const [logging,    setLogging]    = useState(false)

  useEffect(() => {
    const data = readScanResult()
    setPayload(data)
    if (data) setQuantity(data.quantity || 100)
    setHydrated(true)
  }, [])

  async function handleLogMeal(mealType: string) {
    if (!payload || isGuest || logging) return
    setLogging(true)
    const { product } = payload
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
      } else {
        toast.error(json.error || 'Failed to log meal.')
      }
    } catch { toast.error('Network error.') }
    finally { setLogging(false) }
  }

  if (!hydrated) return null

  // ── Empty state ───────────────────────────────────────────────────────────

  if (!payload) {
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

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] font-sans pb-28">

      {/* ── Hero header ───────────────────────────────────────────────────── */}
      <div className={`bg-gradient-to-b ${scoreBg(analysis.health_rating)} px-5 pt-14 pb-6`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.push('/scan')}
            className="text-[#7a8fa6] hover:text-[#f0f4f8] text-sm transition-colors flex items-center gap-1">
            ← Scan again
          </button>
          <span className="text-[11px] text-[#7a8fa6]">
            {new Date(timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </span>
        </div>

        {/* Product name + score ring */}
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#7a8fa6] font-medium uppercase tracking-widest mb-1">
              {product.source === 'gemini_photo' ? '📸 Photo scan' :
               product.source === 'gemini_vision' ? '👁 Label scan' :
               product.source === 'open_food_facts' ? '🌐 Open Food Facts' : '✅ Database'}
            </p>
            <h1 className="text-xl font-black text-[#f0f4f8] leading-tight">{product.name}</h1>
            {product.brand && <p className="text-sm text-[#7a8fa6] mt-0.5">{product.brand}</p>}

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
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-emerald-500 text-white'
                  : 'text-[#7a8fa6] hover:text-[#f0f4f8] bg-[#161a20]'
              }`}>
              {tab === 'Ingredients' && harmfulCount > 0 ? `Ingredients (${harmfulCount})` : tab}
            </button>
          ))}
        </div>
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

            {/* Suitability */}
            <Section title="Who Should Be Careful" icon="👥">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'diabetic_suitability',  label: '🩸 Diabetic'   },
                  { key: 'bp_suitability',         label: '💊 High BP'    },
                  { key: 'child_suitability',      label: '👶 Children'   },
                  { key: 'pregnancy_suitability',  label: '🤰 Pregnancy'  },
                ].map(({ key, label }) => {
                  const val = analysis[key as keyof typeof analysis] as string | undefined
                  if (!val) return null
                  const style = suitabilityColor(val)
                  const text  = val === 'suitable' ? 'Suitable' : val === 'consume_with_caution' ? 'With Caution' : 'Avoid'
                  return (
                    <div key={key} className={`${style.bg} rounded-xl p-3`}>
                      <p className="text-xs text-[#7a8fa6] mb-1">{label}</p>
                      <p className={`text-sm font-bold ${style.text}`}>{style.icon} {text}</p>
                    </div>
                  )
                })}
              </div>
            </Section>

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
            {harmfulCount === 0 ? (
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
            {analysis.healthier_alternatives && analysis.healthier_alternatives.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-[#7a8fa6] px-1">Specific Indian alternatives that are better for your health</p>
                {analysis.healthier_alternatives.map((alt, i) => {
                  const typeIcon:  Record<string, string> = { branded: '🏷️', homemade: '🏠', whole_food: '🌾' }
                  const typeLabel: Record<string, string> = { branded: 'Branded', homemade: 'Homemade', whole_food: 'Whole food' }
                  return (
                    <div key={i} className="bg-[#161a20] border border-[#2a3545] hover:border-emerald-500/20 rounded-2xl p-4 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-base flex-shrink-0">
                            {alt.type ? (typeIcon[alt.type] || '✅') : '✅'}
                          </div>
                          <p className="text-sm font-bold text-[#f0f4f8]">{alt.name}</p>
                        </div>
                        {alt.type && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#252c38] border border-[#2a3545] text-[#7a8fa6] rounded-full flex-shrink-0">
                            {typeLabel[alt.type] || alt.type}
                          </span>
                        )}
                      </div>
                      {alt.reason && <p className="text-xs text-[#7a8fa6] leading-relaxed ml-11">{alt.reason}</p>}
                      {alt.availability && (
                        <p className="text-[11px] text-emerald-400 ml-11 mt-1.5">
                          📍 {alt.availability.replace(/_/g, ' ')}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-[#7a8fa6]">No alternatives data available</div>
            )}

            {analysis.health_rating !== 'healthy' && (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl">
                <p className="text-xs font-bold text-emerald-400 mb-1">💚 Why switch?</p>
                <p className="text-[11px] text-[#7a8fa6] leading-relaxed">
                  Switching to healthier alternatives even 2–3 times a week can significantly reduce your
                  intake of harmful additives. Small changes add up over time.
                </p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}