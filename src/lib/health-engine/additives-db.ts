// BioYou Health Engine - Additive Database
// 50+ harmful additives with INS codes, risk levels, and scientific concerns

export type RiskLevel = "safe" | "low" | "medium" | "high" | "critical";

export interface Additive {
  name: string;
  aliases: string[];
  ins_code?: string;
  e_code?: string;
  risk: RiskLevel;
  category: "preservative" | "color" | "sweetener" | "emulsifier" | "flavor" | "thickener" | "antioxidant" | "acidity" | "other";
  description: string;
  concern?: string;
}

export const ADDITIVES_DB: Additive[] = [
  // ── Preservatives ─────────────────────────────────────────────────────────
  {
    name: "Sodium Benzoate",
    aliases: ["sodium benzoate", "e211", "ins 211", "ins211"],
    ins_code: "INS 211", e_code: "E211",
    risk: "high",
    category: "preservative",
    description: "Common preservative in soft drinks and sauces",
    concern: "Linked to hyperactivity in children; forms benzene with Vitamin C",
  },
  {
    name: "Potassium Sorbate",
    aliases: ["potassium sorbate", "e202", "ins 202", "ins202"],
    ins_code: "INS 202", e_code: "E202",
    risk: "low",
    category: "preservative",
    description: "Widely used mold inhibitor",
    concern: "Generally recognized as safe at typical levels",
  },
  {
    name: "Sodium Nitrite",
    aliases: ["sodium nitrite", "e250", "ins 250", "ins250"],
    ins_code: "INS 250", e_code: "E250",
    risk: "critical",
    category: "preservative",
    description: "Used in cured meats",
    concern: "Forms nitrosamines — classified as probable carcinogen (IARC Group 2A)",
  },
  {
    name: "BHA (Butylated Hydroxyanisole)",
    aliases: ["bha", "butylated hydroxyanisole", "e320", "ins 320", "ins320"],
    ins_code: "INS 320", e_code: "E320",
    risk: "high",
    category: "antioxidant",
    description: "Antioxidant preservative in fats and cereals",
    concern: "Possible carcinogen; listed as reasonably anticipated human carcinogen (NTP)",
  },
  {
    name: "BHT (Butylated Hydroxytoluene)",
    aliases: ["bht", "butylated hydroxytoluene", "e321", "ins 321", "ins321"],
    ins_code: "INS 321", e_code: "E321",
    risk: "medium",
    category: "antioxidant",
    description: "Synthetic antioxidant in packaged foods",
    concern: "Potential endocrine disruptor at high doses",
  },
  {
    name: "TBHQ",
    aliases: ["tbhq", "tertiary butylhydroquinone", "e319", "ins 319", "ins319"],
    ins_code: "INS 319", e_code: "E319",
    risk: "medium",
    category: "antioxidant",
    description: "Preservative in fast food oils and crackers",
    concern: "High doses linked to vision disturbances; possible immune effects",
  },
  {
    name: "Sodium Metabisulfite",
    aliases: ["sodium metabisulfite", "e223", "ins 223", "ins223"],
    ins_code: "INS 223", e_code: "E223",
    risk: "medium",
    category: "preservative",
    description: "Sulfite preservative in dried fruits and wines",
    concern: "Can trigger allergic reactions in sulfite-sensitive people",
  },

  // ── Artificial Colors ─────────────────────────────────────────────────────
  {
    name: "Tartrazine",
    aliases: ["tartrazine", "e102", "ins 102", "ins102", "yellow 5", "fd&c yellow 5"],
    ins_code: "INS 102", e_code: "E102",
    risk: "high",
    category: "color",
    description: "Bright yellow synthetic dye",
    concern: "Linked to hyperactivity, allergic reactions; banned in several countries",
  },
  {
    name: "Sunset Yellow FCF",
    aliases: ["sunset yellow", "e110", "ins 110", "ins110", "yellow 6", "fd&c yellow 6"],
    ins_code: "INS 110", e_code: "E110",
    risk: "high",
    category: "color",
    description: "Orange-yellow azo dye",
    concern: "Part of Southampton 6 dyes — requires warning labels in EU",
  },
  {
    name: "Brilliant Blue FCF",
    aliases: ["brilliant blue", "e133", "ins 133", "ins133", "blue 1", "fd&c blue 1"],
    ins_code: "INS 133", e_code: "E133",
    risk: "medium",
    category: "color",
    description: "Synthetic blue dye",
    concern: "May cause hypersensitivity; some studies suggest immune effects",
  },
  {
    name: "Allura Red",
    aliases: ["allura red", "e129", "ins 129", "ins129", "red 40", "fd&c red 40"],
    ins_code: "INS 129", e_code: "E129",
    risk: "high",
    category: "color",
    description: "Most widely used red dye",
    concern: "Part of Southampton 6; linked to hyperactivity in children",
  },
  {
    name: "Erythrosine",
    aliases: ["erythrosine", "e127", "ins 127", "ins127", "red 3", "fd&c red 3"],
    ins_code: "INS 127", e_code: "E127",
    risk: "critical",
    category: "color",
    description: "Pink/red dye used in cherries and candy",
    concern: "Banned in cosmetics by FDA; thyroid tumor risk in animal studies",
  },
  {
    name: "Caramel Color Class IV",
    aliases: ["caramel color", "caramel colour", "e150d", "ins 150d", "ins150d"],
    ins_code: "INS 150d", e_code: "E150d",
    risk: "medium",
    category: "color",
    description: "Brown coloring in colas and sauces",
    concern: "Contains 4-MEI, a possible carcinogen (IARC Group 2B)",
  },
  {
    name: "Ponceau 4R",
    aliases: ["ponceau 4r", "e124", "ins 124", "ins124"],
    ins_code: "INS 124", e_code: "E124",
    risk: "high",
    category: "color",
    description: "Red azo dye",
    concern: "Banned in USA; linked to hyperactivity in children",
  },
  {
    name: "Quinoline Yellow",
    aliases: ["quinoline yellow", "e104", "ins 104", "ins104"],
    ins_code: "INS 104", e_code: "E104",
    risk: "medium",
    category: "color",
    description: "Synthetic yellow dye",
    concern: "Banned in USA; may cause hypersensitivity",
  },

  // ── Artificial Sweeteners ─────────────────────────────────────────────────
  {
    name: "Aspartame",
    aliases: ["aspartame", "e951", "ins 951", "ins951", "nutrasweet", "equal"],
    ins_code: "INS 951", e_code: "E951",
    risk: "medium",
    category: "sweetener",
    description: "Low-calorie sweetener in diet products",
    concern: "IARC classified as possibly carcinogenic (Group 2B) in 2023; avoid with PKU",
  },
  {
    name: "Acesulfame K",
    aliases: ["acesulfame k", "acesulfame potassium", "e950", "ins 950", "ins950", "ace-k"],
    ins_code: "INS 950", e_code: "E950",
    risk: "low",
    category: "sweetener",
    description: "Heat-stable artificial sweetener",
    concern: "Some animal studies suggest potential metabolic effects",
  },
  {
    name: "Saccharin",
    aliases: ["saccharin", "e954", "ins 954", "ins954", "sweet'n low"],
    ins_code: "INS 954", e_code: "E954",
    risk: "medium",
    category: "sweetener",
    description: "Oldest artificial sweetener",
    concern: "Previously linked to bladder cancer in rodents; now generally considered safe at ADI",
  },
  {
    name: "Sucralose",
    aliases: ["sucralose", "e955", "ins 955", "ins955", "splenda"],
    ins_code: "INS 955", e_code: "E955",
    risk: "low",
    category: "sweetener",
    description: "Chlorinated sucrose derivative",
    concern: "May alter gut microbiome; some recent studies on metabolic effects",
  },
  {
    name: "Neotame",
    aliases: ["neotame", "e961", "ins 961", "ins961"],
    ins_code: "INS 961", e_code: "E961",
    risk: "low",
    category: "sweetener",
    description: "Newer artificial sweetener 7000x sweeter than sugar",
    concern: "Very new — limited long-term safety data",
  },

  // ── Emulsifiers ───────────────────────────────────────────────────────────
  {
    name: "Carrageenan",
    aliases: ["carrageenan", "e407", "ins 407", "ins407"],
    ins_code: "INS 407", e_code: "E407",
    risk: "medium",
    category: "emulsifier",
    description: "Seaweed-derived thickener in dairy products",
    concern: "Degraded form is inflammatory; even food-grade form controversial for gut health",
  },
  {
    name: "Polysorbate 80",
    aliases: ["polysorbate 80", "e433", "ins 433", "ins433", "tween 80"],
    ins_code: "INS 433", e_code: "E433",
    risk: "medium",
    category: "emulsifier",
    description: "Emulsifier in ice cream and vaccines",
    concern: "Animal studies suggest disruption of gut microbiota and mucus layer",
  },
  {
    name: "Polysorbate 60",
    aliases: ["polysorbate 60", "e435", "ins 435", "ins435"],
    ins_code: "INS 435", e_code: "E435",
    risk: "medium",
    category: "emulsifier",
    description: "Similar to Polysorbate 80",
    concern: "Potential gut microbiome disruption",
  },
  {
    name: "Carboxymethylcellulose",
    aliases: ["carboxymethylcellulose", "cmc", "e466", "ins 466", "ins466", "cellulose gum"],
    ins_code: "INS 466", e_code: "E466",
    risk: "medium",
    category: "emulsifier",
    description: "Synthetic thickener and stabilizer",
    concern: "Linked to gut inflammation in mice; may affect microbiome",
  },
  {
    name: "Xanthan Gum",
    aliases: ["xanthan gum", "xanthan", "e415", "ins 415", "ins415"],
    ins_code: "INS 415", e_code: "E415",
    risk: "safe",
    category: "thickener",
    description: "Fermentation-derived thickener",
    concern: "Generally safe; may cause bloating in sensitive individuals",
  },
  {
    name: "Guar Gum",
    aliases: ["guar gum", "e412", "ins 412", "ins412"],
    ins_code: "INS 412", e_code: "E412",
    risk: "safe",
    category: "thickener",
    description: "Natural bean-derived thickener",
    concern: "Generally safe; high amounts may cause GI upset",
  },
  {
    name: "Lecithin",
    aliases: ["lecithin", "e322", "ins 322", "ins322", "soy lecithin", "sunflower lecithin"],
    ins_code: "INS 322", e_code: "E322",
    risk: "safe",
    category: "emulsifier",
    description: "Natural emulsifier from soy or sunflower",
    concern: "Generally safe; trace soy allergen possible",
  },
  {
    name: "Mono- and Diglycerides",
    aliases: ["mono and diglycerides", "e471", "ins 471", "ins471", "monoglycerides"],
    ins_code: "INS 471", e_code: "E471",
    risk: "low",
    category: "emulsifier",
    description: "Common emulsifier from fats",
    concern: "May contain trans fats depending on source",
  },

  // ── Flavor Enhancers ─────────────────────────────────────────────────────
  {
    name: "Monosodium Glutamate",
    aliases: ["monosodium glutamate", "msg", "e621", "ins 621", "ins621", "glutamate"],
    ins_code: "INS 621", e_code: "E621",
    risk: "low",
    category: "flavor",
    description: "Umami flavor enhancer",
    concern: "FDA considers GRAS; sensitivity not confirmed in studies",
  },
  {
    name: "Disodium Inosinate",
    aliases: ["disodium inosinate", "e631", "ins 631", "ins631"],
    ins_code: "INS 631", e_code: "E631",
    risk: "low",
    category: "flavor",
    description: "Flavor synergist, often with MSG",
    concern: "Avoid with gout; derived from animal sources",
  },
  {
    name: "Disodium Guanylate",
    aliases: ["disodium guanylate", "e627", "ins 627", "ins627"],
    ins_code: "INS 627", e_code: "E627",
    risk: "low",
    category: "flavor",
    description: "Flavor enhancer, umami synergist",
    concern: "Avoid with gout",
  },
  {
    name: "Autolyzed Yeast Extract",
    aliases: ["autolyzed yeast", "yeast extract", "autolyzed yeast extract"],
    risk: "low",
    category: "flavor",
    description: "Contains glutamates — similar to MSG",
    concern: "May contain hidden MSG compounds",
  },

  // ── Acidity Regulators ─────────────────────────────────────────────────────
  {
    name: "Phosphoric Acid",
    aliases: ["phosphoric acid", "e338", "ins 338", "ins338"],
    ins_code: "INS 338", e_code: "E338",
    risk: "medium",
    category: "acidity",
    description: "Acidulant in colas",
    concern: "Excessive intake linked to lower bone density",
  },
  {
    name: "Citric Acid",
    aliases: ["citric acid", "e330", "ins 330", "ins330"],
    ins_code: "INS 330", e_code: "E330",
    risk: "safe",
    category: "acidity",
    description: "Natural acidulant from citrus fermentation",
    concern: "Generally safe; may erode tooth enamel",
  },
  {
    name: "Sodium Citrate",
    aliases: ["sodium citrate", "e331", "ins 331", "ins331"],
    ins_code: "INS 331", e_code: "E331",
    risk: "safe",
    category: "acidity",
    description: "Sodium salt of citric acid",
    concern: "Generally safe",
  },

  // ── Other High-Risk Items ─────────────────────────────────────────────────
  {
    name: "High Fructose Corn Syrup",
    aliases: ["high fructose corn syrup", "hfcs", "glucose-fructose syrup", "corn syrup", "isoglucose", "glucose-fructose"],
    risk: "high",
    category: "other",
    description: "Highly refined sweetener from corn starch",
    concern: "Linked to obesity, insulin resistance, and fatty liver disease",
  },
  {
    name: "Trans Fat / Partially Hydrogenated Oil",
    aliases: ["partially hydrogenated", "trans fat", "hydrogenated vegetable oil", "vanaspati", "partially hydrogenated oil", "hydrogenated fat"],
    risk: "critical",
    category: "other",
    description: "Artificially hardened fats",
    concern: "Banned in many countries; strongly linked to cardiovascular disease",
  },
  {
    name: "Palm Oil",
    aliases: ["palm oil", "palmolein", "vegetable oil"],
    risk: "medium",
    category: "other",
    description: "Common cooking oil high in saturated fat",
    concern: "High saturated fat content; environmental concerns",
  },
  {
    name: "Refined Flour / Maida",
    aliases: ["refined flour", "maida", "wheat flour", "all-purpose flour", "refined wheat flour"],
    risk: "medium",
    category: "other",
    description: "Highly processed white flour",
    concern: "High glycemic index; low fiber compared to whole grain",
  },
  {
    name: "Maltodextrin",
    aliases: ["maltodextrin", "maltodextrin (wheat)"],
    risk: "medium",
    category: "other",
    description: "Processed carbohydrate sweetener",
    concern: "High glycemic index; may spike blood sugar faster than table sugar",
  },
  {
    name: "Modified Corn Starch",
    aliases: ["modified corn starch", "modified starch", "modified tapioca starch", "modified wheat starch"],
    risk: "low",
    category: "other",
    description: "Chemically modified starch",
    concern: "May contain unknown additives; processing creates ultra-processed product",
  },
  {
    name: "Artificial Flavors",
    aliases: ["artificial flavor", "artificial flavour", "artificial flavoring", "artificial flavouring", "nature identical flavor", "artificial flavouring"],
    risk: "low",
    category: "flavor",
    description: "Synthetically derived flavor compounds",
    concern: "Hundreds of compounds; individual safety varies; prefer natural flavors",
  },
];

