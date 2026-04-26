// FILE: src/lib/analysisSchema.ts

import { z } from 'zod'

// ── Zod schema for runtime validation of Gemini output ────────────────────────

export const HarmfulIngredientSchema = z.object({
  name:                       z.string(),
  also_known_as:              z.array(z.string()).optional().default([]),
  found_in_product:           z.boolean().optional().default(true),
  concern:                    z.string(),
  severity:                   z.enum(['high', 'medium', 'low']),
  scientific_source:          z.string().optional(),
  source_url:                 z.string().optional(),
  global_safe_limit:          z.string().optional(),
  amount_in_this_product:     z.string().optional(),
  personalized_safe_limit:    z.string().optional(),
  percentage_of_daily_limit:  z.string().optional(),
})

export const IngredientWarningSchema = z.object({
  ingredient: z.string(),
  concern:    z.string(),
  severity:   z.enum(['high', 'medium', 'low']),
})

export const AlternativeSchema = z.object({
  name:         z.string(),
  reason:       z.string().optional(),
  availability: z.string().optional(),
  type:         z.string().optional(),
})

export const AnalysisOutputSchema = z.object({
  health_rating:   z.enum(['healthy', 'moderate', 'unhealthy']),
  health_score:    z.number().min(1).max(10),
  confidence:      z.enum(['high', 'medium', 'low']).default('high'),

  health_score_breakdown: z.object({
    nutrition_score:         z.number().min(1).max(10),
    ingredient_safety_score: z.number().min(1).max(10),
    processing_score:        z.number().min(1).max(10),
    overall:                 z.number().min(1).max(10),
  }),

  summary: z.string().min(10),

  detailed_breakdown: z.object({
    calories:               z.string(),
    protein:                z.string(),
    sugar:                  z.string(),
    sodium:                 z.string(),
    fat:                    z.string(),
    fiber:                  z.string(),
    processing_level:       z.enum(['minimally_processed', 'moderately_processed', 'ultra_processed']),
    overall_nutrient_density: z.enum(['high', 'medium', 'low']),
  }),

  safe_consumption: z.object({
    amount:                z.string(),
    frequency:             z.string(),
    notes:                 z.string(),
    personalized_for_user: z.string().nullable().optional(),
  }),

  harmful_ingredients:    z.array(HarmfulIngredientSchema).default([]),
  ingredient_warnings:    z.array(IngredientWarningSchema).default([]),
  long_term_risks:        z.array(z.string()).min(1).max(5),
  positives:              z.array(z.string()).default([]),
  healthier_alternatives: z.array(AlternativeSchema).min(1),

  fssai_compliance:        z.enum(['compliant', 'concern', 'unknown']),
  diabetic_suitability:    z.enum(['suitable', 'consume_with_caution', 'avoid']),
  bp_suitability:          z.enum(['suitable', 'consume_with_caution', 'avoid']),
  child_suitability:       z.enum(['suitable', 'consume_with_caution', 'avoid']),
  pregnancy_suitability:   z.enum(['suitable', 'consume_with_caution', 'avoid']),

  unreadable_fields:   z.array(z.string()).optional().default([]),
})

export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>

// ── Gemini responseSchema object (sent in generationConfig) ──────────────────
// This is the JSON Schema equivalent that Gemini enforces at generation time.
// Must stay in sync with AnalysisOutputSchema above.

export const GEMINI_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    health_rating:   { type: 'string', enum: ['healthy', 'moderate', 'unhealthy'] },
    health_score:    { type: 'number' },
    confidence:      { type: 'string', enum: ['high', 'medium', 'low'] },

    health_score_breakdown: {
      type: 'object',
      properties: {
        nutrition_score:         { type: 'number' },
        ingredient_safety_score: { type: 'number' },
        processing_score:        { type: 'number' },
        overall:                 { type: 'number' },
      },
      required: ['nutrition_score', 'ingredient_safety_score', 'processing_score', 'overall'],
    },

    summary: { type: 'string' },

    detailed_breakdown: {
      type: 'object',
      properties: {
        calories:                 { type: 'string' },
        protein:                  { type: 'string' },
        sugar:                    { type: 'string' },
        sodium:                   { type: 'string' },
        fat:                      { type: 'string' },
        fiber:                    { type: 'string' },
        processing_level:         { type: 'string', enum: ['minimally_processed', 'moderately_processed', 'ultra_processed'] },
        overall_nutrient_density: { type: 'string', enum: ['high', 'medium', 'low'] },
      },
      required: ['calories', 'protein', 'sugar', 'sodium', 'fat', 'fiber', 'processing_level', 'overall_nutrient_density'],
    },

    safe_consumption: {
      type: 'object',
      properties: {
        amount:                { type: 'string' },
        frequency:             { type: 'string' },
        notes:                 { type: 'string' },
        personalized_for_user: { type: 'string', nullable: true },
      },
      required: ['amount', 'frequency', 'notes'],
    },

    harmful_ingredients: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name:                       { type: 'string' },
          also_known_as:              { type: 'array', items: { type: 'string' } },
          found_in_product:           { type: 'boolean' },
          concern:                    { type: 'string' },
          severity:                   { type: 'string', enum: ['high', 'medium', 'low'] },
          scientific_source:          { type: 'string' },
          source_url:                 { type: 'string' },
          global_safe_limit:          { type: 'string' },
          amount_in_this_product:     { type: 'string' },
          personalized_safe_limit:    { type: 'string' },
          percentage_of_daily_limit:  { type: 'string' },
        },
        required: ['name', 'concern', 'severity', 'found_in_product'],
      },
    },

    ingredient_warnings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ingredient: { type: 'string' },
          concern:    { type: 'string' },
          severity:   { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['ingredient', 'concern', 'severity'],
      },
    },

    long_term_risks:        { type: 'array', items: { type: 'string' } },
    positives:              { type: 'array', items: { type: 'string' } },

    healthier_alternatives: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name:         { type: 'string' },
          reason:       { type: 'string' },
          availability: { type: 'string' },
          type:         { type: 'string' },
        },
        required: ['name', 'reason'],
      },
    },

    fssai_compliance:        { type: 'string', enum: ['compliant', 'concern', 'unknown'] },
    diabetic_suitability:    { type: 'string', enum: ['suitable', 'consume_with_caution', 'avoid'] },
    bp_suitability:          { type: 'string', enum: ['suitable', 'consume_with_caution', 'avoid'] },
    child_suitability:       { type: 'string', enum: ['suitable', 'consume_with_caution', 'avoid'] },
    pregnancy_suitability:   { type: 'string', enum: ['suitable', 'consume_with_caution', 'avoid'] },
    unreadable_fields:       { type: 'array', items: { type: 'string' } },
  },
  required: [
    'health_rating', 'health_score', 'confidence', 'health_score_breakdown',
    'summary', 'detailed_breakdown', 'safe_consumption',
    'harmful_ingredients', 'ingredient_warnings', 'long_term_risks',
    'positives', 'healthier_alternatives',
    'fssai_compliance', 'diabetic_suitability', 'bp_suitability',
    'child_suitability', 'pregnancy_suitability',
  ],
}