// lib/groq-ai.ts
// Groq AI quick ingredient check (lightweight, kept for analyze-ai GET endpoint)

const groqApiKey = process.env.GROQ_API_KEY

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