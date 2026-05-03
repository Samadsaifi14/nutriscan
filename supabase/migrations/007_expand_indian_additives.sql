-- NutriScan: Indian Food Additives Database Expansion
-- Run this in Supabase SQL Editor

-- First check current count
SELECT COUNT(*) as current_additives FROM additives;

-- Expand with more Indian-specific and common harmful ingredients
INSERT INTO additives (name, ins_code, e_code, risk_level, category, description, concern) VALUES
-- ========================
-- PRESERVATIVES (Indian food)
-- ========================
('Sodium Benzoate', 'INS 211', 'E211', 'high', 'preservative', 'Common in soft drinks, pickles', 'Linked to hyperactivity in children'),
('Potassium Sorbate', 'INS 202', 'E202', 'low', 'preservative', 'Mold inhibitor in preserves', 'Generally recognized as safe'),
('Sodium Nitrite', 'INS 250', 'E250', 'critical', 'preservative', 'Used in cured meats, chaat masala', 'Forms nitrosamines - probable carcinogen'),
('Sodium Nitrate', 'INS 251', 'E251', 'critical', 'preservative', 'Used in processed meats', 'Linked to cancer risk'),
('Calcium Propionate', 'INS 282', 'E282', 'low', 'preservative', 'Bread preservative', 'Generally safe'),
('Sorbic Acid', 'INS 200', 'E200', 'low', 'preservative', 'Natural preservative', 'Safe in food amounts'),
('Methylparaben', 'INS 218', 'E218', 'medium', 'preservative', 'Used in sauces, dressings', 'Possible endocrine disruptor'),
('Propylparaben', 'INS 216', 'E216', 'medium', 'preservative', 'Used in sauces', 'Possible endocrine disruptor'),
('Sodium Metabisulfite', 'INS 223', 'E223', 'medium', 'preservative', 'Used in dried fruits, potato chips', 'Can trigger allergic reactions'),
('Sulfur Dioxide', 'INS 220', 'E220', 'medium', 'preservative', 'Used in preserved fruits', 'Can trigger allergic reactions'),
('BHA', 'INS 320', 'E320', 'high', 'antioxidant', 'In chips, instant noodles', 'Possible carcinogen'),
('BHT', 'INS 321', 'E321', 'medium', 'antioxidant', 'In fried snacks', 'Potential endocrine disruptor'),
('TBHQ', 'INS 319', 'E319', 'medium', 'antioxidant', 'In fast food oils, chips', 'High doses linked to vision disturbances'),
('Citric Acid', 'INS 330', 'E330', 'safe', 'acidity', 'Natural acid in citrus', 'Safe'),
('Ascorbic Acid', 'INS 300', 'E300', 'safe', 'antioxidant', 'Vitamin C', 'Safe'),
('Tocopherol', 'INS 306', 'E306', 'safe', 'antioxidant', 'Vitamin E', 'Safe'),

-- ========================
-- ARTIFICIAL COLORS (common in Indian sweets, snacks)
-- ========================
('Tartrazine', 'INS 102', 'E102', 'high', 'color', 'Yellow color in snacks, sweets', 'Linked to hyperactivity, banned in several countries'),
('Sunset Yellow', 'INS 110', 'E110', 'high', 'color', 'Orange-yellow in chips, biscuits', 'Requires warning labels in EU'),
('Allura Red', 'INS 129', 'E129', 'high', 'color', 'Red in candies, drinks', 'Linked to hyperactivity in children'),
('Carmine', 'INS 120', 'E120', 'medium', 'color', 'Red from insects - not vegetarian', 'May cause allergic reactions'),
('Erythrosine', 'INS 127', 'E127', 'critical', 'color', 'Pink/red in cherries', 'Thyroid tumor risk in animals'),
('Brilliant Blue', 'INS 133', 'E133', 'medium', 'color', 'Blue in ice creams, drinks', 'May cause allergic reactions'),
('Fast Green', 'INS 143', 'E143', 'medium', 'color', 'Green in sauces', 'May cause allergic reactions'),
('Indigo Carmine', 'INS 132', 'E132', 'medium', 'color', 'Blue in ice creams', 'May cause allergic reactions'),
('Annatto', 'INS 160b', 'E160b', 'low', 'color', 'Orange-red from seeds', 'Generally safe but can cause allergies'),
('Paprika Extract', 'INS 160c', 'E160c', 'safe', 'color', 'Natural red from paprika', 'Safe'),
('Caramel', 'INS 150a', 'E150a', 'low', 'color', 'Brown color from sugar', 'Safe'),
('Caramel Color', 'INS 150d', 'E150d', 'medium', 'color', 'In colas, soy sauce', 'Contains potentially carcinogenic compounds'),
('Titanium Dioxide', 'INS 171', 'E171', 'medium', 'color', 'White in candies, icing', 'May cause DNA damage'),

