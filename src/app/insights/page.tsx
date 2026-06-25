"use client"

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import HealthScoreRing from '@/components/HealthScoreRing'
import PageShell from '@/components/PageShell'

export default function InsightsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['nutrients-summary'],
    queryFn: async () => {
      const res = await fetch('/api/nutrients/summary')
      if (!res.ok) throw new Error('Failed to fetch insights')
      return res.json()
    },
  })

  const summary = data?.data

  return (
    <PageShell variant="default" title="Insights" right={<span className="text-sm text-[var(--sand)]">📅</span>}>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-4 space-y-4">

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-20 bg-[var(--surface)] border border-[var(--border)] rounded-xl animate-pulse" />
            <div className="h-24 bg-[var(--surface)] border border-[var(--border)] rounded-xl animate-pulse" />
          </div>
        ) : !summary ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="text-4xl block mb-3">📊</span>
            <p className="text-sm font-bold text-[var(--foreground)] mb-1">No data yet</p>
            <p className="text-xs text-[var(--sand)] mb-4">Log meals this week to see insights</p>
            <Link href="/scan" className="text-xs text-[var(--clay)] underline font-medium">Scan your first meal →</Link>
          </div>
        ) : (
          <>
            {/* Monthly card */}
            <div className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3">
              <HealthScoreRing score={summary.avg?.overall != null ? Math.round(summary.avg.overall) : 6.4} size="lg" />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[var(--sand)]">Monthly average</span>
                <span className="text-sm font-bold text-[var(--foreground)]">
                  {summary.avg?.overall != null ? Math.round(summary.avg.overall * 10) / 10 : '6.4'} / 10
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--amber)]/15 text-[var(--amber)] border border-[var(--amber)]/25 w-fit">
                  ↑ 0.3 vs last month
                </span>
              </div>
            </div>

            {/* Nutrient grid */}
            <div>
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider px-1 mb-2 block">Nutrient averages</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l: 'Avg. Sodium', v: summary.avg?.sodium != null ? `${Math.round(summary.avg.sodium)}mg` : '786mg', s: '37% RDA', c: 'var(--amber)' },
                  { l: 'Avg. Sugar', v: summary.avg?.sugar != null ? `${Math.round(summary.avg.sugar)}g` : '22g', s: '44% RDA', c: 'var(--rust)' },
                  { l: 'Avg. Protein', v: summary.avg?.protein != null ? `${Math.round(summary.avg.protein)}g` : '14g', s: '28% RDA', c: 'var(--moss)' },
                  { l: 'Avg. Fibre', v: summary.avg?.fiber != null ? `${Math.round(summary.avg.fiber)}g` : '4.2g', s: '17% RDA', c: 'var(--clay)' },
                ].map(s => (
                  <div key={s.l} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3" style={{ borderTop: `2px solid ${s.c}` }}>
                    <div className="text-xs font-bold" style={{ color: s.c }}>{s.v}</div>
                    <div className="text-xs text-[var(--foreground)]">{s.l}</div>
                    <div className="text-xs text-[var(--sand)]">{s.s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            {summary.alerts?.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider px-1 mb-2 block">Alerts</span>
                {summary.alerts.map((a: { message: string; severity: string }, i: number) => (
                  <div key={i}
                    className="px-3 py-2 rounded-xl border text-xs"
                    style={{
                      borderColor: a.severity === 'high' ? 'var(--rust)' : 'var(--amber)',
                      background: a.severity === 'high' ? 'rgba(190,66,48,0.08)' : 'rgba(217,140,42,0.08)',
                      color: a.severity === 'high' ? 'var(--rust)' : 'var(--amber)',
                    }}>
                    {a.message}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </PageShell>
  )
}
