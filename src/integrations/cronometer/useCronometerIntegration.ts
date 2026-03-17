import { useProviderIntegration } from '../useProviderIntegration';
import {
  connectCronometer,
  disconnectCronometer,
  fetchCronometerNutrition,
  mapCronometerNutrition,
  refreshCronometerToken,
} from './index';

export function useCronometerIntegration() {
  return useProviderIntegration({
    provider: 'cronometer',
    requiredScopes: ['nutrition:read'],
    connect: connectCronometer,
    refresh: refreshCronometerToken,
    disconnectRemote: disconnectCronometer,
    fetchAndMap: async (accessToken: string) => {
      const payloads = await fetchCronometerNutrition(accessToken);
      return payloads.map(mapCronometerNutrition);
    },
    conflictBehavior: 'prefer_manual',
  });
}
