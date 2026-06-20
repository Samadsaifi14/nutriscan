// scorer.ts
// Deterministic scoring (always runs) + optional AI enhancement
// Gemini 2.5 Flash primary, Groq fallback for AI summary text
// Exports both sync scoreProduct (backward compat) and async analyzeProduct (new AI-enhanced)

import { detectAdditives, summariseRisk, type DetectedAdditive, type RiskLevel } from "./additives-db";

// ─── Types (old, backward-compat) ────────────────────────────────────────────

export type NOVAGroup = 1 | 2 | 3 | 4;

export interface NutritionPer100g {
  calories?: number;
  sugar?: number;
  sodium?: number;
  saturated_fat?: number;
  total_fat?: number;
  protein?: number;
  fiber?: number;
  carbohydrates?: number;
}

export interface ScoreBreakdownItem {
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
  detected_additives: DetectedAdditive[];
  breakdown: ScoreBreakdownItem[];
  summary: string;
}

// ─── Types (new, AI-enhanced) ────────────────────────────────────────────────

export interface NutritionData {
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fat?: number | null;
  saturated_fat?: number | null;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  serving_size?: number | null;
}

export interface ScoreBreakdown {
  nutritionScore: number;
  additiveScore: number;
  novaScore: number;
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
}

export interface IngredientAnalysis {
  ingredient: string;
  status: "safe" | "concern" | "harmful";
  reason: string;
  eNumber?: string;
  insCode?: string;
}

