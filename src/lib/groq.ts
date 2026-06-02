// BioYou - Groq LLM for unified food analysis
// Combines summary + ingredient analysis + personalized warnings in one call

export interface UnifiedAnalysisRequest {
  product_name: string
  score: number
  grade: string
  nutrition: {
    calories?: number
    protein?: number
    sugar?: number
    sodium?: number
    carbs?: number
    fat?: number
    saturated_fat?: number
    fiber?: number
  }
  additives_found: string[]
  nova_group: number
  ingredients_text: string
  userProfile?: {
    is_diabetic?: boolean
    has_bp?: boolean
    has_heart_disease?: boolean
    has_cholesterol?: boolean
    is_vegetarian?: boolean
    is_vegan?: boolean
    is_jain?: boolean
    allergies?: string[]
  }
}

export interface UnifiedAnalysisResponse {
  summary: string
  recommendation: string
  concerns: string[]
  positives: string[]
  recommendations: string[]
  personalizedWarnings: string[]
  long_term_risks: string[]
  ingredients: Array<{
    ingredient: string
    status: 'safe' | 'concern' | 'harmful'
    concern?: string
    recommendation?: string
  }>
}

// Call Groq API directly using fetch
async function callGroq(prompt: string, maxTokens = 2000): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      console.error('Groq API error:', response.status, await response.text())
      return null
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || null
  } catch (err) {
    console.error('Groq fetch error:', err)
    return null
  }
}

export async function generateUnifiedAnalysis(req: UnifiedAnalysisRequest): Promise<UnifiedAnalysisResponse> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return getTemplateUnified(req)
  }

  const profileContext = buildProfileContext(req.userProfile)

  const prompt = `You are a friendly food health explainer and safety expert. Analyze this product in detail.

${profileContext}

Product: ${req.product_name}
Health Score: ${req.score}/10 (Grade: ${req.grade})
Nutrition per 100g: ${req.nutrition.calories || '?'}kcal, ${req.nutrition.protein || '?'}g protein, ${req.nutrition.carbs || '?'}g carbs, ${req.nutrition.fat || '?'}g fat, ${req.nutrition.sugar || '?'}g sugar, ${req.nutrition.sodium || '?'}mg sodium, ${req.nutrition.fiber || '?'}g fiber
Harmful ingredients detected: ${req.additives_found.length > 0 ? req.additives_found.join(', ') : 'None detected'}
Processing level: ${req.nova_group === 1 ? 'Minimal' : req.nova_group === 2 ? 'Processed ingredients' : req.nova_group === 3 ? 'Processed' : 'Ultra-processed'}
Ingredients list: ${req.ingredients_text || 'Not available'}

Respond in exactly this JSON format (no markdown, no code fences):
{
  "summary": "2-3 sentence simple explanation for average person including the product name",
  "recommendation": "short suggestion like 'Great choice!', 'Eat occasionally', 'Better alternatives available'",
  "concerns": ["list of health concerns about this product"],
  "positives": ["list of positive aspects"],
  "recommendations": ["actionable recommendations for the consumer"],
  "personalizedWarnings": ["warnings personalized to user's health conditions if applicable, otherwise empty array"],
  "long_term_risks": ["evidence-based long term risks from regular consumption"],
  "ingredients": [
    {
      "ingredient": "ingredient name",
      "status": "safe" or "concern" or "harmful",
      "concern": "specific concern if any",
      "recommendation": "recommendation if any"
    }
  ]
}`

  try {
    const content = await callGroq(prompt, 2000)

    if (content) {
      const parsed = JSON.parse(content)
      return {
        summary: parsed.summary || getTemplateUnified(req).summary,
        recommendation: parsed.recommendation || '',
        concerns: parsed.concerns || [],
        positives: parsed.positives || [],
        recommendations: parsed.recommendations || [],
        personalizedWarnings: parsed.personalizedWarnings || [],
        long_term_risks: parsed.long_term_risks || [],
        ingredients: parsed.ingredients || [],
      }
    }
  } catch (err) {
    console.warn('Groq unified analysis failed, using template:', err)
  }

  return getTemplateUnified(req)
}

function buildProfileContext(profile?: UnifiedAnalysisRequest['userProfile']): string {
  if (!profile) return ''
  const conditions: string[] = []
  if (profile.is_diabetic) conditions.push('- User has Diabetes - flag high sugar/sucrose products')
  if (profile.has_bp) conditions.push('- User has High Blood Pressure - flag high sodium products')
  if (profile.has_heart_disease) conditions.push('- User has Heart Disease - flag high saturated fat, trans fats')
  if (profile.has_cholesterol) conditions.push('- User has High Cholesterol - flag high fat content')
  if (profile.is_vegetarian) conditions.push('- User is Vegetarian - note any non-vegetarian ingredients')
  if (profile.is_vegan) conditions.push('- User is Vegan - flag all animal-derived ingredients')
  if (profile.is_jain) conditions.push('- User follows Jain diet - avoid root vegetables, fermented items')
  if (profile.allergies && profile.allergies.length > 0) {
    conditions.push(`- User has allergies: ${profile.allergies.join(', ')} - flag these ingredients`)
  }
  return conditions.length > 0
    ? `USER PROFILE (Personalize warnings based on):\n${conditions.join('\n')}\n`
    : ''
}

function getTemplateUnified(req: UnifiedAnalysisRequest): UnifiedAnalysisResponse {
  const grade = req.grade
  const name = req.product_name

  let summary: string
  let recommendation: string
  if (grade === 'A') {
    summary = `${name} is a great choice! It's healthy with good nutrition.`
    recommendation = 'Great choice! Enjoy freely.'
  } else if (grade === 'B') {
    summary = `${name} is a decent option. Enjoy in moderation.`
    recommendation = 'Good option. Eat occasionally.'
  } else if (grade === 'C') {
    summary = `${name} has some concerns. Consider alternatives.`
    recommendation = 'Limit consumption.'
  } else {
    summary = `${name} is not recommended. Look for healthier options.`
    recommendation = 'Better alternatives available.'
  }

  const positives = req.additives_found.length === 0
    ? ['No harmful additives detected']
    : ['Scored based on ingredient safety analysis']

  const long_term_risks = req.additives_found.length > 0
    ? [`Contains ${req.additives_found.length} potentially harmful additive(s)`]
    : ['See score breakdown for details']

  return {
    summary,
    recommendation,
    concerns: [],
    positives,
    recommendations: [recommendation],
    personalizedWarnings: [],
    long_term_risks,
    ingredients: [],
  }
}