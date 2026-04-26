// src/components/results/AnalysisCard.tsx
"use client"
import { useState } from 'react'
import { Analysis } from '@/types/scanResult'
import { HealthScoreRing, ScoreBar, scoreColorClass, ratingEmoji } from './HealthScoreRing'

const ratingBg: Record<string, string> = {
  healthy:   'bg-emerald-500/5 border-emerald-500/20',
  moderate:  'bg-amber-500/5 border-amber-500/20',
  unhealthy: 'bg-red-500/5 border-red-500/20',
}

const severityBorder = { high: 'border-red-500/30',  medium: 'border-amber-500/30', low: 'border-[#2a3545]' }
const severityBg2    = { high: 'bg-red-500/5',        medium: 'bg-amber-500/5',      low: 'bg-[#1e242d]'    }
const severityDot    = { high: 'bg-red-500',           medium: 'bg-amber-500',        low: 'bg-[#7a8fa6]'   }
const severityEmoji  = { high: '🔴',                   medium: '🟡',                  low: '🟢'             }

function suitabilityStyle(v: string) {
  if (v === 'suitable')             return 'bg-emerald-500/10 text-emerald-400'
  if (v === 'consume_with_caution') return 'bg-amber-500/10 text-amber-400'
  return 'bg-red-500/10 text-red-400'
}
function suitabilityIcon(v: string) {
  if (v === 'suitable')             return '✓'
  if (v === 'consume_with_caution') return '⚠'
  return '✗'
}

interface AnalysisCardProps {
  analysis: Analysis
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'alternatives'>('overview')

  const harmfulCount = analysis.harmful_ingredients?.filter(h => h.found_in_product !== false).length || 0
  const highSevCount = analysis.harmful_ingredients?.filter(h => h.severity === 'high' && h.found_in_product !== false).length || 0

