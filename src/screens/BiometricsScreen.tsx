import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';

export function BiometricsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Biometrics</Text>
      <Text>Monitor body metrics and trends over time.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});
