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

    // ── Run Dynamic + Curated in parallel with Promise.allSettled ────
    let dynamicResult: any = null
    let curatedResult: CuratedAlternative[] = []

    const [dynamicSettled, curatedSettled] = await Promise.allSettled([
      // Tier 1: Dynamic alternatives from Open Food Facts
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

      // Tier 2: Curated Indian alternatives
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
