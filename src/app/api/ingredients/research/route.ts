import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { enforceRateLimit } from '@/lib/api-auth'

export const runtime = 'nodejs'

const RequestSchema = z.object({
  ingredients: z.array(z.string().trim().min(1).max(120)).min(1).max(8),
})

function normalizedLookupName(labelIngredient: string) {
  return labelIngredient
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(?:permitted|natural|artificial|added|food|class\s*[ivx]+)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
}

async function researchIngredient(labelIngredient: string) {
  const query = normalizedLookupName(labelIngredient)
  if (query.length < 2) return null

  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/description/JSON`
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'NutriScan/1.0 ingredient identity lookup' },
      next: { revalidate: 7 * 24 * 60 * 60 },
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) return null
    const body = await response.json()
    const information = body?.InformationList?.Information?.find((entry: any) => entry?.Description)
    const identity = body?.InformationList?.Information?.find((entry: any) => entry?.Title)
    if (!information?.Description) return null
    return {
      ingredient: labelIngredient,
      matchedName: identity?.Title || information.Title || query,
      description: String(information.Description).slice(0, 700),
      sourceName: information.DescriptionSourceName ? `NIH PubChem · ${information.DescriptionSourceName}` : 'NIH PubChem',
      sourceUrl: information.DescriptionURL || `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(query)}`,
      conclusion: 'identity_only' as const,
    }
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const rate = await enforceRateLimit('anonymous', 'ingredient_research', req)
  if ('response' in rate) return rate.response

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 })
  }
  const parsed = RequestSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Send 1–8 ingredient names.' }, { status: 400 })
  }

  const unique = [...new Set(parsed.data.ingredients.map((ingredient) => ingredient.trim()))]
  const results = (await Promise.all(unique.map(researchIngredient))).filter(Boolean)
  return NextResponse.json({
    success: true,
    results,
    note: 'PubChem confirms chemical identity and use; it does not by itself determine whether the amount in this food is harmful.',
  }, { headers: { 'Cache-Control': 'private, max-age=300' } })
}
