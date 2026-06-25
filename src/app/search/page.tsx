"use client"

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import Pill from '@/components/Pill'

interface SearchResult {
  barcode: string
  name: string
  brand?: string | null
  image_url?: string | null
  health_score?: number | null
  status?: string
}

const FILTERS = ['All', 'Healthy', 'Low Cal', 'Vegan', 'Gluten-free', 'Indian']
const CATEGORIES = [
  { emoji: '🍪', name: 'Biscuits', query: 'biscuit' },
  { emoji: '🥔', name: 'Chips', query: 'chips' },
  { emoji: '🥣', name: 'Cereals', query: 'cereal' },
  { emoji: '🧃', name: 'Juices', query: 'juice' },
  { emoji: '💪', name: 'Protein', query: 'protein' },
  { emoji: '🫙', name: 'Sauces', query: 'sauce' },
]

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<SearchResult[]>([])
  const [community, setCommunity] = useState<SearchResult[]>([])
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q.length >= 2) setQuery(q)
  }, [searchParams])

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

  function openProduct(barcode: string) {
    router.push(`/results?barcode=${encodeURIComponent(barcode)}`)
  }

  const hasResults = products.length > 0 || community.length > 0
  const showSearch = query.trim().length >= 2

  return (
    <PageShell variant="default" title="Search">
      {/* Search bar */}
      <div className="px-3 pt-2 pb-1 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 h-9 bg-[var(--surface-2)] border border-[var(--border-2)] rounded-xl px-3">
          <span className="text-sm text-[var(--muted)]">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands..."
            className="flex-1 bg-transparent text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            aria-label="Search products or brands"
          />
          <span className="text-sm text-[var(--muted)]">🎤</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 px-3 py-2 border-b border-[var(--border)] overflow-x-auto no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f.toLowerCase())}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap border transition-colors ${
              activeFilter === f.toLowerCase()
                ? 'bg-[var(--clay)] text-white border-[var(--clay)]'
                : 'bg-[var(--surface-2)] text-[var(--sand)] border-[var(--border-2)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 space-y-4">

        {showSearch && hasResults ? (
          <>
            {products.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Verified products</span>
                </div>
                <div className="space-y-1">
                  {products.map((p) => (
                    <button key={p.barcode} type="button" onClick={() => openProduct(p.barcode)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--clay)]/30 text-left transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex-shrink-0 overflow-hidden">
                        {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--foreground)] truncate">{p.name}</p>
                        {p.brand && <p className="text-[10px] text-[var(--sand)] truncate">{p.brand}</p>}
                      </div>
                      {p.health_score != null && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.health_score >= 7 ? 'bg-[var(--moss)]/15 text-[var(--moss)]' :
                          p.health_score >= 5 ? 'bg-[var(--amber)]/15 text-[var(--amber)]' :
                          'bg-[var(--rust)]/15 text-[var(--rust)]'
                        }`}>
                          {p.health_score}/10
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}
            {community.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Community</span>
                </div>
                <div className="space-y-1">
                  {community.map((p) => (
                    <button key={`c-${p.barcode}`} type="button" onClick={() => openProduct(p.barcode)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-left transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--foreground)] truncate">{p.name}</p>
                        {p.brand && <p className="text-[10px] text-[var(--sand)] truncate">{p.brand}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : showSearch && !hasResults && !loading ? (
          <div className="text-center py-12">
            <span className="text-3xl block mb-3">🔍</span>
            <p className="text-sm text-[var(--sand)] mb-2">No products found</p>
            <Link href="/contribute" className="text-xs text-[var(--clay)] underline font-medium">Contribute this product</Link>
          </div>
        ) : showSearch && loading ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 border-2 border-[var(--clay)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {/* Categories grid */}
            <section>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Popular categories</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(c => (
                  <button key={c.name} onClick={() => setQuery(c.query)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--clay)]/30 transition-colors text-left">
                    <span className="text-sm">{c.emoji}</span>
                    <span className="text-xs font-medium text-[var(--foreground)]">{c.name}</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

      </div>
    </PageShell>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[var(--muted)]">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
