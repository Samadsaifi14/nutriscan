import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { analyzeProductWithAI, UserProfile } from '@/lib/groq-ai'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { ingredients, nutrition, barcode } = await req.json()
    
    if (!ingredients) {
      return NextResponse.json(
        { success: false, error: 'Ingredients are required' },
        { status: 400 }
      )
    }

    // Get user profile for personalization
    let userProfile: UserProfile = {}
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId
    
    if (userId) {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('is_diabetic, has_bp, has_heart_disease, has_cholesterol, is_vegetarian, is_vegan, is_jain, allergies')
        .eq('user_id', userId)
        .single()
      
      if (profile) {
        userProfile = profile
      }
    }

    // Call Groq AI for analysis
    const analysis = await analyzeProductWithAI(ingredients, nutrition, userProfile)

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'AI analysis failed. Using fallback.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: analysis
    })

  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simple GET for quick ingredient check
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const ingredients = url.searchParams.get('ingredients')?.split(',') || []

  if (ingredients.length === 0) {
    return NextResponse.json(
      { success: false, error: 'No ingredients provided' },
      { status: 400 }
    )
  }

  const { quickIngredientCheck } = await import('@/lib/groq-ai')
  const result = await quickIngredientCheck(ingredients)

  return NextResponse.json({
    success: true,
    data: Object.fromEntries(result)
  })
}