-- ========================
-- ARTIFICIAL SWEETENERS (in diet/zero products)
-- ========================
('Aspartame', 'INS 951', 'E951', 'medium', 'sweetener', 'In diet sodas, sugar-free', 'Classified as possibly carcinogenic'),
('Acesulfame K', 'INS 950', 'E950', 'low', 'sweetener', 'In diet drinks', 'Some animal studies suggest metabolic effects'),
('Sucralose', 'INS 955', 'E955', 'low', 'sweetener', 'In diet products', 'May alter gut microbiome'),
('Saccharin', 'INS 954', 'E954', 'low', 'sweetener', 'Oldest artificial sweetener', 'May cause bladder tumors in rats'),
('Stevia', 'INS 960', 'E960', 'safe', 'sweetener', 'Natural from plant', 'Generally safe'),
('Neotame', 'INS 961', 'E961', 'low', 'sweetener', 'Similar to aspartame', 'Generally safe in small amounts'),
('Sucrose', NULL, NULL, 'safe', 'sweetener', 'Table sugar', 'Safe in moderation'),

-- ========================
-- FLAVOR ENHANCERS (common in Indian snacks)
-- ========================
('Monosodium Glutamate', 'INS 621', 'E621', 'low', 'flavor', 'MSG in instant noodles, chips', 'FDA considers GRAS but some report headaches'),
('Disodium Inosinate', 'INS 631', 'E631', 'low', 'flavor', 'Flavor enhancer', 'Generally safe'),
('Disodium Guanylate', 'INS 627', 'E627', 'low', 'flavor', 'Flavor enhancer', 'Generally safe'),
('Ribonucleotides', 'INS 635', 'E635', 'low', 'flavor', 'Flavor enhancer mix', 'Generally safe'),
('Salt', NULL, NULL, 'medium', 'other', 'Sodium chloride', 'Excess sodium - monitor intake'),
('Sodium Chloride', NULL, NULL, 'medium', 'other', 'Table salt', 'Excess sodium - monitor intake'),
('Trisodium Phosphate', 'INS 339', 'E339', 'high', 'other', 'In cheese, cereals', 'High sodium, may affect calcium absorption'),

-- ========================
-- EMULSIFIERS & STABILIZERS
-- ========================
('Carrageenan', 'INS 407', 'E407', 'medium', 'emulsifier', 'In ice cream, milk', 'Degraded form is inflammatory'),
('Polysorbate 80', 'INS 433', 'E433', 'medium', 'emulsifier', 'In ice cream, mayonnaise', 'May disrupt gut microbiota'),
('Polysorbate 60', 'INS 435', 'E435', 'medium', 'emulsifier', 'In baked goods', 'May disrupt gut microbiota'),
('Xanthan Gum', 'INS 415', 'E415', 'safe', 'thickener', 'Fermentation-derived', 'Generally safe'),
('Guar Gum', 'INS 412', 'E412', 'safe', 'thickener', 'From guar beans', 'Generally safe'),
('Lecithin', 'INS 322', 'E322', 'safe', 'emulsifier', 'From soy/eggs', 'Generally safe'),
('Mono- and Diglycerides', 'INS 471', 'E471', 'low', 'emulsifier', 'From fats', 'Generally safe'),
('Citric Acid Esters', 'INS 472c', 'E472c', 'safe', 'emulsifier', 'From citric acid', 'Safe'),
('Sodium Alginate', 'INS 401', 'E401', 'safe', 'thickener', 'From seaweed', 'Safe'),
('Pectin', 'INS 440', 'E440', 'safe', 'thickener', 'From fruit', 'Safe'),
('Cellulose', 'INS 460', 'E460', 'safe', 'thickener', 'Plant fiber', 'Safe'),

