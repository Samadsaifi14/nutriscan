'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { ProductCard } from '@/components/ProductCard'
import { SkeletonCard } from '@/components/Skeleton'
import { Search, X } from 'lucide-react'
import { writeScanResult } from '@/types/scanResult'

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const requestIdRef = useRef(0)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const myId = ++requestIdRef.current
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (myId !== requestIdRef.current) return
      setResults(data?.products ?? data?.results ?? [])
    } catch {
      setResults([])
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
          className="flex-1"
          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--cream)', fontSize: 14 }}
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
          <button onClick={() => { setQuery(''); setResults([]) }} style={{ color: 'var(--muted)' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="stack--sm">{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : results.length > 0 ? (
        <div className="stack--sm">
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
                  if (data?.product && data?.analysis) { writeScanResult({ product: data.product, analysis: data.analysis, quantity: 1, alternatives: data.alternatives }); router.replace("/results"); }
                } catch { /* silent */ }
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
