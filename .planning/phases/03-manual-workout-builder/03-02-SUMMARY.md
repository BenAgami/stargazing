---
phase: 03-manual-workout-builder
plan: 02
subsystem: testing
tags: [vitest, supertest, integration-tests, prisma, postgresql, tdd, workout]

# Dependency graph
requires:
  - phase: 03-manual-workout-builder
    plan: 01
    provides: Workout, WorkoutExercise, WorkoutLog Prisma models and Zod schemas from plan 01
  - phase: 02-user-profile
    provides: User model and auth patterns that test helpers depend on
provides:
  - Six RED integration test suites covering all six workout API endpoints
  - WorkoutBuilder and WorkoutDto in tests/integration/builders/workoutBuilder.ts
  - createWorkoutFixture db helper in tests/integration/helpers/db/workoutHelper.ts
  - Six typed supertest senders in tests/integration/helpers/requestSender/workoutsRequests.ts
  - Extended cleanupDatabase with FK-safe workout table deletion order
  - Migration file 20260502000000_add_workout_tables applied to test database
affects: [03-03, 03-04, 03-05, 03-06, 03-07, 03-08]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Migration created manually (not via migrate dev) when db:push was used on dev — create SQL manually then apply via migrate deploy to test DB"
    - "WorkoutBuilder follows the same fluent builder pattern as WorkoutSessionBuilder and ExerciseBuilder"
    - "createWorkoutFixture mirrors exerciseHelper.ts — prisma.workout.create with nested exercises create"

key-files:
  created:
    - apps/api/tests/integration/builders/workoutBuilder.ts
    - apps/api/tests/integration/helpers/db/workoutHelper.ts
    - apps/api/tests/integration/helpers/requestSender/workoutsRequests.ts
    - apps/api/tests/integration/workouts/createWorkout.test.ts
    - apps/api/tests/integration/workouts/listWorkouts.test.ts
    - apps/api/tests/integration/workouts/getWorkout.test.ts
    - apps/api/tests/integration/workouts/updateWorkout.test.ts
    - apps/api/tests/integration/workouts/deleteWorkout.test.ts
    - apps/api/tests/integration/workouts/startWorkout.test.ts
    - packages/database/prisma/migrations/20260502000000_add_workout_tables/migration.sql
  modified:
    - apps/api/tests/integration/helpers/testSetup.ts

key-decisions:
  - "Migration 20260502000000_add_workout_tables created manually because dev DB was synced via db:push (no migration history); test DB requires migrate deploy to pick up new tables"
  - "workoutsRequests.ts uses object|string type (not unknown) for send() data parameter — supertest's .send() overload requires object or string, not unknown"
  - "@repo/db dist must be rebuilt after prisma generate — TypeScript compiler reads from dist/index.d.ts, not the generated/ directory directly"

patterns-established:
  - "Pattern 1: When using db:push on dev for schema exploration, always create a corresponding migration file manually before writing integration tests that use migrate deploy"
  - "Pattern 2: cleanupDatabase ordering — workoutLog before workoutExercise before workout — mirrors FK dependency graph (logs reference workouts, exercises reference workouts)"

requirements-completed: [WKT-01, WKT-02, WKT-03, WKT-04]

# Metrics
duration: 20min
completed: 2026-05-02
---

# Phase 3 Plan 02: RED Test Infrastructure Summary

**33 failing integration tests across 6 workout API test files establishing TDD RED state, with WorkoutBuilder, workoutHelper, typed supertest senders, and a migration applied to the test database**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-05-02T15:05:53Z
- **Completed:** 2026-05-02T15:26:00Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Four test scaffolding files created: WorkoutBuilder, createWorkoutFixture, six typed request senders, testSetup.ts extended with workout cleanup
- Six integration test files written across all workout API endpoints with 33 total `it()` blocks
- Migration file created and applied to test database — workout_logs, workout_exercises, workouts tables now exist in test DB
- All 33 tests execute (no import/compile errors) and fail RED with 404 from missing routes — correct TDD state confirmed
- TypeScript compiles cleanly across all new files after rebuilding @repo/db dist

## Test `it()` Counts by File

| File | Count |
|------|-------|
| createWorkout.test.ts | 8 |
| listWorkouts.test.ts | 5 |
| getWorkout.test.ts | 4 |
| updateWorkout.test.ts | 6 |
| deleteWorkout.test.ts | 4 |
| startWorkout.test.ts | 6 |
| **Total** | **33** |

## Task Commits

Each task was committed atomically:

