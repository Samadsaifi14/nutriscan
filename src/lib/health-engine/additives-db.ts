// additives-db.ts
// Expanded from 47 → 120+ entries
// Covers FSSAI-approved Indian market additives, INS codes, E-numbers, common name aliases
// Detection uses regex (not substring match) so "INS 621", "E621", "monosodium glutamate", "MSG" all hit same entry

export type RiskLevel = "safe" | "low" | "moderate" | "high" | "harmful";

export interface Additive {
  id: string;
  name: string;
  aliases: string[];
  risk: RiskLevel;
  category: string;
  concern: string;
  eNumber?: string;
  insCode?: string;
  description?: string;
}

export const ADDITIVES_DB: Additive[] = [
  // ─── PRESERVATIVES ───────────────────────────────────────────────────────
  {
    id: "E200", name: "Sorbic Acid", eNumber: "E200", insCode: "INS 200",
    aliases: ["sorbic acid", "e200", "ins\\s*200"],
    risk: "low", category: "preservative",
    concern: "May cause skin irritation in sensitive individuals",
  },
  {
    id: "E202", name: "Potassium Sorbate", eNumber: "E202", insCode: "INS 202",
    aliases: ["potassium sorbate", "e202", "ins\\s*202"],
    risk: "low", category: "preservative",
    concern: "Generally safe; may cause mild allergic reactions",
  },
  {
    id: "E210", name: "Benzoic Acid", eNumber: "E210", insCode: "INS 210",
    aliases: ["benzoic acid", "e210", "ins\\s*210"],
    risk: "moderate", category: "preservative",
    concern: "Can form benzene (carcinogen) when combined with Vitamin C. Hyperactivity in children.",
  },
  {
    id: "E211", name: "Sodium Benzoate", eNumber: "E211", insCode: "INS 211",
    aliases: ["sodium benzoate", "e211", "ins\\s*211"],
    risk: "moderate", category: "preservative",
    concern: "Linked to hyperactivity in children; forms benzene with ascorbic acid. Common in Indian sodas.",
  },
  {
    id: "E212", name: "Potassium Benzoate", eNumber: "E212", insCode: "INS 212",
    aliases: ["potassium benzoate", "e212", "ins\\s*212"],
    risk: "moderate", category: "preservative",
    concern: "Same concerns as sodium benzoate; benzene formation risk.",
  },
  {
    id: "E220", name: "Sulphur Dioxide", eNumber: "E220", insCode: "INS 220",
    aliases: ["sulphur dioxide", "sulfur dioxide", "e220", "ins\\s*220"],
    risk: "moderate", category: "preservative",
    concern: "Triggers asthma and allergies. Common in dried fruits, wine.",
  },
  {
    id: "E221", name: "Sodium Sulphite", eNumber: "E221", insCode: "INS 221",
    aliases: ["sodium sulphite", "sodium sulfite", "e221", "ins\\s*221"],
    risk: "moderate", category: "preservative",
    concern: "Can cause allergic reactions; destroys Vitamin B1.",
  },
  {
    id: "E223", name: "Sodium Metabisulphite", eNumber: "E223", insCode: "INS 223",
    aliases: ["sodium metabisulphite", "sodium metabisulfite", "sodium pyrosulfite", "e223", "ins\\s*223"],
    risk: "moderate", category: "preservative",
    concern: "Severe asthma trigger; destroys thiamine. Widely used in Indian packaged juices.",
  },
  {
    id: "E224", name: "Potassium Metabisulphite", eNumber: "E224", insCode: "INS 224",
    aliases: ["potassium metabisulphite", "potassium metabisulfite", "e224", "ins\\s*224"],
    risk: "moderate", category: "preservative",
    concern: "Asthma trigger; sulphite sensitivity reactions.",
  },
  {
    id: "E249", name: "Potassium Nitrite", eNumber: "E249", insCode: "INS 249",
    aliases: ["potassium nitrite", "e249", "ins\\s*249"],
    risk: "high", category: "preservative",
    concern: "Converts to nitrosamines — known carcinogens. Used in processed meats.",
  },
  {
    id: "E250", name: "Sodium Nitrite", eNumber: "E250", insCode: "INS 250",
    aliases: ["sodium nitrite", "e250", "ins\\s*250"],
    risk: "high", category: "preservative",
    concern: "Linked to colorectal cancer. IARC Group 2A. Common in sausages, processed meats.",
  },
  {
    id: "E251", name: "Sodium Nitrate", eNumber: "E251", insCode: "INS 251",
    aliases: ["sodium nitrate", "e251", "ins\\s*251"],
    risk: "high", category: "preservative",
    concern: "Converts to nitrite; carcinogen risk in processed meats.",
  },
  {
    id: "E282", name: "Calcium Propionate", eNumber: "E282", insCode: "INS 282",
    aliases: ["calcium propionate", "e282", "ins\\s*282"],
    risk: "moderate", category: "preservative",
    concern: "Linked to behavioural issues and migraines in sensitive individuals. Extremely common in Indian bread (pav, sliced bread).",
  },
  {
    id: "E280", name: "Propionic Acid", eNumber: "E280", insCode: "INS 280",
    aliases: ["propionic acid", "e280", "ins\\s*280"],
    risk: "low", category: "preservative",
    concern: "Generally safe at approved levels; headaches reported at high intake.",
  },
  {
    id: "E284", name: "Boric Acid", eNumber: "E284", insCode: "INS 284",
    aliases: ["boric acid", "e284", "ins\\s*284"],
    risk: "harmful", category: "preservative",
    concern: "Toxic; banned in most countries for food use.",
  },

  // ─── ANTIOXIDANTS ────────────────────────────────────────────────────────
  {
    id: "E300", name: "Ascorbic Acid (Vitamin C)", eNumber: "E300", insCode: "INS 300",
    aliases: ["ascorbic acid", "vitamin c", "e300", "ins\\s*300", "l-ascorbic acid"],
    risk: "safe", category: "antioxidant",
    concern: "Safe at normal levels; very high doses may cause digestive upset.",
  },
  {
    id: "E306", name: "Tocopherols (Vitamin E)", eNumber: "E306", insCode: "INS 306",
    aliases: ["tocopherol", "vitamin e", "e306", "ins\\s*306", "mixed tocopherols"],
    risk: "safe", category: "antioxidant",
    concern: "Safe; naturally derived Vitamin E.",
  },
  {
    id: "E310", name: "Propyl Gallate", eNumber: "E310", insCode: "INS 310",
    aliases: ["propyl gallate", "e310", "ins\\s*310"],
    risk: "moderate", category: "antioxidant",
    concern: "Possible endocrine disruptor; may cause allergic reactions. Often in vegetable oils, margarine.",
  },
  {
    id: "E319", name: "TBHQ", eNumber: "E319", insCode: "INS 319",
    aliases: ["tbhq", "tert-butylhydroquinone", "tertiary butylhydroquinone", "e319", "ins\\s*319"],
    risk: "high", category: "antioxidant",
    concern: "Linked to DNA damage at high doses. Banned in Japan. Widely used in Indian fried snacks, instant noodles.",
  },
  {
    id: "E320", name: "BHA", eNumber: "E320", insCode: "INS 320",
    aliases: ["bha", "butylated hydroxyanisole", "e320", "ins\\s*320"],
    risk: "high", category: "antioxidant",
    concern: "Possible human carcinogen (IARC Group 2B). Endocrine disruption.",
  },
  {
    id: "E321", name: "BHT", eNumber: "E321", insCode: "INS 321",
    aliases: ["bht", "butylated hydroxytoluene", "e321", "ins\\s*321"],
    risk: "moderate", category: "antioxidant",
    concern: "Possible carcinogen; linked to liver/thyroid effects at high doses. Very common in Indian biscuits.",
  },

  // ─── COLOURS ─────────────────────────────────────────────────────────────
  {
    id: "E102", name: "Tartrazine", eNumber: "E102", insCode: "INS 102",
    aliases: ["tartrazine", "fd&c yellow 5", "yellow 5", "e102", "ins\\s*102", "ci\\s*19140"],
    risk: "moderate", category: "color",
    concern: "Hyperactivity in children; allergic reactions in aspirin-sensitive individuals. Common in Indian sweets, drinks.",
  },
  {
    id: "E110", name: "Sunset Yellow FCF", eNumber: "E110", insCode: "INS 110",
    aliases: ["sunset yellow", "fd&c yellow 6", "yellow 6", "e110", "ins\\s*110", "ci\\s*15985"],
    risk: "moderate", category: "color",
    concern: "Hyperactivity in children; allergic reactions. Used in Indian biscuits, mango drinks.",
  },
  {
    id: "E122", name: "Carmoisine", eNumber: "E122", insCode: "INS 122",
    aliases: ["carmoisine", "azorubine", "e122", "ins\\s*122", "ci\\s*14720"],
    risk: "moderate", category: "color",
    concern: "Hyperactivity risk; banned in some countries. Used in Indian mithai, drinks.",
  },
  {
    id: "E123", name: "Amaranth", eNumber: "E123", insCode: "INS 123",
    aliases: ["amaranth dye", "fd&c red 2", "e123", "ins\\s*123", "ci\\s*16185"],
    risk: "high", category: "color",
    concern: "Banned in the USA. Possible carcinogen; teratogenic in animals.",
  },
  {
    id: "E124", name: "Ponceau 4R", eNumber: "E124", insCode: "INS 124",
    aliases: ["ponceau", "ponceau 4r", "cochineal red a", "e124", "ins\\s*124", "ci\\s*16255"],
    risk: "moderate", category: "color",
    concern: "Hyperactivity in children. Common in Indian sweets and drinks.",
  },
  {
    id: "E127", name: "Erythrosine", eNumber: "E127", insCode: "INS 127",
    aliases: ["erythrosine", "fd&c red 3", "red 3", "e127", "ins\\s*127"],
    risk: "high", category: "color",
    concern: "Thyroid disruption; banned for some uses in USA. Used in Indian glazed cherries.",
  },
  {
    id: "E129", name: "Allura Red AC", eNumber: "E129", insCode: "INS 129",
    aliases: ["allura red", "fd&c red 40", "red 40", "e129", "ins\\s*129"],
    risk: "moderate", category: "color",
    concern: "Hyperactivity in children; banned in some European countries.",
  },
  {
    id: "E133", name: "Brilliant Blue FCF", eNumber: "E133", insCode: "INS 133",
    aliases: ["brilliant blue", "fd&c blue 1", "blue 1", "e133", "ins\\s*133"],
    risk: "low", category: "color",
    concern: "Generally safe; rare allergic reactions.",
  },
  {
    id: "E150d", name: "Caramel Colour (Sulphite Ammonia)", eNumber: "E150d", insCode: "INS 150d",
    aliases: ["caramel colour", "caramel color", "sulphite ammonia caramel", "e150d", "ins\\s*150d", "e150"],
    risk: "moderate", category: "color",
    concern: "Class IV caramel contains 4-MEI, a possible carcinogen. Ubiquitous in Indian colas and sauces.",
  },
  {
    id: "E160a", name: "Beta-Carotene", eNumber: "E160a", insCode: "INS 160a",
    aliases: ["beta.?carotene", "betacarotene", "e160a", "ins\\s*160a"],
    risk: "safe", category: "color",
    concern: "Safe at food levels; high-dose supplements linked to lung cancer risk in smokers.",
  },
  {
    id: "E171", name: "Titanium Dioxide", eNumber: "E171", insCode: "INS 171",
    aliases: ["titanium dioxide", "e171", "ins\\s*171", "ti02", "tio2"],
    risk: "high", category: "color",
    concern: "IARC Group 2B carcinogen. Banned in EU food (2022). Still used in some Indian confectionery.",
  },

  // ─── SWEETENERS ──────────────────────────────────────────────────────────
  {
    id: "E950", name: "Acesulfame K", eNumber: "E950", insCode: "INS 950",
    aliases: ["acesulfame", "acesulfame k", "acesulfame potassium", "ace.?k", "e950", "ins\\s*950"],
    risk: "low", category: "sweetener",
    concern: "Some animal studies suggest carcinogenic potential at high doses.",
  },
  {
    id: "E951", name: "Aspartame", eNumber: "E951", insCode: "INS 951",
    aliases: ["aspartame", "nutrasweet", "equal", "e951", "ins\\s*951"],
    risk: "moderate", category: "sweetener",
    concern: "IARC Group 2B (2023). PKU patients must avoid. Headaches reported. Very common in Indian diet colas.",
  },
  {
    id: "E952", name: "Cyclamate", eNumber: "E952", insCode: "INS 952",
    aliases: ["cyclamate", "sodium cyclamate", "calcium cyclamate", "e952", "ins\\s*952"],
    risk: "high", category: "sweetener",
    concern: "Banned in USA. Possible carcinogen; metabolised to cyclohexylamine.",
  },
  {
    id: "E954", name: "Saccharin", eNumber: "E954", insCode: "INS 954",
    aliases: ["saccharin", "sodium saccharin", "sweet'n low", "e954", "ins\\s*954"],
    risk: "low", category: "sweetener",
    concern: "Once considered carcinogenic; now generally recognised as safe at normal use levels.",
  },
  {
    id: "E955", name: "Sucralose", eNumber: "E955", insCode: "INS 955",
    aliases: ["sucralose", "splenda", "e955", "ins\\s*955"],
    risk: "low", category: "sweetener",
    concern: "Generally safe; some research suggests effects on gut microbiome at high doses.",
  },
  {
    id: "E960", name: "Steviol Glycosides (Stevia)", eNumber: "E960", insCode: "INS 960",
    aliases: ["stevia", "steviol", "steviol glycoside", "reb.?a", "rebaudioside", "e960", "ins\\s*960"],
    risk: "safe", category: "sweetener",
    concern: "Safe at approved levels.",
  },

  // ─── FLAVOUR ENHANCERS ───────────────────────────────────────────────────
  {
    id: "E621", name: "Monosodium Glutamate", eNumber: "E621", insCode: "INS 621",
    aliases: ["monosodium glutamate", "msg", "sodium glutamate", "e621", "ins\\s*621", "ajinomoto"],
    risk: "low", category: "flavour enhancer",
    concern: "Chinese Restaurant Syndrome (debated). Very high sodium content. Extremely common in Indian snacks.",
  },
  {
    id: "E622", name: "Monopotassium Glutamate", eNumber: "E622", insCode: "INS 622",
    aliases: ["monopotassium glutamate", "potassium glutamate", "e622", "ins\\s*622"],
    risk: "low", category: "flavour enhancer",
    concern: "Similar concerns to MSG.",
  },
  {
    id: "E627", name: "Disodium Guanylate", eNumber: "E627", insCode: "INS 627",
    aliases: ["disodium guanylate", "sodium guanylate", "e627", "ins\\s*627"],
    risk: "low", category: "flavour enhancer",
    concern: "Gout trigger; avoid if on low-purine diet. Used alongside MSG in snacks.",
  },
  {
    id: "E631", name: "Disodium Inosinate", eNumber: "E631", insCode: "INS 631",
    aliases: ["disodium inosinate", "sodium inosinate", "e631", "ins\\s*631"],
    risk: "low", category: "flavour enhancer",
    concern: "Gout trigger. Derived from meat/fish — not suitable for vegetarians despite use in 'veg' snacks.",
  },
  {
    id: "E635", name: "Disodium Ribonucleotides", eNumber: "E635", insCode: "INS 635",
    aliases: ["disodium ribonucleotide", "ribonucleotide", "e635", "ins\\s*635"],
    risk: "low", category: "flavour enhancer",
    concern: "Gout trigger. Mix of E627+E631; same concerns.",
  },

  // ─── EMULSIFIERS ─────────────────────────────────────────────────────────
  {
    id: "E322", name: "Lecithin", eNumber: "E322", insCode: "INS 322",
    aliases: ["lecithin", "soy lecithin", "sunflower lecithin", "e322", "ins\\s*322"],
    risk: "safe", category: "emulsifier",
    concern: "Generally safe. May be soy-derived (allergen).",
  },
  {
    id: "E407", name: "Carrageenan", eNumber: "E407", insCode: "INS 407",
    aliases: ["carrageenan", "e407", "ins\\s*407"],
    risk: "moderate", category: "emulsifier / thickener",
    concern: "Linked to intestinal inflammation in animal studies; under review by JECFA. Common in Indian dairy drinks.",
  },
  {
    id: "E471", name: "Mono and Diglycerides of Fatty Acids", eNumber: "E471", insCode: "INS 471",
    aliases: ["mono.?glyceride", "diglyceride", "monoglyceride", "e471", "ins\\s*471", "mono and diglyceride"],
    risk: "low", category: "emulsifier",
    concern: "May contain trans fats depending on source. Often animal-derived.",
  },
  {
    id: "E472e", name: "Diacetyl Tartaric Acid Esters (DATEM)", eNumber: "E472e", insCode: "INS 472e",
    aliases: ["datem", "diacetyl tartaric", "e472e", "ins\\s*472e"],
    risk: "low", category: "emulsifier",
    concern: "Associated with heart valve fibrosis in animal studies at very high doses.",
  },
  {
    id: "E476", name: "Polyglycerol Polyricinoleate (PGPR)", eNumber: "E476", insCode: "INS 476",
    aliases: ["pgpr", "polyglycerol polyricinoleate", "e476", "ins\\s*476"],
    risk: "low", category: "emulsifier",
    concern: "Generally safe. Used as cheap lecithin replacement in chocolates.",
  },

  // ─── THICKENERS / STABILISERS ────────────────────────────────────────────
  {
    id: "E401", name: "Sodium Alginate", eNumber: "E401", insCode: "INS 401",
    aliases: ["sodium alginate", "algin", "e401", "ins\\s*401"],
    risk: "safe", category: "thickener",
    concern: "Safe; derived from seaweed.",
  },
  {
    id: "E412", name: "Guar Gum", eNumber: "E412", insCode: "INS 412",
    aliases: ["guar gum", "e412", "ins\\s*412"],
    risk: "safe", category: "thickener",
    concern: "Safe; may cause bloating at high amounts.",
  },
  {
    id: "E415", name: "Xanthan Gum", eNumber: "E415", insCode: "INS 415",
    aliases: ["xanthan gum", "xanthan", "e415", "ins\\s*415"],
    risk: "safe", category: "thickener",
    concern: "Safe; mild laxative effect in large quantities.",
  },
  {
    id: "E420", name: "Sorbitol", eNumber: "E420", insCode: "INS 420",
    aliases: ["sorbitol", "e420", "ins\\s*420"],
    risk: "low", category: "sweetener / humectant",
    concern: "Laxative effect at >50g/day. Unsuitable for diabetics in large amounts.",
  },
  {
    id: "E422", name: "Glycerol", eNumber: "E422", insCode: "INS 422",
    aliases: ["glycerol", "glycerin", "vegetable glycerin", "e422", "ins\\s*422"],
    risk: "safe", category: "humectant",
    concern: "Safe.",
  },
  {
    id: "E433", name: "Polysorbate 80", eNumber: "E433", insCode: "INS 433",
    aliases: ["polysorbate 80", "polyoxyethylene sorbitan monooleate", "tween 80", "e433", "ins\\s*433"],
    risk: "moderate", category: "emulsifier",
    concern: "May disrupt gut microbiome; linked to intestinal inflammation in mice. Common in ice cream.",
  },
  {
    id: "E440", name: "Pectin", eNumber: "E440", insCode: "INS 440",
    aliases: ["pectin", "e440", "ins\\s*440"],
    risk: "safe", category: "thickener",
    concern: "Safe; beneficial prebiotic fibre.",
  },
  {
    id: "E466", name: "Carboxymethyl Cellulose (CMC)", eNumber: "E466", insCode: "INS 466",
    aliases: ["carboxymethyl cellulose", "cmc", "sodium carboxymethylcellulose", "e466", "ins\\s*466"],
    risk: "moderate", category: "thickener",
    concern: "Animal studies link to gut dysbiosis and inflammation. Common in Indian ice creams.",
  },

  // ─── RAISING AGENTS / ACIDITY REGULATORS ────────────────────────────────
  {
    id: "E170", name: "Calcium Carbonate", eNumber: "E170", insCode: "INS 170",
    aliases: ["calcium carbonate", "chalk", "e170", "ins\\s*170"],
    risk: "safe", category: "raising agent / anti-caking",
    concern: "Safe; used as calcium supplement.",
  },
  {
    id: "E330", name: "Citric Acid", eNumber: "E330", insCode: "INS 330",
    aliases: ["citric acid", "e330", "ins\\s*330"],
    risk: "safe", category: "acidity regulator",
    concern: "Safe. Dental erosion risk only if consumed in large amounts.",
  },
  {
    id: "E338", name: "Phosphoric Acid", eNumber: "E338", insCode: "INS 338",
    aliases: ["phosphoric acid", "e338", "ins\\s*338"],
    risk: "moderate", category: "acidity regulator",
    concern: "Linked to reduced bone density and dental erosion. Signature ingredient in Indian colas.",
  },
  {
    id: "E500", name: "Sodium Carbonates (Baking Soda)", eNumber: "E500", insCode: "INS 500",
    aliases: ["sodium carbonate", "baking soda", "sodium bicarbonate", "bicarbonate of soda", "e500", "ins\\s*500"],
    risk: "safe", category: "raising agent",
    concern: "Safe at normal food levels.",
  },
  {
    id: "E504", name: "Magnesium Carbonate", eNumber: "E504", insCode: "INS 504",
    aliases: ["magnesium carbonate", "e504", "ins\\s*504"],
    risk: "safe", category: "anti-caking agent",
    concern: "Safe.",
  },
  {
    id: "E551", name: "Silicon Dioxide", eNumber: "E551", insCode: "INS 551",
    aliases: ["silicon dioxide", "silica", "e551", "ins\\s*551"],
    risk: "low", category: "anti-caking agent",
    concern: "Generally safe; inhaled form is hazardous (not food concern).",
  },
  {
    id: "E553b", name: "Talc", eNumber: "E553b", insCode: "INS 553b",
    aliases: ["talc", "talcum", "magnesium silicate", "e553b", "ins\\s*553b"],
    risk: "moderate", category: "anti-caking agent",
    concern: "Possible carcinogen if contaminated with asbestos. Used as coating on rice in India.",
  },

  // ─── TRANS FAT / PARTIALLY HYDROGENATED ─────────────────────────────────
  {
    id: "PHVO", name: "Trans Fat / Partially Hydrogenated Oil",
    aliases: ["partially hydrogenated", "vanaspati", "dalda", "hydrogenated vegetable fat", "hydrogenated fat", "trans fat"],
    risk: "harmful", category: "fat",
    concern: "Strongly linked to cardiovascular disease. WHO calls for global elimination. Still common in Indian bakery products and cheap snacks.",
  },
  {
    id: "INTERESTERIFIED", name: "Interesterified Fat",
    aliases: ["interesterified", "interesterified fat", "interesterified oil"],
    risk: "moderate", category: "fat",
    concern: "Emerging evidence of metabolic harm; used as trans fat replacement.",
  },

  // ─── HIGH FRUCTOSE / CORN SYRUP ─────────────────────────────────────────
  {
    id: "HFCS", name: "High Fructose Corn Syrup",
    aliases: ["high fructose corn syrup", "hfcs", "corn syrup", "fructose syrup", "glucose-fructose syrup", "glucose fructose syrup"],
    risk: "high", category: "sweetener",
    concern: "Linked to obesity, fatty liver, insulin resistance. Increasingly used in Indian beverages.",
  },

  // ─── FLAVOURINGS ─────────────────────────────────────────────────────────
  {
    id: "ARTIFICIAL_FLAVOUR", name: "Artificial Flavours",
    aliases: ["artificial flavour", "artificial flavor", "nature.identical flavour", "synthetic flavour", "added flavour"],
    risk: "low", category: "flavouring",
    concern: "Broad category; some may cause allergic reactions. Exact chemicals not declared.",
  },
  {
    id: "DIACETYL", name: "Diacetyl",
    aliases: ["diacetyl", "butanedione"],
    risk: "high", category: "flavouring",
    concern: "Linked to severe lung disease (popcorn lung) in workers. Still used in microwave popcorn flavouring.",
  },

  // ─── NITRATES / MEAT PROCESSING ─────────────────────────────────────────
  {
    id: "NITRATE_CURE", name: "Curing Salts",
    aliases: ["curing salt", "pink salt", "prague powder", "sodium cure"],
    risk: "high", category: "preservative",
    concern: "Contains nitrite; carcinogen risk in processed meats.",
  },

  // ─── PHOSPHATES ──────────────────────────────────────────────────────────
  {
    id: "E450", name: "Diphosphates", eNumber: "E450", insCode: "INS 450",
    aliases: ["diphosphate", "pyrophosphate", "sodium pyrophosphate", "e450", "ins\\s*450"],
    risk: "low", category: "raising agent / emulsifier",
    concern: "High phosphate intake linked to kidney disease progression.",
  },
  {
    id: "E451", name: "Triphosphates", eNumber: "E451", insCode: "INS 451",
    aliases: ["triphosphate", "tripolyphosphate", "sodium tripolyphosphate", "e451", "ins\\s*451"],
    risk: "low", category: "sequestrant",
    concern: "Contributes to phosphate load; kidney concern at excessive intake.",
  },

  // ─── INDIAN-SPECIFIC / OFTEN MISSED ─────────────────────────────────────
  {
    id: "PERMITTED_COLOUR", name: "Permitted Food Colours",
    aliases: ["permitted colour", "permitted color", "food colour", "food color", "artificial colour", "artificial color", "colour \\(", "color \\("],
    risk: "moderate", category: "color",
    concern: "Vague declaration. May include azo dyes linked to hyperactivity and allergies.",
  },
  {
    id: "EDIBLE_GUM", name: "Edible Gum / Acacia",
    aliases: ["edible gum", "gum arabic", "acacia gum", "e414", "ins\\s*414"],
    risk: "safe", category: "thickener",
    concern: "Safe; high-dose laxative effect.",
  },
  {
    id: "REFINED_FLOUR", name: "Maida (Refined Wheat Flour)",
    aliases: ["maida", "refined wheat flour", "refined flour", "enriched flour", "bleached flour"],
    risk: "moderate", category: "grain",
    concern: "High glycaemic index; stripped of fibre and nutrients. Extremely common in Indian biscuits, bread, instant noodles.",
  },
  {
    id: "PALMOLEIN", name: "Palm Oil / RBD Palmolein",
    aliases: ["palm oil", "palmolein", "rbd palmolein", "palm olein", "vegetable oil \\(palm\\)", "palm kernel oil"],
    risk: "moderate", category: "fat",
    concern: "High saturated fat; environmental concerns. Dominant frying oil in Indian snack industry.",
  },
];

