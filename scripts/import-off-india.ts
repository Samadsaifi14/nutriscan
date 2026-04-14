import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import * as fs from 'fs'
import * as readline from 'readline'
import { createClient } from '@supabase/supabase-js'
 
// Load env manually for script context
const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY!
 
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env')
  process.exit(1)
}
 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
 
function parseNum(val: string | undefined): number | null {
  if (!val || val.trim() === '') return null
  const n = parseFloat(val)
  return isNaN(n) ? null : Math.round(n * 10) / 10
}
 
function parseSodium(sodiumVal: string | undefined, saltVal: string | undefined): number | null {
  if (sodiumVal && sodiumVal.trim()) {
    const n = parseFloat(sodiumVal)
    if (!isNaN(n)) return Math.round(n * 1000) // g → mg
  }
  if (saltVal && saltVal.trim()) {
    const s = parseFloat(saltVal)
    if (!isNaN(s)) return Math.round(s * 400) // salt g → sodium mg
  }
  return null
}
 
async function batchUpsert(rows: any[]) {
  const { error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'barcode', ignoreDuplicates: true })
  if (error) console.error('Batch upsert error:', error.message)
}
 
async function main() {
  const CSV_PATH = 'C:/Users/hp/Desktop/nutriscan/off_full.csv'
  if (!fs.existsSync(CSV_PATH)) {
    console.error('off_full.csv not found in project root. Download and extract it first.')
    process.exit(1)
  }
 
  console.log('Starting OFF India import...')
 
  const rl = readline.createInterface({
    input: fs.createReadStream(CSV_PATH, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })
 
  let headers: string[] = []
  let batch: any[]      = []
  let total             = 0
  let imported          = 0
  let lineNum           = 0
  const BATCH_SIZE      = 100
 
  for await (const line of rl) {
    lineNum++
 
    if (lineNum === 1) {
      headers = line.split('\t')
      continue
    }
 
    const cols = line.split('\t')
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = cols[i] || '' })
 
    total++
 
    // Filter: India only
    const countries = (row['countries_en'] || '').toLowerCase()
    const ctags     = (row['countries_tags'] || '').toLowerCase()
    if (!countries.includes('india') && !ctags.includes('en:india')) continue
 
    // Must have a barcode and name
    const barcode = (row['code'] || '').trim()
    const name    = (row['product_name'] || row['product_name_en'] || '').trim()
    if (!barcode || barcode.length < 6 || !name) continue
 
    const product = {
      barcode,
      name,
      brand:             row['brands']              || null,
      category:          row['categories_en']       || null,
      country_of_origin: 'India',
      image_url:         row['image_front_url']     || null,
      calories_per_100g: parseNum(row['energy-kcal_100g'] || row['energy-kcal']),
      protein_per_100g:  parseNum(row['proteins_100g']),
      carbs_per_100g:    parseNum(row['carbohydrates_100g']),
      fat_per_100g:      parseNum(row['fat_100g']),
      sugar_per_100g:    parseNum(row['sugars_100g']),
      sodium_per_100g:   parseSodium(row['sodium_100g'], row['salt_100g']),
      fiber_per_100g:    parseNum(row['fiber_100g']),
      serving_size_g:    parseNum(row['serving_quantity']),
      ingredients_text:  row['ingredients_text'] || null,
      allergens:         row['allergens_tags']
        ? row['allergens_tags'].split(',').map((t: string) => t.replace('en:', '').trim()).filter(Boolean)
        : [],
      additives:         row['additives_tags']
        ? row['additives_tags'].split(',').map((t: string) => t.replace('en:', '').trim()).filter(Boolean)
        : [],
      source: 'open_food_facts',
    }
 
    batch.push(product)
    imported++
 
    if (batch.length >= BATCH_SIZE) {
      await batchUpsert(batch)
      console.log(`Imported ${imported} Indian products so far...`)
      batch = []
      // Small delay to not hammer Supabase
      await new Promise(r => setTimeout(r, 200))
    }
 
    if (lineNum % 100000 === 0) {
      console.log(`Processed ${lineNum.toLocaleString()} total lines, ${imported} Indian products found`)
    }
  }
 
  // Final batch
  if (batch.length > 0) await batchUpsert(batch)
 
  console.log('═══════════════════════════════════════')
  console.log(`DONE. Total lines: ${total.toLocaleString()}`)
  console.log(`Indian products imported: ${imported.toLocaleString()}`)
  console.log('═══════════════════════════════════════')
}
 
main().catch(console.error)