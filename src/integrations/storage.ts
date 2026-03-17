import AsyncStorage from '@react-native-async-storage/async-storage';
import { OAuthToken, ProviderId } from './types';

const tokenKey = (provider: ProviderId) => `integration:${provider}:token`;

export async function saveToken(provider: ProviderId, token: OAuthToken) {
  await AsyncStorage.setItem(tokenKey(provider), JSON.stringify(token));
}

export async function getToken(provider: ProviderId): Promise<OAuthToken | null> {
  const raw = await AsyncStorage.getItem(tokenKey(provider));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as OAuthToken;
  } catch {
    return null;
  }
}

export async function clearToken(provider: ProviderId) {
  await AsyncStorage.removeItem(tokenKey(provider));
}
