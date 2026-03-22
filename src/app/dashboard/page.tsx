"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CalorieRing } from '@/components/dashboard/CalorieRing'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { RecentScans } from '@/components/dashboard/RecentScans'

const DAILY_GOAL = 2000

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [logs, setLogs] = useState<any[]>([])
  const [todayCalories, setTodayCalories] = useState(0)
  const [loading, setLoading] = useState(true)

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
    console.log('Session:', JSON.stringify(session))
    console.log('UserId:', userId)

    if (!userId) {
      console.log('No userId found — stopping')
      setLoading(false)
      return
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    console.log('Fetching today logs for:', userId)

    const { data: todayLogs, error: todayError } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', todayStart.toISOString())
      .order('logged_at', { ascending: false })

    console.log('Today logs:', todayLogs, 'Error:', todayError)

    const totalToday = todayLogs?.reduce(
      (sum, log) => sum + (log.calories || 0), 0
    ) || 0

    setTodayCalories(totalToday)

    const { data: recentLogs, error: recentError } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(10)

    console.log('Recent logs:', recentLogs, 'Error:', recentError)

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

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <CalorieRing
            consumed={todayCalories}
            goal={DAILY_GOAL}
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
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Total logged</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#16a34a' }}>
                {logs.length}
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <WeeklyChart />
        </div>

        <RecentScans logs={logs} />

      </div>
    </div>
  )
}