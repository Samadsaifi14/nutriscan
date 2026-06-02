"use client"
import type { Analysis } from '@/types/scanResult'

function Panel({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
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

function isArr(a: unknown): a is unknown[] { return Array.isArray(a) && a.length > 0 }

interface Props { analysis?: Analysis | null }

export default function OverviewTab({ analysis }: Props) {
  const s = analysis || {} as Analysis

  return (
    <div className="space-y-4">
      <Panel title="AI Summary" icon="🤖">
        {(s as any).summary ? (
          <p className="text-sm text-[#f0f4f8] leading-relaxed">{(s as any).summary}</p>
        ) : (
          <div className="space-y-2">
            <div className="h-3 bg-[#1e242d] rounded animate-pulse w-full" />
            <div className="h-3 bg-[#1e242d] rounded animate-pulse w-11/12" />
            <div className="h-3 bg-[#1e242d] rounded animate-pulse w-3/4" />
          </div>
        )}
        {(s as any).recommendation && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wide mb-1">Verdict</p>
            <p className="text-sm text-[#f0f4f8]">{(s as any).recommendation}</p>
          </div>
        )}
        {(s as any).confidence && (s as any).confidence !== 'high' && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-[11px] text-amber-400">
              ⚠ {(s as any).confidence === 'medium' ? 'Some fields were unreadable — verify manually' : 'Low confidence result'}
            </p>
          </div>
        )}
      </Panel>

      {analysis?.health_score !== undefined && (
        <Panel title="Health Score Breakdown" icon="📊">
          <div className="space-y-2">
            {analysis.health_score_breakdown ? (
              <>
                <MiniStat label="Nutrition" score={analysis.health_score_breakdown.nutrition_score} />
                <MiniStat label="Ingredients" score={analysis.health_score_breakdown.ingredient_safety_score} />
                <MiniStat label="Processing" score={analysis.health_score_breakdown.processing_score} />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-black ${
                  analysis.health_score >= 7.5 ? 'text-emerald-400' :
                  analysis.health_score >= 5.5 ? 'text-amber-400' :
                  analysis.health_score >= 3.5 ? 'text-orange-400' : 'text-red-400'
                }`}>{analysis.health_score}</span>
                <span className="text-sm text-[#7a8fa6]">/ 10 &mdash; {
                  analysis.health_score >= 7.5 ? 'Healthy' :
                  analysis.health_score >= 5.5 ? 'Moderate' :
                  analysis.health_score >= 3.5 ? 'Caution' : 'Unhealthy'
                }</span>
              </div>
            )}
          </div>
        </Panel>
      )}

      {isArr((s as any).personalizedWarnings) && (
        <Panel title="Personalized For You" icon="⚠️">
          <div className="space-y-2">
            {(s as any).personalizedWarnings.map((w: string, i: number) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-amber-500/10 rounded-lg">
                <span className="text-amber-400">→</span>
                <span className="text-xs text-[#f0f4f8]">{w}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {isArr((s as any).ai_ingredients) && (
        <Panel title="Ingredient Breakdown" icon="🔬">
          <div className="flex flex-wrap gap-2">
            {(s as any).ai_ingredients.slice(0, 8).map((ing: any, i: number) => (
              <span key={i} className={`px-2 py-1 rounded-lg text-xs font-medium ${
                ing.status === 'harmful' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                ing.status === 'concern' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              }`}>
                {ing.ingredient}
              </span>
            ))}
          </div>
        </Panel>
      )}

      {isArr((s as any).long_term_risks) && (
        <Panel title="Long-Term Risks" icon="⏳">
          <div className="space-y-2">
            {(s as any).long_term_risks.map((risk: string, i: number) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                <span className="text-red-400 flex-shrink-0 text-sm mt-0.5">⚠</span>
                <p className="text-sm text-[#f0f4f8]">{risk}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {isArr((s as any).recommendations) && (
        <Panel title="Recommendations" icon="💡">
          <div className="space-y-1">
            {(s as any).recommendations.slice(0, 3).map((rec: string, i: number) => (
              <p key={i} className="text-xs text-[#7a8fa6]">• {rec}</p>
            ))}
          </div>
        </Panel>
      )}

      {isArr((s as any).concerns) && (
        <Panel title="Concerns" icon="⚡">
          <div className="space-y-2">
            {(s as any).concerns.map((c: string, i: number) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-amber-500/10 rounded-lg">
                <span className="text-amber-400">•</span>
                <span className="text-sm text-[#f0f4f8]">{c}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {isArr((s as any).positives) && (
        <Panel title="What's Good" icon="👍">
          <div className="space-y-2">
            {(s as any).positives.map((p: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5 py-2 border-b border-[#2a3545] last:border-0">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">•</span>
                <p className="text-sm text-[#f0f4f8]">{p}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {(s as any).safe_consumption && (
        <Panel title="Safe Consumption" icon="✅">
          <div className="space-y-2">
            {(s as any).safe_consumption.amount && (
              <Row label="Amount" value={(s as any).safe_consumption.amount} />
            )}
            {(s as any).safe_consumption.frequency && (
              <Row label="Frequency" value={(s as any).safe_consumption.frequency} />
            )}
            {(s as any).safe_consumption.notes && (
              <div className="pt-2 mt-2 border-t border-[#2a3545]">
                <p className="text-[11px] text-[#7a8fa6] leading-relaxed">💡 {(s as any).safe_consumption.notes}</p>
              </div>
            )}
            {(s as any).safe_consumption.personalized_for_user && (
              <div className="pt-2 mt-2 border-t border-[#2a3545] bg-emerald-500/5 rounded-xl p-3">
                <p className="text-[11px] text-emerald-400 font-bold mb-1">✨ Personalised for you</p>
                <p className="text-xs text-[#f0f4f8]">{(s as any).safe_consumption.personalized_for_user}</p>
              </div>
            )}
          </div>
        </Panel>
      )}

      {(s as any).detailed_breakdown && (
        <Panel title="Nutrition Details" icon="📊">
          <div className="space-y-0">
            {(['calories', 'protein', 'sugar', 'sodium', 'fat', 'fiber'] as const).map(key => {
              const val = (s as any).detailed_breakdown[key]
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
          </div>
        </Panel>
      )}

      {(s as any).fssai_compliance && (s as any).fssai_compliance !== 'unknown' && (
        <div className={`px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium border ${
          (s as any).fssai_compliance === 'compliant'
            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
            : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
        }`}>
          <span className="text-xl">🛡️</span>
          <div>
            <p className="font-bold">FSSAI Compliance</p>
            <p className="text-[11px] opacity-80">
              {(s as any).fssai_compliance === 'compliant'
                ? 'No compliance concerns detected'
                : 'Possible FSSAI compliance concern — verify label'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, score }: { label: string; score?: number }) {
  const sc = score ?? 0
  const color = sc >= 7.5 ? 'text-emerald-400' : sc >= 5.5 ? 'text-amber-400' : sc >= 3.5 ? 'text-orange-400' : 'text-red-400'
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11px] text-[#7a8fa6]">{label}</span>
        <span className={`text-[11px] font-bold ${color}`}>{sc}/10</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#1e2a35] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sc * 10}%`, backgroundColor: color === 'text-emerald-400' ? '#22c55e' : color === 'text-amber-400' ? '#f59e0b' : color === 'text-orange-400' ? '#fb923c' : '#ef4444' }} />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[11px] font-bold text-[#7a8fa6] w-20 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-[#f0f4f8]">{value}</span>
    </div>
  )
}
