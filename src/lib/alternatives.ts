// HealthOX - Dynamic Healthier Alternatives Engine
// Fetches similar products, scores them, ranks by health score

import { scoreProduct, type NutritionPer100g, type HealthScoreResult } from '@/lib/health-engine'

export interface AlternativeProduct {
  barcode: string
  name: string
  brand: string | null
  category: string | null
  image_url: string | null
  nutrition_per_100g: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    sugar?: number
    sodium?: number
    fiber?: number
  }
  ingredients_text: string | null
  score: number
  grade: string
  nova_group: number
  detected_additives: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Search OFF by top ingredients (fallback when category search yields nothing)
// ─────────────────────────────────────────────────────────────────────────────

export async function searchOFFByIngredients(
  ingredientsText: string,
  maxAlternatives: number = 5
): Promise<AlternativeProduct[]> {
  if (!ingredientsText) return []

  // Extract top 3 ingredients (first items in comma-separated list)
  const topIngredients = ingredientsText
    .split(',')
    .map(i => i.trim().toLowerCase())
    .filter(i => i.length > 2 && !/water|salt|sugar|oil/i.test(i))
    .slice(0, 3)

  if (topIngredients.length === 0) return []

  const searchQuery = topIngredients.join(' ')
  console.log(`Searching OFF by ingredients: ${searchQuery}`)

  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&search_simple=1&action=process&json=1&page_size=${maxAlternatives * 2}&tagtype_0=countries&tag_contains_0=contains&tag_0=india`
    const response = await fetch(url, {
      headers: { 'User-Agent': 'HealthOX/1.0' },
    })

    if (!response.ok) return []

    const data = await response.json()
    const products: OpenFoodFactsProduct[] = data.products || []

    return products
      .filter(p => p.product_name && p.nutriments)
      .map(p => {
        const n = p.nutriments || {}
        const nutrition: NutritionPer100g = {
          calories: n['energy-kcal_100g'],
          protein: n.proteins_100g,
          carbohydrates: n.carbohydrates_100g,
          total_fat: n.fat_100g,
          sugar: n.sugars_100g,
          sodium: n.sodium_100g ? n.sodium_100g * 1000 : undefined,
          fiber: n.fiber_100g,
        }
        const scored = scoreProduct(nutrition, p.ingredients_text || '')
        return {
          barcode: p.code,
          name: p.product_name || 'Unknown',
          brand: p.brands || null,
          category: p.categories?.split(',')[0] || null,
          image_url: p.image_url || null,
          nutrition_per_100g: {
            calories: n['energy-kcal_100g'] || undefined,
            protein: n.proteins_100g || undefined,
            carbs: n.carbohydrates_100g || undefined,
            fat: n.fat_100g || undefined,
            sugar: n.sugars_100g || undefined,
            sodium: n.sodium_100g ? n.sodium_100g * 1000 : undefined,
            fiber: n.fiber_100g || undefined,
          },
          ingredients_text: p.ingredients_text || null,
          score: scored.score,
          grade: scored.grade,
          nova_group: scored.nova_group,
          detected_additives: scored.detected_additives.map(a => a.name),
        }
      })
      .slice(0, maxAlternatives)
  } catch (error: any) {
    console.error('OFF by ingredients error:', error.message)
    return []
  }
}

export interface WhyBetter {
  metric: string
  current: string
  alternative: string
  improvement: string
}

export interface AlternativeResult {
  alternatives: AlternativeProduct[]
  why_better: WhyBetter[]
  current_score: number
  current_grade: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch from Open Food Facts
// ─────────────────────────────────────────────────────────────────────────────

interface OpenFoodFactsProduct {
  code: string
  product_name?: string
  brands?: string
  categories?: string
  image_url?: string
  nutriments?: {
    'energy-kcal_100g'?: number
    proteins_100g?: number
    carbohydrates_100g?: number
    fat_100g?: number
    sugars_100g?: number
    sodium_100g?: number
    fiber_100g?: number
  }
  ingredients_text?: string
}

interface FetchedProduct {
  barcode: string
  name: string
  brand: string | null
  category: string | null
  image_url: string | null
  nutrition_per_100g: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    sugar?: number
    sodium?: number
    fiber?: number
  }
  ingredients_text: string | null
}

async function fetchFromOpenFoodFacts(category: string, limit: number = 20): Promise<FetchedProduct[]> {
  try {
    // Search by category
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(category)}&search_simple=1&action=process&json=1&page_size=${limit}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'HealthOX/1.0',
      },
    })

    if (!response.ok) {
      console.warn('Open Food Facts API error:', response.status)
      return []
    }

    const data = await response.json()
    const products: OpenFoodFactsProduct[] = data.products || []

    return products
      .filter(p => p.product_name && p.nutriments)
      .map(p => {
        const n = p.nutriments || {}
        return {
          barcode: p.code,
          name: p.product_name || 'Unknown',
          brand: p.brands || null,
          category: p.categories?.split(',')[0] || null,
          image_url: p.image_url || null,
          nutrition_per_100g: {
            calories: n['energy-kcal_100g'] || undefined,
            protein: n.proteins_100g || undefined,
            carbs: n.carbohydrates_100g || undefined,
            fat: n.fat_100g || undefined,
            sugar: n.sugars_100g || undefined,
            sodium: n.sodium_100g ? n.sodium_100g * 1000 : undefined, // Convert g to mg
            fiber: n.fiber_100g || undefined,
          },
          ingredients_text: p.ingredients_text || null,
        }
      })
  } catch (error: any) {
    console.error('Open Food Facts fetch error:', error.message)
    return []
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Score a product using local scorer
// ─────────────────────────────────────────────────────────────────────────────

function scoreAlternativeProduct(product: FetchedProduct): { score: number; grade: string; nova: number; additives: string[] } {
  const nutrition: NutritionPer100g = {
    calories: product.nutrition_per_100g.calories,
    protein: product.nutrition_per_100g.protein,
    carbohydrates: product.nutrition_per_100g.carbs,
    total_fat: product.nutrition_per_100g.fat,
    sugar: product.nutrition_per_100g.sugar,
    sodium: product.nutrition_per_100g.sodium,
    fiber: product.nutrition_per_100g.fiber,
  }

  const result = scoreProduct(nutrition, product.ingredients_text || '')

  return {
    score: result.score,
    grade: result.grade,
    nova: result.nova_group,
    additives: result.detected_additives.map(a => a.name),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate "Why Better" comparison
// ─────────────────────────────────────────────────────────────────────────────

function generateWhyBetter(
  current: AlternativeProduct,
  alternatives: AlternativeProduct[]
): WhyBetter[] {
  const reasons: WhyBetter[] = []

  if (alternatives.length === 0) return reasons

  const alt = alternatives[0] // Best alternative
  const currentN = current.nutrition_per_100g
  const altN = alt.nutrition_per_100g

  // Sugar comparison
  if (currentN.sugar && altN.sugar) {
    const diff = currentN.sugar - altN.sugar
    const pct = Math.round((diff / currentN.sugar) * 100)
    if (pct > 10) {
      reasons.push({
        metric: 'Sugar',
        current: `${currentN.sugar}g`,
        alternative: `${altN.sugar}g`,
        improvement: `${pct}% less sugar`,
      })
    }
  }

  // Sodium comparison
  if (currentN.sodium && altN.sodium) {
    const diff = currentN.sodium - altN.sodium
    const pct = Math.round((diff / currentN.sodium) * 100)
    if (pct > 10) {
      reasons.push({
        metric: 'Sodium',
        current: `${currentN.sodium}mg`,
        alternative: `${altN.sodium}mg`,
        improvement: `${pct}% lower sodium`,
      })
    }
  }

  // Calories comparison
  if (currentN.calories && altN.calories) {
    const diff = currentN.calories - altN.calories
    const pct = Math.round((diff / currentN.calories) * 100)
    if (pct > 10) {
      reasons.push({
        metric: 'Calories',
        current: `${currentN.calories}kcal`,
        alternative: `${altN.calories}kcal`,
        improvement: `${pct}% fewer calories`,
      })
    }
  }

  // Protein comparison
  if (currentN.protein && altN.protein && altN.protein > currentN.protein) {
    const diff = altN.protein - currentN.protein
    const pct = Math.round((diff / currentN.protein) * 100)
    if (pct > 20) {
      reasons.push({
        metric: 'Protein',
        current: `${currentN.protein}g`,
        alternative: `${altN.protein}g`,
        improvement: `${pct}% more protein`,
      })
    }
  }

  // Additives comparison
  const currentAddCount = current.detected_additives?.length || 0
  const altAddCount = alt.detected_additives?.length || 0
  if (currentAddCount > 0 && altAddCount < currentAddCount) {
    const diff = currentAddCount - altAddCount
    reasons.push({
      metric: 'Additives',
      current: `${currentAddCount} harmful`,
      alternative: `${altAddCount} harmful`,
      improvement: `${diff} fewer harmful additives`,
    })
  }

  // NOVA comparison
  if (alt.nova_group < current.nova_group) {
    const labels = { 1: 'unprocessed', 2: 'processed ingredients', 3: 'processed', 4: 'ultra-processed' }
    reasons.push({
      metric: 'Processing',
      current: labels[current.nova_group as keyof typeof labels] || 'unknown',
      alternative: labels[alt.nova_group as keyof typeof labels] || 'unknown',
      improvement: 'Less processed',
    })
  }

  return reasons
}

// ─────────────────────────────────────────────────────────────────────────────
// Main function - Find healthier alternatives
// ─────────────────────────────────────────────────────────────────────────────

export async function findHealthierAlternatives(
  currentProduct: {
    name: string
    brand: string | null
    category: string | null
    barcode: string | null
    nutrition_per_100g: { calories?: number; protein?: number; carbs?: number; fat?: number; sugar?: number; sodium?: number; fiber?: number }
    ingredients_text: string | null
  },
  maxAlternatives: number = 5
): Promise<AlternativeResult> {
  console.log(`Finding alternatives for: ${currentProduct.name}`)

  // 1. Score current product
  const currentNutrition: NutritionPer100g = {
    calories: currentProduct.nutrition_per_100g.calories,
    protein: currentProduct.nutrition_per_100g.protein,
    carbohydrates: currentProduct.nutrition_per_100g.carbs,
    total_fat: currentProduct.nutrition_per_100g.fat,
    sugar: currentProduct.nutrition_per_100g.sugar,
    sodium: currentProduct.nutrition_per_100g.sodium,
    fiber: currentProduct.nutrition_per_100g.fiber,
  }

  const currentScored = scoreProduct(currentNutrition, currentProduct.ingredients_text || '')
  
  const currentProductWithScore: AlternativeProduct = {
    barcode: currentProduct.barcode || '',
    name: currentProduct.name,
    brand: currentProduct.brand,
    category: currentProduct.category,
    image_url: null,
    nutrition_per_100g: currentProduct.nutrition_per_100g,
    ingredients_text: currentProduct.ingredients_text,
    score: currentScored.score,
    grade: currentScored.grade,
    nova_group: currentScored.nova_group,
    detected_additives: currentScored.detected_additives.map(a => a.name),
  }

  // 2. Fetch similar products from Open Food Facts
  const searchCategory = currentProduct.category || currentProduct.name.split(' ')[0]
  let fetchedProducts = await fetchFromOpenFoodFacts(searchCategory, 30)

  // 2b. Fallback: search by top ingredients when category search returns nothing
  if (fetchedProducts.length === 0 && currentProduct.ingredients_text) {
    console.log('Category search empty, trying ingredient-based search...')
    const byIngredients = await searchOFFByIngredients(currentProduct.ingredients_text, 30)
    if (byIngredients.length > 0) {
      // Convert back to FetchedProduct format
      fetchedProducts = byIngredients.map(a => ({
        barcode: a.barcode,
        name: a.name,
        brand: a.brand,
        category: a.category,
        image_url: a.image_url,
        nutrition_per_100g: a.nutrition_per_100g,
        ingredients_text: a.ingredients_text,
      }))
    }
  }

  if (fetchedProducts.length === 0) {
    return {
      alternatives: [],
      why_better: [],
      current_score: currentScored.score,
      current_grade: currentScored.grade,
    }
  }

  // 3. Score all fetched products
  const scoredProducts: AlternativeProduct[] = fetchedProducts.map(p => {
    const scored = scoreAlternativeProduct(p)
    return {
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      category: p.category,
      image_url: p.image_url,
      nutrition_per_100g: p.nutrition_per_100g,
      ingredients_text: p.ingredients_text,
      score: scored.score,
      grade: scored.grade,
      nova_group: scored.nova,
      detected_additives: scored.additives,
    }
  })

  // 4. Filter to only better products and rank
  const betterProducts = scoredProducts
    .filter(p => p.score > currentScored.score) // Only better than current
    .sort((a, b) => b.score - a.score) // Highest score first
    .slice(0, maxAlternatives)

  // 5. Generate "Why Better" comparison
  const whyBetter = generateWhyBetter(currentProductWithScore, betterProducts)

  console.log(`Found ${betterProducts.length} better alternatives`)

  return {
    alternatives: betterProducts,
    why_better: whyBetter,
    current_score: currentScored.score,
    current_grade: currentScored.grade,
  }
}