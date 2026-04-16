// src/components/dashboard/NutrientAlerts.tsx
"use client"
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'

export default function NutrientAlerts() {
  const { data, isLoading } = useQuery({
    queryKey: ['nutrient-alerts'],
    queryFn: async () => {
      const res = await fetch('/api/nutrients/summary')
      const json = await res.json()
      return json.data
    },
    staleTime: 1000 * 60 * 10,
  })

  if (isLoading || !data?.alerts?.length) return null

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Nutrient Alerts</p>
      </div>
      <div className="space-y-3">
        {data.alerts.map((alert: any, i: number) => (
          <div
            key={i}
            className={`p-3 rounded-xl border ${
              alert.severity === 'high'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {alert.type === 'deficient' ? (
                <TrendingDown className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5 text-red-500" />
              )}
              <p className="text-xs font-bold text-[var(--foreground)]">
                {alert.nutrient} — {alert.type === 'deficient' ? 'Too Low' : 'Too High'}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}