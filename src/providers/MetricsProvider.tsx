import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  BibleReadingMetricEntry,
  DietMetricEntry,
  ISODateString,
  NUTRITION_GOALS,
  PhotoMetricEntry,
  SleepMetricEntry,
  WaterMetricEntry,
  WorkoutMetricEntry,
} from '../domain/metrics';

interface DashboardSummary {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  workoutsCompleted: number;
  waterOunces: number;
  bibleMinutes: number;
  sleepScore?: number;
  sleepDurationHours?: number;
  photosCount: number;
  workoutDoneToday: boolean;
  dietGoalsMetToday: boolean;
  bibleReadToday: boolean;
  progressPhotoUploadedToday: boolean;
  sleepRecoveryPriority: 'On Track' | 'Needs Attention';
  completionCount: number;
  totalChecks: number;
  completionProgress: number;
  dayCompleteEligible: boolean;
}

interface DailyCompliance {
  date: ISODateString;
  workoutOncePerDay: boolean;
  dietGoalsMetPerDay: boolean;
  readBiblePerDay: boolean;
  progressPhotoUploadedPerDay: boolean;
  sleepRecoveryPriority: 'On Track' | 'Needs Attention';
  hydrationOnTrack: boolean;
  complete: boolean;
  completionCount: number;
  totalChecks: number;
}

interface CalendarDayStatus extends DailyCompliance {
  inRange: boolean;
}

interface MetricsContextValue {
  dietEntries: DietMetricEntry[];
  workoutEntries: WorkoutMetricEntry[];
  waterEntries: WaterMetricEntry[];
  bibleEntries: BibleReadingMetricEntry[];
  sleepEntries: SleepMetricEntry[];
  photoEntries: PhotoMetricEntry[];
  addDietEntry: (entry: Omit<DietMetricEntry, 'id'>) => void;
  updateDietEntry: (entry: DietMetricEntry) => void;
  deleteDietEntry: (id: string) => void;
  addWorkoutEntry: (entry: Omit<WorkoutMetricEntry, 'id'>) => void;
  updateWorkoutEntry: (entry: WorkoutMetricEntry) => void;
  deleteWorkoutEntry: (id: string) => void;
  addWaterEntry: (entry: Omit<WaterMetricEntry, 'id'>) => void;
  updateWaterEntry: (entry: WaterMetricEntry) => void;
  deleteWaterEntry: (id: string) => void;
  addBibleEntry: (entry: Omit<BibleReadingMetricEntry, 'id'>) => void;
  updateBibleEntry: (entry: BibleReadingMetricEntry) => void;
  deleteBibleEntry: (id: string) => void;
  addSleepEntry: (entry: Omit<SleepMetricEntry, 'id'>) => void;
  updateSleepEntry: (entry: SleepMetricEntry) => void;
  deleteSleepEntry: (id: string) => void;
  addPhotoEntry: (entry: Omit<PhotoMetricEntry, 'id'>) => void;
  deletePhotoEntry: (id: string) => void;
  getPhotosForDate: (date: ISODateString) => PhotoMetricEntry[];
  getDashboardSummaryForDate: (date: ISODateString) => DashboardSummary;
  getDailyComplianceForDate: (date: ISODateString) => DailyCompliance;
  getCalendarStatuses: () => CalendarDayStatus[];
}

const MetricsContext = createContext<MetricsContextValue | undefined>(undefined);

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const today = dayjs().format('YYYY-MM-DD');
const WATER_GOAL_OZ = 128;
const SLEEP_HOURS_TARGET = 7;
const SLEEP_SCORE_TARGET = 70;