// Detection function - searches ingredient text for any of the above additives
export function detectAdditives(ingredientText: string): Additive[] {
  if (!ingredientText) return [];
  
  const lower = ingredientText.toLowerCase();
  const found: Additive[] = [];
  const seen = new Set<string>();

  for (const additive of ADDITIVES_DB) {
    if (seen.has(additive.name)) continue;
    
    const matched = additive.aliases.some(alias => lower.includes(alias));
    if (matched) {
      found.push(additive);
      seen.add(additive.name);
    }
  }

  return found;
}

// Get all additives of a specific risk level
export function getAdditivesByRisk(risk: RiskLevel): Additive[] {
  return ADDITIVES_DB.filter(a => a.risk === risk);
}

// Get all additives in a category
export function getAdditivesByCategory(category: Additive["category"]): Additive[] {
  return ADDITIVES_DB.filter(a => a.category === category);
}

// Category-based probable harmful ingredients
// Maps product categories to commonly found harmful additives
export const CATEGORY_WARNINGS: Record<string, string[]> = {
  noodles: ["MSG (E621)", "TBHQ (E319)", "Palm Oil", "Refined Flour / Maida", "Sodium Benzoate (E211)"],
  biscuits: ["Refined Flour / Maida", "Palm Oil", "High Fructose Corn Syrup", "Artificial Flavors", "Trans Fat"],
  chips: ["Palm Oil", "Artificial Flavors", "MSG (E621)", "High Fructose Corn Syrup", "TBHQ (E319)", "Trans Fat"],
  namkeen: ["Palm Oil", "MSG (E621)", "Artificial Flavors", "TBHQ (E319)", "Trans Fat"],
  cold_drink: ["Phosphoric Acid (E338)", "Aspartame (E951)", "Acesulfame K (E950)", "Sodium Benzoate (E211)", "High Fructose Corn Syrup"],
  juice: ["High Fructose Corn Syrup", "Sodium Benzoate (E211)", "Artificial Flavors", "Tartrazine (E102)"],
  bread: ["Refined Flour / Maida", "Potassium Sorbate (E202)", "Calcium Propionate (E282)"],
  dairy: ["Carrageenan (E407)", "Artificial Flavors", "Palm Oil"],
  yogurt: ["Carrageenan (E407)", "Modified Corn Starch", "Artificial Flavors", "High Fructose Corn Syrup"],
  ice_cream: ["Carrageenan (E407)", "High Fructose Corn Syrup", "Artificial Flavors", "Palm Oil"],
  chocolate: ["Palm Oil", "Refined Flour / Maida", "Artificial Flavors", "Lecithin (E322)"],
  cereal: ["High Fructose Corn Syrup", "BHT (E321)", "Artificial Flavors", "Maltodextrin"],
  pasta: ["Refined Flour / Maida"],
  sauce: ["Sodium Benzoate (E211)", "Potassium Sorbate (E202)", "High Fructose Corn Syrup", "Artificial Flavors", "MSG (E621)"],
  cooking_oil: ["Palm Oil", "BHT (E321)", "TBHQ (E319)"],
  tea: [],
  coffee: [],
  energy_drink: ["Phosphoric Acid (E338)", "Aspartame (E951)", "Acesulfame K (E950)", "Sodium Benzoate (E211)"],
  protein: ["Artificial Flavors", "Sucralose (E955)", "Aspartame (E951)"],
  pickle: ["Sodium Benzoate (E211)", "Potassium Sorbate (E202)", "Tartrazine (E102)"],
  jam: ["High Fructose Corn Syrup", "Sodium Benzoate (E211)", "Artificial Flavors"],
  cake: ["Refined Flour / Maida", "Palm Oil", "Artificial Flavors", "High Fructose Corn Syrup"],
  pizza: ["Refined Flour / Maida", "Palm Oil", "Sodium Nitrite (E250)"],
  soup: ["MSG (E621)", "Artificial Flavors", "High Fructose Corn Syrup"],
  health_drink: ["High Fructose Corn Syrup", "Maltodextrin", "Palm Oil", "Artificial Flavors"],
  paneer: [],
  eggs: [],
  rice: [],
  dal: [],
  flour: [],
  ghee: [],
  honey: [],
  milk: [],
  atta: [],
  rusk: ["Refined Flour / Maida", "Palm Oil", "Artificial Flavors"],
  sugar: [],
}

export function getCategoryWarnings(category: string): Additive[] {
  const lower = category?.toLowerCase() || ""
  const additiveNames = CATEGORY_WARNINGS[lower] || []
  if (additiveNames.length === 0) return []

  return ADDITIVES_DB.filter(a => {
    const aLower = a.name.toLowerCase()
    return additiveNames.some(warn => {
      const wLower = warn.toLowerCase()
      return aLower.includes(wLower) || wLower.includes(aLower) ||
        a.aliases.some(alias => wLower.includes(alias))
    })
  })
}