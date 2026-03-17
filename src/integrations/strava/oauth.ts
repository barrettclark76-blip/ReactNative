import { OAuthToken } from '../types';

const STRAVA_SCOPES = ['workouts:read'] as const;

export async function connectStrava(): Promise<OAuthToken> {
  return {
    accessToken: `strava-access-${Date.now()}`,
    refreshToken: `strava-refresh-${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000,
    scopes: [...STRAVA_SCOPES],
  };
}

export async function refreshStravaToken(token: OAuthToken): Promise<OAuthToken> {
  if (!token.refreshToken.includes('strava-refresh')) {
    throw new Error('expired_token');
  }

  return {
    ...token,
    accessToken: `strava-access-${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}

export async function disconnectStrava() {
  return Promise.resolve();
}
