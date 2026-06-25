// src/app/admin/pending-products/page.tsx
"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { createClient } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import PageShell from '@/components/PageShell'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface PendingProduct {
  id: string
  name: string
  brand: string | null
  barcode: string | null
  front_label_url: string | null
  nutrition_label_url: string | null
  ingredients_text: string | null
  nutrition: any
  submitted_by: string
  submitted_at: string
  validation_count: number
  status: string | null
}

export default function AdminPendingPage() {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState<PendingProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'unverified' | 'all'>('all')
  const [selectedProduct, setSelectedProduct] = useState<PendingProduct | null>(null)

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/admin/check')
      .then((r) => r.json())
      .then((data) => setIsAdmin(!!data.isAdmin))
      .catch(() => setIsAdmin(false))
  }, [status])

  const fetchProducts = useCallback(async function fetchProducts() {
    setLoading(true)
    let query = supabase
      .from('community_products')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(20)

    if (filter === 'pending') {
      query = query.eq('status', 'pending')
    } else if (filter === 'unverified') {
      query = query.eq('status', 'unverified')
    }

    const { data, error } = await query

    if (!error && data) {
      setProducts(data)
    }
    setLoading(false)
  }, [filter])

  useEffect(() => {
    if (status === 'authenticated' && isAdmin) {
      fetchProducts()
    }
  }, [status, filter, isAdmin, fetchProducts])

  const handleAction = useCallback(async function handleAction(productId: string, action: 'approve' | 'reject' | 'edit') {
    if (action === 'edit') {
      // Open edit modal
      const product = products.find(p => p.id === productId)
      if (product) setSelectedProduct(product)
      return
    }

    try {
      if (action === 'approve') {
        await supabase.from('community_products').update({
          status: 'approved',
          verified_at: new Date().toISOString(),
        }).eq('id', productId)
        
        toast.success('✅ Product approved!')
      } else {
        await supabase.from('community_products').update({
          status: 'rejected',
        }).eq('id', productId)
        
        toast.error('Product rejected')
      }
      
      fetchProducts()
    } catch (err) {
      toast.error('Action failed')
    }
  }, [products, fetchProducts])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!selectedProduct) return
      
      if (e.key === 'a') {
        handleAction(selectedProduct.id, 'approve')
        setSelectedProduct(null)
      } else if (e.key === 'r') {
        handleAction(selectedProduct.id, 'reject')
        setSelectedProduct(null)
      } else if (e.key === 'Escape') {
        setSelectedProduct(null)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProduct, handleAction])

  if (status === 'loading') {
    return (
      <PageShell variant="no-header">
        <div className="flex items-center justify-center" style={{ minHeight: '100dvh' }}>
          <div className="w-8 h-8 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin" />
        </div>
      </PageShell>
    )
  }

  if (status === 'unauthenticated' || !isAdmin) {
    return (
      <PageShell variant="no-header">
        <div className="flex flex-col items-center justify-center px-6 text-center" style={{ minHeight: '100dvh' }}>
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">Admin Access Only</h2>
          <p className="text-sm text-[var(--muted-2)]">This page is for authorized administrators.</p>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell variant="default" title="Pending Approvals" showBack>
      {/* Header */}
      <div className="bg-gradient-to-b from-red-500/20 to-transparent px-5 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black">⚡ Admin: Fast Track Review</h1>
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Admin</span>
        </div>
        <p className="text-sm text-[var(--muted-2)] mt-1">Review 20 products in 10 minutes</p>
        
        {/* Keyboard shortcuts */}
        <div className="mt-3 flex gap-2 text-[10px]">
          <span className="bg-[var(--card)] px-2 py-1 rounded">A = Approve</span>
          <span className="bg-[var(--card)] px-2 py-1 rounded">E = Edit</span>
          <span className="bg-[var(--card)] px-2 py-1 rounded">R = Reject</span>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mt-4">
          {(['all', 'pending', 'unverified'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${
                filter === f ? 'bg-[var(--clay)] text-white' : 'bg-[var(--card)] text-[var(--muted-2)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4">
        {loading ? (
          <div className="flex justify-center py-8">
      <div className="w-8 h-8 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">All Caught Up!</h2>
            <p className="text-sm text-[var(--muted-2)]">No products to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[var(--foreground)]">{product.name}</h3>
                      {product.brand && (
                        <p className="text-[11px] text-[var(--muted-2)]">{product.brand}</p>
                      )}
                      {product.barcode && (
                        <p className="text-[10px] text-[var(--muted-2)] mt-1">_barcode: {product.barcode}</p>
                      )}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      product.status === 'unverified' ? 'bg-amber-500/20 text-amber-400' :
                      product.status === 'pending' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-[var(--clay)]/20 text-[var(--clay)]'
                    }`}>
                      {product.status || 'pending'}
                    </span>
                  </div>

                  {/* Nutrition Preview */}
                  {product.nutrition && (
                    <div className="mt-3 p-2 bg-[var(--card)] rounded-lg text-[10px] flex flex-wrap gap-2">
                      {Object.entries(product.nutrition as Record<string, any>).map(([k, v]) => (
                        v != null && <span key={k} className="text-[var(--muted-2)]">{k}: {String(v)}</span>
                      ))}
                    </div>
                  )}

                  {/* Ingredients */}
                  {product.ingredients_text && (
                    <p className="mt-2 text-[10px] text-[var(--muted-2)] line-clamp-2">
                      📋 {product.ingredients_text}
                    </p>
                  )}
                </div>

                {/* Images */}
                {(product.front_label_url || product.nutrition_label_url) && (
                  <div className="flex gap-2 px-4 pb-4">
                    {product.front_label_url && (
                      <img src={product.front_label_url} alt="Front" className="w-24 h-24 object-cover rounded-lg" />
                    )}
                    {product.nutrition_label_url && (
                      <img src={product.nutrition_label_url} alt="Nutrition" className="w-24 h-24 object-cover rounded-lg" />
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex border-t border-[var(--border)]">
                  <button
                    onClick={() => handleAction(product.id, 'approve')}
                    className="flex-1 py-2.5 text-sm font-bold text-[var(--clay)] hover:bg-[var(--clay)]/10"
                  >
                    ✅ Approve (A)
                  </button>
                  <button
                    onClick={() => handleAction(product.id, 'edit')}
                    className="flex-1 py-2.5 text-sm font-bold text-amber-400 hover:bg-amber-500/10 border-l border-[var(--border)]"
                  >
                    ✏️ Edit (E)
                  </button>
                  <button
                    onClick={() => handleAction(product.id, 'reject')}
                    className="flex-1 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 border-l border-[var(--border)]"
                  >
                    ❌ Reject (R)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <EditModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={async (updated) => {
            await supabase.from('community_products').update({
              name: updated.name,
              brand: updated.brand,
              nutrition: updated.nutrition,
              ingredients_text: updated.ingredients_text,
              status: 'approved',
              verified_at: new Date().toISOString(),
            }).eq('id', selectedProduct.id)
            
            toast.success('Saved and approved!')
            setSelectedProduct(null)
            fetchProducts()
          }}
        />
      )}
    </PageShell>
  )
}

function EditModal({ product, onClose, onSave }: {
  product: PendingProduct
  onClose: () => void
  onSave: (data: any) => void
}) {
  const [form, setForm] = useState({
    name: product.name,
    brand: product.brand || '',
    nutrition: product.nutrition || {},
    ingredients_text: product.ingredients_text || ''
  })

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-bold">✏️ Edit & Approve</h2>
          <button onClick={onClose} className="text-[var(--muted-2)]">✕</button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="text-[11px] text-[var(--muted-2)]">Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm mt-1"
            />
          </div>
          
          <div>
            <label className="text-[11px] text-[var(--muted-2)]">Brand</label>
            <input
              value={form.brand}
              onChange={e => setForm({ ...form, brand: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-[11px] text-[var(--muted-2)]">Nutrition (JSON)</label>
            <textarea
              value={JSON.stringify(form.nutrition, null, 2)}
              onChange={e => {
                try { setForm({ ...form, nutrition: JSON.parse(e.target.value) }) } catch {}
              }}
              className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm mt-1 font-mono text-xs"
              rows={5}
            />
          </div>

          <div>
            <label className="text-[11px] text-[var(--muted-2)]">Ingredients</label>
            <textarea
              value={form.ingredients_text}
              onChange={e => setForm({ ...form, ingredients_text: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm mt-1"
              rows={3}
            />
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border)] flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-[var(--card)] text-[var(--muted-2)] font-bold rounded-lg">
            Cancel
          </button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 bg-[var(--clay)] text-white font-bold rounded-lg">
            Save & Approve
          </button>
        </div>
      </div>
    </div>
  )
}