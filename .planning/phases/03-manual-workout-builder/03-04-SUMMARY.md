---
phase: 03-manual-workout-builder
plan: 04
subsystem: ui
tags: [react-native, expo, tanstack-query, gesture-handler, reanimated, draggable-flatlist, typescript]

requires:
  - phase: 03-manual-workout-builder
    provides: workout/workoutLog API (CRUD routes, Prisma models, integration tests)

provides:
  - react-native-reanimated@~4.1.1 + react-native-gesture-handler@~2.28.0 + react-native-worklets@0.5.1 + react-native-draggable-flatlist@^4.0.3 installed at SDK-54-compatible versions
  - GestureHandlerRootView wrapping app root in apps/native/app/_layout.tsx
  - workoutKeys and exerciseKeys TanStack Query key constants exported from @src/api
  - workoutApi service (list, get, create, update, remove, startLog) — typed apiClient wrappers
  - exerciseApi service (list, getByCode) — typed apiClient wrappers
  - src/types/workout.ts with WorkoutWithExercises, WorkoutListResponse, WorkoutExerciseHydrated, ExerciseSummary, ExerciseDetail, ExerciseListResponse, WorkoutLogResponse, ExerciseType
  - useCountdown hook with start(seconds?)/skip/secondsLeft/isRunning — leak-safe interval management

affects:
  - 03-05-exercises-catalog
  - 03-06-workout-list
  - 03-07-workout-builder
  - 03-08-workout-execute
  - Any native screen/hook that imports from @src/api

