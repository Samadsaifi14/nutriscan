import { NextResponse } from 'next/server'
import { generateIngredientsViaGroq } from '@/lib/groq'

const HARMFUL_KEYWORDS: string[] = [
  'sodium benzoate', 'sodium nitrite', 'sodium nitrate', 'bha', 'bht', 'tbhq',
  'tartrazine', 'sunset yellow', 'allura red', 'aspartame', 'acesulfame', 'sucralose',
  'carrageenan', 'polysorbate', 'msg', 'high fructose corn syrup', 'maltodextrin',
  'trans fat', 'hydrogenated', 'refined flour', 'palm oil', 'maida',
]

export interface IngredientHealth {
  name: string
  status: 'harmful' | 'safe' | 'unknown'
  reason: string
  ai_generated?: boolean
}

function classifyItems(items: string[]): IngredientHealth[] {
  return items.map(name => {
    const lower = name.toLowerCase().trim()
    if (!lower) return { name, status: 'safe' as const, reason: 'Likely safe' }
    const flagged = HARMFUL_KEYWORDS.some(k => lower.includes(k))
    return {
      name,
      status: flagged ? ('harmful' as const) : ('safe' as const),
      reason: flagged ? 'Contains common unhealthy additives' : 'Likely safe',
    }
  })
}

export async function GET(req: any) {
  const url = new URL(req.url)
  const raw = url.searchParams.get('ingredients') ?? ''
  const productName = url.searchParams.get('product')?.trim() || ''
  const brand = url.searchParams.get('brand')?.trim() || ''
  const category = url.searchParams.get('category')?.trim() || ''
  const cal = url.searchParams.get('calories')
  const pro = url.searchParams.get('protein')

  let items = raw.split(',').map(s => s.trim()).filter(Boolean)
  let aiGenerated = false

  if (items.length === 0 && (productName || category)) {
    const aiText = await generateIngredientsViaGroq({
      product_name: productName || category,
      brand: brand || undefined,
      category: category || undefined,
      nutrition: cal || pro
        ? { calories: cal ? Number(cal) : undefined, protein: pro ? Number(pro) : undefined }
        : undefined,
    })
    if (aiText) {
      items = aiText.split(',').map(s => s.trim()).filter(Boolean)
      aiGenerated = items.length > 0
    }
  }

  if (items.length === 0) {
    return NextResponse.json({
      success: true,
      data: [],
      ai_generated: false,
      message: 'No ingredients available and no product context provided',
    })
  }

  const results = classifyItems(items)
  return NextResponse.json({
    success: true,
    data: results,
    ai_generated: aiGenerated,
    ingredient_count: results.length,
  })
}
