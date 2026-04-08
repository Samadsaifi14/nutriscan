"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { CalorieRing } from '@/components/dashboard/CalorieRing'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { RecentScans } from '@/components/dashboard/RecentScans'
import { SkeletonDashboard } from '@/components/Skeleton'
import toast from 'react-hot-toast'

function MacroBar({ label, value, total, color }: {
  label: string
  value: number
  total: number
  color: string
}) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[var(--muted)] font-medium">{label}</span>
        <span className="text-xs font-bold text-[var(--foreground)]">{Math.round(value)}g</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [dailyGoal, setDailyGoal] = useState(2000)
  const userId = (session as any)?.userId

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', userId],
    queryFn: async () => {
      if (!userId) return null

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('daily_calorie_goal, profile_completed, name')
        .eq('user_id', userId)
        .single()

      if (profile && !profile.profile_completed) {
        router.push('/profile-setup')
        return null
      }

      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const [todayResult, recentResult] = await Promise.all([
        supabase.from('food_logs').select('*')
          .eq('user_id', userId)
          .gte('logged_at', todayStart.toISOString()),
        supabase.from('food_logs').select('*')
          .eq('user_id', userId)
          .order('logged_at', { ascending: false })
          .limit(10)
      ])

      if (todayResult.error) console.error('Dashboard todayLogs error:', todayResult.error.message)
      if (recentResult.error) console.error('Dashboard recentLogs error:', recentResult.error.message)

      return {
        profile,
        todayLogs: todayResult.data || [],
        recentLogs: recentResult.data || [],
      }
    },
    enabled: !!userId,
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status])

  useEffect(() => {
    if (data?.profile?.daily_calorie_goal) {
      setDailyGoal(data.profile.daily_calorie_goal)
    }
  }, [data])

  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return <SkeletonDashboard />
  }

  const todayLogs = data?.todayLogs || []
  const recentLogs = data?.recentLogs || []
  const todayCalories = todayLogs.reduce((s: number, l: any) => s + (l.calories || 0), 0)
  const todayProtein = todayLogs.reduce((s: number, l: any) => s + (l.protein_g || 0), 0)
  const todayCarbs = todayLogs.reduce((s: number, l: any) => s + (l.carbs_g || 0), 0)
  const todayFat = todayLogs.reduce((s: number, l: any) => s + (l.fat_g || 0), 0)
  const todayMeals = todayLogs.length
  const progressPct = Math.min(Math.round((todayCalories / dailyGoal) * 100), 100)
  const firstName = session?.user?.name?.split(' ')[0] || 'there'

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? '🌅 Good morning' : hour < 17 ? '☀️ Good afternoon' : '🌙 Good evening'

  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* Header with gradient */}
      <div
        className="relative px-5 pt-12 pb-8 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #0ea5e9 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-8 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative flex justify-between items-start mb-6 max-w-2xl mx-auto">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">{greeting}</p>
            <h1 className="text-3xl font-black text-white">{firstName}</h1>
            <p className="text-emerald-100 text-xs mt-1">
              {now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => router.push('/scan')}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border border-white/20"
          >
            <span>📷</span> Scan
          </button>
        </div>

        {/* Today's progress bar */}
        <div className="relative bg-white/10 rounded-2xl p-4 max-w-2xl mx-auto border border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm font-semibold">Today's Progress</span>
            <span className="text-emerald-100 text-xs">{progressPct}% of goal</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progressPct}%`,
                background: progressPct >= 100
                  ? '#ef4444'
                  : progressPct >= 75
                  ? '#f59e0b'
                  : 'rgba(255,255,255,0.9)',
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-emerald-100">
            <span>{Math.round(todayCalories)} kcal consumed</span>
            <span>{Math.max(0, dailyGoal - Math.round(todayCalories))} kcal remaining</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-4">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          {[
            { label: 'Calories', value: Math.round(todayCalories), unit: 'kcal', color: '#059669' },
            { label: 'Meals', value: todayMeals, unit: 'today', color: '#0ea5e9' },
            { label: 'Goal', value: dailyGoal, unit: 'kcal', color: '#8b5cf6' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-[var(--card)] rounded-2xl p-4 border border-[var(--card-border)] shadow-sm text-center"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <p className="text-2xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{stat.unit}</p>
              <p className="text-xs font-medium text-[var(--foreground)] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Calorie ring + macros */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in-up stagger-1">
          <CalorieRing consumed={todayCalories} goal={dailyGoal} label="Daily Calories" />

          <div className="bg-[var(--card)] rounded-2xl p-4 border border-[var(--card-border)] shadow-sm">
            <p className="text-xs font-bold text-[var(--foreground)] mb-4">🥩 Macros Today</p>
            {todayCalories > 0 ? (
              <div className="space-y-3">
                <MacroBar label="Protein" value={todayProtein} total={todayProtein + todayCarbs + todayFat} color="#059669" />
                <MacroBar label="Carbs" value={todayCarbs} total={todayProtein + todayCarbs + todayFat} color="#0ea5e9" />
                <MacroBar label="Fat" value={todayFat} total={todayProtein + todayCarbs + todayFat} color="#f59e0b" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 text-center">
                <span className="text-3xl mb-2">🍽️</span>
                <p className="text-xs text-[var(--muted)]">Log a meal to see macros</p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly chart */}
        <div className="animate-fade-in-up stagger-2">
          <WeeklyChart />
        </div>

        {/* Recent meals */}
        <div className="animate-fade-in-up stagger-3">
          <RecentScans
            logs={recentLogs}
            onDelete={(id) => {
              queryClient.invalidateQueries({ queryKey: ['dashboard', userId] })
              toast.success('Meal removed')
            }}
          />
        </div>

      </div>
    </div>
  )
}