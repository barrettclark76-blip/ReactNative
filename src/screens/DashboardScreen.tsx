import React from 'react';
import dayjs from 'dayjs';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { NUTRITION_GOALS } from '../domain/metrics';
import { useMetrics } from '../providers/MetricsProvider';

function ComplianceRow({ label, complete }: { label: string; complete: boolean }) {
  return (
    <View style={styles.checkRow}>
      <Text style={styles.checkLabel}>{label}</Text>
      <Text style={complete ? styles.good : styles.bad}>{complete ? '✅' : '⬜'}</Text>
    </View>
  );
}

export function DashboardScreen() {
  const today = dayjs().format('YYYY-MM-DD');
  const { getDashboardSummaryForDate } = useMetrics();
  const summary = getDashboardSummaryForDate(today);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Today summary • {today}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today Nutrition</Text>
        <Text>Calories: {summary.calories}/{NUTRITION_GOALS.calories}</Text>
        <Text>Protein: {summary.proteinGrams}g/{NUTRITION_GOALS.proteinGrams}g</Text>
        <Text>Carbs: {summary.carbsGrams}g/{NUTRITION_GOALS.carbsGrams}g</Text>
        <Text>Fat: {summary.fatGrams}g/{NUTRITION_GOALS.fatGrams}g</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today Activity</Text>
        <Text>Workouts: {summary.workoutsCompleted}</Text>
        <Text>Water: {summary.waterOunces} oz</Text>
        <Text>Bible reading: {summary.bibleMinutes} min</Text>
        <Text>Photos uploaded: {summary.photosCount}</Text>
        <Text>Sleep score: {summary.sleepScore ?? '-'}</Text>
        <Text>Sleep duration: {summary.sleepDurationHours ?? '-'} hr</Text>
        <Text style={summary.sleepRecoveryPriority === 'On Track' ? styles.good : styles.bad}>
          Sleep / recovery priority: {summary.sleepRecoveryPriority}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Completion Ring</Text>
        <Text style={styles.ringText}>{Math.round(summary.completionProgress * 100)}%</Text>
        <Text style={styles.subtitle}>{summary.completionCount}/{summary.totalChecks} daily checks complete</Text>
        <ComplianceRow label="Workout once/day" complete={summary.workoutDoneToday} />
        <ComplianceRow label="Diet goals met/day" complete={summary.dietGoalsMetToday} />
        <ComplianceRow label="Read Bible/day" complete={summary.bibleReadToday} />
        <ComplianceRow label="Progress photo uploaded/day" complete={summary.progressPhotoUploadedToday} />
        <ComplianceRow
          label="Sleep/recovery prioritization"
          complete={summary.sleepRecoveryPriority === 'On Track'}
        />
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
  cardTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  ringText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  checkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkLabel: {
    color: '#0f172a',
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
