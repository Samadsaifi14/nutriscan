"use client"
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface WeeklyChartProps {
  userId: string
}

export default function WeeklyChart({ userId }: WeeklyChartProps) {
  const { data: weekData, isLoading } = useQuery({
    queryKey: ['weeklyChart', userId],
    queryFn: async () => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 6)
      weekAgo.setHours(0, 0, 0, 0)

      const { data: logs, error } = await supabase
        .from('food_logs')
        .select('calories, logged_at')
        .eq('user_id', userId)
        .gte('logged_at', weekAgo.toISOString())

      if (error) throw error

      // Build a map keyed by YYYY-MM-DD, initialized to 0
      const dayMap: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        d.setHours(0, 0, 0, 0)
        dayMap[d.toLocaleDateString('en-CA')] = 0
      }

      // Aggregate calories per day
      logs?.forEach(log => {
        const key = new Date(log.logged_at).toLocaleDateString('en-CA')
        if (key in dayMap) dayMap[key] += log.calories || 0
      })

      // Convert to array with short weekday labels
      return Object.entries(dayMap).map(([date, calories]) => ({
        label: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
        calories: Math.round(calories),
      }))
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })

  const maxCal = Math.max(...(weekData || []).map(d => d.calories), 1)

  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="h-32 flex items-center justify-center">
          <p className="text-xs text-gray-400 animate-pulse">Loading chart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Weekly Overview</p>

      <div className="flex items-end justify-between gap-1 h-24">
        {(weekData || []).map((d, i) => {
          const heightPct = d.calories > 0
            ? Math.max((d.calories / maxCal) * 100, 4)
            : 0

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400 tabular-nums">
                {d.calories > 0 ? d.calories : ''}
              </span>
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${heightPct}%`,
                  background: d.calories > 0
                    ? 'linear-gradient(to top, #059669, #34d399)'
                    : '#e5e7eb',
                  minHeight: d.calories > 0 ? '4px' : '0',
                }}
              />
              <span className="text-[10px] text-gray-400 font-medium">{d.label}</span>
            </div>
          )
        })}
      </div>

      {weekData?.every(d => d.calories === 0) && (
        <p className="text-center text-xs text-gray-400 mt-2">No meals logged this week yet</p>
      )}
    </div>
  )
}