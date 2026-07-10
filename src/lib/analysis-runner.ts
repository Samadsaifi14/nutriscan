// BioYou - Unified analysis runner
// Single scoring path used by /api/scan, /api/scan-product-photo, and /api/analyze.
// Local deterministic scoring (health-engine) + Groq enrichment + healthier alternatives.

import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { generateUnifiedAnalysis } from '@/lib/groq'
import { scoreProduct, detectAdditives, getCategoryWarnings, type NutritionPer100g } from '@/lib/health-engine'
import { findHealthierAlternatives } from '@/lib/alternatives'
import { findCuratedAlternatives } from '@/lib/curated-alternatives'

export interface UnifiedProductInput {
  barcode?: string
  name: string
  brand?: string | null
  category?: string | null
  country_of_origin?: string
  image_url?: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    sugar?: number
    saturated_fat?: number
    sodium?: number
    fiber?: number
  }
  ingredients_text?: string
  allergens?: string[]
  additives?: string[]
}

// Normalize the varied product shapes (calories_per_100g vs calories) into one input.
export function toUnifiedInput(p: any): UnifiedProductInput {
  return {
    barcode: p?.barcode,
    name: p?.name || 'Unknown Product',
    brand: p?.brand ?? null,
    category: p?.category ?? null,
    country_of_origin: p?.country_of_origin,
    image_url: p?.image_url,
    nutrition: {
      calories: p?.calories_per_100g ?? p?.calories ?? 0,
      protein: p?.protein_per_100g ?? p?.protein ?? 0,
      carbs: p?.carbohydrates_per_100g ?? p?.carbohydrates ?? p?.carbs ?? 0,
      fat: p?.fat_per_100g ?? p?.fat ?? 0,
      sugar: p?.sugar_per_100g ?? p?.sugar,
      saturated_fat: p?.saturated_fat_per_100g ?? p?.saturated_fat,
      sodium: p?.sodium_per_100g ?? p?.sodium,
      fiber: p?.fiber_per_100g ?? p?.fiber,
    },
    ingredients_text: p?.ingredients_text,
    allergens: p?.allergens,
    additives: p?.additives,
  }
}

const SEVERITY = (risk: string) =>
  risk === 'harmful' || risk === 'high' ? 'high' : risk === 'moderate' ? 'medium' : 'low'

