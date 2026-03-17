import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { WorkoutScreen } from '../screens/WorkoutScreen';
import { DietScreen } from '../screens/DietScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { DayDetailScreen } from '../screens/DayDetailScreen';
import { MainTabParamList, RootStackParamList } from './types';
import { WaterScreen } from '../screens/WaterScreen';
import { BibleReadingScreen } from '../screens/BibleReadingScreen';
import { SleepScreen } from '../screens/SleepScreen';
import { PhotoViewerScreen } from '../screens/PhotoViewerScreen';
import { BiometricsScreen } from '../screens/BiometricsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Dashboard" component={DashboardScreen} />
      <Tabs.Screen name="Diet" component={DietScreen} />
      <Tabs.Screen name="Workout" component={WorkoutScreen} />
      <Tabs.Screen name="Water" component={WaterScreen} />
      <Tabs.Screen name="Bible" component={BibleReadingScreen} />
      <Tabs.Screen name="Sleep" component={SleepScreen} />
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
        <Stack.Screen name="DayDetail" component={DayDetailScreen} options={{ title: 'Day Detail' }} />
        <Stack.Screen
          name="PhotoViewer"
          component={PhotoViewerScreen}
          options={{ title: 'Photo Viewer', presentation: 'fullScreenModal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
