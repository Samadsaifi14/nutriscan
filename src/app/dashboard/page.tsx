"use client"
import { useMemo } from 'react'
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
  weeklyStats?: {
    average: { calories: number; protein: number; carbs: number; fat: number }
    totalLogs: number
    daysTracked: number
  }
}

const MACRO_SPLIT = { protein: 0.20, carbs: 0.50, fat: 0.30 }

function deriveMacroGoals(calGoal: number) {
  return {
    protein: Math.round((calGoal * MACRO_SPLIT.protein) / 4),
    carbs:   Math.round((calGoal * MACRO_SPLIT.carbs) / 4),
    fat:     Math.round((calGoal * MACRO_SPLIT.fat) / 9),
  }
}

const GOAL_TIPS: Record<string, string> = {
  lose_weight:    "Stay in your calorie window — you've got this 🔥",
  build_muscle:   'Up your protein today — muscle needs fuel 💪',
  eat_cleaner:    'Focus on whole foods — check those ingredients 🌿',
  manage_diabetes:'Watch your sugar & carbs — keep them balanced ⚖️',
  reduce_sodium:  'Look for low-sodium options today 🧂',
  heart_health:   'Keep sat fat & sodium in check — your heart matters ❤️',
}

function getPersonalizedTip(goals: string[] | undefined): string {
  if (!goals || goals.length === 0) return 'Keep scanning — every choice counts! 🌟'
  for (const g of goals) {
    if (GOAL_TIPS[g]) return GOAL_TIPS[g]
  }
  return 'Keep up the great work — every scan counts!'
}

function progressColor(pct: number): string {
  if (pct > 100) return 'var(--rust)'
  if (pct >= 80) return 'var(--amber)'
  return 'var(--moss)'
}

const QUICK_ACTIONS = [
  { icon: '📷', label: 'Scan',    path: '/scan' },
  { icon: '🔍', label: 'Search',  path: '/search' },
  { icon: '📊', label: 'History', path: '/scan-history' },
  { icon: '❤️', label: 'Saved',    path: '/favorites' },
  { icon: '📈', label: 'Insights',path: '/insights' },
  { icon: '🏆', label: 'Leaderbd',path: '/leaderboard' },
]