export async function runUnifiedAnalysis(
  product: UnifiedProductInput,
  opts?: { userId?: string; userProfile?: any }
): Promise<any> {
  const hasRealNutrition = [product.nutrition.calories, product.nutrition.protein, product.nutrition.carbs, product.nutrition.fat].some(
    (v) => v !== undefined && v !== null && v > 0
  )

  const harmfulFromIngredients = detectAdditives(product.ingredients_text || '')
  const categoryWarnings = getCategoryWarnings(product.category || '')
  const combinedHarmful = harmfulFromIngredients.length > 0 ? harmfulFromIngredients : categoryWarnings.length > 0 ? categoryWarnings : harmfulFromIngredients

  if (!hasRealNutrition) {
    console.log(`⚠️ ${product.name} has no real nutrition data — returning ingredient-based analysis`)

    const nutritionScore = 5
    let additiveScore = 10
    const activeWarnings = combinedHarmful.length > 0 ? combinedHarmful : harmfulFromIngredients
    if (activeWarnings.length > 0) additiveScore = Math.max(1, 10 - activeWarnings.length * 2)

    const overallScore = Math.round(nutritionScore * 0.4 + additiveScore * 0.4 + 5 * 0.2)

    const local = {
      score: overallScore,
      grade: overallScore >= 8 ? 'A' : overallScore >= 6 ? 'B' : overallScore >= 4 ? 'C' : 'D',
      label: overallScore >= 8 ? 'Healthy' : overallScore >= 6 ? 'Moderate' : overallScore >= 4 ? 'Unhealthy' : 'Poor',
      nutrition_score: nutritionScore,
      additive_score: additiveScore,
      nova_score: 5,
      detected_additives: activeWarnings,
      summary: `${product.name} has limited nutrition data available. Ingredient analysis shows ${activeWarnings.length} harmful additive(s) detected. Score based on ingredient safety only.`,
    }

    const localHealthScore = local.score
    const localHealthRating = local.grade === 'A' || local.grade === 'B' ? 'healthy' : local.grade === 'C' ? 'moderate' : 'unhealthy'
    const localDetectedAdditives = local.detected_additives.map((a: any) => ({
      name: a.name,
      also_known_as: a.aliases,
      found_in_product: true,
      concern: a.concern,
      reason: a.concern,
      severity: SEVERITY(a.risk),
      scientific_source: 'WHO/FSSAI/EFSA',
      source_url: '',
      global_safe_limit: '',
      amount_in_this_product: '',
      personalized_safe_limit: '',
      percentage_of_daily_limit: '',
    }))

    return {
      health_score: localHealthScore,
      health_rating: localHealthRating,
      health_score_breakdown: { nutrition_score: local.nutrition_score, ingredient_safety_score: local.additive_score, processing_score: local.nova_score, overall: local.score },
      summary: local.summary,
      recommendation: null,
      detailed_breakdown: {
        calories: 'Estimate only - verify label',
        protein: 'Estimate only - verify label',
        sugar: 'Estimate only - verify label',
        sodium: 'Estimate only - verify label',
        fat: 'Estimate only - verify label',
        fiber: 'Estimate only - verify label',
        processing_level: 'unknown',
        overall_nutrient_density: 'unknown',
      },
      safe_consumption: { amount: null, frequency: 'Verify with label', notes: 'Nutrition data is incomplete. Check the actual product label for accurate information.', personalized_for_user: null },
      harmful_ingredients: localDetectedAdditives,
      ingredient_warnings: activeWarnings.map((a: any) => ({ ingredient: a.name, concern: a.concern || a.description, reason: a.concern, severity: SEVERITY(a.risk) })),
      positives: ['Ingredient analysis completed - see harmful ingredients above'],
      long_term_risks: activeWarnings.length > 0 ? [`Contains ${activeWarnings.length} harmful additive(s)`] : ['No harmful additives detected in ingredient list'],
      concerns: [],
      recommendations: [],
      personalizedWarnings: [],
      ai_ingredients: [],
      fssai_compliance: activeWarnings.length > 0 ? 'concern' : 'unknown',
      diabetic_suitability: activeWarnings.some((a: any) => ['Monosodium Glutamate', 'Sodium Benzoate', 'Potassium Sorbate', 'TBHQ', 'BHA', 'BHT', 'Aspartame', 'Acesulfame K', 'Saccharin', 'Sucralose'].includes(a.name)) ? 'consume_with_caution' : 'suitable',
      bp_suitability: activeWarnings.some((a: any) => ['Sodium Benzoate', 'Sodium Nitrite', 'MSG/E621'].includes(a.name)) ? 'consume_with_caution' : 'suitable',
      child_suitability: activeWarnings.some((a: any) => ['Tartrazine', 'Sunset Yellow', 'Carmoisine', 'Ponceau 4R', 'Allura Red', 'Sodium Benzoate'].includes(a.name)) ? 'consume_with_caution' : 'suitable',
      pregnancy_suitability: activeWarnings.some((a: any) => ['Retinol/Vitamin A acetate', 'Tartrazine', 'Erythrosine/E127'].includes(a.name)) ? 'consume_with_caution' : 'suitable',
      analyzed_at: new Date().toISOString(),
      personalized: !!opts?.userProfile,
      scoring_method: 'estimated_only',
      data_quality: 'estimated',
    }
  }

  // ── PHASE 1: Local deterministic scoring (primary) ──
  const localNutrition: NutritionPer100g = {
    calories: product.nutrition.calories || 0,
    protein: product.nutrition.protein || 0,
    carbohydrates: product.nutrition.carbs || 0,
    total_fat: product.nutrition.fat || 0,
    sugar: product.nutrition.sugar,
    saturated_fat: product.nutrition.saturated_fat,
    sodium: product.nutrition.sodium,
    fiber: product.nutrition.fiber,
  }

  const localResult = scoreProduct(localNutrition, product.ingredients_text || '')
  console.log(`📊 Local scoring: ${product.name} → ${localResult.grade} (${localResult.score}/10)`)

  const fullAnalysisWarnings = localResult.detected_additives.length === 0 && product.category ? getCategoryWarnings(product.category) : localResult.detected_additives

  const localHealthScore = localResult.score
  const localHealthRating = localResult.grade === 'A' || localResult.grade === 'B' ? 'healthy' : localResult.grade === 'C' ? 'moderate' : 'unhealthy'
  const localDetectedAdditives = fullAnalysisWarnings.map((a: any) => ({
    name: a.name,
    also_known_as: a.aliases,
    found_in_product: true,
    concern: a.concern,
    reason: a.concern,
    severity: SEVERITY(a.risk),
    scientific_source: 'WHO/FSSAI/EFSA',
    source_url: '',
    global_safe_limit: '',
    amount_in_this_product: '',
    personalized_safe_limit: '',
    percentage_of_daily_limit: '',
  }))

  // Fetch user profile from DB if not passed
  let profile = opts?.userProfile
  if (opts?.userId && !profile) {
    const { data: dbProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('age, weight_kg, height_cm, weight_goal, gender, is_diabetic, has_bp, has_heart_disease, has_cholesterol, is_vegetarian, is_vegan, is_jain, has_thyroid, has_kidney_disease, has_pcod, is_pregnant, is_lactating, ethnicity, region, allergies, food_preferences')
      .eq('user_id', opts.userId)
      .single()

    if (dbProfile) {
      let bmi = null as number | null
      if (dbProfile.weight_kg && dbProfile.height_cm) {
        const h = dbProfile.height_cm / 100
        bmi = parseFloat((dbProfile.weight_kg / (h * h)).toFixed(1))
      }
      profile = {
        age: dbProfile.age || undefined,
        bmi: bmi || undefined,
        weight_goal: dbProfile.weight_goal || undefined,
        gender: dbProfile.gender || undefined,
        is_diabetic: dbProfile.is_diabetic || false,
        has_bp: dbProfile.has_bp || false,
        has_heart_disease: dbProfile.has_heart_disease || false,
        has_cholesterol: dbProfile.has_cholesterol || false,
        is_vegetarian: dbProfile.is_vegetarian || false,
        is_vegan: dbProfile.is_vegan || false,
        is_jain: dbProfile.is_jain || false,
        has_thyroid: dbProfile.has_thyroid || false,
        has_kidney_disease: dbProfile.has_kidney_disease || false,
        has_pcod: dbProfile.has_pcod || false,
        is_pregnant: dbProfile.is_pregnant || false,
        is_lactating: dbProfile.is_lactating || false,
        ethnicity: dbProfile.ethnicity || undefined,
        region: dbProfile.region || undefined,
        allergies: dbProfile.allergies || [],
        food_preferences: dbProfile.food_preferences || undefined,
      }
    }
  }

  // ── Cache read (non-personalized barcode scans) ──
  const CACHE_DURATION_MS = 30 * 24 * 60 * 60 * 1000
  if (product.barcode) {
    let cached: any = null
    try {
      const { data } = await supabaseAdmin
        .from('products')
        .select('health_score, health_grade, nutrition_score, additive_score, nova_group, local_analysis_json, cached_at, ai_analysis_json, ai_analyzed_at')
        .eq('barcode', product.barcode)
        .single()
      cached = data
    } catch (cacheErr: any) {
      console.warn('Cache check skipped:', cacheErr?.message || cacheErr)
    }

    if (cached?.health_score && cached?.cached_at && Date.now() - new Date(cached.cached_at).getTime() < CACHE_DURATION_MS) {
      console.log(`📦 Returning cached local score: ${cached.health_score}/10`)
      return {
        health_score: localHealthScore,
        health_rating: localHealthRating,
        health_score_breakdown: { nutrition_score: localResult.nutrition_score, ingredient_safety_score: localResult.additive_score, processing_score: localResult.nova_score, overall: localResult.score },
        harmful_ingredients: localDetectedAdditives,
        ingredient_warnings: localResult.detected_additives.map((a: any) => ({ ingredient: a.name, concern: a.concern || a.description, reason: a.concern, severity: SEVERITY(a.risk) })),
        summary: localResult.summary,
        concerns: [],
        recommendations: [],
        personalizedWarnings: [],
        ai_ingredients: [],
        analyzed_at: new Date().toISOString(),
        personalized: !!opts?.userProfile,
        scoring_method: 'local_cached',
        _from_cache: true,
      }
    }

    if (cached?.ai_analysis_json && cached?.ai_analyzed_at && Date.now() - new Date(cached.ai_analyzed_at).getTime() < 7 * 24 * 60 * 60 * 1000) {
      const cachedAnalysis = cached.ai_analysis_json
      return {
        ...cachedAnalysis,
        health_score: localHealthScore,
        health_rating: localHealthRating,
        health_score_breakdown: { nutrition_score: localResult.nutrition_score, ingredient_safety_score: localResult.additive_score, processing_score: localResult.nova_score, overall: localResult.score },
        harmful_ingredients: localDetectedAdditives.length > 0 ? localDetectedAdditives : cachedAnalysis.harmful_ingredients || [],
        ingredient_warnings: localResult.detected_additives.map((a: any) => ({ ingredient: a.name, concern: a.concern || a.description, reason: a.concern, severity: SEVERITY(a.risk) })),
        summary: cachedAnalysis.summary || localResult.summary,
        concerns: cachedAnalysis.concerns || [],
        recommendations: cachedAnalysis.recommendations || [],
        personalizedWarnings: cachedAnalysis.personalizedWarnings || [],
        ai_ingredients: cachedAnalysis.ai_ingredients || [],
        analyzed_at: new Date().toISOString(),
        personalized: false,
        scoring_method: 'hybrid_local_cache',
      }
    }
  }

  // ── PHASE 4: Groq enrichment (cheap/fast summary) ──
  let aiEnhancement: any = null
  let aiFailed = false
  try {
    console.log(`🤖 Generating unified Groq analysis...`)
    const groqResult = await Promise.race([
      generateUnifiedAnalysis({
        product_name: product.name,
        score: localResult.score,
        grade: localResult.grade,
        nutrition: {
          calories: product.nutrition.calories,
          protein: product.nutrition.protein,
          carbs: product.nutrition.carbs,
          fat: product.nutrition.fat,
          sugar: product.nutrition.sugar,
          saturated_fat: product.nutrition.saturated_fat,
          sodium: product.nutrition.sodium,
          fiber: product.nutrition.fiber,
        },
        additives_found: localResult.detected_additives.map((a: any) => a.name),
        nova_group: localResult.nova_group,
        ingredients_text: product.ingredients_text || '',
        userProfile: profile ? {
          is_diabetic: profile.is_diabetic,
          has_bp: profile.has_bp,
          has_heart_disease: profile.has_heart_disease,
          has_cholesterol: profile.has_cholesterol,
          is_vegetarian: profile.is_vegetarian,
          is_vegan: profile.is_vegan,
          is_jain: profile.is_jain,
          allergies: profile.allergies,
          has_thyroid: profile.has_thyroid,
          has_kidney_disease: profile.has_kidney_disease,
          has_pcod: profile.has_pcod,
          is_pregnant: profile.is_pregnant,
          is_lactating: profile.is_lactating,
          ethnicity: profile.ethnicity,
        } : undefined,
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('groq timeout')), 6000)),
    ])
    aiEnhancement = {
      summary: groqResult.summary,
      recommendation: groqResult.recommendation,
      concerns: groqResult.concerns,
      positives: groqResult.positives,
      recommendations: groqResult.recommendations,
      personalizedWarnings: groqResult.personalizedWarnings,
      long_term_risks: groqResult.long_term_risks,
      ai_ingredients: groqResult.ingredients,
    }
    console.log(`✅ Unified Groq analysis generated`)
  } catch (aiErr: any) {
    console.warn('Groq failed/timed out, using local summary:', aiErr?.message)
    aiFailed = true
  }

  const analysis: any = {
    health_rating: localHealthRating,
    health_score: localHealthScore,
    health_score_breakdown: { nutrition_score: localResult.nutrition_score, ingredient_safety_score: localResult.additive_score, processing_score: localResult.nova_score, overall: localResult.score },
    summary: (aiEnhancement?.summary && String(aiEnhancement.summary).trim()) || localResult.summary || `${product.name} scored ${Math.round(localResult.score * 10) / 10}/10 (${localResult.label}).`,
    recommendation: aiEnhancement?.recommendation || null,
    detailed_breakdown: {
      calories: aiEnhancement?.detailed_breakdown?.calories || `(${localResult.breakdown.find((b: any) => b.factor === 'calories')?.detail || 'see score'})`,
      protein: aiEnhancement?.detailed_breakdown?.protein || `(${localResult.breakdown.find((b: any) => b.factor === 'protein')?.detail || 'see score'})`,
      sugar: aiEnhancement?.detailed_breakdown?.sugar || `(${localResult.breakdown.find((b: any) => b.factor === 'sugar')?.detail || 'see score'})`,
      sodium: aiEnhancement?.detailed_breakdown?.sodium || `(${localResult.breakdown.find((b: any) => b.factor === 'sodium')?.detail || 'see score'})`,
      fat: aiEnhancement?.detailed_breakdown?.fat || `(${localResult.breakdown.find((b: any) => b.factor === 'sat_fat')?.detail || 'see score'})`,
      fiber: aiEnhancement?.detailed_breakdown?.fiber || `(${localResult.breakdown.find((b: any) => b.factor === 'fiber')?.detail || 'see score'})`,
      processing_level: localResult.nova_label,
      overall_nutrient_density: localResult.score >= 7 ? 'high' : localResult.score >= 5 ? 'medium' : 'low',
    },
    safe_consumption: aiEnhancement?.safe_consumption || {
      amount: null,
      frequency: localResult.grade === 'A' ? 'Unlimited' : localResult.grade === 'B' ? 'Daily' : localResult.grade === 'C' ? 'Occasional' : 'Limit',
      notes: localResult.label,
      personalized_for_user: profile ? 'Based on your profile' : null,
    },
    harmful_ingredients: localDetectedAdditives,
    ingredient_warnings: fullAnalysisWarnings.map((a: any) => ({ ingredient: a.name, concern: a.concern || a.description, reason: a.concern, severity: SEVERITY(a.risk) })),
    positives: aiEnhancement?.positives || [`Local scoring: ${localResult.score}/10 (${localResult.grade})`],
    long_term_risks: aiEnhancement?.long_term_risks || (localDetectedAdditives.length > 0 ? [`Contains ${localDetectedAdditives.length} potentially harmful additive(s)`] : ['See score breakdown for details']),
    concerns: aiEnhancement?.concerns || generateLocalConcerns(localDetectedAdditives, localResult),
    recommendations: aiEnhancement?.recommendations || generateLocalRecommendations(localResult, profile),
    personalizedWarnings: aiEnhancement?.personalizedWarnings || generateLocalPersonalizedWarnings(localResult, profile),
    ai_ingredients: aiEnhancement?.ai_ingredients || [],
    healthier_alternatives: aiEnhancement?.healthier_alternatives || [],
    fssai_compliance: aiEnhancement?.fssai_compliance || (localResult.score >= 7 ? 'compliant' : localResult.score >= 5 ? 'concern' : 'unknown'),
    diabetic_suitability: aiEnhancement?.diabetic_suitability || (localResult.breakdown.some((b: any) => b.factor === 'sugar' && b.impact === 'critical') ? 'avoid' : localResult.breakdown.some((b: any) => b.factor === 'sugar' && b.impact === 'negative') ? 'consume_with_caution' : 'suitable'),
    bp_suitability: aiEnhancement?.bp_suitability || (localResult.breakdown.some((b: any) => b.factor === 'sodium' && b.impact === 'critical') ? 'avoid' : localResult.breakdown.some((b: any) => b.factor === 'sodium' && b.impact === 'negative') ? 'consume_with_caution' : 'suitable'),
    child_suitability: aiEnhancement?.child_suitability || (localDetectedAdditives.some((a: any) => a.severity === 'high') ? 'avoid' : 'consume_with_caution'),
    pregnancy_suitability: aiEnhancement?.pregnancy_suitability || 'suitable',
    analyzed_at: new Date().toISOString(),
    personalized: !!profile,
    scoring_method: aiFailed ? 'local_only' : 'hybrid',
    data_quality: 'verified',
  }

  // ── PHASE 3: Dynamic healthier alternatives from Open Food Facts ──
  let dynamicAlternatives: any = null
  try {
    const altResult = await Promise.race([
      findHealthierAlternatives({
        name: product.name,
        brand: product.brand || null,
        category: product.category || null,
        barcode: product.barcode || null,
        nutrition_per_100g: product.nutrition,
        ingredients_text: product.ingredients_text || null,
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('alternatives timeout')), 4000)),
    ])
    if (altResult.alternatives.length > 0) {
      dynamicAlternatives = {
        products: altResult.alternatives.map((p: any) => ({ barcode: p.barcode, name: p.name, brand: p.brand, image_url: p.image_url, score: p.score, grade: p.grade, nutrition: p.nutrition_per_100g })),
        why_better: altResult.why_better,
        current_score: altResult.current_score,
        current_grade: altResult.current_grade,
      }
      console.log(`🔄 Found ${altResult.alternatives.length} dynamic alternatives`)
    }
  } catch (altErr: any) {
    console.warn('Dynamic alternatives skipped:', altErr?.message)
  }
  if (dynamicAlternatives) analysis.dynamic_alternatives = dynamicAlternatives

  // ── Curated Indian alternatives fallback (when dynamic OFF results are sparse) ──
  try {
    const curatedAlts = findCuratedAlternatives(product.name, product.category, localResult.score)
    if (curatedAlts.length > 0) {
      // Map curated alternatives to the Alternative interface
      const curatedMapped = curatedAlts.slice(0, 5).map((ca) => ({
        name: ca.name,
        brand: ca.type === 'branded' ? ca.name.split(' ').slice(0, 2).join(' ') : undefined,
        health_score: ca.score || 7,
        grade: ca.grade || 'B',
        reason: ca.reason,
        availability: ca.availability,
        shopping_url: ca.shopping_url,
      }))
      // Merge: curated first (Indian, with prices), then existing dynamic
      const existingNames = new Set(
        (analysis.dynamic_alternatives?.products || []).map((p: any) => p.name?.toLowerCase()),
      )
      const newCurated = curatedMapped.filter((a) => !existingNames.has(a.name.toLowerCase()))
      if (newCurated.length > 0) {
        analysis.curated_alternatives = newCurated
        console.log(`🇮🇳 Found ${newCurated.length} curated Indian alternatives`)
      }
    }
  } catch (curatedErr: any) {
    console.warn('Curated alternatives skipped:', curatedErr?.message)
  }

  console.log(`✅ ${product.name} → ${analysis.health_rating} (${analysis.health_score}/10) | method: ${analysis.scoring_method}`)

  // Cache result for non-personalized barcode scans
  if (product.barcode && !profile) {
    const updateData: Record<string, any> = {
      last_scanned: new Date().toISOString(),
      health_score: localResult.score,
      health_grade: localResult.grade,
      nutrition_score: localResult.nutrition_score,
      additive_score: localResult.additive_score,
      nova_group: localResult.nova_group,
      cached_at: new Date().toISOString(),
    }
    if (!aiFailed && aiEnhancement) {
      updateData.ai_health_rating = analysis.health_rating
      updateData.ai_analysis_json = aiEnhancement
      updateData.ai_analyzed_at = analysis.analyzed_at
    }
    try {
      await supabaseAdmin.from('products').update(updateData).eq('barcode', product.barcode)
    } catch (cacheUpdateErr: any) {
      console.warn('Cache update skipped:', cacheUpdateErr?.message || cacheUpdateErr)
    }
  }

  return analysis
}

