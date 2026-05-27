"use client"
import type { Analysis } from '@/types/scanResult'

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  if (!children) return null
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

function severityStyle(s: string) {
  if (s === 'high')   return { dot: 'bg-red-500',    text: 'text-red-400',    badge: 'bg-red-500/10 text-red-400' }
  if (s === 'medium') return { dot: 'bg-amber-500',  text: 'text-amber-400',  badge: 'bg-amber-500/10 text-amber-400' }
  return                     { dot: 'bg-slate-500',  text: 'text-slate-400',  badge: 'bg-slate-500/10 text-slate-400' }
}

interface OverviewTabProps {
  analysis: Analysis
}

export default function OverviewTab({ analysis }: OverviewTabProps) {
  const {
    summary,
    confidence,
    personalizedWarnings,
    ai_ingredients,
    recommendations,
    concerns,
    long_term_risks,
    safe_consumption,
    positives,
    fssai_compliance,
    detailed_breakdown,
  } = analysis

  const hasDeepAnalysis = (personalizedWarnings?.length ?? 0) > 0 || (ai_ingredients?.length ?? 0) > 0 || (recommendations?.length ?? 0) > 0
  const hasLongTermRisks = (long_term_risks?.length ?? 0) > 0
  const hasPositives = (positives?.length ?? 0) > 0
  const hasConcerns = (concerns?.length ?? 0) > 0

  return (
    <div className="space-y-4">
      <Section title="AI Summary" icon="🤖">
        <p className="text-sm text-[#f0f4f8] leading-relaxed">{summary}</p>
        {confidence && confidence !== 'high' && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-[11px] text-amber-400">
              ⚠ {confidence === 'medium' ? 'Some fields were unreadable — verify manually' : 'Low confidence result'}
            </p>
          </div>
        )}
      </Section>

      {hasDeepAnalysis && (
        <Section title="AI Deep Analysis" icon="🧠">
          <div className="space-y-4">
            {(personalizedWarnings?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs font-bold text-amber-400 mb-2">⚠️ Personalized For You</p>
                <div className="space-y-2">
                  {personalizedWarnings!.map((warn, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-amber-500/10 rounded-lg">
                      <span className="text-amber-400">→</span>
                      <span className="text-xs text-[#f0f4f8]">{warn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(positives?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs font-bold text-emerald-400 mb-2">✅ Positives</p>
                <div className="space-y-1">
                  {positives!.slice(0, 3).map((pos, i) => (
                    <p key={i} className="text-xs text-emerald-300">• {pos}</p>
                  ))}
                </div>
              </div>
            )}

            {(ai_ingredients?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs font-bold text-[#7a8fa6] mb-2">🔬 Ingredient Breakdown</p>
                <div className="flex flex-wrap gap-2">
                  {ai_ingredients!.slice(0, 8).map((ing, i) => (
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

            {(recommendations?.length ?? 0) > 0 && (
              <div className="pt-2 border-t border-[#2a3545]">
                <p className="text-xs font-bold text-sky-400 mb-2">💡 Recommendations</p>
                <div className="space-y-1">
                  {recommendations!.slice(0, 2).map((rec, i) => (
                    <p key={i} className="text-xs text-[#7a8fa6]">• {rec}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {hasLongTermRisks && (
        <Section title="Long-Term Risks" icon="⏳">
          <div className="space-y-2">
            {long_term_risks!.map((risk, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                <span className="text-red-400 flex-shrink-0 text-sm mt-0.5">⚠</span>
                <p className="text-sm text-[#f0f4f8]">{risk}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {hasConcerns && (
        <Section title="Concerns" icon="⚡">
          <div className="space-y-2">
            {concerns!.map((c, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-amber-500/10 rounded-lg">
                <span className="text-amber-400">•</span>
                <span className="text-sm text-[#f0f4f8]">{c}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {safe_consumption && (
        <Section title="Safe Consumption" icon="✅">
          <div className="space-y-2">
            {safe_consumption.amount && (
              <div className="flex items-start gap-3">
                <span className="text-[11px] font-bold text-[#7a8fa6] w-20 flex-shrink-0 pt-0.5">Amount</span>
                <span className="text-sm text-[#f0f4f8]">{safe_consumption.amount}</span>
              </div>
            )}
            {safe_consumption.frequency && (
              <div className="flex items-start gap-3">
                <span className="text-[11px] font-bold text-[#7a8fa6] w-20 flex-shrink-0 pt-0.5">Frequency</span>
                <span className="text-sm text-[#f0f4f8]">{safe_consumption.frequency}</span>
              </div>
            )}
            {safe_consumption.notes && (
              <div className="pt-2 mt-2 border-t border-[#2a3545]">
                <p className="text-[11px] text-[#7a8fa6] leading-relaxed">💡 {safe_consumption.notes}</p>
              </div>
            )}
            {safe_consumption.personalized_for_user && (
              <div className="pt-2 mt-2 border-t border-[#2a3545] bg-emerald-500/5 rounded-xl p-3">
                <p className="text-[11px] text-emerald-400 font-bold mb-1">✨ Personalised for you</p>
                <p className="text-xs text-[#f0f4f8]">{safe_consumption.personalized_for_user}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {hasPositives && (
        <Section title="What's Good" icon="👍">
          <div className="space-y-2">
            {positives!.map((p, i) => (
              <div key={i} className="flex items-start gap-2.5 py-2 border-b border-[#2a3545] last:border-0">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">•</span>
                <p className="text-sm text-[#f0f4f8]">{p}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {detailed_breakdown && (
        <Section title="Nutrition Breakdown" icon="📊">
          <div className="space-y-0">
            {(['calories', 'protein', 'sugar', 'sodium', 'fat', 'fiber'] as const).map(key => {
              const val = detailed_breakdown[key]
              if (!val) return null
              const lower = val.toLowerCase()
              const isGood = lower.startsWith('good') || lower.startsWith('low')
              const isBad = lower.startsWith('high') || lower.startsWith('very high')
              return (
                <div key={key} className="flex items-start gap-3 py-2 border-b border-[#2a3545] last:border-0">
                  <span className="text-[11px] w-14 font-semibold text-[#7a8fa6] capitalize flex-shrink-0">{key}</span>
                  <span className={`text-[11px] ${isGood ? 'text-emerald-400' : isBad ? 'text-red-400' : 'text-[#f0f4f8]'}`}>{val}</span>
                </div>
              )
            })}
            {detailed_breakdown.processing_level && (
              <div className="flex items-start gap-3 py-2 border-b border-[#2a3545] last:border-0">
                <span className="text-[11px] w-14 font-semibold text-[#7a8fa6] capitalize flex-shrink-0">Processing</span>
                <span className={`text-[11px] ${
                  detailed_breakdown.processing_level === 'minimally_processed' ? 'text-emerald-400' :
                  detailed_breakdown.processing_level === 'moderately_processed' ? 'text-amber-400' :
                  'text-red-400'
                }`}>
                  {detailed_breakdown.processing_level.replace(/_/g, ' ')}
                </span>
              </div>
            )}
          </div>
        </Section>
      )}

      {fssai_compliance && fssai_compliance !== 'unknown' && (
        <div className={`px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium border ${
          fssai_compliance === 'compliant'
            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
            : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
        }`}>
          <span className="text-xl">🛡️</span>
          <div>
            <p className="font-bold">FSSAI Compliance</p>
            <p className="text-[11px] opacity-80">
              {fssai_compliance === 'compliant'
                ? 'No compliance concerns detected'
                : 'Possible FSSAI compliance concern — verify label'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
