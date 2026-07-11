# Cali AI — Claude Code Instructions

## Project Overview

AI-powered calisthenics form feedback app. Users record themselves doing exercises during a set; post-set, Claude analyzes the video and returns a form score + coaching feedback.

Mobile-only for v1. Core exercises: push-up, pull-up, dip, squat.

## Monorepo Structure

```
apps/api          Express 5 REST API (TypeScript)
apps/native       React Native + Expo SDK 54 (Expo Router)
apps/web          Next.js placeholder — out of scope for v1
packages/database Prisma 7 schema + generated client (@repo/db)
packages/common   Zod schemas shared across apps (@repo/common)
packages/ui       React Native component library (@repo/ui)
```

Package manager: Yarn Classic 1.22.19. Task runner: Turborepo.

## API Conventions

**Three-tier architecture:** route → controller → service → Prisma. No business logic in controllers; no direct Prisma calls outside services.

**Always wrap async route handlers** with `asyncWrapper` from `apps/api/src/utils/asyncWrapper.ts`. Never use try/catch in controllers.

**Zod validation at boundaries.** Validate all request bodies in middleware before they reach controllers. Schemas live in `packages/common/src/validations/`.

**Response shapes are shared, not duplicated.** Server response shapes used by `apps/native` (e.g. `WorkoutWithExercises`, `ExerciseSummary`) and by `apps/api/src/openapi/schemas.ts` are defined once in `packages/common/src/validations/` and imported by both — never hand-rolled a second time in `apps/native/src/types/` or the OpenAPI registry. `@repo/common` schemas stay framework-agnostic (no `.openapi()` calls) since `apps/native` also consumes them; add OpenAPI-only presentation metadata at the registration site in `apps/api/src/openapi/schemas.ts` instead. `apps/native/src/types/` is for local-only UI/form-state shapes that never cross the API boundary.

**HTTP error hierarchy** is in `apps/api/src/errors/`. Throw typed errors (e.g. `NotFoundError`, `UnauthorizedError`) — the error handler catches them.

**Prisma client** is a singleton exported from `packages/database/src/index.ts`. Never instantiate a new PrismaClient elsewhere.

**Environment variables** are validated at startup via Zod in `apps/api/src/config/env.ts`. Add new vars there with a schema entry — never read `process.env` directly elsewhere in the API.

**Logging** goes through the structured `pino` logger (`apps/api/src/lib/logger.ts`) — never `console.log`/`console.error` in `apps/api/src`. 5xx errors are always logged regardless of `NODE_ENV`. `pino-http` replaces `morgan` in production; dev keeps `morgan("dev")`.

## Linting & Type Checking

ESLint 9 flat config (typescript-eslint, type-checked rules) at the repo root in `eslint.config.mjs`, extended by each workspace's own `eslint.config.mjs`. `apps/native` additionally applies `eslint-plugin-react-hooks`. Run `yarn lint` / `yarn check-types` from the root (Turborepo tasks) or per-workspace. `apps/api/tests/**` relaxes the `no-unsafe-*` rules since `supertest`'s `Response#body` is typed `any` by design.

## Phase 1 Scope (Infrastructure)

What Phase 1 is building:
- **Async video upload**: `POST /api/sessions/:id/recording` returns 202 + job ID immediately
- **BullMQ job queue** (Redis-backed): worker processes video analysis off the request thread
- **SSE endpoint**: `GET /api/sessions/:id/status` streams job progress events to the client
- **State machine**: `WorkoutSession.processingStatus` transitions PENDING → PROCESSING → COMPLETED | FAILED; stuck PROCESSING jobs auto-fail after 10 minutes
- **Custom Expo dev build**: `react-native-vision-camera` + `react-native-fast-tflite` configured in `apps/native`

## Database

PostgreSQL via Prisma 7. Two instances run locally via Docker:
- `:5434` — development
- `:5433` — test

Schema: `packages/database/prisma/schema.prisma`. After schema changes run `yarn workspace @repo/db db:generate` to regenerate the client.

## Testing

Vitest + Supertest for API integration tests. Tests live in `apps/api/tests/integration/`. Each suite wipes relevant tables before running. Never mock the database in integration tests.

Zero unit tests currently exist — don't add them unless a phase plan explicitly calls for it.

## Native App

Expo Router file-based routing. Auth screens in `app/(auth)/`, main tabs in `app/(main)/(tabs)/`. Theme tokens in `src/theme/`. Currently a managed workflow build; Phase 1 requires switching to a custom dev build for native camera + ML modules.
