// components/DashboardCharts.tsx
// Enhanced chart components for dashboard

import { useMemo } from 'react'

interface ChartProps {
  data: number[]
  labels: string[]
  height?: number
  color?: string
}

export function WeeklyBarChart({ data, labels, height = 120 }: ChartProps) {
  const max = Math.max(...data, 1)
  
  return (
    <div className="flex items-end justify-between gap-2 px-2" style={{ height }}>
      {data.map((value, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div 
            className="w-full max-w-8 rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-500 hover:from-sky-500 hover:to-sky-400"
            style={{ height: `${(value / max) * (height - 20)}px` }}
          />
          <span className="text-[10px] text-[#7a8fa6] mt-1 truncate w-full text-center">
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  )
}

export function LineTrendChart({ data, labels, height = 80 }: ChartProps) {
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = height - ((value - min) / range) * (height - 10)
    return `${x},${y}`
  }).join(' ')
  
  return (
    <div className="relative" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Background area */}
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon 
          points={`0,100 ${points} 100,100`} 
          fill="url(#areaGradient)" 
        />
        <polyline 
          points={points} 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
        {labels.map((label, i) => (
          <span key={i} className="text-[8px] text-[#7a8fa6] truncate max-w-[50px]">
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

interface MacroRingProps {
  label: string
  value: number
  goal: number
  color: string
}

export function MacroRing({ label, value, goal, color }: MacroRingProps) {
  const pct = Math.min(value / goal, 1)
  const r = 24
  const circ = 2 * Math.PI * r
  const dash = pct * circ
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14">
        <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
          <circle cx="28" cy="28" r={r} fill="none" stroke="#1e242d" strokeWidth="4" />
          <circle 
            cx="28" cy="28" r={r} fill="none" 
            stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#f0f4f8]">{value}g</span>
        </div>
      </div>
      <span className="text-[9px] text-[#7a8fa6] mt-1">{label}</span>
      <span className="text-[8px] text-[#7a8fa6]/60">{goal}g goal</span>
    </div>
  )
}

interface ProgressBarProps {
  label: string
  current: number
  goal: number
  color?: string
}

export function ProgressBar({ label, current, goal, color = '#10b981' }: ProgressBarProps) {
  const pct = Math.min((current / goal) * 100, 100)
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[#7a8fa6]">{label}</span>
        <span className="text-xs font-bold text-[#f0f4f8]">
          {current.toLocaleString()} / {goal.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-[#1e242d] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}