1. **Task 1: Create test scaffolding** - `d795dd9` (chore)
2. **Task 2: Write 6 RED integration test files** - `fcda8c8` (test)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `apps/api/tests/integration/builders/workoutBuilder.ts` - WorkoutBuilder fluent builder with WorkoutDto type
- `apps/api/tests/integration/helpers/db/workoutHelper.ts` - createWorkoutFixture for seeding workout rows with nested exercises
- `apps/api/tests/integration/helpers/requestSender/workoutsRequests.ts` - Six typed supertest senders: createWorkout, listWorkouts, getWorkout, updateWorkout, deleteWorkout, startWorkout
- `apps/api/tests/integration/helpers/testSetup.ts` - Extended cleanupDatabase with workoutLog, workoutExercise, workout deleteMany in FK-safe order
- `apps/api/tests/integration/workouts/createWorkout.test.ts` - 8 tests for POST /api/workouts
- `apps/api/tests/integration/workouts/listWorkouts.test.ts` - 5 tests for GET /api/workouts
- `apps/api/tests/integration/workouts/getWorkout.test.ts` - 4 tests for GET /api/workouts/:id
- `apps/api/tests/integration/workouts/updateWorkout.test.ts` - 6 tests for PATCH /api/workouts/:id
- `apps/api/tests/integration/workouts/deleteWorkout.test.ts` - 4 tests for DELETE /api/workouts/:id
- `apps/api/tests/integration/workouts/startWorkout.test.ts` - 6 tests for POST /api/workouts/:id/logs
- `packages/database/prisma/migrations/20260502000000_add_workout_tables/migration.sql` - Manual migration to apply workout tables to test DB via migrate deploy

## Decisions Made

- **Manual migration required:** The dev database was synced via `prisma db push` in plan 01 (no migration files created). The test database setup uses `prisma migrate deploy` at startup, which requires migration files. Had to manually write the SQL for the three workout tables and apply it to the test DB.
- **@repo/db rebuild required:** After `prisma generate`, the TypeScript compiler still reported `Property 'workout' does not exist` because the compiler reads from `dist/index.d.ts` (the built output), not the `generated/` directory directly. Running `yarn workspace @repo/db build` regenerated `dist/index.d.ts` with the new models.
- **object|string type on send():** Using `unknown` caused a TypeScript error (`Argument of type 'unknown' is not assignable to parameter of type 'string | object | undefined'`). Changed to `object | string` matching supertest's actual overload signature.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created migration file for test database**
- **Found during:** Task 2 verification run
- **Issue:** Test runner used `prisma migrate deploy` at startup; test database lacked workout tables because plan 01 used `db:push` (no migration files generated). `teardownIntegrationTest` and `createWorkoutFixture` both threw `The table 'public.workout_logs' does not exist`.
- **Fix:** Manually authored `packages/database/prisma/migrations/20260502000000_add_workout_tables/migration.sql` with correct DDL for workouts, workout_exercises, workout_logs tables, indexes, and foreign keys. Applied via `DATABASE_URL=... yarn workspace @repo/db db:migrate:deploy`.
- **Files modified:** `packages/database/prisma/migrations/20260502000000_add_workout_tables/migration.sql`
- **Verification:** `migrate deploy` output confirmed "Applying migration 20260502000000_add_workout_tables... All migrations applied."
- **Committed in:** `fcda8c8` (Task 2 commit)

**2. [Rule 3 - Blocking] Rebuilt @repo/db dist after prisma generate**
- **Found during:** Task 1 build verification
- **Issue:** After `prisma generate`, TypeScript still reported `Property 'workout' does not exist on type 'PrismaClient'` because `apps/api` imports from `@repo/db` which resolves to `packages/database/dist/index.d.ts` (a built file), not the `generated/` output directly.
- **Fix:** Ran `yarn workspace @repo/db build` to regenerate `dist/index.d.ts` with new model types.
- **Files modified:** `packages/database/dist/` (generated, not committed)
- **Verification:** `yarn workspace api build` exited 0 after rebuild.
- **Committed in:** `d795dd9` (Task 1 commit — rebuild triggered as part of fix)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both auto-fixes were necessary for correct test execution. The migration gap is a direct consequence of plan 01's `db:push` approach and was an expected risk documented in the plan. No scope creep.

## Issues Encountered

- `prisma migrate dev --create-only` was blocked by drift detection (dev DB had tables from `db:push` but migration history didn't know about them). Used manual SQL migration file as the correct workaround.
- Vitest uses positional file pattern argument (`vitest workouts`) not `--testPathPattern` flag (Jest syntax) — plan's verify command needed adjustment.

## User Setup Required

None — the migration was applied automatically by the test runner on next run.

## Self-Check: PASSED

All 11 created/modified files confirmed present on disk. Both task commits (d795dd9, fcda8c8) confirmed in git log.

## Next Phase Readiness

- All 33 tests are RED and executable — `yarn workspace api test workouts` confirms RED state
- Plan 03-03 can import test helpers directly: `WorkoutBuilder`, `createWorkoutFixture`, and all six request senders
- Test database has all required tables; cleanup ordering is correct
- The `verify` command for plan 03-03 is: `yarn workspace api test workouts` — turn these 33 tests GREEN

---
*Phase: 03-manual-workout-builder*
*Completed: 2026-05-02*
