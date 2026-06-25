// src/app/validate/page.tsx
"use client"

import { useState, useEffect } from 'react'
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
  submitted_by: string
  submitted_at: string
}

export default function ValidatePage() {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState<PendingProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPendingProducts()
    }
  }, [status])

  async function fetchPendingProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('community_products')
      .select('*')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false })
      .limit(10)

    if (!error && data) {
      setProducts(data)
    }
    setLoading(false)
  }

  async function handleVote(productId: string, vote: 'approve' | 'reject') {
    const userId = (session?.user as any)?.id
    if (!userId) return
    
    setVoting(productId)
    
    try {
      // Record vote
      const { error: voteError } = await supabase.from('product_validations').insert({
        product_id: productId,
        user_id: userId,
        vote,
      })

      if (voteError) {
        // Already voted
        toast.error('You have already validated this product')
        setVoting(null)
        return
      }

      // Update product validation count
      const increment = vote === 'approve' ? 'approval_count' : 'rejection_count'
      await supabase.rpc('increment_validation', { 
        product_id: productId, 
        vote_type: vote 
      })

      // Check if reached 3 approvals (or 3 rejections)
      const { data: product } = await supabase
        .from('community_products')
        .select('approval_count, rejection_count')
        .eq('id', productId)
        .single()

      if (product?.approval_count >= 3) {
        // Promote to main products table
        const promoteRes = await fetch('/api/community/promote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        const promoteJson = await promoteRes.json()
        
        if (promoteJson.success) {
          toast.success('✅ Product approved and added to database!')
        } else {
          toast.error('Product approved but promotion failed')
        }
      } else if (product?.rejection_count >= 3) {
        // Reject the product
        await supabase.from('community_products').update({
          status: 'rejected',
        }).eq('id', productId)
        
        toast.error('Product rejected')
      }

      // Check for new badges
      try {
        const badgeRes = await fetch('/api/profile/badges', { method: 'POST' })
        const badgeJson = await badgeRes.json()
        if (badgeJson.newBadges?.length > 0) {
          const badgeNames = badgeJson.newBadges.map((b: any) => `${b.emoji} ${b.name}`).join(', ')
          toast.success(`🏅 New badge earned: ${badgeNames}`)
        }
      } catch {}

      // Refresh list
      fetchPendingProducts()

    } catch (error) {
      console.error('Vote error:', error)
      toast.error('Failed to record vote')
    } finally {
      setVoting(null)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#0d0f12] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">Sign In Required</h2>
        <p className="text-sm text-[var(--muted-2)] mb-4">You need to sign in to validate products</p>
      </div>
    )
  }

  return (
    <PageShell variant="default" title="Validate" showBack>
      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-4">
        <p className="text-[11px] text-purple-400">
          🎯 Vote on products to help them go live. 3 approvals = product added to database!
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">All Caught Up!</h2>
          <p className="text-sm text-[var(--muted-2)]">No products pending validation</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-[var(--foreground)]">{product.name}</h3>
                {product.brand && (
                  <p className="text-[11px] text-[var(--muted-2)] mt-1">{product.brand}</p>
                )}
                {product.ingredients_text && (
                  <p className="text-[10px] text-[var(--muted-2)] mt-2 line-clamp-2">
                    📋 {product.ingredients_text}
                  </p>
                )}
              </div>

              {/* Images */}
              {(product.front_label_url || product.nutrition_label_url) && (
                <div className="flex gap-2 px-4 pb-4">
                  {product.front_label_url && (
                    <img 
                      src={product.front_label_url} 
                      alt="Front" 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  {product.nutrition_label_url && (
                    <img 
                      src={product.nutrition_label_url} 
                      alt="Nutrition" 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                </div>
              )}

              {/* Vote Buttons */}
              <div className="flex border-t border-[var(--border)]">
                <button
                  onClick={() => handleVote(product.id, 'approve')}
                  disabled={voting === product.id}
                  className="flex-1 py-3 text-sm font-bold text-[var(--clay)] hover:bg-[var(--clay)]/10 transition-colors disabled:opacity-50"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleVote(product.id, 'reject')}
                  disabled={voting === product.id}
                  className="flex-1 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 border-l border-[var(--border)]"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
