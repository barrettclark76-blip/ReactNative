import Constants from 'expo-constants';

type ApiEnv = {
  whoopApiKey: string;
  stravaClientId: string;
  stravaClientSecret: string;
  cronometerApiKey: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;

export const env: ApiEnv = {
  whoopApiKey: extra.WHOOP_API_KEY ?? '',
  stravaClientId: extra.STRAVA_CLIENT_ID ?? '',
  stravaClientSecret: extra.STRAVA_CLIENT_SECRET ?? '',
  cronometerApiKey: extra.CRONOMETER_API_KEY ?? '',
};

export function assertEnvConfigured() {
  const missing = Object.entries(env)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(`Missing environment values: ${missing.join(', ')}`);
  }
}
