export type ISODateString = string;

export interface DietMetricEntry {
  id: string;
  date: ISODateString;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface WorkoutMetricEntry {
  id: string;
  date: ISODateString;
  type: string;
  durationMinutes: number;
  source?: 'manual' | 'imported';
  intensity: 'Low' | 'Moderate' | 'High';
  notes?: string;
}

export interface WaterMetricEntry {
  id: string;
  date: ISODateString;
  ounces: number;
}

export interface BibleReadingMetricEntry {
  id: string;
  date: ISODateString;
  minutes: number;
  notes?: string;
}

export interface SleepMetricEntry {
  id: string;
  date: ISODateString;
  score: number;
  durationHours: number;
  notes?: string;
}

export interface PhotoMetricEntry {
  id: string;
  date: ISODateString;
  uri: string;
  timestamp: string;
  width: number;
  height: number;
}

export interface NutritionGoals {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export const NUTRITION_GOALS: NutritionGoals = {
  calories: 2200,
  proteinGrams: 180,
  carbsGrams: 220,
  fatGrams: 75,
};
