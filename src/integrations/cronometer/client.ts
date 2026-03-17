import { IntegrationError } from '../types';
import { CronometerNutritionPayload } from './types';

export async function fetchCronometerNutrition(
  accessToken: string,
): Promise<CronometerNutritionPayload[]> {
  if (accessToken.includes('rate-limit')) {
    const error: IntegrationError = {
      code: 'rate_limited',
      message: 'Cronometer rate limit reached. Please retry in a few minutes.',
    };
    throw error;
  }

  return [
    {
      id: 'n-001',
      consumed_at: new Date().toISOString(),
      calories: 2230,
      protein_g: 156,
      carbs_g: 198,
      fat_g: 74,
      updated_at: new Date().toISOString(),
    },
  ];
}
