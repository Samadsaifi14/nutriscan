// Prompt builders for the analyze API route

export interface AnalyzeProduct {
  name: string
  brand?: string
  category?: string
  nutrition: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    sugar?: number | null
    sodium?: number | null
    fiber?: number | null
  }
  ingredients_text?: string
  additives?: string[]
  allergens?: string[]
}

export interface UserProfile {
  age?: number
  bmi?: number
  weight_goal?: string
  is_diabetic?: boolean
  has_bp?: boolean
  is_vegetarian?: boolean
  gender?: string
}

export interface LocalResult {
  score: number
  grade: string
  label: string
  nutrition_score: number
  additive_score: number
  nova_score: number
  nova_group: number
  nova_label: string
  breakdown: Array<{ factor: string; label: string; impact: string; detail: string; points: number }>
  detected_additives: Array<{ name: string; risk: string; aliases: string[]; concern?: string; description: string }>
  summary: string
}

export function buildAnalyzePrompt(product: AnalyzeProduct, userProfile?: UserProfile): string {
  const n = product.nutrition || {}
  const cal = n.calories ?? 0
  const pro = n.protein ?? 0
  const fat = n.fat ?? 0
  const sugar = n.sugar ?? null
  const sodium = n.sodium ?? null
  const fiber = n.fiber ?? null

  const flags = [
    cal > 450 ? 'HIGH_CAL' : cal < 200 ? 'LOW_CAL' : null,
    pro > 15 ? 'HIGH_PROTEIN' : pro < 3 ? 'LOW_PROTEIN' : null,
    sugar !== null ? (sugar > 15 ? 'HIGH_SUGAR' : sugar < 5 ? 'LOW_SUGAR' : null) : 'SUGAR_UNKNOWN',
    fat > 25 ? 'HIGH_FAT' : null,
    sodium !== null ? (sodium > 500 ? 'HIGH_SODIUM' : sodium < 120 ? 'LOW_SODIUM' : null) : 'SODIUM_UNKNOWN',
    fiber !== null && fiber > 5 ? 'HIGH_FIBER' : null,
  ].filter(Boolean).join(', ')

  const userSection = userProfile
    ? `USER: age=${userProfile.age || '?'}, BMI=${userProfile.bmi || '?'}, gender=${userProfile.gender || '?'}, goal=${userProfile.weight_goal || 'maintain'}, diabetic=${userProfile.is_diabetic ? 'YES' : 'no'}, highBP=${userProfile.has_bp ? 'YES' : 'no'}, vegetarian=${userProfile.is_vegetarian ? 'yes' : 'no'}`
    : `USER: no profile — use general Indian adult guidelines`

  return `You are a certified Indian nutritionist and food safety expert. Analyze this packaged food against FSSAI, WHO, and ICMR guidelines.

${userSection}

PRODUCT: ${product.name} | Brand: ${product.brand || 'Unknown'} | Category: ${product.category || 'Packaged food'}

NUTRITION per 100g:
cal=${cal}kcal, protein=${pro}g, carbs=${n.carbs ?? 0}g, fat=${fat}g, sugar=${sugar ?? 'NL'}g, sodium=${sodium ?? 'NL'}mg, fiber=${fiber ?? 'NL'}g
FLAGS: ${flags || 'none'}

INGREDIENTS: ${product.ingredients_text || 'Not provided'}
ADDITIVES: ${(product.additives || []).join(', ') || 'none'}
ALLERGENS: ${(product.allergens || []).join(', ') || 'none'}

SCORING RULES (strictly follow):
- 8.5–10: Plain nuts/seeds/oats/dal/legumes/whole grain, protein>15 AND sugar<5 AND sodium<200
- 7–8.4: Multi-grain, roasted snacks, good protein + low sugar + low sodium
- 5.5–6.9: One concern (moderate sodium OR sugar, not both)
- 4–5.4: Multiple concerns OR artificial additives OR high sodium/sugar
- 2.5–3.9: Very high sugar>25g OR sodium>800mg OR trans fats OR multiple harmful additives
- 1–2.4: Ultra-processed, nutritionally empty, candy/soda/fried
- Trans fat present → max score 4.0
- Sugar>20g → max score 5.0
- Sodium>800mg → max score 4.5
- Chips/instant noodles/cream biscuits → score must be 2.5–4.0

HARMFUL INGREDIENTS to detect (flag only if actually present in ingredients text):
MSG/E621, TBHQ/E319, BHA/E320, BHT/E321, Sodium Benzoate/E211, Carrageenan/E407, Sodium Nitrite/E250, Tartrazine/E102, Sunset Yellow/E110, Carmoisine/E122, Ponceau 4R/E124, Allura Red/E129, HFCS, Partially Hydrogenated Oils/Trans Fat, Acesulfame K/E950, Aspartame/E951, Sucralose/E955, Refined Palm Oil, Maida/Refined Wheat Flour

For each harmful ingredient found, include: exact name, concern (1 sentence, scientific basis), severity (high/medium/low), source org (WHO/FSSAI/IARC/EFSA), real source URL, global safe limit, amount in product, personalized limit for this user, % of daily limit.

PERSONALIZATION adjustments for safe limits:
- Age<18: reduce adult limit by 50%; Age>60: reduce by 25%
- BMI>30: reduce sugar+fat limits 30%; BMI 25-30: reduce sugar 20%
- Diabetic: sugar from product <5g/serving, sodium halved
- High BP: sodium from product <200mg/serving

HEALTHIER ALTERNATIVES: 4–5 specific Indian substitutes (branded or homemade), directly replacing this product category, with clear nutritional reason.

RETURN ONLY this JSON (no markdown, no code fences):
{
  "health_rating": "healthy"|"moderate"|"unhealthy",
  "health_score": <1.0–10.0 decimal, NOT a generic 3.5>,
  "health_score_breakdown": {
    "nutrition_score": <1–10>,
    "ingredient_safety_score": <1–10>,
    "processing_score": <1–10>,
    "overall": <weighted average>
  },
  "summary": "<2–3 sentences mentioning the product name, for an Indian consumer>",
  "detailed_breakdown": {
    "calories": "<comment>",
    "protein": "<comment>",
    "sugar": "<comment>",
    "sodium": "<comment>",
    "fat": "<comment>",
    "fiber": "<comment>",
    "processing_level": "minimally_processed"|"moderately_processed"|"ultra_processed",
    "overall_nutrient_density": "high"|"medium"|"low"
  },
  "safe_consumption": {
    "amount": "<e.g. 1 small pack (26g)>",
    "frequency": "<e.g. Max once a week>",
    "notes": "<or null>",
    "personalized_for_user": "<specific advice using their BMI/age/conditions or null>"
  },
  "harmful_ingredients": [
    {
      "name": "<exact label name>",
      "also_known_as": ["<aliases>"],
      "found_in_product": true,
      "concern": "<1–2 sentences, science-backed>",
      "severity": "high"|"medium"|"low",
      "scientific_source": "<org + year>",
      "source_url": "<real URL>",
      "global_safe_limit": "<WHO/FSSAI limit>",
      "amount_in_this_product": "<e.g. 680mg per 100g>",
      "personalized_safe_limit": "<e.g. max 1 serving/day for your BMI>",
      "percentage_of_daily_limit": "<e.g. 34% of daily limit>"
    }
  ],
  "ingredient_warnings": [
    { "ingredient": "<name>", "concern": "<concern>", "severity": "high"|"medium"|"low" }
  ],
  "positives": ["<specific positive about THIS product>"],
  "long_term_risks": ["<3–5 specific evidence-based risks from regular consumption of THIS product>"],
  "healthier_alternatives": [
    {
      "name": "<specific Indian food or brand>",
      "reason": "<nutritional reason>",
      "availability": "widely_available"|"supermarket"|"homemade",
      "type": "branded"|"homemade"|"whole_food"
    }
  ],
  "fssai_compliance": "compliant"|"concern"|"unknown",
  "diabetic_suitability": "suitable"|"consume_with_caution"|"avoid",
  "bp_suitability": "suitable"|"consume_with_caution"|"avoid",
  "child_suitability": "suitable"|"consume_with_caution"|"avoid",
  "pregnancy_suitability": "suitable"|"consume_with_caution"|"avoid"
}`
}

