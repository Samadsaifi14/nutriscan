// BioYou — Curated Indian Product Alternatives
// Never-fail fallback for the Alternatives tab.
// Maps common Indian product categories → healthier substitutes.

export interface CuratedAlternative {
  name: string
  reason: string
  availability: string
  type: 'branded' | 'homemade' | 'whole_food'
  image_url?: string
  nutrition_per_100g?: { calories?: number; protein?: number; carbs?: number; fat?: number; sugar?: number; sodium?: number; fiber?: number }
  score?: number
  grade?: string
  shopping_url?: string
}

export interface CategoryMatch {
  category: string
  alternatives: CuratedAlternative[]
}

// Map product name keywords → category key
const CATEGORY_KEYWORDS: [RegExp, string][] = [
  [/noodle|maggi|yippee|top.ramen/i, 'noodles'],
  [/biscuit|cookie|cracker|parle|britannia|nutrichoice|digestive|marie|glucose|cream.biscuit/i, 'biscuits'],
  [/chips|kur|lay|pringle|namkeen|bhujia|chevda|snack|wafers/i, 'chips'],
  [/cold.drink|soda|coke|pepsi|sprite|fanta|thums.up|coca.cola|mountain.dew/i, 'cold_drink'],
  [/juice|fruit.drink|paper.boat|frooti|maaza|slice|real|b.natural/i, 'juice'],
  [/bread|brown.bread|white.bread|sandwich/i, 'bread'],
  [/butter|cheese|paneer|dairy|amul|gouda|mozzarella|processed.cheese/i, 'dairy'],
  [/yogurt|curd|dahi|lassi|chaas|buttermilk/i, 'yogurt'],
  [/ice.cream|frozen.dessert|kulfi|cone|tubs/i, 'ice_cream'],
  [/chocolate|candy|toffee|lollipop|gummy|cadbury|dairy.milk|kitkat|munch|milk.chocolate/i, 'chocolate'],
  [/cereal|muesli|granola|corn.flakes|kellogg|oats|porridge/i, 'cereal'],
  [/pasta|macaroni|spaghetti|penne/i, 'pasta'],
  [/sauce|ketchup|mayonnaise|dip|chutney/i, 'sauce'],
  [/oil|cooking.oil|refined|mustard.oil|coconut.oil|olive.oil|sunflower.oil/i, 'cooking_oil'],
  [/tea|chai|green.tea|lemon.tea|tetley|taj.mahal/i, 'tea'],
  [/coffee|nescafe|bru|instant.coffee|filter.coffee/i, 'coffee'],
  [/energy.drink|monster|red.bull|sting|ghati|charging|glucose.d/i, 'energy_drink'],
  [/protein|whey|gym|supplement|mass.gainer|protein.bar/i, 'protein'],
  [/pickle|achar|mango.pickle|lime.pickle|mixed.pickle/i, 'pickle'],
  [/jam|marmalade|kissan|mapro/i, 'jam'],
  [/instant.noodle|cup.noodle|ramen/i, 'noodles'],
  [/rusk|toast/i, 'rusk'],
  [/cake|brownie|muffin|pastry|cream.roll|puff|donut/i, 'cake'],
  [/pizza|frozen.pizza|pizza.base/i, 'pizza'],
  [/soup|instant.soup|knorr/i, 'soup'],
  [/health.drink|horlicks|bournvita|complan|boost|malt/i, 'health_drink'],
  [/paneer|tofu/i, 'paneer'],
  [/egg/i, 'eggs'],
  [/rice|basmati|ponni|parboiled|biryani/i, 'rice'],
  [/dal|lentil|toor|moong|chana|masoor/i, 'dal'],
  [/atta|flour|maida|whole.wheat|chapati/i, 'flour'],
  [/ghee|clarified.butter/i, 'ghee'],
  [/honey/i, 'honey'],
  [/milk/i, 'milk'],
  [/namkeen|mixture|bhujia|sev|chevda/i, 'chips'],
]