export function MetricsProvider({ children }: PropsWithChildren) {
  const [dietEntries, setDietEntries] = useState<DietMetricEntry[]>([]);
  const [workoutEntries, setWorkoutEntries] = useState<WorkoutMetricEntry[]>([]);
  const [waterEntries, setWaterEntries] = useState<WaterMetricEntry[]>([]);
  const [bibleEntries, setBibleEntries] = useState<BibleReadingMetricEntry[]>([]);
  const [sleepEntries, setSleepEntries] = useState<SleepMetricEntry[]>([]);
  const [photoEntries, setPhotoEntries] = useState<PhotoMetricEntry[]>([]);

  const getDailyComplianceForDate = (date: ISODateString): DailyCompliance => {
    const dietForDay = dietEntries.filter((entry) => entry.date === date);
    const workoutsForDay = workoutEntries.filter((entry) => entry.date === date);
    const waterForDay = waterEntries.filter((entry) => entry.date === date);
    const bibleForDay = bibleEntries.filter((entry) => entry.date === date);
    const sleepForDay = sleepEntries.filter((entry) => entry.date === date);
    const photosForDay = photoEntries.filter((entry) => entry.date === date);
    const latestSleep = sleepForDay[sleepForDay.length - 1];

    const calories = dietForDay.reduce((total, entry) => total + entry.calories, 0);
    const protein = dietForDay.reduce((total, entry) => total + entry.proteinGrams, 0);
    const carbs = dietForDay.reduce((total, entry) => total + entry.carbsGrams, 0);
    const fat = dietForDay.reduce((total, entry) => total + entry.fatGrams, 0);
    const water = waterForDay.reduce((total, entry) => total + entry.ounces, 0);

    const workoutOncePerDay = workoutsForDay.length >= 1;
    const dietGoalsMetPerDay =
      calories <= NUTRITION_GOALS.calories &&
      protein >= NUTRITION_GOALS.proteinGrams &&
      carbs >= NUTRITION_GOALS.carbsGrams &&
      fat >= NUTRITION_GOALS.fatGrams;
    const readBiblePerDay = bibleForDay.reduce((total, entry) => total + entry.minutes, 0) > 0;
    const progressPhotoUploadedPerDay = photosForDay.length > 0;
    const hydrationOnTrack = water >= WATER_GOAL_OZ;
    const sleepRecoveryPriority =
      latestSleep && latestSleep.durationHours >= SLEEP_HOURS_TARGET && latestSleep.score >= SLEEP_SCORE_TARGET
        ? 'On Track'
        : 'Needs Attention';

    const checks = [
      workoutOncePerDay,
      dietGoalsMetPerDay,
      readBiblePerDay,
      progressPhotoUploadedPerDay,
      sleepRecoveryPriority === 'On Track',
    ];
    const completionCount = checks.filter(Boolean).length;

    return {
      date,
      workoutOncePerDay,
      dietGoalsMetPerDay,
      readBiblePerDay,
      progressPhotoUploadedPerDay,
      sleepRecoveryPriority,
      hydrationOnTrack,
      complete: completionCount === checks.length,
      completionCount,
      totalChecks: checks.length,
    };
  };

  const getDashboardSummaryForDate = (date: ISODateString = today): DashboardSummary => {
    const compliance = getDailyComplianceForDate(date);
    const dietForDay = dietEntries.filter((entry) => entry.date === date);
    const workoutsForDay = workoutEntries.filter((entry) => entry.date === date);
    const waterForDay = waterEntries.filter((entry) => entry.date === date);
    const bibleForDay = bibleEntries.filter((entry) => entry.date === date);
    const sleepForDay = sleepEntries.filter((entry) => entry.date === date);
    const photosForDay = photoEntries.filter((entry) => entry.date === date);
    const latestSleep = sleepForDay[sleepForDay.length - 1];

    return {
      calories: dietForDay.reduce((total, entry) => total + entry.calories, 0),
      proteinGrams: dietForDay.reduce((total, entry) => total + entry.proteinGrams, 0),
      carbsGrams: dietForDay.reduce((total, entry) => total + entry.carbsGrams, 0),
      fatGrams: dietForDay.reduce((total, entry) => total + entry.fatGrams, 0),
      workoutsCompleted: workoutsForDay.length,
      waterOunces: waterForDay.reduce((total, entry) => total + entry.ounces, 0),
      bibleMinutes: bibleForDay.reduce((total, entry) => total + entry.minutes, 0),
      sleepScore: latestSleep?.score,
      sleepDurationHours: latestSleep?.durationHours,
      photosCount: photosForDay.length,
      workoutDoneToday: compliance.workoutOncePerDay,
      dietGoalsMetToday: compliance.dietGoalsMetPerDay,
      bibleReadToday: compliance.readBiblePerDay,
      progressPhotoUploadedToday: compliance.progressPhotoUploadedPerDay,
      sleepRecoveryPriority: compliance.sleepRecoveryPriority,
      completionCount: compliance.completionCount,
      totalChecks: compliance.totalChecks,
      completionProgress: compliance.completionCount / compliance.totalChecks,
      dayCompleteEligible: compliance.complete,
    };
  };

  const getCalendarStatuses = (): CalendarDayStatus[] => {
    const start = dayjs().startOf('day').subtract(74, 'day');
    const end = dayjs().startOf('day');

    return Array.from({ length: 75 }, (_, idx) => {
      const day = start.add(idx, 'day');
      const date = day.format('YYYY-MM-DD');
      const compliance = getDailyComplianceForDate(date);

      return {
        ...compliance,
        inRange: day.isBefore(end) || day.isSame(end),
      };
    });
  };

  const value = useMemo<MetricsContextValue>(
    () => ({
      dietEntries,
      workoutEntries,
      waterEntries,
      bibleEntries,
      sleepEntries,
      photoEntries,
      addDietEntry: (entry) => setDietEntries((current) => [...current, { ...entry, id: createId() }]),
      updateDietEntry: (entry) =>
        setDietEntries((current) => current.map((item) => (item.id === entry.id ? entry : item))),
      deleteDietEntry: (id) => setDietEntries((current) => current.filter((item) => item.id !== id)),
      addWorkoutEntry: (entry) =>
        setWorkoutEntries((current) => [
          ...current,
          { ...entry, source: entry.source ?? 'manual', id: createId() },
        ]),
      updateWorkoutEntry: (entry) =>
        setWorkoutEntries((current) => current.map((item) => (item.id === entry.id ? entry : item))),
      deleteWorkoutEntry: (id) => setWorkoutEntries((current) => current.filter((item) => item.id !== id)),
      addWaterEntry: (entry) => setWaterEntries((current) => [...current, { ...entry, id: createId() }]),
      updateWaterEntry: (entry) =>
        setWaterEntries((current) => current.map((item) => (item.id === entry.id ? entry : item))),
      deleteWaterEntry: (id) => setWaterEntries((current) => current.filter((item) => item.id !== id)),
      addBibleEntry: (entry) => setBibleEntries((current) => [...current, { ...entry, id: createId() }]),
      updateBibleEntry: (entry) =>
        setBibleEntries((current) => current.map((item) => (item.id === entry.id ? entry : item))),
      deleteBibleEntry: (id) => setBibleEntries((current) => current.filter((item) => item.id !== id)),
      addSleepEntry: (entry) => setSleepEntries((current) => [...current, { ...entry, id: createId() }]),
      updateSleepEntry: (entry) =>
        setSleepEntries((current) => current.map((item) => (item.id === entry.id ? entry : item))),
      deleteSleepEntry: (id) => setSleepEntries((current) => current.filter((item) => item.id !== id)),
      addPhotoEntry: (entry) => setPhotoEntries((current) => [...current, { ...entry, id: createId() }]),
      deletePhotoEntry: (id) => setPhotoEntries((current) => current.filter((item) => item.id !== id)),
      getPhotosForDate: (date) => photoEntries.filter((entry) => entry.date === date),
      getDashboardSummaryForDate,
      getDailyComplianceForDate,
      getCalendarStatuses,
    }),
    [bibleEntries, dietEntries, photoEntries, sleepEntries, waterEntries, workoutEntries],
  );

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
}

export function useMetrics() {
  const context = useContext(MetricsContext);

  if (!context) {
    throw new Error('useMetrics must be used inside MetricsProvider.');
  }

  return context;
}
