'use client'

import { motion } from 'framer-motion'
import { ratingColor, scoreToRating } from '@/lib/utils'

const SIZES = { xs: 32, sm: 44, md: 64, lg: 80, xl: 96 } as const

interface HealthScoreRingProps {
  score: number
  size?: keyof typeof SIZES
  showLabel?: boolean
}

export function HealthScoreRing({ score, size = 'md', showLabel = true }: HealthScoreRingProps) {
  const diameter = SIZES[size]
  const stroke = Math.max(3, diameter * 0.09)
  const radius = (diameter - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(10, score)) / 10
  const rating = scoreToRating(score)
  const color = ratingColor(rating)
  const fontSize = diameter * 0.34

  return (
    <div style={{ width: diameter, height: diameter, position: 'relative' }} role="img" aria-label={`Health score ${score} out of 10, ${rating}`}>
      <svg width={diameter} height={diameter} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>
      {showLabel && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontWeight: 700,
            fontSize,
            color,
          }}
        >
          {score}
        </div>
      )}
    </div>
  )
}
