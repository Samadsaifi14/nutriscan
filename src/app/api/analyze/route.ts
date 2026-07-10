import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimit'
import { GeminiError } from '@/lib/gemini'
import { runUnifiedAnalysis } from '@/lib/analysis-runner'

const ProductSchema = z.object({
  barcode: z.string().optional(),
  name: z.string().min(1),
  brand: z.string().optional(),
  category: z.string().optional(),
  country_of_origin: z.string().optional(),
  image_url: z.string().optional(),
  nutrition: z.object({
    calories: z.number().min(0),
    protein: z.number().min(0),
    carbs: z.number().min(0),
    fat: z.number().min(0),
    sugar: z.number().optional(),
    saturated_fat: z.number().optional(),
    sodium: z.number().optional(),
    fiber: z.number().optional(),
  }),
  ingredients_text: z.string().optional(),
  allergens: z.array(z.string()).optional(),
  additives: z.array(z.string()).optional(),
})

const RequestSchema = z.object({
  product: ProductSchema,
  userProfile: z
    .object({
      age: z.number().optional(),
      bmi: z.number().optional(),
      weight_goal: z.string().optional(),
      is_diabetic: z.boolean().optional(),
      has_bp: z.boolean().optional(),
      is_vegetarian: z.boolean().optional(),
      gender: z.string().optional(),
    })
    .optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId

    const rateLimitKey = userId || req.headers.get('x-forwarded-for') || 'anonymous'
    const rateCheck = await checkRateLimit(rateLimitKey, 'analyze')
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: `Analysis limit reached. Please wait ${rateCheck.resetIn} minutes.`, rateLimited: true },
        { status: 429 }
      )
    }

    const body = await req.json()
    if (!body.product?.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Product name is missing' }, { status: 400 })
    }

    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(' | ')
      return NextResponse.json({ success: false, error: 'Invalid product data', details: issues }, { status: 400 })
    }

    const { product, userProfile } = parsed.data
    const analysis = await runUnifiedAnalysis(product, { userId, userProfile })

    return NextResponse.json({ success: true, data: analysis })
  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`GeminiError [${err.type}] status=${err.statusCode}:`, err.message)
      const isQuota = err.message.toLowerCase().includes('quota')
      switch (err.type) {
        case 'unavailable':
          return NextResponse.json({ success: false, error: 'Gemini AI is busy right now. Please wait 30 seconds and try again.', retryAfter: 30 }, { status: 503 })
        case 'rate_limit':
          return NextResponse.json(
            { success: false, error: isQuota ? 'Daily AI quota reached. Please try again tomorrow.' : 'Too many requests. Please wait a minute and try again.', rateLimited: true, retryAfter: isQuota ? 86400 : 60 },
            { status: 429 }
          )
        case 'timeout':
          return NextResponse.json({ success: false, error: 'AI analysis timed out. Please try again.' }, { status: 504 })
        case 'network':
          return NextResponse.json({ success: false, error: 'Network error reaching AI service. Please try again.' }, { status: 502 })
        default:
          return NextResponse.json({ success: false, error: 'AI service temporarily unavailable. Please try again.' }, { status: 500 })
      }
    }
    console.error('Analyze error:', err?.message)
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