-- ========================
-- HIGH RISK INDIAN FOOD INGREDIENTS
-- ========================
('Refined Flour', NULL, NULL, 'medium', 'other', 'Maida - white flour', 'High glycemic, low fiber'),
('Maida', NULL, NULL, 'medium', 'other', 'Refined wheat flour', 'High glycemic, low nutrition'),
('Refined Sugar', NULL, NULL, 'medium', 'other', 'White sugar', 'High sugar content'),
('Maltodextrin', 'INS 1400', 'E1400', 'medium', 'other', 'Processed carbohydrate', 'High glycemic, may affect gut health'),
('Dextrose', 'INS 1400', 'E1400', 'medium', 'other', 'Glucose from corn', 'High glycemic'),
('High Fructose Corn Syrup', NULL, NULL, 'high', 'other', 'Liquid sweetener', 'Linked to obesity and fatty liver'),
('Glucose Syrup', 'INS 1400', 'E1400', 'medium', 'other', 'Liquid sweetener', 'High sugar content'),
('Inverted Sugar Syrup', 'INS 1400', 'E1400', 'medium', 'other', 'Liquid sweetener', 'High sugar content'),
('Palm Oil', NULL, NULL, 'medium', 'other', 'Common cooking oil', 'High in saturated fats'),
('Hydrogenated Vegetable Oil', 'INS 472a', 'E472a', 'high', 'other', 'Vanaspati/ghee substitute', 'Contains trans fats'),
('Partially Hydrogenated Oil', NULL, NULL, 'high', 'other', 'Dalda/type', 'Contains trans fats - banned in India but still found'),
('Trans Fat', NULL, NULL, 'critical', 'other', 'Artificially hardened fats', 'Strongly linked to cardiovascular disease'),
('Vegetable Shortening', NULL, NULL, 'high', 'other', 'Solid cooking fat', 'Often contains trans fats'),
('Margarine', NULL, NULL, 'medium', 'other', 'Butter substitute', 'May contain trans fats'),

-- ========================
-- FOOD STARCHES & MODIFIERS
-- ========================
('Modified Corn Starch', 'INS 1400', 'E1400', 'low', 'other', 'Modified starch', 'Generally safe'),
('Modified Tapioca Starch', 'INS 1400', 'E1400', 'low', 'other', 'Modified starch', 'Generally safe'),
('Modified Potato Starch', 'INS 1400', 'E1400', 'low', 'other', 'Modified starch', 'Generally safe'),
('Wheat Starch', 'INS 1400', 'E1400', 'low', 'other', 'Wheat-derived', 'Safe'),
('Rice Starch', 'INS 1400', 'E1400', 'low', 'other', 'Rice-derived', 'Safe'),
('Wheat Gluten', NULL, NULL, 'low', 'other', 'Gluten protein', 'Avoid for celiac'),

-- ========================
-- ACIDITY REGULATORS (common in Indian pickles, chaat)
-- ========================
('Acetic Acid', 'INS 260', 'E260', 'safe', 'acidity', 'Vinegar', 'Safe'),
('Lactic Acid', 'INS 270', 'E270', 'safe', 'acidity', 'In pickles, yogurt', 'Safe'),
('Fumaric Acid', 'INS 297', 'E297', 'low', 'acidity', 'In candies', 'Safe in food amounts'),
('Malic Acid', 'INS 296', 'E296', 'safe', 'acidity', 'In fruits', 'Safe'),
('Tartaric Acid', 'INS 334', 'E334', 'safe', 'acidity', 'In fruits', 'Safe'),
('Phosphoric Acid', 'INS 338', 'E338', 'medium', 'acidity', 'In colas', 'May affect calcium absorption'),
('Sodium Citrate', 'INS 331', 'E331', 'safe', 'acidity', 'Salt of citric acid', 'Safe'),
('Potassium Chloride', 'INS 508', 'E508', 'low', 'other', 'Salt substitute', 'Safe in moderation'),

