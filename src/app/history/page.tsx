"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

const mealEmoji: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}

const mealColors: Record<string, string> = {
  breakfast: 'from-orange-500/10 to-amber-500/5',
  lunch: 'from-yellow-500/10 to-orange-500/5',
  dinner: 'from-blue-500/10 to-indigo-500/5',
  snack: 'from-green-500/10 to-emerald-500/5',
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const userId = (session as any)?.userId

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status])

  const { data: logs, isLoading } = useQuery({
    queryKey: ['meal-history', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false })
        .limit(50)
      return data || []
    },
    enabled: !!userId,
  })

  const filtered = filter === 'all' ? logs || [] : (logs || []).filter((l: any) => l.meal_type === filter)

  const grouped = filtered.reduce((acc: any, log: any) => {
    const date = new Date(log.logged_at).toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'short'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(log)
    return acc
  }, {})

  const totalCalories = (logs || []).reduce((s: number, l: any) => s + (l.calories || 0), 0)
  const totalMeals = (logs || []).length

  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)' }}
      >
        <h1 className="text-2xl font-black text-white mb-1">Meal History</h1>
        <p className="text-emerald-100 text-sm">Your last 50 logged meals</p>

        {!isLoading && logs && logs.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: 'Total Meals', value: totalMeals, unit: 'logged' },
              { label: 'Total Calories', value: Math.round(totalCalories), unit: 'kcal' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/15 rounded-2xl p-3 border border-white/20">
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-emerald-100">{stat.unit}</p>
                <p className="text-xs text-emerald-200">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto">

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background: filter === f
                  ? 'linear-gradient(135deg, #059669, #0ea5e9)'
                  : 'var(--card)',
                color: filter === f ? 'white' : 'var(--muted)',
                border: filter === f ? 'none' : '1px solid var(--card-border)',
                boxShadow: filter === f ? '0 4px 12px rgba(5,150,105,0.3)' : 'none',
              }}
            >
              {f === 'all' ? 'All meals' : `${mealEmoji[f]} ${f}`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-[var(--card)] rounded-2xl animate-pulse" />
            ))}
          </div>

        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="font-bold text-[var(--foreground)] mb-2">No meals logged yet</p>
            <p className="text-sm text-[var(--muted)] mb-6">Start tracking your nutrition today</p>
            <button
              onClick={() => router.push('/scan')}
              className="px-6 py-3 rounded-2xl text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #059669, #0ea5e9)' }}
            >
              Scan your first meal
            </button>
          </div>

        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, dateLogs]: [string, any]) => {
              const dayCalories = dateLogs.reduce((s: number, l: any) => s + (l.calories || 0), 0)
              return (
                <div key={date}>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-wide">{date}</p>
                    <p className="text-xs font-bold text-[var(--brand)]">{Math.round(dayCalories)} kcal</p>
                  </div>
                  <div className="space-y-2">
                    {dateLogs.map((log: any) => (
                      <div
                        key={log.id}
                        className={`flex items-center gap-3 p-4 bg-[var(--card)] rounded-2xl border border-[var(--card-border)] hover:border-emerald-200 dark:hover:border-emerald-800 transition-all`}
                      >
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br ${mealColors[log.meal_type] || 'from-gray-100 to-gray-50'} flex-shrink-0`}>
                          {mealEmoji[log.meal_type] || '🍽️'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[var(--foreground)] truncate">{log.product_name}</p>
                          <p className="text-xs text-[var(--muted)] mt-0.5 capitalize">
                            {log.quantity_g}g · {log.meal_type}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            {Math.round(log.calories || 0)}
                          </p>
                          <p className="text-xs text-[var(--muted)]">kcal</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}