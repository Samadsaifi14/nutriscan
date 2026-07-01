// lib/barcode-intelligence.ts
// Indian barcode detection and brand identification

export interface BarcodeAnalysis {
  isIndian: boolean
  isKnownBrand: boolean
  brand: string | null
  category: string | null
  searchHint: string
}

export const INDIAN_PREFIXES = ["890"]

export const KNOWN_INDIAN_BRANDS: Record<string, string> = {
  // Top Tier Brands (Major National)
  "8901058": "Britannia",
  "8901063": "Parle",
  "8901207": "ITC (Sunfeast/Bingo)",
  "8901030": "Nestlé India",
  "8901725": "Haldiram's",
  "8906002": "Patanjali",
  "8901764": "Amul",
  "8901088": "Dabur",
  "8901396": "Marico (Saffola)",
  "8904109": "Too Yumm",
  "8901719": "MTR Foods",
  "8904214": "Tata Consumer",
  "8901600": "HUL (Knorr/Kissan)",
  "8901043": "Cadbury India",
  "8901233": "PepsiCo India (Lays/Kurkure)",
  "8901491": "McCain India",
  
  // Regional & Category Leaders
  "8901029": "Bajaj",
  "8901113": "Kellogg's India",
  "8901124": "General Mills India",
  "8901302": "Kissan",
  "8901047": "Knorr",
  "8901089": "Dabur Honey",
  "8901223": "Bingo!",
  "8901407": "Patanjali Ayurveda",
  "8901119": "Mohanlal Chikki",
  "8901087": "Gulab",
  "8901111": "Lijjat",
  "8901184": "Madhur",
  "8901095": "Kohinoor",
  "8901310": "Veeba",
  "8901066": "Nandini",
  "8901157": "Kwality",
  "8901413": "Frooti",
  "8901451": "Maaza",
  "8901076": "Citra",
  "8901354": "Paper Boat",
  "8901073": "Bail Kolhu",
  "8901226": "Aashirvaad",
  "8901023": "Annapurna",
  "8901417": "Fortune",
  "8901118": "Madhura",
  "8901332": "Saffola",
  "8901152": "Id",
  "8901028": "MTR",
  "8901371": "Bhelpul",
  "8901061": "Patanjali",
  "8901243": "B一会",
  "8901081": "Rajah",
  "8901091": "MTR Ready to Eat",
  "8901065": "Priya",
  "8901415": "Amrutanjan",
  "8901259": "Modern",
  "8901277": "Parle Premium",
  "8901069": "Britannia Bakery",
  "8901109": "Lakers",
  "8901333": "Sundrop",
  "8901222": "Raw Pressery",
  "8901419": "True Elements",
  "8901358": "24 Mantra",
  "8901249": "Sresta",
  "8901375": "Organic India",
  "8901099": "Everest",
  "8901101": "Catch",
  "8901314": "Dish Dish",
  "8901234": "Kitchen of India",
  "8901398": "Aromatic",
}

export const BRAND_CATEGORIES: Record<string, string> = {
  "Britannia": "biscuits",
  "Parle": "biscuits",
  "ITC (Sunfeast/Bingo)": "biscuits",
  "Nestlé India": "noodles",
  "Haldiram's": "namkeen",
  "Patanjali": "health_drink",
  "Amul": "dairy",
  "Dabur": "health_drink",
  "Marico (Saffola)": "cooking_oil",
  "Too Yumm": "chips",
  "MTR Foods": "rice",
  "Tata Consumer": "tea",
  "HUL (Knorr/Kissan)": "sauce",
  "Cadbury India": "chocolate",
  "PepsiCo India (Lays/Kurkure)": "chips",
  "McCain India": "pizza",
  "Bajaj": "namkeen",
  "Kellogg's India": "cereal",
  "General Mills India": "cereal",
  "Kissan": "jam",
  "Knorr": "soup",
  "Bingo!": "chips",
  "Patanjali Ayurveda": "health_drink",
  "Mohanlal Chikki": "chocolate",
  "Gulab": "pickle",
  "Lijjat": "namkeen",
  "Madhur": "sugar",
  "Kohinoor": "rice",
  "Veeba": "sauce",
  "Nandini": "dairy",
  "Kwality": "dairy",
  "Frooti": "juice",
  "Maaza": "juice",
  "Citra": "juice",
  "Paper Boat": "juice",
  "Bail Kolhu": "cooking_oil",
  "Aashirvaad": "atta",
  "Annapurna": "atta",
  "Fortune": "cooking_oil",
  "Madhura": "sugar",
  "Saffola": "cooking_oil",
  "Id": "bread",
  "MTR": "rice",
  "Rajah": "pickle",
  "Priya": "pickle",
  "Amrutanjan": "health_drink",
  "Parle Premium": "biscuits",
  "Britannia Bakery": "bread",
  "Lakers": "biscuits",
  "Sundrop": "cooking_oil",
  "Raw Pressery": "juice",
  "True Elements": "cereal",
  "24 Mantra": "cereal",
  "Sresta": "cereal",
  "Organic India": "tea",
  "Everest": "pickle",
  "Catch": "sauce",
  "Dish Dish": "sauce",
  "Kitchen of India": "sauce",
  "Aromatic": "rice",
}

