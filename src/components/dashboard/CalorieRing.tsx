"use client"

interface CalorieRingProps {
  consumed: number
  goal: number
}

export default function CalorieRing({ consumed, goal }: CalorieRingProps) {
  const percentage = Math.min((consumed / goal) * 100, 100)
  const remaining = Math.max(goal - consumed, 0)
  const circumference = 2 * Math.PI * 54 // radius = 54
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const color =
    percentage > 100 ? '#ef4444' :
    percentage > 85 ? '#f59e0b' :
    '#10b981'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-100 dark:text-gray-800"
          />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-black text-[var(--foreground)] tabular-nums">
            {Math.round(consumed)}
          </p>
          <p className="text-xs text-gray-400">of {goal} kcal</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {remaining > 0
          ? `${Math.round(remaining)} kcal remaining`
          : `${Math.round(consumed - goal)} kcal over goal`}
      </p>
    </div>
  )
}