// ── Local fallback generators (when Groq fails) ──

function generateLocalConcerns(additives: any[], localResult: any): string[] {
  const concerns: string[] = []
  const harmful = additives.filter((a) => a.severity === 'high')
  const moderate = additives.filter((a) => a.severity === 'medium')
  if (harmful.length > 0) concerns.push(`Contains ${harmful.length} potentially harmful additive(s): ${harmful.map((a) => a.name).join(', ')}`)
  if (moderate.length > 0) concerns.push(`Contains ${moderate.length} moderate-risk additives: ${moderate.map((a) => a.name).join(', ')}`)
  if (localResult.nova_group >= 4) concerns.push('Ultra-processed product (NOVA Group 4) — linked to increased health risks')
  if (localResult.breakdown.some((b: any) => b.factor === 'sugar' && b.impact === 'critical')) concerns.push('Very high sugar content')
  if (localResult.breakdown.some((b: any) => b.factor === 'sodium' && b.impact === 'critical')) concerns.push('Very high sodium content')
  return concerns
}

function generateLocalRecommendations(localResult: any, profile: any): string[] {
  const recs: string[] = []
  if (localResult.grade === 'A') recs.push('Great choice! This product is healthy and nutritious.')
  else if (localResult.grade === 'B') recs.push('Good option — consider pairing with fresh fruits or vegetables.')
  else if (localResult.grade === 'C') recs.push('Consume occasionally — there are healthier alternatives available.')
  else recs.push('Consider switching to a healthier alternative — this product has significant health concerns.')
  if (localResult.breakdown.some((b: any) => b.factor === 'sugar' && b.impact !== 'positive')) recs.push('Look for low-sugar or sugar-free alternatives.')
  if (localResult.breakdown.some((b: any) => b.factor === 'sodium' && b.impact !== 'positive')) recs.push('Choose low-sodium options when available.')
  if (localResult.nova_group >= 4) recs.push('Try to choose less processed (NOVA Group 1-2) alternatives.')
  if (profile?.is_vegetarian) recs.push('Check ingredients for any non-vegetarian components.')
  if (profile?.is_vegan) recs.push('Verify this product is free from all animal-derived ingredients.')
  if (profile?.is_jain) recs.push('Check for root vegetables, fermented ingredients, or alcohol-derived additives.')
  return recs
}

