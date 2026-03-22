"use client"
import { useState } from 'react'
import dynamic from 'next/dynamic'

const BarcodeScanner = dynamic(
  () => import('@/components/scanner/BarcodeScanner'),
  { ssr: false }
)

const ratingColors: Record<string, string> = {
  healthy: '#16a34a',
  moderate: '#d97706',
  unhealthy: '#dc2626',
}

const ratingEmoji: Record<string, string> = {
  healthy: '✅',
  moderate: '⚠️',
  unhealthy: '❌',
}

export default function ScanPage() {
  const [showScanner, setShowScanner] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loadingProduct, setLoadingProduct] = useState(false)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleBarcode(barcode: string) {
    setShowScanner(false)
    setLoadingProduct(true)
    setError(null)
    setProduct(null)
    setAnalysis(null)

    let productData = null
    try {
      const res = await fetch(`/api/scan?barcode=${barcode}`)
      const json = await res.json()
      setLoadingProduct(false)

      if (!json.success) {
        setError(`Product with barcode ${barcode} was not found. Try another product.`)
        return
      }

      productData = json.data
      setProduct(json.data)
    } catch (e) {
      setLoadingProduct(false)
      setError('Failed to look up product. Check your internet connection.')
      return
    }

    setLoadingAnalysis(true)
    try {
      const analysisRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productData })
      })

      const rawText = await analysisRes.text()
      console.log('Analysis response:', rawText.slice(0, 200))

      const analysisJson = JSON.parse(rawText)

      if (analysisJson.success) {
        setAnalysis(analysisJson.data)
      } else {
        console.log('Analysis failed:', analysisJson.error)
      }
    } catch (e) {
      console.log('Analysis error:', e)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  async function handleLogMeal(mealType: string) {
    if (!product) return

    const res = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_name: product.name,
        barcode: product.barcode,
        quantity_g: 100,
        calories_per_100g: product.nutrition.calories || 0,
        protein_per_100g: product.nutrition.protein || 0,
        carbs_per_100g: product.nutrition.carbs || 0,
        fat_per_100g: product.nutrition.fat || 0,
        sodium_per_100g: product.nutrition.sodium || 0,
        meal_type: mealType,
      })
    })

    const json = await res.json()
    if (json.success) {
      alert(`✅ Logged as ${mealType}! View in Dashboard.`)
    } else {
      alert('Failed to log. Make sure you are signed in.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0fdf4',
      fontFamily: 'sans-serif',
      padding: '24px 16px'
    }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
          🥗 NutriScan
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
          Scan any packaged food to get an AI health rating
        </p>

        <button
          onClick={() => setShowScanner(true)}
          style={{
            width: '100%',
            padding: '16px',
            background: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          📷 Scan Barcode
        </button>

        {loadingProduct && (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            background: 'white',
            borderRadius: '16px',
            color: '#6b7280',
            fontSize: '15px'
          }}>
            🔍 Looking up product...
          </div>
        )}

        {loadingAnalysis && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            background: '#fffbeb',
            borderRadius: '12px',
            color: '#92400e',
            fontSize: '14px',
            marginTop: '12px'
          }}>
            🤖 Gemini AI is analysing the ingredients...
          </div>
        )}

        {error && (
          <div style={{
            padding: '14px 16px',
            background: '#fef2f2',
            borderRadius: '12px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {product && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            marginBottom: '16px'
          }}>
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'contain',
                  marginBottom: '16px'
                }}
              />
            )}

            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '4px',
              color: '#111827'
            }}>
              {product.name}
            </h2>

            {product.brand && (
              <p style={{
                color: '#6b7280',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {product.brand}
              </p>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {[
                { label: 'Calories', value: `${Math.round(product.nutrition.calories || 0)}`, unit: 'kcal' },
                { label: 'Protein', value: `${product.nutrition.protein || 0}`, unit: 'g' },
                { label: 'Carbs', value: `${product.nutrition.carbs || 0}`, unit: 'g' },
                { label: 'Fat', value: `${product.nutrition.fat || 0}`, unit: 'g' },
              ].map(item => (
                <div key={item.label} style={{
                  background: '#f0fdf4',
                  borderRadius: '10px',
                  padding: '10px 6px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#16a34a'
                  }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>
                    {item.unit}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              Per 100g · Source: {product.source}
            </div>

            {/* ← LOG MEAL BUTTONS ADDED HERE */}
            <div style={{ marginTop: '16px' }}>
              <p style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '8px'
              }}>
                Log this meal as:
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
                  <button
                    key={meal}
                    onClick={() => handleLogMeal(meal)}
                    style={{
                      padding: '8px 14px',
                      background: '#f0fdf4',
                      border: '1.5px solid #16a34a',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#16a34a',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {meal === 'breakfast' ? '🌅' :
                     meal === 'lunch' ? '☀️' :
                     meal === 'dinner' ? '🌙' : '🍎'} {meal}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {analysis && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '16px',
              color: '#111827'
            }}>
              🤖 AI Health Analysis
            </h3>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              background: (ratingColors[analysis.health_rating] || '#6b7280') + '15',
              border: `1.5px solid ${(ratingColors[analysis.health_rating] || '#6b7280')}30`
            }}>
              <span style={{ fontSize: '28px' }}>
                {ratingEmoji[analysis.health_rating] || '❓'}
              </span>
              <div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: ratingColors[analysis.health_rating] || '#6b7280',
                  textTransform: 'capitalize'
                }}>
                  {analysis.health_rating}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Health Score: {analysis.health_score}/10
                </div>
              </div>
            </div>

            <p style={{
              fontSize: '14px',
              color: '#374151',
              lineHeight: 1.7,
              marginBottom: '16px',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '10px'
            }}>
              {analysis.summary}
            </p>

            {analysis.safe_consumption && (
              <div style={{
                padding: '12px 14px',
                background: '#f0fdf4',
                borderRadius: '10px',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: '13px',
                  marginBottom: '6px',
                  color: '#111827'
                }}>
                  ✅ Safe Consumption
                </div>
                <div style={{ fontSize: '13px', color: '#374151' }}>
                  <strong>Amount:</strong> {analysis.safe_consumption.amount}
                </div>
                <div style={{ fontSize: '13px', color: '#374151' }}>
                  <strong>Frequency:</strong> {analysis.safe_consumption.frequency}
                </div>
                {analysis.safe_consumption.notes && (
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                    {analysis.safe_consumption.notes}
                  </div>
                )}
              </div>
            )}

            {analysis.ingredient_warnings?.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: '13px',
                  marginBottom: '8px',
                  color: '#111827'
                }}>
                  ⚠️ Ingredient Warnings
                </div>
                {analysis.ingredient_warnings.map((w: any, i: number) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    marginBottom: '6px',
                    borderRadius: '8px',
                    background: w.severity === 'high' ? '#fef2f2' : w.severity === 'medium' ? '#fffbeb' : '#f9fafb',
                    borderLeft: `3px solid ${w.severity === 'high' ? '#dc2626' : w.severity === 'medium' ? '#d97706' : '#9ca3af'}`
                  }}>
                    <span style={{ fontSize: '14px' }}>
                      {w.severity === 'high' ? '🔴' : w.severity === 'medium' ? '🟡' : '🟢'}
                    </span>
                    <div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#111827'
                      }}>
                        {w.ingredient}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {w.concern}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {analysis.positives?.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: '13px',
                  marginBottom: '8px',
                  color: '#111827'
                }}>
                  👍 What's Good
                </div>
                {analysis.positives.map((p: string, i: number) => (
                  <div key={i} style={{
                    fontSize: '13px',
                    color: '#374151',
                    padding: '6px 10px',
                    marginBottom: '4px',
                    background: '#f0fdf4',
                    borderRadius: '6px'
                  }}>
                    • {p}
                  </div>
                ))}
              </div>
            )}

            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
              Analysed by Gemini AI · {new Date(analysis.analyzed_at).toLocaleDateString()}
            </div>
          </div>
        )}

      </div>

      {showScanner && (
        <BarcodeScanner
          onDetected={handleBarcode}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}