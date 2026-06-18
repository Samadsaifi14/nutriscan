"use client"
import { useState } from 'react'
import { Analysis } from '@/types/scanResult'
import { HealthScoreRing, ScoreBar, scoreColorClass, ratingEmoji } from './HealthScoreRing'

const severityStyles = {
  high:   { dot: 'bg-risk',            text: 'text-risk',            badge: 'bg-risk/10 text-risk' },
  medium: { dot: 'bg-clay',            text: 'text-clay',            badge: 'bg-clay/10 text-clay' },
  low:    { dot: 'bg-muted-2',         text: 'text-muted-2',         badge: 'bg-muted-2/10 text-muted-2' },
}

function suitabilityStyle(v: string) {
  if (v === 'suitable')             return 'bg-moss/10 text-moss'
  if (v === 'consume_with_caution') return 'bg-clay/10 text-clay'
  return 'bg-risk/10 text-risk'
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
    <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
      <div className="p-5 border-b" style={{ borderColor: 'var(--card-border)', background: analysis.health_rating === 'healthy' ? 'rgba(61,92,46,0.03)' : analysis.health_rating === 'moderate' ? 'rgba(196,113,74,0.03)' : 'rgba(180,60,40,0.03)' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--moss)' }} />
              <p className="text-[11px] font-medium tracking-wide" style={{ color: 'var(--moss)' }}>AI Analysis</p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>{analysis.summary}</p>
            {analysis.confidence && analysis.confidence !== 'high' && (
              <div className={`mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                analysis.confidence === 'medium' ? 'bg-clay/10 border-clay/20 text-clay' : 'bg-risk/10 border-risk/20 text-risk'
              }`}>
                ⚠ {analysis.confidence === 'medium' ? 'Some fields unreadable' : 'Low confidence — verify manually'}
              </div>
            )}
            {analysis.personalized && (
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium" style={{ background: 'rgba(61,92,46,0.08)', border: '1px solid rgba(61,92,46,0.15)', color: 'var(--moss)' }}>
                ✨ Personalised for your profile
              </span>
            )}
          </div>
          <div className="flex-shrink-0">
            <HealthScoreRing score={Number(analysis.health_score) || 0} rating={analysis.health_rating} />
          </div>
        </div>
      </div>

      {analysis.health_score_breakdown && (
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Score Breakdown</p>
          <div className="space-y-2.5">
            <ScoreBar label="Nutrition Quality" score={analysis.health_score_breakdown.nutrition_score} />
            <ScoreBar label="Ingredient Safety" score={analysis.health_score_breakdown.ingredient_safety_score} />
            <ScoreBar label="Processing Level"  score={analysis.health_score_breakdown.processing_score} />
          </div>
        </div>
      )}

      {harmfulCount > 0 && (
        <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--card-border)', background: highSevCount > 0 ? 'rgba(180,60,40,0.03)' : 'rgba(196,113,74,0.03)' }}>
          <div className="flex items-center gap-2">
            <span>{highSevCount > 0 ? '🚨' : '⚠️'}</span>
            <div>
              <p className={`text-xs font-semibold ${highSevCount > 0 ? 'text-risk' : 'text-clay'}`}>
                {harmfulCount} harmful ingredient{harmfulCount > 1 ? 's' : ''} detected
                {highSevCount > 0 ? ` · ${highSevCount} high severity` : ''}
              </p>
              <p className="text-[11px]" style={{ color: 'var(--muted-2)' }}>Tap &quot;Ingredients&quot; tab for detailed analysis</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex border-b" style={{ borderColor: 'var(--card-border)' }}>
        {[
          { key: 'overview',     label: 'Overview'     },
          { key: 'ingredients',  label: `Ingredients${harmfulCount > 0 ? ` (${harmfulCount})` : ''}` },
          { key: 'alternatives', label: 'Alternatives'  },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className="flex-1 py-3 text-xs font-semibold transition-all border-b-2"
            style={{
              color: activeTab === tab.key ? 'var(--clay)' : 'var(--muted-2)',
              borderColor: activeTab === tab.key ? 'var(--clay)' : 'transparent',
              background: activeTab === tab.key ? 'rgba(196,113,74,0.04)' : 'transparent',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="p-5 space-y-4">
          {[analysis.diabetic_suitability, analysis.bp_suitability, analysis.child_suitability, analysis.pregnancy_suitability].some(Boolean) && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Suitability</p>
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
            <div className="p-4 rounded-xl" style={{ background: 'rgba(61,92,46,0.04)', border: '1px solid rgba(61,92,46,0.1)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--foreground)' }}>✅ Safe Consumption</p>
              <div className="space-y-1.5">
                {analysis.safe_consumption.amount && (
                  <p className="text-xs" style={{ color: 'var(--foreground)' }}><span style={{ color: 'var(--muted-2)' }}>Amount:</span> {analysis.safe_consumption.amount}</p>
                )}
                {analysis.safe_consumption.frequency && (
                  <p className="text-xs" style={{ color: 'var(--foreground)' }}><span style={{ color: 'var(--muted-2)' }}>Frequency:</span> {analysis.safe_consumption.frequency}</p>
                )}
                {analysis.safe_consumption.notes && (
                  <p className="text-[11px] pt-2 border-t" style={{ color: 'var(--muted-2)', borderColor: 'var(--card-border)' }}>💡 {analysis.safe_consumption.notes}</p>
                )}
                {analysis.safe_consumption.personalized_for_user && (
                  <div className="pt-2 border-t" style={{ borderColor: 'var(--card-border)' }}>
                    <span className="inline-block px-2 py-0.5 text-[11px] rounded-full mb-1" style={{ background: 'rgba(61,92,46,0.08)', border: '1px solid rgba(61,92,46,0.15)', color: 'var(--moss)' }}>✨ Your personalised limit</span>
                    <p className="text-xs" style={{ color: 'var(--moss)' }}>{analysis.safe_consumption.personalized_for_user}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {analysis.positives && analysis.positives.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>👍 What is good</p>
              <div className="space-y-1.5">
                {analysis.positives.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(61,92,46,0.04)' }}>
                    <span className="flex-shrink-0 text-xs mt-0.5" style={{ color: 'var(--moss)' }}>•</span>
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.long_term_risks && analysis.long_term_risks.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>⏳ Long-Term Risks</p>
              <div className="space-y-1.5">
                {analysis.long_term_risks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(180,60,40,0.04)', border: '1px solid rgba(180,60,40,0.08)' }}>
                    <span className="flex-shrink-0 text-xs mt-0.5" style={{ color: 'var(--risk-red)' }}>⚠</span>
                    <p className="text-xs" style={{ color: 'var(--foreground)' }}>{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.detailed_breakdown && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Detailed Breakdown</p>
              <div className="space-y-0">
                {(['calories', 'protein', 'sugar', 'sodium', 'fat', 'fiber'] as const).map(key => {
                  const val = analysis.detailed_breakdown![key]
                  if (!val) return null
                  const lower  = val.toLowerCase()
                  const isGood = lower.startsWith('good') || lower.startsWith('low')
                  const isBad  = lower.startsWith('high') || lower.startsWith('very high')
                  return (
                    <div key={key} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--card-border)' }}>
                      <span className="text-[11px] w-14 font-semibold capitalize flex-shrink-0" style={{ color: 'var(--muted-2)' }}>{key}</span>
                      <span className="text-xs" style={{ color: isGood ? 'var(--moss)' : isBad ? 'var(--risk-red)' : 'var(--foreground)' }}>{val}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {analysis.fssai_compliance && analysis.fssai_compliance !== 'unknown' && (
            <div className="px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-medium" style={{
              background: analysis.fssai_compliance === 'compliant' ? 'rgba(61,92,46,0.04)' : 'rgba(196,113,74,0.04)',
              border: `1px solid ${analysis.fssai_compliance === 'compliant' ? 'rgba(61,92,46,0.1)' : 'rgba(196,113,74,0.1)'}`,
              color: analysis.fssai_compliance === 'compliant' ? 'var(--moss)' : 'var(--clay)',
            }}>
              🛡️ FSSAI:{' '}
              {analysis.fssai_compliance === 'compliant'
                ? 'No compliance concerns detected'
                : 'Possible FSSAI compliance concern'}
            </div>
          )}

          <p className="text-[11px]" style={{ color: 'var(--muted-2)' }}>
            Analysed by AI · {new Date(analysis.analyzed_at).toLocaleDateString()}
            {analysis.personalized && ' · Personalised'}
          </p>
        </div>
      )}

      {activeTab === 'ingredients' && (
        <div className="p-5 space-y-4">
          {harmfulCount > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>🚨 Harmful Ingredients Found</p>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white" style={{ background: 'var(--risk-red)' }}>{harmfulCount}</span>
              </div>
              <div className="space-y-3">
                {(analysis.harmful_ingredients || [])
                  .filter(h => h.found_in_product !== false)
                  .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]))
                  .map((h, i) => {
                    const sty = severityStyles[h.severity as keyof typeof severityStyles] || severityStyles.low
                    return (
                      <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid var(--card-border)` }}>
                        <div className="px-4 py-3 flex items-center justify-between" style={{ background: h.severity === 'high' ? 'rgba(180,60,40,0.04)' : h.severity === 'medium' ? 'rgba(196,113,74,0.04)' : 'color-mix(in oklab, var(--card), black 4%)' }}>
                          <div className="flex items-center gap-2">
                            <span>{h.severity === 'high' ? '🔴' : h.severity === 'medium' ? '🟡' : '🟢'}</span>
                            <div>
                              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{h.name}</p>
                              {h.also_known_as && h.also_known_as.length > 0 && (
                                <p className="text-[11px]" style={{ color: 'var(--muted-2)' }}>Also: {h.also_known_as.slice(0, 2).join(', ')}</p>
                              )}
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize text-white ${sty.dot}`}>
                            {h.severity} risk
                          </span>
                        </div>
                        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)' }}>{h.concern}</p>
                        </div>
                        {h.amount_in_this_product && (
                          <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--card-border)', background: 'color-mix(in oklab, var(--card), black 4%)' }}>
                            <p className="text-[11px]" style={{ color: 'var(--muted-2)' }}>
                              📊 <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{h.amount_in_this_product}</span>
                              {h.percentage_of_daily_limit && ` · ${h.percentage_of_daily_limit}`}
                            </p>
                          </div>
                        )}
                        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
                          {h.global_safe_limit && (
                            <div className="mb-2">
                              <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--muted-2)' }}>🌍 Global Safe Limit</p>
                              <p className="text-xs" style={{ color: 'var(--foreground)' }}>{h.global_safe_limit}</p>
                            </div>
                          )}
                          {h.personalized_safe_limit && (
                            <div className="pt-2 border-t" style={{ borderColor: 'var(--card-border)' }}>
                              <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--moss)' }}>✨ Your personalised limit</p>
                              <p className="text-xs" style={{ color: 'var(--foreground)' }}>{h.personalized_safe_limit}</p>
                            </div>
                          )}
                        </div>
                        {h.scientific_source && (
                          <div className="px-4 py-3" style={{ background: 'rgba(61,92,46,0.03)' }}>
                            <p className="text-[11px] mb-1" style={{ color: 'var(--muted-2)' }}>📚 Scientific Source</p>
                            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{h.scientific_source}</p>
                            {h.source_url && (
                              <a href={h.source_url} target="_blank" rel="noopener noreferrer"
                                className="text-[11px] underline break-all" style={{ color: 'var(--moss)' }}>{h.source_url}</a>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--moss)' }}>✅ No harmful ingredients detected</p>
              <p className="text-xs" style={{ color: 'var(--muted-2)' }}>This product does not contain any of the 20+ harmful substances we screen for</p>
            </div>
          )}

          {analysis.ingredient_warnings && analysis.ingredient_warnings.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--foreground)' }}>⚠️ Other Ingredient Notes</p>
              <div className="space-y-2">
                {analysis.ingredient_warnings.map((w, i) => {
                  const sty = severityStyles[w.severity as keyof typeof severityStyles] || severityStyles.low
                  return (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl border-l-4"
                      style={{
                        borderLeftColor: w.severity === 'high' ? 'var(--risk-red)' : w.severity === 'medium' ? 'var(--clay)' : 'var(--muted-2)',
                        background: 'color-mix(in oklab, var(--card), black 4%)',
                      }}>
                      <span className="text-sm flex-shrink-0">{w.severity === 'high' ? '🔴' : w.severity === 'medium' ? '🟡' : '🟢'}</span>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{w.ingredient}</p>
                        <p className="text-[11px]" style={{ color: 'var(--muted-2)' }}>{w.concern}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl text-[11px] leading-relaxed" style={{ background: 'color-mix(in oklab, var(--card), black 4%)', border: '1px solid var(--card-border)' }}>
            ℹ️ Analysis based on WHO, FSSAI, ICMR and EFSA guidelines. Consult a healthcare professional for medical advice.
          </div>
        </div>
      )}

      {activeTab === 'alternatives' && (
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--foreground)' }}>🥗 Healthier Alternatives</p>
            <p className="text-[11px] mb-3" style={{ color: 'var(--muted-2)' }}>Specific Indian alternatives that are better for your health</p>
            {analysis.healthier_alternatives && analysis.healthier_alternatives.length > 0 ? (
              <div className="space-y-3">
                {analysis.healthier_alternatives.map((alt, i) => {
                  const typeIcon: Record<string, string> = { branded: '🏷️', homemade: '🏠', whole_food: '🌾' }
                  const typeLabel: Record<string, string> = { branded: 'Brand', homemade: 'Homemade', whole_food: 'Whole food' }
                  return (
                    <div key={i} className="p-4 rounded-2xl transition-colors" style={{ background: 'color-mix(in oklab, var(--card), black 4%)', border: '1px solid var(--card-border)' }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: 'rgba(61,92,46,0.08)' }}>
                            {alt.type ? (typeIcon[alt.type] || '✅') : '✅'}
                          </div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{alt.name}</p>
                        </div>
                        {alt.type && (
                          <span className="px-2 py-0.5 text-[11px] rounded-full flex-shrink-0" style={{ background: 'color-mix(in oklab, var(--card), black 10%)', border: '1px solid var(--card-border)', color: 'var(--muted-2)' }}>
                            {typeLabel[alt.type] || alt.type}
                          </span>
                        )}
                      </div>
                      {alt.reason && <p className="text-[11px] leading-relaxed ml-10" style={{ color: 'var(--muted-2)' }}>{alt.reason}</p>}
                      {alt.availability && (
                        <p className="text-[11px] mt-1 ml-10" style={{ color: 'var(--moss)' }}>📍 {alt.availability.replace(/_/g, ' ')}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-sm" style={{ color: 'var(--muted-2)' }}>No alternatives available for this product</div>
            )}
          </div>
          {analysis.health_rating !== 'healthy' && (
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(61,92,46,0.04)', border: '1px solid rgba(61,92,46,0.1)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--moss)' }}>💚 Why switch?</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--muted-2)' }}>
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
