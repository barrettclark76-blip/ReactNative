import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useMetrics } from '../providers/MetricsProvider';

export function BiometricsScreen() {
  const { sleepEntries, waterEntries, getDailyComplianceForDate } = useMetrics();

  const trend = useMemo(() => {
    const dates = Array.from({ length: 7 }, (_, idx) => dayjs().subtract(6 - idx, 'day').format('YYYY-MM-DD'));
    const sleepPoints = dates.map((date) => sleepEntries.filter((entry) => entry.date === date).slice(-1)[0]);
    const hydrationPoints = dates.map((date) =>
      waterEntries.filter((entry) => entry.date === date).reduce((total, entry) => total + entry.ounces, 0),
    );

    const avgSleep =
      sleepPoints.filter(Boolean).reduce((sum, entry) => sum + (entry?.durationHours ?? 0), 0) /
      Math.max(sleepPoints.filter(Boolean).length, 1);
    const avgRecovery =
      sleepPoints.filter(Boolean).reduce((sum, entry) => sum + (entry?.score ?? 0), 0) /
      Math.max(sleepPoints.filter(Boolean).length, 1);
    const avgHydration = hydrationPoints.reduce((sum, oz) => sum + oz, 0) / hydrationPoints.length;

    return {
      dates,
      sleepPoints,
      hydrationPoints,
      avgSleep,
      avgRecovery,
      avgHydration,
    };
  }, [sleepEntries, waterEntries]);

  const todayCompliance = getDailyComplianceForDate(dayjs().format('YYYY-MM-DD'));

  return (
    <ScreenContainer>
      <Text style={styles.title}>Biometrics View</Text>
      <Text style={styles.helper}>Sleep, recovery, and hydration trends (last 7 days).</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Trend Summary</Text>
        <Text>Avg sleep: {trend.avgSleep.toFixed(1)} hrs</Text>
        <Text>Avg recovery score: {trend.avgRecovery.toFixed(0)}</Text>
        <Text>Avg hydration: {trend.avgHydration.toFixed(0)} oz/day</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Prioritization Indicators</Text>
        <Text style={todayCompliance.sleepRecoveryPriority === 'On Track' ? styles.good : styles.bad}>
          Sleep / recovery: {todayCompliance.sleepRecoveryPriority}
        </Text>
        <Text style={todayCompliance.hydrationOnTrack ? styles.good : styles.bad}>
          Hydration: {todayCompliance.hydrationOnTrack ? 'On Track' : 'Below target'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Trend Detail</Text>
        {trend.dates.map((date, idx) => {
          const sleep = trend.sleepPoints[idx];
          return (
            <Text key={date}>
              {date}: Sleep {sleep ? `${sleep.durationHours}h / score ${sleep.score}` : 'n/a'} • Hydration {trend.hydrationPoints[idx]} oz
            </Text>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  helper: {
    color: '#4b5563',
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
  good: {
    color: '#15803d',
    fontWeight: '600',
  },
  bad: {
    color: '#dc2626',
    fontWeight: '600',
  },
});
