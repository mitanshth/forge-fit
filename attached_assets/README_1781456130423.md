# ForgeFit AI Coach

A local browser app for workout discipline, adaptive training plans, progress tracking, daily motivation, nutrition targets, and recipe suggestions.

## Run

```powershell
node server.js
```

Then open:

```text
http://127.0.0.1:4173
```

## Install On Mobile

For installation on a phone, host this folder with HTTPS using GitHub Pages, Netlify, Vercel, or any static host. Open that hosted link on your phone, then:

- Android Chrome: tap the menu and choose Add to Home screen or Install app.
- iPhone Safari: tap Share, then Add to Home Screen.

The app includes a PWA manifest, app icon, standalone display mode, and offline caching through `service-worker.js`.

## What It Does

- Shows a first-visit setup flow for name, login email, profile photo, age, height, weight, multiple goals, experience, multiple equipment options, activity level, diet, food culture, injuries, and foods to avoid.
- Builds a personalized weekly workout plan from your goals, experience, schedule, session length, and selected equipment.
- Adjusts exercise choices for listed injuries or movement limits.
- Tracks workout streaks, weekly workouts, discipline score, protein consistency, sleep, water, soreness, steps, and weight trend.
- Suggests daily protein, calories, carbs, fats, nutrition rules, and culture-wise recipes from your dietary preference and avoided foods.
- Builds a 7-day culture-wise meal plan with easy dishes and per-meal protein targets.
- Shows exercise-specific posture reference photos from Free Exercise DB, including two-view posture cards for bodyweight and resistance-band movements.
- Adds real food photos to recipe cards and daily meal plan items.
- Saves your profile and progress in browser local storage, mirrors it into an IndexedDB data vault, and supports JSON backup/restore from Settings.
- Supports browser notifications after you enable them in the app.
- Uses a mobile-first layout with bottom navigation on phones.
- Can be installed as a Progressive Web App when served from localhost or HTTPS.
- Uses a dark hunter-system theme with quest-style workout motivation and notification copy.

This version runs fully locally and does not require an API key.
