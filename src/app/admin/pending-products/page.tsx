'use client'

import { useQuery } from '@tanstack/react-query'
import { PageShell } from '@/components/PageShell'
import { ProductCard } from '@/components/ProductCard'
import { SkeletonCard } from '@/components/Skeleton'
import { Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPendingProducts() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-pending'],
    queryFn: async () => {
      const res = await fetch('/api/admin/pending')
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
  })

  const items = data?.pending ?? []

  async function handleAction(id: string, action: 'approve' | 'reject') {
    const actionLabel = action === 'approve' ? 'approve' : 'reject'
    if (!confirm(`Are you sure you want to ${actionLabel} this product?`)) return
    try {
      const res = await fetch(`/api/log/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        toast.success(action === 'approve' ? 'Approved' : 'Rejected')
        refetch()
      }
    } catch {
      toast.error('Action failed')
    }
  }

  return (
    <PageShell title="Admin" showBack>
      <div className="section-header"><span className="section-header__title">Pending Products</span></div>
      {isLoading ? (
        <div className="stack--sm">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon"><Shield size={24} /></div>
          <p className="text-sm" style={{ fontWeight: 600 }}>No pending products</p>
        </div>
      ) : (
        <div className="stack--sm">
          {items.map((item: Record<string, unknown>, i: number) => (
            <div key={i} className="card">
              <ProductCard
                product={item.product as { name: string; brand: string; image_url?: string }}
                analysis={item.analysis as { health_score: number; health_rating: 'healthy' | 'moderate' | 'unhealthy' }}
              />
              <div className="row--sm" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn--secondary btn--xs" onClick={() => handleAction(item.id as string, 'reject')}>Reject</button>
                <button className="btn btn--success btn--xs" onClick={() => handleAction(item.id as string, 'approve')}>Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
