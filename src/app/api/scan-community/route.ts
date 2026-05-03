import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Check both products table AND community_products
export async function GET(req: NextRequest) {
  const barcode = req.nextUrl.searchParams.get('barcode')
  
  if (!barcode || barcode.length < 6) {
    return NextResponse.json({ success: false, error: 'Invalid barcode' }, { status: 400 })
  }

  try {
    // 1. Check main products table first (verified products)
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .single()

    if (product) {
      return NextResponse.json({
        success: true,
        source: 'verified',
        data: formatProduct(product),
      })
    }

    // 2. Check community_products for unverified products
    const { data: community } = await supabase
      .from('community_products')
      .select('*')
      .eq('barcode', barcode)
      .in('status', ['unverified', 'pending'])
      .single()

    if (community) {
      return NextResponse.json({
        success: true,
        source: 'community_unverified',
        data: {
          name: community.name,
          barcode: community.barcode,
          brand: community.brand,
          image_url: community.front_label_url,
          ingredients_text: community.ingredients_text,
          nutrition_per_100g: community.nutrition || {},
          additives: [],
          nova_group: 4,
        },
        warning: 'Community submitted - not yet verified',
      })
    }

    // 3. Check for partial matches by name (if barcode not provided)
    // Could add name-based search here

    // Not found anywhere
    return NextResponse.json({
      success: false,
      error: 'PRODUCT_NOT_FOUND',
      barcode,
      message: 'This product is not in our database yet. Use photo mode or contribute it!',
    })

  } catch (err) {
    console.error('Lookup error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

function formatProduct(p: any) {
  return {
    id: p.id,
    barcode: p.barcode,
    name: p.name || 'Unknown Product',
    brand: p.brand || null,
    category: p.category || null,
    image_url: p.image_url || null,
    source: p.source || 'cache',
    nutrition: {
      calories: p.calories ?? 0,
      protein: p.protein ?? 0,
      carbs: p.carbohydrates ?? p.carbs_per_100g ?? 0,
      fat: p.fat ?? 0,
      sugar: p.sugar ?? null,
      sodium: p.sodium ?? null,
      fiber: p.fiber ?? null,
    },
    serving_size_g: p.serving_size_g || null,
    ingredients_text: p.ingredients_text || null,
    additives: p.detected_additives || [],
    health_score: p.health_score,
    health_grade: p.health_grade,
    nova_group: p.nova_group,
  }
}