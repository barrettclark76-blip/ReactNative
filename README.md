# FitApp (React Native + TypeScript)

This repository now contains a React Native project scaffolded for a health tracking app using Expo (TypeScript).

## Included setup

- React Navigation (native stack + bottom tabs)
- React Query with local persistence via AsyncStorage
- Forms with react-hook-form + zod
- Date handling via dayjs
- Media upload via expo-image-picker
- App shell screens:
  - Dashboard
  - Workout
  - Diet
  - Biometrics
  - Calendar
  - Day Detail

## Environment variables

1. Copy `.env.example` to `.env`.
2. Fill in secrets:
   - `WHOOP_API_KEY`
   - `STRAVA_CLIENT_ID`
   - `STRAVA_CLIENT_SECRET`
   - `CRONOMETER_API_KEY`

These values are injected into Expo config (`app.config.ts`) and available in `src/config/env.ts`.

## iOS target

`app.config.ts` and `app.json` define iOS metadata with bundle ID `com.example.fitapp`. To generate native iOS project files, run:

```bash
npx expo prebuild --platform ios
```

## Run locally

```bash
npm install
npm run start
npm run ios
```
