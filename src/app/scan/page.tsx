"use client"
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import toast from 'react-hot-toast'

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

        // Save to personal scan history
        fetch('/api/scan-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            barcode: productData.barcode,
            product_name: productData.name,
            product_image: productData.image_url,
            ai_health_rating: analysisJson.data.health_rating,
            ai_health_score: analysisJson.data.health_score,
          })
        }).catch(console.error)
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
      toast.success(`Logged as ${mealType}!`)
    } else {
      toast.error('Failed to log. Make sure you are signed in.')
    }
  }

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
        setVisionStatus('✅ Product saved! Running AI analysis...')
        setShowVisionMode(false)

        const newProduct = {
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
        }
        setProduct(newProduct)

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

          // Save to personal scan history
          fetch('/api/scan-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              barcode: submitJson.data.barcode,
              product_name: submitJson.data.name,
              product_image: submitJson.data.image_url,
              ai_health_rating: analysisJson.data.health_rating,
              ai_health_score: analysisJson.data.health_score,
            })
          }).catch(console.error)
        }
        setLoadingAnalysis(false)
      }
    } catch (e) {
      setVisionStatus('Something went wrong. Please try again.')
    }

    setVisionCapturing(false)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 font-sans">
      <div className="max-w-lg mx-auto">

        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">🥗 NutriScan</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Scan any packaged food to get an AI health rating
        </p>

        <button
          onClick={() => setShowScanner(true)}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-base font-bold transition-colors mb-5"
        >
          📷 Scan Barcode
        </button>

        {loadingProduct && (
          <div className="text-center py-8 bg-[var(--card)] rounded-2xl border border-[var(--card-border)]">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm text-[var(--muted)]">Looking up product...</p>
          </div>
        )}

        {loadingAnalysis && (
          <div className="text-center py-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-3">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              🤖 Gemini AI is analysing the ingredients...
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Vision Mode */}
        {showVisionMode && (
          <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🇮🇳</span>
              <div>
                <p className="text-sm font-bold text-[var(--foreground)]">Product not in database</p>
                <p className="text-xs text-[var(--muted)]">Help build the Indian food database!</p>
              </div>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
              Barcode <strong className="text-[var(--foreground)]">{notFoundBarcode}</strong> was not found.
              Take a photo of the nutrition label and Gemini AI will read it automatically.
            </p>
            {visionStatus && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-700 dark:text-green-400 mb-3">
                {visionStatus}
              </div>
            )}
            <VisionCapture onCapture={handleVisionCapture} disabled={visionCapturing} />
          </div>
        )}

        {/* Product Card */}
        {product && (
          <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] shadow-sm mb-4">
            {product.image_url && (
              <div className="relative w-full h-44 mb-4">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 520px) 100vw, 520px"
                />
              </div>
            )}

            <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">{product.name}</h2>

            {product.brand && (
              <p className="text-sm text-[var(--muted)] mb-4">{product.brand}</p>
            )}

            {product.source === 'gemini_vision' && (
              <span className="inline-block px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium mb-3">
                🇮🇳 Added to Indian DB by you
              </span>
            )}

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: 'Calories', value: `${Math.round(product.nutrition.calories || 0)}`, unit: 'kcal' },
                { label: 'Protein', value: `${product.nutrition.protein || 0}`, unit: 'g' },
                { label: 'Carbs', value: `${product.nutrition.carbs || 0}`, unit: 'g' },
                { label: 'Fat', value: `${product.nutrition.fat || 0}`, unit: 'g' },
              ].map(item => (
                <div key={item.label} className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2 text-center">
                  <p className="text-base font-bold text-green-600 dark:text-green-400">{item.value}</p>
                  <p className="text-xs text-[var(--muted)]">{item.unit}</p>
                  <p className="text-xs text-[var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-[var(--muted)] mb-4">Per 100g · Source: {product.source}</p>

            <div>
              <p className="text-sm font-semibold text-[var(--foreground)] mb-2">Log this meal as:</p>
              <div className="flex gap-2 flex-wrap">
                {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
                  <button
                    key={meal}
                    onClick={() => handleLogMeal(meal)}
                    className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg text-xs font-medium text-green-700 dark:text-green-400 capitalize hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                  >
                    {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : meal === 'dinner' ? '🌙' : '🍎'} {meal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Card */}
        {analysis && (
          <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--card-border)] shadow-sm">
            <h3 className="text-base font-bold text-[var(--foreground)] mb-4">🤖 AI Health Analysis</h3>

            <div
              className="flex items-center gap-3 p-4 rounded-xl mb-4"
              style={{
                background: (ratingColors[analysis.health_rating] || '#6b7280') + '15',
                border: `1.5px solid ${(ratingColors[analysis.health_rating] || '#6b7280')}30`
              }}
            >
              <span className="text-3xl">{ratingEmoji[analysis.health_rating] || '❓'}</span>
              <div>
                <p className="text-lg font-bold capitalize" style={{ color: ratingColors[analysis.health_rating] }}>
                  {analysis.health_rating}
                </p>
                <p className="text-xs text-[var(--muted)]">Health Score: {analysis.health_score}/10</p>
              </div>
            </div>

            <p className="text-sm text-[var(--foreground)] leading-relaxed mb-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              {analysis.summary}
            </p>

            {analysis.safe_consumption && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl mb-4">
                <p className="text-xs font-bold text-[var(--foreground)] mb-2">✅ Safe Consumption</p>
                <p className="text-xs text-[var(--foreground)]"><strong>Amount:</strong> {analysis.safe_consumption.amount}</p>
                <p className="text-xs text-[var(--foreground)]"><strong>Frequency:</strong> {analysis.safe_consumption.frequency}</p>
                {analysis.safe_consumption.notes && (
                  <p className="text-xs text-[var(--muted)] mt-1">{analysis.safe_consumption.notes}</p>
                )}
              </div>
            )}

            {analysis.ingredient_warnings?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-[var(--foreground)] mb-2">⚠️ Ingredient Warnings</p>
                <div className="flex flex-col gap-2">
                  {analysis.ingredient_warnings.map((w: any, i: number) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 p-3 rounded-lg border-l-4 ${
                        w.severity === 'high'
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                          : w.severity === 'medium'
                          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                          : 'bg-gray-50 dark:bg-slate-800/50 border-gray-400'
                      }`}
                    >
                      <span className="text-sm">
                        {w.severity === 'high' ? '🔴' : w.severity === 'medium' ? '🟡' : '🟢'}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[var(--foreground)]">{w.ingredient}</p>
                        <p className="text-xs text-[var(--muted)]">{w.concern}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.positives?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-[var(--foreground)] mb-2">👍 What is Good</p>
                <div className="flex flex-col gap-1">
                  {analysis.positives.map((p: string, i: number) => (
                    <div key={i} className="text-xs text-[var(--foreground)] px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      • {p}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-[var(--muted)]">
              Analysed by Gemini AI · {new Date(analysis.analyzed_at).toLocaleDateString()}
            </p>
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

function VisionCapture({
  onCapture,
  disabled
}: {
  onCapture: (base64: string) => void
  disabled: boolean
}) {
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
      toast.error('Camera access denied. Please allow camera permission.')
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
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-colors"
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
            className="w-full rounded-xl mb-3 bg-black"
            muted
            playsInline
          />
          <div className="flex gap-2">
            <button
              onClick={capture}
              disabled={disabled}
              className={`flex-1 py-3 rounded-xl text-sm font-bold text-white transition-colors ${
                disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {disabled ? '🤖 Reading...' : '📸 Capture Label'}
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-3 bg-gray-100 dark:bg-slate-700 text-[var(--foreground)] rounded-xl text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}