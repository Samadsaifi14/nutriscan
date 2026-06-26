"use client"

type RingSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'

const SIZE_MAP: Record<RingSize, number> = {
  xl:  88,
  lg:  72,
  md:  52,
  sm:  44,
  xs:  34,
}

interface HealthScoreRingProps {
  score:      number
  size?:      RingSize
  px?:        number
  showLabel?: boolean
  className?: string
}

export default function HealthScoreRing({
  score,
  size      = 'md',
  px,
  showLabel = true,
  className = '',
}: HealthScoreRingProps) {
  const diameter = px ?? SIZE_MAP[size]
  const radius   = diameter * 0.38
  const stroke   = diameter * 0.09
  const circ     = 2 * Math.PI * radius
  const offset   = circ * (1 - Math.min(Math.max(score, 0), 10) / 10)

  const color = score >= 7 ? 'var(--moss)' : score >= 5 ? 'var(--amber)' : 'var(--rust)'

  const scoreFontSize = diameter * 0.22
  const subFontSize   = diameter * 0.11

  return (
    <div
      className={`ring-${size} ${className}`}
      style={{ position: 'relative', flexShrink: 0, width: diameter, height: diameter }}
      role="img"
      aria-label={`Health score: ${score} out of 10`}
    >
      <svg width={diameter} height={diameter} style={{ position: 'absolute', top: 0, left: 0 }} viewBox={`0 0 ${diameter} ${diameter}`}>
        <circle cx={diameter / 2} cy={diameter / 2} r={radius} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <circle
          cx={diameter / 2} cy={diameter / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {showLabel && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', lineHeight: 1.1 }}>
          <div style={{ fontSize: scoreFontSize, fontWeight: 700, color: 'var(--cream)' }}>
            {score.toFixed(score % 1 === 0 ? 0 : 1)}
          </div>
          {diameter >= 40 && <div style={{ fontSize: subFontSize, color: 'var(--sand)' }}>/10</div>}
        </div>
      )}
    </div>
  )
}
