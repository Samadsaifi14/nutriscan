import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findHealthierAlternatives } from '@/lib/alternatives'

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
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = RequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid product data', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const result = await findHealthierAlternatives(parsed.data)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (err: any) {
    console.error('Alternatives error:', err.message)
    return NextResponse.json(
      { error: 'Failed to find alternatives' },
      { status: 500 }
    )
  }
}