// BioYou Health Engine - Public API

export {
  scoreProduct, scoreNutrition, scoreAdditives, classifyNOVA,
  analyzeProduct,
} from "./scorer";

export {
  detectAdditives, ADDITIVES_DB,
  getAdditivesByRisk, getAdditivesByCategory,
  getCategoryWarnings, summariseRisk,
} from "./additives-db";

export { findHealthierAlternatives, ALTERNATIVES_DB } from "./alternatives";

export type {
  NutritionPer100g, HealthScoreResult, ScoreBreakdownItem,
  NOVAGroup, NutritionData, ScoreBreakdown, IngredientAnalysis,
  UnifiedAnalysis,
} from "./scorer";

export type {
  Additive, RiskLevel, DetectedAdditive,
} from "./additives-db";

export type {
  HealthierAlternative, AlternativeType, Availability,
} from "./alternatives";