export interface UnifiedAnalysis {
  score: ScoreBreakdown;
  detectedAdditives: DetectedAdditive[];
  riskSummary: ReturnType<typeof summariseRisk>;
  ingredients: IngredientAnalysis[];
  concerns: string[];
  positives: string[];
  summary: string;
  aiEnhanced: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

function riskWeight(risk: RiskLevel): number {
  return { safe: 0, low: 0.5, moderate: 1.5, high: 2.5, harmful: 4 }[risk] ?? 0;
}

function gradeFromScore(s: number): "A" | "B" | "C" | "D" | "F" {
  if (s >= 8) return "A";
  if (s >= 6.5) return "B";
  if (s >= 5) return "C";
  if (s >= 3.5) return "D";
  return "F";
}

function labelFromGrade(grade: "A" | "B" | "C" | "D" | "F"): string {
  return {
    A: "Excellent Choice",
    B: "Good Choice",
    C: "Moderate — Occasional Consumption",
    D: "Poor — Limit Consumption",
    F: "Avoid — High Health Risk",
  }[grade];
}

// ─── NOVA Classification ─────────────────────────────────────────────────────

const NOVA_ULTRA_KEYWORDS = [
  "artificial flavor", "artificial flavour", "artificial flavoring", "artificial colouring",
  "color", "colour", "hydrolyzed", "hydrolysed", "modified starch", "interesterified",
  "maltodextrin", "high fructose", "corn syrup", "whey protein", "soy protein isolate",
  "casein", "lactose", "emulsifier", "stabilizer", "stabiliser", "humectant",
  "polysorbate", "carrageenan", "xanthan", "carboxymethylcellulose", "cellulose gum",
  "glazing agent", "anti-foaming", "bulking agent", "carbonating agent",
  "firming agent", "foaming agent", "propellant", "milk solids", "skim milk powder",
  "whey concentrate", "whey isolate", "butteroil", "malt extract",
];

const NOVA_PROCESSED_KEYWORDS = [
  "salt", "sugar", "vinegar", "oil", "alcohol", "canned", "smoked", "cured",
  "fermented", "pickled", "roasted", "baked", "pasteurized", "pasteurised",
];

export function classifyNOVA(ingredientText: string): NOVAGroup {
  if (!ingredientText) return 3;
  const lower = ingredientText.toLowerCase();
  const ingredientList = lower.split(/[,;\/]/).map(s => s.trim()).filter(Boolean);
  const count = ingredientList.length;
  const hasUltraProcessed = NOVA_ULTRA_KEYWORDS.some(kw => lower.includes(kw));
  if (hasUltraProcessed || count > 8) return 4;
  const hasProcessed = NOVA_PROCESSED_KEYWORDS.some(kw => lower.includes(kw));
  if (hasProcessed || count > 4) return 3;
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

// ─── Nutrition Scoring ───────────────────────────────────────────────────────

export function scoreNutrition(n: NutritionPer100g): {
  score: number;
  breakdown: ScoreBreakdownItem[];
} {
  const breakdown: ScoreBreakdownItem[] = [];
  let score = 5;

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

  if (n.protein !== undefined) {
    if (n.protein >= 10) {
      breakdown.push({ factor: "protein", label: "Protein", impact: "positive", detail: `${n.protein}g/100g — Excellent`, points: 2 });
      score += 2;
    } else if (n.protein >= 5) {
      breakdown.push({ factor: "protein", label: "Protein", impact: "positive", detail: `${n.protein}g/100g — Good`, points: 1 });
      score += 1;
    }
  }

  if (n.fiber !== undefined) {
    if (n.fiber >= 6) {
      breakdown.push({ factor: "fiber", label: "Fiber", impact: "positive", detail: `${n.fiber}g/100g — Excellent`, points: 2 });
      score += 2;
    } else if (n.fiber >= 3) {
      breakdown.push({ factor: "fiber", label: "Fiber", impact: "positive", detail: `${n.fiber}g/100g — Good`, points: 1 });
      score += 1;
    }
  }

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

// ─── Additive Scoring ────────────────────────────────────────────────────────

export function scoreAdditives(ingredientText: string): {
  score: number;
  detected: DetectedAdditive[];
  breakdown: ScoreBreakdownItem[];
} {
  const detected = detectAdditives(ingredientText);
  const breakdown: ScoreBreakdownItem[] = [];
  let penalty = 0;

  for (const additive of detected) {
    const w = riskWeight(additive.risk);
    penalty += w;
    const impact: ScoreBreakdownItem["impact"] =
      additive.risk === "harmful" ? "critical" :
      additive.risk === "high" ? "negative" :
      additive.risk === "moderate" ? "warning" :
      additive.risk === "low" ? "neutral" : "positive";

    breakdown.push({
      factor: `additive_${additive.insCode || additive.id}`,
      label: additive.name,
      impact,
      detail: additive.concern,
      points: -w,
    });
  }

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

// ─── Main Deterministic Scorer (sync, backward compat) ──────────────────────

export function scoreProduct(
  nutrition: NutritionPer100g,
  ingredientText: string
): HealthScoreResult {
  const nutritionResult = scoreNutrition(nutrition);
  const additiveResult = scoreAdditives(ingredientText);
  const novaGroup = classifyNOVA(ingredientText);
  const novaSub = novaToScore(novaGroup);

  const raw =
    nutritionResult.score * 0.4 +
    additiveResult.score * 0.3 +
    novaSub * 0.3;

  const score = Math.max(1, Math.min(10, Math.round(raw * 10) / 10));
  const grade = gradeFromScore(score);
  const label = labelFromGrade(grade);

  const novaBreakdown: ScoreBreakdownItem = {
    factor: "nova",
    label: `NOVA Group ${novaGroup}`,
    impact: novaGroup === 1 ? "positive" : novaGroup === 2 ? "neutral" : novaGroup === 3 ? "warning" : "critical",
    detail: novaLabel(novaGroup),
    points: novaSub - 5,
  };

  const harmfuls = additiveResult.detected.filter(a => a.risk === "harmful");
  const highs = additiveResult.detected.filter(a => a.risk === "high");

  let summary = "";
  if (harmfuls.length > 0) {
    summary = `Contains ${harmfuls.map(a => a.name).join(", ")} — critically harmful. Score: ${score}/10.`;
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
    breakdown: [...nutritionResult.breakdown, ...additiveResult.breakdown, novaBreakdown],
    summary,
  };
}

// ─── AI Summary (Gemini primary, Groq fallback) ─────────────────────────────

async function fetchAISummary(
  productName: string,
  ingredientsText: string,
  detected: DetectedAdditive[],
  nutritionData: NutritionData,
  nutritionScore: number
): Promise<{ concerns: string[]; positives: string[]; summary: string } | null> {
  const knownHarmful = detected
    .filter((a) => a.risk === "harmful" || a.risk === "high")
    .map((a) => `${a.name} (${a.concern})`)
    .join("; ");

  const prompt = `You are a nutritionist analysing an Indian food product.

Product: ${productName}
Ingredients: ${ingredientsText || "Not available"}
Harmful/High-risk additives already detected: ${knownHarmful || "None detected"}
Nutrition score (0–10, higher = healthier): ${nutritionScore}
Calories per 100g: ${nutritionData.calories ?? "unknown"}
Sugar per 100g: ${nutritionData.sugar ?? "unknown"}g
Sodium per 100g: ${nutritionData.sodium ?? "unknown"}mg
Saturated fat per 100g: ${nutritionData.saturated_fat ?? "unknown"}g

Provide a JSON response with exactly these fields:
{
  "concerns": ["list of 2-4 specific health concerns for this product"],
  "positives": ["list of 1-3 genuine positives (if any)"],
  "summary": "1-2 sentence plain English verdict for an Indian consumer"
}

Be accurate and specific. Do NOT invent positives if there are none. Do NOT repeat the additives already listed.`;

  try {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
          }),
          signal: AbortSignal.timeout(8000),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        return JSON.parse(text.replace(/```json|```/g, "").trim());
      }
    }
  } catch {}

  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          response_format: { type: "json_object" },
          temperature: 0.1,
          max_tokens: 400,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) {
        const data = await res.json();
        return JSON.parse(data.choices[0].message.content);
      }
    }
  } catch {}

  return null;
}

