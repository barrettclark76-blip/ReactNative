import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  BibleReadingMetricEntry,
  DietMetricEntry,
  ISODateString,
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
}

interface MetricsContextValue {
  dietEntries: DietMetricEntry[];
  workoutEntries: WorkoutMetricEntry[];
  waterEntries: WaterMetricEntry[];
  bibleEntries: BibleReadingMetricEntry[];
  sleepEntries: SleepMetricEntry[];
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
  getDashboardSummaryForDate: (date: ISODateString) => DashboardSummary;
}

const MetricsContext = createContext<MetricsContextValue | undefined>(undefined);

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const today = dayjs().format('YYYY-MM-DD');

export function MetricsProvider({ children }: PropsWithChildren) {
  const [dietEntries, setDietEntries] = useState<DietMetricEntry[]>([]);
  const [workoutEntries, setWorkoutEntries] = useState<WorkoutMetricEntry[]>([]);
  const [waterEntries, setWaterEntries] = useState<WaterMetricEntry[]>([]);
  const [bibleEntries, setBibleEntries] = useState<BibleReadingMetricEntry[]>([]);
  const [sleepEntries, setSleepEntries] = useState<SleepMetricEntry[]>([]);

  const value = useMemo<MetricsContextValue>(
    () => ({
      dietEntries,
      workoutEntries,
      waterEntries,
      bibleEntries,
      sleepEntries,
      addDietEntry: (entry) => setDietEntries((current) => [...current, { ...entry, id: createId() }]),
      updateDietEntry: (entry) =>
        setDietEntries((current) => current.map((item) => (item.id === entry.id ? entry : item))),
      deleteDietEntry: (id) => setDietEntries((current) => current.filter((item) => item.id !== id)),
      addWorkoutEntry: (entry) => setWorkoutEntries((current) => [...current, { ...entry, id: createId() }]),
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
      getDashboardSummaryForDate: (date = today) => {
        const dietForDay = dietEntries.filter((entry) => entry.date === date);
        const workoutsForDay = workoutEntries.filter((entry) => entry.date === date);
        const waterForDay = waterEntries.filter((entry) => entry.date === date);
        const bibleForDay = bibleEntries.filter((entry) => entry.date === date);
        const sleepForDay = sleepEntries.filter((entry) => entry.date === date);
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
        };
      },
    }),
    [bibleEntries, dietEntries, sleepEntries, waterEntries, workoutEntries],
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
