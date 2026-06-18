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
      <div className="rounded-2xl p-4 bg-[var(--card)] border border-[var(--card-border)] animate-pulse h-20" />
    )
  }

  if (!scan) {
    return (
      <button
        onClick={() => router.push('/scan')}
        className="w-full rounded-2xl p-4 bg-[var(--card)] border border-dashed border-[var(--card-border)]
          flex items-center gap-3 hover:border-[var(--clay)] transition-colors group">
        <div className="w-10 h-10 rounded-xl bg-[color-mix(in_oklab,var(--clay),transparent_88%)] flex items-center justify-center">
          <Scan className="w-5 h-5 text-[var(--clay)]" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-[var(--foreground)]">Scan your first product</p>
          <p className="text-xs text-[var(--muted)]">Tap to open scanner</p>
        </div>
        <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--clay)] transition-colors" />
      </button>
    )
  }

  const ratingColor =
    scan.ai_health_rating === 'healthy'   ? 'text-[var(--moss)]'
    : scan.ai_health_rating === 'unhealthy' ? 'text-[var(--risk)]'
    : 'text-amber-500'

  const ratingBg =
    scan.ai_health_rating === 'healthy'   ? 'bg-[color-mix(in_oklab,var(--moss),transparent_88%)]'
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
      className="w-full rounded-2xl p-4 bg-[var(--card)] border border-[var(--card-border)] shadow-sm
        flex items-center gap-3 hover:border-[var(--clay)]/50 transition-colors group text-left">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ratingBg}`}>
        {scan.product_image
          ? <img src={scan.product_image} alt={scan.product_name} className="w-10 h-10 rounded-xl object-cover" />
          : <Scan className={`w-5 h-5 ${ratingColor}`} />}
      </div>
      <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--muted)] font-medium mb-0.5">Last scanned</p>
        <p className="text-sm font-semibold text-[var(--foreground)] truncate">{scan.product_name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {scan.ai_health_score !== null && (
            <span className={`text-xs font-bold ${ratingColor}`}>
              {scan.ai_health_score.toFixed(1)}/10
            </span>
          )}
          <span className="text-[var(--card-border)]">·</span>
          <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
            <Clock className="w-3 h-3" /> {timeAgo}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="text-xs text-[var(--clay)] font-medium">Scan again</span>
        <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--clay)] transition-colors" />
      </div>
    </button>
  )
}