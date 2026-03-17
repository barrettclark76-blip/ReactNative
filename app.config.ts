import 'dotenv/config';
import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'FitApp',
  slug: 'fitapp',
  version: '1.0.0',
  ios: {
    bundleIdentifier: 'com.example.fitapp',
    supportsTablet: true,
  },
  android: {
    package: 'com.example.fitapp',
  },
  plugins: ['expo-image-picker'],
  extra: {
    WHOOP_API_KEY: process.env.WHOOP_API_KEY,
    STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
    STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
    CRONOMETER_API_KEY: process.env.CRONOMETER_API_KEY,
  },
};

export default config;
