import { NutritionRecord } from '../types';
import { CronometerNutritionPayload } from './types';

export function mapCronometerNutrition(
  payload: CronometerNutritionPayload,
): NutritionRecord {
  return {
    id: `cronometer-${payload.id}`,
    consumedAt: payload.consumed_at,
    calories: payload.calories,
    proteinGrams: payload.protein_g,
    carbsGrams: payload.carbs_g,
    fatGrams: payload.fat_g,
    source: 'imported',
    updatedAt: payload.updated_at,
  };
}
