import React from 'react';
import dayjs from 'dayjs';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { NUTRITION_GOALS } from '../domain/metrics';
import { useMetrics } from '../providers/MetricsProvider';

export function DashboardScreen() {
  const today = dayjs().format('YYYY-MM-DD');
  const { getDashboardSummaryForDate } = useMetrics();
  const summary = getDashboardSummaryForDate(today);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Live totals for {today}</Text>
      <View style={styles.card}>
        <Text>Calories: {summary.calories}/{NUTRITION_GOALS.calories}</Text>
        <Text>Protein: {summary.proteinGrams}g</Text>
        <Text>Carbs: {summary.carbsGrams}g</Text>
        <Text>Fat: {summary.fatGrams}g</Text>
      </View>
      <View style={styles.card}>
        <Text>Workouts: {summary.workoutsCompleted}</Text>
        <Text>Water: {summary.waterOunces} oz</Text>
        <Text>Bible reading: {summary.bibleMinutes} min</Text>
        <Text>Sleep score: {summary.sleepScore ?? '-'}</Text>
        <Text>Sleep duration: {summary.sleepDurationHours ?? '-'} hr</Text>
        <Text>Progress photos: {summary.photosCount}</Text>
        <Text style={summary.hasRequiredPhoto ? styles.good : styles.bad}>
          Completion photo requirement: {summary.hasRequiredPhoto ? 'Met' : 'Missing (1 required)'}
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#475569',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    padding: 12,
    gap: 4,
  },
  good: {
    color: '#15803d',
    fontWeight: '600',
  },
  bad: {
    color: '#dc2626',
    fontWeight: '600',
  },
});
