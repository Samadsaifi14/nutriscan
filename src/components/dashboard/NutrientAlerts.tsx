"use client"
import { useEffect, useState } from 'react'
import { AlertTriangle, TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react'

interface Alert {
  nutrient: string
  type: 'deficient' | 'excess'
  avg: number
  rda: number
  message: string
  severity: 'high' | 'medium'
}

interface SummaryData {
  avg: { calories: number; protein: number; carbs: number; fat: number; sodium: number }
  rda: { calories: number; protein: number; carbs: number; fat: number; sodium: number }
  alerts: Alert[]
  daysTracked: number
}

export default function NutrientAlerts() {
  const [data, setData]         = useState<SummaryData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch('/api/nutrients/summary')
      .then(r => r.json())
      .then(r => { if (r.success && r.data) setData(r.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse h-20" />
    )
  }

  if (!data) return null

  const highAlerts   = data.alerts.filter(a => a.severity === 'high')
  const mediumAlerts = data.alerts.filter(a => a.severity === 'medium')
  const allAlerts    = [...highAlerts, ...mediumAlerts]

  if (allAlerts.length === 0) {
    return (
      <div className="rounded-2xl p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Nutrient Balance Looks Good!</p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-500">
            Based on your last {data.daysTracked} day{data.daysTracked !== 1 ? 's' : ''} of tracking
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl bg-white dark:bg-gray-900 border shadow-sm overflow-hidden
      ${highAlerts.length > 0
        ? 'border-red-100 dark:border-red-900/40'
        : 'border-amber-100 dark:border-amber-900/40'
      }`}>
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(x => !x)}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
            ${highAlerts.length > 0
              ? 'bg-red-50 dark:bg-red-900/20'
              : 'bg-amber-50 dark:bg-amber-900/20'
            }`}>
            <AlertTriangle className={`w-5 h-5 ${highAlerts.length > 0 ? 'text-red-500' : 'text-amber-500'}`} />
          </div>
          <div>
            <p className={`text-sm font-bold
              ${highAlerts.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {allAlerts.length} Nutrient Alert{allAlerts.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Based on {data.daysTracked}-day average · Tap to view
            </p>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2.5 border-t border-gray-100 dark:border-gray-800 pt-3">
          {allAlerts.map((alert, i) => (
            <div key={i} className={`rounded-xl p-3 flex items-start gap-3
              ${alert.severity === 'high'
                ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30'
                : 'bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30'
              }`}>
              <div className="flex-shrink-0 mt-0.5">
                {alert.type === 'deficient'
                  ? <TrendingDown className={`w-4 h-4 ${alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                  : <TrendingUp   className={`w-4 h-4 ${alert.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{alert.nutrient}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase
                    ${alert.type === 'deficient'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                    {alert.type === 'deficient' ? 'Too Low' : 'Too High'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}