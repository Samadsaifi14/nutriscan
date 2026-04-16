// src/components/dashboard/MealStreak.tsx
"use client"
import { useQuery } from '@tanstack/react-query'
import { Flame } from 'lucide-react'

export default function MealStreak() {
  const { data, isLoading } = useQuery({
    queryKey: ['streak'],
    queryFn: async () => {
      const res = await fetch('/api/streak')
      const json = await res.json()
      return json
    },
    staleTime: 1000 * 60 * 5,
  })

  const streak = data?.streak || 0
  const longest = data?.longest || 0
  const loggedToday = data?.loggedToday || false

  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
        streak > 0
          ? 'bg-orange-50 dark:bg-orange-900/30'
          : 'bg-gray-50 dark:bg-gray-800'
      }`}>
        <Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-[var(--foreground)]">{streak}</span>
          <span className="text-xs text-gray-400">day streak</span>
        </div>
        <p className="text-xs text-gray-400">
          {loggedToday ? '✅ Logged today' : 'Log a meal to continue your streak'}
          {longest > streak && ` · Best: ${longest} days`}
        </p>
      </div>
    </div>
  )
}