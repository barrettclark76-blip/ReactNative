export type ProviderId = 'whoop' | 'strava' | 'cronometer';

export type IntegrationScope =
  | 'sleep:read'
  | 'calories:read'
  | 'workouts:read'
  | 'nutrition:read';

export type IntegrationErrorCode = 'expired_token' | 'missing_scopes' | 'rate_limited' | 'unknown';

export type IntegrationError = {
  code: IntegrationErrorCode;
  message: string;
};

export type OAuthToken = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scopes: IntegrationScope[];
};

export type IntegrationStatus = {
  provider: ProviderId;
  connected: boolean;
  lastSyncedAt: string | null;
  syncing: boolean;
  error: IntegrationError | null;
};

export type ImportSource = 'imported' | 'manual';

export type SleepRecord = {
  id: string;
  startAt: string;
  endAt: string;
  totalSleepMinutes: number;
  caloriesBurned: number;
  source: ImportSource;
  updatedAt: string;
};

export type WorkoutRecord = {
  id: string;
  startedAt: string;
  durationMinutes: number;
  caloriesBurned: number;
  distanceMeters: number;
  source: ImportSource;
  updatedAt: string;
};

export type NutritionRecord = {
  id: string;
  consumedAt: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  source: ImportSource;
  updatedAt: string;
};

export type SyncBehavior = 'prefer_manual' | 'prefer_imported';
