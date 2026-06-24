"use client"

interface ScoreRingProps {
  score: number
  size?: number
}

export default function ScoreRing({ score, size = 44 }: ScoreRingProps) {
  const r = size * 0.38
  const circ = 2 * Math.PI * r
  const dash = (Math.min(Math.max(score, 0), 10) / 10) * circ
  const col = score >= 7 ? 'var(--moss)' : score >= 5 ? 'var(--clay)' : 'var(--risk-red)'

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-2)" strokeWidth={size * 0.09} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={size * 0.09}
          strokeDasharray={circ} strokeDashoffset={circ - dash} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: size * 0.22, color: 'var(--foreground)', fontWeight: 700, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: size * 0.11, color: 'var(--muted)' }}>/10</div>
      </div>
    </div>
  )
}
