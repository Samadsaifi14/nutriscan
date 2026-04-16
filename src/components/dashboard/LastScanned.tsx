// src/components/dashboard/LastScanned.tsx
"use client"
import { useQuery } from '@tanstack/react-query'

export default function LastScanned() {
  const { data, isLoading } = useQuery({
    queryKey: ['last-scan'],
    queryFn: async () => {
      const res = await fetch('/api/last-scan')
      const json = await res.json()
      return json.data
    },
    staleTime: 1000 * 60 * 2,
  })

  if (isLoading || !data) return null

  const ratingColor =
    data.ai_health_rating === 'healthy' ? 'text-emerald-500' :
    data.ai_health_rating === 'moderate' ? 'text-amber-500' :
    'text-red-500'

  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {data.product_image ? (
          <img src={data.product_image} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">📦</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">Last Scanned</p>
        <p className="text-sm font-bold text-[var(--foreground)] truncate">{data.product_name}</p>
      </div>
      {data.ai_health_score != null && (
        <div className="text-right flex-shrink-0">
          <p className={`text-lg font-black ${ratingColor}`}>
            {data.ai_health_score}
          </p>
          <p className="text-xs text-gray-400">/10</p>
        </div>
      )}
    </div>
  )
}