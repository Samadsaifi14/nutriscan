'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { PageShell } from '@/components/PageShell'
import { HealthScoreRing } from '@/components/HealthScoreRing'
import { Pill } from '@/components/Pill'
import { ShareButton } from '@/components/ShareButton'
import { ShoppingLinks } from '@/components/ShoppingLinks'
import { ArrowLeft, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import type { ScanResultPayload } from '@/types/scanResult'

export default function Results() {
  const router = useRouter()
  const [data, setData] = useState<ScanResultPayload | null>(null)
  const [tab, setTab] = useState<'overview' | 'nutrition' | 'ingredients' | 'alternatives'>('overview')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hox_scan_result_v1') || sessionStorage.getItem('hox_scan_result_v1')
      if (raw) {
        const parsed = JSON.parse(raw) as ScanResultPayload
        if (parsed.version === 1 && parsed.product && parsed.analysis) setData(parsed)
      }
    } catch {
      // silent
    }
  }, [])

  if (!data) {
    return (
      <PageShell title="Results" showBack noBorder>
        <div className="empty-state" style={{ minHeight: '60dvh', justifyContent: 'center' }}>
          <div className="empty-state__icon"><Info size={24} /></div>
          <p className="text-body" style={{ fontWeight: 600 }}>No scan result found</p>
          <p className="text-xs text-sand">Scan a product to see results here</p>
          <button className="btn btn--primary btn--sm" style={{ marginTop: 12 }} onClick={() => router.push('/scan')}>
            Scan Now
          </button>
        </div>
      </PageShell>
    )
  }

  const { product, analysis } = data
  const tabs = ['overview', 'nutrition', 'ingredients', 'alternatives'] as const

  return (
    <PageShell
      title={product.name}
      showBack
      right={<ShareButton title={product.name} url={typeof window !== 'undefined' ? window.location.href : ''} />}
    >
      {/* Product header */}
      <div className="card row--md" style={{ marginBottom: 16, background: 'var(--surface-2)' }}>
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} width={56} height={56} className="product-card__thumb" />
        ) : (
          <div className="product-card__thumb" />
        )}
        <div className="flex-1 stack--sm">
          <span className="text-body" style={{ fontWeight: 700 }}>{product.name}</span>
          <span className="text-xs" style={{ color: 'var(--sand)' }}>{product.brand}</span>
        </div>
        <HealthScoreRing score={analysis.health_score} size="sm" />
      </div>

      {/* Tab bar */}
      <div className="tab-bar" style={{ marginBottom: 16 }}>
        {tabs.map((t) => (
          <button key={t} className={`tab-bar__item ${tab === t ? 'tab-bar__item--active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="stack--md">
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--clay-bg), var(--surface-2))' }}>
            <span className="text-xs" style={{ color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Summary</span>
            <p className="text-sm" style={{ marginTop: 8 }}>{analysis.summary}</p>
          </div>

          {analysis.health_score_breakdown && (
            <div className="grid-2">
              {[
                { label: 'Nutrition', value: analysis.health_score_breakdown.nutrition_score },
                { label: 'Ingredients', value: analysis.health_score_breakdown.ingredient_safety_score },
                { label: 'Processing', value: analysis.health_score_breakdown.processing_score },
              ].map((item) => (
                <div key={item.label} className="stat-card">
                  <div className="stat-card__value">{item.value.toFixed(0)}</div>
                  <div className="stat-card__label">{item.label}</div>
                </div>
              ))}
            </div>
          )}

          {analysis.positives && analysis.positives.length > 0 && (
            <div className="card card--healthy">
              <div className="row--sm" style={{ marginBottom: 8 }}>
                <CheckCircle size={14} color="var(--moss)" />
                <span className="text-xs" style={{ fontWeight: 600, color: 'var(--moss)' }}>Positives</span>
              </div>
              <ul style={{ listStyle: 'none' }}>
                {analysis.positives.map((p, i) => (
                  <li key={i} className="text-xs" style={{ color: 'var(--sand)', paddingLeft: 12, position: 'relative', marginBottom: 4 }}>
                    <span style={{ position: 'absolute', left: 0 }}>&bull;</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="card card--warning">
              <div className="row--sm" style={{ marginBottom: 8 }}>
                <AlertTriangle size={14} color="var(--amber)" />
                <span className="text-xs" style={{ fontWeight: 600, color: 'var(--amber)' }}>Recommendations</span>
              </div>
              <ul style={{ listStyle: 'none' }}>
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="text-xs" style={{ color: 'var(--sand)', paddingLeft: 12, position: 'relative', marginBottom: 4 }}>
                    <span style={{ position: 'absolute', left: 0 }}>&bull;</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Shopping Links */}
          <div className="section-header" style={{ marginTop: 8 }}>
            <span className="section-header__title">Buy Online</span>
          </div>
          <ShoppingLinks productName={product.name} />
        </div>
      )}

      {tab === 'nutrition' && (
        <div className="stack--md">
          <div className="card">
            <span className="text-xs" style={{ color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12, display: 'block' }}>
              Per {product.serving_size_g ? `${product.serving_size_g}g` : 'serving'}
            </span>
            <div className="stack--sm">
              {[
                { label: 'Calories', value: `${product.nutrition.calories}`, unit: 'kcal' },
                { label: 'Protein', value: `${product.nutrition.protein}`, unit: 'g' },
                { label: 'Carbs', value: `${product.nutrition.carbs}`, unit: 'g' },
                { label: 'Fat', value: `${product.nutrition.fat}`, unit: 'g' },
                ...(product.nutrition.saturated_fat != null ? [{ label: 'Saturated Fat', value: `${product.nutrition.saturated_fat}`, unit: 'g' }] : []),
                ...(product.nutrition.sugar != null ? [{ label: 'Sugar', value: `${product.nutrition.sugar}`, unit: 'g' }] : []),
                ...(product.nutrition.sodium != null ? [{ label: 'Sodium', value: `${product.nutrition.sodium}`, unit: 'mg' }] : []),
                ...(product.nutrition.fiber != null ? [{ label: 'Fiber', value: `${product.nutrition.fiber}`, unit: 'g' }] : []),
              ].map((item) => (
                <div key={item.label} className="row--md" style={{ justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-2)' }}>
                  <span className="text-xs" style={{ color: 'var(--sand)' }}>{item.label}</span>
                  <span className="text-xs text-mono" style={{ fontWeight: 600 }}>{item.value}<span style={{ color: 'var(--muted)', fontWeight: 400 }}> {item.unit}</span></span>
                </div>
              ))}
            </div>
          </div>
          {product.ingredients_text && (
            <div className="card">
              <span className="text-xs" style={{ color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8, display: 'block' }}>
                Ingredients
              </span>
              <p className="text-xs" style={{ color: 'var(--sand)', lineHeight: 1.6 }}>{product.ingredients_text}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'ingredients' && (
        <div className="stack--md">
          {analysis.harmful_ingredients && analysis.harmful_ingredients.length > 0 ? (
            analysis.harmful_ingredients.map((ing, i) => (
              <div key={i} className="card card--harmful">
                <div className="row--sm" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="text-sm" style={{ fontWeight: 700 }}>{ing.name}</span>
                  <Pill variant={ing.severity === 'high' ? 'harmful' : ing.severity === 'medium' ? 'warning' : 'healthy'}>
                    {ing.severity}
                  </Pill>
                </div>
                <p className="text-xs" style={{ color: 'var(--sand)' }}>{ing.reason}</p>
              </div>
            ))
          ) : (
            <div className="card card--healthy">
              <p className="text-sm" style={{ color: 'var(--moss)', fontWeight: 600 }}>No harmful ingredients detected</p>
            </div>
          )}
        </div>
      )}

      {tab === 'alternatives' && (
        <div className="stack--sm">
          {data.alternatives && data.alternatives.length > 0 ? (
            data.alternatives.map((alt, i) => (
              <div key={i} className="card row--md">
                {alt.image_url && (
                  <Image src={alt.image_url} alt={alt.name} width={44} height={44} style={{ borderRadius: 10, objectFit: 'cover', background: 'var(--surface-3)' }} />
                )}
                <div className="flex-1 stack--sm">
                  <span className="text-sm" style={{ fontWeight: 700 }}>{alt.name}</span>
                  <span className="text-xs" style={{ color: 'var(--sand)' }}>{alt.brand}</span>
                  <p className="text-xs" style={{ color: 'var(--clay)' }}>{alt.reason}</p>
                </div>
                <HealthScoreRing score={alt.health_score} size="xs" />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon"><Info size={24} /></div>
              <p className="text-sm" style={{ color: 'var(--sand)' }}>No alternatives found</p>
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}
