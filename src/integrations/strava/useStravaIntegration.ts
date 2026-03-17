import { useProviderIntegration } from '../useProviderIntegration';
import { connectStrava, disconnectStrava, fetchStravaWorkouts, mapStravaWorkout, refreshStravaToken } from './index';

export function useStravaIntegration() {
  return useProviderIntegration({
    provider: 'strava',
    requiredScopes: ['workouts:read'],
    connect: connectStrava,
    refresh: refreshStravaToken,
    disconnectRemote: disconnectStrava,
    fetchAndMap: async (accessToken: string) => {
      const payloads = await fetchStravaWorkouts(accessToken);
      return payloads.map(mapStravaWorkout);
    },
    conflictBehavior: 'prefer_manual',
  });
}
