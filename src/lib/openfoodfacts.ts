// Open Food Facts API + multiple sources for Indian products
import { scoreProduct, type NutritionPer100g } from './health-engine'

export interface ProductData {
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
    saturated_fat?: number
    sugar?: number
    sodium?: number
    fiber?: number
  }
  additives: string[]
  nova_group: number
  source: string
}

export async function lookupBarcode(barcode: string): Promise<ProductData | null> {
  // Try Open Food Facts first
  const offResult = await lookupOpenFoodFacts(barcode)
  if (offResult) return offResult
  
  // Try UPC API as fallback for US products that might ship to India
  const upcResult = await lookupUPCItemDB(barcode)
  if (upcResult) return upcResult
  
  return null
}

async function lookupOpenFoodFacts(barcode: string): Promise<ProductData | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    
    if (!res.ok) return null
    
    const data = await res.json()
    
    if (data.status !== 1 || !data.product) return null
    
    const p = data.product
    const nutrition = p.nutriments || {}
    const servingSize = parseServingSize(p.serving_size)
    
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
      saturated_fat: normalizeNutrient(nutrition['saturated-fat_100g'] || nutrition.saturated_fat),
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
    
    const novaGroup = p.nova_group || p['nova-group'] || 4
    
    return {
      barcode,
      name: p.product_name || p.product_name_en || 'Unknown Product',
      brand: p.brands || null,
      image_url: p.image_url || p.image_small_url || null,
      ingredients_text: p.ingredients_text || p.ingredients_text_en || null,
      nutrition_per_100g: nutritionPer100g,
      additives: additives.slice(0, 20),
      nova_group: typeof novaGroup === 'number' ? novaGroup : 4,
      source: 'openfoodfacts',
    }
  } catch (err) {
    console.error('OFF lookup error:', err)
    return null
  }
}

// UPC Item DB as fallback (free, no key needed for basic lookups)
async function lookupUPCItemDB(barcode: string): Promise<ProductData | null> {
  try {
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`)
    
    if (!res.ok) return null
    
    const data = await res.json()
    
    if (!data.items || data.items.length === 0) return null
    
    const item = data.items[0]
    
    // Parse nutrition from description or offer
    let nutrition: any = {}
    
    if (item.description) {
      // Try to extract nutrition info from description
      const desc = item.description.toLowerCase()
      
      // Energy
      const energyMatch = desc.match(/energy\s*(\d+)\s*kcal/i)
      if (energyMatch) nutrition.calories = parseInt(energyMatch[1])
      
      // Protein
      const proteinMatch = desc.match(/protein\s*(\d+(?:\.\d+)?)\s*g/i)
      if (proteinMatch) nutrition.protein = parseFloat(proteinMatch[1])
      
      // Carbs
      const carbsMatch = desc.match(/carbohydrate[s]?\s*(\d+(?:\.\d+)?)\s*g/i)
      if (carbsMatch) nutrition.carbs = parseFloat(carbsMatch[1])
      
      // Fat
      const fatMatch = desc.match(/total\s*fat\s*(\d+(?:\.\d+)?)\s*g/i)
      if (fatMatch) nutrition.fat = parseFloat(fatMatch[1])
      
      // Sugar
      const sugarMatch = desc.match(/sugar[s]?\s*(\d+(?:\.\d+)?)\s*g/i)
      if (sugarMatch) nutrition.sugar = parseFloat(sugarMatch[1])
    }
    
    return {
      barcode,
      name: item.title || 'Unknown Product',
      brand: item.brand || null,
      image_url: item.images?.[0] || null,
      ingredients_text: null,
      nutrition_per_100g: nutrition,
      additives: [],
      nova_group: 4,
      source: 'upcitemdb',
    }
  } catch (err) {
    console.error('UPC lookup error:', err)
    return null
  }
}

function parseServingSize(servingSize: string | number | undefined): number | null {
  if (!servingSize) return null
  
  const str = String(servingSize)
  const match = str.match(/(\d+)/)
  
  if (match) {
    const num = parseInt(match[1]!, 10)
    if (str.toLowerCase().includes('g')) return num
    if (str.toLowerCase().includes('ml')) return num
  }
  
  return null
}

export function scoreOFFProduct(product: ProductData) {
  const nutrition: NutritionPer100g = {
    calories: product.nutrition_per_100g.calories || 0,
    protein: product.nutrition_per_100g.protein || 0,
    carbohydrates: product.nutrition_per_100g.carbs || 0,
    total_fat: product.nutrition_per_100g.fat || 0,
    saturated_fat: product.nutrition_per_100g.saturated_fat || 0,
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