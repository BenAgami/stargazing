---
phase: 03-manual-workout-builder
plan: "06"
subsystem: ui
tags: [react-native, expo-router, tanstack-query, workouts, navigation]

requires:
  - phase: 03-04
    provides: workoutApi service, workoutKeys cache constants, WorkoutWithExercises + WorkoutListResponse types

provides:
  - useWorkouts: TanStack list query for /api/workouts with 30s staleTime
  - useWorkoutDetail: TanStack detail query gated on token && id
  - useDeleteWorkout: TanStack mutation with workoutKeys.all cache invalidation
  - WorkoutCard: Pressable card showing name, exercise count, last-modified date
  - workouts.tsx: Workouts tab (third tab, D-10) with card list + FAB + useFocusEffect refetch
  - workout-detail.tsx: Detail screen with Start/Edit/Delete + native Alert confirmation (D-13, D-14)

affects:
  - 03-07 (workout-builder: edit CTA target)
  - 03-08 (workout-execute: start CTA target)

tech-stack:
  added: []
  patterns:
    - useFocusEffect + queryClient.invalidateQueries for stale-list prevention on tab focus
    - Mutation onSuccess passes router.back() via mutate() options — hook stays navigation-free
    - Three Pressables with explicit accessibilityLabel for Start/Edit/Delete (accessibility baseline)

key-files:
  created:
    - apps/native/src/hooks/queries/useWorkouts.ts
    - apps/native/src/hooks/queries/useWorkoutDetail.ts
    - apps/native/src/hooks/mutations/useDeleteWorkout.ts
    - apps/native/src/components/WorkoutCard.tsx
    - apps/native/app/(main)/(tabs)/workouts.tsx
    - apps/native/app/(main)/workout-detail.tsx
  modified:
    - apps/native/app/(main)/(tabs)/_layout.tsx
    - apps/native/app/(main)/_layout.tsx

key-decisions:
  - "useFocusEffect invalidates workoutKeys.lists() in the SCREEN not the hook — keeps useWorkouts composable for other consumers"
  - "useDeleteWorkout does not call router.back() — navigation passed via mutate() options in the screen, keeping the hook navigation-free"
  - "formatExerciseRow handles STATIC_HOLD (durationSecs, formatted as M:SS) and DYNAMIC (reps), falls back to dash for missing values"
  - "Start/Edit navigation targets (/workout-execute, /workout-builder) are wired but screens do not exist yet — expected; plans 07 and 08 register those routes"

patterns-established:
  - "Pattern: useFocusEffect invalidation in tab screens prevents stale list after back-navigation (Phase 2 lesson re-applied)"
  - "Pattern: hooks/mutations/ directory for TanStack useMutation hooks alongside hooks/queries/"

requirements-completed:
  - WKT-03
  - WKT-04

duration: 4min
completed: "2026-05-02"
---

# Phase 03 Plan 06: Workout Management Surface Summary

**Workouts tab (third tab, barbell icon) with card list + FAB, workout detail screen with Start/Edit/Delete actions, and three TanStack hooks (useWorkouts, useWorkoutDetail, useDeleteWorkout) backing them**

## Performance

- **Duration:** 4 min
- **Started:** 2026-05-02T21:21:57Z
- **Completed:** 2026-05-02T21:25:17Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Three TanStack Query hooks: list query, detail query, delete mutation with cache invalidation
- Workouts tab registered as third tab between Home and Settings with barbell-outline icon
- useFocusEffect + queryClient.invalidateQueries pattern applied (Phase 2 lesson, prevents stale list bug)
- Workout detail screen renders exercises with per-row config display and Start/Edit/Delete CTAs
- Native Alert.alert confirmation dialog with destructive style before deletion (D-14)
- Delete mutation disables button and shows "Deleting…" while pending

## Task Commits

Each task was committed atomically:

1. **Task 1: useWorkouts + useWorkoutDetail + useDeleteWorkout hooks** - `49b1edd` (feat)
2. **Task 2: WorkoutCard component + workouts.tsx tab screen + register tab** - `412d44d` (feat)
3. **Task 3: workout-detail.tsx screen + register in (main)/_layout.tsx** - `01d3423` (feat)

