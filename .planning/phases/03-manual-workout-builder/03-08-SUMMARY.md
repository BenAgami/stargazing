---
phase: 03-manual-workout-builder
plan: 08
subsystem: ui
tags: [react-native, expo-router, tanstack-query, state-machine, rest-timer]

# Dependency graph
requires:
  - phase: 03-manual-workout-builder plan 04
    provides: useCountdown hook (rest timer backbone), workoutApi.startLog endpoint, WorkoutLogValues type
  - phase: 03-manual-workout-builder plan 06
    provides: useWorkoutDetail hook, workout-detail screen with Start CTA navigation
provides:
  - useStartWorkout mutation (POST /api/workouts/:id/logs)
  - useWorkoutExecution state machine (working->resting->complete phases)
  - RestTimer component (numeric countdown with Skip rest)
  - workout-execute screen (step-through execution + completion summary)
affects: [phase-07-progress-tracking, AI-analysis-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "State machine in hook: phase-based (working/resting/complete) with explicit advance transitions"
    - "Wall-clock elapsed via Date.now() ref, not setInterval counter — survives app backgrounding"
    - "Hook composition: useWorkoutExecution composes useCountdown (plan-04 hook)"
    - "Mutation fires on user action (Done tap), not on phase transition — keeps hook navigation-free"

key-files:
  created:
    - apps/native/src/hooks/mutations/useStartWorkout.ts
    - apps/native/src/components/RestTimer.tsx
    - apps/native/src/hooks/useWorkoutExecution.ts
    - apps/native/app/(main)/workout-execute.tsx
  modified:
    - apps/native/app/(main)/_layout.tsx

key-decisions:
  - "gestureEnabled: false on workout-execute Stack.Screen prevents accidental swipe-back mid-set losing the workout log"
  - "handleDone uses Alert on error but navigates back anyway — acceptable v1 data-loss tradeoff; Phase 7 adds retry UX"
  - "Static Hold exercises show 'Hold for X' label (informational); no auto-timing during the hold — user taps Complete set when done"
  - "advanceAfterRest extracted as useCallback to avoid duplicating 3-branch logic in both completeSet and skipRest"
  - "restSecs <= 0 check in completeSet bypasses rest phase entirely for exercises with no rest configured"

patterns-established:
  - "Phase-based state machine in hook: expose phase union type + action callbacks; screen is JSX-only"
  - "Wall-clock elapsed: useRef(Date.now()) + setInterval reading delta, never incrementing a counter"

requirements-completed: [WKT-04]

# Metrics
duration: 15min
completed: 2026-05-02
---

# Phase 03 Plan 08: Workout Execution Screen Summary

**Step-through workout execution screen with auto-countdown rest timer, Skip rest, and WorkoutLog recording via POST /api/workouts/:id/logs**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-02T21:28:16Z
- **Completed:** 2026-05-02T21:43:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Built `useWorkoutExecution` state machine isolating all phase transitions (working → resting → next set/exercise → complete)
- Built `RestTimer` component with numeric countdown, tabular-nums, accessibilityLiveRegion, and Skip rest button
- Built `workout-execute.tsx` handling three distinct UI states: loading, active set/rest, completion summary
- Wired `useStartWorkout` mutation to fire POST /api/workouts/:id/logs on Done with wall-clock elapsed duration
- Registered `workout-execute` in `(main)/_layout.tsx` with `gestureEnabled: false` (prevents mid-set swipe-back)

## Task Commits

1. **Task 1: useStartWorkout + RestTimer + useWorkoutExecution** - `c628d92` (feat)
2. **Task 2: workout-execute screen + layout registration** - `c38bf67` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `apps/native/src/hooks/mutations/useStartWorkout.ts` - Mutation wrapping workoutApi.startLog; invalidates workoutKeys.all on success
- `apps/native/src/components/RestTimer.tsx` - Numeric countdown with tabular-nums, accessibilityLiveRegion, Skip rest Pressable
- `apps/native/src/hooks/useWorkoutExecution.ts` - State machine: exerciseIndex, setNumber, phase, totalElapsed; composes useCountdown
- `apps/native/app/(main)/workout-execute.tsx` - Step-through screen + completion summary; fires mutation on Done
- `apps/native/app/(main)/_layout.tsx` - Added workout-execute Stack.Screen with gestureEnabled: false

## State Machine Transitions in useWorkoutExecution

```
working
  └─ completeSet()
       ├─ last set + last exercise → complete
       ├─ restSecs <= 0 → advanceAfterRest() [skip rest phase entirely]
       └─ otherwise → resting + countdown.start(restSecs)

resting
  ├─ countdown reaches 0 naturally → advanceAfterRest()
  └─ skipRest() → countdown.skip() + advanceAfterRest()

advanceAfterRest()
  ├─ more sets on current exercise → setNumber + 1, phase = working
  ├─ more exercises → exerciseIndex + 1, setNumber = 1, phase = working
  └─ no more → phase = complete
```

## Edge Cases Handled
- **Zero rest exercise** (`restSecs <= 0`): `completeSet` calls `advanceAfterRest` directly, skipping rest phase
- **Single-set exercise**: `isLastSetOfExercise` is true on first `completeSet` → moves to next exercise immediately (or complete if last)
- **Workout with one exercise + one set**: `completeSet` → `isLastSetOfExercise && isLastExerciseOfWorkout` → `phase = "complete"` directly
- **Natural countdown end**: `useEffect` watches `countdown.isRunning === false && countdown.secondsLeft === 0` → calls `advanceAfterRest`

## D-15..D-18 Status

| Requirement | Status | Notes |
|-------------|--------|-------|
| D-15: Step-through execution screen | Realized | currentExerciseIndex, currentSet, exerciseName, reps/duration display |
| D-16: WorkoutLog via POST /api/workouts/:id/logs | Realized | Fires on Done with durationSecs=totalElapsedSecs |
| D-17: Auto-countdown rest timer + Skip | Realized | useCountdown drives RestTimer; skipRest() advances immediately |
| D-18: Completion summary + Done navigates back | Realized | Workout name, exercises count, elapsed duration; router.replace to workouts tab |

## POST /api/workouts/:id/logs Confirmation

`handleDone` fires `startMutation.mutate({ workoutId: id, data: { durationSecs: execution.totalElapsedSecs, completedAt: new Date().toISOString() } })`. On success: `router.replace("/(main)/(tabs)/workouts")`. On error: Alert shown, then same navigation (v1 acceptable data-loss tradeoff).

## TypeScript Check

`yarn workspace native tsc --noEmit` exits 0 — no type errors.

## Deviations from Plan

None - plan executed exactly as written.

Note: During parallel execution, plan 07 also modified `_layout.tsx` to add the `workout-builder` Stack.Screen. The final layout has 8 Stack.Screens as expected by the acceptance criteria.

## Issues Encountered

None — all acceptance criteria met on first implementation pass.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- WKT-04 satisfied: starting a named workout records a WorkoutLog via POST /api/workouts/:id/logs
- Phase 3 (manual workout builder) is now complete: catalog browse, workout CRUD, execution with rest timer, log recording
- Phase 7 (progress tracking) can now read WorkoutLog records to display session history
- Phase 5 (AI form analysis) will layer on top of the execution screen for camera recording

---
*Phase: 03-manual-workout-builder*
*Completed: 2026-05-02*