// ─── AI-Enhanced Analysis (async, new) ──────────────────────────────────────

export async function analyzeProduct(
  productName: string,
  nutrition: NutritionData,
  ingredientsText: string
): Promise<UnifiedAnalysis> {
  const detected = detectAdditives(ingredientsText);
  const riskSummary = summariseRisk(detected);

  const n: NutritionPer100g = {
    calories: nutrition.calories ?? undefined,
    sugar: nutrition.sugar ?? undefined,
    sodium: nutrition.sodium ?? undefined,
    saturated_fat: nutrition.saturated_fat ?? undefined,
    total_fat: nutrition.fat ?? undefined,
    protein: nutrition.protein ?? undefined,
    fiber: nutrition.fiber ?? undefined,
    carbohydrates: nutrition.carbohydrates ?? undefined,
  };

  const { score: nutritionScore } = scoreNutrition(n);
  const { score: additiveScore } = scoreAdditives(ingredientsText);
  const novaGroup = classifyNOVA(ingredientsText);
  const novaScore = novaToScore(novaGroup);

  const overallScore = Math.round(
    nutritionScore * 0.4 + additiveScore * 0.35 + novaScore * 0.25
  );

  const score: ScoreBreakdown = {
    nutritionScore,
    additiveScore,
    novaScore,
    overallScore,
    grade: gradeFromScore(overallScore),
  };

  const ingredients = detected.map((a) => ({
    ingredient: a.name,
    status: (a.risk === "harmful" || a.risk === "high" ? "harmful" : a.risk === "moderate" ? "concern" : "safe") as "safe" | "concern" | "harmful",
    reason: a.concern,
    eNumber: a.eNumber,
    insCode: a.insCode,
  }));

  const basicConcerns: string[] = [];
  if (riskSummary.harmful.length > 0)
    basicConcerns.push(`Contains harmful ingredients: ${riskSummary.harmful.map((a) => a.name).join(", ")}`);
  if (riskSummary.high.length > 0)
    basicConcerns.push(`High-risk additives detected: ${riskSummary.high.map((a) => a.name).join(", ")}`);
  if ((nutrition.sugar ?? 0) > 20) basicConcerns.push("Very high sugar content");
  if ((nutrition.sodium ?? 0) > 600) basicConcerns.push("High sodium — risk for blood pressure");
  if ((nutrition.saturated_fat ?? 0) > 10) basicConcerns.push("High saturated fat content");

  const basicPositives: string[] = [];
  if ((nutrition.protein ?? 0) > 15) basicPositives.push("Good protein source");
  if ((nutrition.fiber ?? 0) > 5) basicPositives.push("Good dietary fibre");
  if (detected.length === 0) basicPositives.push("No known harmful additives detected");

  let concerns = basicConcerns;
  let positives = basicPositives;
  let summary = `Health score: ${overallScore}/10. ${basicConcerns[0] ?? "Review nutrition labels carefully."}`;
  let aiEnhanced = false;

  if (productName || ingredientsText) {
    const aiResult = await fetchAISummary(productName, ingredientsText, detected, nutrition, nutritionScore);
    if (aiResult) {
      const mergedConcerns = [
        ...basicConcerns,
        ...aiResult.concerns.filter(
          (c) => !basicConcerns.some((b) => b.toLowerCase().includes(c.toLowerCase().slice(0, 20)))
        ),
      ];
      concerns = mergedConcerns.slice(0, 6);
      positives = aiResult.positives.length > 0 ? aiResult.positives : basicPositives;
      summary = aiResult.summary;
      aiEnhanced = true;
    }
  }

  return {
    score,
    detectedAdditives: detected,
    riskSummary,
    ingredients,
    concerns,
    positives,
    summary,
    aiEnhanced,
  };
}
