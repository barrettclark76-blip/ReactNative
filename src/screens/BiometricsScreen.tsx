import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { IntegrationCard } from '../components/integrations/IntegrationCard';
import { useWhoopIntegration } from '../integrations/whoop/useWhoopIntegration';

export function BiometricsScreen() {
  const { status, connectProvider, disconnectProvider, syncNow, records } = useWhoopIntegration();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Biometrics</Text>
      <IntegrationCard
        title="Whoop"
        subtitle="Import sleep recovery and calorie expenditure."
        status={status}
        onConnect={connectProvider}
        onDisconnect={disconnectProvider}
        onSync={syncNow}
      />
      <Text style={styles.helper}>Conflict rule: manual edits override imported sleep data.</Text>
      <Text style={styles.helper}>Imported sleep entries: {records.length}</Text>
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
