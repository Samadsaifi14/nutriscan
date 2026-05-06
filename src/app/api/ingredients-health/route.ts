import { NextResponse } from 'next/server'

const HARMFUL_KEYWORDS: string[] = [
  'sodium benzoate', 'sodium nitrite', 'sodium nitrate', 'bha', 'bht', 'tbhq',
  'tartrazine', 'sunset yellow', 'allura red', 'aspartame', 'acesulfame', 'sucralose',
  'carrageenan', 'polysorbate', 'msg', 'high fructose corn syrup', 'maltodextrin',
  'trans fat', 'hydrogenated', 'refined flour', 'palm oil'
]

export async function GET(req: any) {
  const url = new URL(req.url)
  const raw = url.searchParams.get('ingredients') ?? ''
  const items = raw.split(',').map(s => s.trim()).filter(Boolean)
  const results = items.map(name => {
    const lower = name.toLowerCase()
    const flagged = HARMFUL_KEYWORDS.some(k => lower.includes(k))
    return {
      name,
      status: flagged ? 'harmful' : 'safe',
      reason: flagged ? 'Contains common unhealthy additives' : 'Likely safe'
    }
  })
  return NextResponse.json({ success: true, data: results })
}
