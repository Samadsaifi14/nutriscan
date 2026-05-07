// lib/barcode-intelligence.ts
// Indian barcode detection and brand identification

export interface BarcodeAnalysis {
  isIndian: boolean
  isKnownBrand: boolean
  brand: string | null
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

export function analyzeBarcode(barcode: string): BarcodeAnalysis {
  const isIndian = INDIAN_PREFIXES.some(p => barcode.startsWith(p))
  
  const brandPrefix = Object.keys(KNOWN_INDIAN_BRANDS)
    .find(prefix => barcode.startsWith(prefix))
  
  const brand = brandPrefix ? KNOWN_INDIAN_BRANDS[brandPrefix] : null

  return {
    isIndian,
    isKnownBrand: !!brand,
    brand,
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