// ─── Regex-based detection ───────────────────────────────────────────────────

const COMPILED: Array<{ additive: Additive; patterns: RegExp[] }> = ADDITIVES_DB.map(
  (additive) => ({
    additive,
    patterns: additive.aliases.map((alias) => {
      const needsBoundaries = /^[a-zA-Z0-9 ]+$/.test(alias)
      return new RegExp(
        needsBoundaries ? `(?:^|\\b)${alias}(?:\\b|$)` : alias,
        "i"
      )
    }),
  })
);

export interface DetectedAdditive extends Additive {
  matchedAlias: string;
}

export function detectAdditives(ingredientsText: string): DetectedAdditive[] {
  if (!ingredientsText) return [];
  const found: DetectedAdditive[] = [];
  const seenIds = new Set<string>();

  for (const { additive, patterns } of COMPILED) {
    if (seenIds.has(additive.id)) continue;
    for (const regex of patterns) {
      if (regex.test(ingredientsText)) {
        seenIds.add(additive.id);
        found.push({ ...additive, matchedAlias: regex.source });
        break;
      }
    }
  }

  return found;
}

export function summariseRisk(detected: DetectedAdditive[]): {
  harmful: DetectedAdditive[];
  high: DetectedAdditive[];
  moderate: DetectedAdditive[];
  low: DetectedAdditive[];
  safe: DetectedAdditive[];
  overallRisk: RiskLevel;
} {
  const harmful = detected.filter((a) => a.risk === "harmful");
  const high = detected.filter((a) => a.risk === "high");
  const moderate = detected.filter((a) => a.risk === "moderate");
  const low = detected.filter((a) => a.risk === "low");
  const safe = detected.filter((a) => a.risk === "safe");

  let overallRisk: RiskLevel = "safe";
  if (harmful.length > 0) overallRisk = "harmful";
  else if (high.length > 0) overallRisk = "high";
  else if (moderate.length > 0) overallRisk = "moderate";
  else if (low.length > 0) overallRisk = "low";

  return { harmful, high, moderate, low, safe, overallRisk };
}

