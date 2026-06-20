import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { findHealthierAlternatives } from '@/lib/alternatives'
import { findCuratedAlternatives, type CuratedAlternative } from '@/lib/curated-alternatives'
import { getShoppingLinksForProduct } from '@/lib/shopping-links'

const RequestSchema = z.object({
  name: z.string().min(1),
  brand: z.string().nullable(),
  category: z.string().nullable(),
  barcode: z.string().nullable(),
  nutrition_per_100g: z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional(),
    sugar: z.number().optional(),
    sodium: z.number().optional(),
    fiber: z.number().optional(),
  }),
  ingredients_text: z.string().nullable(),
  current_score: z.number().optional(),
})

interface EnrichedAlternative {
  name: string
  brand: string | null
  reason: string
  availability: string
  type: 'branded' | 'homemade' | 'whole_food'
  price_band?: string
  ingredients_summary?: string
  image_url?: string
  score?: number
  grade?: string
  nutrition_per_100g?: { calories?: number; protein?: number; carbs?: number; fat?: number; sugar?: number; sodium?: number; fiber?: number }
  shopping_url?: string
  shopping_links?: Array<{ platform: string; url: string; label: string; icon: string; color: string }>
  source: 'curated' | 'dynamic'
}

function enrichAlternative(alt: { name: string; brand?: string | null; reason: string; type?: 'branded' | 'homemade' | 'whole_food'; availability?: string; price_band?: string; ingredients_summary?: string; image_url?: string; score?: number; grade?: string; nutrition_per_100g?: { calories?: number; protein?: number; carbs?: number; fat?: number; sugar?: number; sodium?: number; fiber?: number }; shopping_url?: string }, source: EnrichedAlternative['source']): EnrichedAlternative {
  const links = getShoppingLinksForProduct(alt.name, alt.brand || undefined)
  return {
    name: alt.name,
    brand: alt.brand || null,
    reason: alt.reason,
    availability: alt.availability || links.platforms.join(', '),
    type: alt.type || 'branded',
    price_band: alt.price_band,
    ingredients_summary: alt.ingredients_summary,
    image_url: alt.image_url,
    score: alt.score,
    grade: alt.grade,
    nutrition_per_100g: alt.nutrition_per_100g,
    shopping_url: alt.shopping_url || links.amazon,
    shopping_links: links.all,
    source,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid product data', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const hasNutrition = Object.values(parsed.data.nutrition_per_100g).some(v => v !== undefined && v !== null && v > 0)

    // ── Tier 1 (primary): Curated Indian alternatives (instant, no network)
    // Tier 2: Dynamic alternatives from Open Food Facts (optional enrichment)
    let curatedResult: CuratedAlternative[] = []
    let dynamicResult: any = null

    try {
      curatedResult = findCuratedAlternatives(
        parsed.data.name,
        parsed.data.category,
        parsed.data.current_score
      )
    } catch (err: any) {
      console.warn('Curated alternatives failed:', err.message)
    }

    // Dynamic enrichment (non-blocking, no timeout race)
    if (hasNutrition) {
      try {
        const result = await findHealthierAlternatives(parsed.data)
        if (result.alternatives.length > 0) {
          dynamicResult = {
            alternatives: result.alternatives,
            why_better: result.why_better,
            current_score: result.current_score,
            current_grade: result.current_grade,
          }
        }
      } catch (err: any) {
        console.warn('Dynamic alternatives failed:', err.message)
      }
    }

    // ── Assemble response ─────────────────────────────────────────────────
    const enrichedAlts: EnrichedAlternative[] = curatedResult.map(c => enrichAlternative(c, 'curated'))

    const response: any = {
      success: true,
      data: {
        alternatives: enrichedAlts,
        why_better: dynamicResult?.why_better || [],
        current_score: dynamicResult?.current_score ?? null,
        current_grade: dynamicResult?.current_grade ?? null,
        source: 'curated',
      },
    }

    // Attach dynamic enrichment as optional data
    if (dynamicResult) {
      response.data.dynamic_alternatives = dynamicResult.alternatives.map((a: any) =>
        enrichAlternative({
          name: a.name,
          brand: a.brand,
          reason: a.why_better || 'A healthier alternative',
          type: 'branded',
          availability: 'Amazon India, BigBasket, Flipkart',
          image_url: a.image_url,
          score: a.score,
          grade: a.grade,
          nutrition_per_100g: a.nutrition_per_100g,
        }, 'dynamic')
      )
    }

    return NextResponse.json(response)
  } catch (err: any) {
    console.error('Alternatives error:', err.message)
    return NextResponse.json(
      { error: 'Failed to find alternatives' },
      { status: 500 }
    )
  }
}
