"use client"
import { useSession } from 'next-auth/react'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import HealthScoreRing from '@/components/HealthScoreRing'
import PageShell from '@/components/PageShell'

export default function ScanHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const userId = (session as any)?.userId

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['scan-history', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('scan_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('scanned_at', { ascending: false })
        .limit(50)
      if (error) {
        console.log('Scan history error:', error.message)
        return []
      }
      return data || []
    },
    enabled: !!userId,
  })

  const grouped = useMemo(() => {
    if (!sessions) return []
    const groups: { label: string; items: any[] }[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    sessions.forEach((s: any) => {
      const d = new Date(s.scanned_at)
      d.setHours(0, 0, 0, 0)
      let label: string
      if (d.getTime() === today.getTime()) label = 'Today'
      else if (d.getTime() === yesterday.getTime()) label = 'Yesterday'
      else label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      let g = groups.find(g => g.label === label)
      if (!g) { g = { label, items: [] }; groups.push(g) }
      g.items.push(s)
    })
    return groups
  }, [sessions])

  const scoreColorVar = (s: number) => s >= 7 ? 'var(--moss)' : s >= 5 ? 'var(--amber)' : 'var(--rust)'

  return (
    <PageShell variant="default" title="Scan History" showBack right={<span className="text-sm text-[var(--sand)]">⬇️</span>}>
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 space-y-4 pb-4">

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-[var(--surface)] border border-[var(--border)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3">🔍</span>
            <p className="text-sm font-bold text-[var(--foreground)] mb-1">No products scanned yet</p>
            <p className="text-xs text-[var(--sand)] mb-4">Scan a product to see its history here</p>
            <button onClick={() => router.push('/scan')}
              className="px-5 py-2 bg-[var(--clay)] text-white font-bold rounded-xl text-xs">
              📷 Scan a product
            </button>
          </div>
        ) : (
          grouped.map(g => (
            <div key={g.label}>
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--surface-2)] text-[var(--sand)] border border-[var(--border-2)] mb-2 ml-1">
                {g.label}
              </span>
              <div className="space-y-1">
                {g.items.map((s: any) => {
                  const score = s.ai_health_score != null ? Number(s.ai_health_score) : null
                  return (
                    <button key={s.id} onClick={() => router.push(`/results?barcode=${s.barcode}`)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-left transition-colors hover:border-[var(--clay)]/30"
                      style={score != null ? { borderLeft: `3px solid ${scoreColorVar(score)}` } : undefined}>
                      <div className="w-10 h-10 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <span className="text-base">🏷️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--foreground)] truncate">{s.product_name || 'Unknown Product'}</p>
                        <p className="text-[10px] text-[var(--sand)]">
                          {new Date(s.scanned_at).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {score != null && (
                        <HealthScoreRing score={score} size="md" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        )}

      </div>
    </PageShell>
  )
}
