"use client"
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { SkeletonDashboard } from '@/components/Skeleton'
import { event, AnalyticsEvents } from '@/lib/analytics'
import HealthScoreRing from '@/components/HealthScoreRing'
import PageShell from '@/components/PageShell'

interface DashboardData {
  totalCalories:    number
  totalProtein:     number
  totalCarbs:       number
  totalFat:         number
  dailyCalorieGoal: number
  mealCount:        number
  profile:          any
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  const userId = (session as any)?.userId

  const { data, isLoading } = useQuery<DashboardData>({
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

  useEffect(() => {
    if (data?.profile && !data.profile.profile_completed) {
      router.replace('/profile-setup')
    }
  }, [data, router])

  if (status === 'loading' || isLoading) return <SkeletonDashboard />

  const userName  = session?.user?.name?.split(' ')[0] || 'there'
  const consumed  = data?.totalCalories ?? 0
  const goal      = data?.dailyCalorieGoal ?? 2000
  const streak    = streakData?.streak ?? 0
  const bestStreak = streakData?.best ?? 0

  const now  = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const weekValues = [70, 85, 60, 92, 45, 78, 72]

  return (
    <PageShell
      variant="default"
      title="Dashboard"
      right={
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'var(--surface-2)', border: '0.5px solid var(--border-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, color: 'var(--sand)', cursor: 'pointer',
        }}>
          <span>\uD83D\uDD14</span>
        </div>
      }
    >
      <div style={{ textAlign: 'center', padding: '14px 0 8px' }}>
        <span style={{ fontSize: 7, color: 'var(--muted)' }}>Today&apos;s Health Score</span>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
          <HealthScoreRing score={7.2} size="xl" />
        </div>
        <div style={{
          padding: '2px 7px', borderRadius: 20, background: 'rgba(76,107,57,0.12)',
          color: 'var(--moss)', width: 'fit-content', margin: '8px auto 0',
          fontSize: 7, border: '0.5px solid var(--border-2)', whiteSpace: 'nowrap',
        }}>
          ✓ Good overall — {data?.mealCount || 0} items scanned
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, padding: '0 12px', marginBottom: 10 }}>
        {[
          { l: 'Calories', v: consumed.toString(), s: `/ ${goal}` },
          { l: 'Scans', v: (data?.mealCount ?? 0).toString(), s: 'today' },
          { l: 'Streak', v: `${streak} \uD83D\uDD25`, s: 'days' },
        ].map(s => (
          <div key={s.l} style={{
            background: 'var(--surface-2)', borderRadius: 10,
            border: '0.5px solid var(--border-2)', padding: 8, textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: 'var(--foreground)', fontWeight: 700 }}>{s.v}</div>
            <div style={{ fontSize: 6, color: 'var(--foreground)' }}>{s.l}</div>
            <div style={{ fontSize: 6, color: 'var(--muted)' }}>{s.s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', marginBottom: 5, marginTop: 8 }}>
        <span style={{ fontSize: 6.5, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em' }}>THIS WEEK</span>
        <span style={{ fontSize: 7, color: 'var(--clay)', fontWeight: 600 }}>Full report ›</span>
      </div>

      <div style={{
        background: 'var(--surface-2)', borderRadius: 10,
        border: '0.5px solid var(--border-2)', padding: 10,
        margin: '0 12px', marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 52 }}>
          {weekDays.map((d, i) => {
            const today = i === 6
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <div style={{
                  width: '100%', height: `${weekValues[i]}%`, borderRadius: 4,
                  background: today ? 'var(--clay)' : 'var(--surface-3)',
                  border: `0.5px solid ${today ? 'rgba(196,113,74,0.38)' : 'var(--border-2)'}`,
                }} />
                <span style={{ fontSize: 5.5, color: today ? 'var(--clay)' : 'var(--muted)' }}>{d}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', marginBottom: 5, marginTop: 8 }}>
        <span style={{ fontSize: 6.5, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em' }}>RECENT SCANS</span>
        <span style={{ fontSize: 7, color: 'var(--clay)', fontWeight: 600 }}>See all ›</span>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 12px 8px' }}>
        {lastScan ? (
          <div style={{
            background: 'var(--surface-2)', borderRadius: 10,
            border: '0.5px solid var(--border-2)', padding: 8,
            width: 82, flexShrink: 0, textAlign: 'center',
            display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center',
          }}>
            <div style={{ width: 46, height: 46, borderRadius: 10, background: 'var(--surface-3)', border: '0.5px solid var(--border)' }} />
            <span style={{ fontSize: 7, color: 'var(--foreground)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
              {lastScan.product_name || 'Product'}
            </span>
            <span style={{
              padding: '2px 7px', borderRadius: 20,
              background: 'rgba(76,107,57,0.22)', color: 'var(--moss)',
              fontSize: 6.5, fontWeight: 500,
              border: '0.5px solid var(--border-2)', whiteSpace: 'nowrap',
            }}>
              {lastScan.ai_health_score || '—'}/10
            </span>
          </div>
        ) : (
          <div style={{
            background: 'var(--surface-2)', borderRadius: 10,
            border: '0.5px solid var(--border-2)', padding: 8,
            width: 82, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center',
            fontSize: 7, color: 'var(--muted)', fontWeight: 500,
          }}>
            <span style={{ fontSize: 16 }}>\uD83D\uDCF7</span>
            No scans yet
          </div>
        )}
      </div>

      {consumed > goal && (
        <div style={{
          borderRadius: 10,
          border: '0.5px solid var(--border-2)', padding: 10,
          margin: '8px 12px 12px',
          borderLeft: '3px solid var(--risk-red)',
          background: 'rgba(190,66,48,0.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12 }}>⚠️</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 8, color: 'var(--foreground)', fontWeight: 600 }}>High calorie alert</span>
              <span style={{ fontSize: 7, color: 'var(--muted)' }}>Exceeded daily goal by {consumed - goal} kcal</span>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
