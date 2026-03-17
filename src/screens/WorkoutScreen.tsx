import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';

export function WorkoutScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Workout</Text>
      <Text>Track workouts and synchronize activity providers.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});
