// lib/groq-ai.ts
// Groq AI client for intelligent ingredient analysis

import { createClient } from 'groq'

// Initialize Groq client with API key
const groqApiKey = process.env.GROQ_API_KEY

if (!groqApiKey) {
  console.warn('GROQ_API_KEY not found in environment variables')
}

export interface IngredientAnalysis {
  ingredient: string
  status: 'safe' | 'concern' | 'harmful'
  concern?: string
  recommendation?: string
}

export interface ProductAnalysis {
  overallScore: number
  summary: string
  concerns: string[]
  positives: string[]
  recommendations: string[]
  personalizedWarnings: string[]
  ingredients: IngredientAnalysis[]
}

export interface UserProfile {
  is_diabetic?: boolean
  has_bp?: boolean
  has_heart_disease?: boolean
  has_cholesterol?: boolean
  is_vegetarian?: boolean
  is_vegan?: boolean
  is_jain?: boolean
  allergies?: string[]
}

// Build prompt based on user profile
function buildAnalysisPrompt(ingredients: string, nutrition: any, profile: UserProfile): string {
  const profileContext = buildProfileContext(profile)
  
  return `You are a food safety and nutrition expert AI assistant. Analyze the following product for health and safety.

${profileContext}

PRODUCT INGREDIENTS:
${ingredients}

NUTRITION INFORMATION (per 100g):
${nutrition ? `
- Calories: ${nutrition.calories || 'N/A'} kcal
- Protein: ${nutrition.protein || 'N/A'}g
- Carbs: ${nutrition.carbs || 'N/A'}g
- Fat: ${nutrition.fat || 'N/A'}g
- Sugar: ${nutrition.sugar || 'N/A'}g
- Sodium: ${nutrition.sodium || 'N/A'}mg
` : 'Not available'}

Provide your analysis in the following JSON format:
{
  "overallScore": <number 1-10>,
  "summary": "<2-3 sentence summary>",
  "concerns": ["<concern 1>", "<concern 2>", ...],
  "positives": ["<positive 1>", ...],
  "recommendations": ["<recommendation 1>", ...],
  "personalizedWarnings": ["<warning for user's specific conditions>", ...],
  "ingredients": [
    {
      "ingredient": "<ingredient name>",
      "status": "safe|concern|harmful",
      "concern": "<specific concern if any>",
      "recommendation": "<recommendation if any>"
    }
  ]
}

Respond ONLY with valid JSON, no additional text.`
}

function buildProfileContext(profile: UserProfile): string {
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

// Main analysis function
export async function analyzeProductWithAI(
  ingredients: string,
  nutrition: any,
  profile?: UserProfile
): Promise<ProductAnalysis | null> {
  if (!groqApiKey) {
    console.error('GROQ_API_KEY not configured')
    return null
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Free tier model
        messages: [
          {
            role: 'user',
            content: buildAnalysisPrompt(ingredients, nutrition, profile || {})
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Groq API error:', error)
      return null
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('No content in Groq response')
      return null
    }

    // Parse JSON response
    const parsed = JSON.parse(content)
    
    return {
      overallScore: parsed.overallScore || 5,
      summary: parsed.summary || '',
      concerns: parsed.concerns || [],
      positives: parsed.positives || [],
      recommendations: parsed.recommendations || [],
      personalizedWarnings: parsed.personalizedWarnings || [],
      ingredients: parsed.ingredients || []
    }
  } catch (error) {
    console.error('Groq analysis error:', error)
    return null
  }
}

// Quick ingredient check (simpler version)
export async function quickIngredientCheck(ingredients: string[]): Promise<Map<string, string>> {
  if (!groqApiKey) {
    return new Map()
  }

  const ingredientList = ingredients.join(', ')
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: `For each ingredient in this list, classify as "safe" or "harmful": ${ingredientList}. Response as JSON array like [{"ingredient": "name", "status": "safe|harmful"}]`
          }
        ],
        temperature: 0.2,
        max_tokens: 500
      })
    })

    if (!response.ok) return new Map()

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    const parsed = JSON.parse(content)
    
    const result = new Map<string, string>()
    for (const item of parsed) {
      result.set(item.ingredient.toLowerCase(), item.status)
    }
    
    return result
  } catch {
    return new Map()
  }
}