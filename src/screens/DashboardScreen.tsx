import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';

export function DashboardScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Your health summary and quick insights will appear here.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});
