// nutrition-helpers.ts
// fillNutritionIfMissing — single helper used by scan layers 3-7
// Groq (json_object) → Gemini 2.5 Flash → static keyword map (65 categories)
// ALWAYS runs if we have a product name — does NOT require offFallback

export interface NutritionValues {
  calories: number | null;
  protein: number | null;
  carbohydrates: number | null;
  fat: number | null;
  saturated_fat: number | null;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
}

const EMPTY_NUTRITION: NutritionValues = {
  calories: null, protein: null, carbohydrates: null,
  fat: null, saturated_fat: null, fiber: null, sugar: null, sodium: null,
};

function isNutritionEmpty(n: Partial<NutritionValues>): boolean {
  return (
    !n.calories && !n.protein && !n.carbohydrates && !n.fat
  );
}

// ─── Static keyword map — 65 categories ──────────────────────────────────────
// Values are per 100g estimates based on FSSAI/USDA averages for Indian market products.

const STATIC_NUTRITION_MAP: Array<{
  keywords: string[];
  nutrition: NutritionValues;
}> = [
  // ── Biscuits / Cookies ──
  {
    keywords: ["parle-g", "parle g", "glucose biscuit", "glucose biscuits"],
    nutrition: { calories: 458, protein: 6.7, carbohydrates: 76, fat: 14, saturated_fat: 6, fiber: 1, sugar: 20, sodium: 350 },
  },
  {
    keywords: ["marie biscuit", "marie gold", "tea biscuit", "digestive biscuit"],
    nutrition: { calories: 420, protein: 7, carbohydrates: 74, fat: 11, saturated_fat: 5, fiber: 2, sugar: 18, sodium: 380 },
  },
  {
    keywords: ["oreo", "cream biscuit", "sandwich biscuit", "hide and seek"],
    nutrition: { calories: 470, protein: 5, carbohydrates: 68, fat: 20, saturated_fat: 8, fiber: 1.5, sugar: 32, sodium: 320 },
  },
  {
    keywords: ["good day", "butter biscuit", "cashew biscuit", "nut biscuit"],
    nutrition: { calories: 480, protein: 6, carbohydrates: 67, fat: 20, saturated_fat: 9, fiber: 1, sugar: 22, sodium: 300 },
  },
  {
    keywords: ["biscuit", "cookie", "cracker", "rusk"],
    nutrition: { calories: 450, protein: 7, carbohydrates: 72, fat: 15, saturated_fat: 6, fiber: 1.5, sugar: 20, sodium: 350 },
  },

  // ── Chips / Snacks ──
  {
    keywords: ["lays", "lay's", "potato chips", "potato wafers", "uncle chips", "bingo"],
    nutrition: { calories: 536, protein: 6, carbohydrates: 55, fat: 33, saturated_fat: 10, fiber: 4, sugar: 1, sodium: 560 },
  },
  {
    keywords: ["kurkure", "cheetos", "puffed snack", "cheese puff", "corn puff"],
    nutrition: { calories: 520, protein: 5, carbohydrates: 60, fat: 27, saturated_fat: 9, fiber: 2, sugar: 4, sodium: 680 },
  },
  {
    keywords: ["bhujia", "sev", "namkeen", "mixture", "chivda", "chakli"],
    nutrition: { calories: 500, protein: 10, carbohydrates: 55, fat: 27, saturated_fat: 8, fiber: 5, sugar: 3, sodium: 700 },
  },
  {
    keywords: ["popcorn", "pop corn"],
    nutrition: { calories: 375, protein: 11, carbohydrates: 74, fat: 4, saturated_fat: 0.5, fiber: 14, sugar: 1, sodium: 300 },
  },
  {
    keywords: ["nachos", "tortilla chip", "corn chip"],
    nutrition: { calories: 490, protein: 7, carbohydrates: 62, fat: 24, saturated_fat: 7, fiber: 4, sugar: 1, sodium: 550 },
  },
  {
    keywords: ["chips", "wafers", "crisps", "snack"],
    nutrition: { calories: 520, protein: 6, carbohydrates: 58, fat: 28, saturated_fat: 9, fiber: 3, sugar: 2, sodium: 600 },
  },

  // ── Instant Noodles / Pasta ──
  {
    keywords: ["maggi", "top ramen", "yippee", "instant noodles", "two minute noodle"],
    nutrition: { calories: 430, protein: 9, carbohydrates: 62, fat: 16, saturated_fat: 7, fiber: 2, sugar: 3, sodium: 1200 },
  },
  {
    keywords: ["pasta", "spaghetti", "macaroni", "penne", "fusilli"],
    nutrition: { calories: 360, protein: 12, carbohydrates: 72, fat: 2, saturated_fat: 0.4, fiber: 3, sugar: 2, sodium: 6 },
  },
  {
    keywords: ["noodle", "chowmein", "hakka"],
    nutrition: { calories: 140, protein: 4, carbohydrates: 25, fat: 3, saturated_fat: 0.5, fiber: 1, sugar: 1, sodium: 400 },
  },

  // ── Chocolate / Candy ──
  {
    keywords: ["dairy milk", "kitkat", "5 star", "perk", "munch", "milk chocolate"],
    nutrition: { calories: 540, protein: 6, carbohydrates: 59, fat: 30, saturated_fat: 18, fiber: 1, sugar: 55, sodium: 80 },
  },
  {
    keywords: ["dark chocolate"],
    nutrition: { calories: 580, protein: 8, carbohydrates: 46, fat: 40, saturated_fat: 24, fiber: 10, sugar: 28, sodium: 30 },
  },
  {
    keywords: ["white chocolate"],
    nutrition: { calories: 550, protein: 6, carbohydrates: 60, fat: 32, saturated_fat: 20, fiber: 0, sugar: 58, sodium: 90 },
  },
  {
    keywords: ["candy", "toffee", "eclairs", "boiled sweet", "lollipop"],
    nutrition: { calories: 390, protein: 0, carbohydrates: 98, fat: 0, saturated_fat: 0, fiber: 0, sugar: 85, sodium: 40 },
  },
  {
    keywords: ["chocolate", "choco"],
    nutrition: { calories: 545, protein: 6, carbohydrates: 58, fat: 31, saturated_fat: 19, fiber: 2, sugar: 52, sodium: 70 },
  },

  // ── Beverages ──
  {
    keywords: ["coca cola", "coke", "pepsi", "thums up", "cola"],
    nutrition: { calories: 42, protein: 0, carbohydrates: 10.6, fat: 0, saturated_fat: 0, fiber: 0, sugar: 10.6, sodium: 10 },
  },
  {
    keywords: ["sprite", "7up", "limca", "lemon soda", "clear soda", "lemon lime"],
    nutrition: { calories: 38, protein: 0, carbohydrates: 9.6, fat: 0, saturated_fat: 0, fiber: 0, sugar: 9.6, sodium: 12 },
  },
  {
    keywords: ["fanta", "mirinda", "maaza", "slice", "fruit juice drink", "fruit drink", "mango drink", "orange drink"],
    nutrition: { calories: 48, protein: 0.2, carbohydrates: 12, fat: 0, saturated_fat: 0, fiber: 0.2, sugar: 11.5, sodium: 15 },
  },
  {
    keywords: ["real juice", "tropicana", "apple juice", "orange juice", "fruit juice"],
    nutrition: { calories: 45, protein: 0.5, carbohydrates: 11, fat: 0, saturated_fat: 0, fiber: 0.5, sugar: 10, sodium: 5 },
  },
  {
    keywords: ["energy drink", "red bull", "monster", "sting"],
    nutrition: { calories: 45, protein: 0, carbohydrates: 11, fat: 0, saturated_fat: 0, fiber: 0, sugar: 11, sodium: 100 },
  },
  {
    keywords: ["sports drink", "gatorade", "electral"],
    nutrition: { calories: 25, protein: 0, carbohydrates: 6, fat: 0, saturated_fat: 0, fiber: 0, sugar: 5, sodium: 110 },
  },
  {
    keywords: ["bournvita", "horlicks", "complan", "milo", "boost", "chocolate drink powder", "malted milk"],
    nutrition: { calories: 385, protein: 12, carbohydrates: 75, fat: 5, saturated_fat: 2, fiber: 1, sugar: 55, sodium: 200 },
  },
  {
    keywords: ["milk", "dairy milk drink", "flavoured milk"],
    nutrition: { calories: 65, protein: 3.4, carbohydrates: 5, fat: 3.5, saturated_fat: 2, fiber: 0, sugar: 5, sodium: 44 },
  },
  {
    keywords: ["lassi", "buttermilk", "chaas"],
    nutrition: { calories: 60, protein: 3, carbohydrates: 7, fat: 1.5, saturated_fat: 1, fiber: 0, sugar: 7, sodium: 80 },
  },
  {
    keywords: ["coconut water"],
    nutrition: { calories: 19, protein: 0.7, carbohydrates: 4, fat: 0.2, saturated_fat: 0, fiber: 1, sugar: 3, sodium: 105 },
  },
  {
    keywords: ["beverage", "soft drink", "soda", "aerated", "drink"],
    nutrition: { calories: 40, protein: 0, carbohydrates: 10, fat: 0, saturated_fat: 0, fiber: 0, sugar: 10, sodium: 15 },
  },

  // ── Bread / Bakery ──
  {
    keywords: ["white bread", "sandwich bread", "sliced bread", "bread loaf", "pav"],
    nutrition: { calories: 265, protein: 9, carbohydrates: 49, fat: 3, saturated_fat: 0.7, fiber: 2, sugar: 5, sodium: 490 },
  },
  {
    keywords: ["brown bread", "whole wheat bread", "multigrain bread", "atta bread"],
    nutrition: { calories: 240, protein: 10, carbohydrates: 45, fat: 3, saturated_fat: 0.5, fiber: 5, sugar: 4, sodium: 420 },
  },
  {
    keywords: ["cake", "muffin", "cupcake"],
    nutrition: { calories: 380, protein: 5, carbohydrates: 55, fat: 17, saturated_fat: 6, fiber: 1, sugar: 38, sodium: 280 },
  },
  {
    keywords: ["bread", "bun", "roll"],
    nutrition: { calories: 265, protein: 9, carbohydrates: 49, fat: 3, saturated_fat: 0.7, fiber: 2, sugar: 5, sodium: 490 },
  },

  // ── Dairy ──
  {
    keywords: ["yoghurt", "yogurt", "curd", "dahi"],
    nutrition: { calories: 61, protein: 3.5, carbohydrates: 4.7, fat: 3, saturated_fat: 2, fiber: 0, sugar: 4.7, sodium: 46 },
  },
  {
    keywords: ["paneer", "cottage cheese"],
    nutrition: { calories: 265, protein: 18, carbohydrates: 2, fat: 20, saturated_fat: 12, fiber: 0, sugar: 2, sodium: 30 },
  },
  {
    keywords: ["cheese", "processed cheese", "cheese slice", "amul cheese"],
    nutrition: { calories: 350, protein: 22, carbohydrates: 2, fat: 28, saturated_fat: 17, fiber: 0, sugar: 1, sodium: 620 },
  },
  {
    keywords: ["butter", "amul butter", "salted butter"],
    nutrition: { calories: 717, protein: 0.9, carbohydrates: 0.1, fat: 81, saturated_fat: 51, fiber: 0, sugar: 0.1, sodium: 576 },
  },
  {
    keywords: ["ghee", "clarified butter"],
    nutrition: { calories: 898, protein: 0, carbohydrates: 0, fat: 99, saturated_fat: 62, fiber: 0, sugar: 0, sodium: 2 },
  },
  {
    keywords: ["ice cream", "kulfi"],
    nutrition: { calories: 200, protein: 3.5, carbohydrates: 24, fat: 10, saturated_fat: 6, fiber: 0, sugar: 22, sodium: 80 },
  },

  // ── Breakfast Cereals ──
  {
    keywords: ["cornflakes", "corn flakes", "kelloggs"],
    nutrition: { calories: 357, protein: 7, carbohydrates: 81, fat: 0.5, saturated_fat: 0.1, fiber: 3, sugar: 7, sodium: 600 },
  },
  {
    keywords: ["oats", "rolled oats", "instant oats", "quaker", "saffola oats"],
    nutrition: { calories: 367, protein: 13, carbohydrates: 66, fat: 7, saturated_fat: 1.3, fiber: 10, sugar: 1, sodium: 2 },
  },
  {
    keywords: ["muesli", "granola"],
    nutrition: { calories: 390, protein: 10, carbohydrates: 68, fat: 9, saturated_fat: 2, fiber: 7, sugar: 22, sodium: 50 },
  },
  {
    keywords: ["cereal", "breakfast cereal"],
    nutrition: { calories: 375, protein: 8, carbohydrates: 78, fat: 2, saturated_fat: 0.5, fiber: 4, sugar: 15, sodium: 450 },
  },

  // ── Condiments / Sauces ──
  {
    keywords: ["ketchup", "tomato sauce", "maggi ketchup"],
    nutrition: { calories: 100, protein: 1.5, carbohydrates: 24, fat: 0.1, saturated_fat: 0, fiber: 1, sugar: 22, sodium: 900 },
  },
  {
    keywords: ["soy sauce", "soya sauce"],
    nutrition: { calories: 53, protein: 8, carbohydrates: 5, fat: 0, saturated_fat: 0, fiber: 0.8, sugar: 2, sodium: 5700 },
  },
  {
    keywords: ["mayonnaise", "mayo"],
    nutrition: { calories: 680, protein: 1, carbohydrates: 2, fat: 75, saturated_fat: 12, fiber: 0, sugar: 1, sodium: 500 },
  },
  {
    keywords: ["chutney", "pickle", "achar"],
    nutrition: { calories: 120, protein: 1, carbohydrates: 18, fat: 5, saturated_fat: 1, fiber: 2, sugar: 12, sodium: 1200 },
  },

  // ── Nuts / Dry Fruits ──
  {
    keywords: ["peanut", "groundnut", "roasted peanut"],
    nutrition: { calories: 567, protein: 26, carbohydrates: 16, fat: 49, saturated_fat: 7, fiber: 8, sugar: 4, sodium: 18 },
  },
  {
    keywords: ["cashew", "kaju"],
    nutrition: { calories: 553, protein: 18, carbohydrates: 30, fat: 44, saturated_fat: 8, fiber: 3, sugar: 6, sodium: 12 },
  },
  {
    keywords: ["almond", "badam"],
    nutrition: { calories: 579, protein: 21, carbohydrates: 22, fat: 50, saturated_fat: 4, fiber: 12, sugar: 4, sodium: 1 },
  },
  {
    keywords: ["nuts", "mixed nuts", "dry fruit", "dried fruit", "raisin", "dates"],
    nutrition: { calories: 560, protein: 16, carbohydrates: 28, fat: 46, saturated_fat: 6, fiber: 8, sugar: 10, sodium: 20 },
  },

  // ── Spreads / Peanut Butter ──
  {
    keywords: ["peanut butter", "groundnut butter"],
    nutrition: { calories: 588, protein: 25, carbohydrates: 20, fat: 50, saturated_fat: 10, fiber: 6, sugar: 9, sodium: 400 },
  },
  {
    keywords: ["jam", "jelly", "marmalade", "fruit spread"],
    nutrition: { calories: 250, protein: 0.4, carbohydrates: 64, fat: 0, saturated_fat: 0, fiber: 1, sugar: 58, sodium: 30 },
  },
  {
    keywords: ["nutella", "chocolate spread", "hazelnut spread"],
    nutrition: { calories: 539, protein: 6, carbohydrates: 58, fat: 30, saturated_fat: 11, fiber: 3, sugar: 55, sodium: 40 },
  },

  // ── Instant / Ready-to-eat ──
  {
    keywords: ["upma mix", "idli mix", "dosa mix", "ready mix", "instant mix"],
    nutrition: { calories: 360, protein: 10, carbohydrates: 72, fat: 4, saturated_fat: 1, fiber: 3, sugar: 2, sodium: 600 },
  },
  {
    keywords: ["ready to eat", "rte meal", "ready meal", "instant curry", "dal makhani pack"],
    nutrition: { calories: 120, protein: 5, carbohydrates: 16, fat: 4, saturated_fat: 1.5, fiber: 3, sugar: 3, sodium: 550 },
  },

  // ── Protein / Health ──
  {
    keywords: ["protein bar", "energy bar", "nutrition bar", "quest bar", "clif bar"],
    nutrition: { calories: 400, protein: 20, carbohydrates: 45, fat: 12, saturated_fat: 4, fiber: 5, sugar: 22, sodium: 200 },
  },
  {
    keywords: ["protein powder", "whey protein", "mass gainer"],
    nutrition: { calories: 380, protein: 70, carbohydrates: 15, fat: 5, saturated_fat: 2, fiber: 1, sugar: 8, sodium: 200 },
  },

  // ── Oils ──
  {
    keywords: ["sunflower oil", "soyabean oil", "soya oil", "vegetable oil", "refined oil"],
    nutrition: { calories: 884, protein: 0, carbohydrates: 0, fat: 100, saturated_fat: 11, fiber: 0, sugar: 0, sodium: 0 },
  },
  {
    keywords: ["olive oil"],
    nutrition: { calories: 884, protein: 0, carbohydrates: 0, fat: 100, saturated_fat: 14, fiber: 0, sugar: 0, sodium: 2 },
  },
  {
    keywords: ["mustard oil", "sarson oil"],
    nutrition: { calories: 884, protein: 0, carbohydrates: 0, fat: 100, saturated_fat: 12, fiber: 0, sugar: 0, sodium: 0 },
  },

  // ── Generic fallback ──
  {
    keywords: ["food", "product"],
    nutrition: { calories: 250, protein: 5, carbohydrates: 35, fat: 10, saturated_fat: 3, fiber: 2, sugar: 8, sodium: 300 },
  },
];

