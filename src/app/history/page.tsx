"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const mealEmoji: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
}

const ratingColors: Record<string, string> = {
  healthy: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  moderate: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  unhealthy: 'text-red-600 bg-red-50 dark:bg-red-900/20',
}

export default function HistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
    if (status === 'authenticated') fetchLogs()
  }, [status])

  async function fetchLogs() {
    const userId = (session as any)?.userId
    if (!userId) return

    const { data } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(50)

    setLogs(data || [])
    setLoading(false)
  }

  const filtered = filter === 'all'
    ? logs
    : logs.filter(l => l.meal_type === filter)

  // Group by date
  const grouped = filtered.reduce((acc: any, log) => {
    const date = new Date(log.logged_at).toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'short'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(log)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            📋 Meal History
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Your last 50 logged meals
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--card-border)]'
              }`}
            >
              {f === 'all' ? 'All meals' : `${mealEmoji[f]} ${f}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-[var(--card)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-[var(--muted)]">No meals logged yet</p>
            <button
              onClick={() => router.push('/scan')}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-xl font-medium"
            >
              Scan your first meal
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, dateLogs]: [string, any]) => (
              <div key={date}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-600 text-[var(--muted)]">{date}</h3>
                  <span className="text-xs text-[var(--muted)]">
                    {Math.round(dateLogs.reduce((s: number, l: any) => s + (l.calories || 0), 0))} kcal
                  </span>
                </div>
                <div className="space-y-2">
                  {dateLogs.map((log: any) => (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 p-3 bg-[var(--card)] rounded-xl border border-[var(--card-border)]"
                    >
                      <span className="text-xl">
                        {mealEmoji[log.meal_type] || '🍽️'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)] truncate">
                          {log.product_name}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {log.quantity_g}g · {log.meal_type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                          {Math.round(log.calories || 0)} kcal
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {new Date(log.logged_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}