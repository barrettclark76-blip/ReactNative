import { OAuthToken } from '../types';

const WHOOP_SCOPES = ['sleep:read', 'calories:read'] as const;

export async function connectWhoop(): Promise<OAuthToken> {
  return {
    accessToken: `whoop-access-${Date.now()}`,
    refreshToken: `whoop-refresh-${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000,
    scopes: [...WHOOP_SCOPES],
  };
}

export async function refreshWhoopToken(token: OAuthToken): Promise<OAuthToken> {
  if (!token.refreshToken.includes('whoop-refresh')) {
    throw new Error('expired_token');
  }

  return {
    ...token,
    accessToken: `whoop-access-${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}

export async function disconnectWhoop() {
  return Promise.resolve();
}
