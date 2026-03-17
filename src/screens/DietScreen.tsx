import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { IntegrationCard } from '../components/integrations/IntegrationCard';
import { useCronometerIntegration } from '../integrations/cronometer/useCronometerIntegration';

export function DietScreen() {
  const { status, connectProvider, disconnectProvider, syncNow, records } = useCronometerIntegration();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Diet</Text>
      <IntegrationCard
        title="Cronometer"
        subtitle="Import calories and macro totals."
        status={status}
        onConnect={connectProvider}
        onDisconnect={disconnectProvider}
        onSync={syncNow}
      />
      <Text style={styles.helper}>Conflict rule: manual edits override imported nutrition data.</Text>
      <Text style={styles.helper}>Imported nutrition entries: {records.length}</Text>
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
});
