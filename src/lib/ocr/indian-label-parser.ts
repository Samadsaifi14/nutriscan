// lib/ocr/indian-label-parser.ts
// Parse Indian nutrition labels with FSSAI standard format

export interface ParsedNutrition {
  calories: number | null
  protein: number | null
  fat: number | null
  saturated_fat: number | null
  trans_fat: number | null
  carbohydrates: number | null
  sugar: number | null
  fiber: number | null
  sodium: number | null
  serving_size: number | null
  ingredients_text: string | null
  fssai_license: string | null
  mrp: number | null
  confidence: Record<string, 'high' | 'medium' | 'low'>
}

export function parseIndianNutritionLabel(ocrText: string): ParsedNutrition {
  const text = ocrText.toLowerCase()
  
  const result: ParsedNutrition = {
    calories: null,
    protein: null,
    fat: null,
    saturated_fat: null,
    trans_fat: null,
    carbohydrates: null,
    sugar: null,
    fiber: null,
    sodium: null,
    serving_size: null,
    ingredients_text: null,
    fssai_license: null,
    mrp: null,
    confidence: {},
  }

  // Calories - Indian labels say "Energy" not "Calories"
  const caloriesMatch = text.match(/energy[:\s]+(\d+\.?\d*)\s*(kcal|kj)/i)
  if (caloriesMatch) {
    result.calories = caloriesMatch[2].toLowerCase() === 'kj' 
      ? Math.round(parseFloat(caloriesMatch[1]) / 4.184) 
      : parseFloat(caloriesMatch[1])
    result.confidence.calories = 'high'
  }

  // Protein
  const proteinMatch = text.match(/protein[:\s]+(\d+\.?\d*)\s*g/i)
  if (proteinMatch) {
    result.protein = parseFloat(proteinMatch[1])
    result.confidence.protein = 'high'
  }

  // Total Fat
  const fatMatch = text.match(/(?:total\s+)?fat[:\s]+(\d+\.?\d*)\s*g/i)
  if (fatMatch) {
    result.fat = parseFloat(fatMatch[1])
    result.confidence.fat = 'high'
  }

  // Saturated Fat
  const satFatMatch = text.match(/saturated\s+(?:fat|fatty acids)[:\s]+(\d+\.?\d*)\s*g/i)
  if (satFatMatch) {
    result.saturated_fat = parseFloat(satFatMatch[1])
    result.confidence.saturated_fat = 'medium'
  }

  // Trans Fat - FSSAI mandates this
  const transFatMatch = text.match(/trans\s+(?:fat|fatty acids)[:\s]+(\d+\.?\d*)\s*g/i)
  if (transFatMatch) {
    result.trans_fat = parseFloat(transFatMatch[1])
    result.confidence.trans_fat = 'high'
  }

  // Carbohydrates
  const carbsMatch = text.match(/(?:total\s+)?carbohydrate[s]?[:\s]+(\d+\.?\d*)\s*g/i)
  if (carbsMatch) {
    result.carbohydrates = parseFloat(carbsMatch[1])
    result.confidence.carbohydrates = 'high'
  }

  // Sugar - Indian labels say "Total Sugars"
  const sugarMatch = text.match(/(?:total\s+)?sugars?[:\s]+(\d+\.?\d*)\s*g/i)
  if (sugarMatch) {
    result.sugar = parseFloat(sugarMatch[1])
    result.confidence.sugar = 'high'
  }

  // Fiber - British spelling common on Indian labels
  const fiberMatch = text.match(/dietary\s+(?:fibre|fiber)[:\s]+(\d+\.?\d*)\s*g/i)
  if (fiberMatch) {
    result.fiber = parseFloat(fiberMatch[1])
    result.confidence.fiber = 'medium'
  }

  // Sodium - sometimes listed as salt
  const sodiumMatch = text.match(/sodium[:\s]+(\d+\.?\d*)\s*mg/i)
  if (sodiumMatch) {
    result.sodium = parseFloat(sodiumMatch[1])
    result.confidence.sodium = 'high'
  } else {
    const saltMatch = text.match(/salt[:\s]+(\d+\.?\d*)\s*g/i)
    if (saltMatch) {
      result.sodium = parseFloat(saltMatch[1]) * 400 // 1g salt ≈ 400mg sodium
      result.confidence.sodium = 'medium'
    }
  }

  // Serving size
  const servingMatch = text.match(/(?:serving\s+size|per\s+serving)[:\s]+(\d+\.?\d*)\s*g/i)
  if (servingMatch) {
    result.serving_size = parseFloat(servingMatch[1])
    result.confidence.serving_size = 'high'
  }

  // Extract ingredients - look for text after "Ingredients"
  const ingredientsMatch = text.match(
    /ingredients[:\s]*(.+?)(?:nutritional|nutrition|contains|allergen|manufactured|best before|expiry|storage)/i
  )
  if (ingredientsMatch) {
    result.ingredients_text = ingredientsMatch[1]
      .replace(/[^\w\s,;()]/g, '') // Remove special chars
      .replace(/\s+/g, ' ')
      .trim()
    result.confidence.ingredients_text = 'medium'
  }

  // FSSAI license - 14 digit number
  const fssaiMatch = text.match(/(?:fssai|food\s+safety)[:\s#]*(\d{14})/i)
  if (fssaiMatch) {
    result.fssai_license = fssaiMatch[1]
    result.confidence.fssai_license = 'high'
  }

  // MRP
  const mrpMatch = text.match(/(?:mrp|maximum\s+retail\s+price)[:\s₹rs.]*(\d+\.?\d*)/i)
  if (mrpMatch) {
    result.mrp = parseFloat(mrpMatch[1])
    result.confidence.mrp = 'high'
  }

  return result
}

// Helper to detect if label is Indian format
export function isIndianLabel(ocrText: string): boolean {
  const indicators = ['fssai', 'energy kcal', 'total fat', 'total carbohydrate', 'total sugars', 'per 100g']
  const lower = ocrText.toLowerCase()
  return indicators.some(ind => lower.includes(ind))
}