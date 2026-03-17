export type ISODateString = string; // YYYY-MM-DD

export type NutritionMicronutrients = Partial<{
  fiberGrams: number;
  sodiumMg: number;
  potassiumMg: number;
  sugarGrams: number;
  cholesterolMg: number;
}>;

export interface DietEntry {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  micronutrients?: NutritionMicronutrients;
}

export type WorkoutSource = 'manual' | 'imported';

export interface WorkoutEntry {
  source: WorkoutSource;
  name?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  completedAt?: string;
  notes?: string;
}

export type WaterUnit = 'oz' | 'ml';

export interface WaterIntakeEntry {
  amount: number;
  unit: WaterUnit;
  timestamp?: string;
}

export interface SleepMetrics {
  score: number;
  durationMinutes: number;
  recovery: number;
}

export interface ProgressPhoto {
  uri: string;
  timestamp: string;
}

export interface DailyGoals {
  workoutRequired: boolean;
  targetCalories?: number;
  bibleReadingMinutes?: number;
  waterTargetOz?: number;
  waterTargetMl?: number;
  sleepScoreTarget?: number;
}

export interface GoalStatusFlags {
  workoutComplete?: boolean;
  dietGoalMet?: boolean;
  bibleReadingComplete?: boolean;
  photoUploaded?: boolean;
  dayComplete?: boolean;
}

export interface ChallengeDay {
  date: ISODateString;
  dietEntries: DietEntry[];
  workouts: WorkoutEntry[];
  waterIntake: WaterIntakeEntry[];
  bibleReadingMinutes: number;
  sleep?: SleepMetrics;
  progressPhotos: ProgressPhoto[];
  goals?: DailyGoals;
  goalStatus?: GoalStatusFlags;
}

export type ChallengeDayMap = Record<ISODateString, ChallengeDay>;

const OUNCES_TO_ML = 29.5735;

const toDate = (value: ISODateString): Date => {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid ISO date string: ${value}`);
  }

  return parsed;
};

const formatDate = (date: Date): ISODateString => {
  const year = date.getUTCFullYear();
  const month = (`0${date.getUTCMonth() + 1}`).slice(-2);
  const day = (`0${date.getUTCDate()}`).slice(-2);

  return `${year}-${month}-${day}`;
};

const previousDate = (value: ISODateString): ISODateString => {
  const date = toDate(value);
  date.setUTCDate(date.getUTCDate() - 1);

  return formatDate(date);
};

const getTotalCalories = (day: ChallengeDay): number =>
  day.dietEntries.reduce((total, entry) => total + entry.calories, 0);

const getWaterIntakeMl = (day: ChallengeDay): number =>
  day.waterIntake.reduce((total, entry) => {
    if (entry.unit === 'ml') {
      return total + entry.amount;
    }

    return total + entry.amount * OUNCES_TO_ML;
  }, 0);

export const isWorkoutComplete = (day: ChallengeDay): boolean => {
  if (typeof day.goalStatus?.workoutComplete === 'boolean') {
    return day.goalStatus.workoutComplete;
  }

  return day.workouts.length > 0;
};

export const isDietGoalMet = (day: ChallengeDay, goals: DailyGoals): boolean => {
  if (typeof day.goalStatus?.dietGoalMet === 'boolean') {
    return day.goalStatus.dietGoalMet;
  }

  if (goals.targetCalories !== undefined) {
    return getTotalCalories(day) <= goals.targetCalories;
  }

  return day.dietEntries.length > 0;
};

export const isBibleReadingComplete = (day: ChallengeDay): boolean => {
  if (typeof day.goalStatus?.bibleReadingComplete === 'boolean') {
    return day.goalStatus.bibleReadingComplete;
  }

  const target = day.goals?.bibleReadingMinutes;
  if (target !== undefined) {
    return day.bibleReadingMinutes >= target;
  }

  return day.bibleReadingMinutes > 0;
};

export const isPhotoUploaded = (day: ChallengeDay): boolean => {
  if (typeof day.goalStatus?.photoUploaded === 'boolean') {
    return day.goalStatus.photoUploaded;
  }

  return day.progressPhotos.length > 0;
};

const isWaterGoalMet = (day: ChallengeDay): boolean => {
  const waterTargetMl =
    day.goals?.waterTargetMl ??
    (day.goals?.waterTargetOz !== undefined ? day.goals.waterTargetOz * OUNCES_TO_ML : undefined);

  if (waterTargetMl === undefined) {
    return true;
  }

  return getWaterIntakeMl(day) >= waterTargetMl;
};

const isSleepGoalMet = (day: ChallengeDay): boolean => {
  if (!day.goals?.sleepScoreTarget) {
    return true;
  }

  if (!day.sleep) {
    return false;
  }

  return day.sleep.score >= day.goals.sleepScoreTarget;
};

export const isDayComplete = (day: ChallengeDay): boolean => {
  if (typeof day.goalStatus?.dayComplete === 'boolean') {
    return day.goalStatus.dayComplete;
  }

  return (
    (!day.goals?.workoutRequired || isWorkoutComplete(day)) &&
    isDietGoalMet(day, day.goals ?? { workoutRequired: false }) &&
    isBibleReadingComplete(day) &&
    isPhotoUploaded(day) &&
    isWaterGoalMet(day) &&
    isSleepGoalMet(day)
  );
};

export const getCurrentCompletionStreak = (days: ChallengeDayMap): number => {
  const dates = Object.keys(days).sort();
  if (dates.length === 0) {
    return 0;
  }

  let streak = 0;
  let expectedDate = dates[dates.length - 1];

  for (let i = dates.length - 1; i >= 0; i -= 1) {
    const date = dates[i];
    if (date !== expectedDate) {
      break;
    }

    if (!isDayComplete(days[date])) {
      break;
    }

    streak += 1;
    expectedDate = previousDate(expectedDate);
  }

  return streak;
};

export const getLongestCompletionStreak = (days: ChallengeDayMap): number => {
  const dates = Object.keys(days).sort();
  let best = 0;
  let running = 0;
  let previous: ISODateString | null = null;

  for (const date of dates) {
    if (!isDayComplete(days[date])) {
      running = 0;
      previous = date;
      continue;
    }

    if (previous !== null && previousDate(date) === previous) {
      running += 1;
    } else {
      running = 1;
    }

    if (running > best) {
      best = running;
    }

    previous = date;
  }

  return best;
};
