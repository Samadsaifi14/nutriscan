"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CalorieRing } from '@/components/dashboard/CalorieRing'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { RecentScans } from '@/components/dashboard/RecentScans'
import { SkeletonDashboard } from '@/components/Skeleton'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [todayCalories, setTodayCalories] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dailyGoal, setDailyGoal] = useState(2000)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
    if (status === 'authenticated') fetchData()
  }, [status])

  async function fetchData() {
    const userId = (session as any)?.userId
    if (!userId) { setLoading(false); return }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('daily_calorie_goal, profile_completed')
      .eq('user_id', userId)
      .single()

    if (profile && !profile.profile_completed) {
      router.push('/profile-setup')
      return
    }

    if (profile?.daily_calorie_goal) setDailyGoal(profile.daily_calorie_goal)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { data: todayLogs } = await supabase
      .from('food_logs').select('*')
      .eq('user_id', userId)
      .gte('logged_at', todayStart.toISOString())

    setTodayCalories(
      todayLogs?.reduce((s, l) => s + (l.calories || 0), 0) || 0
    )

    const { data: recentLogs } = await supabase
      .from('food_logs').select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(10)

    setLogs(recentLogs || [])
    setLoading(false)
  }

  if (status === 'loading' || loading) return <SkeletonDashboard />

  const todayMeals = logs.filter(l =>
    new Date(l.logged_at).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Hello, {session?.user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-[var(--muted)] mt-0.5">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={() => router.push('/scan')}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            📷 Scan
          </button>
        </div>

        {/* Personalised goal banner */}
        {dailyGoal !== 2000 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl mb-4 text-sm text-green-700 dark:text-green-400">
            🎯 Your daily goal: <span className="font-bold">{dailyGoal} kcal</span>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <CalorieRing
            consumed={todayCalories}
            goal={dailyGoal}
            label="Today's Calories"
          />

          <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--card-border)] flex flex-col justify-center gap-4">
            <div>
              <p className="text-xs text-[var(--muted)] mb-1">Meals today</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {todayMeals}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)] mb-1">Daily goal</p>
              <p className="text-3xl font-bold text-green-600">
                {dailyGoal}
              </p>
            </div>
          </div>
        </div>

        {/* Weekly chart */}
        <div className="mb-4">
          <WeeklyChart />
        </div>

        {/* Recent meals */}
        <RecentScans
          logs={logs}
          onDelete={(id) => {
            setLogs(prev => prev.filter(l => l.id !== id))
            setTodayCalories(prev => {
              const deleted = logs.find(l => l.id === id)
              const today = new Date().toDateString()
              if (deleted && new Date(deleted.logged_at).toDateString() === today) {
                return Math.max(0, prev - (deleted.calories || 0))
              }
              return prev
            })
          }}
        />

      </div>
    </div>
  )
}