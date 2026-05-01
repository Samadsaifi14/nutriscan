// Open Food Facts API - Free barcode lookup (no API key needed)
import { scoreProduct, type NutritionPer100g } from './health-engine'

export interface OFFProduct {
  barcode: string
  name: string
  brand: string | null
  image_url: string | null
  ingredients_text: string | null
  nutrition_per_100g: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    sugar?: number
    sodium?: number
    fiber?: number
  }
  additives: string[]
  nova_group: number
}

export async function lookupBarcode(barcode: string): Promise<OFFProduct | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    
    if (!res.ok) {
      console.warn('OFF API error:', res.status)
      return null
    }
    
    const data = await res.json()
    
    if (data.status !== 1 || !data.product) {
      return null
    }
    
    const p = data.product
    
    const nutrition = p.nutriments || {}
    const servingSize = parseServingSize(p.serving_size)
    
    // Normalize to per 100g
    const normalizeNutrient = (val: number | undefined) => {
      if (!val) return undefined
      if (servingSize && p.serving_size) {
        return Math.round((val / servingSize) * 100)
      }
      return val
    }
    
    const nutritionPer100g = {
      calories: normalizeNutrient(nutrition['energy-kcal_100g'] || nutrition['energy-kcal']),
      protein: normalizeNutrient(nutrition['proteins_100g'] || nutrition.proteins),
      carbs: normalizeNutrient(nutrition['carbohydrates_100g'] || nutrition.carbohydrates),
      fat: normalizeNutrient(nutrition['fat_100g'] || nutrition.fat),
      sugar: normalizeNutrient(nutrition['sugars_100g'] || nutrition.sugars),
      sodium: normalizeNutrient(nutrition['sodium_100g'] || nutrition.sodium),
      fiber: normalizeNutrient(nutrition['fiber_100g'] || nutrition.fiber),
    }
    
    // Extract additives
    const additives: string[] = []
    if (p.additives_tags) {
      p.additives_tags.forEach((tag: string) => {
        const name = tag.replace(/^en:/, '').replace(/-/g, ' ')
        if (name && name.length > 2) {
          additives.push(name)
        }
      })
    }
    
    // Get NOVA group
    const novaGroup = p.nova_group || p['nova-group'] || 4
    
    return {
      barcode: barcode,
      name: p.product_name || p.product_name_en || 'Unknown Product',
      brand: p.brands || null,
      image_url: p.image_url || p.image_small_url || null,
      ingredients_text: p.ingredients_text || p.ingredients_text_en || null,
      nutrition_per_100g: nutritionPer100g,
      additives: additives.slice(0, 20),
      nova_group: typeof novaGroup === 'number' ? novaGroup : 4,
    }
  } catch (err) {
    console.error('OFF lookup error:', err)
    return null
  }
}

function parseServingSize(servingSize: string | number | undefined): number | null {
  if (!servingSize) return null
  
  const str = String(servingSize)
  const match = str.match(/(\d+)/)
  
  if (match) {
    const num = parseInt(match[1], 10)
    if (str.toLowerCase().includes('g')) {
      return num
    } else if (str.toLowerCase().includes('ml')) {
      return num
    }
  }
  
  return null
}

export function scoreOFFProduct(product: OFFProduct) {
  const nutrition: NutritionPer100g = {
    calories: product.nutrition_per_100g.calories || 0,
    protein: product.nutrition_per_100g.protein || 0,
    carbohydrates: product.nutrition_per_100g.carbs || 0,
    total_fat: product.nutrition_per_100g.fat || 0,
    sugar: product.nutrition_per_100g.sugar || 0,
    sodium: product.nutrition_per_100g.sodium || 0,
  }
  
  const result = scoreProduct(nutrition, product.ingredients_text || '')
  
  return {
    ...product,
    health_score: result.score,
    health_grade: result.grade,
  }
}