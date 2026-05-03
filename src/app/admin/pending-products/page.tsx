// src/app/admin/pending-products/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { createClient } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

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

  // Check if admin (you can modify this check)
  const isAdmin = (session?.user as any)?.email === 'samadhealthox@gmail.com' || (session?.user as any)?.email === 'samadsaifi14@gmail.com'

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProducts()
    }
  }, [status, filter])

  async function fetchProducts() {
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
  }

  async function handleAction(productId: string, action: 'approve' | 'reject' | 'edit') {
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
  }

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
  }, [selectedProduct])

  if (status === 'loading') {
    return <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (status === 'unauthenticated' || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0d0f12] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-lg font-bold text-[#f0f4f8] mb-2">Admin Access Only</h2>
        <p className="text-sm text-[#7a8fa6]">This page is for authorized administrators.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-500/20 to-transparent px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black">⚡ Admin: Fast Track Review</h1>
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Admin</span>
        </div>
        <p className="text-sm text-[#7a8fa6] mt-1">Review 20 products in 10 minutes</p>
        
        {/* Keyboard shortcuts */}
        <div className="mt-3 flex gap-2 text-[10px]">
          <span className="bg-[#1a1f28] px-2 py-1 rounded">A = Approve</span>
          <span className="bg-[#1a1f28] px-2 py-1 rounded">E = Edit</span>
          <span className="bg-[#1a1f28] px-2 py-1 rounded">R = Reject</span>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mt-4">
          {(['all', 'pending', 'unverified'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${
                filter === f ? 'bg-emerald-500 text-white' : 'bg-[#1a1f28] text-[#7a8fa6]'
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
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-lg font-bold text-[#f0f4f8]">All Caught Up!</h2>
            <p className="text-sm text-[#7a8fa6]">No products to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="bg-[#161a20] border border-[#2a3545] rounded-2xl overflow-hidden">
                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[#f0f4f8]">{product.name}</h3>
                      {product.brand && (
                        <p className="text-[11px] text-[#7a8fa6]">{product.brand}</p>
                      )}
                      {product.barcode && (
                        <p className="text-[10px] text-[#7a8fa6] mt-1">_barcode: {product.barcode}</p>
                      )}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      product.status === 'unverified' ? 'bg-amber-500/20 text-amber-400' :
                      product.status === 'pending' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {product.status || 'pending'}
                    </span>
                  </div>

                  {/* Nutrition Preview */}
                  {product.nutrition && (
                    <div className="mt-3 p-2 bg-[#1a1f28] rounded-lg text-[10px] flex flex-wrap gap-2">
                      {Object.entries(product.nutrition as Record<string, any>).map(([k, v]) => (
                        v != null && <span key={k} className="text-[#7a8fa6]">{k}: {String(v)}</span>
                      ))}
                    </div>
                  )}

                  {/* Ingredients */}
                  {product.ingredients_text && (
                    <p className="mt-2 text-[10px] text-[#7a8fa6] line-clamp-2">
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
                <div className="flex border-t border-[#2a3545]">
                  <button
                    onClick={() => handleAction(product.id, 'approve')}
                    className="flex-1 py-2.5 text-sm font-bold text-emerald-400 hover:bg-emerald-500/10"
                  >
                    ✅ Approve (A)
                  </button>
                  <button
                    onClick={() => handleAction(product.id, 'edit')}
                    className="flex-1 py-2.5 text-sm font-bold text-amber-400 hover:bg-amber-500/10 border-l border-[#2a3545]"
                  >
                    ✏️ Edit (E)
                  </button>
                  <button
                    onClick={() => handleAction(product.id, 'reject')}
                    className="flex-1 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 border-l border-[#2a3545]"
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
    </div>
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
      <div className="bg-[#161a20] border border-[#2a3545] rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-[#2a3545] flex items-center justify-between">
          <h2 className="text-sm font-bold">✏️ Edit & Approve</h2>
          <button onClick={onClose} className="text-[#7a8fa6]">✕</button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="text-[11px] text-[#7a8fa6]">Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1f28] border border-[#2a3545] rounded-lg text-sm mt-1"
            />
          </div>
          
          <div>
            <label className="text-[11px] text-[#7a8fa6]">Brand</label>
            <input
              value={form.brand}
              onChange={e => setForm({ ...form, brand: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1f28] border border-[#2a3545] rounded-lg text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#7a8fa6]">Nutrition (JSON)</label>
            <textarea
              value={JSON.stringify(form.nutrition, null, 2)}
              onChange={e => {
                try { setForm({ ...form, nutrition: JSON.parse(e.target.value) }) } catch {}
              }}
              className="w-full px-3 py-2 bg-[#1a1f28] border border-[#2a3545] rounded-lg text-sm mt-1 font-mono text-xs"
              rows={5}
            />
          </div>

          <div>
            <label className="text-[11px] text-[#7a8fa6]">Ingredients</label>
            <textarea
              value={form.ingredients_text}
              onChange={e => setForm({ ...form, ingredients_text: e.target.value })}
              className="w-full px-3 py-2 bg-[#1a1f28] border border-[#2a3545] rounded-lg text-sm mt-1"
              rows={3}
            />
          </div>
        </div>

        <div className="p-4 border-t border-[#2a3545] flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-[#1a1f28] text-[#7a8fa6] font-bold rounded-lg">
            Cancel
          </button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 bg-emerald-500 text-white font-bold rounded-lg">
            Save & Approve
          </button>
        </div>
      </div>
    </div>
  )
}