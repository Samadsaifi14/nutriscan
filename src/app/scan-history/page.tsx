'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { ProductCard } from '@/components/ProductCard'
import { SkeletonCard } from '@/components/Skeleton'
import { Clock } from 'lucide-react'

export default function ScanHistory() {
  const router = useRouter()

  const { data, isLoading, error } = useQuery({
    queryKey: ['scanHistory'],
    queryFn: async () => {
      const res = await fetch('/api/log')
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
  })

  const scans = data?.scans ?? data?.logs ?? []

  return (
    <PageShell title="History" showBack>
      {isLoading ? (
        <div className="stack--sm">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="empty-state" style={{ minHeight: '60dvh', justifyContent: 'center' }}>
          <p className="text-sm" style={{ fontWeight: 600, color: 'var(--rust)' }}>Failed to load scan history</p>
          <p className="text-xs text-sand">Please try again later</p>
        </div>
      ) : scans.length === 0 ? (
        <div className="empty-state" style={{ minHeight: '60dvh', justifyContent: 'center' }}>
          <div className="empty-state__icon"><Clock size={24} /></div>
          <p className="text-sm" style={{ fontWeight: 600 }}>No scan history</p>
          <p className="text-xs text-sand">Products you scan will appear here</p>
          <button className="btn btn--primary btn--sm" style={{ marginTop: 12 }} onClick={() => router.push('/scan')}>
            Scan Now
          </button>
        </div>
      ) : (
        <div className="stack--sm">
          {scans.map((scan: Record<string, unknown>, i: number) => (
            <ProductCard
              key={(scan.product as { barcode?: string })?.barcode ?? i}
              product={scan.product as { name: string; brand: string; image_url?: string }}
              analysis={scan.analysis as { health_score: number; health_rating: 'healthy' | 'moderate' | 'unhealthy' }}
              onClick={() => {
                const barcode = (scan.product as { barcode?: string })?.barcode;
                if (barcode) router.push(`/results?barcode=${barcode}`);
              }}
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}
