import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, enforceRateLimit } from '@/lib/api-auth'
import { formatProduct } from '@/lib/scan-helpers'
import { lookupBarcode } from '@/lib/scan-product'
import { runUnifiedAnalysis, toUnifiedInput } from '@/lib/analysis-runner'
import { scoreProduct, detectAdditives } from '@/lib/health-engine'
import { buildIngredientReport } from '@/lib/ingredient-report'
import { computeHealthRating } from '@/lib/frontend-transform'

// NOTE: This route used to also export a GET handler with its own duplicate
// copy of the 9-layer lookup pipeline (~450 lines). The frontend (src/app/scan/page.tsx)
// only ever calls POST — lookupBarcode() in src/lib/scan-product.ts is the single
// source of truth for the pipeline now. The dead GET handler was removed to stop
// the two copies from drifting out of sync.

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if ('response' in auth) return auth.response

  const rate = await enforceRateLimit(auth.userId, 'scan', req)
  if ('response' in rate) return rate.response

  try {
    const { barcode } = await req.json()
    if (!barcode || typeof barcode !== 'string') {
      return NextResponse.json({ success: false, error: 'Missing barcode' }, { status: 400 })
    }

    const result = await lookupBarcode(barcode)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        reason: 'not_found',
        barcode: result.barcode,
        message: result.message,
      }, { status: 404 })
    }

    // Fire background enrichment for estimated/low confidence scans
    if (result.confidence === 'estimated' || result.confidence === 'low') {
      fetch(`${req.nextUrl.origin}/api/enrich`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, name: result.product.name, brand: result.product.brand, confidence: result.confidence }),
      }).catch(() => {})
    }

    const product = formatProduct(result.product)
    const unifiedInput = toUnifiedInput(result.product)

    // Return the deterministic label/nutrition report immediately. AI prose and
    // remote alternative lookup are intentionally omitted from the scan-critical
    // path so one slow provider cannot make a valid barcode time out.
    //
    // A found product must never come back looking like "not found" just
    // because enrichment (Groq prose, dynamic alternatives, DB profile fetch)
    // hiccuped. If the full analysis throws, fall back to the local,
    // deterministic health-engine scorer — no network calls, so it's the
    // one thing here that should never fail — and still return the product
    // with its nutrition and ingredients intact, flagged as degraded.
    let analysis: any
    let degraded = false
    try {
      analysis = await runUnifiedAnalysis(unifiedInput, { userId: auth.userId, fast: true })
    } catch (analysisErr: any) {
      console.error('Analysis step failed, falling back to local scorer:', analysisErr?.message)
      degraded = true
      const local = scoreProduct(unifiedInput.nutrition as any, unifiedInput.ingredients_text || '')
      const detected = detectAdditives(unifiedInput.ingredients_text || '')
      // Shape matches what src/app/results reads (health_score, health_rating,
      // harmful_ingredients, ingredient_report, summary) — this is a reduced
      // version of the object runUnifiedAnalysis normally builds, using only
      // the local deterministic scorer (no Groq/AI, no dynamic alternatives).
      analysis = {
        health_score: local.score,
        health_rating: computeHealthRating(local.score),
        health_score_breakdown: { nutrition_score: null, ingredient_safety_score: null, processing_score: null, overall: local.score },
        summary: local.summary || `${unifiedInput.name} scored ${local.score}/10 (${local.label}).`,
        harmful_ingredients: detected,
        ingredient_report: buildIngredientReport(unifiedInput.ingredients_text),
        concerns: [],
        positives: [`Local scoring: ${local.score}/10 (${local.grade})`],
        recommendations: [],
        scoring_method: 'local_only_degraded',
        data_quality: 'partial',
      }
    }

    const dyn = (analysis as any).dynamic_alternatives
    const curatedAlts = (analysis as any).curated_alternatives || []
    const dynamicAlts = (dyn?.products || []).map((p: any) => ({
      name: p.name,
      brand: p.brand || '',
      image_url: p.image_url || undefined,
      health_score: p.score,
      grade: p.grade,
      reason: dyn.why_better?.[0]?.improvement || `Healthier alternative — score ${p.score}/10`,
    }))
    // Merge: curated first (Indian, with prices), then dynamic (OFF)
    const seen = new Set(dynamicAlts.map((a: any) => a.name.toLowerCase()))
    const mergedAlts = [
      ...curatedAlts.filter((a: any) => !seen.has(a.name.toLowerCase())),
      ...dynamicAlts,
    ]

    return NextResponse.json({
      success: true,
      product,
      analysis,
      alternatives: mergedAlts,
      source: result.source,
      confidence: result.confidence,
      degraded,
    })
  } catch (err: any) {
    console.error('Scan POST error:', err.message)
    // Distinguish "actually not found" from "something broke" so the UI
    // doesn't show the same dead-end message for both.
    return NextResponse.json({
      success: false,
      error: 'Scan failed. Please try again.',
      reason: 'server_error',
      detail: err?.message,
    }, { status: 500 })
  }
}
