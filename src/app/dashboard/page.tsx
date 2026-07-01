'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { HealthScoreRing } from '@/components/HealthScoreRing'
import { Pill } from '@/components/Pill'
import { ProductCard } from '@/components/ProductCard'
import { SkeletonDashboard } from '@/components/Skeleton'
import { Camera, TrendingUp, Award, Zap } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard')
      if (!res.ok) throw new Error('Failed to load')
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <PageShell title="Dashboard" showBack={false}>
        <SkeletonDashboard />
      </PageShell>
    )
  }

  const name = session?.user?.name?.split(' ')[0] ?? 'there'
  const stats = [
    { label: 'Products Scanned', value: dashboard?.totalScans ?? 0, icon: <Camera size={16} /> },
    { label: 'Avg. Health Score', value: dashboard?.avgScore ?? '—', icon: <TrendingUp size={16} /> },
    { label: 'Day Streak', value: dashboard?.streak ?? 0, icon: <Award size={16} /> },
    { label: 'This Week', value: dashboard?.thisWeek ?? 0, icon: <Zap size={16} /> },
  ]

  return (
    <PageShell title="Dashboard">
      <div className="section-header" style={{ marginTop: 0 }}>
        <span className="text-body" style={{ color: 'var(--sand)' }}>Hi, {name}</span>
      </div>

      <div className="card row--md" style={{ marginBottom: 20, background: 'linear-gradient(135deg, var(--clay-bg), var(--surface-2))' }}>
        <HealthScoreRing score={dashboard?.overallScore ?? 7} size="lg" />
        <div className="stack--sm">
          <span className="text-sm" style={{ fontWeight: 700 }}>Overall Health Score</span>
          <span className="text-xs" style={{ color: 'var(--sand)' }}>Based on your last 30 scans</span>
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
        <span className="section-header__title">Recent Scans</span>
        <button className="section-header__action" onClick={() => router.push('/scan-history')}>
          See all
        </button>
      </div>

      <div className="stack--sm">
        {dashboard?.recentScans?.length > 0 ? (
          dashboard.recentScans.map((scan: Record<string, unknown>, i: number) => (
            <ProductCard
              key={i}
              product={scan.product as { name: string; brand: string; image_url?: string }}
              analysis={scan.analysis as { health_score: number; health_rating: 'healthy' | 'moderate' | 'unhealthy' }}
              onClick={() => router.push('/results')}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon"><Camera size={24} /></div>
            <p className="text-sm" style={{ fontWeight: 600, color: 'var(--cream)' }}>No scans yet</p>
            <p className="text-xs" style={{ color: 'var(--sand)', marginTop: 4 }}>
              Scan your first product to get started
            </p>
            <button className="btn btn--primary btn--sm" style={{ marginTop: 12 }} onClick={() => router.push('/scan')}>
              <Camera size={16} /> Scan Now
            </button>
          </div>
        )}
      </div>
    </PageShell>
  )
}
