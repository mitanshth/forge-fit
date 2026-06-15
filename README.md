# ForgeFit — Hunter System

A **Solo Levelling** anime-themed full-stack fitness tracker. Rise through hunter ranks (E → SSS) by logging workouts, tracking nutrition, and receiving AI coaching from the *Shadow Monarch's Voice*.

---

## Features

### System Awakening (Auth)
- Replit Auth login gate styled as a dungeon awakening screen

### Command Center (Dashboard)
- Weekly quest progress bar and streak counter
- Discipline score and total gate clears
- Hunter rank display (E → D → C → B → A → S → SS → SSS)
- **Daily Quests** — 3 auto-generated quests per day, reset at midnight
  - Auto-completed by actions across the app (logging workouts, meals, weight, messages)
  - Manual quests (hydration, sleep, stretch) with a DONE button
  - XP reward summary per quest

### Gates (Workout Logging)
- Log Gym, Cardio, Home, or Custom gate clears
- Add individual exercises per session
- XP earned per workout (+100 base, +10 per exercise, +25 per streak day)
- Full workout history with delete support
- Rank-up system notification popup on promotion

### Shadow Training (Home Workouts)
- 3 hardcoded bodyweight templates (Push, Pull, Legs)
- Timer-based session tracking

### Hunter's Rations (Nutrition)
- Daily calorie tracker
- Meal logging stored locally
- Quest integration — logging a meal auto-completes the daily ration quest

### Hunter Ascension (Progress)
- Weight history line chart (PostgreSQL-backed)
- Inline weight logging form on the progress page
- Rank progression bar across all 8 tiers
- 12 unlockable Shadow Titles (achievements) based on milestones

### Shadow Monarch's Voice (AI Coach)
- GPT-4o-mini powered coaching with streaming responses (SSE)
- Full conversation history per session
- Personalized to your hunter profile (height, weight, goals, training style)

### Hunter Profile
- Biometric setup (height, weight, age, gender)
- Training preference selection
- Synced to PostgreSQL

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS + shadcn/ui |
| Routing | wouter |
| Charts | Recharts |
| Animation | Framer Motion |
| API | Express 5 |
| Database | PostgreSQL + Drizzle ORM |
| Auth | Replit Auth (OIDC) |
| AI | OpenAI GPT-4o-mini (SSE streaming) |
| Validation | Zod v4 + drizzle-zod |
| API Contract | OpenAPI spec → Orval codegen |
| Build | esbuild (API) + Vite (frontend) |
| Package Manager | pnpm workspaces (monorepo) |

---

## Rank System

| Rank | Min Workouts | Title |
|---|---|---|
| E-Rank | 0 | Weakling |
| D-Rank | 5 | Novice Hunter |
| C-Rank | 15 | Seasoned Hunter |
| B-Rank | 30 | Elite Hunter |
| A-Rank | 50 | Master Hunter |
| S-Rank | 75 | Shadow Sovereign |
| SS-Rank | 100 | Monarch's Chosen |
| SSS-Rank | 150 | Shadow Monarch |

---

## Project Structure

```
forge-fit/
├── artifacts/
│   ├── forgefit/          # React + Vite frontend
│   │   └── src/
│   │       ├── pages/     # dashboard, workout, progress, coach, nutrition...
│   │       ├── components/# DailyQuests, SystemNotification, layout
│   │       └── lib/       # rank.ts, quests.ts
│   └── api-server/        # Express 5 API
│       └── src/
│           └── routes/    # profile, logs, weight-logs, dashboard, openai/
├── lib/
│   ├── db/                # Drizzle ORM schema + migrations
│   ├── api-spec/          # OpenAPI spec + Orval codegen config
│   ├── api-client-react/  # Generated React Query hooks
│   └── api-zod/           # Generated Zod validators
└── pnpm-workspace.yaml
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm
- PostgreSQL database
- OpenAI API key

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
OPENAI_API_KEY=sk-...
SESSION_SECRET=your-secret-here
```

### Install & Run

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm --filter @workspace/db run push

# Start API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Start frontend (separate terminal)
pnpm --filter @workspace/forgefit run dev
```

### Regenerate API types (after editing OpenAPI spec)

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Daily Quest System

Quests are deterministically generated each day based on the date — the same 3 quests appear all day and rotate at midnight. Completion is tracked in `localStorage`.

**Auto-completed triggers:**
- `workout_logged` — any gate clear
- `gym_logged` / `cardio_logged` / `home_logged` — specific gate types
- `five_exercises` — logging 5+ exercises in one session
- `weight_logged` — logging weight on the Ascension page
- `message_sent` — sending a message to the AI coach
- `meal_logged` — logging a meal in Hunter's Rations

---

## License

MIT
