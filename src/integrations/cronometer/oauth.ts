import { OAuthToken } from '../types';

const CRONOMETER_SCOPES = ['nutrition:read'] as const;

export async function connectCronometer(): Promise<OAuthToken> {
  return {
    accessToken: `cronometer-access-${Date.now()}`,
    refreshToken: `cronometer-refresh-${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000,
    scopes: [...CRONOMETER_SCOPES],
  };
}

export async function refreshCronometerToken(token: OAuthToken): Promise<OAuthToken> {
  if (!token.refreshToken.includes('cronometer-refresh')) {
    throw new Error('expired_token');
  }

  return {
    ...token,
    accessToken: `cronometer-access-${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}

export async function disconnectCronometer() {
  return Promise.resolve();
}