export function inferCategory(brand: string | null, name: string): string | null {
  if (brand && BRAND_CATEGORIES[brand]) {
    return BRAND_CATEGORIES[brand]
  }
  const lower = name.toLowerCase()
  if (/noodle|maggi|yippee|ramen/i.test(lower)) return 'noodles'
  if (/biscuit|cookie|cracker|digestive|marie|glucose|cream biscuit/i.test(lower)) return 'biscuits'
  if (/chips|kur|lay|pringle|wafers/i.test(lower)) return 'chips'
  if (/namkeen|bhujia|chevda|mixture|sev/i.test(lower)) return 'namkeen'
  if (/bread|brown bread|white bread|sandwich|toast/i.test(lower)) return 'bread'
  if (/butter|cheese|paneer|dairy|amul|gouda|mozzarella|processed cheese/i.test(lower)) return 'dairy'
  if (/yogurt|curd|dahi|lassi|chaas|buttermilk/i.test(lower)) return 'yogurt'
  if (/ice.cream|frozen dessert|kulfi|cone/i.test(lower)) return 'ice_cream'
  if (/chocolate|candy|toffee|lollipop|gummy|cadbury|dairy milk|kitkat|munch/i.test(lower)) return 'chocolate'
  if (/cereal|muesli|granola|corn flakes|kellogg|oats|porridge/i.test(lower)) return 'cereal'
  if (/pasta|macaroni|spaghetti|penne/i.test(lower)) return 'pasta'
  if (/sauce|ketchup|mayonnaise|dip|chutney/i.test(lower)) return 'sauce'
  if (/oil|cooking oil|refined|mustard oil|coconut oil|olive oil/i.test(lower)) return 'cooking_oil'
  if (/tea|chai|green tea|lemon tea/i.test(lower)) return 'tea'
  if (/coffee|nescafe|bru|instant coffee/i.test(lower)) return 'coffee'
  if (/juice|fruit drink|paper boat|frooti|maaza|slice|real|b natural/i.test(lower)) return 'juice'
  if (/cold drink|soda|coke|pepsi|sprite|fanta|thums up/i.test(lower)) return 'cold_drink'
  if (/energy drink|monster|red bull|sting|glucose/i.test(lower)) return 'energy_drink'
  if (/protein|whey|supplement|protein bar/i.test(lower)) return 'protein'
  if (/pickle|achar|mango pickle|lime pickle/i.test(lower)) return 'pickle'
  if (/jam|marmalade|kissan/i.test(lower)) return 'jam'
  if (/cake|brownie|muffin|pastry|donut/i.test(lower)) return 'cake'
  if (/pizza|frozen pizza|pizza base/i.test(lower)) return 'pizza'
  if (/soup|instant soup|knorr/i.test(lower)) return 'soup'
  if (/horlicks|bournvita|complan|boost|malt|health drink/i.test(lower)) return 'health_drink'
  if (/rice|basmati|ponni|parboiled|biryani/i.test(lower)) return 'rice'
  if (/dal|lentil|toor|moong|chana|masoor/i.test(lower)) return 'dal'
  if (/atta|flour|maida|whole wheat|chapati/i.test(lower)) return 'flour'
  if (/ghee|clarified butter/i.test(lower)) return 'ghee'
  if (/honey/i.test(lower)) return 'honey'
  if (/milk/i.test(lower)) return 'milk'
  return null
}

export function analyzeBarcode(barcode: string): BarcodeAnalysis {
  const isIndian = INDIAN_PREFIXES.some(p => barcode.startsWith(p))
  
  const brandPrefix = Object.keys(KNOWN_INDIAN_BRANDS)
    .find(prefix => barcode.startsWith(prefix))
  
  const brand: string | null = brandPrefix ? (KNOWN_INDIAN_BRANDS[brandPrefix] ?? null) : null

  const category = brand ? inferCategory(brand, brand) : null

  return {
    isIndian,
    isKnownBrand: !!brand,
    brand,
    category,
    searchHint: brand
      ? `${brand} product barcode ${barcode}`
      : isIndian 
        ? `Indian food product barcode ${barcode}`
        : `food product barcode ${barcode}`,
  }
}

// Indian serving size corrections
export const INDIAN_SERVING_NORMS: Record<string, number> = {
  "biscuits": 30,
  "namkeen": 30,
  "chips": 30,
  "instant_noodles": 75,
  "bread": 60,
  "dal": 30,
  "rice": 75,
  "sweets": 30,
  "chocolate": 25,
  "cereal": 30,
  "milk": 200,
  "curd": 100,
}

// ICMR 2020 Recommended Daily Allowances
export const ICMR_RDA = {
  calories: { sedentary: 1900, moderate: 2100, heavy: 2500 },
  protein: { adult_male: 54, adult_female: 46 },
  fat: { max_percent_calories: 30 },
  carbs: { min_percent_calories: 55 },
  sugar: { max_g: 25 },
  sodium: { max_mg: 2000 },
  fiber: { min_g: 40 },
  iron: { adult_male: 17, adult_female: 21 },
  calcium: { adult: 600 },
}