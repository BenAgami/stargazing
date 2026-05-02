---
phase: 03-manual-workout-builder
plan: "03"
subsystem: api
tags: [express, prisma, workout, rest-api, integration-tests, zod, typescript]

requires:
  - phase: 03-02
    provides: Six RED integration test suites covering all workout CRUD + log endpoints
  - phase: 03-01
    provides: Workout schema migration, @repo/common Zod schemas, WorkoutExerciseInput types

provides:
  - WorkoutService with list, get, create, update (atomic), delete, startWorkoutLog methods
  - Thin workout controller with six asyncHandler-wrapped HTTP handlers
  - Authenticated Express router registered at /api/workouts with per-route Zod validation
  - All 33 RED tests from plan 02 turned GREEN

affects:
  - 03-04 (native WorkoutBuilder screen — calls these endpoints)
  - 03-05 (AI workout generation — extends these same routes/service)

tech-stack:
  added: []
  patterns:
    - WorkoutService mirrors workoutSessionService.ts class shape (private get prisma, getUserIdByUuid, constructor-less export default new)
    - Atomic exercise replacement via prisma.$transaction (deleteMany + createMany) with position assigned from array index
    - Cross-user ownership scoped at Prisma query layer (where: { id, userId }) returning NotFoundError never ForbiddenError
    - Static Hold / Dynamic cross-field validation (reps XOR durationSecs) at service level since Zod cannot enforce cross-field constraints

key-files:
  created:
    - apps/api/src/services/workoutService.ts
    - apps/api/src/controllers/workout.ts
    - apps/api/src/routes/workout.ts
  modified:
    - apps/api/src/routes/index.ts

key-decisions:
  - "Cross-user access returns 404 (NotFoundError) never 403 — enforced by Prisma where: { id, userId } query rather than a separate ownership check + conditional throw"
  - "validateExerciseInput at service level rejects both-reps-and-duration and neither-set inputs because Zod cannot enforce cross-field constraints in workoutExerciseInputSchema"
  - "requireUserUuid extracted to shared helper in controller typed against WorkoutIdParam so all six handlers avoid repeated UUID extraction boilerplate"

patterns-established:
  - "Pattern 1: workoutInclude constant shared across get/create/update ensures response shape consistency without duplication"
  - "Pattern 2: assertExercisesExist deduplicates IDs before findMany then compares result count — single DB round-trip for batch validation"

requirements-completed: [WKT-01, WKT-02, WKT-03, WKT-04]

duration: 6min
completed: "2026-05-02"
---

# Phase 03 Plan 03: Workout API Implementation Summary

**Express REST API for workouts: WorkoutService (6 methods, Prisma-backed), thin asyncHandler controller, authenticated router at /api/workouts — turns 33 RED integration tests GREEN**

## Performance

- **Duration:** 6 min
- **Started:** 2026-05-02T15:19:34Z
- **Completed:** 2026-05-02T15:25:44Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- WorkoutService owns all Prisma calls for workouts with user-scoping on every ownership check via `where: { id, userId }`
- Atomic exercise replacement in PATCH via `prisma.$transaction` (deleteMany + createMany) with positions assigned from array index 0..N-1
- All 33 workout integration tests GREEN; full suite 87/87 passes with zero regressions

## Task Commits

1. **Task 1: WorkoutService (all six methods)** — `2a86bf9` (feat)
2. **Task 2: Workout controller (six asyncHandler handlers)** — `45ce348` (feat)
3. **Task 3: Workout router + index.ts registration** — `a826586` (feat)

## Files Created/Modified

- `apps/api/src/services/workoutService.ts` — Business logic: list, get, create, update (atomic), delete, startWorkoutLog; enforces user-scoping and Static Hold/Dynamic exclusivity
- `apps/api/src/controllers/workout.ts` — Six thin HTTP handlers; no try/catch, no direct Prisma, DELETE returns 204, both POSTs return 201
- `apps/api/src/routes/workout.ts` — Express router with authenticateToken + validateSchema per route; three paths: `/`, `/:id`, `/:id/logs`
- `apps/api/src/routes/index.ts` — Added `import workoutRoutes` and `router.use("/workouts", workoutRoutes)`

## Decisions Made

- Cross-user access returns 404 (NotFoundError) not 403 — matches RESEARCH pitfall 6; ownership enforced at Prisma query level, not a separate check
- Static Hold / Dynamic cross-field validation in `validateExerciseInput` at service layer because Zod workoutExerciseInputSchema cannot enforce mutually-exclusive fields (D-09 from CONTEXT.md)
- `requireUserUuid` typed against `WorkoutIdParam` to satisfy asyncHandler's generic `P` constraint without resorting to `any`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript error: `unknown` not assignable to `ParamsDictionary` in controller**
- **Found during:** Task 2 (controller typecheck)
- **Issue:** `requireUserUuid(req: Request, res: Response)` typed against base `Request` with `P = ParamsDictionary`; handlers passing `Request<unknown, ...>` caused TS2345 error
- **Fix:** Typed `requireUserUuid` against `Request<WorkoutIdParam>` and changed list/create handlers from `unknown` params to `WorkoutIdParam` — consistent and equally safe since those routes have no `:id` segment
- **Files modified:** `apps/api/src/controllers/workout.ts`
- **Verification:** `yarn workspace api build` exits 0
- **Committed in:** `45ce348` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — TypeScript type error)
**Impact on plan:** Minimal fix required for type safety. No scope creep.

## Issues Encountered

- Vitest uses positional pattern argument (`vitest workouts`) not `--testPathPattern` flag (which is Jest). Plan's verify command used the wrong flag. Used correct Vitest syntax for the run.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All six workout endpoints are live and authenticated — `/api/workouts` is production-ready for the native WorkoutBuilder screen (plan 04)
- WKT-01, WKT-02, WKT-03, WKT-04 requirements satisfied at the API layer
- No blockers for plan 04 (native screens) or plan 05 (AI workout generation)

---
*Phase: 03-manual-workout-builder*
*Completed: 2026-05-02*
