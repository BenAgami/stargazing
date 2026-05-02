---
phase: 03-manual-workout-builder
plan: 01
subsystem: database
tags: [prisma, zod, postgresql, typescript, workout, schema]

# Dependency graph
requires:
  - phase: 02-user-profile
    provides: User model and WorkoutSession model that Workout/WorkoutLog relations reference
provides:
  - Workout, WorkoutExercise, WorkoutLog Prisma models with correct indexes and cascade rules
  - workoutExercises back-relation on Exercise model
  - workouts and workoutLogs back-relations on User model
  - Generated Prisma client with prisma.workout, prisma.workoutExercise, prisma.workoutLog accessors
  - createWorkoutSchema, updateWorkoutSchema, workoutLogSchema Zod schemas exported from @repo/common
  - CreateWorkoutValues, UpdateWorkoutValues, WorkoutLogValues, WorkoutExerciseInput TypeScript types
affects: [03-02, 03-03, 03-04, 03-05, 03-06, 03-07, 03-08]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Modular Prisma schema: new models added as separate .prisma files in packages/database/prisma/models/"
    - "Zod 4 z.iso.datetime() for datetime fields (not z.string().datetime())"
    - "workoutExerciseInputSchema does not include id — API regenerates positions on each update via delete+createMany"

key-files:
  created:
    - packages/database/prisma/models/workout.prisma
    - packages/common/src/validations/workout.ts
  modified:
    - packages/database/prisma/models/exercise.prisma
    - packages/database/prisma/models/user.prisma
    - packages/common/src/index.ts

key-decisions:
  - "db:push (not db:migrate:dev) used to apply schema to dev database — matches existing prisma.config.ts approach"
  - "No WorkoutLogStatus enum added — WorkoutLog has no status field in Phase 3 (D-16 reserves analysis fields for Phase 5)"
  - "workoutExerciseInputSchema excludes position field — position is derived from array index server-side, not sent by client"

patterns-established:
  - "Pattern 1: WorkoutExercise position managed server-side via array index (0-based) in delete+createMany transaction"
  - "Pattern 2: All back-relations on User model placed after existing relations (bodyMetrics, goals, workoutSessions, userMilestones)"

requirements-completed: [WKT-01, WKT-02, WKT-03, WKT-04]

# Metrics
duration: 5min
completed: 2026-05-02
---

# Phase 3 Plan 01: Data Foundation Summary

**Prisma models for Workout, WorkoutExercise, WorkoutLog with cascade rules, composite indexes, and Zod 4 schemas exported from @repo/common**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-02T14:59:15Z
- **Completed:** 2026-05-02T15:04:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Three new Prisma models (Workout, WorkoutExercise, WorkoutLog) with correct relations, @map directives, and composite indexes
- Back-relations added to Exercise (workoutExercises) and User (workouts, workoutLogs) models
- Prisma client regenerated successfully; dev database synced via `db:push`
- Three Zod schemas (createWorkoutSchema, updateWorkoutSchema, workoutLogSchema) and four TypeScript types exported from @repo/common
- API workspace (apps/api) compiles cleanly against the new types

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Workout, WorkoutExercise, WorkoutLog Prisma models + back-relations** - `7ae8e4c` (feat)
2. **Task 2: Add Zod schemas for workout CRUD + log creation in @repo/common** - `0cc25aa` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `packages/database/prisma/models/workout.prisma` - Three new Prisma models: Workout, WorkoutExercise, WorkoutLog
- `packages/database/prisma/models/exercise.prisma` - Added workoutExercises WorkoutExercise[] back-relation
- `packages/database/prisma/models/user.prisma` - Added workouts Workout[] and workoutLogs WorkoutLog[] back-relations
- `packages/common/src/validations/workout.ts` - Zod schemas: createWorkoutSchema, updateWorkoutSchema, workoutLogSchema + inferred types
- `packages/common/src/index.ts` - Added barrel re-export for ./validations/workout

## Decisions Made

- Used `yarn workspace @repo/db prisma db push` because there is no `db:push` script in packages/database/package.json; the prisma config at `prisma.config.ts` correctly points to the `prisma/` directory containing all modular schema files.
- No new enums introduced — WorkoutLog intentionally has no status field (D-16 defers analysis fields to Phase 5).
- `workoutExerciseInputSchema` does not include `position` field — the API assigns positions based on array index (0-based), so the client never sends position values explicitly.

## Deviations from Plan

None - plan executed exactly as written. The `db:push` script absence was anticipated in the plan instructions and handled per the fallback instructions.

## Issues Encountered

- The `packages/database/package.json` has no `db:push` script (only `db:generate` and `db:migrate:dev`). The plan anticipated this and provided a fallback: `yarn workspace @repo/db prisma db push`. This ran successfully against the dev database.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Prisma client ready: downstream plans can `import { prisma } from "@repo/db"` and use `prisma.workout`, `prisma.workoutExercise`, `prisma.workoutLog`
- Zod schemas ready: API routes can `import { createWorkoutSchema, CreateWorkoutValues } from "@repo/common"`
- Dev database has workouts, workout_exercises, workout_logs tables with correct columns and indexes
- All four Phase 3 requirements (WKT-01 through WKT-04) have their data foundation in place

---
*Phase: 03-manual-workout-builder*
*Completed: 2026-05-02*
