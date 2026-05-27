import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { findHealthierAlternatives } from '@/lib/alternatives'
import { findCuratedAlternatives, type CuratedAlternative } from '@/lib/curated-alternatives'

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

    // ── Tier 1: Dynamic alternatives from Open Food Facts ──────────────
    // Only works when we have nutrition data and category
    let dynamicResult: any = null
    if (hasNutrition) {
      try {
        const result = await findHealthierAlternatives(parsed.data)
        if (result.alternatives.length > 0) {
          dynamicResult = {
            alternatives: result.alternatives,
            why_better: result.why_better,
            current_score: result.current_score,
            current_grade: result.current_grade,
            source: 'dynamic',
          }
        }
      } catch (err: any) {
        console.warn('Dynamic alternatives failed:', err.message)
      }
    }

    // ── Tier 2: Curated Indian alternatives ────────────────────────────
    let curatedResult: CuratedAlternative[] = []
    try {
      // Use score from dynamic results first, fall back to the score passed from frontend
      const scoreForFallback = dynamicResult?.current_score ?? parsed.data.current_score
      curatedResult = findCuratedAlternatives(
        parsed.data.name,
        parsed.data.category,
        scoreForFallback
      )
    } catch (err: any) {
      console.warn('Curated alternatives failed:', err.message)
    }

    // ── Assemble response ──────────────────────────────────────────────
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
      response.data = {
        ...dynamicResult,
        curated_fallback: curatedResult.length > 0 ? curatedResult : undefined,
      }
    } else if (curatedResult.length > 0) {
      response.data = {
        alternatives: curatedResult,
        why_better: [],
        current_score: null,
        current_grade: null,
        source: 'curated',
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
