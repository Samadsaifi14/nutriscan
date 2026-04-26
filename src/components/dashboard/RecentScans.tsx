"use client"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Scan, Plus, Sparkles } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { CalorieRing } from '@/components/dashboard/CalorieRing'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { RecentScans } from '@/components/dashboard/RecentScans'
import MealStreak from '@/components/dashboard/MealStreak'
import NutrientAlerts from '@/components/dashboard/NutrientAlerts'
import LastScanned from '@/components/dashboard/LastScanned'
import { SkeletonDashboard } from '@/components/Skeleton'
import { supabase } from '@/lib/supabase'
import { event, AnalyticsEvents } from '@/lib/analytics'

interface FoodLog {
  id: string
  product_name: string
  calories: number
  meal_type: string
  logged_at: string
  quantity_g: number
}

interface DashboardData {
  totalCalories: number
  totalProtein:  number
  totalCarbs:    number
  totalFat:      number
  dailyCalorieGoal: number
  mealCount:     number
  profile:       any
  logs:          FoodLog[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  const userId = (session as any)?.userId

  const { data, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ['dashboard', userId],
    queryFn: async () => {
      const profileRes = await fetch('/api/profile')
      const profile = profileRes.ok ? (await profileRes.json()).data : null

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data: logs, error: logsError } = await supabase
        .from('food_logs')
        .select('id, product_name, calories, meal_type, logged_at, quantity_g, protein_g, carbs_g, fat_g')
        .eq('user_id', userId)
        .gte('logged_at', today.toISOString())
        .order('logged_at', { ascending: false })

      if (logsError) {
        console.error('Failed to load food logs:', logsError)
      }

      const totals = (logs || []).reduce(
        (acc: any, l: any) => ({
          calories: acc.calories + (l.calories   || 0),
          protein:  acc.protein  + (l.protein_g  || 0),
          carbs:    acc.carbs    + (l.carbs_g    || 0),
          fat:      acc.fat      + (l.fat_g      || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      )

      return {
        totalCalories:    Math.round(totals.calories),
        totalProtein:     Math.round(totals.protein),
        totalCarbs:       Math.round(totals.carbs),
        totalFat:         Math.round(totals.fat),
        dailyCalorieGoal: profile?.daily_calorie_goal || 2000,
        mealCount:        (logs || []).length,
        profile,
        logs:             (logs || []) as FoodLog[],
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  })

  const [logs, setLogs] = useState<FoodLog[]>([])

  useEffect(() => {
    if (data?.logs) setLogs(data.logs)
  }, [data?.logs])

  function handleDelete(id: string) {
    setLogs(prev => prev.filter(l => l.id !== id))
  }

  useEffect(() => {
    if (userId) {
      event(AnalyticsEvents.VIEW_ANALYSIS, {
        page: 'dashboard',
        user_id: userId,
      })
    }
  }, [userId])

  if (status === 'loading' || isLoading) return <SkeletonDashboard />

  const isNewUser = !data?.profile?.profile_completed
  const hasNoLogs = (data?.mealCount ?? 0) === 0
  const userName  = session?.user?.name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-[var(--background)]">

      {/* ── Gradient Header ──────────────────────────────────── */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 px-4 pt-14 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 50%), radial-gradient(circle at 20% 80%, white 0%, transparent 50%)' }} />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="text-2xl font-black text-white mt-0.5">
              {isNewUser ? `Welcome, ${userName}! 👋` : `Hello, ${userName} 👋`}
            </h1>
            {isNewUser && (
              <p className="text-emerald-100 text-sm mt-1">Let's set up your health profile</p>
            )}
          </div>
          <button
            onClick={() => refetch()}
            title="Refresh data"
            className="mt-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Refresh dashboard"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-12 pb-8 space-y-4">

        {/* ── Profile Setup CTA ────────────────────────────────── */}
        {isNewUser && (
          <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 shadow-lg
            flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Complete your profile</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Get personalised health scores and calorie goals
              </p>
            </div>
            <button
              onClick={() => router.push('/profile-setup')}
              className="flex-shrink-0 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors">
              Set Up
            </button>
          </div>
        )}

        {/* ── Calorie Ring ─────────────────────────────────────── */}
        <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          {hasNoLogs ? (
            <EmptyCalorieState onScan={() => router.push('/scan')} />
          ) : (
            <>
              <CalorieRing
                consumed={data?.totalCalories ?? 0}
                goal={data?.dailyCalorieGoal ?? 2000}
                label="Daily Calories"
              />
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <MacroPill label="Protein" value={data?.totalProtein ?? 0} unit="g" color="text-blue-500" />
                <MacroPill label="Carbs"   value={data?.totalCarbs   ?? 0} unit="g" color="text-amber-500" />
                <MacroPill label="Fat"     value={data?.totalFat     ?? 0} unit="g" color="text-rose-500" />
              </div>
            </>
          )}
        </div>

        {/* ── Meal Streak ──────────────────────────────────────── */}
        <MealStreak />

        {/* ── Last Scanned Shortcut ────────────────────────────── */}
        <LastScanned />

        {/* ── Nutrient Alerts (only if user has logs) ──────────── */}
        {!hasNoLogs && <NutrientAlerts />}

        {/* ── Weekly Chart ─────────────────────────────────────── */}
        {hasNoLogs ? (
          <EmptyWeeklyState />
        ) : (
          <WeeklyChart userId={userId} />
        )}

        {/* ── Recent Meals ─────────────────────────────────────── */}
        {hasNoLogs ? (
          <EmptyMealsState onScan={() => router.push('/scan')} />
        ) : (
          <RecentScans logs={logs} onDelete={handleDelete} />
        )}

      </div>
    </div>
  )
}

function MacroPill({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="text-center">
      <p className={`text-lg font-black tabular-nums ${color}`}>
        {value}<span className="text-xs font-medium">{unit}</span>
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
    </div>
  )
}

function EmptyCalorieState({ onScan }: { onScan: () => void }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="w-20 h-20 rounded-full border-4 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4">
        <Plus className="w-8 h-8 text-gray-300 dark:text-gray-600" />
      </div>
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">No meals logged today</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Scan a product to start tracking</p>
      <button
        onClick={onScan}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors">
        <Scan className="w-4 h-4" /> Scan a Product
      </button>
    </div>
  )
}

function EmptyWeeklyState() {
  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Weekly Overview</p>
      <div className="flex items-end justify-between gap-1 h-24 opacity-30">
        {[42, 28, 55, 35, 62, 20, 48].map((h, i) => (
          <div key={i} className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t-md" style={{ height: `${h}%` }} />
        ))}
      </div>
      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">Log meals to see your weekly trend</p>
    </div>
  )
}

function EmptyMealsState({ onScan }: { onScan: () => void }) {
  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Today's Meals</p>
      <div className="flex flex-col items-center py-8 text-center">
        <p className="text-2xl mb-3">🥗</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your plate is empty</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Scan a product and log it to see it here</p>
        <button
          onClick={onScan}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
          <Scan className="w-4 h-4" /> Start scanning
        </button>
      </div>
    </div>
  )
}