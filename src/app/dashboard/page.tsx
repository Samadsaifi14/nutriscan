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

function MacroChart({ protein, carbs, fat }: { protein: number, carbs: number, fat: number }) {
  const total = protein + carbs + fat
  if (total === 0) return null

  const proteinPct = Math.round((protein / total) * 100)
  const carbsPct = Math.round((carbs / total) * 100)
  const fatPct = 100 - proteinPct - carbsPct

  const segments = [
    { label: 'Protein', pct: proteinPct, color: '#16a34a', value: Math.round(protein) },
    { label: 'Carbs', pct: carbsPct, color: '#3b82f6', value: Math.round(carbs) },
    { label: 'Fat', pct: fatPct, color: '#f59e0b', value: Math.round(fat) },
  ]

  // Build SVG pie chart
  let currentAngle = -90
  const cx = 50, cy = 50, r = 40

  function polarToCartesian(angle: number) {
    const rad = (angle * Math.PI) / 180
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    }
  }

  function buildArc(startAngle: number, pct: number) {
    const endAngle = startAngle + (pct / 100) * 360
    const start = polarToCartesian(startAngle)
    const end = polarToCartesian(endAngle - 0.01)
    const largeArc = pct > 50 ? 1 : 0
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
  }

  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--card-border)]">
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
        🥩 Today&apos;s Macros
      </h3>
      <div className="flex items-center gap-4">
        <svg width="100" height="100" viewBox="0 0 100 100" className="flex-shrink-0">
          {total > 0 && segments.map((seg, i) => {
            if (seg.pct === 0) return null
            const path = buildArc(currentAngle, seg.pct)
            currentAngle += (seg.pct / 100) * 360
            return <path key={i} d={path} fill={seg.color} />
          })}
          <circle cx={cx} cy={cy} r={25} fill="var(--card)" />
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="10" fill="var(--foreground)" fontWeight="600">
            {Math.round(total)}g
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="7" fill="var(--muted)">
            total
          </text>
        </svg>

        <div className="flex-1 space-y-2">
          {segments.map(seg => (
            <div key={seg.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: seg.color }} />
                <span className="text-xs text-[var(--muted)]">{seg.label}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[var(--foreground)]">
                  {seg.value}g
                </span>
                <span className="text-xs text-[var(--muted)] ml-1">
                  {seg.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
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

  // React Query — caches dashboard data for 5 minutes
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', userId],
    queryFn: async () => {
      if (!userId) return null

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('daily_calorie_goal, profile_completed')
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

  const todayMeals = todayLogs.filter((l: any) =>
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

        {dailyGoal !== 2000 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl mb-4 text-sm text-green-700 dark:text-green-400">
            🎯 Your daily goal: <span className="font-bold">{dailyGoal} kcal</span>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <CalorieRing consumed={todayCalories} goal={dailyGoal} label="Today's Calories" />
          <div className="bg-[var(--card)] rounded-2xl p-5 shadow-sm border border-[var(--card-border)] flex flex-col justify-center gap-4">
            <div>
              <p className="text-xs text-[var(--muted)] mb-1">Meals today</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">{todayMeals}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted)] mb-1">Daily goal</p>
              <p className="text-3xl font-bold text-green-600">{dailyGoal}</p>
            </div>
          </div>
        </div>

        {/* Macro chart */}
        {todayCalories > 0 && (
          <div className="mb-4">
            <MacroChart
              protein={todayProtein}
              carbs={todayCarbs}
              fat={todayFat}
            />
          </div>
        )}

        {/* Weekly chart */}
        <div className="mb-4">
          <WeeklyChart />
        </div>

        {/* Recent meals */}
        <RecentScans
          logs={recentLogs}
          onDelete={(id) => {
            queryClient.invalidateQueries({ queryKey: ['dashboard', userId] })
            toast.success('Meal removed')
          }}
        />

      </div>
    </div>
  )
}