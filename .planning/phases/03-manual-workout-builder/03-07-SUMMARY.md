---
phase: 03-manual-workout-builder
plan: 07
subsystem: ui
tags: [react-native, expo-router, tanstack-query, draggable-flatlist, workout-builder]

# Dependency graph
requires:
  - phase: 03-manual-workout-builder
    provides: "plans 01-06: API endpoints, workout API client, query hooks, exercise catalog picker, workout detail screen"
provides:
  - "useCreateWorkout mutation hook — POST /api/workouts with cache invalidation + detail cache seed"
  - "useUpdateWorkout mutation hook — PATCH /api/workouts/:id with cache invalidation + detail cache seed"
  - "Stepper component — bounded +/- numeric control with tabular-nums display and optional formatter"
  - "WorkoutExerciseRow component — expandable draggable row; Reps<->Duration swap based on exerciseType"
  - "useWorkoutBuilder hook — draft state machine: name, exercises, validation, create/edit persistence"
  - "workout-builder screen — create and edit modes via :id param, DraggableFlatList reorder, picker round-trip"
affects:
  - 03-manual-workout-builder plan 08 (workout-execute)
  - future AI workout generation phase

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Picker round-trip: push /exercise-catalog?pickerReturnTo, router.replace back with pickedExercise* params, screen clears params via router.setParams(undefined) to prevent duplicate adds"
    - "Draft state machine: seededRef guards one-time server seed in edit mode; addExercise/updateExercise/removeExercise/reorderExercises as named stable callbacks"
    - "Duration stored as integer seconds; mm:ss is display-only via format prop on Stepper (never stored as string)"
    - "Detail cache seeded on create/update mutation success for instant navigation without re-fetch"

key-files:
  created:
    - apps/native/src/hooks/mutations/useCreateWorkout.ts
    - apps/native/src/hooks/mutations/useUpdateWorkout.ts
    - apps/native/src/components/Stepper.tsx
    - apps/native/src/components/WorkoutExerciseRow.tsx
    - apps/native/src/hooks/useWorkoutBuilder.ts
    - apps/native/app/(main)/workout-builder.tsx
  modified:
    - apps/native/app/(main)/_layout.tsx

key-decisions:
  - "workout-builder screen clears picker params via router.setParams(undefined) after consuming them — prevents duplicate addExercise on re-render"
  - "useWorkoutBuilder.save() accepts onCreated/onUpdated callbacks — keeps navigation in the screen layer, hook stays nav-free"
  - "buildPayload enforces reps XOR durationSecs: STATIC_HOLD sends reps:null, DYNAMIC sends durationSecs:null"
  - "seededRef prevents re-seeding draft in edit mode if detailQuery re-fetches after initial seed"

patterns-established:
  - "Stepper: always use Pressable (not TouchableOpacity); fontVariant tabular-nums prevents value width jitter"
  - "WorkoutExerciseRow: expanded state is local to each row (not modal/bottom sheet per D-06)"
  - "Mutation hooks: invalidate lists() AND setQueryData detail — list refresh + instant navigation"

requirements-completed: [WKT-02, WKT-03]

# Metrics
duration: 4min
completed: 2026-05-02
---

# Phase 3 Plan 07: Workout Builder Screen Summary

**Workout builder screen with DraggableFlatList reorder, inline Stepper controls, catalog-as-picker round-trip, and create/edit mode persistence via useCreateWorkout and useUpdateWorkout**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-05-02T21:27:49Z
- **Completed:** 2026-05-02T21:31:40Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- Created useCreateWorkout and useUpdateWorkout mutation hooks with list invalidation and detail cache seeding
- Built Stepper (bounded +/- numeric control, tabular-nums, optional formatter) and WorkoutExerciseRow (expandable, draggable, Reps/Duration swap per D-09)
- Built useWorkoutBuilder state machine (draft name + exercises, validation, save) and workout-builder.tsx screen supporting both create and edit modes

## Task Commits

Each task was committed atomically:

1. **Task 1: useCreateWorkout + useUpdateWorkout mutation hooks** - `1388413` (feat)
2. **Task 2: Stepper + WorkoutExerciseRow components** - `db44a46` (feat)
3. **Task 3: useWorkoutBuilder hook + workout-builder.tsx screen + _layout.tsx** - `acf8603` (feat)

**Note:** `_layout.tsx` workout-builder registration was also included in the parallel plan 08 agent's commit `c38bf67` — both agents edited the file and the result contains both `workout-execute` and `workout-builder` Stack.Screen entries.

## Files Created/Modified