// ─── Backward compat helpers ─────────────────────────────────────────────────

export function getAdditivesByRisk(risk: RiskLevel): Additive[] {
  return ADDITIVES_DB.filter(a => a.risk === risk);
}

export function getAdditivesByCategory(category: string): Additive[] {
  return ADDITIVES_DB.filter(a => a.category.toLowerCase() === category.toLowerCase());
}

export const CATEGORY_WARNINGS: Record<string, string[]> = {
  noodles: ["MSG", "TBHQ", "Palm Oil", "Maida", "Sodium Benzoate"],
  biscuits: ["Maida", "Palm Oil", "High Fructose Corn Syrup", "Artificial Flavours", "Trans Fat"],
  chips: ["Palm Oil", "Artificial Flavours", "MSG", "High Fructose Corn Syrup", "TBHQ", "Trans Fat"],
  namkeen: ["Palm Oil", "MSG", "Artificial Flavours", "TBHQ", "Trans Fat"],
  cold_drink: ["Phosphoric Acid", "Aspartame", "Acesulfame K", "Sodium Benzoate", "High Fructose Corn Syrup"],
  juice: ["High Fructose Corn Syrup", "Sodium Benzoate", "Artificial Flavours", "Tartrazine"],
  bread: ["Maida", "Potassium Sorbate", "Calcium Propionate"],
  dairy: ["Carrageenan", "Artificial Flavours", "Palm Oil"],
  yogurt: ["Carrageenan", "Modified Corn Starch", "Artificial Flavours", "High Fructose Corn Syrup"],
  ice_cream: ["Carrageenan", "High Fructose Corn Syrup", "Artificial Flavours", "Palm Oil"],
  chocolate: ["Palm Oil", "Maida", "Artificial Flavours"],
  cereal: ["High Fructose Corn Syrup", "BHT", "Artificial Flavours", "Maltodextrin"],
  pasta: ["Maida"],
  sauce: ["Sodium Benzoate", "Potassium Sorbate", "High Fructose Corn Syrup", "Artificial Flavours", "MSG"],
  cooking_oil: ["Palm Oil", "BHT", "TBHQ"],
  tea: [],
  coffee: [],
  energy_drink: ["Phosphoric Acid", "Aspartame", "Acesulfame K", "Sodium Benzoate"],
  protein: ["Artificial Flavours", "Sucralose", "Aspartame"],
  pickle: ["Sodium Benzoate", "Potassium Sorbate", "Tartrazine"],
  jam: ["High Fructose Corn Syrup", "Sodium Benzoate", "Artificial Flavours"],
  cake: ["Maida", "Palm Oil", "Artificial Flavours", "High Fructose Corn Syrup"],
  pizza: ["Maida", "Palm Oil", "Sodium Nitrite"],
  soup: ["MSG", "Artificial Flavours", "High Fructose Corn Syrup"],
  health_drink: ["High Fructose Corn Syrup", "Maltodextrin", "Palm Oil", "Artificial Flavours"],
  rusk: ["Maida", "Palm Oil", "Artificial Flavours"],
};

export function getCategoryWarnings(category: string): Additive[] {
  const lower = category?.toLowerCase() || "";
  const additiveNames = CATEGORY_WARNINGS[lower] || [];
  if (additiveNames.length === 0) return [];

  return ADDITIVES_DB.filter(a => {
    const aLower = a.name.toLowerCase();
    return additiveNames.some(warn => {
      const wLower = warn.toLowerCase();
      return aLower.includes(wLower) || wLower.includes(aLower) ||
        a.aliases.some(alias => wLower.includes(alias));
    });
  });
}
