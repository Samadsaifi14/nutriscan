"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import PageShell from '@/components/PageShell'

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
  snack: 'from-[var(--moss)]/10 to-[var(--clay)]/5',
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const userId = (session as any)?.userId

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['meal-history', userId],
    queryFn: async () => {
      if (!userId) return []
      try {
        const res = await fetch('/api/log?userId=' + userId)
        if (!res.ok) throw new Error('Failed to load history')
        const json = await res.json()
        return json.data || []
      } catch (err) {
        console.error('History fetch error:', err)
        return []
      }
    },
    enabled: !!userId,
    refetchInterval: 5000,
  })

  const filtered = filter === 'all' ? (logs || []) : (logs || []).filter((l: any) => l.meal_type === filter)

  const grouped = filtered.reduce((acc: any, log: any) => {
    const logDate = new Date(log.logged_at)
    logDate.setHours(0, 0, 0, 0)
    const date = logDate.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'short'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(log)
    return acc
  }, {})

  const totalCalories = (logs || []).reduce((s: number, l: any) => s + (l.calories || 0), 0)
  const totalMeals = (logs || []).length

  return (
    <PageShell variant="default" title="History" showBack>
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: 'linear-gradient(135deg, #C4714A 0%, #2C1F0F 100%)' }}
      >
        {!isLoading && logs && logs.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: 'Total Meals', value: totalMeals, unit: 'logged' },
              { label: 'Total Calories', value: Math.round(totalCalories), unit: 'kcal' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/15 rounded-2xl p-3 border border-white/20">
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-[var(--cream)]">{stat.unit}</p>
                <p className="text-xs text-[var(--sand)]">{stat.label}</p>
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
                    ? 'linear-gradient(135deg, #C4714A, #2C1F0F)'
                    : 'var(--card)',
                  color: filter === f ? 'white' : 'var(--muted)',
                  border: filter === f ? 'none' : '1px solid var(--card-border)',
                  boxShadow: filter === f ? '0 4px 12px rgba(196,113,74,0.3)' : 'none',
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
              style={{ background: 'linear-gradient(135deg, #C4714A, #2C1F0F)' }}
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
                    {dateLogs.map((log: any) => {
                      const handleClick = () => {
                        const stored = localStorage.getItem(`meal_${log.id}`)
                        if (stored) {
                          localStorage.setItem('hox_scan_result_v1', stored)
                          router.push('/results')
                        } else if (log.barcode) {
                          router.push(`/scan?barcode=${log.barcode}`)
                        } else {
                          router.push('/scan')
                        }
                      }
                      return (
                        <div
                          key={log.id}
                          onClick={handleClick}
                          className={`flex items-center gap-3 p-4 bg-[var(--card)] rounded-2xl border border-[var(--card-border)] hover:border-[var(--clay)]/20 dark:hover:border-[var(--clay)]/40 transition-all cursor-pointer`}
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
                            <p className="text-sm font-black text-[var(--moss)] dark:text-[var(--clay)]">
                              {Math.round(log.calories || 0)}
                            </p>
                            <p className="text-xs text-[var(--muted)]">kcal</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </PageShell>
  )
}
