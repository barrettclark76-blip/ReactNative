import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';

export function DietScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Diet</Text>
      <Text>Manage meals, calories, and nutrition goals.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});
