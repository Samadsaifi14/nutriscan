// BioYou Health Engine - Healthier Alternatives Database
// Provides local alternatives when AI fails or as supplement

export type AlternativeType = "branded" | "homemade" | "whole_food"
export type Availability = "widely_available" | "supermarket" | "homemade"

export interface HealthierAlternative {
  name: string
  reason: string
  availability: Availability
  type: AlternativeType
  category_match: string[]
  min_score_needed: number
}

export const ALTERNATIVES_DB: HealthierAlternative[] = [
  // ── Chips & Snacks ─────────────────────────────────────────────────────────
  {
    name: "Roasted Chana (Chivda)",
    reason: "High protein (12g), fiber-rich, no refined flour",
    availability: "homemade",
    type: "homemade",
    category_match: ["chips", "chips", "potato chips", "fried snacks", "extruded snacks", "nachos"],
    min_score_needed: 4,
  },
  {
    name: "Roasted Makhana (Fox Nuts)",
    reason: "Low calorie, high protein, natural snack",
    availability: "widely_available",
    type: "whole_food",
    category_match: ["chips", "fried snacks", "popcorn"],
    min_score_needed: 4,
  },
  {
    name: "Baked Whole Wheat Crackers",
    reason: "Whole grain, fiber, lower sodium than regular crackers",
    availability: "supermarket",
    type: "branded",
    category_match: ["biscuits", "crackers", "cookies"],
    min_score_needed: 4,
  },
  {
    name: "Mixed Nuts (Raw)",
    reason: "Good fats, protein, no additives",
    availability: "widely_available",
    type: "whole_food",
    category_match: ["chips", "fried snacks", "processed nuts"],
    min_score_needed: 5,
  },
  {
    name: "Homemade Oat Cookies",
    reason: "Whole grain oats, natural sweetness, no preservatives",
    availability: "homemade",
    type: "homemade",
    category_match: ["biscuits", "cookies", "sweet snacks"],
    min_score_needed: 4,
  },

  // ── Instant Noodles ─────────────────────────────────────────────────────────
  {
    name: "Instant Oats (Savoury)",
    reason: "High fiber, complex carbs, no palm oil",
    availability: "widely_available",
    type: "branded",
    category_match: ["instant noodles", "instant pasta", "instant food"],
    min_score_needed: 5,
  },
  {
    name: "Moong Dal Cheela",
    reason: "High protein, fiber, no refined flour",
    availability: "homemade",
    type: "homemade",
    category_match: ["instant noodles", "instant pasta", "quick meals"],
    min_score_needed: 7,
  },
  {
    name: "Ragi Mudde",
    reason: "High calcium, fiber, traditional whole grain",
    availability: "homemade",
    type: "homemade",
    category_match: ["instant noodles", "instant food"],
    min_score_needed: 7,
  },
  {
    name: "Whole Wheat Pasta with Vegetables",
    reason: "Whole grain, fiber, homemade sauce",
    availability: "homemade",
    type: "homemade",
    category_match: ["instant noodles", "instant pasta"],
    min_score_needed: 6,
  },

  // ── Soft Drinks & Juices ────────────────────────────────────────────────────
  {
    name: "Fresh Coconut Water",
    reason: "Natural electrolytes, no added sugar",
    availability: "widely_available",
    type: "whole_food",
    category_match: ["soft drink", "soda", "cola", "energy drink", "fruit drink"],
    min_score_needed: 7,
  },
  {
    name: "Fresh Lemon Water",
    reason: "Natural vitamin C, no added sugar",
    availability: "homemade",
    type: "homemade",
    category_match: ["soft drink", "soda", "energy drink"],
    min_score_needed: 8,
  },
  {
    name: "Buttermilk (Chaas)",
    reason: "Probiotics, protein, traditional Indian drink",
    availability: "homemade",
    type: "homemade",
    category_match: ["soft drink", "flavored milk", "energy drink"],
    min_score_needed: 7,
  },
  {
    name: "Unsweetened Almond Milk",
    reason: "Low calorie, vitamin E, no added sugar",
    availability: "supermarket",
    type: "branded",
    category_match: ["soft drink", "flavored milk", "dairy drink"],
    min_score_needed: 6,
  },
  {
    name: "Fresh Fruit Smoothie (No Sugar)",
    reason: "Natural fruit sugar, fiber, vitamins",
    availability: "homemade",
    type: "homemade",
    category_match: ["soft drink", "fruit drink", "energy drink"],
    min_score_needed: 6,
  },

  // ── Biscuits & Cookies ──────────────────────────────────────────────────────
  {
    name: "Whole Wheat Biscuits (Unsweetened)",
    reason: "Whole grain, fiber, no added sugar",
    availability: "supermarket",
    type: "branded",
    category_match: ["biscuits", "cookies", "sweet snacks"],
    min_score_needed: 5,
  },
  {
    name: "Oats with Milk",
    reason: "Complex carbs, fiber, protein breakfast",
    availability: "homemade",
    type: "homemade",
    category_match: ["biscuits", "cookies", "breakfast cereal"],
    min_score_needed: 8,
  },
  {
    name: "Besan Toast",
    reason: "High protein, fiber, traditional breakfast",
    availability: "homemade",
    type: "homemade",
    category_match: ["biscuits", "cookies", "packaged snacks"],
    min_score_needed: 7,
  },
  {
    name: "Fruit & Nut Mix",
    reason: "Natural, no added sugar or preservatives",
    availability: "widely_available",
    type: "whole_food",
    category_match: ["biscuits", "cookies", "sweet snacks"],
    min_score_needed: 6,
  },

  // ── Chocolates & Candy ───────────────────────────────────────────────────────
  {
    name: "Dark Chocolate (70%+ Cocoa)",
    reason: "Antioxidants, lower sugar than milk chocolate",
    availability: "widely_available",
    type: "branded",
    category_match: ["chocolate", "candy", " confectionery"],
    min_score_needed: 5,
  },
  {
    name: "Dates with Nuts",
    reason: "Natural sweetness, fiber, minerals",
    availability: "homemade",
    type: "homemade",
    category_match: ["candy", "chocolate", "sweet snacks"],
    min_score_needed: 7,
  },
  {
    name: "Fresh Fruits",
    reason: "Natural sugar, fiber, vitamins",
    availability: "homemade",
    type: "whole_food",
    category_match: ["candy", "sweet snacks", "confectionery"],
    min_score_needed: 9,
  },
  {
    name: "Homemade Ladoo (Besan/Nuts)",
    reason: "Traditional, natural ingredients, portion control",
    availability: "homemade",
    type: "homemade",
    category_match: ["candy", "sweet snacks", "confectionery"],
    min_score_needed: 5,
  },

  // ── Cereal & Breakfast ───────────────────────────────────────────────────────
  {
    name: "Traditional Poha",
    reason: "Low calorie, iron-rich, traditional breakfast",
    availability: "homemade",
    type: "homemade",
    category_match: ["cereal", "breakfast cereal", "instant cereal"],
    min_score_needed: 7,
  },
  {
    name: "Idli with Sambar",
    reason: "Fermented, high protein, low fat",
    availability: "homemade",
    type: "homemade",
    category_match: ["cereal", "breakfast cereal", "instant cereal"],
    min_score_needed: 8,
  },
  {
    name: "Upma (Rava/Whole Grain)",
    reason: "Complex carbs, fiber, vegetable addition possible",
    availability: "homemade",
    type: "homemade",
    category_match: ["cereal", "breakfast cereal", "instant cereal"],
    min_score_needed: 6,
  },
  {
    name: "Broken Wheat (Dalia) Porridge",
    reason: "High fiber, low glycemic, traditional",
    availability: "homemade",
    type: "homemade",
    category_match: ["cereal", "breakfast cereal", "instant cereal"],
    min_score_needed: 8,
  },

  // ── Energy Bars ─────────────────────────────────────────────────────────────
  {
    name: "Mixed Seeds & Nuts Bar",
    reason: "Protein, healthy fats, no refined sugar",
    availability: "homemade",
    type: "homemade",
    category_match: ["energy bar", "protein bar", "snack bar"],
    min_score_needed: 6,
  },
  {
    name: "Oats & Honey Energy Balls",
    reason: "Natural ingredients, fiber, energy boost",
    availability: "homemade",
    type: "homemade",
    category_match: ["energy bar", "protein bar", "snack bar"],
    min_score_needed: 6,
  },
  {
    name: "Chia Seed Pudding",
    reason: "Omega-3, fiber, protein",
    availability: "homemade",
    type: "homemade",
    category_match: ["energy bar", "yogurt", "dessert"],
    min_score_needed: 7,
  },

  // ── Processed Foods ─────────────────────────────────────────────────────────
  {
    name: "Fresh Homemade Curry",
    reason: "Fresh ingredients, control over oil and spices",
    availability: "homemade",
    type: "homemade",
    category_match: ["curry", "ready to eat", "frozen food"],
    min_score_needed: 7,
  },
  {
    name: "Dal (Lentils) with Whole Grains",
    reason: "Complete protein, fiber, iron",
    availability: "homemade",
    type: "homemade",
    category_match: ["curry", "ready to eat", "processed food"],
    min_score_needed: 8,
  },
  {
    name: "Grilled/Roasted Chicken",
    reason: "Lean protein, no deep frying",
    availability: "homemade",
    type: "homemade",
    category_match: ["fried chicken", "processed meat"],
    min_score_needed: 6,
  },
  {
    name: "Tofu/Paneer Stir-fry",
    reason: "Plant-based protein, fresh vegetables",
    availability: "homemade",
    type: "homemade",
    category_match: ["processed food", "frozen meal"],
    min_score_needed: 7,
  },

  // ── Dairy Alternatives ─────────────────────────────────────────────────────
  {
    name: "Fresh Yogurt (Curd)",
    reason: "Probiotics, protein, calcium",
    availability: "widely_available",
    type: "whole_food",
    category_match: ["flavored yogurt", "processed dairy"],
    min_score_needed: 7,
  },
  {
    name: "Greek Yogurt (Plain)",
    reason: "Higher protein, lower sugar",
    availability: "supermarket",
    type: "branded",
    category_match: ["flavored yogurt", "processed dairy"],
    min_score_needed: 6,
  },
  {
    name: "Homemade Lassi (Unsweetened)",
    reason: "Probiotics, natural, no added sugar",
    availability: "homemade",
    type: "homemade",
    category_match: ["flavored milk", "processed dairy"],
    min_score_needed: 7,
  },

  // ── Packaged Sweets ─────────────────────────────────────────────────────────
  {
    name: "Fresh Fruit",
    reason: "Natural sugar with fiber and vitamins",
    availability: "homemade",
    type: "whole_food",
    category_match: ["sweets", "mithai", "packed sweets"],
    min_score_needed: 8,
  },
  {
    name: "Dry Fruits (Moderate Amount)",
    reason: "Natural, minerals, portion control",
    availability: "widely_available",
    type: "whole_food",
    category_match: ["sweets", "mithai", "packed sweets"],
    min_score_needed: 6,
  },
  {
    name: "Homemade Besan Laddu",
    reason: "Traditional, control over sugar and ghee",
    availability: "homemade",
    type: "homemade",
    category_match: ["sweets", "mithai", "packed sweets"],
    min_score_needed: 5,
  },
  {
    name: "Til (Sesame) Ladoo",
    reason: "Calcium, iron, traditional winter treat",
    availability: "homemade",
    type: "homemade",
    category_match: ["sweets", "mithai"],
    min_score_needed: 5,
  },

  // ── Sauces & Condiments ────────────────────────────────────────────────────
  {
    name: "Fresh Chutney (Mint/Coriander)",
    reason: "Fresh herbs, no preservatives",
    availability: "homemade",
    type: "homemade",
    category_match: ["sauce", "ketchup", "mayonnaise", "condiments"],
    min_score_needed: 8,
  },
  {
    name: "Homemade Tomato Sauce",
    reason: "Fresh tomatoes, no artificial preservatives",
    availability: "homemade",
    type: "homemade",
    category_match: ["sauce", "ketchup"],
    min_score_needed: 7,
  },
  {
    name: "Plain Yogurt Raita",
    reason: "Probiotics, fresh vegetables",
    availability: "homemade",
    type: "homemade",
    category_match: ["sauce", "dressing", "mayonnaise"],
    min_score_needed: 8,
  },

  // ── Processed Juices ───────────────────────────────────────────────────────
  {
    name: "Fresh Orange/Apple Juice",
    reason: "Vitamins, no added sugar",
    availability: "homemade",
    type: "homemade",
    category_match: ["fruit juice", "packaged juice", "drinks"],
    min_score_needed: 6,
  },
  {
    name: "Watermelon/Cucumber Juice",
    reason: "Hydrating, low calorie, natural",
    availability: "homemade",
    type: "homemade",
    category_match: ["fruit juice", "packaged juice"],
    min_score_needed: 8,
  },
  {
    name: "Aloe Vera Juice (Unsweetened)",
    reason: "Digestive benefits, natural",
    availability: "supermarket",
    type: "branded",
    category_match: ["energy drink", "health drink"],
    min_score_needed: 6,
  },
]

// Find alternatives based on product category and score
export function findHealthierAlternatives(
  productName: string,
  category: string | undefined,
  score: number
): HealthierAlternative[] {
  const searchTerms = [
    productName.toLowerCase(),
    category?.toLowerCase() || "",
  ]

  // Find matches
  const matches = ALTERNATIVES_DB.filter(alt => {
    // Check if product category matches any of the alternative's category_match
    const categoryMatch = alt.category_match.some(cat => 
      searchTerms.some(term => term.includes(cat) || cat.includes(term))
    )
    // Only return alternatives suitable for the product's score
    const scoreSuitable = score <= alt.min_score_needed
    return categoryMatch && scoreSuitable
  })

  // Return up to 4 alternatives, prioritizing by score suitability
  return matches.slice(0, 4)
}