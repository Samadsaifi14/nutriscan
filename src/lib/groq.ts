// HealthOX - Groq LLM for simple summaries
// Uses Groq API with free tier fallback to templates

export interface SummaryRequest {
  product_name: string
  score: number
  grade: string
  nutrition: {
    calories?: number
    protein?: number
    sugar?: number
    sodium?: number
  }
  additives_found: string[]
  nova_group: number
}

export interface SummaryResponse {
  summary: string
  recommendation: string
}

// Call Groq API directly using fetch
async function callGroq(prompt: string): Promise<string | null> {
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
        max_tokens: 200,
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

export async function generateSimpleSummary(req: SummaryRequest): Promise<SummaryResponse> {
  const apiKey = process.env.GROQ_API_KEY

  // If no API key, use template
  if (!apiKey) {
    return {
      summary: getTemplateSummary(req),
      recommendation: getTemplateRecommendation(req),
    }
  }

  const prompt = `You are a friendly food health explainer. Keep it SHORT and simple.

Product: ${req.product_name}
Health Score: ${req.score}/10 (Grade: ${req.grade})
Nutrition per 100g: ${req.nutrition.calories || '?'}kcal, ${req.nutrition.protein || '?'}g protein, ${req.nutrition.sugar || '?'}g sugar, ${req.nutrition.sodium || '?'}mg sodium
Harmful ingredients: ${req.additives_found.length > 0 ? req.additives_found.join(', ') : 'None detected'}
Processing level: ${req.nova_group === 1 ? 'Minimal' : req.nova_group === 2 ? 'Processed ingredients' : req.nova_group === 3 ? 'Processed' : 'Ultra-processed'}

Respond in exactly this JSON format:
{
  "summary": "1-2 sentence simple explanation for average person",
  "recommendation": "short suggestion like 'Great choice!', 'Eat occasionally', 'Better alternatives available'"
}`

  try {
    const content = await callGroq(prompt)
    
    if (content) {
      const parsed = JSON.parse(content)
      return {
        summary: parsed.summary || getTemplateSummary(req),
        recommendation: parsed.recommendation || getTemplateRecommendation(req),
      }
    }
  } catch (err) {
    console.warn('Groq failed, using template:', err)
  }

  // Fallback to template
  return {
    summary: getTemplateSummary(req),
    recommendation: getTemplateRecommendation(req),
  }
}

// Template fallback functions
function getTemplateSummary(req: SummaryRequest): string {
  if (req.grade === 'A') {
    return `${req.product_name} is a great choice! It's healthy with good nutrition.`
  } else if (req.grade === 'B') {
    return `${req.product_name} is a decent option. Enjoy in moderation.`
  } else if (req.grade === 'C') {
    return `${req.product_name} has some concerns. Consider alternatives.`
  } else {
    return `${req.product_name} is not recommended. Look for healthier options.`
  }
}

function getTemplateRecommendation(req: SummaryRequest): string {
  if (req.grade === 'A') return 'Great choice! Enjoy freely.'
  if (req.grade === 'B') return 'Good option. Eat occasionally.'
  if (req.grade === 'C') return 'Limit consumption.'
  return 'Better alternatives available.'
}