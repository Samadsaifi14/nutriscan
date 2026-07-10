'use client'

import { useQuery } from '@tanstack/react-query'
import { PageShell } from '@/components/PageShell'
import { SkeletonCard } from '@/components/Skeleton'
import { Award, Trophy, Medal } from 'lucide-react'

const RANK_ICONS = [<Trophy key={0} size={16} color="var(--amber)" />, <Medal key={1} size={16} color="var(--sand)" />, <Medal key={2} size={16} color="var(--muted)" />]

export default function Leaderboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await fetch('/api/leaderboard')
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
  })

  const users = data?.leaderboard ?? []

  return (
    <PageShell title="Leaderboard" showBack>
      {isLoading ? (
        <div className="stack--sm">{Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : (
        <div className="stack--sm">
          {users.length === 0 ? (
            <div className="empty-state" style={{ minHeight: '60dvh', justifyContent: 'center' }}>
              <div className="empty-state__icon"><Award size={24} /></div>
              <p className="text-sm" style={{ fontWeight: 600 }}>No rankings yet</p>
              <p className="text-xs text-sand">Be the first to scan products</p>
            </div>
          ) : (
            users.map((u: Record<string, unknown>, i: number) => (
              <div key={i} className="card card--sm row--md" style={{ justifyContent: 'space-between' }}>
                <div className="row--md">
                  <div style={{ width: 28, textAlign: 'center', fontSize: 13, fontWeight: 700, color: i < 3 ? 'var(--clay)' : 'var(--muted)' }}>
                    {RANK_ICONS[i] ?? <span style={{ color: 'var(--muted)' }}>{i + 1}</span>}
                  </div>
                  <div className="avatar avatar--sm" style={{ background: 'var(--surface-3)' }} />
                  <span className="text-sm" style={{ fontWeight: 600 }}>{String(u.name ?? '')}</span>
                </div>
                <span className="text-sm text-mono" style={{ fontWeight: 700, color: 'var(--clay)' }}>{String(u.score ?? '')}</span>
              </div>
            ))
          )}
        </div>
      )}
    </PageShell>
  )
}
