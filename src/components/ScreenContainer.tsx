import React, { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export function ScreenContainer({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
