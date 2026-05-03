// HealthOX Health Engine - Public API

export { scoreProduct, scoreNutrition, scoreAdditives, classifyNOVA } from "./scorer";
export { detectAdditives, ADDITIVES_DB, getAdditivesByRisk, getAdditivesByCategory } from "./additives-db";
export { findHealthierAlternatives, ALTERNATIVES_DB } from "./alternatives";

export type {
  NutritionPer100g,
  HealthScoreResult,
  ScoreBreakdown,
  NOVAGroup,
} from "./scorer";

export type {
  Additive,
  RiskLevel,
} from "./additives-db";

export type {
  HealthierAlternative,
  AlternativeType,
  Availability,
} from "./alternatives";