## Files Created/Modified

- `apps/native/src/hooks/queries/useWorkouts.ts` - List query using workoutKeys.lists(), PAGE_SIZE=50, 30s staleTime
- `apps/native/src/hooks/queries/useWorkoutDetail.ts` - Detail query, enabled: !!token && !!id
- `apps/native/src/hooks/mutations/useDeleteWorkout.ts` - Delete mutation, invalidates workoutKeys.all on success
- `apps/native/src/components/WorkoutCard.tsx` - Pressable card: name (700 weight), exercise count, formatted updatedAt
- `apps/native/app/(main)/(tabs)/workouts.tsx` - Workouts tab with FlatList, useFocusEffect invalidation, FAB
- `apps/native/app/(main)/workout-detail.tsx` - Detail screen with formatExerciseRow, Start/Edit/Delete
- `apps/native/app/(main)/(tabs)/_layout.tsx` - Added workouts Tabs.Screen between index and settings (3 total)
- `apps/native/app/(main)/_layout.tsx` - Added workout-detail Stack.Screen (6 total)

## Hook Details

### useWorkouts
- Returns `useQuery<WorkoutListResponse, Error>`
- queryKey: `workoutKeys.lists()` — `["workouts", "list"]`
- queryFn: `workoutApi.list({ limit: 50, offset: 0 })`
- enabled: `!!token`
- staleTime: 30 000 ms (workouts change frequently while editing)

### useWorkoutDetail
- Returns `useQuery<WorkoutWithExercises, Error>`
- queryKey: `id ? workoutKeys.detail(id) : ["workouts", "detail", "none"]`
- enabled: `!!token && !!id`
- staleTime: 30 000 ms

### useDeleteWorkout
- Returns `useMutation`
- mutationFn: `(id: number) => workoutApi.remove(id)`
- onSuccess: `queryClient.invalidateQueries({ queryKey: workoutKeys.all })`
- No router calls — navigation responsibility stays in the screen

## formatExerciseRow Logic

```
"{sets} × {duration|reps|—} · {restSecs}s rest"
```

| exerciseType  | durationSecs | reps  | Output example            |
| ------------- | ------------ | ----- | ------------------------- |
| STATIC_HOLD   | 90           | null  | `3 × 1:30 · 60s rest`     |
| STATIC_HOLD   | 45           | null  | `3 × 45s · 60s rest`      |
| DYNAMIC       | null         | 10    | `3 × 10 reps · 60s rest`  |
| DYNAMIC       | null         | null  | `3 × — · 60s rest`        |

STATIC_HOLD with durationSecs < 60: shows `Xs` directly. >= 60: shows `M:SS`. Missing data falls back to `—`.

## Tab Order Confirmation

Final tab order in `(tabs)/_layout.tsx` (3 Tabs.Screen):
1. `index` — Home (Entypo home)
2. `workouts` — Workouts (Ionicons barbell-outline)
3. `settings` — Settings (Ionicons settings)

## Start / Edit Navigation Status

- **Start** (`handleStart`): `router.push({ pathname: "/workout-execute", params: { id } })` — target screen does not exist yet (plan 08). Tapping Start before plan 08 ships will show Expo Router "not found" screen. Expected behavior.
- **Edit** (`handleEdit`): `router.push({ pathname: "/workout-builder", params: { id } })` — target screen does not exist yet (plan 07). Same behavior. Expected.

Both navigation entry points are wired and ready. Plans 07 and 08 will register their Stack.Screen entries and implement the screens.

## TypeScript Verification

`npx tsc --noEmit` from `apps/native/` — exits 0, no errors.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 07 (workout-builder): edit CTA navigation target is wired at `/workout-builder?id=...`; FAB navigates to `/workout-builder` (no id = create mode)
- Plan 08 (workout-execute): start CTA navigation target is wired at `/workout-execute?id=...`
- useFocusEffect in workouts.tsx will automatically refetch after returning from builder or execute screens

---
*Phase: 03-manual-workout-builder*
*Completed: 2026-05-02*
