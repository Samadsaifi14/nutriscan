// BioYou Local OCR - Replace Gemini Vision with Tesseract.js
// Provides offline-capable barcode detection and text extraction

import Tesseract, { createWorker } from 'tesseract.js'

export interface OCRResult {
  barcode: string | null
  text: string
  confidence: number
  blocks: any[]
  warnings: string[]
}

export interface ParsedNutrition {
  name?: string
  brand?: string
  serving_size_g?: number
  ingredients_text?: string
  nutrition_per_100g?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    sugar?: number
    sodium?: number
    fiber?: number
  }
  additives: string[]
  allergens: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// BARCODE DETECTION (using Quagga - client-side library)
// ─────────────────────────────────────────────────────────────────────────────

export interface BarcodeResult {
  code: string
  format: string
  confidence: number
}

// Note: Quagga works best in browser environment
// For server-side, we'll use text pattern matching on OCR output

// Common barcode patterns in OCR output
const BARCODE_PATTERNS = [
  /^\d{8}$/,           // EAN-8
  /^\d{12}$/,          // UPC-A
  /^\d{13}$/,          // EAN-13
  /^\d{14}$/,          // ITF-14
  /^[A-Z0-9]{4,20}$/,  // Generic alphanumeric
]

export function extractBarcodeFromText(text: string): string | null {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  
  for (const line of lines) {
    // Remove common prefixes like "Barcode:", "EAN:", "UPC:", etc.
    const cleaned = line.replace(/^(barcode|ean|upc|itf|item|no|number)[\s:]+/i, '')
    
    for (const pattern of BARCODE_PATTERNS) {
      if (pattern.test(cleaned)) {
        return cleaned
      }
    }
  }
  
  // Also look for 13-digit numbers anywhere in text (most common for Indian products)
  const allNumbers = text.match(/\b\d{12,14}\b/g)
  if (allNumbers && allNumbers.length > 0) {
    return allNumbers[0]
  }
  
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXT EXTRACTION (Tesseract.js)
// ─────────────────────────────────────────────────────────────────────────────

let tesseractWorker: Tesseract.Worker | null = null

async function getTesseractWorker(): Promise<Tesseract.Worker> {
  if (!tesseractWorker) {
    tesseractWorker = await Tesseract.createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR progress: ${Math.round(m.progress * 100)}%`)
        }
      },
    })
  }
  return tesseractWorker
}

export async function extractTextFromImage(
  imageBase64: string,
  onProgress?: (progress: number) => void
): Promise<OCRResult> {
  const warnings: string[] = []
  
  try {
    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const imageBuffer = Buffer.from(base64Data, 'base64')
    
    const worker = await getTesseractWorker()
    
    console.log('Starting OCR...')
    const result = await worker.recognize(imageBuffer, {
      rotateAuto: true,
    })
    
    const text = result.data.text
    const confidence = result.data.confidence
    
    // Check for common image issues
    if (text.length < 20) {
      warnings.push('Very little text detected - image may be blurry or too small')
    }
    
    if (confidence < 50) {
      warnings.push(`Low OCR confidence (${confidence}%) - results may be inaccurate`)
    }
    
    // Extract barcode from text
    const barcode = extractBarcodeFromText(text)
    
    console.log(`OCR complete: ${text.length} chars, confidence: ${confidence}%, barcode: ${barcode}`)
    
    return {
      barcode,
      text,
      confidence,
      blocks: result.data.blocks || [],
      warnings,
    }
  } catch (error: any) {
    console.error('OCR error:', error.message)
    throw new Error(`OCR failed: ${error.message}`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NUTRITION LABEL PARSING
// ─────────────────────────────────────────────────────────────────────────────

const NUTRITION_KEYWORDS = {
  calories: ['energy', 'calories', 'kcal', 'cal'],
  protein: ['protein', 'prot'],
  carbs: ['carbohydrate', 'carbs', 'carb', 'total carbohydrate'],
  fat: ['total fat', 'fat', 'total lipid'],
  sugar: ['sugars', 'sugar', 'total sugars', 'added sugar'],
  sodium: ['sodium', 'salt', 'na'],
  fiber: ['fiber', 'fibre', 'dietary fiber', 'dietary fibre'],
}

const ADDITIVE_PATTERNS = [
  /e\d{3}/gi,
  /ins\s*\d+/gi,
  /(sodium|potassium|calcium|ammonium)\s+(benzoate|sorbate|nitrite|nitrate|propionate)/gi,
  /(bha|bht|tbhq|tbho)/gi,
  /(msg|monosodium\s*glutamate)/gi,
  /(tartrazine|sunset\s*yellow|allura\s*red|erythrosine)/gi,
  /(carrageenan|xanthan\s*gum|guar\s*gum)/gi,
  /(aspartame|sucralose|acesulfame|saccharin)/gi,
]

const ALLERGEN_PATTERNS = [
  /milk|dairy|cheese|butter|cream|lactose/gi,
  /wheat|gluten|maida|atta|flour/gi,
  /soy|soya|tofu/gi,
  /egg|albumin/gi,
  /peanut|groundnut/gi,
  /tree\s*nut|almond|walnut|cashew/gi,
  /fish|shellfish|prawn|crab/gi,
  /sesame|till/gi,
  /mustard/gi,
  /sulphite|sulfite/gi,
]

export function parseNutritionLabel(text: string): ParsedNutrition {
  const result: ParsedNutrition = {
    additives: [],
    allergens: [],
  }
  
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  
  // Extract first line as likely product name
  if (lines.length > 0 && lines[0].length > 3) {
    result.name = lines[0].substring(0, 100)
  }
  
  // Look for brand
  const brandPatterns = [
    /(?:brand\s*[:\-]?\s*)?([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/,
  ]
  for (const line of lines.slice(0, 5)) {
    for (const pattern of brandPatterns) {
      const match = line.match(pattern)
      if (match && match[1] && match[1].length > 2) {
        result.brand = match[1]
        break
      }
    }
    if (result.brand) break
  }
  
  // Parse nutrition values
  let foundNutritionTable = false
  
  for (const line of lines) {
    const lower = line.toLowerCase()
    
    // Detect nutrition table start
    if (lower.includes('nutrition') || lower.includes('per 100g') || lower.includes('per 100ml')) {
      foundNutritionTable = true
      continue
    }
    
    if (!foundNutritionTable) continue
    
    // Try to extract numeric values
    const numbers = line.match(/\d+(?:\.\d+)?/g)
    if (!numbers || numbers.length === 0) continue
    
    // Check each nutrition type
    for (const [nutrient, keywords] of Object.entries(NUTRITION_KEYWORDS)) {
      if (keywords.some(kw => lower.includes(kw)) && numbers.length > 0) {
        const value = parseFloat(numbers[0])
        
        if (!result.nutrition_per_100g) {
          result.nutrition_per_100g = {}
        }
        
        if (nutrient === 'calories' && (lower.includes('kcal') || lower.includes('cal'))) {
          result.nutrition_per_100g.calories = value
        } else if (nutrient === 'sodium' && lower.includes('mg')) {
          result.nutrition_per_100g.sodium = value
        } else if (!lower.includes('mg') && !lower.includes('g ')) {
          // Assume grams if no unit specified
          result.nutrition_per_100g[nutrient as keyof typeof result.nutrition_per_100g] = value
        }
      }
    }
    
    // Look for serving size
    const servingMatch = line.match(/serving\s*(?:size)?\s*[:\-]?\s*(\d+)\s*g?/i)
    if (servingMatch) {
      result.serving_size_g = parseInt(servingMatch[1])
    }
  }
  
  // Extract ingredients (usually after "Ingredients:" or starts with "I:")
  const ingredientPatterns = [
    /ingredients?[:\s]+(.+)/i,
    /^I\s*[:\-]\s*(.+)/i,
    /contains\s*(.+?)(?:\.|allergy|$)/i,
  ]
  
  for (const line of lines) {
    for (const pattern of ingredientPatterns) {
      const match = line.match(pattern)
      if (match && match[1] && match[1].length > 10) {
        result.ingredients_text = match[1].substring(0, 500)
        break
      }
    }
    if (result.ingredients_text) break
  }
  
  // Extract additives
  for (const pattern of ADDITIVE_PATTERNS) {
    const matches = text.match(pattern)
    if (matches) {
      result.additives.push(...matches.map(m => m.toLowerCase()))
    }
  }
  result.additives = [...new Set(result.additives)]
  
  // Extract allergens
  for (const pattern of ALLERGEN_PATTERNS) {
    const matches = text.match(pattern)
    if (matches) {
      result.allergens.push(...matches.map(m => m.toLowerCase()))
    }
  }
  result.allergens = [...new Set(result.allergens)]
  
  return result
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN OCR FUNCTION - Full label extraction
// ─────────────────────────────────────────────────────────────────────────────

export interface LocalOCRResponse {
  barcode: string | null
  parsed: ParsedNutrition
  rawText: string
  confidence: number
  warnings: string[]
  method: 'local_ocr'
}

export async function performLocalOCR(imageBase64: string): Promise<LocalOCRResponse> {
  console.log('Starting local OCR...')
  
  // Step 1: Extract text using Tesseract
  const ocrResult = await extractTextFromImage(imageBase64)
  
  // Step 2: Parse the extracted text
  const parsed = parseNutritionLabel(ocrResult.text)
  
  // If no barcode from pattern matching, try harder
  if (!parsed.additives && ocrResult.barcode) {
    parsed.additives = []
  }
  
  console.log('Local OCR complete:', {
    barcode: ocrResult.barcode,
    name: parsed.name,
    nutrition: parsed.nutrition_per_100g,
    additives: parsed.additives.length,
    allergens: parsed.allergens.length,
  })
  
  return {
    barcode: ocrResult.barcode,
    parsed,
    rawText: ocrResult.text,
    confidence: ocrResult.confidence,
    warnings: ocrResult.warnings,
    method: 'local_ocr',
  }
}

// Clean up worker on process exit
process.on('exit', () => {
  if (tesseractWorker) {
    tesseractWorker.terminate()
  }
})