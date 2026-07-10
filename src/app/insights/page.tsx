'use client'

import { useQuery } from '@tanstack/react-query'
import { PageShell } from '@/components/PageShell'
import { HealthScoreRing } from '@/components/HealthScoreRing'
import { SkeletonDashboard } from '@/components/Skeleton'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function Insights() {
  const { data, isLoading } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard')
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
  })

  if (isLoading) return <PageShell title="Insights" showBack><SkeletonDashboard /></PageShell>

  const stats = [
    { label: 'Avg. Score', value: data?.avgScore ?? '—', icon: <Activity size={16} /> },
    { label: 'Best Week', value: data?.bestWeek ?? '—', icon: <TrendingUp size={16} /> },
    { label: 'Trend', value: data?.trend ?? 'stable', icon: <TrendingDown size={16} /> },
  ]

  return (
    <PageShell title="Insights" showBack>
      <div className="card row--md" style={{ marginBottom: 16, background: 'linear-gradient(135deg, var(--clay-bg), var(--surface-2))' }}>
        <HealthScoreRing score={data?.overallScore ?? 7} size="md" />
        <div className="stack--sm">
          <span className="text-sm" style={{ fontWeight: 700 }}>Monthly Overview</span>
          <span className="text-xs" style={{ color: 'var(--sand)' }}>{data?.monthLabel ?? 'This month'}</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card row--sm" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
            <div className="icon-btn" style={{ color: 'var(--clay)' }}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <span className="section-header__title">Weekly Breakdown</span>
        <span className="section-header__action">{data?.thisWeek ?? 0} scans</span>
      </div>
      <div className="h-scroll">
        {(() => {
          const week = data?.weeklyBreakdown ?? [0, 0, 0, 0, 0, 0, 0]
          const max = Math.max(1, ...week)
          const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
          return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="scroll-card">
              <div className="scroll-card__thumb" style={{ height: 64, display: 'flex', alignItems: 'flex-end', padding: 4 }}>
                <div style={{
                  width: '100%', height: `${Math.round((week[i]! / max) * 100)}%`, borderRadius: 6,
                  background: i === todayIdx ? 'var(--clay)' : 'var(--surface-3)',
                  transition: 'height 0.5s',
                }} />
              </div>
              <span className="scroll-card__name" style={{ textAlign: 'center', fontSize: 10 }}>{day}</span>
            </div>
          ))
        })()}
      </div>
    </PageShell>
  )
}
