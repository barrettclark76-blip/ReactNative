import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { IntegrationStatus } from '../../integrations/types';

type Props = {
  title: string;
  subtitle: string;
  status: IntegrationStatus;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onSync: () => Promise<void>;
};

const formatDate = (value: string | null) => {
  if (!value) {
    return 'Never';
  }
  return new Date(value).toLocaleString();
};

export function IntegrationCard({
  title,
  subtitle,
  status,
  onConnect,
  onDisconnect,
  onSync,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.meta}>Last synced: {formatDate(status.lastSyncedAt)}</Text>
      {status.error ? <Text style={styles.error}>{status.error.message}</Text> : null}
      <View style={styles.actions}>
        {!status.connected ? (
          <Pressable style={styles.primaryButton} onPress={() => void onConnect()}>
            <Text style={styles.primaryText}>Connect</Text>
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.primaryButton} onPress={() => void onSync()}>
              <Text style={styles.primaryText}>Manual Resync</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => void onDisconnect()}>
              <Text style={styles.secondaryText}>Disconnect</Text>
            </Pressable>
          </>
        )}
      </View>
      {status.syncing ? <ActivityIndicator size="small" color="#1d4ed8" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
  },
  subtitle: {
    color: '#374151',
  },
  meta: {
    color: '#6b7280',
    fontSize: 12,
  },
  error: {
    color: '#b91c1c',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryText: {
    color: '#111827',
    fontWeight: '600',
  },
});
