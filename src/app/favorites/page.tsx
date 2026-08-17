'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { ProductCard } from '@/components/ProductCard'
import { SkeletonCard } from '@/components/Skeleton'
import { Heart } from 'lucide-react'

export default function Favorites() {
  const router = useRouter()

  const { data, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch('/api/favorites')
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
  })

  const items = data?.favorites ?? data?.products ?? []

  return (
    <PageShell title="Favorites" showBack>
      {isLoading ? (
        <div className="stack--sm">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : error ? (
        <div className="empty-state" style={{ minHeight: '60dvh', justifyContent: 'center' }}>
          <p className="text-sm" style={{ fontWeight: 600, color: 'var(--rust)' }}>Failed to load favorites</p>
          <p className="text-xs text-sand">Please try again later</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state" style={{ minHeight: '60dvh', justifyContent: 'center' }}>
          <div className="empty-state__icon"><Heart size={24} /></div>
          <p className="text-sm" style={{ fontWeight: 600 }}>No favorites yet</p>
          <p className="text-xs text-sand">Save products you love for quick access</p>
          <button className="btn btn--primary btn--sm" style={{ marginTop: 12 }} onClick={() => router.push('/search')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="stack--sm">
          {items.map((item: Record<string, unknown>, i: number) => (
            <ProductCard
              key={(item.product as { barcode?: string })?.barcode ?? i}
              product={item.product as { name: string; brand: string; image_url?: string }}
              analysis={item.analysis as { health_score: number; health_rating: 'healthy' | 'moderate' | 'unhealthy' }}
              onClick={() => {
                const barcode = (item.product as { barcode?: string })?.barcode;
                if (barcode) router.push(`/results?barcode=${barcode}`);
              }}
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}
