"use client"
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const ratingConfig: Record<string, { label: string, color: string, bg: string, emoji: string }> = {
  healthy: { label: 'Healthy', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', emoji: '✅' },
  moderate: { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', emoji: '⚠️' },
  unhealthy: { label: 'Unhealthy', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', emoji: '❌' },
}

export default function ScanHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const userId = (session as any)?.userId

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status])

  const { data: products, isLoading } = useQuery({
    queryKey: ['scan-history', userId],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .not('ai_health_rating', 'is', null)
        .order('ai_analyzed_at', { ascending: false })
        .limit(30)
      return data || []
    },
    enabled: !!userId,
  })

  const stats = {
    healthy: products?.filter(p => p.ai_health_rating === 'healthy').length || 0,
    moderate: products?.filter(p => p.ai_health_rating === 'moderate').length || 0,
    unhealthy: products?.filter(p => p.ai_health_rating === 'unhealthy').length || 0,
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">🔍 Scan History</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Products you have scanned and their health ratings</p>
        </div>

        {/* Summary stats */}
        {!isLoading && products && products.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { key: 'healthy', label: 'Healthy', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
              { key: 'moderate', label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { key: 'unhealthy', label: 'Unhealthy', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
            ].map(item => (
              <div key={item.key} className={`${item.bg} rounded-xl p-3 text-center`}>
                <p className={`text-2xl font-bold ${item.color}`}>
                  {stats[item.key as keyof typeof stats]}
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-20 bg-[var(--card)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[var(--foreground)] font-medium mb-2">No products scanned yet</p>
            <p className="text-sm text-[var(--muted)] mb-6">Scan a food product to see its AI health rating here</p>
            <button
              onClick={() => router.push('/scan')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm"
            >
              Scan your first product
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {products?.map((product: any) => {
              const rating = ratingConfig[product.ai_health_rating] || ratingConfig.moderate
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 bg-[var(--card)] rounded-xl border border-[var(--card-border)]"
                >
                  {/* Product image */}
                  <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
                    {product.image_url ? (
                      <div className="relative w-14 h-14">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="56px"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center text-2xl">
                        🏷️
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                      {product.name}
                    </p>
                    {product.brand && (
                      <p className="text-xs text-[var(--muted)] truncate">{product.brand}</p>
                    )}
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {Math.round(product.calories_per_100g || 0)} kcal/100g
                    </p>
                  </div>

                  {/* Rating badge */}
                  <div className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-center ${rating.bg}`}>
                    <div className="text-base">{rating.emoji}</div>
                    <div className={`text-xs font-semibold ${rating.color}`}>
                      {product.ai_analysis_json?.health_score || '—'}/10
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}