const curated: Record<string, CuratedAlternative[]> = {
  noodles: [
    { name: 'Yoga Atta Noodles', reason: '64% less fat than Maggi, no MSG, whole wheat', availability: 'Amazon, BigBasket, Blinkit', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 280, protein: 8, carbs: 52, fat: 4, sugar: 1, sodium: 350, fiber: 6 }, shopping_url: 'https://www.amazon.in/dp/B08XYZ?tag=BioYou-21' },
    { name: 'Whole wheat pasta (homemade)', reason: 'Zero preservatives, controlled sodium, high fiber', availability: 'Homemade', type: 'homemade', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 250, protein: 9, carbs: 45, fat: 3, sugar: 1, sodium: 100, fiber: 8 } },
    { name: 'Schezwan noodles (Zero Noodle)', reason: 'Low carb, high protein, konjac-based', availability: 'Amazon, Blinkit', type: 'branded', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 180, protein: 12, carbs: 8, fat: 2, sugar: 0, sodium: 200, fiber: 10 }, shopping_url: 'https://www.amazon.in/dp/B09YYY?tag=BioYou-21' },
    { name: 'Brown rice noodles', reason: 'Gluten-free, low glycemic index', availability: 'Amazon', type: 'branded', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 260, protein: 6, carbs: 50, fat: 2, sugar: 0, sodium: 50, fiber: 4 } },
  ],
  biscuits: [
    { name: 'True Elements Digestive Biscuits', reason: 'No maida, no trans fat, whole wheat, high fiber', availability: 'Amazon, BigBasket, Blinkit', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 420, protein: 8, carbs: 65, fat: 14, sugar: 8, sodium: 300, fiber: 10 }, shopping_url: 'https://www.amazon.in/dp/B07XYZ?tag=BioYou-21' },
    { name: 'Britannia NutriChoice Digestive', reason: 'Whole wheat, zero trans fat, 5g fiber per 100g', availability: 'Everywhere', type: 'branded', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 460, protein: 7, carbs: 68, fat: 16, sugar: 7, sodium: 350, fiber: 5 }, shopping_url: 'https://www.amazon.in/dp/B08ABC?tag=BioYou-21' },
    { name: 'Anmol Premium Lite Biscuit', reason: 'Low sugar, whole wheat option', availability: 'Amazon, BigBasket', type: 'branded', score: 6.5, grade: 'B', nutrition_per_100g: { calories: 440, protein: 6, carbs: 70, fat: 14, sugar: 5, sodium: 280, fiber: 4 } },
    { name: 'Almonds (handful)', reason: 'Natural, no processing, healthy fats', availability: 'All stores', type: 'whole_food', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 579, protein: 21, carbs: 22, fat: 50, sugar: 4, sodium: 1, fiber: 12 } },
    { name: 'Homemade oats cookies', reason: 'Zero preservatives, controlled sugar, whole grain', availability: 'Homemade', type: 'homemade', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 380, protein: 10, carbs: 55, fat: 12, sugar: 6, sodium: 100, fiber: 7 } },
  ],
  chips: [
    { name: 'Baked snacks (Yoga/Terra)', reason: 'Baked not fried, 50% less fat', availability: 'Amazon, BigBasket', type: 'branded', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 380, protein: 6, carbs: 60, fat: 12, sugar: 3, sodium: 350, fiber: 5 }, shopping_url: 'https://www.amazon.in/dp/B09ZZZ?tag=BioYou-21' },
    { name: 'Makhana (fox nuts) — roasted', reason: 'Low calorie, high protein, mineral-rich', availability: 'All stores', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 350, protein: 15, carbs: 58, fat: 5, sugar: 2, sodium: 2, fiber: 14 } },
    { name: 'Roasted chana (chickpeas)', reason: 'High protein, high fiber, zero oil', availability: 'All stores', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 320, protein: 18, carbs: 52, fat: 5, sugar: 3, sodium: 10, fiber: 15 } },
    { name: 'Sprouts salad', reason: 'Highest nutrient density, raw enzymes', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 120, protein: 12, carbs: 18, fat: 2, sugar: 1, sodium: 5, fiber: 8 } },
    { name: 'Ragi chips (millets)', reason: 'Gluten-free, millet-based, low glycemic', availability: 'Amazon, organic stores', type: 'branded', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 360, protein: 7, carbs: 62, fat: 10, sugar: 2, sodium: 300, fiber: 8 } },
  ],
  cold_drink: [
    { name: 'Coconut water (Raw Pressery)', reason: 'Natural electrolytes, zero added sugar', availability: 'Amazon, Blinkit, BigBasket', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 19, protein: 0, carbs: 4, fat: 0, sugar: 3, sodium: 105, fiber: 0 }, shopping_url: 'https://www.amazon.in/dp/B07ABC?tag=BioYou-21' },
    { name: 'Lemon water (homemade)', reason: 'Zero sugar, vitamin C, no preservatives', availability: 'Homemade', type: 'homemade', score: 9.5, grade: 'A', nutrition_per_100g: { calories: 2, protein: 0, carbs: 1, fat: 0, sugar: 0, sodium: 1, fiber: 0 } },
    { name: 'Nimbu paani (no sugar)', reason: 'Traditional, refreshing, zero processed ingredients', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 5, protein: 0, carbs: 1, fat: 0, sugar: 0, sodium: 2, fiber: 0 } },
    { name: 'Soda + fresh lime', reason: 'Zero calories, zero artificial sweeteners', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 1, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 5, fiber: 0 } },
  ],
  juice: [
    { name: 'Whole fruit (fresh)', reason: 'Fiber intact, no added sugar, natural vitamins', availability: 'Everywhere', type: 'whole_food', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 60, protein: 1, carbs: 14, fat: 0, sugar: 10, sodium: 1, fiber: 3 } },
    { name: 'Raw Pressery Cold Pressed juices', reason: 'No added sugar, cold-pressed, no preservatives', availability: 'Amazon, Blinkit', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 45, protein: 1, carbs: 10, fat: 0, sugar: 7, sodium: 5, fiber: 1 }, shopping_url: 'https://www.amazon.in/dp/B08GHI?tag=BioYou-21' },
    { name: 'Coconut water', reason: 'Natural isotonic, rich in potassium', availability: 'All stores', type: 'whole_food', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 19, protein: 0, carbs: 4, fat: 0, sugar: 3, sodium: 105, fiber: 0 } },
    { name: 'Vegetable juice (homemade)', reason: 'Low sugar, high micronutrients', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 30, protein: 2, carbs: 5, fat: 0, sugar: 3, sodium: 40, fiber: 2 } },
  ],
  bread: [
    { name: 'Whole wheat bread (local bakery)', reason: 'No preservatives, real whole wheat', availability: 'Local bakery', type: 'whole_food', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 250, protein: 9, carbs: 45, fat: 3, sugar: 2, sodium: 300, fiber: 7 } },
    { name: 'Brown bread (Britannia 100% Whole Wheat)', reason: 'No maida, 100% whole wheat, high fiber', availability: 'Everywhere', type: 'branded', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 240, protein: 8, carbs: 44, fat: 2, sugar: 3, sodium: 320, fiber: 6 } },
    { name: 'Multigrain bread (Modern)', reason: '5 grains, higher protein, no trans fat', availability: 'BigBasket, Blinkit', type: 'branded', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 235, protein: 10, carbs: 40, fat: 3, sugar: 2, sodium: 280, fiber: 7 } },
    { name: 'Roti / Chapati (homemade)', reason: 'Fresh, no preservatives, whole grain', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 190, protein: 6, carbs: 38, fat: 2, sugar: 1, sodium: 2, fiber: 8 } },
  ],
  dairy: [
    { name: 'Amul Gold Full Cream Milk', reason: 'Natural, no additives, rich in calcium', availability: 'Everywhere', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 67, protein: 3.2, carbs: 4.8, fat: 3.6, sugar: 4.8, sodium: 50, fiber: 0 } },
    { name: 'Milk (toned / double toned)', reason: 'Lower fat, high protein, natural calcium', availability: 'Everywhere', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 50, protein: 3.5, carbs: 4.8, fat: 1.5, sugar: 4.8, sodium: 50, fiber: 0 } },
    { name: 'Greek yogurt (homemade)', reason: 'High protein, probiotics, no additives', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 59, protein: 10, carbs: 4, fat: 0.5, sugar: 3, sodium: 40, fiber: 0 } },
    { name: 'Organic paneer (homemade)', reason: 'No preservatives, high protein, calcium', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 270, protein: 18, carbs: 2, fat: 21, sugar: 1, sodium: 30, fiber: 0 } },
  ],
  yogurt: [
    { name: 'Homemade curd (toned milk)', reason: 'Probiotics, no gelatin, no preservatives', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 65, protein: 5, carbs: 6, fat: 3, sugar: 4, sodium: 45, fiber: 0 } },
    { name: 'Epigamia Greek Yogurt', reason: 'High protein, no artificial sweeteners', availability: 'Amazon, Blinkit', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 85, protein: 12, carbs: 6, fat: 1, sugar: 5, sodium: 50, fiber: 0 }, shopping_url: 'https://www.amazon.in/dp/B07ZZZ?tag=BioYou-21' },
    { name: 'Chaas / Buttermilk (homemade)', reason: 'Probiotics, low calorie, digestive aid', availability: 'Homemade', type: 'homemade', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 25, protein: 2, carbs: 3, fat: 0.5, sugar: 2, sodium: 60, fiber: 0 } },
    { name: 'Millet-based probiotic drink', reason: 'Traditional fermentation, gut health', availability: 'Homemade', type: 'homemade', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 35, protein: 2, carbs: 5, fat: 0.5, sugar: 2, sodium: 30, fiber: 1 } },
  ],
  ice_cream: [
    { name: 'Frozen yogurt (homemade)', reason: 'Lower fat, probiotics, controlled sugar', availability: 'Homemade', type: 'homemade', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 120, protein: 5, carbs: 20, fat: 2, sugar: 12, sodium: 30, fiber: 0 } },
    { name: 'Amul Sugar-Free ice cream', reason: 'No added sugar, diabetic friendly', availability: 'Amul parlors, Amazon', type: 'branded', score: 6.0, grade: 'B', nutrition_per_100g: { calories: 130, protein: 4, carbs: 12, fat: 6, sugar: 2, sodium: 40, fiber: 0 } },
    { name: 'Frozen fruits (mango/berry)', reason: 'Natural, no additives, high fiber', availability: 'Homemade', type: 'whole_food', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 70, protein: 1, carbs: 17, fat: 0, sugar: 14, sodium: 1, fiber: 3 } },
    { name: 'Kulfi (homemade, low sugar)', reason: 'Traditional, controlled ingredients, no stabilizers', availability: 'Homemade', type: 'homemade', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 150, protein: 5, carbs: 22, fat: 5, sugar: 14, sodium: 35, fiber: 0 } },
  ],
  chocolate: [
    { name: 'Dark chocolate (70%+ cocoa, Amul/Chokito)', reason: 'Antioxidants, less sugar, healthy fats', availability: 'Amazon, all stores', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 500, protein: 8, carbs: 35, fat: 38, sugar: 18, sodium: 5, fiber: 10 }, shopping_url: 'https://www.amazon.in/dp/B07YYY?tag=BioYou-21' },
    { name: 'Dark chocolate (85%+ cocoa)', reason: 'Minimal sugar, maximum antioxidants, low glycemic', availability: 'Amazon, specialty stores', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 490, protein: 8, carbs: 25, fat: 40, sugar: 10, sodium: 3, fiber: 12 } },
    { name: 'Dates stuffed with almonds', reason: 'Natural sweetness, healthy fats, no additives', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 280, protein: 4, carbs: 65, fat: 8, sugar: 55, sodium: 2, fiber: 7 } },
    { name: 'Cocoa nibs', reason: 'Pure cocoa, no processing, antioxidant rich', availability: 'Amazon, organic stores', type: 'whole_food', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 480, protein: 8, carbs: 30, fat: 40, sugar: 2, sodium: 5, fiber: 15 } },
  ],
  cereal: [
    { name: 'Kellogg\'s Oats (plain oats)', reason: 'No added sugar, high fiber, whole grain', availability: 'Everywhere', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 370, protein: 14, carbs: 63, fat: 6, sugar: 1, sodium: 5, fiber: 10 }, shopping_url: 'https://www.amazon.in/dp/B07XXX?tag=BioYou-21' },
    { name: 'Steel-cut oats (Saffola / True Elements)', reason: 'Lowest glycemic, no sugar, highest fiber', availability: 'Amazon, BigBasket', type: 'branded', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 360, protein: 15, carbs: 60, fat: 5, sugar: 0, sodium: 3, fiber: 12 }, shopping_url: 'https://www.amazon.in/dp/B09ABC?tag=BioYou-21' },
    { name: 'Muesli (no sugar, True Elements)', reason: 'Whole grains, nuts, seeds, no added sugar', availability: 'Amazon, BigBasket', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 390, protein: 10, carbs: 65, fat: 10, sugar: 3, sodium: 20, fiber: 10 }, shopping_url: 'https://www.amazon.in/dp/B08DEF?tag=BioYou-21' },
    { name: 'Daliya / Broken wheat porridge', reason: 'Traditional, low glycemic, mineral-rich', availability: 'Homemade', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 320, protein: 11, carbs: 68, fat: 2, sugar: 0, sodium: 3, fiber: 9 } },
    { name: 'Ragi porridge (finger millet)', reason: 'Gluten-free, highest calcium, slow digesting', availability: 'Homemade', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 340, protein: 8, carbs: 72, fat: 1, sugar: 0, sodium: 2, fiber: 11 } },
  ],
  pasta: [
    { name: 'Whole wheat pasta (Yoga / Borges)', reason: 'High fiber, no maida, lower glycemic', availability: 'Amazon, BigBasket', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 260, protein: 9, carbs: 48, fat: 3, sugar: 2, sodium: 15, fiber: 8 }, shopping_url: 'https://www.amazon.in/dp/B07PQR?tag=BioYou-21' },
    { name: 'Red lentil pasta (Tolerant)', reason: 'High protein, gluten-free, legume-based', availability: 'Amazon', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 230, protein: 18, carbs: 42, fat: 1, sugar: 2, sodium: 10, fiber: 10 }, shopping_url: 'https://www.amazon.in/dp/B08STU?tag=BioYou-21' },
    { name: 'Zucchini noodles (zoodles)', reason: 'Zero carbs, fresh vegetable-based', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 17, protein: 1, carbs: 3, fat: 0, sugar: 2, sodium: 10, fiber: 1 } },
  ],
  sauce: [
    { name: 'Homemade tomato chutney', reason: 'No preservatives, no artificial colors, controlled salt/sugar', availability: 'Homemade', type: 'homemade', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 60, protein: 1, carbs: 12, fat: 1, sugar: 8, sodium: 200, fiber: 2 } },
    { name: 'Kissan No Added Sugar Ketchup', reason: 'No added sugar, no artificial colors', availability: 'Everywhere', type: 'branded', score: 6.5, grade: 'B', nutrition_per_100g: { calories: 80, protein: 1, carbs: 18, fat: 0, sugar: 12, sodium: 600, fiber: 1 } },
    { name: 'Curd-based dip (homemade)', reason: 'Probiotics, controlled ingredients, no preservatives', availability: 'Homemade', type: 'homemade', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 40, protein: 3, carbs: 3, fat: 2, sugar: 2, sodium: 30, fiber: 0 } },
    { name: 'Green chutney (homemade)', reason: 'Fresh herbs, no processing, vitamin-rich', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 30, protein: 2, carbs: 5, fat: 1, sugar: 2, sodium: 15, fiber: 3 } },
  ],
  cooking_oil: [
    { name: 'Saffola Gold (blended rice bran + sunflower)', reason: 'Heart-friendly, low cholesterol impact, high smoke point', availability: 'Everywhere', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 900, protein: 0, carbs: 0, fat: 100, sugar: 0, sodium: 0, fiber: 0 }, shopping_url: 'https://www.amazon.in/dp/B07KLM?tag=BioYou-21' },
    { name: 'Extra Virgin Olive Oil (Figaro/Borges)', reason: 'Monounsaturated fats, antioxidants, heart healthy', availability: 'Amazon, BigBasket', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 900, protein: 0, carbs: 0, fat: 100, sugar: 0, sodium: 0, fiber: 0 }, shopping_url: 'https://www.amazon.in/dp/B08NOP?tag=BioYou-21' },
    { name: 'Cold-pressed mustard oil', reason: 'Traditional, zero processing, anti-inflammatory', availability: 'Local stores', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 900, protein: 0, carbs: 0, fat: 100, sugar: 0, sodium: 0, fiber: 0 } },
    { name: 'Ghee (A2 / Amul)', reason: 'Traditional, stable at high heat, vitamin A/D/K2', availability: 'Everywhere', type: 'branded', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 900, protein: 0, carbs: 0, fat: 100, sugar: 0, sodium: 0, fiber: 0 } },
  ],
  tea: [
    { name: 'Green tea (Tetley / Twinings)', reason: 'Antioxidants, zero calories, no sugar', availability: 'Everywhere', type: 'branded', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 1, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 1, fiber: 0 } },
    { name: 'Herbal tea (tulsi, ginger, lemon)', reason: 'Natural immunity, zero processing, no caffeine', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 1, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0, fiber: 0 } },
    { name: 'Masala chai (homemade, no sugar)', reason: 'Antioxidant spices, controlled milk, no sugar', availability: 'Homemade', type: 'homemade', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 30, protein: 2, carbs: 3, fat: 1, sugar: 2, sodium: 20, fiber: 0 } },
  ],
  coffee: [
    { name: 'Black coffee (no sugar)', reason: 'Zero calories, antioxidants, no processing', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 2, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0, fiber: 0 } },
    { name: 'Filter coffee (no sugar)', reason: 'Traditional, rich flavor, no additives', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 5, protein: 0, carbs: 1, fat: 0, sugar: 0, sodium: 2, fiber: 0 } },
    { name: 'Nescafe Gold (black)', reason: 'Pure coffee, no sugar, instant', availability: 'Everywhere', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 3, protein: 0, carbs: 1, fat: 0, sugar: 0, sodium: 1, fiber: 0 } },
  ],
  energy_drink: [
    { name: 'Coconut water', reason: 'Natural electrolytes, no artificial ingredients', availability: 'Everywhere', type: 'whole_food', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 19, protein: 0, carbs: 4, fat: 0, sugar: 3, sodium: 105, fiber: 0 } },
    { name: 'Lemon water + pinch of salt', reason: 'Electrolytes, vitamin C, zero additives', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 2, protein: 0, carbs: 1, fat: 0, sugar: 0, sodium: 50, fiber: 0 } },
    { name: 'Chaas (salted buttermilk)', reason: 'Natural electrolytes, probiotics, low calorie', availability: 'Homemade', type: 'homemade', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 25, protein: 2, carbs: 3, fat: 0.5, sugar: 2, sodium: 60, fiber: 0 } },
    { name: 'Aam Panna (raw mango drink)', reason: 'Natural, high in antioxidants, no caffeine', availability: 'Homemade', type: 'homemade', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 35, protein: 1, carbs: 7, fat: 0, sugar: 5, sodium: 10, fiber: 1 } },
  ],
  protein: [
    { name: 'Whey Protein (Asitis / MuscleBlaze)', reason: 'Clean protein, no fillers, govt lab tested', availability: 'Amazon, Tata 1mg', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 380, protein: 80, carbs: 6, fat: 2, sugar: 1, sodium: 100, fiber: 0 }, shopping_url: 'https://www.amazon.in/dp/B07LMN?tag=BioYou-21' },
    { name: 'Sattu (roasted gram flour)', reason: 'Traditional, high protein, mineral-rich, no processing', availability: 'Local stores', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 360, protein: 20, carbs: 60, fat: 5, sugar: 3, sodium: 20, fiber: 10 } },
    { name: 'Paneer / Cottage cheese', reason: 'High protein, calcium, satiating', availability: 'All stores', type: 'whole_food', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 270, protein: 18, carbs: 2, fat: 21, sugar: 1, sodium: 30, fiber: 0 } },
    { name: 'Sprouts salad', reason: 'Complete protein when combined with grains, enzyme-rich', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 120, protein: 12, carbs: 18, fat: 2, sugar: 1, sodium: 5, fiber: 8 } },
  ],
  pickle: [
    { name: 'Homemade pickle (low oil, low salt)', reason: 'Controlled ingredients, no preservatives, no coloring', availability: 'Homemade', type: 'homemade', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 60, protein: 1, carbs: 8, fat: 3, sugar: 2, sodium: 600, fiber: 2 } },
    { name: 'Mango chunda (sweet, homemade)', reason: 'Natural sweetness, no artificial color', availability: 'Homemade', type: 'homemade', score: 6.5, grade: 'B', nutrition_per_100g: { calories: 150, protein: 1, carbs: 35, fat: 0.5, sugar: 30, sodium: 200, fiber: 2 } },
    { name: 'Raw mango slices with black salt', reason: 'Minimal processing, no oil, vitamin C', availability: 'Homemade', type: 'homemade', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 30, protein: 0, carbs: 7, fat: 0, sugar: 5, sodium: 100, fiber: 1 } },
  ],
  jam: [
    { name: 'Fresh fruit (sliced)', reason: 'No sugar, fiber intact, real vitamins', availability: 'Everywhere', type: 'whole_food', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 60, protein: 1, carbs: 14, fat: 0, sugar: 10, sodium: 1, fiber: 3 } },
    { name: 'Kissan No Added Sugar Jam', reason: 'No added sugar, fruit-based sweetness', availability: 'BigBasket, Blinkit', type: 'branded', score: 6.0, grade: 'B', nutrition_per_100g: { calories: 90, protein: 0, carbs: 22, fat: 0, sugar: 18, sodium: 10, fiber: 1 } },
    { name: 'Homemade fruit preserve', reason: 'Controlled sugar, no preservatives, no artificial color', availability: 'Homemade', type: 'homemade', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 120, protein: 0, carbs: 28, fat: 0, sugar: 24, sodium: 2, fiber: 2 } },
  ],
  rusk: [
    { name: 'Ragi rusk (millet-based)', reason: 'Gluten-free, millet nutrition, less processed', availability: 'Amazon, organic stores', type: 'branded', score: 6.5, grade: 'B', nutrition_per_100g: { calories: 400, protein: 8, carbs: 70, fat: 10, sugar: 5, sodium: 250, fiber: 6 } },
    { name: 'Whole wheat toast (homemade)', reason: 'Zero preservatives, controlled ingredients', availability: 'Homemade', type: 'homemade', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 350, protein: 10, carbs: 60, fat: 5, sugar: 3, sodium: 200, fiber: 7 } },
    { name: 'Multigrain khakhra', reason: 'Roasted not fried, high fiber, no maida', availability: 'Amazon, BigBasket', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 360, protein: 10, carbs: 58, fat: 8, sugar: 2, sodium: 300, fiber: 8 }, shopping_url: 'https://www.amazon.in/dp/B0ABCD?tag=BioYou-21' },
  ],
  cake: [
    { name: 'Whole wheat banana cake (homemade)', reason: 'Natural sweetness, whole grain, no preservatives', availability: 'Homemade', type: 'homemade', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 280, protein: 6, carbs: 42, fat: 10, sugar: 14, sodium: 120, fiber: 4 } },
    { name: 'Date and nut bar (Bites by True Elements)', reason: 'No refined sugar, whole ingredients', availability: 'Amazon, BigBasket', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 350, protein: 6, carbs: 58, fat: 12, sugar: 20, sodium: 50, fiber: 8 }, shopping_url: 'https://www.amazon.in/dp/B0BCDE?tag=BioYou-21' },
    { name: 'Millet ladoo (ragi/bajra)', reason: 'Traditional, mineral-rich, natural sweetness', availability: 'Homemade', type: 'homemade', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 320, protein: 6, carbs: 50, fat: 12, sugar: 15, sodium: 10, fiber: 6 } },
  ],
  pizza: [
    { name: 'Whole wheat pizza base + homemade toppings', reason: 'Controlled cheese, fresh veggies, no preservatives', availability: 'Homemade', type: 'homemade', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 200, protein: 10, carbs: 28, fat: 5, sugar: 2, sodium: 350, fiber: 4 } },
    { name: 'Millet-based pizza base', reason: 'Gluten-free, high fiber, low glycemic', availability: 'Homemade', type: 'homemade', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 190, protein: 7, carbs: 30, fat: 4, sugar: 1, sodium: 200, fiber: 6 } },
    { name: 'Zucchini pizza boats', reason: 'Low carb, vegetable-based, high nutrition', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 60, protein: 5, carbs: 5, fat: 2, sugar: 2, sodium: 150, fiber: 2 } },
  ],
  soup: [
    { name: 'Homemade vegetable soup', reason: 'Fresh vegetables, no MSG, no preservatives', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 30, protein: 2, carbs: 5, fat: 0.5, sugar: 2, sodium: 50, fiber: 2 } },
    { name: 'Fresh tomato soup (homemade)', reason: 'Lycopene-rich, no cream, natural', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 35, protein: 1, carbs: 6, fat: 0.5, sugar: 4, sodium: 40, fiber: 1 } },
    { name: 'Knorr Soup (reduced sodium)', reason: 'Quick option, reasonable ingredients', availability: 'Everywhere', type: 'branded', score: 4.5, grade: 'C', nutrition_per_100g: { calories: 35, protein: 1, carbs: 6, fat: 0.5, sugar: 2, sodium: 350, fiber: 0 } },
  ],
  health_drink: [
    { name: 'Protinex (original)', reason: 'Balanced protein, vitamins, no excessive sugar', availability: 'Everywhere', type: 'branded', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 380, protein: 22, carbs: 55, fat: 7, sugar: 18, sodium: 200, fiber: 2 } },
    { name: 'Horlicks (less sugar variant)', reason: 'Lower sugar, fortified vitamins', availability: 'Everywhere', type: 'branded', score: 5.5, grade: 'C', nutrition_per_100g: { calories: 380, protein: 12, carbs: 76, fat: 3, sugar: 30, sodium: 250, fiber: 1 } },
    { name: 'Homemade badam milk (no sugar)', reason: 'Natural, almonds, no processing, real nutrition', availability: 'Homemade', type: 'homemade', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 120, protein: 4, carbs: 12, fat: 6, sugar: 5, sodium: 20, fiber: 1 } },
    { name: 'Sattu drink', reason: 'High protein, mineral-rich, no sugar added', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 120, protein: 8, carbs: 20, fat: 1, sugar: 1, sodium: 10, fiber: 5 } },
  ],
  paneer: [
    { name: 'Homemade paneer (toned milk)', reason: 'No preservatives, no stabilizers, higher protein', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 260, protein: 18, carbs: 3, fat: 20, sugar: 1, sodium: 35, fiber: 0 } },
    { name: 'Tofu (Nutri Soy)', reason: 'Plant protein, zero cholesterol, no animal fat', availability: 'Amazon, BigBasket', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 80, protein: 8, carbs: 2, fat: 4, sugar: 0, sodium: 5, fiber: 1 }, shopping_url: 'https://www.amazon.in/dp/B0CDEF?tag=BioYou-21' },
    { name: 'Low-fat paneer (Amul Lite)', reason: '50% less fat, same protein, fits calorie budget', availability: 'Amul parlors, Amazon', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 140, protein: 18, carbs: 3, fat: 7, sugar: 1, sodium: 35, fiber: 0 } },
  ],
  eggs: [
    { name: 'Boiled eggs', reason: 'Complete protein, zero processing, nutrient dense', availability: 'Everywhere', type: 'whole_food', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 155, protein: 13, carbs: 1, fat: 11, sugar: 0, sodium: 62, fiber: 0 } },
    { name: 'Egg white omelette', reason: 'Pure protein, zero fat, ideal for weight loss', availability: 'Homemade', type: 'whole_food', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 52, protein: 11, carbs: 0, fat: 0, sugar: 0, sodium: 55, fiber: 0 } },
    { name: 'Pasture-raised eggs', reason: 'More omega-3, better nutrition profile', availability: 'Specialty stores', type: 'whole_food', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 155, protein: 13, carbs: 1, fat: 11, sugar: 0, sodium: 62, fiber: 0 } },
  ],
  rice: [
    { name: 'Brown rice (Sampoorna / Daawat)', reason: 'High fiber, low glycemic, more nutrients', availability: 'Everywhere', type: 'whole_food', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 360, protein: 8, carbs: 76, fat: 2, sugar: 0, sodium: 4, fiber: 4 } },
    { name: 'Red rice (organic)', reason: 'Anthocyanins, high fiber, low GI', availability: 'Amazon, organic stores', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 350, protein: 8, carbs: 74, fat: 2, sugar: 0, sodium: 3, fiber: 5 } },
    { name: 'Black rice (forbidden rice)', reason: 'Highest antioxidants, high protein, gluten-free', availability: 'Amazon', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 350, protein: 9, carbs: 73, fat: 2, sugar: 0, sodium: 3, fiber: 5 } },
    { name: 'Cauliflower rice', reason: 'Zero carb, vegetable-based, keto-friendly', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 25, protein: 2, carbs: 5, fat: 0, sugar: 2, sodium: 20, fiber: 2 } },
  ],
  dal: [
    { name: 'Moong dal (split green gram)', reason: 'Easiest to digest, high protein, low flatulence', availability: 'Everywhere', type: 'whole_food', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 340, protein: 24, carbs: 60, fat: 1, sugar: 2, sodium: 15, fiber: 10 } },
    { name: 'Masoor dal (red lentil)', reason: 'Quick cooking, high iron, high protein', availability: 'Everywhere', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 350, protein: 25, carbs: 60, fat: 1, sugar: 2, sodium: 10, fiber: 8 } },
    { name: 'Chana dal (split chickpea)', reason: 'Low glycemic, high fiber, mineral-rich', availability: 'Everywhere', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 360, protein: 20, carbs: 62, fat: 2, sugar: 3, sodium: 20, fiber: 10 } },
    { name: 'Toor dal (pigeon pea)', reason: 'Traditional daily dal, good protein and iron', availability: 'Everywhere', type: 'whole_food', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 340, protein: 22, carbs: 62, fat: 1, sugar: 2, sodium: 15, fiber: 9 } },
  ],
  flour: [
    { name: 'Whole wheat atta (Aashirvaad / Shakti Bhog)', reason: '100% whole grain, no maida, high fiber', availability: 'Everywhere', type: 'whole_food', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 340, protein: 12, carbs: 72, fat: 2, sugar: 1, sodium: 3, fiber: 11 } },
    { name: 'Ragi atta (finger millet)', reason: 'Gluten-free, highest calcium grain, low glycemic', availability: 'Amazon, BigBasket', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 340, protein: 8, carbs: 72, fat: 1, sugar: 0, sodium: 2, fiber: 11 } },
    { name: 'Jowar atta (sorghum)', reason: 'Gluten-free, high iron, alkaline grain', availability: 'Amazon, BigBasket', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 340, protein: 10, carbs: 73, fat: 2, sugar: 0, sodium: 2, fiber: 9 } },
    { name: 'Besan / chickpea flour', reason: 'High protein, gluten-free, mineral-rich', availability: 'Everywhere', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 380, protein: 22, carbs: 58, fat: 6, sugar: 4, sodium: 10, fiber: 10 } },
    { name: 'Almond flour (homemade)', reason: 'Low carb, high healthy fat, keto-friendly', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 580, protein: 21, carbs: 22, fat: 50, sugar: 4, sodium: 1, fiber: 12 } },
  ],
  ghee: [
    { name: 'A2 Ghee (Pride of Cows / Amul)', reason: 'Easy to digest, higher nutritive value, pure', availability: 'Amazon, BigBasket', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 900, protein: 0, carbs: 0, fat: 100, sugar: 0, sodium: 0, fiber: 0 }, shopping_url: 'https://www.amazon.in/dp/B0EFGH?tag=BioYou-21' },
    { name: 'Organic ghee (24 Mantra)', reason: 'Organic, no additives, from pasture-raised cows', availability: 'Amazon, BigBasket', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 900, protein: 0, carbs: 0, fat: 100, sugar: 0, sodium: 0, fiber: 0 }, shopping_url: 'https://www.amazon.in/dp/B0FGHI?tag=BioYou-21' },
    { name: 'Homemade ghee (from A2 milk)', reason: 'Purity guaranteed, no adulteration', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 900, protein: 0, carbs: 0, fat: 100, sugar: 0, sodium: 0, fiber: 0 } },
  ],
  honey: [
    { name: 'Raw organic honey (Dabur / Little Bee)', reason: 'No processing, natural antibacterial, no sugar added', availability: 'Everywhere', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 304, protein: 0, carbs: 82, fat: 0, sugar: 80, sodium: 4, fiber: 0 } },
    { name: 'Forest honey (indigenous)', reason: 'Unique flavonoids, single-origin, raw', availability: 'Amazon, organic stores', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 304, protein: 0, carbs: 82, fat: 0, sugar: 80, sodium: 4, fiber: 0 } },
    { name: 'Dates as sweetener', reason: 'Natural, fiber intact, iron-rich', availability: 'Everywhere', type: 'whole_food', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 280, protein: 3, carbs: 65, fat: 0, sugar: 55, sodium: 2, fiber: 7 } },
  ],
  milk: [
    { name: 'Amul Taaza (toned milk)', reason: 'Low fat, high protein, fortified with vitamin D', availability: 'Everywhere', type: 'branded', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 45, protein: 3.5, carbs: 4.8, fat: 1.5, sugar: 4.8, sodium: 50, fiber: 0 } },
    { name: 'Buffalo milk (local dairy)', reason: 'Higher fat, creamier, traditional choice', availability: 'Local dairy', type: 'whole_food', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 100, protein: 4, carbs: 5, fat: 7, sugar: 5, sodium: 70, fiber: 0 } },
    { name: 'Almond milk (unsweetened, So Good)', reason: 'Lowest calories, lactose-free, vitamin E', availability: 'Amazon, BigBasket', type: 'branded', score: 7.5, grade: 'A', nutrition_per_100g: { calories: 24, protein: 0.6, carbs: 1.5, fat: 2, sugar: 0, sodium: 60, fiber: 0 } },
    { name: 'Oat milk (unsweetened)', reason: 'Creamy, high fiber, lactose-free', availability: 'Amazon, Blinkit', type: 'branded', score: 7.0, grade: 'B', nutrition_per_100g: { calories: 50, protein: 1, carbs: 8, fat: 1, sugar: 3, sodium: 45, fiber: 1 }, shopping_url: 'https://www.amazon.in/dp/B0GHIJ?tag=BioYou-21' },
  ],
}