tech-stack:
  added:
    - react-native-reanimated@~4.1.1 (Expo SDK 54 default)
    - react-native-gesture-handler@~2.28.0 (Expo SDK 54 default)
    - react-native-worklets@0.5.1 (Reanimated 4 peer dep)
    - react-native-draggable-flatlist@^4.0.3 (drag-and-drop sortable list)
  patterns:
    - API service layer: pure apiClient wrappers in src/api/endpoints/*.ts (no React, no state)
    - TanStack Query keys namespaced by resource type in src/api/keys.ts
    - Response shape types isolated in src/types/ (not in @repo/common until API formalizes response schemas)
    - useRef for interval IDs in timer hooks (never in state — avoids stale-closure bugs)

key-files:
  created:
    - apps/native/src/api/endpoints/workouts.ts
    - apps/native/src/api/endpoints/exercises.ts
    - apps/native/src/types/workout.ts
    - apps/native/src/hooks/useCountdown.ts
  modified:
    - apps/native/app/_layout.tsx (GestureHandlerRootView wrap)
    - apps/native/package.json (4 new deps)
    - apps/native/src/api/keys.ts (workoutKeys + exerciseKeys added)
    - apps/native/src/api/endpoints/index.ts (workoutApi + exerciseApi re-exports)
    - apps/native/src/api/index.ts (extended named exports)
    - apps/native/src/api/client.ts (204 No Content fix)

key-decisions:
  - "GestureHandlerRootView must be outermost wrapper (outside QueryClientProvider) to avoid gesture events being swallowed by context providers"
  - "babel.config.* left unchanged — Reanimated 4 auto-configured by babel-preset-expo via react-native-worklets; manual plugin would cause double-registration"
  - "Response types in src/types/workout.ts not @repo/common — API has no formal response Zod schemas yet; defer to future plan"
  - "exerciseApi.list uses limit/offset only — client-side filtering for name/type per RESEARCH (catalog is small)"
  - "apiClient.delete<void> works via 204 No Content guard added to parseResponse in client.ts"

patterns-established:
  - "Pattern: Service layer (workoutApi/exerciseApi) as plain object of apiClient calls — no React hooks, no state, importable anywhere"
  - "Pattern: Timer hooks use useRef for interval IDs; useEffect return value IS the cleanup function directly"

requirements-completed:
  - WKT-01
  - WKT-02
  - WKT-03
  - WKT-04

duration: 35min
completed: 2026-05-02
---

# Phase 03 Plan 04: Foundation Layer Summary

**Installed drag-and-drop animation stack (Reanimated 4 + Gesture Handler + draggable-flatlist), wired GestureHandlerRootView at app root, and built the complete native API service layer (workoutApi, exerciseApi, query keys, response types, useCountdown hook) consumed by all downstream Phase 3 screens.**

## Performance

- **Duration:** 35 min
- **Started:** 2026-05-02T16:04:34Z
- **Completed:** 2026-05-02T16:39:00Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- Four native packages installed at Expo SDK-54-compatible versions via `expo install` (managed) + `yarn workspace native add` (unmanaged); `babel.config.*` untouched
- `GestureHandlerRootView style={{ flex: 1 }}` wraps app root outside `QueryClientProvider` — all screens now inherit gesture support without extra provider wrapping
- Complete workout + exercise API service layer: 6 workoutApi methods + 2 exerciseApi methods, all typed against `@repo/common` request types and local `src/types/workout.ts` response types
- `useCountdown` hook is leak-safe: interval stored in `useRef`, dual useEffect cleanup (on stop + on unmount), supports per-call duration override via `start(seconds?)`

## Task Commits

1. **Task 1: Install drag-and-drop deps + wrap root with GestureHandlerRootView** - `0c43ec2` (feat)
2. **Task 2: Add workoutKeys + exerciseKeys, API services, local types, re-exports** - `5f5a612` (feat)
3. **Task 3: Implement useCountdown hook** - `e79bd70` (feat)

## Files Created/Modified

- `apps/native/package.json` — added react-native-reanimated@~4.1.1, react-native-worklets@0.5.1, react-native-gesture-handler@~2.28.0, react-native-draggable-flatlist@^4.0.3
- `apps/native/app/_layout.tsx` — GestureHandlerRootView outermost wrapper
- `apps/native/src/api/keys.ts` — appended workoutKeys + exerciseKeys to existing userKeys/authKeys
- `apps/native/src/api/client.ts` — 204 No Content guard in parseResponse
- `apps/native/src/api/endpoints/workouts.ts` — NEW: workoutApi (list, get, create, update, remove, startLog)
- `apps/native/src/api/endpoints/exercises.ts` — NEW: exerciseApi (list, getByCode)
- `apps/native/src/api/endpoints/index.ts` — re-exports workoutApi + exerciseApi
- `apps/native/src/api/index.ts` — re-exports workoutApi, exerciseApi, workoutKeys, exerciseKeys
- `apps/native/src/types/workout.ts` — NEW: ExerciseType, ExerciseSummary, ExerciseDetail, ExerciseListResponse, WorkoutExerciseHydrated, WorkoutWithExercises, WorkoutListResponse, WorkoutLogResponse
- `apps/native/src/hooks/useCountdown.ts` — NEW: useCountdown hook with UseCountdownReturn interface

## Installed Package Versions

| Package | Range in package.json | Resolved version |
|---------|----------------------|-----------------|
| react-native-reanimated | ~4.1.1 | 4.1.7 |
| react-native-worklets | 0.5.1 | 0.5.1 |
| react-native-gesture-handler | ~2.28.0 | 2.28.0 |
| react-native-draggable-flatlist | ^4.0.3 | 4.0.3 |

## Query Key Shape (exact)

```typescript
export const workoutKeys = {
  all: ["workouts"] as const,
  lists: () => ["workouts", "list"] as const,
  detail: (id: number) => ["workouts", id] as const,
};

export const exerciseKeys = {
  all: ["exercises"] as const,
  lists: () => ["exercises", "list"] as const,
  list: (params: { search?: string; type?: string }) =>
    ["exercises", "list", params] as const,
  detail: (code: string) => ["exercises", "detail", code] as const,
};
```

## API Service Methods

**workoutApi:** `list(params?)`, `get(id)`, `create(data)`, `update(id, data)`, `remove(id)`, `startLog(id, data)`

**exerciseApi:** `list(params?)`, `getByCode(code)`

## TypeScript Check Output

```
tsc --noEmit: Done (exit 0) — no errors
```

## Decisions Made

- `GestureHandlerRootView` placed outside `QueryClientProvider` — gesture events cannot bubble through React context boundaries; must be outermost.
- `babel.config.*` not modified — Reanimated 4 auto-configures itself via `babel-preset-expo` through `react-native-worklets`. Manual plugin addition would cause double-registration and runtime errors.
- Response types stay in `src/types/workout.ts` (not `@repo/common`) — the API currently has no Zod response schemas; adding them to `@repo/common` before formalizing is premature. A future plan will migrate when response schemas are added.
- `exerciseApi.list` only accepts `limit`/`offset` — the research noted that catalog is small enough for in-memory name/type filtering on the client; debounce server search is deferred.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed 204 No Content crash in apiClient.delete**
- **Found during:** Task 2 (workoutApi service creation)
- **Issue:** `parseResponse` called `parseJson` unconditionally; `parseJson` requires `application/json` content-type, but DELETE /api/workouts/:id returns HTTP 204 with no body and no content-type. Calling `workoutApi.remove()` would throw `"Unexpected response format."` on success.
- **Fix:** Added early return in `parseResponse` when `res.status === StatusCode.NO_CONTENT`: returns `undefined as unknown as T` (correct for `Promise<void>` callers).
- **Files modified:** `apps/native/src/api/client.ts`
- **Verification:** TypeScript check passes; the guard is narrowly scoped to 204 only.
- **Committed in:** `5f5a612` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug)
**Impact on plan:** Fix essential for correctness — without it every workout deletion would surface a spurious error to the user despite succeeding on the server. No scope creep.

## Issues Encountered

- `npx expo install --workspace apps/native ...` is not a valid flag combination — `expo install` must be run from the target package directory. Fixed by `cd apps/native` before running `expo install`. No impact on outcome.

## Known Stubs

None — this plan is a pure foundation layer (deps, services, keys, types, hook). No UI rendering or data-binding is done in this plan; stub tracking is not applicable.

## Next Phase Readiness

- All Phase 3 native screens can now `import { workoutApi, workoutKeys, exerciseApi, exerciseKeys } from "@src/api"` without touching `apiClient` directly
- `useCountdown` ready for consumption by workout-execute screen (plan 08)
- GestureHandlerRootView in place — drag-and-drop components in workout-builder (plan 07) will work without additional provider setup
- No blockers for plans 05/06/07/08

---
*Phase: 03-manual-workout-builder*
*Completed: 2026-05-02*
