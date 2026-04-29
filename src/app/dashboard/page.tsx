"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Scan, RefreshCw, ChevronRight, Flame, Target, Award } from 'lucide-react'
import { SkeletonDashboard } from '@/components/Skeleton'
import { event, AnalyticsEvents } from '@/lib/analytics'

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
  const r    = 54
  const circ = 2 * Math.PI * r
  const dash = pct * circ
  const color = pct > 1 ? '#ef4444' : pct > 0.85 ? '#f59e0b' : '#10b981'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-32 h-32">
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          <circle cx="64" cy="64" r={r} fill="none"
            className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="10" />
          <circle cx="64" cy="64" r={r} fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`}
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black tabular-nums text-[var(--foreground)]">{consumed}</span>
          <span className="text-[10px] text-[var(--muted)] font-medium">kcal</span>
        </div>
      </div>
      <p className="text-xs text-[var(--muted)] font-medium text-center">
        {Math.max(0, goal - consumed)} kcal left
      </p>
    </div>
  )
}

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

  if (status === 'loading' || isLoading) return <SkeletonDashboard />

  const userName   = session?.user?.name?.split(' ')[0] || 'there'
  const isNewUser  = !data?.profile?.profile_completed
  const hasNoLogs  = (data?.mealCount ?? 0) === 0
  const consumed   = data?.totalCalories ?? 0
  const goal       = data?.dailyCalorieGoal ?? 2000
  const streak     = streakData?.streak ?? 0
  const bestStreak = streakData?.best ?? 0
  const pct        = Math.round(Math.min(consumed / goal, 1) * 100)

  const now  = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* ── Header — matches skeleton gradient ──────────────────── */}
      <div className="px-5 pt-12 pb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)' }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-emerald-100 text-sm font-medium">
            {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <div className="flex items-start justify-between mt-0.5">
            <div>
              <h1 className="text-2xl font-black text-white">
                {greeting}, {userName}! {isNewUser ? '👋' : '💪'}
              </h1>
              {isNewUser && (
                <p className="text-emerald-100 text-sm mt-0.5 opacity-90">
                  Set up your profile for personalised advice
                </p>
              )}
            </div>
            <button onClick={() => refetch()} disabled={isRefetching}
              className="mt-1 p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-white disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Profile CTA — matches skeleton's h-16 block */}
          {isNewUser ? (
            <button onClick={() => router.push('/profile-setup')}
              className="mt-4 w-full flex items-center gap-3 px-4 py-3 bg-white/15 hover:bg-white/25 border border-white/25 rounded-2xl transition-colors text-left">
              <span className="text-xl">✨</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Complete your profile</p>
                <p className="text-xs text-emerald-100 opacity-80">Get personalised calorie goals & health scores</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/70" />
            </button>
          ) : (
            <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-white/10 rounded-2xl">
              <Flame className="w-5 h-5 text-orange-300 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-emerald-100 opacity-80">Logging streak</p>
                <p className="text-sm font-black text-white">{streak} day{streak !== 1 ? 's' : ''} 🔥</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-100 opacity-80">Best</p>
                <p className="text-sm font-black text-white">{bestStreak}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-4">

        {/* ── 3-col stat strip — matches skeleton grid ───────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Calories', value: consumed, unit: 'kcal', color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Protein',  value: data?.totalProtein ?? 0, unit: 'g', color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Meals',    value: data?.mealCount ?? 0, unit: '', color: 'text-amber-600 dark:text-amber-400' },
          ].map(s => (
            <div key={s.label} className="bg-[var(--card)] rounded-2xl p-4 border border-[var(--card-border)] text-center">
              <p className={`text-2xl font-black tabular-nums ${s.color}`}>
                {s.value}<span className="text-xs font-medium text-[var(--muted)]">{s.unit}</span>
              </p>
              <p className="text-xs text-[var(--muted)] font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Ring + Goal side by side — matches skeleton 2-col ──── */}
        <div className="grid grid-cols-2 gap-3">

          {/* Calorie Ring */}
          <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] flex flex-col items-center">
            <p className="text-xs font-semibold text-[var(--muted)] mb-4 self-start">Today's Calories</p>
            <CalorieRing consumed={consumed} goal={goal} />
          </div>

          {/* Goal breakdown */}
          <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] flex flex-col justify-between">
            <p className="text-xs font-semibold text-[var(--muted)] mb-3">Daily Goal</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--muted)]">Progress</span>
                  <span className="font-bold text-[var(--foreground)]">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center">
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{consumed}</p>
                  <p className="text-[10px] text-[var(--muted)]">eaten</p>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                  <p className="text-sm font-black text-[var(--foreground)] tabular-nums">{Math.max(0, goal - consumed)}</p>
                  <p className="text-[10px] text-[var(--muted)]">left</p>
                </div>
              </div>
              <p className="text-[10px] text-[var(--muted)] text-center">Goal: {goal} kcal/day</p>
            </div>
          </div>
        </div>

        {/* ── Macros card — matches skeleton SkeletonCard ────────── */}
        <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)]">
          <p className="text-sm font-bold text-[var(--foreground)] mb-4">Macronutrients</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Protein', value: data?.totalProtein ?? 0, unit: 'g', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', bar: 'bg-blue-500' },
              { label: 'Carbs',   value: data?.totalCarbs   ?? 0, unit: 'g', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', bar: 'bg-amber-500' },
              { label: 'Fat',     value: data?.totalFat     ?? 0, unit: 'g', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20', bar: 'bg-rose-500' },
            ].map(m => (
              <div key={m.label} className={`${m.bg} rounded-2xl p-3 text-center`}>
                <p className={`text-xl font-black tabular-nums ${m.color}`}>
                  {m.value}<span className="text-xs font-medium">{m.unit}</span>
                </p>
                <p className="text-[11px] text-[var(--muted)] font-medium mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Last Scanned + Streak — matches skeleton SkeletonCard ─ */}
        <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] space-y-3">
          <p className="text-sm font-bold text-[var(--foreground)]">Recent Activity</p>

          {lastScan ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <Scan className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">{lastScan.product_name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {lastScan.ai_health_rating && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      lastScan.ai_health_rating === 'healthy'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : lastScan.ai_health_rating === 'moderate'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                      {lastScan.ai_health_rating}
                    </span>
                  )}
                  {lastScan.ai_health_score && (
                    <span className="text-[11px] text-[var(--muted)]">{lastScan.ai_health_score}/10</span>
                  )}
                </div>
              </div>
              <button onClick={() => router.push('/results')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 flex-shrink-0">
                View <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Scan className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--foreground)]">No scans yet</p>
                <p className="text-xs text-[var(--muted)]">Scan a product to see results here</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--foreground)]">{streak} day{streak !== 1 ? 's' : ''} streak</p>
              <p className="text-xs text-[var(--muted)]">Best: {bestStreak} days</p>
            </div>
            {streak >= 3 && <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />}
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--foreground)]">{pct}% of daily goal</p>
              <p className="text-xs text-[var(--muted)]">{consumed} of {goal} kcal</p>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ──────────────────────────────────────── */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--card-border)] overflow-hidden">
          <p className="text-sm font-bold text-[var(--foreground)] px-4 py-3 border-b border-[var(--card-border)]">
            Quick Actions
          </p>
          <div className="divide-y divide-[var(--card-border)]">
            {[
              { icon: '📷', label: 'Scan a product', sub: 'Instant AI health rating', href: '/scan' },
              { icon: '⭐', label: 'View last result', sub: 'Health score & ingredients', href: '/results' },
              { icon: '📊', label: 'Scan history', sub: 'All your past scans', href: '/history' },
              { icon: '👤', label: 'Health profile', sub: 'Personalise your advice', href: '/profile-setup' },
            ].map(item => (
              <button key={item.href} onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left">
                <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                  <p className="text-xs text-[var(--muted)]">{item.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--muted)] flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Scan CTA if no logs */}
        {hasNoLogs && (
          <button onClick={() => router.push('/scan')}
            className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-emerald-500/20">
            <Scan className="w-5 h-5" /> Scan your first product today
          </button>
        )}

      </div>
    </div>
  )
}