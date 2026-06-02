"use client"

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'
import RouteErrorBoundary from '@/components/RouteErrorBoundary'

interface SearchResult {
  barcode: string
  name: string
  brand?: string | null
  image_url?: string | null
  health_score?: number | null
  status?: string
}

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<SearchResult[]>([])
  const [community, setCommunity] = useState<SearchResult[]>([])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q.length >= 2) setQuery(q)
  }, [searchParams])

  // Debounced auto-search: as soon as the user pauses typing for 250ms (and
  // the query is >=2 chars), fire the request. The submit button is still
  // available for an explicit refresh.
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setProducts([])
      setCommunity([])
      return
    }
    setLoading(true)
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        const data = await res.json()
        if (data.success) {
          setProducts(data.data.products || [])
          setCommunity(data.data.community || [])
        } else {
          setProducts([])
          setCommunity([])
        }
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => clearTimeout(handle)
  }, [query])

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    if (query.trim().length < 2) return
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (data.success) {
        setProducts(data.data.products || [])
        setCommunity(data.data.community || [])
      }
    } finally {
      setLoading(false)
    }
  }

  function openProduct(barcode: string) {
    router.push(`/results?barcode=${encodeURIComponent(barcode)}`)
  }

  return (
    <RouteErrorBoundary>
      <div className="min-h-screen bg-[var(--background)] px-4 pt-10 pb-24">
        <h1 className="text-2xl font-black mb-4">Search products</h1>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Product or brand name..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)]"
              aria-label="Search products by name or brand"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm disabled:opacity-50"
          >
            {loading ? '...' : 'Search'}
          </button>
        </form>

        {products.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Verified products</h2>
            <ul className="space-y-2">
              {products.map((p) => (
                <li key={p.barcode}>
                  <button
                    type="button"
                    onClick={() => openProduct(p.barcode)}
                    className="w-full text-left p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-emerald-500/50"
                  >
                    <p className="font-semibold">{p.name}</p>
                    {p.brand && <p className="text-xs text-[var(--muted)]">{p.brand}</p>}
                    {p.health_score != null && (
                      <p className="text-xs text-emerald-600 mt-1">Score: {p.health_score}/10</p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {community.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-[var(--muted)] mb-2 uppercase tracking-wide">Community</h2>
            <ul className="space-y-2">
              {community.map((p) => (
                <li key={`c-${p.barcode}`}>
                  <button
                    type="button"
                    onClick={() => openProduct(p.barcode)}
                    className="w-full text-left p-4 rounded-xl bg-[var(--card)] border border-[var(--card-border)]"
                  >
                    <p className="font-semibold">{p.name}</p>
                    {p.brand && <p className="text-xs text-[var(--muted)]">{p.brand}</p>}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!loading && query.length >= 2 && products.length === 0 && community.length === 0 && (
          <p className="text-sm text-[var(--muted)] text-center py-8">
            No products found.{' '}
            <Link href="/contribute" className="text-emerald-600 underline">
              Contribute this product
            </Link>
          </p>
        )}
      </div>
    </RouteErrorBoundary>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[var(--muted)]">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
