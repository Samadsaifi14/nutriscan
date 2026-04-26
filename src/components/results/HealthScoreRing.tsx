// src/components/results/HealthScoreRing.tsx
"use client"

export function scoreHex(s: number) {
  if (s >= 7.5) return '#22c55e'
  if (s >= 5.5) return '#f59e0b'
  if (s >= 3.5) return '#fb923c'
  return '#ef4444'
}

export function scoreColorClass(s: number) {
  if (s >= 7.5) return 'text-emerald-400'
  if (s >= 5.5) return 'text-amber-400'
  if (s >= 3.5) return 'text-orange-400'
  return 'text-red-400'
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
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#2a3545" strokeWidth="8" />
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
          <span className={`text-2xl font-black ${scoreColorClass(score)}`}>{score}</span>
          <span className="text-[10px] text-[#7a8fa6]">/10</span>
        </div>
      </div>
      <span className={`text-xs font-semibold capitalize ${scoreColorClass(score)}`}>
        {ratingEmoji[rating]} {rating}
      </span>
    </div>
  )
}

export function ScoreBar({ label, score, colorClass }: { label: string; score: number; colorClass: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-[#7a8fa6]">{label}</span>
        <span className={`text-[11px] font-semibold ${colorClass}`}>{score}/10</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#2a3545] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass.replace('text-', 'bg-')}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  )
}