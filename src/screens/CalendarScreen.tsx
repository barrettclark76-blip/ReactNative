import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../navigation/types';
import { useMetrics } from '../providers/MetricsProvider';

type CalendarScreenNavigation = NativeStackNavigationProp<RootStackParamList>;

export function CalendarScreen() {
  const navigation = useNavigation<CalendarScreenNavigation>();
  const { getCalendarStatuses } = useMetrics();

  const days = useMemo(() => getCalendarStatuses(), [getCalendarStatuses]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Calendar View</Text>
      <Text style={styles.subtitle}>75-day challenge grid • tap a day for Day Detail</Text>
      <ScrollView>
        <View style={styles.grid}>
          {days.map((day) => (
            <Pressable
              key={day.date}
              style={[styles.cell, day.complete ? styles.complete : styles.incomplete]}
              onPress={() => navigation.navigate('DayDetail', { date: day.date })}
            >
              <Text style={styles.cellDate}>{dayjs(day.date).format('MM/DD')}</Text>
              <Text style={styles.badge}>{day.complete ? 'Complete' : 'Incomplete'}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
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
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 18,
  },
  cell: {
    width: '30.5%',
    minHeight: 74,
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  complete: {
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4',
  },
  incomplete: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  cellDate: {
    fontWeight: '700',
    fontSize: 12,
  },
  badge: {
    fontSize: 11,
  },
});