  return (
    <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl overflow-hidden mb-4">

      {/* Header */}
      <div className={`p-5 border-b border-[#2a3545] ${ratingBg[analysis.health_rating]} border`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] font-medium text-emerald-400 tracking-wide">Gemini AI Analysis</p>
            </div>
            <p className="text-sm text-[#f0f4f8] leading-relaxed">{analysis.summary}</p>
            {analysis.confidence && analysis.confidence !== 'high' && (
              <div className={`mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                analysis.confidence === 'medium'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                ⚠ {analysis.confidence === 'medium' ? 'Some fields unreadable' : 'Low confidence — verify manually'}
              </div>
            )}
            {analysis.personalized && (
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] text-emerald-400 font-medium">
                ✨ Personalised for your profile
              </span>
            )}
          </div>
          <div className="flex-shrink-0">
            <HealthScoreRing score={Number(analysis.health_score) || 0} rating={analysis.health_rating} />
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      {analysis.health_score_breakdown && (
        <div className="px-5 py-4 border-b border-[#2a3545]">
          <p className="text-xs font-semibold text-[#f0f4f8] mb-3">Score Breakdown</p>
          <div className="space-y-2.5">
            <ScoreBar label="Nutrition Quality" score={analysis.health_score_breakdown.nutrition_score}         colorClass="text-emerald-400" />
            <ScoreBar label="Ingredient Safety" score={analysis.health_score_breakdown.ingredient_safety_score} colorClass={scoreColorClass(analysis.health_score_breakdown.ingredient_safety_score)} />
            <ScoreBar label="Processing Level"  score={analysis.health_score_breakdown.processing_score}        colorClass="text-sky-400" />
          </div>
        </div>
      )}

      {/* Harmful banner */}
      {harmfulCount > 0 && (
        <div className={`px-5 py-3 border-b border-[#2a3545] ${highSevCount > 0 ? 'bg-red-500/5' : 'bg-amber-500/5'}`}>
          <div className="flex items-center gap-2">
            <span>{highSevCount > 0 ? '🚨' : '⚠️'}</span>
            <div>
              <p className={`text-xs font-semibold ${highSevCount > 0 ? 'text-red-400' : 'text-amber-400'}`}>
                {harmfulCount} harmful ingredient{harmfulCount > 1 ? 's' : ''} detected
                {highSevCount > 0 ? ` · ${highSevCount} high severity` : ''}
              </p>
              <p className="text-[11px] text-[#7a8fa6]">Tap &quot;Ingredients&quot; tab for detailed analysis</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#2a3545]">
        {[
          { key: 'overview',     label: 'Overview'     },
          { key: 'ingredients',  label: `Ingredients${harmfulCount > 0 ? ` (${harmfulCount})` : ''}` },
          { key: 'alternatives', label: 'Alternatives'  },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 py-3 text-xs font-semibold transition-all border-b-2 ${
              activeTab === tab.key
                ? 'text-emerald-400 border-emerald-400 bg-emerald-500/5'
                : 'text-[#7a8fa6] border-transparent hover:text-[#f0f4f8]'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="p-5 space-y-4">
          {[analysis.diabetic_suitability, analysis.bp_suitability, analysis.child_suitability, analysis.pregnancy_suitability].some(Boolean) && (
            <div>
              <p className="text-xs font-semibold text-[#f0f4f8] mb-2">Suitability</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'diabetic_suitability',  label: '🩸 Diabetic'  },
                  { key: 'bp_suitability',        label: '💊 BP'        },
                  { key: 'child_suitability',     label: '👶 Children'  },
                  { key: 'pregnancy_suitability', label: '🤰 Pregnancy' },
                ].map(item => {
                  const val = analysis[item.key as keyof Analysis] as string | undefined
                  if (!val) return null
                  return (
                    <span key={item.key} className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${suitabilityStyle(val)}`}>
                      {item.label} {suitabilityIcon(val)}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {analysis.safe_consumption && (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
              <p className="text-xs font-semibold text-[#f0f4f8] mb-3">✅ Safe Consumption</p>
              <div className="space-y-1.5">
                {analysis.safe_consumption.amount && (
                  <p className="text-xs text-[#f0f4f8]"><span className="text-[#7a8fa6]">Amount:</span> {analysis.safe_consumption.amount}</p>
                )}
                {analysis.safe_consumption.frequency && (
                  <p className="text-xs text-[#f0f4f8]"><span className="text-[#7a8fa6]">Frequency:</span> {analysis.safe_consumption.frequency}</p>
                )}
                {analysis.safe_consumption.notes && (
                  <p className="text-[11px] text-[#7a8fa6] pt-2 border-t border-[#2a3545]">💡 {analysis.safe_consumption.notes}</p>
                )}
                {analysis.safe_consumption.personalized_for_user && (
                  <div className="pt-2 border-t border-[#2a3545]">
                    <span className="inline-block px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] rounded-full mb-1">✨ Your personalised limit</span>
                    <p className="text-xs text-emerald-400">{analysis.safe_consumption.personalized_for_user}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {analysis.positives && analysis.positives.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#f0f4f8] mb-2">👍 What is good</p>
              <div className="space-y-1.5">
                {analysis.positives.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2 bg-emerald-500/5 rounded-xl">
                    <span className="text-emerald-400 flex-shrink-0 text-xs mt-0.5">•</span>
                    <p className="text-xs text-[#f0f4f8]">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.long_term_risks && analysis.long_term_risks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#f0f4f8] mb-2">⏳ Long-Term Risks</p>
              <div className="space-y-1.5">
                {analysis.long_term_risks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <span className="text-red-400 flex-shrink-0 text-xs mt-0.5">⚠</span>
                    <p className="text-xs text-[#f0f4f8]">{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.detailed_breakdown && (
            <div>
              <p className="text-xs font-semibold text-[#f0f4f8] mb-2">Detailed Breakdown</p>
              <div className="space-y-0">
                {(['calories', 'protein', 'sugar', 'sodium', 'fat', 'fiber'] as const).map(key => {
                  const val = analysis.detailed_breakdown![key]
                  if (!val) return null
                  const lower  = val.toLowerCase()
                  const isGood = lower.startsWith('good') || lower.startsWith('low')
                  const isBad  = lower.startsWith('high') || lower.startsWith('very high')
                  return (
                    <div key={key} className="flex items-start gap-3 py-2 border-b border-[#2a3545] last:border-0">
                      <span className="text-[11px] w-14 font-semibold text-[#7a8fa6] capitalize flex-shrink-0">{key}</span>
                      <span className={`text-[11px] ${isGood ? 'text-emerald-400' : isBad ? 'text-red-400' : 'text-[#f0f4f8]'}`}>{val}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {analysis.fssai_compliance && analysis.fssai_compliance !== 'unknown' && (
            <div className={`px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
              analysis.fssai_compliance === 'compliant'
                ? 'bg-emerald-500/5 border border-emerald-500/15 text-emerald-400'
                : 'bg-amber-500/5 border border-amber-500/15 text-amber-400'
            }`}>
              🛡️ FSSAI:{' '}
              {analysis.fssai_compliance === 'compliant'
                ? 'No compliance concerns detected'
                : 'Possible FSSAI compliance concern'}
            </div>
          )}

          <p className="text-[11px] text-[#7a8fa6]">
            Analysed by Gemini AI · {new Date(analysis.analyzed_at).toLocaleDateString()}
            {analysis.personalized && ' · Personalised'}
          </p>
        </div>
      )}

      {/* ── INGREDIENTS ── */}
      {activeTab === 'ingredients' && (
        <div className="p-5 space-y-4">
          {harmfulCount > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-semibold text-[#f0f4f8]">🚨 Harmful Ingredients Found</p>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-red-500">{harmfulCount}</span>
              </div>
              <div className="space-y-3">
                {(analysis.harmful_ingredients || [])
                  .filter(h => h.found_in_product !== false)
                  .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]))
                  .map((h, i) => (
                    <div key={i} className={`rounded-2xl overflow-hidden border ${severityBorder[h.severity]}`}>
                      <div className={`px-4 py-3 flex items-center justify-between ${severityBg2[h.severity]}`}>
                        <div className="flex items-center gap-2">
                          <span>{severityEmoji[h.severity]}</span>
                          <div>
                            <p className="text-sm font-bold text-[#f0f4f8]">{h.name}</p>
                            {h.also_known_as && h.also_known_as.length > 0 && (
                              <p className="text-[11px] text-[#7a8fa6]">Also: {h.also_known_as.slice(0, 2).join(', ')}</p>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize text-white ${severityDot[h.severity]}`}>
                          {h.severity} risk
                        </span>
                      </div>
                      <div className="px-4 py-3 border-b border-[#2a3545]">
                        <p className="text-xs text-[#f0f4f8] leading-relaxed">{h.concern}</p>
                      </div>
                      {h.amount_in_this_product && (
                        <div className="px-4 py-2 border-b border-[#2a3545] bg-[#1e242d]">
                          <p className="text-[11px] text-[#7a8fa6]">
                            📊 <span className="font-semibold text-[#f0f4f8]">{h.amount_in_this_product}</span>
                            {h.percentage_of_daily_limit && ` · ${h.percentage_of_daily_limit}`}
                          </p>
                        </div>
                      )}
                      <div className="px-4 py-3 border-b border-[#2a3545]">
                        {h.global_safe_limit && (
                          <div className="mb-2">
                            <p className="text-[11px] font-semibold text-[#7a8fa6] mb-0.5">🌍 Global Safe Limit</p>
                            <p className="text-xs text-[#f0f4f8]">{h.global_safe_limit}</p>
                          </div>
                        )}
                        {h.personalized_safe_limit && (
                          <div className="pt-2 border-t border-[#2a3545]">
                            <p className="text-[11px] font-semibold text-emerald-400 mb-0.5">✨ Your personalised limit</p>
                            <p className="text-xs text-[#f0f4f8]">{h.personalized_safe_limit}</p>
                          </div>
                        )}
                      </div>
                      {h.scientific_source && (
                        <div className="px-4 py-3 bg-sky-500/5">
                          <p className="text-[11px] text-[#7a8fa6] mb-1">📚 Scientific Source</p>
                          <p className="text-xs font-semibold text-[#f0f4f8] mb-1">{h.scientific_source}</p>
                          {h.source_url && (
                            <a href={h.source_url} target="_blank" rel="noopener noreferrer"
                              className="text-[11px] text-sky-400 underline break-all">{h.source_url}</a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-sm font-semibold text-emerald-400 mb-1">No harmful ingredients detected</p>
              <p className="text-xs text-[#7a8fa6]">This product does not contain any of the 20+ harmful substances we screen for</p>
            </div>
          )}

          {analysis.ingredient_warnings && analysis.ingredient_warnings.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#f0f4f8] mb-2">⚠️ Other Ingredient Notes</p>
              <div className="space-y-2">
                {analysis.ingredient_warnings.map((w, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-xl border-l-4 ${severityBg2[w.severity]}`}
                    style={{ borderColor: { high: '#ef4444', medium: '#f59e0b', low: '#7a8fa6' }[w.severity] }}>
                    <span className="text-sm flex-shrink-0">{severityEmoji[w.severity]}</span>
                    <div>
                      <p className="text-xs font-semibold text-[#f0f4f8]">{w.ingredient}</p>
                      <p className="text-[11px] text-[#7a8fa6]">{w.concern}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-[#1e242d] border border-[#2a3545] rounded-xl text-[11px] text-[#7a8fa6] leading-relaxed">
            ℹ️ Analysis based on WHO, FSSAI, ICMR and EFSA guidelines. Consult a healthcare professional for medical advice.
          </div>
        </div>
      )}

      {/* ── ALTERNATIVES ── */}
      {activeTab === 'alternatives' && (
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#f0f4f8] mb-1">🥗 Healthier Alternatives</p>
            <p className="text-[11px] text-[#7a8fa6] mb-3">Specific Indian alternatives that are better for your health</p>
            {analysis.healthier_alternatives && analysis.healthier_alternatives.length > 0 ? (
              <div className="space-y-3">
                {analysis.healthier_alternatives.map((alt, i) => {
                  const typeIcon:  Record<string, string> = { branded: '🏷️', homemade: '🏠', whole_food: '🌾' }
                  const typeLabel: Record<string, string> = { branded: 'Brand', homemade: 'Homemade', whole_food: 'Whole food' }
                  return (
                    <div key={i} className="p-4 bg-[#1e242d] border border-[#2a3545] rounded-2xl hover:border-emerald-500/20 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-base flex-shrink-0">
                            {alt.type ? (typeIcon[alt.type] || '✅') : '✅'}
                          </div>
                          <p className="text-sm font-semibold text-[#f0f4f8]">{alt.name}</p>
                        </div>
                        {alt.type && (
                          <span className="px-2 py-0.5 bg-[#252c38] border border-[#2a3545] text-[#7a8fa6] text-[11px] rounded-full flex-shrink-0">
                            {typeLabel[alt.type] || alt.type}
                          </span>
                        )}
                      </div>
                      {alt.reason && <p className="text-[11px] text-[#7a8fa6] leading-relaxed ml-10">{alt.reason}</p>}
                      {alt.availability && (
                        <p className="text-[11px] text-emerald-400 ml-10 mt-1">📍 {alt.availability.replace(/_/g, ' ')}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-[#7a8fa6] text-sm">No alternatives available for this product</div>
            )}
          </div>
          {analysis.health_rating !== 'healthy' && (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl">
              <p className="text-xs font-semibold text-emerald-400 mb-1">💚 Why switch?</p>
              <p className="text-[11px] text-[#7a8fa6] leading-relaxed">
                Switching to healthier alternatives even 2–3 times a week can significantly reduce your
                intake of harmful additives and improve your overall nutrition. Small changes add up.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}