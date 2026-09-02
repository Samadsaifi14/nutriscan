// Client for the Scrapling-powered Python scraper service.
// Falls back gracefully when the service is unavailable.

const SCRAPER_URL = process.env.SCRAPER_URL || 'http://localhost:8100'
const SCRAPER_TIMEOUT = 15_000

interface ScrapedProduct {
  name: string
  brand: string | null
  barcode: string | null
  image_url: string | null
  ingredients_text: string | null
  nutrition_per_100g: {
    calories: number | null
    protein: number | null
    carbs: number | null
    fat: number | null
    saturated_fat: number | null
    sugar: number | null
    sodium: number | null
    fiber: number | null
  }
  source: string
  source_url: string | null
}

interface ScrapeResponse {
  success: boolean
  product: ScrapedProduct | null
  error: string | null
}

interface AlternativeProduct {
  name: string
  brand: string | null
  image_url: string | null
  nutrition_per_100g: {
    calories: number | null
    protein: number | null
    carbs: number | null
    fat: number | null
    saturated_fat: number | null
    sugar: number | null
    sodium: number | null
    fiber: number | null
  }
  ingredients_text: string | null
  source: string
  score: number | null
}

interface AlternativesResponse {
  success: boolean
  alternatives: AlternativeProduct[]
  error: string | null
}

async function scraperFetch<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), SCRAPER_TIMEOUT)

    const res = await fetch(`${SCRAPER_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      console.warn(`Scraper service returned ${res.status}`)
      return null
    }

    return res.json() as Promise<T>
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.warn('Scraper service timed out')
    } else {
      console.warn('Scraper service unavailable:', err.message)
    }
    return null
  }
}

/**
 * Scrape an Indian grocery product page for nutrition data.
 * Uses Scrapling's StealthyFetcher to bypass Cloudflare on bigbasket/blinkit.
 */
export async function scrapeIndianProduct(
  searchHint: string,
  brand: string | null = null,
  barcode: string | null = null,
): Promise<{
  name: string
  brand: string | null
  image_url: string | null
  ingredients_text: string | null
  calories_per_100g: number | null
  protein_per_100g: number | null
  carbs_per_100g: number | null
  fat_per_100g: number | null
  saturated_fat_per_100g: number | null
  sugar_per_100g: number | null
  sodium_per_100g: number | null
  fiber_per_100g: number | null
  source: string
  source_url: string | null
} | null> {
  const data = await scraperFetch<ScrapeResponse>('/scrape/indian-product', {
    search_hint: searchHint,
    brand,
    barcode,
  })

  if (!data?.success || !data.product) return null

  const p = data.product
  const n = p.nutrition_per_100g

  return {
    name: p.name,
    brand: p.brand,
    image_url: p.image_url,
    ingredients_text: p.ingredients_text,
    calories_per_100g: n.calories,
    protein_per_100g: n.protein,
    carbs_per_100g: n.carbs,
    fat_per_100g: n.fat,
    saturated_fat_per_100g: n.saturated_fat,
    sugar_per_100g: n.sugar,
    sodium_per_100g: n.sodium,
    fiber_per_100g: n.fiber,
    source: p.source,
    source_url: p.source_url,
  }
}

/**
 * Enrich product data by scraping the Open Food Facts HTML page.
 * Fallback when the OFF JSON API returns incomplete data.
 */
export async function scrapeOffEnrichment(
  barcode: string,
  productName: string | null = null,
): Promise<{
  name: string | null
  brand: string | null
  image_url: string | null
  ingredients_text: string | null
  nutrition_per_100g: Record<string, number | null>
  source: string
} | null> {
  const data = await scraperFetch<ScrapeResponse>('/scrape/off-enrich', {
    barcode,
    product_name: productName,
  })

  if (!data?.success || !data.product) return null

  return {
    name: data.product.name,
    brand: data.product.brand,
    image_url: data.product.image_url,
    ingredients_text: data.product.ingredients_text,
    nutrition_per_100g: data.product.nutrition_per_100g,
    source: data.product.source,
  }
}

/**
 * Scrape alternative products from Indian grocery sites.
 */
export async function scrapeAlternatives(
  productName: string,
  category: string | null = null,
  brand: string | null = null,
  ingredientsText: string | null = null,
  maxResults: number = 10,
): Promise<AlternativeProduct[] | null> {
  const data = await scraperFetch<AlternativesResponse>('/scrape/alternatives', {
    product_name: productName,
    category,
    brand,
    ingredients_text: ingredientsText,
    max_results: maxResults,
  })

  if (!data?.success) return null

  return data.alternatives
}

/**
 * Check if the scraper service is healthy.
 */
export async function checkScraperHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${SCRAPER_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    })
    return res.ok
  } catch {
    return false
  }
}
