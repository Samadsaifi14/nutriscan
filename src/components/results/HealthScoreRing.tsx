"use client"

export function scoreHex(s: number) {
  if (s >= 7.5) return '#3D5C2E'
  if (s >= 5.5) return '#C4714A'
  if (s >= 3.5) return '#E8956E'
  return '#B43C28'
}

export function scoreColorClass(s: number) {
  if (s >= 7.5) return 'text-moss'
  if (s >= 5.5) return 'text-clay'
  if (s >= 3.5) return 'text-orange-400'
  return 'text-risk'
}

export const ratingEmoji: Record<string, string> = {
  healthy:   '✅',
  moderate:  '⚠️',
  unhealthy: '❌',
}

export function HealthScoreRing({ score, rating }: { score: number; rating: string }) {
  const hex           = scoreHex(score)
  const radius        = 36
  const circumference = 2 * Math.PI * radius
  const progress      = (Math.min(Math.max(score, 0), 10) / 10) * circumference
  const gap           = circumference - progress

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="var(--card-border)" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke={hex}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${gap}`}
            style={{ transition: 'stroke-dasharray 1.2s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color: hex, fontFamily: 'var(--font-display)' }}>{score}</span>
          <span className="text-[10px]" style={{ color: 'var(--muted-2)' }}>/10</span>
        </div>
      </div>
      <span className={`text-xs font-semibold capitalize`} style={{ color: hex }}>
        {ratingEmoji[rating]} {rating}
      </span>
    </div>
  )
}

export function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 7.5 ? 'var(--moss)' : score >= 5.5 ? 'var(--clay)' : score >= 3.5 ? 'var(--clay-light)' : 'var(--risk-red)'
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px]" style={{ color: 'var(--muted-2)' }}>{label}</span>
        <span className="text-[11px] font-semibold" style={{ color }}>{score}/10</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'color-mix(in oklab, var(--card-border), transparent 50%)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score * 10}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export function DetailedScoreBreakdown({
  nutrition,
  additives,
  novaGroup,
  breakdown
}: {
  nutrition?: { sugar?: number; sodium?: number; protein?: number; fiber?: number }
  additives?: { name: string; risk: string }[]
  novaGroup?: number
  breakdown?: { factor: string; impact: string; detail: string }[]
}) {
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical': return '🔴'
      case 'negative': return '❌'
      case 'warning': return '⚠️'
      case 'positive': return '✅'
      default: return '➖'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'var(--risk-red)'
      case 'negative': return 'var(--risk-red)'
      case 'warning': return 'var(--clay)'
      case 'positive': return 'var(--moss)'
      default: return 'var(--muted-2)'
    }
  }

  const summaryItems: { label: string; value: string; impact: string }[] = []

  if (nutrition?.sugar !== undefined) {
    const impact = nutrition.sugar > 15 ? 'critical' : nutrition.sugar > 5 ? 'warning' : 'positive'
    summaryItems.push({ label: 'Sugar', value: `${nutrition.sugar}g`, impact })
  }

  if (nutrition?.sodium !== undefined) {
    const impact = nutrition.sodium > 500 ? 'critical' : nutrition.sodium > 150 ? 'warning' : 'positive'
    summaryItems.push({ label: 'Sodium', value: `${nutrition.sodium}mg`, impact })
  }

  if (nutrition?.protein !== undefined) {
    const impact = nutrition.protein > 10 ? 'positive' : nutrition.protein < 3 ? 'negative' : 'warning'
    summaryItems.push({ label: 'Protein', value: `${nutrition.protein}g`, impact })
  }

  if (additives && additives.length > 0) {
    const highRisk = additives.filter(a => a.risk === 'high' || a.risk === 'critical').length
    const impact = highRisk > 0 ? 'critical' : additives.length > 0 ? 'warning' : 'positive'
    summaryItems.push({ label: 'Additives', value: `${additives.length} risky`, impact })
  }

  if (novaGroup) {
    const novaLabels: Record<number, string> = { 1: 'Minimal', 2: 'Processed', 3: 'Ultra', 4: 'Highly Ultra' }
    const impact = novaGroup >= 4 ? 'critical' : novaGroup >= 3 ? 'warning' : 'positive'
    summaryItems.push({ label: 'Processing', value: novaLabels[novaGroup] || 'Unknown', impact })
  }

  if (breakdown) {
    breakdown.forEach(item => {
      if (!summaryItems.find(s => s.label.toLowerCase() === item.factor.toLowerCase())) {
        summaryItems.push({
          label: item.factor.charAt(0).toUpperCase() + item.factor.slice(1).replace('_', ' '),
          value: item.detail.split('—')[0].trim() || item.detail.substring(0, 20),
          impact: item.impact,
        })
      }
    })
  }

  return (
    <div className="space-y-2">
      {summaryItems.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'color-mix(in oklab, var(--card), black 4%)' }}>
          <div className="flex items-center gap-2">
            <span className="text-base">{getImpactIcon(item.impact)}</span>
            <span className="text-sm" style={{ color: 'var(--muted-2)' }}>{item.label}</span>
          </div>
          <span className="text-sm font-medium" style={{ color: getImpactColor(item.impact) }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}