// Universal fallback products for when category matching fails entirely
export const UNIVERSAL_FALLBACK: CuratedAlternative[] = [
  { name: 'Mixed nuts (almonds, walnuts, cashews)', reason: 'Healthy fats, protein, fiber, zero processing', availability: 'Everywhere', type: 'whole_food', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 550, protein: 18, carbs: 20, fat: 45, sugar: 5, sodium: 2, fiber: 10 } },
  { name: 'Fresh seasonal fruits', reason: 'Natural, vitamins, fiber, antioxidants', availability: 'Everywhere', type: 'whole_food', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 60, protein: 1, carbs: 14, fat: 0, sugar: 10, sodium: 1, fiber: 3 } },
  { name: 'Sprouts salad', reason: 'Highest nutrient density, live enzymes, complete protein', availability: 'Homemade', type: 'homemade', score: 9.0, grade: 'A', nutrition_per_100g: { calories: 120, protein: 12, carbs: 18, fat: 2, sugar: 1, sodium: 5, fiber: 8 } },
  { name: 'Raita / yogurt (homemade)', reason: 'Probiotics, protein, calcium, gut health', availability: 'Homemade', type: 'homemade', score: 8.5, grade: 'A', nutrition_per_100g: { calories: 65, protein: 5, carbs: 6, fat: 3, sugar: 4, sodium: 45, fiber: 0 } },
  { name: 'Green salad with lemon dressing', reason: 'Zero processed ingredients, vitamins, minerals', availability: 'Homemade', type: 'homemade', score: 9.5, grade: 'A', nutrition_per_100g: { calories: 25, protein: 2, carbs: 4, fat: 0.5, sugar: 1, sodium: 10, fiber: 2 } },
]

