import { IntegrationError } from '../types';
import { WhoopSleepPayload } from './types';

export async function fetchWhoopSleep(
  accessToken: string,
): Promise<WhoopSleepPayload[]> {
  if (accessToken.includes('rate-limit')) {
    const error: IntegrationError = {
      code: 'rate_limited',
      message: 'Whoop rate limit reached. Please retry in a few minutes.',
    };
    throw error;
  }

  return [
    {
      id: 'slp-001',
      start: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
      sleep_minutes: 458,
      calories_burned: 387,
      updated_at: new Date().toISOString(),
    },
  ];
}
