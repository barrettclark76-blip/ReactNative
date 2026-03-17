import { useProviderIntegration } from '../useProviderIntegration';
import { connectWhoop, disconnectWhoop, fetchWhoopSleep, mapWhoopSleep, refreshWhoopToken } from './index';

export function useWhoopIntegration() {
  return useProviderIntegration({
    provider: 'whoop',
    requiredScopes: ['sleep:read', 'calories:read'],
    connect: connectWhoop,
    refresh: refreshWhoopToken,
    disconnectRemote: disconnectWhoop,
    fetchAndMap: async (accessToken: string) => {
      const payloads = await fetchWhoopSleep(accessToken);
      return payloads.map(mapWhoopSleep);
    },
    conflictBehavior: 'prefer_manual',
  });
}
