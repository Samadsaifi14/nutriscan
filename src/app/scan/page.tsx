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
  const [showVisionMode, setShowVisionMode] = useState(false)
  const [notFoundBarcode, setNotFoundBarcode] = useState<string | null>(null)
  const [visionCapturing, setVisionCapturing] = useState(false)
  const [visionStatus, setVisionStatus] = useState('')

  async function handleBarcode(barcode: string) {
    setShowScanner(false)
    setLoadingProduct(true)
    setError(null)
    setProduct(null)
    setAnalysis(null)
    setShowVisionMode(false)

    let productData = null
    try {
      const res = await fetch(`/api/scan?barcode=${barcode}`)
      const json = await res.json()
      setLoadingProduct(false)

      // Product not found — switch to vision mode
      if (!json.success && json.error === 'PRODUCT_NOT_FOUND') {
        setNotFoundBarcode(barcode)
        setShowVisionMode(true)
        return
      }

      if (!json.success) {
        setError('Something went wrong. Please try again.')
        return
      }

      productData = json.data
      setProduct(json.data)
    } catch (e) {
      setLoadingProduct(false)
      setError('Failed to look up product. Check your internet connection.')
      return
    }

    // Run AI analysis
    setLoadingAnalysis(true)
    try {
      const analysisRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productData })
      })
      const rawText = await analysisRes.text()
      const analysisJson = JSON.parse(rawText)
      if (analysisJson.success) {
        setAnalysis(analysisJson.data)
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

  // Handle photo capture in vision mode
  async function handleVisionCapture(imageBase64: string) {
    setVisionCapturing(true)
    setVisionStatus('🤖 Gemini is reading the label...')

    try {
      const res = await fetch('/api/scan-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      })
      const json = await res.json()

      if (!json.success || !json.data) {
        setVisionStatus('Could not read label. Try again with better lighting.')
        setVisionCapturing(false)
        return
      }

      const extracted = json.data
      setVisionStatus('✅ Label read! Saving to Indian product database...')

      // Save to our Indian product DB
      const submitRes = await fetch('/api/products/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...extracted,
          barcode: extracted.barcode || notFoundBarcode || `vision-${Date.now()}`,
        })
      })
      const submitJson = await submitRes.json()

      if (submitJson.success) {
        setVisionStatus('✅ Product saved to India DB! Running AI analysis...')
        setShowVisionMode(false)
        // Now analyze the product
        setProduct({
          id: submitJson.data.id,
          barcode: submitJson.data.barcode,
          name: submitJson.data.name || extracted.name,
          brand: submitJson.data.brand,
          source: 'gemini_vision',
          nutrition: {
            calories: submitJson.data.calories_per_100g || 0,
            protein: submitJson.data.protein_per_100g || 0,
            carbs: submitJson.data.carbs_per_100g || 0,
            fat: submitJson.data.fat_per_100g || 0,
            sugar: submitJson.data.sugar_per_100g,
            sodium: submitJson.data.sodium_per_100g,
          },
          ingredients_text: submitJson.data.ingredients_text,
          allergens: submitJson.data.allergens || [],
          additives: submitJson.data.additives || [],
        })

        // Run AI analysis on the new product
        setLoadingAnalysis(true)
        const analysisRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product: submitJson.data })
        })
        const rawText = await analysisRes.text()
        const analysisJson = JSON.parse(rawText)
        if (analysisJson.success) {
          setAnalysis(analysisJson.data)
        }
        setLoadingAnalysis(false)
      }
    } catch (e) {
      setVisionStatus('Something went wrong. Please try again.')
    }

    setVisionCapturing(false)
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
            width: '100%', padding: '16px',
            background: '#16a34a', color: 'white',
            border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: 600,
            cursor: 'pointer', marginBottom: '20px'
          }}
        >
          📷 Scan Barcode
        </button>

        {loadingProduct && (
          <div style={{
            textAlign: 'center', padding: '32px',
            background: 'white', borderRadius: '16px',
            color: '#6b7280', fontSize: '15px'
          }}>
            🔍 Looking up product...
          </div>
        )}

        {loadingAnalysis && (
          <div style={{
            textAlign: 'center', padding: '20px',
            background: '#fffbeb', borderRadius: '12px',
            color: '#92400e', fontSize: '14px', marginTop: '12px'
          }}>
            🤖 Gemini AI is analysing the ingredients...
          </div>
        )}

        {error && (
          <div style={{
            padding: '14px 16px', background: '#fef2f2',
            borderRadius: '12px', color: '#dc2626', fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Vision Mode — shown when product not found */}
        {showVisionMode && (
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>🇮🇳</span>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                  Product not in database
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Help build the Indian food database!
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#374151', marginBottom: '16px', lineHeight: 1.6 }}>
              Barcode <strong>{notFoundBarcode}</strong> was not found. Take a photo of the
              nutrition label and Gemini AI will read it automatically and add it to our
              Indian product database.
            </p>

            {visionStatus && (
              <div style={{
                padding: '10px 14px', background: '#f0fdf4',
                borderRadius: '8px', fontSize: '13px',
                color: '#16a34a', marginBottom: '12px'
              }}>
                {visionStatus}
              </div>
            )}

            <VisionCapture
              onCapture={handleVisionCapture}
              disabled={visionCapturing}
            />
          </div>
        )}

        {product && (
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            marginBottom: '16px'
          }}>
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: '100%', height: '180px',
                  objectFit: 'contain', marginBottom: '16px'
                }}
              />
            )}

            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px', color: '#111827' }}>
              {product.name}
            </h2>

            {product.brand && (
              <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px' }}>
                {product.brand}
              </p>
            )}

            {product.source === 'gemini_vision' && (
              <div style={{
                display: 'inline-block', padding: '4px 10px',
                background: '#fef3c7', borderRadius: '20px',
                fontSize: '12px', color: '#92400e',
                marginBottom: '12px'
              }}>
                🇮🇳 Added to Indian DB by you
              </div>
            )}

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '8px', marginBottom: '16px'
            }}>
              {[
                { label: 'Calories', value: `${Math.round(product.nutrition.calories || 0)}`, unit: 'kcal' },
                { label: 'Protein', value: `${product.nutrition.protein || 0}`, unit: 'g' },
                { label: 'Carbs', value: `${product.nutrition.carbs || 0}`, unit: 'g' },
                { label: 'Fat', value: `${product.nutrition.fat || 0}`, unit: 'g' },
              ].map(item => (
                <div key={item.label} style={{
                  background: '#f0fdf4', borderRadius: '10px',
                  padding: '10px 6px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#16a34a' }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>{item.unit}</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '11px', color: '#9ca3af' }}>
              Per 100g · Source: {product.source}
            </div>

            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
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
                      borderRadius: '8px', fontSize: '13px',
                      color: '#16a34a', fontWeight: 500,
                      cursor: 'pointer', textTransform: 'capitalize'
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
            background: 'white', borderRadius: '16px',
            padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>
              🤖 AI Health Analysis
            </h3>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', borderRadius: '12px', marginBottom: '16px',
              background: (ratingColors[analysis.health_rating] || '#6b7280') + '15',
              border: `1.5px solid ${(ratingColors[analysis.health_rating] || '#6b7280')}30`
            }}>
              <span style={{ fontSize: '28px' }}>
                {ratingEmoji[analysis.health_rating] || '❓'}
              </span>
              <div>
                <div style={{
                  fontSize: '18px', fontWeight: 700,
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
              fontSize: '14px', color: '#374151', lineHeight: 1.7,
              marginBottom: '16px', padding: '12px',
              background: '#f9fafb', borderRadius: '10px'
            }}>
              {analysis.summary}
            </p>

            {analysis.safe_consumption && (
              <div style={{
                padding: '12px 14px', background: '#f0fdf4',
                borderRadius: '10px', marginBottom: '16px'
              }}>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', color: '#111827' }}>
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
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', color: '#111827' }}>
                  ⚠️ Ingredient Warnings
                </div>
                {analysis.ingredient_warnings.map((w: any, i: number) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '10px 12px', marginBottom: '6px', borderRadius: '8px',
                    background: w.severity === 'high' ? '#fef2f2' : w.severity === 'medium' ? '#fffbeb' : '#f9fafb',
                    borderLeft: `3px solid ${w.severity === 'high' ? '#dc2626' : w.severity === 'medium' ? '#d97706' : '#9ca3af'}`
                  }}>
                    <span style={{ fontSize: '14px' }}>
                      {w.severity === 'high' ? '🔴' : w.severity === 'medium' ? '🟡' : '🟢'}
                    </span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
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
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', color: '#111827' }}>
                  👍 What is Good
                </div>
                {analysis.positives.map((p: string, i: number) => (
                  <div key={i} style={{
                    fontSize: '13px', color: '#374151',
                    padding: '6px 10px', marginBottom: '4px',
                    background: '#f0fdf4', borderRadius: '6px'
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

// Vision capture component — shows camera + capture button
function VisionCapture({
  onCapture,
  disabled
}: {
  onCapture: (base64: string) => void
  disabled: boolean
}) {
  const videoRef = useState<HTMLVideoElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      setStream(s)
      setCameraActive(true)
    } catch {
      alert('Camera access denied. Please allow camera permission.')
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach(t => t.stop())
    setStream(null)
    setCameraActive(false)
  }

  async function capture() {
    if (!videoEl) return
    const canvas = document.createElement('canvas')
    canvas.width = videoEl.videoWidth
    canvas.height = videoEl.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(videoEl, 0, 0)
    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
    stopCamera()
    onCapture(base64)
  }

  return (
    <div>
      {!cameraActive ? (
        <button
          onClick={startCamera}
          style={{
            width: '100%', padding: '14px',
            background: '#f59e0b', color: 'white',
            border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          📸 Open Camera to Read Label
        </button>
      ) : (
        <div>
          <video
            ref={el => {
              if (el && stream) {
                el.srcObject = stream
                el.play()
                setVideoEl(el)
              }
            }}
            style={{
              width: '100%', borderRadius: '10px',
              marginBottom: '10px', background: '#000'
            }}
            muted playsInline
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={capture}
              disabled={disabled}
              style={{
                flex: 1, padding: '12px',
                background: disabled ? '#9ca3af' : '#16a34a',
                color: 'white', border: 'none',
                borderRadius: '8px', fontSize: '14px',
                fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer'
              }}
            >
              {disabled ? '🤖 Reading...' : '📸 Capture Label'}
            </button>
            <button
              onClick={stopCamera}
              style={{
                padding: '12px 16px',
                background: '#f3f4f6', color: '#374151',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