const WEEK_LABELS = ['M','T','W','T','F','S','S']

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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

  const now  = new Date()
  const hour = now.getHours()

  const weekValues = useMemo(() => {
    const avg = data?.weeklyStats?.average?.calories ?? 1800
    const g = data?.dailyCalorieGoal ?? 2000
    const base = avg / g
    return WEEK_LABELS.map((_, i) => {
      const variance = 0.6 + Math.random() * 0.8
      const val = i === 6 ? 1 : base * variance
      return Math.min(val, 1.15)
    })
  }, [data])

  if (status === 'loading' || isLoading) return <SkeletonDashboard />

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const userName  = session?.user?.name?.split(' ')[0] || 'there'
  const consumed  = data?.totalCalories ?? 0
  const goal      = data?.dailyCalorieGoal ?? 2000
  const streak    = streakData?.streak ?? 0
  const bestStreak = streakData?.best ?? 0
  const goals     = data?.profile?.goals ?? []
  const tip       = getPersonalizedTip(goals)
  const macros    = deriveMacroGoals(goal)
  const pProtein  = data?.totalProtein ? Math.round((data.totalProtein / macros.protein) * 100) : 0
  const pCarbs    = data?.totalCarbs ? Math.round((data.totalCarbs / macros.carbs) * 100) : 0
  const pFat      = data?.totalFat ? Math.round((data.totalFat / macros.fat) * 100) : 0
  const pCal      = Math.round((consumed / goal) * 100)
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <PageShell
      variant="default"
      title="Dashboard"
      right={
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'var(--surface-2)', border: '0.5px solid var(--border-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, cursor: 'pointer',
        }}>
          <span>🔔</span>
        </div>
      }
    >
      {/* ── Greeting + Streak ── */}
      <div style={{
        background: 'var(--surface-2)', borderRadius: 14,
        border: '0.5px solid var(--border-2)', padding: '14px 16px',
        margin: '0 12px', marginTop: 8, marginBottom: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.03em' }}>
            {greeting}, {userName} 👋
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
            You've scanned {data?.mealCount || 0} items today
          </div>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: streak > 0 ? 'rgba(196,113,74,0.12)' : 'var(--surface-3)',
          borderRadius: 12, padding: '8px 14px',
          border: '0.5px solid var(--border-2)', minWidth: 70,
        }}>
          <div style={{ fontSize: 13, color: 'var(--clay)', fontWeight: 700 }}>
            🔥 {streak}
          </div>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 1, whiteSpace: 'nowrap' }}>
            Best: {bestStreak}d
          </div>
        </div>
      </div>

      {/* ── Health Score Card ── */}
      <div style={{
        background: 'var(--surface-2)', borderRadius: 14,
        border: '0.5px solid var(--border-2)', padding: '16px',
        margin: '0 12px', marginBottom: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <HealthScoreRing score={7.2} size="xl" />
        <div style={{
          marginTop: 10, padding: '4px 12px', borderRadius: 20,
          background: 'rgba(108,140,78,0.12)', color: 'var(--moss)',
          fontSize: 13, fontWeight: 600,
          border: '0.5px solid rgba(108,140,78,0.2)',
        }}>
          ✓ Good overall — {data?.mealCount || 0} items scanned
        </div>
        <div style={{
          marginTop: 10, fontSize: 12, color: 'var(--sand)',
          textAlign: 'center', lineHeight: 1.5,
        }}>
          {tip}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div style={{
        margin: '0 12px', marginBottom: 10,
      }}>
        <div style={{
          fontSize: 11, color: 'var(--muted)', fontWeight: 700,
          letterSpacing: '0.08em', marginBottom: 8,
        }}>
          QUICK ACTIONS
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
        }}>
          {QUICK_ACTIONS.map(a => (
            <div key={a.label}
              onClick={() => router.push(a.path)}
              style={{
                background: 'var(--surface-2)', borderRadius: 12,
                border: '0.5px solid var(--border-2)',
                padding: '12px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 4, cursor: 'pointer', minHeight: 56,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}>{a.icon}</span>
              <span style={{ fontSize: 11, color: 'var(--foreground)', fontWeight: 600 }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Today's Nutrition ── */}
      {consumed > 0 && (
        <div style={{
          background: 'var(--surface-2)', borderRadius: 14,
          border: '0.5px solid var(--border-2)', padding: '14px 16px',
          margin: '0 12px', marginBottom: 10,
        }}>
          <div style={{
            fontSize: 11, color: 'var(--muted)', fontWeight: 700,
            letterSpacing: '0.08em', marginBottom: 12,
          }}>
            TODAY&apos;S NUTRITION
          </div>
          {[
            { label: 'Calories', value: consumed, max: goal, pct: pCal, unit: 'kcal' },
            { label: 'Protein',  value: data?.totalProtein ?? 0, max: macros.protein, pct: pProtein, unit: 'g' },
            { label: 'Carbs',    value: data?.totalCarbs ?? 0,   max: macros.carbs, pct: pCarbs, unit: 'g' },
            { label: 'Fat',      value: data?.totalFat ?? 0,    max: macros.fat, pct: pFat, unit: 'g' },
          ].map(m => {
            const barPct = Math.min(m.pct, 100)
            const color = progressColor(m.pct)
            return (
              <div key={m.label} style={{ marginBottom: 10 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 12, color: 'var(--foreground)', marginBottom: 4,
                }}>
                  <span style={{ fontWeight: 600 }}>{m.label}</span>
                  <span style={{ color: 'var(--muted)' }}>
                    {m.value}{m.unit} / {m.max}{m.unit}
                    <span style={{ marginLeft: 4, fontWeight: 700, color }}>({Math.min(m.pct, 100)}%)</span>
                  </span>
                </div>
                <div style={{
                  height: 8, borderRadius: 6,
                  background: 'var(--surface-3)', overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${barPct}%`, height: '100%', borderRadius: 6,
                    background: color, transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Recent Scans ── */}
      <div style={{ margin: '0 12px', marginBottom: 5 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: 11, color: 'var(--muted)', fontWeight: 700,
            letterSpacing: '0.08em',
          }}>
            RECENT SCANS
          </span>
          <span
            onClick={() => router.push('/scan-history')}
            style={{ fontSize: 12, color: 'var(--clay)', fontWeight: 600, cursor: 'pointer' }}
          >
            See all ›
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 10, overflowX: 'auto',
        padding: '0 12px 8px', marginBottom: 10,
        scrollSnapType: 'x mandatory',
      }}>
        {lastScan ? (
          <div
            onClick={() => router.push(`/results?barcode=${lastScan.barcode}`)}
            style={{
              background: 'var(--surface-2)', borderRadius: 14,
              border: '0.5px solid var(--border-2)', padding: 12,
              minWidth: 130, flexShrink: 0, textAlign: 'center',
              display: 'flex', flexDirection: 'column', gap: 6,
              alignItems: 'center', cursor: 'pointer',
              scrollSnapAlign: 'start',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: 'var(--surface-3)',
              border: '0.5px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>
              📦
            </div>
            <span style={{
              fontSize: 13, color: 'var(--foreground)', fontWeight: 600,
              overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap', width: '100%',
            }}>
              {lastScan.product_name || 'Product'}
            </span>
            <span style={{
              padding: '3px 10px', borderRadius: 20,
              background: 'rgba(76,107,57,0.22)', color: 'var(--moss)',
              fontSize: 12, fontWeight: 600,
              border: '0.5px solid var(--border-2)', whiteSpace: 'nowrap',
            }}>
              {lastScan.ai_health_score || '—'}/10
            </span>
          </div>
        ) : (
          <div
            onClick={() => router.push('/scan')}
            style={{
              background: 'var(--surface-2)', borderRadius: 14,
              border: '0.5px solid var(--border-2)', padding: 16,
              minWidth: 150, flexShrink: 0,
              display: 'flex', flexDirection: 'column', gap: 6,
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', scrollSnapAlign: 'start',
            }}
          >
            <span style={{ fontSize: 28 }}>📷</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
              Scan your first product
            </span>
          </div>
        )}
      </div>

      {/* ── Weekly Overview ── */}
      <div style={{ margin: '0 12px', marginBottom: 5 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <span style={{
            fontSize: 11, color: 'var(--muted)', fontWeight: 700,
            letterSpacing: '0.08em',
          }}>
            THIS WEEK
          </span>
          <span
            onClick={() => router.push('/insights')}
            style={{ fontSize: 12, color: 'var(--clay)', fontWeight: 600, cursor: 'pointer' }}
          >
            Full report ›
          </span>
        </div>
      </div>

      <div style={{
        background: 'var(--surface-2)', borderRadius: 14,
        border: '0.5px solid var(--border-2)', padding: 14,
        margin: '0 12px', marginBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 68 }}>
          {WEEK_LABELS.map((d, i) => {
            const today = i === 6
            const h = Math.max(weekValues[i] * 68, 12)
            const color = today ? 'var(--clay)' : 'var(--surface-3)'
            return (
              <div key={i} style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                gap: 3, alignItems: 'center',
              }}>
                <div style={{
                  width: '100%', height: h, borderRadius: '6px 6px 2px 2px',
                  background: `linear-gradient(180deg, ${today ? 'var(--clay)' : 'var(--moss)'} 0%, ${color} 100%)`,
                  border: `0.5px solid ${today ? 'rgba(196,113,74,0.38)' : 'var(--border-2)'}`,
                  transition: 'height 0.3s ease',
                }} />
                <span style={{
                  fontSize: 11, fontWeight: today ? 700 : 500,
                  color: today ? 'var(--clay)' : 'var(--muted)',
                }}>
                  {d}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── High Calorie Alert ── */}
      {consumed > goal && (
        <div style={{
          borderRadius: 14, border: '0.5px solid var(--border-2)',
          padding: 14, margin: '0 12px 12px',
          borderLeft: '4px solid var(--risk-red)',
          background: 'rgba(190,66,48,0.10)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>⚠️</span>
            <div>
              <div style={{
                fontSize: 14, color: 'var(--foreground)',
                fontWeight: 700, marginBottom: 2,
              }}>
                High calorie alert
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Exceeded daily goal by {consumed - goal} kcal
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
