"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import HealthScoreRing from '@/components/HealthScoreRing'
import PageShell from '@/components/PageShell'

interface Favorite {
  id: string
  product_name: string
  barcode?: string
  calories_per_100g?: number
  protein_per_100g?: number
  carbs_per_100g?: number
  fat_per_100g?: number
  health_score?: number | null
}

export default function FavoritesPage() {
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch('/api/favorites')
      const json = await res.json()
      return (json.data || []) as Favorite[]
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/favorites?id=${id}`, { method: 'DELETE' })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] })
      toast.success('Removed')
    },
  })

  return (
    <PageShell variant="default" title="Saved" right={<span className="text-sm text-[var(--sand)]">⚙️</span>}>
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 animate-pulse flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)]" />
                <div className="h-3 bg-[var(--surface-2)] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl block mb-4">🔖</span>
            <p className="text-sm font-bold text-[var(--foreground)] mb-1">No saved products yet</p>
            <p className="text-xs text-[var(--sand)] mb-4">Save products from scan results</p>
            <button onClick={() => router.push('/scan')}
              className="px-5 py-2 border border-[var(--clay)] text-[var(--clay)] font-bold rounded-xl text-xs bg-transparent">
              📷 Scan to add
            </button>
          </div>
        ) : (
          <>
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider px-1 mb-2 block">
              {data.length} product{data.length !== 1 ? 's' : ''} saved
            </span>
            <div className="grid grid-cols-2 gap-3">
              {data.map((f) => (
                <div key={f.id}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
                    <span className="text-lg">🏷️</span>
                  </div>
                  <span className="text-xs font-bold text-[var(--foreground)] leading-tight line-clamp-2">{f.product_name}</span>
                  {f.health_score != null ? (
                    <HealthScoreRing score={Number(f.health_score)} size="xs" />
                  ) : (
                    <span className="text-[10px] text-[var(--sand)]">No score</span>
                  )}
                  <div className="flex gap-1.5 mt-1">
                    {f.barcode && (
                      <button onClick={() => router.push(`/results?barcode=${f.barcode}`)}
                        className="text-[9px] px-2 py-1 rounded-md bg-[var(--clay)]/10 text-[var(--clay)] font-medium">
                        View
                      </button>
                    )}
                    <button onClick={() => remove.mutate(f.id)}
                      className="text-[9px] px-2 py-1 rounded-md bg-[var(--surface-2)] text-[var(--sand)] font-medium border border-[var(--border-2)]">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PageShell>
  )
}
