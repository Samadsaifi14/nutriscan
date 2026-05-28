"use client"

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import RouteErrorBoundary from '@/components/RouteErrorBoundary'

export default function InsightsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['nutrients-summary'],
    queryFn: async () => {
      const res = await fetch('/api/nutrients/summary')
      return res.json()
    },
  })

  const summary = data?.data
  const alerts = summary?.alerts || []

  return (
    <RouteErrorBoundary>
      <div className="min-h-screen bg-[var(--background)] px-4 pt-10 pb-24">
        <h1 className="text-2xl font-black mb-1">Weekly insights</h1>
        <p className="text-sm text-[var(--muted)] mb-6">Your nutrition over the last 7 days</p>

        {isLoading && <p className="text-sm text-[var(--muted)]">Loading...</p>}

        {!isLoading && !summary && (
          <div className="text-center py-12">
            <p className="text-sm text-[var(--muted)] mb-4">Log meals this week to see personalized insights.</p>
            <Link href="/scan" className="text-emerald-600 font-semibold text-sm">
              Scan your first meal →
            </Link>
          </div>
        )}

        {summary && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Avg calories', value: summary.avg?.calories, unit: 'kcal' },
                { label: 'Avg protein', value: summary.avg?.protein, unit: 'g' },
                { label: 'Avg carbs', value: summary.avg?.carbs, unit: 'g' },
                { label: 'Avg fat', value: summary.avg?.fat, unit: 'g' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
                  <p className="text-xs text-[var(--muted)]">{item.label}</p>
                  <p className="text-xl font-black">
                    {item.value ?? '—'}
                    <span className="text-sm font-normal text-[var(--muted)]"> {item.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            {alerts.length > 0 && (
              <section>
                <h2 className="text-sm font-bold mb-2">Alerts</h2>
                <ul className="space-y-2">
                  {alerts.map((a: { message: string; severity: string }, i: number) => (
                    <li
                      key={i}
                      className={`p-3 rounded-xl text-sm border ${
                        a.severity === 'high'
                          ? 'border-red-500/30 bg-red-500/5 text-red-700 dark:text-red-300'
                          : 'border-amber-500/30 bg-amber-500/5'
                      }`}
                    >
                      {a.message}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <p className="text-xs text-[var(--muted)] mt-6">
              Based on {summary.daysLogged ?? 0} day(s) of logged meals. Enable weekly emails in Profile.
            </p>
          </>
        )}
      </div>
    </RouteErrorBoundary>
  )
}
