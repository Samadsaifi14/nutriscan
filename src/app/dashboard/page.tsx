"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CalorieRing } from '@/components/dashboard/CalorieRing'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { RecentScans } from '@/components/dashboard/RecentScans'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [todayCalories, setTodayCalories] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dailyGoal, setDailyGoal] = useState(2000)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    if (status === 'authenticated') {
      fetchData()
    }
  }, [status])

  async function fetchData() {
    const userId = (session as any)?.userId

    if (!userId) {
      setLoading(false)
      return
    }

    // Get user profile for personalised calorie goal
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('daily_calorie_goal, profile_completed')
      .eq('user_id', userId)
      .single()

    // Redirect to profile setup if not completed
    if (profile && !profile.profile_completed) {
      router.push('/profile-setup')
      return
    }

    if (profile?.daily_calorie_goal) {
      setDailyGoal(profile.daily_calorie_goal)
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { data: todayLogs } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', todayStart.toISOString())
      .order('logged_at', { ascending: false })

    const totalToday = todayLogs?.reduce(
      (sum, log) => sum + (log.calories || 0), 0
    ) || 0

    setTodayCalories(totalToday)

    const { data: recentLogs } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(10)

    setLogs(recentLogs || [])
    setLoading(false)
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        color: '#6b7280',
        fontSize: '15px'
      }}>
        Loading your dashboard...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0fdf4',
      fontFamily: 'sans-serif',
      padding: '24px 16px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>
              Hello, {session?.user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => router.push('/profile-setup')}
              style={{
                padding: '10px 14px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⚙️
            </button>
            <button
              onClick={() => router.push('/scan')}
              style={{
                padding: '10px 16px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📷 Scan
            </button>
          </div>
        </div>

        {/* Personalised calorie goal indicator */}
        {dailyGoal !== 2000 && (
          <div style={{
            padding: '10px 14px',
            background: '#f0fdf4',
            borderRadius: '10px',
            border: '1px solid #bbf7d0',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            🎯 Your personalised daily goal: <strong>{dailyGoal} kcal</strong>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <CalorieRing
            consumed={todayCalories}
            goal={dailyGoal}
            label="Today's Calories"
          />

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Meals today</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>
                {logs.filter(l => {
                  const today = new Date().toDateString()
                  return new Date(l.logged_at).toDateString() === today
                }).length}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Daily goal</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a' }}>
                {dailyGoal}
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <WeeklyChart />
        </div>

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