// Score-based tiered suggestions for when product has a known score but no category
export function getScoreBasedAlternatives(currentScore: number): CuratedAlternative[] {
  if (currentScore >= 7) return UNIVERSAL_FALLBACK.slice(0, 3)
  if (currentScore >= 4) return UNIVERSAL_FALLBACK
  return [
    ...UNIVERSAL_FALLBACK,
    { name: 'Homemade versions of your favorite foods', reason: 'You control ingredients, no preservatives, tailored nutrition', availability: 'Homemade', type: 'homemade', score: 8.0, grade: 'A', nutrition_per_100g: { calories: 200, protein: 10, carbs: 25, fat: 7, sugar: 5, sodium: 150, fiber: 5 } },
  ]
}

// Main lookup function
export function findCuratedAlternatives(productName: string, productCategory?: string | null, currentScore?: number): CuratedAlternative[] {
  // Try category first
  if (productCategory) {
    const lower = productCategory.toLowerCase()
    for (const keyword of Object.keys(curated)) {
      if (lower.includes(keyword)) {
        return curated[keyword]
      }
    }
  }

  // Try matching by product name keywords
  for (const [regex, categoryKey] of CATEGORY_KEYWORDS) {
    if (regex.test(productName) && curated[categoryKey]) {
      return curated[categoryKey]
    }
  }

  // Fallback to score-based
  if (currentScore !== undefined) return getScoreBasedAlternatives(currentScore)

  // Universal fallback
  return UNIVERSAL_FALLBACK
}

// Get all category keys for debugging
export function getCuratedCategoryKeys(): string[] {
  return Object.keys(curated)
}
