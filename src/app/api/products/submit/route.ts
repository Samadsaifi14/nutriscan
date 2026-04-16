import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// ── Silently contribute a new product to Open Food Facts ──────────────────────
async function contributeToOpenFoodFacts(product: {
  barcode?: string
  name?: string
  brand?: string
  ingredients_text?: string
  serving_size_g?: number
  nutrition_per_100g?: {
    calories?: number | null
    protein?: number | null
    carbs?: number | null
    fat?: number | null
    sugar?: number | null
    sodium?: number | null
    fiber?: number | null
  }
}) {
  try {
    if (!product.barcode || product.barcode.startsWith('vision-')) return

    const form = new URLSearchParams()
    form.append('code',         product.barcode)
    form.append('product_name', product.name  || '')
    form.append('brands',       product.brand || '')
    form.append('countries',    'India')
    form.append('lang',         'en')

    const n = product.nutrition_per_100g
    if (n) {
      if (n.calories != null) form.append('nutriment_energy-kcal_100g',  String(n.calories))
      if (n.protein  != null) form.append('nutriment_proteins_100g',     String(n.protein))
      if (n.carbs    != null) form.append('nutriment_carbohydrates_100g', String(n.carbs))
      if (n.fat      != null) form.append('nutriment_fat_100g',          String(n.fat))
      if (n.sugar    != null) form.append('nutriment_sugars_100g',       String(n.sugar))
      // OFF expects sodium in g/100g; we store in mg — convert
      if (n.sodium   != null) form.append('nutriment_sodium_100g',       String(n.sodium / 1000))
      if (n.fiber    != null) form.append('nutriment_fiber_100g',        String(n.fiber))
    }

    if (product.ingredients_text) form.append('ingredients_text', product.ingredients_text)
    if (product.serving_size_g)   form.append('serving_quantity',  String(product.serving_size_g))

    // Credentials — register free at world.openfoodfacts.org/cgi/session.pl
    form.append('user_id',  process.env.OFF_USERNAME || 'healthox-app')
    form.append('password', process.env.OFF_PASSWORD || '')

    const res = await fetch('https://world.openfoodfacts.org/cgi/product_jqm2.pl', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':   'HealthOX/1.0 (healthox@example.com)',
      },
      body: form.toString(),
    })

    const result = await res.json()
    if (result.status === 1) {
      console.log('✅ Contributed to OFF:', product.name, product.barcode)
    } else {
      console.log('OFF contribution:', result.status_verbose)
    }
  } catch (e: unknown) {
    // Non-critical — never fail the main request
    console.log('OFF contribution failed (non-critical):', (e as Error).message)
  }
}

// ── POST /api/products/submit ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId  = (session as { userId?: string } | null)?.userId

    const body = await req.json()

    // Vision scans without a real barcode get a time-stamped key
    const barcode = (body.barcode as string | undefined)?.trim() || `vision-${Date.now()}`

    // ── Build upsert payload ──────────────────────────────────────────────────
    const payload: Record<string, unknown> = {
      barcode,
      name:              body.name              || 'Unknown Product',
      brand:             body.brand             || null,
      category:          body.category          || null,
      country_of_origin: body.country_of_origin || 'India',
      image_url:         body.image_url         || null,
      ingredients_text:  body.ingredients_text  || null,
      additives:         Array.isArray(body.additives) ? body.additives : [],
      allergens:         Array.isArray(body.allergens) ? body.allergens : [],
      serving_size_g:    body.serving_size_g    || null,
      source:            'gemini_vision',
    }

    // Nutrition fields
    const n = body.nutrition_per_100g
    if (n && typeof n === 'object') {
      payload.calories_per_100g = n.calories ?? null
      payload.protein_per_100g  = n.protein  ?? null
      payload.carbs_per_100g    = n.carbs    ?? null
      payload.fat_per_100g      = n.fat      ?? null
      payload.sugar_per_100g    = n.sugar    ?? null
      payload.sodium_per_100g   = n.sodium   ?? null
      payload.fiber_per_100g    = n.fiber    ?? null
    }

    // ── Award contribution point (fire-and-forget, no race condition) ─────────
    if (userId) {
      payload.scanned_by = userId
      supabaseAdmin
        .rpc('increment_contributions', { uid: userId })
        .then(({ error }) => {
          if (error) {
            // Fallback: read → write if the RPC doesn't exist yet
            supabaseAdmin
              .from('user_profiles')
              .select('contributions')
              .eq('user_id', userId)
              .single()
              .then(({ data }) => {
                supabaseAdmin
                  .from('user_profiles')
                  .update({ contributions: (data?.contributions || 0) + 1 })
                  .eq('user_id', userId)
                  .then(() => console.log('Contribution point awarded:', userId))
              })
          }
        })
    }

    // ── Upsert into Supabase ──────────────────────────────────────────────────
    const { data, error } = await supabaseAdmin
      .from('products')
      .upsert(payload, { onConflict: 'barcode', ignoreDuplicates: false })
      .select()
      .single()

    if (error) {
      console.error('Submit error:', error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log('Product saved to DB:', data.name)

    // Contribute to OFF in background (never blocks the response)
    if (!barcode.startsWith('vision-') && body.name) {
      contributeToOpenFoodFacts(body).catch(() => {})
    }

    return NextResponse.json({ success: true, data })

  } catch (err: unknown) {
    console.error('Submit route error:', (err as Error).message)
    return NextResponse.json({ success: false, error: 'Submit failed' }, { status: 500 })
  }
}