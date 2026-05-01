// Background Scan API - Queue and process scans later

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit } from '@/lib/rateLimit'
import { lookupBarcode, scoreOFFProduct } from '@/lib/openfoodfacts'

// Queue a scan for later processing
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId || 'anonymous'

    // Rate limit check
    const limit = await checkRateLimit(userId, 'scan')
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Daily scan limit reached' },
        { status: 429 }
      )
    }

    const { barcode, image_data, scan_type } = await req.json()

    if (!image_data) {
      return NextResponse.json(
        { success: false, error: 'Image data is required' },
        { status: 400 }
      )
    }

    // Save to pending scans
    const { data, error } = await supabaseAdmin
      .from('pending_scans')
      .insert({
        user_id: userId,
        barcode: barcode || null,
        image_data,
        scan_type,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        scan_id: data.id,
        status: 'queued',
        message: 'Scan queued. We\'ll notify you when it\'s done!',
      },
    })
  } catch (err: any) {
    console.error('Queue scan error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Failed to queue scan' },
      { status: 500 }
    )
  }
}

// Process pending scans (called by cron or manually)
export async function PUT(req: NextRequest) {
  try {
    // Get pending scans (oldest first)
    const { data: pendingScans, error } = await supabaseAdmin
      .from('pending_scans')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10) // Process 10 at a time

    if (error) throw error
    if (!pendingScans || pendingScans.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending scans' })
    }

    const results = []

    for (const scan of pendingScans) {
      try {
        // Mark as processing
        await supabaseAdmin
          .from('pending_scans')
          .update({ status: 'processing' })
          .eq('id', scan.id)

        let productData: any = null

        if (scan.scan_type === 'barcode' && scan.barcode) {
          // Try to look up barcode in products
          const { data: existing } = await supabaseAdmin
            .from('products')
            .select('*')
            .eq('barcode', scan.barcode)
            .single()

          if (existing) {
            productData = existing
          }
        } else if (scan.scan_type === 'photo' && scan.barcode) {
          // Use Open Food Facts API to get product data
          const offProduct = await lookupBarcode(scan.barcode)
          
          if (offProduct) {
            const scored = scoreOFFProduct(offProduct)
            productData = {
              name: scored.name,
              brand: scored.brand,
              barcode: scored.barcode,
              ingredients_text: scored.ingredients_text,
              nutrition: scored.nutrition_per_100g,
              health_score: scored.health_score,
              health_grade: scored.health_grade,
              nova_group: scored.nova_group,
              additives: scored.additives,
            }
          }
        }

        // Update with result
        await supabaseAdmin
          .from('pending_scans')
          .update({
            status: 'completed',
            product_data: productData,
            processed_at: new Date().toISOString(),
          })
          .eq('id', scan.id)

        results.push({ scan_id: scan.id, status: 'completed', product: productData })
      } catch (scanErr: any) {
        // Mark as failed
        await supabaseAdmin
          .from('pending_scans')
          .update({
            status: 'failed',
            error_message: scanErr.message,
            processed_at: new Date().toISOString(),
          })
          .eq('id', scan.id)

        results.push({ scan_id: scan.id, status: 'failed', error: scanErr.message })
      }
    }

    return NextResponse.json({
      success: true,
      data: { processed: results.length, results },
    })
  } catch (err: any) {
    console.error('Process scans error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Failed to process scans' },
      { status: 500 }
    )
  }
}

// Get user's pending/completed scans
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session as any)?.userId || 'anonymous'

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'all'

    let query = supabaseAdmin
      .from('pending_scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query.limit(20)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (err: any) {
    console.error('Get scans error:', err.message)
    return NextResponse.json(
      { success: false, error: 'Failed to get scans' },
      { status: 500 }
    )
  }
}