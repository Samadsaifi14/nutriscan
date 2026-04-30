// NutriScan - Simple AI-free summaries using templates
// Completely free - no API calls needed
// Uses rule-based templates for user-friendly explanations

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

export async function generateSimpleSummary(req: SummaryRequest): Promise<SummaryResponse> {
  // Completely free - template-based summaries
  // No API calls needed
  return {
    summary: getTemplateSummary(req),
    recommendation: getTemplateRecommendation(req),
  }
}

// Fallback templates when no AI available
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