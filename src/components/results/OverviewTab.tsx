"use client"
import type { Analysis } from '@/types/scanResult'
import { Activity, AlertTriangle, Clock, Heart, Info, Search, Shield, TrendingUp } from 'lucide-react'

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)', background: 'color-mix(in oklab, var(--card), black 4%)' }}>
        <Icon size={16} aria-hidden="true" style={{ color: 'var(--clay)' }} />
        <h2 className="text-sm font-bold" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function isArr(a: unknown): a is unknown[] { return Array.isArray(a) && a.length > 0 }

interface Props { analysis?: Analysis | null }

export default function OverviewTab({ analysis }: Props) {
  const s = analysis || {} as Analysis

  const scoreColor = (sc: number) => {
    if (sc >= 7.5) return 'var(--moss)'
    if (sc >= 5.5) return 'var(--clay)'
    if (sc >= 3.5) return 'var(--clay-light)'
    return 'var(--risk-red)'
  }

  return (
    <div className="space-y-4">
      {s.summary && (
        <Panel title="Analysis Summary" icon={Info}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>{s.summary}</p>
          {s.recommendation && (
            <div className="mt-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(61,92,46,0.08)', border: '1px solid rgba(61,92,46,0.15)' }}>
              <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--moss)' }}>Verdict</p>
              <p className="text-sm" style={{ color: 'var(--foreground)' }}>{s.recommendation}</p>
            </div>
          )}
          {s.confidence && s.confidence !== 'high' && (
            <div className="mt-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(196,113,74,0.08)', border: '1px solid rgba(196,113,74,0.15)' }}>
              <p className="text-[11px]" style={{ color: 'var(--clay)' }}>
                {s.confidence === 'medium' ? 'Some fields were unreadable — verify manually' : 'Low confidence result'}
              </p>
            </div>
          )}
        </Panel>
      )}

      {s.health_score !== undefined && (
        <Panel title="Health Score Breakdown" icon={Activity}>
          <div className="space-y-2">
            {s.health_score_breakdown ? (
              <>
                <MiniStat label="Nutrition" score={s.health_score_breakdown.nutrition_score} />
                <MiniStat label="Ingredients" score={s.health_score_breakdown.ingredient_safety_score} />
                <MiniStat label="Processing" score={s.health_score_breakdown.processing_score} />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black" style={{ color: scoreColor(s.health_score), fontFamily: 'var(--font-display)' }}>{s.health_score}</span>
                <span className="text-sm" style={{ color: 'var(--muted-2)' }}>
                  / 10 &mdash; {
                    s.health_score >= 7.5 ? 'Healthy' :
                    s.health_score >= 5.5 ? 'Moderate' :
                    s.health_score >= 3.5 ? 'Caution' : 'Unhealthy'
                  }
                </span>
              </div>
            )}
          </div>
        </Panel>
      )}

      {isArr(s.personalizedWarnings) && (
        <Panel title="Personalized For You" icon={Info}>
          <div className="space-y-2">
            {s.personalizedWarnings!.map((w: string, i: number) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(196,113,74,0.08)' }}>
                <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--clay)' }} />
                <span className="text-xs" style={{ color: 'var(--foreground)' }}>{w}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {isArr(s.ai_ingredients) && (
        <Panel title="Ingredient Breakdown" icon={Search}>
          <div className="space-y-2">
            {s.ai_ingredients!.slice(0, 12).map((ing: any, i: number) => (
              <div key={i} className="flex items-start gap-2 py-1.5 border-b last:border-0" style={{ borderColor: 'var(--card-border)' }}>
                <span className={`inline-block w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                  ing.status === 'harmful' ? 'bg-red-500' :
                  ing.status === 'concern' ? 'bg-amber-400' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{ing.ingredient}</span>
                  {ing.concern && (
                    <p className="text-[10px] mt-0.5" style={{ color: ing.status === 'harmful' ? 'var(--risk-red)' : 'var(--clay)' }}>
                      {ing.concern}
                    </p>
                  )}
                  {ing.recommendation && (
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--moss)' }}>
                      {ing.recommendation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {isArr(s.long_term_risks) && (
        <Panel title="Long-Term Risks" icon={Clock}>
          <div className="space-y-2">
            {s.long_term_risks!.map((risk: string, i: number) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(180,60,40,0.05)', border: '1px solid rgba(180,60,40,0.1)' }}>
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--risk-red)' }} />
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{risk}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {isArr(s.recommendations) && (
        <Panel title="Recommendations" icon={TrendingUp}>
          <div className="space-y-1">
            {s.recommendations!.slice(0, 4).map((rec: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--muted-2)' }}>
                <TrendingUp size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--moss)' }} />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {isArr(s.concerns) && (
        <Panel title="Concerns" icon={AlertTriangle}>
          <div className="space-y-2">
            {s.concerns!.map((c: string, i: number) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(196,113,74,0.08)' }}>
                <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--clay)' }} />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>{c}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {isArr(s.positives) && (
        <Panel title="What's Good" icon={Heart}>
          <div className="space-y-2">
            {s.positives!.map((p: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5 py-2 border-b last:border-0" style={{ borderColor: 'var(--card-border)' }}>
                <Heart size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--moss)' }} />
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{p}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {s.safe_consumption && (
        <Panel title="Consumption Guide" icon={Shield}>
          <div className="space-y-2">
            {s.safe_consumption.amount && (
              <Row label="Amount" value={s.safe_consumption.amount} />
            )}
            {s.safe_consumption.frequency && (
              <Row label="Frequency" value={s.safe_consumption.frequency} />
            )}
            {s.safe_consumption.notes && (
              <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--card-border)' }}>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--muted-2)' }}>{s.safe_consumption.notes}</p>
              </div>
            )}
            {s.safe_consumption.personalized_for_user && (
              <div className="pt-2 mt-2 border-t rounded-xl p-3" style={{ borderColor: 'var(--card-border)', background: 'rgba(61,92,46,0.05)' }}>
                <p className="text-[11px] font-bold mb-1" style={{ color: 'var(--moss)' }}>Personalised for you</p>
                <p className="text-xs" style={{ color: 'var(--foreground)' }}>{s.safe_consumption.personalized_for_user}</p>
              </div>
            )}
          </div>
        </Panel>
      )}

      {s.detailed_breakdown && (
        <Panel title="Nutrition Details" icon={Activity}>
          <div className="space-y-0">
            {(['calories', 'protein', 'sugar', 'sodium', 'fat', 'fiber'] as const).map(key => {
              const val = s.detailed_breakdown![key]
              if (!val) return null
              const lower = val.toLowerCase()
              const isGood = lower.startsWith('good') || lower.startsWith('low')
              const isBad = lower.startsWith('high') || lower.startsWith('very high')
              return (
                <div key={key} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: 'var(--card-border)' }}>
                  <span className="text-[11px] w-14 font-semibold capitalize flex-shrink-0" style={{ color: 'var(--muted-2)' }}>{key}</span>
                  <span className="text-[11px]" style={{ color: isGood ? 'var(--moss)' : isBad ? 'var(--risk-red)' : 'var(--foreground)' }}>{val}</span>
                </div>
              )
            })}
          </div>
        </Panel>
      )}

      {s.fssai_compliance && s.fssai_compliance !== 'unknown' && (
        <div className="px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-medium border"
          style={{
            background: s.fssai_compliance === 'compliant' ? 'rgba(61,92,46,0.05)' : 'rgba(196,113,74,0.05)',
            borderColor: s.fssai_compliance === 'compliant' ? 'rgba(61,92,46,0.15)' : 'rgba(196,113,74,0.15)',
            color: s.fssai_compliance === 'compliant' ? 'var(--moss)' : 'var(--clay)',
          }}>
          <Shield size={20} aria-hidden="true" />
          <div>
            <p className="font-bold">FSSAI Compliance</p>
            <p className="text-[11px] opacity-80">
              {s.fssai_compliance === 'compliant'
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
  const color = sc >= 7.5 ? 'var(--moss)' : sc >= 5.5 ? 'var(--clay)' : sc >= 3.5 ? 'var(--clay-light)' : 'var(--risk-red)'
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11px]" style={{ color: 'var(--muted-2)' }}>{label}</span>
        <span className="text-[11px] font-bold" style={{ color }}>{sc}/10</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'color-mix(in oklab, var(--card-border), transparent 50%)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sc * 10}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[11px] font-bold w-20 flex-shrink-0 pt-0.5" style={{ color: 'var(--muted-2)' }}>{label}</span>
      <span className="text-sm" style={{ color: 'var(--foreground)' }}>{value}</span>
    </div>
  )
}
