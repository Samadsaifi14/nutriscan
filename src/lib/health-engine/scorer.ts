// NutriScan Health Engine - Core Scoring Engine
// Deterministic scoring without AI dependency

import { detectAdditives, type Additive, type RiskLevel, ADDITIVES_DB } from "./additives-db";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NutritionPer100g {
  calories?: number;        // kcal
  sugar?: number;           // g
  sodium?: number;          // mg
  saturated_fat?: number;   // g
  total_fat?: number;       // g
  protein?: number;         // g
  fiber?: number;           // g
  carbohydrates?: number;  // g
}

export type NOVAGroup = 1 | 2 | 3 | 4;

export interface ScoreBreakdown {
  factor: string;
  label: string;
  impact: "positive" | "negative" | "neutral" | "warning" | "critical";
  detail: string;
  points: number;
}

export interface HealthScoreResult {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  label: string;
  nutrition_score: number;
  additive_score: number;
  nova_score: number;
  nova_group: NOVAGroup;
  nova_label: string;
  detected_additives: Additive[];
  breakdown: ScoreBreakdown[];
  summary: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function riskWeight(risk: RiskLevel): number {
  return { safe: 0, low: 0.5, medium: 1.5, high: 2.5, critical: 4 }[risk];
}

// ── NOVA Classification ───────────────────────────────────────────────────────

const NOVA_ULTRA_KEYWORDS = [
  "artificial flavor", "artificial flavour", "artificial flavoring", "artificial colouring",
  "color", "colour", "hydrolyzed", "hydrolysed", "modified starch", "interesterified",
  "maltodextrin", "high fructose", "corn syrup", "whey protein", "soy protein isolate",
  "casein", "lactose", "emulsifier", "stabilizer", "stabiliser", "humectant",
  "polysorbate", "carrageenan", "xanthan", "carboxymethylcellulose", "cellulose gum",
  "glazing agent", "anti-foaming", "anti-foaming", "bulking agent", "carbonating agent",
  "firming agent", "foaming agent", "propellant", "milk solids", "skim milk powder",
  "whey concentrate", "whey isolate", "butteroil", "hydrolysed", "malt extract",
];

const NOVA_PROCESSED_KEYWORDS = [
  "salt", "sugar", "vinegar", "oil", "alcohol", "canned", "smoked", "cured",
  "fermented", "pickled", "roasted", "baked", "pasteurized", "pasteurised",
];

export function classifyNOVA(ingredientText: string): NOVAGroup {
  if (!ingredientText) return 3; // Default to processed if no ingredients
  
  const lower = ingredientText.toLowerCase();
  const ingredientList = lower.split(/[,;\/]/).map(s => s.trim()).filter(Boolean);
  const count = ingredientList.length;

  // Ultra-processed detection
  const hasUltraProcessed = NOVA_ULTRA_KEYWORDS.some(kw => lower.includes(kw));
  if (hasUltraProcessed || count > 8) return 4;

  // Processed detection  
  const hasProcessed = NOVA_PROCESSED_KEYWORDS.some(kw => lower.includes(kw));
  if (hasProcessed || count > 4) return 3;

  // Minimally processed
  if (count > 1) return 2;
  return 1;
}

function novaToScore(group: NOVAGroup): number {
  return { 1: 10, 2: 7.5, 3: 5, 4: 2 }[group];
}

function novaLabel(group: NOVAGroup): string {
  return {
    1: "Unprocessed / Minimally Processed",
    2: "Processed Culinary Ingredients",
    3: "Processed Foods",
    4: "Ultra-Processed Foods",
  }[group];
}

// ── Nutrition Scoring ─────────────────────────────────────────────────────────

export function scoreNutrition(n: NutritionPer100g): {
  score: number;
  breakdown: ScoreBreakdown[];
} {
  const breakdown: ScoreBreakdown[] = [];
  let score = 5; // baseline

  // ─ Sugar ─
  if (n.sugar !== undefined) {
    if (n.sugar > 22.5) {
      breakdown.push({ factor: "sugar", label: "Sugar", impact: "critical", detail: `${n.sugar}g/100g — Very High`, points: -3 });
      score -= 3;
    } else if (n.sugar > 12.5) {
      breakdown.push({ factor: "sugar", label: "Sugar", impact: "negative", detail: `${n.sugar}g/100g — High`, points: -2 });
      score -= 2;
    } else if (n.sugar > 5) {
      breakdown.push({ factor: "sugar", label: "Sugar", impact: "warning", detail: `${n.sugar}g/100g — Moderate`, points: -1 });
      score -= 1;
    } else if (n.sugar > 0) {
      breakdown.push({ factor: "sugar", label: "Sugar", impact: "positive", detail: `${n.sugar}g/100g — Low`, points: 1 });
      score += 1;
    }
  }

  // ─ Sodium ─
  if (n.sodium !== undefined) {
    if (n.sodium > 600) {
      breakdown.push({ factor: "sodium", label: "Sodium", impact: "critical", detail: `${n.sodium}mg/100g — Very High`, points: -3 });
      score -= 3;
    } else if (n.sodium > 400) {
      breakdown.push({ factor: "sodium", label: "Sodium", impact: "negative", detail: `${n.sodium}mg/100g — High`, points: -2 });
      score -= 2;
    } else if (n.sodium > 150) {
      breakdown.push({ factor: "sodium", label: "Sodium", impact: "warning", detail: `${n.sodium}mg/100g — Moderate`, points: -1 });
      score -= 1;
    } else if (n.sodium > 0) {
      breakdown.push({ factor: "sodium", label: "Sodium", impact: "positive", detail: `${n.sodium}mg/100g — Low`, points: 1 });
      score += 1;
    }
  }

  // ─ Saturated Fat ─
  if (n.saturated_fat !== undefined) {
    if (n.saturated_fat > 10) {
      breakdown.push({ factor: "sat_fat", label: "Saturated Fat", impact: "critical", detail: `${n.saturated_fat}g/100g — Very High`, points: -3 });
      score -= 3;
    } else if (n.saturated_fat > 5) {
      breakdown.push({ factor: "sat_fat", label: "Saturated Fat", impact: "negative", detail: `${n.saturated_fat}g/100g — High`, points: -2 });
      score -= 2;
    } else if (n.saturated_fat > 1.5) {
      breakdown.push({ factor: "sat_fat", label: "Saturated Fat", impact: "warning", detail: `${n.saturated_fat}g/100g — Moderate`, points: -1 });
      score -= 1;
    } else if (n.saturated_fat > 0) {
      breakdown.push({ factor: "sat_fat", label: "Saturated Fat", impact: "positive", detail: `${n.saturated_fat}g/100g — Low`, points: 1 });
      score += 1;
    }
  }

  // ─ Protein ─
  if (n.protein !== undefined) {
    if (n.protein >= 10) {
      breakdown.push({ factor: "protein", label: "Protein", impact: "positive", detail: `${n.protein}g/100g — Excellent`, points: 2 });
      score += 2;
    } else if (n.protein >= 5) {
      breakdown.push({ factor: "protein", label: "Protein", impact: "positive", detail: `${n.protein}g/100g — Good`, points: 1 });
      score += 1;
    }
  }

  // ─ Fiber ─
  if (n.fiber !== undefined) {
    if (n.fiber >= 6) {
      breakdown.push({ factor: "fiber", label: "Fiber", impact: "positive", detail: `${n.fiber}g/100g — Excellent`, points: 2 });
      score += 2;
    } else if (n.fiber >= 3) {
      breakdown.push({ factor: "fiber", label: "Fiber", impact: "positive", detail: `${n.fiber}g/100g — Good`, points: 1 });
      score += 1;
    }
  }

  // ─ Calories ─
  if (n.calories !== undefined) {
    if (n.calories > 400) {
      breakdown.push({ factor: "calories", label: "Calories", impact: "warning", detail: `${n.calories} kcal/100g — High`, points: -1 });
      score -= 1;
    } else if (n.calories < 100) {
      breakdown.push({ factor: "calories", label: "Calories", impact: "positive", detail: `${n.calories} kcal/100g — Low`, points: 1 });
      score += 1;
    }
  }

  return { score: clamp(score, 0, 10), breakdown };
}

// ── Additive Scoring ──────────────────────────────────────────────────────────

export function scoreAdditives(ingredientText: string): {
  score: number;
  detected: Additive[];
  breakdown: ScoreBreakdown[];
} {
  const detected = detectAdditives(ingredientText);
  const breakdown: ScoreBreakdown[] = [];
  let penalty = 0;

  for (const additive of detected) {
    const w = riskWeight(additive.risk);
    penalty += w;

    const impact: ScoreBreakdown["impact"] =
      additive.risk === "critical" ? "critical" :
      additive.risk === "high" ? "negative" :
      additive.risk === "medium" ? "warning" :
      additive.risk === "low" ? "neutral" : "positive";

    breakdown.push({
      factor: `additive_${additive.ins_code || additive.name.replace(/\s/g, '_')}`,
      label: additive.name,
      impact,
      detail: additive.concern || additive.description,
      points: -w,
    });
  }

  // Bonus for clean ingredients
  if (detected.length === 0) {
    breakdown.push({
      factor: "additives_clean",
      label: "No Flagged Additives",
      impact: "positive",
      detail: "No harmful additives detected",
      points: 2,
    });
    penalty = -2;
  }

  const score = clamp(10 - penalty, 0, 10);
  return { score, detected, breakdown };
}

// ── Main Scorer ───────────────────────────────────────────────────────────────

export function scoreProduct(
  nutrition: NutritionPer100g,
  ingredientText: string
): HealthScoreResult {
  const nutritionResult = scoreNutrition(nutrition);
  const additiveResult = scoreAdditives(ingredientText);
  const novaGroup = classifyNOVA(ingredientText);
  const novaSub = novaToScore(novaGroup);

  // Weighted composite: 40% nutrition + 30% additive + 30% NOVA
  const raw =
    nutritionResult.score * 0.4 +
    additiveResult.score * 0.3 +
    novaSub * 0.3;

  const score = Math.max(1, Math.min(10, Math.round(raw * 10) / 10));

  // Grade and label
  const grade: HealthScoreResult["grade"] =
    score >= 8 ? "A" :
    score >= 6.5 ? "B" :
    score >= 5 ? "C" :
    score >= 3.5 ? "D" : "F";

  const label =
    grade === "A" ? "Excellent Choice" :
    grade === "B" ? "Good Choice" :
    grade === "C" ? "Moderate — Occasional Consumption" :
    grade === "D" ? "Poor — Limit Consumption" :
    "Avoid — High Health Risk";

  const novaBreakdown: ScoreBreakdown = {
    factor: "nova",
    label: `NOVA Group ${novaGroup}`,
    impact: novaGroup === 1 ? "positive" : novaGroup === 2 ? "neutral" : novaGroup === 3 ? "warning" : "critical",
    detail: novaLabel(novaGroup),
    points: novaSub - 5,
  };

  // Build summary
  const criticals = additiveResult.detected.filter(a => a.risk === "critical");
  const highs = additiveResult.detected.filter(a => a.risk === "high");

  let summary = "";
  if (criticals.length > 0) {
    summary = `Contains ${criticals.map(a => a.name).join(", ")} — critically harmful. Score: ${score}/10.`;
  } else if (highs.length > 0) {
    summary = `Contains high-risk additives (${highs.map(a => a.name).join(", ")}). Score: ${score}/10.`;
  } else if (novaGroup === 4) {
    summary = `Ultra-processed food — consider less processed alternatives. Score: ${score}/10.`;
  } else {
    summary = `${label}. Score: ${score}/10.`;
  }

  return {
    score,
    grade,
    label,
    nutrition_score: Math.round(nutritionResult.score * 10) / 10,
    additive_score: Math.round(additiveResult.score * 10) / 10,
    nova_score: novaSub,
    nova_group: novaGroup,
    nova_label: novaLabel(novaGroup),
    detected_additives: additiveResult.detected,
    breakdown: [
      ...nutritionResult.breakdown,
      ...additiveResult.breakdown,
      novaBreakdown,
    ],
    summary,
  };
}