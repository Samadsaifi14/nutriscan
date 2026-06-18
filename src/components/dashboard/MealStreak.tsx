"use client"
import { useEffect, useState } from 'react'
import { Flame, Trophy } from 'lucide-react'

interface StreakData {
  streak: number
  longest: number
  loggedToday: boolean
  lastLoggedAt: string | null
}

export default function MealStreak() {
  const [data, setData]       = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/streak')
      .then(r => r.json())
      .then(r => { if (r.success) setData(r) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl p-4 bg-[var(--card)] border border-[var(--card-border)] animate-pulse h-24" />
    )
  }

  if (!data) return null

  const { streak, longest, loggedToday } = data

  const flameColor =
    streak === 0 ? 'text-gray-300 dark:text-gray-600'
    : streak >= 7  ? 'text-orange-500'
    : streak >= 3  ? 'text-amber-500'
    : 'text-yellow-500'

  return (
    <div className="rounded-2xl p-4 bg-[var(--card)] border border-[var(--card-border)] shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center
            ${streak > 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <Flame className={`w-5 h-5 ${flameColor}`} />
          </div>
          <div>
          <p className="text-xs text-[var(--muted)] font-medium">Logging Streak</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[var(--foreground)]">{streak}</span>
            <span className="text-sm text-[var(--muted)]">day{streak !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {loggedToday ? (
            <span className="text-xs font-semibold text-[var(--moss)]
              bg-[color-mix(in_oklab,var(--moss),transparent_88%)] px-2.5 py-1 rounded-full">
              ✓ Logged today
            </span>
          ) : (
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400
              bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">
              Log today!
            </span>
          )}
          {longest > 0 && (
            <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
              <Trophy className="w-3 h-3" /> Best: {longest} day{longest !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {streak >= 7 && (
        <div className="mt-3 pt-3 border-t border-[var(--card-border)] flex items-center gap-2">
          <span className="text-lg">{streak >= 30 ? '🏆' : streak >= 14 ? '🥇' : '🔥'}</span>
          <p className="text-xs font-semibold text-[var(--muted)]">
            {streak >= 30
              ? `${streak}-day legend! Incredible consistency.`
              : streak >= 14
              ? `${streak}-day streak! You're on fire!`
              : `7-day streak! Great habit building!`}
          </p>
        </div>
      )}
    </div>
  )
}