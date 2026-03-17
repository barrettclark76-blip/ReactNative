import React from 'react';
import { QueryProvider } from './src/providers/QueryProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { MetricsProvider } from './src/providers/MetricsProvider';

export default function App() {
  return (
    <QueryProvider>
      <MetricsProvider>
        <RootNavigator />
      </MetricsProvider>
    </QueryProvider>
  );
}
