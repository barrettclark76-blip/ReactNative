import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { WorkoutScreen } from '../screens/WorkoutScreen';
import { DietScreen } from '../screens/DietScreen';
import { BiometricsScreen } from '../screens/BiometricsScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { DayDetailScreen } from '../screens/DayDetailScreen';
import { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Dashboard" component={DashboardScreen} />
      <Tabs.Screen name="Workout" component={WorkoutScreen} />
      <Tabs.Screen name="Diet" component={DietScreen} />
      <Tabs.Screen name="Biometrics" component={BiometricsScreen} />
      <Tabs.Screen name="Calendar" component={CalendarScreen} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="DayDetail"
          component={DayDetailScreen}
          options={{ title: 'Day Detail' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
