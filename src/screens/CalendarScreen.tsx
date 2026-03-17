import React from 'react';
import { Button, StyleSheet, Text } from 'react-native';
import dayjs from 'dayjs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../navigation/types';

type CalendarScreenNavigation = NativeStackNavigationProp<RootStackParamList>;

export function CalendarScreen() {
  const navigation = useNavigation<CalendarScreenNavigation>();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Calendar</Text>
      <Text>Selected day: {dayjs().format('YYYY-MM-DD')}</Text>
      <Button
        title="Open Today's Details"
        onPress={() => navigation.navigate('DayDetail', { date: dayjs().format('YYYY-MM-DD') })}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});