function lookupStaticNutrition(productName: string): NutritionValues | null {
  const lc = productName.toLowerCase();
  for (const entry of STATIC_NUTRITION_MAP) {
    if (entry.keywords.some((kw) => lc.includes(kw))) {
      return entry.nutrition;
    }
  }
  return null;
}

// ─── AI estimation (Groq → Gemini) ──────────────────────────────────────────

async function estimateWithGroq(productName: string): Promise<NutritionValues | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;

  const prompt = `Estimate the nutritional values per 100g for this Indian food product: "${productName}".
Return ONLY a JSON object with these exact keys (numbers only, no units):
{"calories":0,"protein":0,"carbohydrates":0,"fat":0,"saturated_fat":0,"fiber":0,"sugar":0,"sodium":0}
If unknown, use 0 for that field. Do not add any other text.`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    if (!parsed.calories && !parsed.protein && !parsed.carbohydrates) return null;
    return parsed as NutritionValues;
  } catch {
    return null;
  }
}

async function estimateWithGemini(productName: string): Promise<NutritionValues | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const prompt = `Estimate nutritional values per 100g for Indian food product: "${productName}".
Return ONLY valid JSON: {"calories":0,"protein":0,"carbohydrates":0,"fat":0,"saturated_fat":0,"fiber":0,"sugar":0,"sodium":0}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
        }),
        signal: AbortSignal.timeout(7000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    if (!parsed.calories && !parsed.protein && !parsed.carbohydrates) return null;
    return parsed as NutritionValues;
  } catch {
    return null;
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fillNutritionIfMissing(
  productName: string,
  existing: Partial<NutritionValues>
): Promise<NutritionValues | null> {
  if (!isNutritionEmpty(existing)) {
    return existing as NutritionValues;
  }

  if (!productName) return null;

  const groqResult = await estimateWithGroq(productName);
  if (groqResult) return groqResult;

  const geminiResult = await estimateWithGemini(productName);
  if (geminiResult) return geminiResult;

  const staticResult = lookupStaticNutrition(productName);
  if (staticResult) return staticResult;

  return null;
}

export async function getCategoryNutrition(
  productName: string,
  category?: string
): Promise<NutritionValues | null> {
  const searchTerm = category ? `${productName} ${category}` : productName;
  return fillNutritionIfMissing(searchTerm, {});
}
