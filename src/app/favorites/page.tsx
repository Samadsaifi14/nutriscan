"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import RouteErrorBoundary from '@/components/RouteErrorBoundary'

interface Favorite {
  id: string
  product_name: string
  barcode?: string
  calories_per_100g?: number
  protein_per_100g?: number
  carbs_per_100g?: number
  fat_per_100g?: number
}

export default function FavoritesPage() {
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
      toast.success('Removed from favorites')
    },
  })

  async function logFavorite(f: Favorite) {
    const res = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_name: f.product_name,
        barcode: f.barcode,
        quantity_g: 100,
        calories_per_100g: f.calories_per_100g ?? 0,
        protein_per_100g: f.protein_per_100g ?? 0,
        carbs_per_100g: f.carbs_per_100g ?? 0,
        fat_per_100g: f.fat_per_100g ?? 0,
        meal_type: 'snack',
      }),
    })
    const json = await res.json()
    if (json.success) toast.success('Meal logged!')
    else toast.error(json.error || 'Failed to log')
  }

  return (
    <RouteErrorBoundary>
      <div className="min-h-screen bg-[var(--background)] px-4 pt-10 pb-24">
        <h1 className="text-2xl font-black mb-1">Meal favorites</h1>
        <p className="text-sm text-[var(--muted)] mb-6">One-tap logging for foods you eat often</p>

        {isLoading && <p className="text-sm text-[var(--muted)]">Loading...</p>}

        {!isLoading && (!data || data.length === 0) && (
          <p className="text-sm text-[var(--muted)]">
            Save favorites from scan results using the star button (coming from results page), or log meals from history.
          </p>
        )}

        <ul className="space-y-2">
          {(data || []).map((f) => (
            <li
              key={f.id}
              className="p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-semibold">{f.product_name}</p>
                {f.calories_per_100g != null && (
                  <p className="text-xs text-[var(--muted)]">{f.calories_per_100g} kcal / 100g</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => logFavorite(f)}
                  className="px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg"
                  aria-label={`Log ${f.product_name} as meal`}
                >
                  Log
                </button>
                <button
                  type="button"
                  onClick={() => remove.mutate(f.id)}
                  className="px-3 py-2 bg-[var(--card-border)] text-xs rounded-lg"
                  aria-label={`Remove ${f.product_name} from favorites`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </RouteErrorBoundary>
  )
}
