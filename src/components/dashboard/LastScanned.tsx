"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scan, Clock, ChevronRight } from 'lucide-react'

interface ScanSession {
  product_name: string
  product_image: string | null
  ai_health_rating: string | null
  ai_health_score: number | null
  scanned_at: string
}

export default function LastScanned() {
  const [scan, setScan]       = useState<ScanSession | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/last-scan')
      .then(r => r.json())
      .then(r => { if (r.success && r.data) setScan(r.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse h-20" />
    )
  }

  if (!scan) {
    return (
      <button
        onClick={() => router.push('/scan')}
        className="w-full rounded-2xl p-4 bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700
          flex items-center gap-3 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors group">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <Scan className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Scan your first product</p>
          <p className="text-xs text-gray-400">Tap to open scanner</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors" />
      </button>
    )
  }

  const ratingColor =
    scan.ai_health_rating === 'healthy'   ? 'text-emerald-500'
    : scan.ai_health_rating === 'unhealthy' ? 'text-red-500'
    : 'text-amber-500'

  const ratingBg =
    scan.ai_health_rating === 'healthy'   ? 'bg-emerald-50 dark:bg-emerald-900/20'
    : scan.ai_health_rating === 'unhealthy' ? 'bg-red-50 dark:bg-red-900/20'
    : 'bg-amber-50 dark:bg-amber-900/20'

  const timeAgo = (() => {
    const diff = Date.now() - new Date(scan.scanned_at).getTime()
    const mins = Math.floor(diff / 60000)
    const hrs  = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1)  return 'just now'
    if (mins < 60) return `${mins}m ago`
    if (hrs < 24)  return `${hrs}h ago`
    return `${days}d ago`
  })()

  return (
    <button
      onClick={() => router.push('/scan')}
      className="w-full rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm
        flex items-center gap-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group text-left">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ratingBg}`}>
        {scan.product_image
          ? <img src={scan.product_image} alt={scan.product_name} className="w-10 h-10 rounded-xl object-cover" />
          : <Scan className={`w-5 h-5 ${ratingColor}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">Last scanned</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{scan.product_name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {scan.ai_health_score !== null && (
            <span className={`text-xs font-bold ${ratingColor}`}>
              {scan.ai_health_score.toFixed(1)}/10
            </span>
          )}
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" /> {timeAgo}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Scan again</span>
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors" />
      </div>
    </button>
  )
}