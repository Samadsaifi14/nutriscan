import * as dotenv from 'dotenv'
dotenv.config({ path: './.env.local' })

import { createClient } from '@supabase/supabase-js'
 
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase     = createClient(SUPABASE_URL, SUPABASE_KEY)
 
// ── Top Indian packaged food categories to scrape from OFF ──────────────────
const INDIAN_CATEGORIES = [
  'chips-and-crisps',
  'biscuits-and-cakes',
  'instant-noodles',
  'breakfast-cereals',
  'chocolates',
  'namkeen',
  'health-drinks',
  'juices',
  'dairy-products',
  'snacks',
  'sweets',
  'sauces-and-condiments',
  'masala-and-spices',
  'instant-foods',
  'energy-drinks',
  'packaged-water',
  'protein-bars',
  'bread',
  'cookies',
  'popcorn',
]
 
function parseNum(val: any): number | null {
  if (val === undefined || val === null || val === '') return null
  const n = parseFloat(String(val))
  return isNaN(n) ? null : Math.round(n * 10) / 10
}
 
function parseSodiumFromOFF(nutriments: any): number | null {
  const sodium = nutriments?.['sodium_100g']
  if (sodium != null) return Math.round(parseFloat(sodium) * 1000)
  const salt = nutriments?.['salt_100g']
  if (salt != null) return Math.round(parseFloat(salt) * 400)
  return null
}
 
// ── Fetch products from Open Food Facts API by category + country ───────────
async function fetchOFFCategory(category: string, page = 1): Promise<any[]> {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl` +
      `?action=process` +
      `&tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}` +
      `&tagtype_1=countries&tag_contains_1=contains&tag_1=India` +
      `&json=1&page_size=100&page=${page}` +
      `&fields=code,product_name,brands,categories_tags,image_front_url,` +
      `nutriments,ingredients_text,allergens_tags,additives_tags,serving_quantity`
 
    const res = await fetch(url, {
      headers: { 'User-Agent': 'HealthOX/1.0 (healthox@example.com)' },
    })
 
    if (!res.ok) return []
    const data = await res.json()
    return data.products || []
  } catch (e: any) {
    console.log(`OFF fetch error for ${category}:`, e.message)
    return []
  }
}
 
// ── Transform OFF product to our DB schema ──────────────────────────────────
function transformOFFProduct(p: any): any | null {
  const barcode = (p.code || '').trim()
  const name    = (p.product_name || '').trim()
  if (!barcode || barcode.length < 6 || !name) return null
 
  const n = p.nutriments || {}
  return {
    barcode,
    name,
    brand:             p.brands || null,
    category:          p.categories_tags?.[0]?.replace('en:', '') || null,
    country_of_origin: 'India',
    image_url:         p.image_front_url || null,
    calories_per_100g: parseNum(n['energy-kcal_100g'] ?? n['energy-kcal']),
    protein_per_100g:  parseNum(n['proteins_100g']),
    carbs_per_100g:    parseNum(n['carbohydrates_100g']),
    fat_per_100g:      parseNum(n['fat_100g']),
    sugar_per_100g:    parseNum(n['sugars_100g']),
    sodium_per_100g:   parseSodiumFromOFF(n),
    fiber_per_100g:    parseNum(n['fiber_100g']),
    serving_size_g:    parseNum(p.serving_quantity),
    ingredients_text:  p.ingredients_text || null,
    allergens:         (p.allergens_tags || []).map((t: string) => t.replace('en:', '').replace(/-/g, ' ')),
    additives:         (p.additives_tags || []).map((t: string) => t.replace('en:', '')),
    source:            'open_food_facts',
  }
}
 
// ── Upsert a batch into Supabase ─────────────────────────────────────────────
async function upsertBatch(products: any[]) {
  if (!products.length) return
  const { error } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'barcode', ignoreDuplicates: true })
  if (error) console.error('Upsert error:', error.message)
}
 
// ── Main scraper ─────────────────────────────────────────────────────────────
async function main() {
  let totalImported = 0
 
  console.log('Starting Indian product scraper...')
  console.log(`Scraping ${INDIAN_CATEGORIES.length} categories from Open Food Facts\n`)
 
  for (const category of INDIAN_CATEGORIES) {
    console.log(`\n── Category: ${category}`)
    let categoryTotal = 0
 
    for (let page = 1; page <= 5; page++) {
      const products = await fetchOFFCategory(category, page)
      if (!products.length) break
 
      const transformed = products
        .map(transformOFFProduct)
        .filter(Boolean) as any[]
 
      if (transformed.length > 0) {
        await upsertBatch(transformed)
        categoryTotal   += transformed.length
        totalImported   += transformed.length
        console.log(`  Page ${page}: ${transformed.length} products imported (${products.length} fetched)`)
      }
 
      // Polite delay between pages
      await new Promise(r => setTimeout(r, 500))
 
      if (products.length < 100) break
    }
 
    console.log(`  Total for ${category}: ${categoryTotal}`)
    // Delay between categories
    await new Promise(r => setTimeout(r, 1000))
  }
 
  console.log('\n═══════════════════════════════════════════════════')
  console.log(`SCRAPING COMPLETE`)
  console.log(`Total products imported: ${totalImported.toLocaleString()}`)
  console.log('═══════════════════════════════════════════════════')
  console.log('\nNext step: Run the OFF bulk import for even more coverage.')
  console.log('Download: https://world.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz')
}
 
main().catch(console.error)