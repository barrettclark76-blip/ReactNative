import { useCallback, useEffect, useState } from 'react';
import { clearToken, getToken, saveToken } from './storage';
import {
  IntegrationError,
  IntegrationScope,
  IntegrationStatus,
  OAuthToken,
  ProviderId,
  SyncBehavior,
} from './types';
import { mergeById } from './conflictResolution';

const defaultErrorMessage: Record<IntegrationError['code'], string> = {
  expired_token: 'Your session expired. Please reconnect this provider.',
  missing_scopes: 'Required permissions are missing. Reconnect and allow all scopes.',
  rate_limited: 'Provider rate-limit reached. Please retry later.',
  unknown: 'An unexpected sync issue occurred.',
};

type UseProviderIntegrationArgs<TRecord> = {
  provider: ProviderId;
  requiredScopes: IntegrationScope[];
  connect: () => Promise<OAuthToken>;
  refresh: (token: OAuthToken) => Promise<OAuthToken>;
  disconnectRemote: () => Promise<void>;
  fetchAndMap: (accessToken: string) => Promise<TRecord[]>;
  conflictBehavior?: SyncBehavior;
};

const isIntegrationError = (value: unknown): value is IntegrationError =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'code' in value &&
      typeof (value as { code?: unknown }).code === 'string',
  );

export function useProviderIntegration<TRecord extends { id: string; updatedAt: string; source: 'imported' | 'manual' }>({
  provider,
  requiredScopes,
  connect,
  refresh,
  disconnectRemote,
  fetchAndMap,
  conflictBehavior = 'prefer_manual',
}: UseProviderIntegrationArgs<TRecord>) {
  const [records, setRecords] = useState<TRecord[]>([]);
  const [status, setStatus] = useState<IntegrationStatus>({
    provider,
    connected: false,
    lastSyncedAt: null,
    syncing: false,
    error: null,
  });

  useEffect(() => {
    void (async () => {
      const token = await getToken(provider);
      if (token) {
        setStatus((prev) => ({ ...prev, connected: true }));
      }
    })();
  }, [provider]);

  const setError = useCallback((code: IntegrationError['code'], message?: string) => {
    setStatus((prev) => ({
      ...prev,
      syncing: false,
      error: { code, message: message ?? defaultErrorMessage[code] },
    }));
  }, []);

  const connectProvider = useCallback(async () => {
    const token = await connect();
    await saveToken(provider, token);
    setStatus((prev) => ({ ...prev, connected: true, error: null }));
  }, [connect, provider]);

  const disconnectProvider = useCallback(async () => {
    await disconnectRemote();
    await clearToken(provider);
    setStatus((prev) => ({ ...prev, connected: false, lastSyncedAt: null, error: null }));
    setRecords([]);
  }, [disconnectRemote, provider]);

  const syncNow = useCallback(async () => {
    setStatus((prev) => ({ ...prev, syncing: true, error: null }));

    try {
      const savedToken = await getToken(provider);
      if (!savedToken) {
        setError('expired_token', 'No active session found. Connect this provider first.');
        return;
      }

      const scopeSet = new Set(savedToken.scopes);
      const hasAllScopes = requiredScopes.every((scope) => scopeSet.has(scope));
      if (!hasAllScopes) {
        setError('missing_scopes');
        return;
      }

      let activeToken = savedToken;
      if (savedToken.expiresAt <= Date.now()) {
        try {
          activeToken = await refresh(savedToken);
          await saveToken(provider, activeToken);
        } catch {
          setError('expired_token');
          return;
        }
      }

      const imported = await fetchAndMap(activeToken.accessToken);
      setRecords((prev) => mergeById(prev, imported, conflictBehavior));
      setStatus((prev) => ({
        ...prev,
        syncing: false,
        connected: true,
        lastSyncedAt: new Date().toISOString(),
      }));
    } catch (error) {
      if (isIntegrationError(error)) {
        setError(error.code, error.message);
      } else {
        setError('unknown');
      }
    }
  }, [conflictBehavior, fetchAndMap, provider, refresh, requiredScopes, setError]);

  return {
    records,
    status,
    connectProvider,
    disconnectProvider,
    syncNow,
  };
}
