'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { ProductCard } from '@/components/ProductCard'
import { SkeletonCard } from '@/components/Skeleton'
import { Search, X, RefreshCw, Database } from 'lucide-react'
import { writeScanResult } from '@/types/scanResult'

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [partial, setPartial] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const requestIdRef = useRef(0)

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setError(''); return }
    setLoading(true)
    setError('')
    try {
      const myId = ++requestIdRef.current
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (myId !== requestIdRef.current) return
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Search failed')
      setResults(data?.products ?? data?.results ?? [])
      setPartial(Boolean(data?.partial))
    } catch (searchError) {
      setResults([])
      setError(searchError instanceof Error ? searchError.message : 'Search is temporarily unavailable.')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <PageShell title="Search">
      <div className="search-bar" style={{ marginBottom: 16 }}>
        <Search size={16} />
        <input
          autoFocus
          className="input flex-1"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            const val = e.target.value
            setQuery(val)
            clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => doSearch(val), 300)
          }}
        />
        {query && (
          <button className="icon-btn" aria-label="Clear search" onClick={() => { setQuery(''); setResults([]); setError('') }} style={{ position: 'absolute', right: 4, width: 40, height: 40 }}>
            <X size={16} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="stack--sm">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : error ? (
        <div className="empty-state stack--sm">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{error}</p>
          <button className="btn btn--secondary" onClick={() => doSearch(query)}>
            <RefreshCw size={15} /> Try again
          </button>
        </div>
      ) : results.length > 0 ? (
        <div className="stack--sm">
          <div className="row text-xs" style={{ gap: 6, color: 'var(--muted)', padding: '0 2px' }}>
            <Database size={13} />
            <span>{partial ? 'Showing available results' : 'NutriScan + live Open Food Facts results'}</span>
          </div>
          {results.filter((item) => item.product).map((item, i) => (
            <ProductCard
              key={i}
              product={item.product as { name: string; brand: string; image_url?: string }}
              analysis={item.analysis as { health_score: number; health_rating: 'healthy' | 'moderate' | 'unhealthy' }}
              onClick={async () => {
                const barcode = (item.product as Record<string, string>)?.barcode;
                if (!barcode) return;
                try {
                  const res = await fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ barcode }) });
                  const data = await res.json();
                  if (!res.ok || !data?.product || !data?.analysis) throw new Error(data?.message || data?.error || 'Could not analyze this product')
                  writeScanResult({ product: data.product, analysis: data.analysis, quantity: 1, alternatives: data.alternatives });
                  router.replace('/results');
                } catch (scanError) {
                  setError(scanError instanceof Error ? scanError.message : 'Could not analyze this product.')
                }
              }}
            />
          ))}
        </div>
      ) : query && !loading ? (
        <div className="empty-state">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>No products found</p>
        </div>
      ) : null}
    </PageShell>
  )
}