function generateLocalPersonalizedWarnings(localResult: any, profile: any): string[] {
  if (!profile) return []
  const warnings: string[] = []
  if (profile.is_diabetic && localResult.breakdown.some((b: any) => b.factor === 'sugar' && (b.impact === 'critical' || b.impact === 'negative'))) {
    warnings.push('High sugar content — not recommended for diabetics. Consider sugar-free alternatives.')
  }
  if (profile.has_bp && localResult.breakdown.some((b: any) => b.factor === 'sodium' && (b.impact === 'critical' || b.impact === 'negative'))) {
    warnings.push('High sodium content — avoid if you have high blood pressure.')
  }
  if (profile.has_heart_disease && localResult.breakdown.some((b: any) => b.factor === 'sat_fat' && (b.impact === 'critical' || b.impact === 'negative'))) {
    warnings.push('High saturated fat — not recommended for heart disease patients.')
  }
  if (profile.has_cholesterol && localResult.breakdown.some((b: any) => b.factor === 'sat_fat' && (b.impact === 'critical' || b.impact === 'negative'))) {
    warnings.push('High fat content — may worsen cholesterol levels.')
  }
  if (profile.has_thyroid) {
    const ingredients = (localResult.detected_additives || []).map((a: any) => a.name?.toLowerCase() || '')
    if (ingredients.some((i: string) => i.includes('soy') || i.includes('soya'))) {
      warnings.push('Contains soy-based ingredients — may interfere with thyroid medication absorption.')
    }
  }
  if (profile.has_kidney_disease && localResult.breakdown.some((b: any) => (b.factor === 'protein' || b.factor === 'sodium') && (b.impact === 'critical' || b.impact === 'negative'))) {
    warnings.push('High protein/sodium — consult your doctor before consuming with kidney disease.')
  }
  if (profile.has_pcod && localResult.breakdown.some((b: any) => b.factor === 'sugar' && (b.impact === 'critical' || b.impact === 'negative'))) {
    warnings.push('High sugar content — avoid with PCOD/PCOS as it may worsen insulin resistance.')
  }
  if (profile.is_pregnant) {
    const additives = localResult.detected_additives || []
    const harmful = additives.filter((a: any) => a.severity === 'high')
    if (harmful.length > 0) warnings.push('Contains artificial additives — consult your doctor during pregnancy.')
  }
  if (profile.is_lactating) {
    const additives = localResult.detected_additives || []
    if (additives.length > 0) warnings.push('Contains additives that may pass to breast milk — consume with caution.')
  }
  if (profile.is_vegan) {
    const ingredients = (localResult.detected_additives || []).map((a: any) => a.name?.toLowerCase() || '')
    const animalDerived = ['gelatin', 'shellac', 'carmine', 'isinglass', 'rennet', 'casein', 'whey']
    const found = ingredients.filter((i: string) => animalDerived.some((a) => i.includes(a)))
    if (found.length > 0) warnings.push(`May contain animal-derived ingredients: ${found.join(', ')}`)
  }
  if (profile.is_jain) {
    const ingredients = (localResult.detected_additives || []).map((a: any) => a.name?.toLowerCase() || '')
    const jainRestricted = ['onion', 'garlic', 'potato', 'carrot', 'beetroot', 'fermented']
    const found = ingredients.filter((i: string) => jainRestricted.some((j) => i.includes(j)))
    if (found.length > 0) warnings.push(`May contain ingredients restricted in Jain diet: ${found.join(', ')}`)
  }
  if (profile.allergies && profile.allergies.length > 0) {
    warnings.push(`Contains allergens you selected: ${profile.allergies.join(', ')} — verify ingredient list.`)
  }
  return warnings
}
