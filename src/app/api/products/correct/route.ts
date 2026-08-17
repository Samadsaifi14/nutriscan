import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { ANONYMOUS_USER_ID } from '@/lib/config'
import { z } from 'zod'

const correctionSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  brand: z.string().optional(),
  barcode: z.string().min(1, 'Barcode is required'),
  ingredients_text: z.string().optional(),
  nutrition: z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional(),
    sugar: z.number().optional(),
    sodium: z.number().optional(),
    fiber: z.number().optional(),
  }).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const userId = ANONYMOUS_USER_ID

    // Validate input
    const body = await req.json()
    const validation = correctionSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: validation.error.issues[0]?.message || 'Validation failed'
      }, { status: 400 })
    }

    const { name, brand, barcode, ingredients_text, nutrition } = validation.data

    // Check if similar correction already exists
    const existing = await supabaseAdmin
      .from('product_corrections')
      .select('id')
      .eq('barcode', barcode)
      .eq('status', 'pending_review')
      .limit(1)
      .single()

    if (existing.data) {
      return NextResponse.json({
        success: false,
        error: 'A correction for this product is already pending review'
      }, { status: 409 })
    }

    // Insert correction
    const { data, error } = await supabaseAdmin
      .from('product_corrections')
      .insert({
        product_name: name.trim(),
        brand: brand?.trim() || null,
        barcode: barcode.trim(),
        ingredients_text: ingredients_text?.trim() || null,
        nutrition: nutrition || null,
        status: 'pending_review',
        corrected_by: userId || 'guest',
      })
      .select()
      .single()

    if (error) {
      console.error('Correction insert error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to submit correction. Please try again.'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Correction submitted for review',
      data: {
        id: data.id,
        status: data.status
      }
    })

  } catch (error) {
    console.error('Correction API error:', error)
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred'
    }, { status: 500 })
  }
}

// GET endpoint to fetch corrections (for admin)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status') || 'pending_review'

    const { data, error } = await supabaseAdmin
      .from('product_corrections')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Get corrections error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}