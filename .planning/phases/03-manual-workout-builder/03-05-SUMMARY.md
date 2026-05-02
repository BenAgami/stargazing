---
phase: 03-manual-workout-builder
plan: 05
subsystem: ui
tags: [react-native, tanstack-query, expo-router, exercise-catalog, flatlist]

requires:
  - phase: 03-04
    provides: exerciseApi, exerciseKeys, ExerciseListResponse, ExerciseDetail types

provides:
  - useExercises hook (TanStack Query, auth-gated, 10-min stale, PAGE_SIZE=100)
  - useExerciseDetail hook (TanStack Query, auth+code gated, by code)
  - ExerciseCard component (2-col card, deterministic color hash, Pressable, a11y)
  - ExerciseTypeSegmented component (3-option All/Dynamic/Static Hold toggle)
  - exercise-catalog screen (2-col FlatList grid, search TextInput, type filter, picker mode)
  - exercise-detail screen (displayName, type badge, description, Add-to-workout CTA)
  - Stack.Screen registrations in (main)/_layout.tsx

affects: [03-06, 03-07, 03-08, 03-09]

tech-stack:
  added: []
  patterns:
    - TanStack Query hook with enabled: !!token && !!code for optional-code param guard
    - pickerReturnTo query param pattern for dual-mode screen (standalone + picker)
    - Deterministic card color via charCodeAt + (hash << 5) - hash bit-shift hash
    - Client-side filter with useMemo over fetched list (no API search params)

key-files:
  created:
    - apps/native/src/hooks/queries/useExercises.ts
    - apps/native/src/hooks/queries/useExerciseDetail.ts
    - apps/native/src/components/ExerciseCard.tsx
    - apps/native/src/components/ExerciseTypeSegmented.tsx
    - apps/native/app/(main)/exercise-catalog.tsx
    - apps/native/app/(main)/exercise-detail.tsx
  modified:
    - apps/native/app/(main)/_layout.tsx

key-decisions:
  - "pickerReturnTo query param (not modal state) used for dual-mode catalog: standalone entry points push /exercise-catalog; builder passes pickerReturnTo=/workout-builder; detail screen routes back via router.replace with pickedExercise* params"
  - "Client-side filter: useExercises fetches all exercises once (PAGE_SIZE=100) and catalog filters via useMemo — no API search params needed for small catalog"
  - "ExerciseTypeSegmented built with Pressable toggle (not @react-native-segmented-control) — avoids extra dep per RESEARCH Open Question 3"

patterns-established:
  - "Dual-mode screen pattern: pass pickerReturnTo query param to signal picker context; detail screen dispatches router.replace with selected data params back to builder"
  - "Optional-code TanStack hook: useExerciseDetail(code: string | undefined) with enabled: !!token && !!code allows unconditional hook call from screen"

requirements-completed: [WKT-01]

duration: 6min
completed: 2026-05-03
---

# Phase 03 Plan 05: Exercise Catalog UI Summary

**Read-only exercise catalog with 2-column card grid, search + type filter, and detail screen; dual-mode (standalone + picker) navigation via pickerReturnTo query param**

## Performance

- **Duration:** 6 min
- **Started:** 2026-05-02T20:57:46Z
- **Completed:** 2026-05-02T21:03:32Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Two TanStack Query hooks (`useExercises`, `useExerciseDetail`) auth-gated and following Rule 3 (call exerciseApi service, not apiClient directly)
- `ExerciseCard` component with deterministic color hash from exercise code, Pressable interactions, accessibility roles and labels
- `ExerciseTypeSegmented` three-option Pressable toggle (All / Dynamic / Static Hold) using `useTheme()` for colors
- `exercise-catalog` screen: 2-column FlatList grid, TextInput search, segmented type filter, all applied client-side via `useMemo`; supports `pickerReturnTo` param for builder picker mode
- `exercise-detail` screen: displays displayName, exerciseType badge, description; "Add to workout" / "Done" CTA with dual-mode navigation
- Stack.Screen registrations for both new screens in `(main)/_layout.tsx` (5 total entries)

## Task Commits

1. **Task 1: useExercises + useExerciseDetail TanStack hooks** - `e8c2648` (feat)
2. **Task 2: ExerciseCard + ExerciseTypeSegmented presentational components** - `97f4b58` (feat)
3. **Task 3: exercise-catalog.tsx + exercise-detail.tsx screens + layout** - `b37735f` (feat)

## Files Created/Modified

- `apps/native/src/hooks/queries/useExercises.ts` (17 lines) — fetches all exercises, exerciseKeys.lists() cache key, 10-min stale
- `apps/native/src/hooks/queries/useExerciseDetail.ts` (17 lines) — fetches single exercise by code, optional code param
- `apps/native/src/components/ExerciseCard.tsx` (77 lines) — 2-col card with deterministic color, Dynamic/Static Hold badge, Pressable
- `apps/native/src/components/ExerciseTypeSegmented.tsx` (64 lines) — 3-option toggle with ExerciseTypeFilter type export
- `apps/native/app/(main)/exercise-catalog.tsx` (108 lines) — catalog screen with grid, search, type filter, picker support
- `apps/native/app/(main)/exercise-detail.tsx` (96 lines) — detail screen with description and CTA
- `apps/native/app/(main)/_layout.tsx` — added exercise-catalog and exercise-detail Stack.Screen entries

## Decisions Made

- `pickerReturnTo` query param used instead of modal state or context for dual-mode navigation (D-04). Keeps navigation tree simple — both standalone and picker paths use the same stack screen; builder passes its own route as pickerReturnTo; detail does router.replace back with pickedExercise* params.
- Client-side filtering over full list fetch (PAGE_SIZE=100) rather than server-side search params — catalog is small, per CONTEXT.md "Deferred Ideas: Search-while-typing debounce optimization".
- Built Pressable-based ExerciseTypeSegmented instead of installing `@react-native-segmented-control/segmented-control` — avoids extra dep for a 3-option control per RESEARCH Open Question 3.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. TypeScript typecheck (`tsc --noEmit`) passed cleanly after each task.

## TypeScript Verification

```
yarn workspace native tsc --noEmit
Done in 10.91s.
```

Exit code 0 — no type errors.

## Known Stubs

- `exercise-detail.tsx`: when not in picker mode, "Done" presses `router.back()` rather than navigating to a workout creation flow. The plan explicitly defers full standalone "Add to workout" entry point to plan 06/07. This does not prevent the plan's goal (browsing the catalog, viewing details, picker-mode exercise selection).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- WKT-01 satisfied: exercise catalog (2-col grid) and exercise detail are both accessible
- D-01 through D-04 all satisfied
- Plan 06 (workout list screen) and plan 07 (workout builder) can now reference exercise-catalog screen with pickerReturnTo to enable exercise selection from within the builder
- All hooks follow Rule 3; all screens are JSX-only (Rule 4); ExerciseTypeFilter type uses proper enum literal union (Rule 8)

---
*Phase: 03-manual-workout-builder*
*Completed: 2026-05-03*
