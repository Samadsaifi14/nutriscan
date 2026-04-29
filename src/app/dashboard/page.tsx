"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Scan, RefreshCw, ChevronRight, Flame, Target, TrendingUp, Award } from 'lucide-react'
import { event, AnalyticsEvents } from '@/lib/analytics'

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashboardData {
  totalCalories:    number
  totalProtein:     number
  totalCarbs:       number
  totalFat:         number
  dailyCalorieGoal: number
  mealCount:        number
  profile:          any
}

// ── Calorie Ring ──────────────────────────────────────────────────────────────

function CalorieRing({ consumed, goal }: { consumed: number; goal: number }) {
  const pct  = Math.min(consumed / goal, 1)
  const r    = 70
  const circ = 2 * Math.PI * r
  const dash = pct * circ

  const color = pct > 1 ? '#ef4444' : pct > 0.85 ? '#f59e0b' : '#10b981'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
          <circle cx="88" cy="88" r={r} fill="none"
            className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="12" />
          <circle cx="88" cy="88" r={r} fill="none"
            stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`}
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black tabular-nums text-gray-900 dark:text-white">{consumed}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">of {goal} kcal</span>
          <span className="text-[10px] mt-1 font-semibold" style={{ color }}>
            {pct >= 1 ? 'Goal reached!' : `${Math.round(goal - consumed)} left`}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Macro Pill ────────────────────────────────────────────────────────────────

function MacroPill({ label, value, unit, color, bg }: {
  label: string; value: number; unit: string; color: string; bg: string
}) {
  return (
    <div className={`flex-1 rounded-2xl p-3 ${bg} flex flex-col items-center gap-0.5`}>
      <span className={`text-lg font-black tabular-nums ${color}`}>
        {value}<span className="text-xs font-medium">{unit}</span>
      </span>
      <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{label}</span>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{label}</p>
        <p className="text-base font-black text-gray-900 dark:text-white leading-tight">{value}</p>
        {sub && <p className="text-[10px] text-gray-400 dark:text-gray-500">{sub}</p>}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  const userId = (session as any)?.userId

  const { data, isLoading, refetch, isRefetching } = useQuery<DashboardData>({
    queryKey: ['dashboard', userId],
    queryFn: async () => {
      const res = await fetch('/api/dashboard')
      if (!res.ok) throw new Error('Failed')
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      return json.data
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  })

  // Streak from API
  const { data: streakData } = useQuery({
    queryKey: ['streak', userId],
    queryFn: async () => {
      const res = await fetch('/api/streak')
      if (!res.ok) return { streak: 0, best: 0 }
      const json = await res.json()
      return json.data || { streak: 0, best: 0 }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })

  // Last scan from API
  const { data: lastScan } = useQuery({
    queryKey: ['last-scan', userId],
    queryFn: async () => {
      const res = await fetch('/api/last-scan')
      if (!res.ok) return null
      const json = await res.json()
      return json.data || null
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (userId) event(AnalyticsEvents.VIEW_ANALYSIS, { page: 'dashboard', user_id: userId })
  }, [userId])

  const userName     = session?.user?.name?.split(' ')[0] || 'there'
  const isNewUser    = !data?.profile?.profile_completed
  const hasNoLogs    = (data?.mealCount ?? 0) === 0
  const consumed     = data?.totalCalories ?? 0
  const goal         = data?.dailyCalorieGoal ?? 2000
  const remaining    = Math.max(0, goal - consumed)
  const streak       = streakData?.streak ?? 0
  const bestStreak   = streakData?.best   ?? 0

  const now  = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
          <p className="text-sm text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 px-5 pt-14 pb-24 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium">
              {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="text-2xl font-black text-white mt-0.5">
              {greeting}, {userName}! {isNewUser ? '👋' : '💪'}
            </h1>
            {isNewUser && (
              <p className="text-emerald-100 text-sm mt-1 opacity-90">
                Set up your profile to get personalised insights
              </p>
            )}
          </div>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-white disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Profile setup CTA */}
        {isNewUser && (
          <button
            onClick={() => router.push('/profile-setup')}
            className="relative mt-4 w-full flex items-center gap-3 px-4 py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">✨</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Complete your profile</p>
              <p className="text-xs text-emerald-100 opacity-80">Personalised calorie goals & health advice</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/70 flex-shrink-0" />
          </button>
        )}
      </div>

      {/* ── Content pulled up over header ───────────────────────── */}
      <div className="px-4 -mt-16 space-y-4">

        {/* ── Calorie Ring Card ──────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
          {hasNoLogs ? (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4">
                <Scan className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">No meals logged today</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Scan a product to start tracking</p>
              <button onClick={() => router.push('/scan')}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors">
                <Scan className="w-4 h-4" /> Scan a Product
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Today's Calories</p>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                  {data?.mealCount} meal{(data?.mealCount ?? 0) !== 1 ? 's' : ''} logged
                </span>
              </div>
              <div className="flex items-center gap-5">
                <CalorieRing consumed={consumed} goal={goal} />
                <div className="flex-1 space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">Remaining</p>
                    <p className="text-xl font-black text-gray-900 dark:text-white tabular-nums">{remaining}</p>
                    <p className="text-[10px] text-gray-400">kcal left today</p>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Daily Goal</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{goal}</p>
                    <p className="text-[10px] text-emerald-500 dark:text-emerald-500">kcal target</p>
                  </div>
                </div>
              </div>

              {/* Macros row */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <MacroPill label="Protein" value={data?.totalProtein ?? 0} unit="g"
                  color="text-blue-600 dark:text-blue-400"
                  bg="bg-blue-50 dark:bg-blue-900/20" />
                <MacroPill label="Carbs" value={data?.totalCarbs ?? 0} unit="g"
                  color="text-amber-600 dark:text-amber-400"
                  bg="bg-amber-50 dark:bg-amber-900/20" />
                <MacroPill label="Fat" value={data?.totalFat ?? 0} unit="g"
                  color="text-rose-600 dark:text-rose-400"
                  bg="bg-rose-50 dark:bg-rose-900/20" />
              </div>
            </>
          )}
        </div>

        {/* ── Stats Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Flame className="w-5 h-5 text-orange-500" />}
            label="Logging Streak"
            value={`${streak} day${streak !== 1 ? 's' : ''}`}
            sub={bestStreak > 0 ? `Best: ${bestStreak} days` : 'Keep it up!'}
            color="bg-orange-50 dark:bg-orange-900/20"
          />
          <StatCard
            icon={<Target className="w-5 h-5 text-emerald-500" />}
            label="Calorie Goal"
            value={`${Math.round((consumed / goal) * 100)}%`}
            sub={consumed >= goal ? 'Goal reached!' : 'of daily goal'}
            color="bg-emerald-50 dark:bg-emerald-900/20"
          />
        </div>

        {/* ── Last Scanned ───────────────────────────────────────── */}
        {lastScan && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Last Scanned</p>
              <button onClick={() => router.push('/results')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                View <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                <Scan className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {lastScan.product_name || 'Unknown Product'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {lastScan.ai_health_rating && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      lastScan.ai_health_rating === 'healthy'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : lastScan.ai_health_rating === 'moderate'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                      {lastScan.ai_health_rating === 'healthy' ? '✅' : lastScan.ai_health_rating === 'moderate' ? '⚠️' : '❌'} {lastScan.ai_health_rating}
                    </span>
                  )}
                  {lastScan.ai_health_score && (
                    <span className="text-[11px] text-gray-400">{lastScan.ai_health_score}/10</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => router.push('/scan')}
                className="flex-shrink-0 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors">
                Scan again
              </button>
            </div>
          </div>
        )}

        {/* ── Quick Actions ──────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            Quick Actions
          </p>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[
              { icon: '📷', label: 'Scan a product', sub: 'Get instant AI health rating', href: '/scan' },
              { icon: '⭐', label: 'View last result', sub: 'Health score, ingredients & more', href: '/results' },
              { icon: '📊', label: 'Scan history', sub: 'All your past scans', href: '/history' },
              { icon: '👤', label: 'Health profile', sub: 'Personalise your advice', href: '/profile-setup' },
            ].map(item => (
              <button key={item.href} onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{item.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Today's Meals ──────────────────────────────────────── */}
        {!hasNoLogs && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Today's Meals</p>
              <button onClick={() => router.push('/history')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                History <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="px-4 py-3 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {data?.mealCount} meal{(data?.mealCount ?? 0) !== 1 ? 's' : ''} logged · {consumed} kcal consumed
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Check History for full breakdown
              </p>
            </div>
          </div>
        )}

        {/* ── Achievement banner ─────────────────────────────────── */}
        {streak >= 3 && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-4 flex items-center gap-3">
            <Award className="w-8 h-8 text-white flex-shrink-0" />
            <div>
              <p className="text-sm font-black text-white">{streak} day streak! 🔥</p>
              <p className="text-xs text-white/80">Keep logging to maintain your streak</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}