import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { findHealthierAlternatives } from '@/lib/alternatives'
import { findCuratedAlternatives, type CuratedAlternative } from '@/lib/curated-alternatives'
import { generateAlternativesViaGroq, type GroqAlternative } from '@/lib/groq'
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
  source: 'dynamic' | 'curated' | 'groq_ai'
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

    // ── Tier 1: Dynamic alternatives from Open Food Facts
    // Tier 2: Curated Indian alternatives
    // Tier 3: Groq AI fallback (availability / price / healthier ingredients / Indian platforms)
    let dynamicResult: any = null
    let curatedResult: CuratedAlternative[] = []
    let groqResult: GroqAlternative[] = []

    const [dynamicSettled, curatedSettled] = await Promise.allSettled([
      (async () => {
        if (!hasNutrition) return null
        const result = await findHealthierAlternatives(parsed.data)
        if (result.alternatives.length > 0) {
          return {
            alternatives: result.alternatives,
            why_better: result.why_better,
            current_score: result.current_score,
            current_grade: result.current_grade,
            source: 'dynamic',
          }
        }
        return null
      })(),
      (async () => {
        return findCuratedAlternatives(
          parsed.data.name,
          parsed.data.category,
          parsed.data.current_score
        )
      })(),
    ])

    if (dynamicSettled.status === 'fulfilled' && dynamicSettled.value) {
      dynamicResult = dynamicSettled.value
    } else if (dynamicSettled.status === 'rejected') {
      console.warn('Dynamic alternatives failed:', dynamicSettled.reason.message)
    }

    if (curatedSettled.status === 'fulfilled') {
      curatedResult = curatedSettled.value
    } else if (curatedSettled.status === 'rejected') {
      console.warn('Curated alternatives failed:', curatedSettled.reason.message)
    }

    // Tier 3: only fire if both prior tiers are empty
    if (!dynamicResult && curatedResult.length === 0) {
      try {
        groqResult = await generateAlternativesViaGroq({
          product_name: parsed.data.name,
          brand: parsed.data.brand,
          category: parsed.data.category,
          barcode: parsed.data.barcode,
          current_score: parsed.data.current_score,
          current_ingredients: parsed.data.ingredients_text,
          current_nutrition: parsed.data.nutrition_per_100g,
        })
      } catch (groqErr: any) {
        console.warn('Groq alternatives failed:', groqErr.message)
      }
    }

    // ── Assemble response ─────────────────────────────────────────────────
    const response: any = {
      success: true,
      data: {
        alternatives: [],
        why_better: [],
        current_score: dynamicResult?.current_score ?? null,
        current_grade: dynamicResult?.current_grade ?? null,
        source: 'none',
      },
    }

    if (dynamicResult) {
      const enrichedAlts: EnrichedAlternative[] = dynamicResult.alternatives.map((a: any) =>
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
      response.data = {
        ...dynamicResult,
        alternatives: enrichedAlts,
        source: 'dynamic',
        curated_fallback: curatedResult.length > 0 ? curatedResult : undefined,
      }
    } else if (curatedResult.length > 0) {
      const enrichedAlts: EnrichedAlternative[] = curatedResult.map(c => enrichAlternative(c, 'curated'))
      response.data = {
        alternatives: enrichedAlts,
        why_better: [],
        current_score: null,
        current_grade: null,
        source: 'curated',
        groq_fallback: groqResult.length > 0 ? groqResult.map(g => enrichAlternative(g, 'groq_ai')) : undefined,
      }
    } else if (groqResult.length > 0) {
      const enrichedAlts: EnrichedAlternative[] = groqResult.map(g => enrichAlternative(g, 'groq_ai'))
      response.data = {
        alternatives: enrichedAlts,
        why_better: [],
        current_score: parsed.data.current_score ?? null,
        current_grade: null,
        source: 'groq_ai',
      }
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
