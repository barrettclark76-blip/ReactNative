import { SleepRecord } from '../types';
import { WhoopSleepPayload } from './types';

export function mapWhoopSleep(payload: WhoopSleepPayload): SleepRecord {
  return {
    id: `whoop-${payload.id}`,
    startAt: payload.start,
    endAt: payload.end,
    totalSleepMinutes: payload.sleep_minutes,
    caloriesBurned: payload.calories_burned,
    source: 'imported',
    updatedAt: payload.updated_at,
  };
}