export function buildEnhancementPrompt(product: AnalyzeProduct, userProfile: UserProfile | undefined, localResult: LocalResult): string {
  const userSection = userProfile
    ? `User profile: ${userProfile.age ? `age ${userProfile.age}, ` : ''}${userProfile.bmi ? `BMI ${userProfile.bmi}, ` : ''}${userProfile.is_diabetic ? 'diabetic, ' : ''}${userProfile.has_bp ? 'high BP, ' : ''}`
    : `General adult profile`

  const additivesList = localResult.detected_additives
    .map((a: any) => `${a.name} (${a.risk} risk)`)
    .join(', ') || 'None detected'

  return `Enhance analysis for "${product.name}".

LOCAL SCORE ALREADY COMPUTED: ${localResult.score}/10 (Grade: ${localResult.grade})
NOVA Classification: ${localResult.nova_group} (${localResult.nova_label})
Detected Additives: ${additivesList}

${userSection}

Generate ONLY these fields (JSON only, no markdown):
{
  "summary": "2-3 sentence consumer-friendly summary",
  "positives": ["1-3 specific positives about this product"],
  "long_term_risks": ["2-4 evidence-based risks"],
  "healthier_alternatives": [
    { "name": "Indian food/brand", "reason": "nutritional reason", "availability": "widely_available|supermarket|homemade", "type": "branded|homemade|whole_food" }
  ],
  "detailed_breakdown": {
    "calories": "<1 sentence>",
    "protein": "<1 sentence>",
    "sugar": "<1 sentence>",
    "sodium": "<1 sentence>",
    "fat": "<1 sentence>",
    "fiber": "<1 sentence>"
  },
  "safe_consumption": {
    "amount": "<specific amount>",
    "frequency": "<e.g. Max twice a week>",
    "notes": "<additional notes>"
  }
}`
}
