import { WorkoutRecord } from '../types';
import { StravaWorkoutPayload } from './types';

export function mapStravaWorkout(payload: StravaWorkoutPayload): WorkoutRecord {
  return {
    id: `strava-${payload.id}`,
    startedAt: payload.start_date,
    durationMinutes: Math.round(payload.moving_time_s / 60),
    caloriesBurned: payload.calories,
    distanceMeters: payload.distance_m,
    source: 'imported',
    updatedAt: payload.updated_at,
  };
}
