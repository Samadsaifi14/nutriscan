import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit } from '@/lib/rateLimit'
import { GeminiError } from '@/lib/gemini'
import { generateUnifiedAnalysis } from '@/lib/groq'
import { scoreProduct, detectAdditives, getCategoryWarnings, type NutritionPer100g } from '@/lib/health-engine'
import { findHealthierAlternatives } from '@/lib/alternatives'

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
  userProfile: z.object({
    age: z.number().optional(),
    bmi: z.number().optional(),
    weight_goal: z.string().optional(),
    is_diabetic: z.boolean().optional(),
    has_bp: z.boolean().optional(),
    is_vegetarian: z.boolean().optional(),
    gender: z.string().optional(),
  }).optional(),
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

    // Pre-validation
    if (!body.product) {
      return NextResponse.json({ success: false, error: 'No product data provided' }, { status: 400 })
    }
    if (!body.product.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Product name is missing' }, { status: 400 })
    }
    if (!body.product.nutrition || typeof body.product.nutrition !== 'object') {
      return NextResponse.json({ success: false, error: 'Nutrition data is missing' }, { status: 400 })
    }

    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(' | ')
      console.error('Zod validation failed:', issues)
      return NextResponse.json({ success: false, error: 'Invalid product data', details: issues }, { status: 400 })
    }

    const { product, userProfile } = parsed.data

    // Detect if this is AI-estimated / low-confidence data
    const hasRealNutrition = [
      product.nutrition.calories,
      product.nutrition.protein,
      product.nutrition.carbs,
      product.nutrition.fat,
    ].some(v => v !== undefined && v !== null && v > 0)

    // Even if nutrition data is missing/estimated, we can still analyze ingredients
    const harmfulFromIngredients = detectAdditives(product.ingredients_text || '')
    
    // Supplement with category-based warnings when ingredient info is limited
    const categoryWarnings = getCategoryWarnings(product.category || '')
    const combinedHarmful = harmfulFromIngredients.length > 0
      ? harmfulFromIngredients
      : categoryWarnings.length > 0
        ? categoryWarnings
        : harmfulFromIngredients

    if (!hasRealNutrition) {
      console.log(`⚠️ ${product.name} has no real nutrition data — returning ingredient-based analysis`)
      
      // Calculate scores based on available data
      let nutritionScore = 5; // Default middle score when unknown
      let additiveScore = 10;
      const activeWarnings = combinedHarmful.length > 0 ? combinedHarmful : harmfulFromIngredients
      if (activeWarnings.length > 0) {
        // More harmful additives = lower score
        additiveScore = Math.max(1, 10 - (activeWarnings.length * 2));
      }
      
      // Overall score weights: 40% nutrition, 40% additives, 20% processing (estimated)
      const overallScore = Math.round((nutritionScore * 0.4) + (additiveScore * 0.4) + (5 * 0.2)); // 5 = estimated processing score
      
      const localResult = {
        score: overallScore,
        grade: overallScore >= 8 ? 'A' : overallScore >= 6 ? 'B' : overallScore >= 4 ? 'C' : 'D',
        label: overallScore >= 8 ? 'Healthy' : overallScore >= 6 ? 'Moderate' : overallScore >= 4 ? 'Unhealthy' : 'Poor',
        nutrition_score: nutritionScore,
        additive_score: additiveScore,
        nova_score: 5, // Unknown processing
        breakdown: [],
        detected_additives: activeWarnings,
        summary: `${product.name} has limited nutrition data available. Ingredient analysis shows ${activeWarnings.length} harmful additive(s) detected. Score based on ingredient safety only.`,
      };

      // Map local result to expected format
      const localHealthScore = localResult.score
      const localHealthRating = localResult.grade === 'A' ? 'healthy' : 
                                localResult.grade === 'B' ? 'healthy' :
                                localResult.grade === 'C' ? 'moderate' : 'unhealthy'
      const localDetectedAdditives = localResult.detected_additives.map(a => ({
        name: a.name,
        also_known_as: a.aliases,
        found_in_product: true,
        concern: a.concern,
        severity: a.risk === 'harmful' ? 'high' : a.risk === 'high' ? 'high' : a.risk === 'moderate' ? 'medium' : 'low',
        scientific_source: 'WHO/FSSAI/EFSA',
        source_url: '',
        global_safe_limit: '',
        amount_in_this_product: '',
        personalized_safe_limit: '',
        percentage_of_daily_limit: ''
      }))

      return NextResponse.json({
        success: true,
        data: {
          health_score: localHealthScore,
          health_rating: localHealthRating,
          health_score_breakdown: { 
            nutrition_score: localResult.nutrition_score, 
            ingredient_safety_score: localResult.additive_score, 
            processing_score: localResult.nova_score, 
            overall: localResult.score 
          },
          summary: localResult.summary,
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
          safe_consumption: {
            amount: null,
            frequency: 'Verify with label',
            notes: 'Nutrition data is incomplete. Check the actual product label for accurate information.',
            personalized_for_user: null,
          },
          harmful_ingredients: localDetectedAdditives,
          ingredient_warnings: activeWarnings.map(a => ({
            ingredient: a.name,
            concern: a.concern || a.description,
            severity: a.risk === 'harmful' || a.risk === 'high' ? 'high' : a.risk === 'moderate' ? 'medium' : 'low'
          })),
          positives: ['Ingredient analysis completed - see harmful ingredients above'],
          long_term_risks: activeWarnings.length > 0 
            ? [`Contains ${activeWarnings.length} harmful additive(s)`] 
            : ['No harmful additives detected in ingredient list'],
          concerns: [],
          recommendations: [],
          personalizedWarnings: [],
          ai_ingredients: [],
          fssai_compliance: activeWarnings.length > 0 ? 'concern' : 'unknown',
          diabetic_suitability: activeWarnings.some(a => 
            ['Monosodium Glutamate', 'Sodium Benzoate', 'Potassium Sorbate', 'TBHQ', 'BHA', 'BHT', 'Aspartame', 'Acesulfame K', 'Saccharin', 'Sucralose'].includes(a.name)) 
            ? 'consume_with_caution' 
            : 'suitable',
          bp_suitability: activeWarnings.some(a => 
            ['Sodium Benzoate', 'Sodium Nitrite', 'MSG/E621'].includes(a.name)) 
            ? 'consume_with_caution' 
            : 'suitable',
          child_suitability: activeWarnings.some(a => 
            ['Tartrazine', 'Sunset Yellow', 'Carmoisine', 'Ponceau 4R', 'Allura Red', 'Sodium Benzoate'].includes(a.name)) 
            ? 'consume_with_caution' 
            : 'suitable',
          pregnancy_suitability: activeWarnings.some(a => 
            ['Retinol/Vitamin A acetate', 'Tartrazine', 'Erythrosine/E127'].includes(a.name)) 
            ? 'consume_with_caution' 
            : 'suitable',
          analyzed_at: new Date().toISOString(),
          personalized: !!userProfile,
          scoring_method: 'estimated_only',
          data_quality: 'estimated',
        },
        estimated: true,
      })
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 1: Local deterministic scoring (primary)
    // ─────────────────────────────────────────────────────────────────────────
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
    console.log(`   Additives found: ${localResult.detected_additives.length}`)
    console.log(`   NOVA: ${localResult.nova_group} (${localResult.nova_label})`)

    // Supplement with category-based warnings when ingredient detection was sparse
    const fullAnalysisWarnings = localResult.detected_additives.length === 0 && product.category
      ? getCategoryWarnings(product.category)
      : localResult.detected_additives

    // Map local result to expected format
    const localHealthScore = localResult.score
    const localHealthRating = localResult.grade === 'A' ? 'healthy' : 
                               localResult.grade === 'B' ? 'healthy' :
                               localResult.grade === 'C' ? 'moderate' : 'unhealthy'
    const localDetectedAdditives = fullAnalysisWarnings.map(a => ({
      name: a.name,
      also_known_as: a.aliases,
      found_in_product: true,
      concern: a.concern,
      severity: a.risk === 'harmful' ? 'high' : a.risk === 'high' ? 'high' : a.risk === 'moderate' ? 'medium' : 'low',
      scientific_source: 'WHO/FSSAI/EFSA',
      source_url: '',
      global_safe_limit: '',
      amount_in_this_product: '',
      personalized_safe_limit: '',
      percentage_of_daily_limit: ''
    }))

    // Fetch user profile from DB if not passed
    let profile = userProfile
    if (userId && !profile) {
      const { data: dbProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('age, weight_kg, height_cm, weight_goal, is_diabetic, has_bp, is_vegetarian, gender')
        .eq('user_id', userId)
        .single()

      if (dbProfile) {
        let bmi = null
        if (dbProfile.weight_kg && dbProfile.height_cm) {
          const h = dbProfile.height_cm / 100
          bmi = parseFloat((dbProfile.weight_kg / (h * h)).toFixed(1))
        }
        profile = {
          age: dbProfile.age || undefined,
          bmi: bmi || undefined,
          weight_goal: dbProfile.weight_goal || undefined,
          is_diabetic: dbProfile.is_diabetic || false,
          has_bp: dbProfile.has_bp || false,
          is_vegetarian: dbProfile.is_vegetarian || false,
          gender: dbProfile.gender || undefined,
        }
      }
    }

    // Cache check — only for barcode scans without personalization
    // Extended cache to 30 days for better performance
    const CACHE_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
    
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
        // Cache miss or query failure (e.g. column missing) — proceed with fresh analysis
        console.warn('Cache check skipped:', cacheErr?.message || cacheErr)
      }

      // Check local score cache first (30 days)
      if (cached?.health_score && cached?.cached_at) {
        const cacheAge = Date.now() - new Date(cached.cached_at).getTime()
        if (cacheAge < CACHE_DURATION_MS) {
          console.log(`📦 Returning cached local score: ${cached.health_score}/10 (cached ${Math.round(cacheAge / 86400000)} days ago)`)
          
          // Merge cached local score with fresh computation
          const mergedResult = {
            health_score: localHealthScore,
            health_rating: localHealthRating,
            health_score_breakdown: {
              nutrition_score: localResult.nutrition_score,
              ingredient_safety_score: localResult.additive_score,
              processing_score: localResult.nova_score,
              overall: localResult.score,
            },
            harmful_ingredients: localDetectedAdditives,
            ingredient_warnings: localResult.detected_additives.map(a => ({
              ingredient: a.name,
              concern: a.concern || a.description,
              severity: a.risk === 'harmful' || a.risk === 'high' ? 'high' : a.risk === 'moderate' ? 'medium' : 'low'
            })),
            summary: localResult.summary,
            concerns: [],
            recommendations: [],
            personalizedWarnings: [],
            ai_ingredients: [],
            analyzed_at: new Date().toISOString(),
            personalized: !!userProfile,
            scoring_method: 'local_cached',
            _from_cache: true,
          }
          return NextResponse.json({ success: true, data: mergedResult, cached: true })
        }
      }

      // Check AI enhancement cache (7 days for AI)
      if (cached?.ai_analysis_json && cached?.ai_analyzed_at) {
        const ageMs = Date.now() - new Date(cached.ai_analyzed_at).getTime()
        if (ageMs < 7 * 24 * 60 * 60 * 1000) {
          // Merge cached AI enhancement with fresh local scoring
          const cachedAnalysis = cached.ai_analysis_json
          const mergedResult = {
            ...cachedAnalysis,
            health_score: localHealthScore,
            health_rating: localHealthRating,
            health_score_breakdown: {
              nutrition_score: localResult.nutrition_score,
              ingredient_safety_score: localResult.additive_score,
              processing_score: localResult.nova_score,
              overall: localResult.score,
            },
            harmful_ingredients: localDetectedAdditives.length > 0 ? localDetectedAdditives : cachedAnalysis.harmful_ingredients || [],
            ingredient_warnings: localResult.detected_additives.map(a => ({
              ingredient: a.name,
              concern: a.concern || a.description,
              severity: a.risk === 'harmful' || a.risk === 'high' ? 'high' : a.risk === 'moderate' ? 'medium' : 'low'
            })),
            summary: cachedAnalysis.summary || localResult.summary,
            concerns: cachedAnalysis.concerns || [],
            recommendations: cachedAnalysis.recommendations || [],
            personalizedWarnings: cachedAnalysis.personalizedWarnings || [],
            ai_ingredients: cachedAnalysis.ai_ingredients || [],
            analyzed_at: new Date().toISOString(),
            personalized: false,
            scoring_method: 'hybrid_local_cache',
          }
          return NextResponse.json({ success: true, data: mergedResult, cached: true })
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 4: Simple AI Summary Only (Groq - cheap/fast)
    // Replace expensive Gemini with lightweight Groq for simple summaries
    // ─────────────────────────────────────────────────────────────────────────
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
        additives_found: localResult.detected_additives.map(a => a.name),
        nova_group: localResult.nova_group,
        ingredients_text: product.ingredients_text || '',
        userProfile: profile ? {
          is_diabetic: profile.is_diabetic,
          has_bp: profile.has_bp,
          is_vegetarian: profile.is_vegetarian,
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
      console.warn('Groq failed/timed out, using local summary:', aiErr.message)
      aiFailed = true
    }

    // Build final response from local scoring + optional AI enhancement
    const analysis: any = {
      health_rating: localHealthRating,
      health_score: localHealthScore,
      health_score_breakdown: {
        nutrition_score: localResult.nutrition_score,
        ingredient_safety_score: localResult.additive_score,
        processing_score: localResult.nova_score,
        overall: localResult.score,
      },
      summary: (aiEnhancement?.summary && String(aiEnhancement.summary).trim()) || localResult.summary || `${product.name} scored ${Math.round(localResult.score * 10) / 10}/10 (${localResult.label}).`,
      detailed_breakdown: {
        calories: aiEnhancement?.detailed_breakdown?.calories || `(${localResult.breakdown.find(b => b.factor === 'calories')?.detail || 'see score'})`,
        protein: aiEnhancement?.detailed_breakdown?.protein || `(${localResult.breakdown.find(b => b.factor === 'protein')?.detail || 'see score'})`,
        sugar: aiEnhancement?.detailed_breakdown?.sugar || `(${localResult.breakdown.find(b => b.factor === 'sugar')?.detail || 'see score'})`,
        sodium: aiEnhancement?.detailed_breakdown?.sodium || `(${localResult.breakdown.find(b => b.factor === 'sodium')?.detail || 'see score'})`,
        fat: aiEnhancement?.detailed_breakdown?.fat || `(${localResult.breakdown.find(b => b.factor === 'sat_fat')?.detail || 'see score'})`,
        fiber: aiEnhancement?.detailed_breakdown?.fiber || `(${localResult.breakdown.find(b => b.factor === 'fiber')?.detail || 'see score'})`,
        processing_level: localResult.nova_label,
        overall_nutrient_density: localResult.score >= 7 ? 'high' : localResult.score >= 5 ? 'medium' : 'low',
      },
      safe_consumption: aiEnhancement?.safe_consumption || {
        amount: null,
        frequency: localResult.grade === 'A' ? 'Unlimited' : localResult.grade === 'B' ? 'Daily' : localResult.grade === 'C' ? 'Occasional' : 'Limit',
        notes: localResult.label,
        personalized_for_user: profile ? `Based on your profile` : null,
      },
      harmful_ingredients: localDetectedAdditives,
      ingredient_warnings: fullAnalysisWarnings.map(a => ({
        ingredient: a.name,
        concern: a.concern || a.description,
        severity: a.risk === 'harmful' || a.risk === 'high' ? 'high' : a.risk === 'moderate' ? 'medium' : 'low'
      })),
      positives: aiEnhancement?.positives || [`Local scoring: ${localResult.score}/10 (${localResult.grade})`],
      long_term_risks: aiEnhancement?.long_term_risks || (localDetectedAdditives.length > 0 ? 
        [`Contains ${localDetectedAdditives.length} potentially harmful additive(s)`] : 
        ['See score breakdown for details']),
      concerns: aiEnhancement?.concerns || [],
      recommendations: aiEnhancement?.recommendations || [],
      personalizedWarnings: aiEnhancement?.personalizedWarnings || [],
      ai_ingredients: aiEnhancement?.ai_ingredients || [],
      healthier_alternatives: aiEnhancement?.healthier_alternatives || [],
      fssai_compliance: aiEnhancement?.fssai_compliance || (localResult.score >= 7 ? 'compliant' : localResult.score >= 5 ? 'concern' : 'unknown'),
      diabetic_suitability: aiEnhancement?.diabetic_suitability || 
        (localResult.breakdown.some(b => b.factor === 'sugar' && b.impact === 'critical') ? 'avoid' : 
         localResult.breakdown.some(b => b.factor === 'sugar' && b.impact === 'negative') ? 'consume_with_caution' : 'suitable'),
      bp_suitability: aiEnhancement?.bp_suitability || 
        (localResult.breakdown.some(b => b.factor === 'sodium' && b.impact === 'critical') ? 'avoid' : 
         localResult.breakdown.some(b => b.factor === 'sodium' && b.impact === 'negative') ? 'consume_with_caution' : 'suitable'),
      child_suitability: aiEnhancement?.child_suitability || 
        (localDetectedAdditives.some(a => a.severity === 'high') ? 'avoid' : 'consume_with_caution'),
      pregnancy_suitability: aiEnhancement?.pregnancy_suitability || 'suitable',
      analyzed_at: new Date().toISOString(),
      personalized: !!profile,
      scoring_method: aiFailed ? 'local_only' : 'hybrid',
      data_quality: 'verified',
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PHASE 3: Find dynamic healthier alternatives from Open Food Facts
    // (non-blocking with timeout — the response ships even if OFF is slow)
    // ─────────────────────────────────────────────────────────────────────────
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
          products: altResult.alternatives.map(p => ({
            barcode: p.barcode,
            name: p.name,
            brand: p.brand,
            image_url: p.image_url,
            score: p.score,
            grade: p.grade,
            nutrition: p.nutrition_per_100g,
          })),
          why_better: altResult.why_better,
          current_score: altResult.current_score,
          current_grade: altResult.current_grade,
        }
        console.log(`🔄 Found ${altResult.alternatives.length} dynamic alternatives`)
      }
    } catch (altErr: any) {
      console.warn('Dynamic alternatives skipped:', altErr.message)
    }

    // Add dynamic alternatives to analysis
    if (dynamicAlternatives) {
      analysis.dynamic_alternatives = dynamicAlternatives
    }

    console.log(`✅ ${product.name} → ${analysis.health_rating} (${analysis.health_score}/10) | method: ${analysis.scoring_method}`)

    // Cache result for non-personalized barcode scans
    if (product.barcode && !profile) {
      const updateData: Record<string, any> = {
        last_scanned: new Date().toISOString(),
        // Always cache local scores
        health_score: localResult.score,
        health_grade: localResult.grade,
        nutrition_score: localResult.nutrition_score,
        additive_score: localResult.additive_score,
        nova_group: localResult.nova_group,
        cached_at: new Date().toISOString(),
      }

      // Also cache AI enhancement if available
      if (!aiFailed && aiEnhancement) {
        updateData.ai_health_rating = analysis.health_rating
        updateData.ai_analysis_json = aiEnhancement
        updateData.ai_analyzed_at = analysis.analyzed_at
      }

      try {
        await supabaseAdmin
          .from('products')
          .update(updateData)
          .eq('barcode', product.barcode)
      } catch (cacheUpdateErr: any) {
        console.warn('Cache update skipped:', cacheUpdateErr?.message || cacheUpdateErr)
      }
    }

    return NextResponse.json({ success: true, data: analysis, cached: false, ai_failed: aiFailed })

  } catch (err: any) {
    if (err instanceof GeminiError) {
      console.error(`GeminiError [${err.type}] status=${err.statusCode}:`, err.message)
      const isQuota = err.message.toLowerCase().includes('quota')
      switch (err.type) {
        case 'unavailable':
          return NextResponse.json(
            { success: false, error: 'Gemini AI is busy right now. Please wait 30 seconds and try again.', retryAfter: 30 },
            { status: 503 }
          )
        case 'rate_limit':
          return NextResponse.json(
            {
              success: false,
              error: isQuota
                ? 'Daily AI quota reached. Please try again tomorrow.'
                : 'Too many requests. Please wait a minute and try again.',
              rateLimited: true,
              retryAfter: isQuota ? 86400 : 60,
            },
            { status: 429 }
          )
        case 'timeout':
          return NextResponse.json(
            { success: false, error: 'AI analysis timed out. Please try again.' },
            { status: 504 }
          )
        case 'network':
          return NextResponse.json(
            { success: false, error: 'Network error reaching AI service. Please try again.' },
            { status: 502 }
          )
        default:
          return NextResponse.json(
            { success: false, error: 'AI service temporarily unavailable. Please try again.' },
            { status: 500 }
          )
      }
    }
    console.error('Analyze error:', err.message)
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

