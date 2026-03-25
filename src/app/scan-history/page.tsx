"use client"
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const ratingConfig: Record<string, {
  label: string
  color: string
  bg: string
  emoji: string
}> = {
  healthy: {
    label: 'Healthy',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    emoji: '✅'
  },
  moderate: {
    label: 'Moderate',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    emoji: '⚠️'
  },
  unhealthy: {
    label: 'Unhealthy',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    emoji: '❌'
  },
}

export default function ScanHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const userId = (session as any)?.userId

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status])

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

  const stats = {
    healthy: sessions?.filter(s => s.ai_health_rating === 'healthy').length || 0,
    moderate: sessions?.filter(s => s.ai_health_rating === 'moderate').length || 0,
    unhealthy: sessions?.filter(s => s.ai_health_rating === 'unhealthy').length || 0,
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">🔍 My Scanned Products</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Products you have personally scanned and their health ratings
          </p>
        </div>

        {!isLoading && sessions && sessions.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { key: 'healthy', label: 'Healthy', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
                { key: 'moderate', label: 'Moderate', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                { key: 'unhealthy', label: 'Unhealthy', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
              ].map(item => (
                <div key={item.key} className={`${item.bg} rounded-xl p-3 text-center`}>
                  <p className={`text-2xl font-bold ${item.color}`}>
                    {stats[item.key as keyof typeof stats]}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--card)] border border-[var(--card-border)] rounded-xl mb-4 text-sm text-[var(--muted)]">
              📊 You have scanned{' '}
              <strong className="text-[var(--foreground)]">{sessions.length} products</strong> total
            </div>
          </>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-20 bg-[var(--card)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sessions?.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[var(--foreground)] font-medium mb-2">No products scanned yet</p>
            <p className="text-sm text-[var(--muted)] mb-6">
              Scan a food product to see its AI health rating here
            </p>
            <button
              onClick={() => router.push('/scan')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm"
            >
              Scan your first product
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions?.map((s: any) => {
              const rating = ratingConfig[s.ai_health_rating] || ratingConfig.moderate
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-3 bg-[var(--card)] rounded-xl border border-[var(--card-border)] hover:border-green-200 dark:hover:border-green-800 transition-colors"
                >
                  <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                    {s.product_image ? (
                      <div className="relative w-14 h-14">
                        <Image
                          src={s.product_image}
                          alt={s.product_name}
                          fill
                          className="object-contain"
                          sizes="56px"
                        />
                      </div>
                    ) : (
                      <span className="text-2xl">🏷️</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                      {s.product_name || 'Unknown Product'}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{s.barcode}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {new Date(s.scanned_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {s.ai_health_rating && (
                    <div className={`flex-shrink-0 px-3 py-2 rounded-xl text-center ${rating.bg}`}>
                      <div className="text-lg">{rating.emoji}</div>
                      <div className={`text-xs font-bold ${rating.color}`}>
                        {s.ai_health_score ? `${s.ai_health_score}/10` : rating.label}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
