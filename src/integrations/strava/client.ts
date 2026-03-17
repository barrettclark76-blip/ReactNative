import { IntegrationError } from '../types';
import { StravaWorkoutPayload } from './types';

export async function fetchStravaWorkouts(
  accessToken: string,
): Promise<StravaWorkoutPayload[]> {
  if (accessToken.includes('rate-limit')) {
    const error: IntegrationError = {
      code: 'rate_limited',
      message: 'Strava rate limit reached. Please retry in a few minutes.',
    };
    throw error;
  }

  return [
    {
      id: 'w-001',
      start_date: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      moving_time_s: 2850,
      calories: 540,
      distance_m: 10120,
      updated_at: new Date().toISOString(),
    },
  ];
}
