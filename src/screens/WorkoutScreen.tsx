import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { IntegrationCard } from '../components/integrations/IntegrationCard';
import { useStravaIntegration } from '../integrations/strava/useStravaIntegration';

export function WorkoutScreen() {
  const { status, connectProvider, disconnectProvider, syncNow, records } = useStravaIntegration();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Workout</Text>
      <IntegrationCard
        title="Strava"
        subtitle="Import completed workouts."
        status={status}
        onConnect={connectProvider}
        onDisconnect={disconnectProvider}
        onSync={syncNow}
      />
      <Text style={styles.helper}>Conflict rule: manual edits override imported workout data.</Text>
      <Text style={styles.helper}>Imported workouts: {records.length}</Text>
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