- `apps/native/src/hooks/mutations/useCreateWorkout.ts` - useMutation wrapping workoutApi.create; invalidates lists + seeds detail cache
- `apps/native/src/hooks/mutations/useUpdateWorkout.ts` - useMutation wrapping workoutApi.update; same cache strategy; typed with UpdateWorkoutVariables
- `apps/native/src/components/Stepper.tsx` - Reusable bounded +/- control; fontVariant tabular-nums; disabled at min/max; optional format prop
- `apps/native/src/components/WorkoutExerciseRow.tsx` - Expandable draggable row; onLongPress drag handle; isStatic ternary swaps Reps↔Duration; formatDuration stores integer seconds
- `apps/native/src/hooks/useWorkoutBuilder.ts` - Draft state machine; composes useWorkoutDetail + useCreateWorkout + useUpdateWorkout; seededRef for one-time server seed; validation memo; buildPayload enforces reps XOR durationSecs
- `apps/native/app/(main)/workout-builder.tsx` - Create/edit screen; DraggableFlatList with ScaleDecorator; picker round-trip via useLocalSearchParams + router.setParams clear; TextInput name field; Save Pressable disabled until validation passes
- `apps/native/app/(main)/_layout.tsx` - Added workout-builder Stack.Screen (alongside workout-execute from plan 08)

## Decisions Made

- `router.setParams({ pickedExerciseId: undefined, ... })` clears picker round-trip params after consuming them in useEffect — prevents duplicate addExercise on re-render or screen re-focus
- `save()` takes `onCreated`/`onUpdated` callbacks so navigation stays in the screen layer; hook remains navigation-free per project conventions
- `buildPayload` sends `reps: null` for STATIC_HOLD and `durationSecs: null` for DYNAMIC — satisfies server-side cross-field constraint (exactly one must be set)
- `seededRef.current = true` guard prevents re-seeding draft in edit mode if `detailQuery` re-fetches stale data after initial load

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- TypeScript `tsc --noEmit` via `yarn workspace native tsc --noEmit -p apps/native/tsconfig.json` failed because the working directory for that workspace command is `apps/native`, not the monorepo root. Ran `npx tsc --noEmit` from `apps/native/` directly — exited 0.

## Design Decisions (D-05..D-09 status)

| Decision | Status | Notes |
|---|---|---|
| D-05 Name-first flow | Realized | TextInput at top of screen, exercises below |
| D-06 Inline expansion (no modal/sheet) | Realized | `expanded` state local to WorkoutExerciseRow |
| D-07 DnD reorder via draggable-flatlist | Realized | `onDragEnd` calls `builder.reorderExercises(data)` |
| D-08 +/- Pressable steppers (no keyboard) | Realized | Stepper component with Pressable − and + buttons |
| D-09 Static Hold Duration swap | Realized | `isStatic ? <Stepper label="Duration"> : <Stepper label="Reps">` |

## Picker Round-Trip Mechanism

1. User taps "+ Add exercise" — `router.push('/exercise-catalog?pickerReturnTo=/workout-builder')`
2. User browses catalog, taps exercise card → exercise-detail screen
3. exercise-detail detects `pickerReturnTo` → `router.replace('/workout-builder?pickedExerciseId=...&pickedExerciseCode=...&pickedExerciseType=...&pickedExerciseDisplayName=...')`
4. workout-builder's `useEffect` on `params.pickedExerciseId` calls `builder.addExercise(...)` then clears all picker params via `router.setParams({ pickedExerciseId: undefined, ... })`
5. Clearing prevents re-add if screen re-renders or user navigates away and back

## DraggableFlatList Integration Notes

- Library already installed from plan 04 — no version issues encountered
- `GestureHandlerRootView` is at app root from plan 04 — correctly NOT added in this screen (Pitfall 1 avoided)
- `ScaleDecorator` wraps each renderItem as required by react-native-draggable-flatlist v4 API
- `keyExtractor` uses `localId` (stable client-side UUID) — survives reorder correctly
- `babel.config.*` untouched — Reanimated 4 auto-configured by babel-preset-expo

## TypeScript Check

`npx tsc --noEmit` from `apps/native/` — **exit 0, no errors**

## Known Stubs

None — all data is wired from real server state or live draft state. The builder starts empty (create mode) or seeds from server (edit mode).

## Self-Check: PASSED

- `apps/native/src/hooks/mutations/useCreateWorkout.ts` — FOUND
- `apps/native/src/hooks/mutations/useUpdateWorkout.ts` — FOUND
- `apps/native/src/components/Stepper.tsx` — FOUND
- `apps/native/src/components/WorkoutExerciseRow.tsx` — FOUND
- `apps/native/src/hooks/useWorkoutBuilder.ts` — FOUND
- `apps/native/app/(main)/workout-builder.tsx` — FOUND
- Commits 1388413, db44a46, acf8603 — all present in git log

---
*Phase: 03-manual-workout-builder*
*Completed: 2026-05-02*