-- ========================
-- INDIAN SPICES & FLAVORS (preservatives in spice mixes)
-- ========================
('Sodium Nitrite', 'INS 250', 'E250', 'critical', 'preservative', 'In chaat masala, some spice blends', 'Forms nitrosamines - carcinogen'),
('Paprika Oleoresin', 'INS 160c', 'E160c', 'safe', 'color', 'Natural color from paprika', 'Safe'),
('Turmeric Oleoresin', 'INS 160a', 'E160a', 'safe', 'color', 'Natural color from turmeric', 'Safe'),
('Chilli Oleoresin', 'INS 160c', 'E160c', 'safe', 'color', 'Natural color from chili', 'Safe'),

-- ========================
-- ALLERGENS (common in Indian food)
-- ========================
('Milk Solids', NULL, NULL, 'low', 'other', 'Dried milk', 'Dairy allergen'),
('Milk Protein', NULL, NULL, 'low', 'other', 'Casein/whey', 'Dairy allergen'),
('Lactose', 'INS 270', 'E270', 'low', 'other', 'Milk sugar', 'Dairy allergen, lactose intolerant'),
('Wheat', NULL, NULL, 'low', 'other', 'Wheat gluten', 'Gluten allergen'),
('Soya', NULL, NULL, 'low', 'other', 'Soybean protein', 'Soy allergen'),
('Soya Lecithin', 'INS 322', 'E322', 'low', 'emulsifier', 'Soy-derived', 'Soy allergen'),
('Peanut Oil', NULL, NULL, 'low', 'other', 'Groundnut oil', 'Peanut allergen'),
('Sesame', 'INS 471', 'E471', 'low', 'other', 'Til', 'Sesame allergen'),
('Tree Nuts', NULL, NULL, 'low', 'other', 'Almond, cashew etc', 'Nut allergen'),

-- ========================
-- COMMON IN INDIAN INSTANT NOODLES & SNACKS
-- ========================
('Palm Olein', NULL, NULL, 'medium', 'other', 'Refined palm oil', 'High in saturated fats'),
('Rice Bran Oil', NULL, NULL, 'low', 'other', 'Rice bran extracted', 'Generally healthy'),
('Sunflower Oil', NULL, NULL, 'low', 'other', 'Sunflower seed oil', 'Generally healthy'),
('Rapeseed Oil', NULL, NULL, 'low', 'other', 'Mustard/canola oil', 'Generally healthy'),
('Indigo', NULL, NULL, 'medium', 'color', 'Synthetic blue color', 'May cause allergic reactions'),

-- ========================
-- BAKING INGREDIENTS (in Indian baked goods)
-- ========================
('Sodium Aluminium Phosphate', 'INS 541', 'E541', 'medium', 'other', 'Baking powder', 'Contains aluminium'),
('Calcium Aluminium Phosphate', 'INS 541', 'E541', 'medium', 'other', 'Baking powder', 'Contains aluminium'),
('Ammonium Chloride', 'INS 510', 'E510', 'low', 'other', 'Leavening agent', 'Safe in small amounts'),
('Ammonium Bicarbonate', 'INS 503', 'E503', 'low', 'other', 'Baking agent', 'Safe'),
('Sodium Acid Pyrophosphate', 'INS 450', 'E450', 'low', 'other', 'Baking powder', 'Safe'),
('Calcium Carbonate', 'INS 170', 'E170', 'safe', 'other', 'Chalk/limestone', 'Safe')

ON CONFLICT (name) DO NOTHING;

-- Verify count
SELECT COUNT(*) as new_total FROM additives;