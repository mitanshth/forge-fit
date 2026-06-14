# ForgeFit Hunter System

A Solo Levelling anime-themed full-stack fitness tracker where users rise through hunter ranks (E→SSS) by logging workouts, tracking nutrition, and receiving AI coaching from the "Shadow Monarch's Voice."

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/forgefit run dev` — run the React frontend (port auto-assigned)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL`, `OPENAI_API_KEY`, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind + shadcn/ui + wouter + Recharts + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: Replit Auth (OIDC)
- AI: OpenAI GPT-4o-mini (direct, with SSE streaming)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- DB schema: `lib/db/src/schema/forgefit.ts` (userProfiles, workoutLogs, weightLogs, conversations, messages)
- API contract: `lib/api-spec/openapi.yaml`
- Generated hooks: `lib/api-client-react/src/generated/api.ts`
- Generated Zod schemas: `lib/api-zod/src/generated/api.ts`
- API routes: `artifacts/api-server/src/routes/` (profile, logs, weight-logs, dashboard, openai/)
- Frontend pages: `artifacts/forgefit/src/pages/`
- Theme/CSS: `artifacts/forgefit/src/index.css`

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed hooks + Zod validators; never hand-write fetch calls on frontend
- SSE streaming for AI chat: raw `fetch` with `ReadableStream` instead of the generated mutation hook, since Orval doesn't model streaming responses
- Nutrition data is localStorage-only (no backend table needed for MVP)
- OpenAI client initialized directly with `OPENAI_API_KEY` (user's own key), not via Replit AI integration proxy
- Solo Levelling rank system: E(0-4) → D(5-14) → C(15-29) → B(30-49) → A(50-74) → S(75-99) → SS(100-149) → SSS(150+) based on total completed workouts

## Product

- **Login** — System Awakening gate screen (Replit Auth)
- **Dashboard / Command Center** — weekly quest progress, streak, discipline score, total clears, rank display
- **Gates (Workout)** — log gym/cardio/home/custom workouts with exercises, view history
- **Shadow Training (Home Workout)** — 3 hardcoded bodyweight templates with timer-based sessions
- **Hunter's Rations (Nutrition)** — macro targets + meal logging (localStorage)
- **Hunter Ascension (Progress)** — weight history chart, rank progression bar, discipline chart
- **Shadow Monarch's Voice (Coach)** — SSE-streaming AI coach with conversation history, personalized to user profile
- **Hunter Profile** — biometric and training preference setup

## User preferences

_Populate as you build._

## Gotchas

- After editing OpenAPI spec, always run `pnpm --filter @workspace/api-spec run codegen` before working on routes or frontend hooks
- `pnpm --filter @workspace/db run push` must be run after schema changes (dev only; production needs manual migration)
- `console.log` is banned in server code — use `req.log` in route handlers and `logger` singleton elsewhere
- SSE route (`POST /api/openai/conversations/:id/messages`) streams directly; do not use the generated `useSendOpenaiMessage` hook for the chat UI
- `import.meta.env.BASE_URL` gives the app's base path; always strip trailing slash when using it with wouter

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
