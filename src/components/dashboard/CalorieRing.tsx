"use client"

interface CalorieRingProps {
  consumed: number
  goal: number
  label: string
}

export function CalorieRing({ consumed, goal, label }: CalorieRingProps) {
  const pct = Math.min((consumed / goal) * 100, 100)
  const r = 52
  const cx = 64
  const cy = 64
  const circ = 2 * Math.PI * r
  const dashOffset = circ * (1 - pct / 100)
  const color = pct < 75 ? '#16a34a' : pct < 100 ? '#d97706' : '#dc2626'

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
        {label}
      </p>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke="#e5e7eb" strokeWidth="12"
        />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text
          x={cx} y={cy - 6}
          textAnchor="middle"
          fontSize="18" fontWeight="bold" fill="#111827"
        >
          {Math.round(consumed)}
        </text>
        <text
          x={cx} y={cy + 14}
          textAnchor="middle"
          fontSize="11" fill="#6b7280"
        >
          / {goal} kcal
        </text>
      </svg>
      <p style={{ fontSize: '13px', fontWeight: 500, marginTop: '4px', color }}>
        {pct >= 100
          ? 'Goal reached!'
          : `${Math.max(0, Math.round(goal - consumed))} kcal remaining`}
      </p>
    </div>
  )
}