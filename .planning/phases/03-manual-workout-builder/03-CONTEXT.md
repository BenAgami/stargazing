# Phase 3: Manual Workout Builder - Context

**Gathered:** 2026-05-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can browse the exercise catalog, assemble named workouts with sets/reps/rest,
manage those workouts (edit/delete), and execute a workout session with a step-through
screen and rest timer. Video recording and AI form analysis are out of scope — those
are Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Exercise Catalog Display
- **D-01:** 2-column card grid layout (not list, not grouped). Each card shows exercise
  name + Dynamic/Static Hold badge on a solid background (no images in Phase 3).
- **D-02:** Both name search (text input) AND type filter (Dynamic / Static Hold
  segmented control) are included. User sees value for future catalog growth.
- **D-03:** Card tap → opens exercise detail view (not direct add). Detail shows:
  displayName, exerciseType, description. "Add to workout" button on detail screen.
- **D-04:** Catalog is accessible two ways: (a) standalone Exercises tab/screen any time,
  and (b) as a picker inside the workout builder when adding exercises.

### Workout Builder Flow
- **D-05:** Name-first flow: user types workout name → lands on empty builder → taps
  "Add exercise" to pick from catalog. Name is set before exercises are added.
- **D-06:** Sets/reps/rest configured inline on each exercise row in the builder
  (expandable inline, not a separate modal or bottom sheet).
- **D-07:** Drag-and-drop reordering of exercises within the builder.
- **D-08:** Numeric stepper (+/−) controls for Sets, Reps, and Rest — avoids keyboard
  popup for small integer values.
- **D-09:** Static Hold exercises auto-switch the Reps stepper to a Duration stepper
  (in seconds or mm:ss format), based on the exerciseType field from the Exercise model.

### Workout List & Navigation
- **D-10:** New dedicated Workouts tab — third tab alongside Home and Settings. Workouts
  are a first-class destination, not buried in the Home screen.
- **D-11:** Workout list uses cards: workout name, exercise count, last modified date.
  Consistent with card grid aesthetic from the exercise catalog.
- **D-12:** Floating action button (FAB, bottom-right +) to create a new workout from the
  list screen.
- **D-13:** Tapping a workout card → Workout Detail screen (not a direct start). Detail
  screen shows all exercises with their config, plus "Start" and "Edit" buttons.
- **D-14:** Edit and Delete are both actions on the Workout Detail screen. Delete requires
  a confirmation prompt before executing.

### Start Workout Scope
- **D-15:** "Start" opens a step-through execution screen that walks the user
  exercise-by-exercise: current exercise name/config, set counter, auto-countdown rest
  timer between sets (user can skip rest), advance to next exercise.
- **D-16:** New WorkoutLog model (separate from WorkoutSession). WorkoutSession is
  reserved for single-exercise video analysis (Phase 5). WorkoutLog records: which
  named workout was done, when it was completed, and duration. No video or analysis
  fields.
- **D-17:** Rest timer is an auto-countdown using the restSeconds configured per exercise.
  User can tap "Skip rest" to advance immediately.
- **D-18:** Completion: summary screen showing workout name, exercises completed, and
  total duration. "Done" navigates back to the workout list.

### Claude's Discretion
- Loading skeleton / empty states visual design
- Exact card background colors for exercise cards (can use a palette similar to
  AvatarDisplay's deterministic color system)
- Animation details for drag-and-drop reordering
- Exact rest timer visual (ring, bar, or numeric countdown)
- Error state handling for failed API calls

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §Workout Builder — WKT-01 through WKT-04 define
  acceptance criteria for this phase

### No external specs
No ADRs or design docs exist yet for this phase. Requirements are fully captured in
the decisions above and in REQUIREMENTS.md.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `packages/ui/src/ScreenHeader` — Page title + subtitle; use for all new screens
- `apps/native/src/theme/` — useTheme() + baseColors; use throughout (no inline hex)
- `apps/native/src/components/AvatarDisplay` — Deterministic color palette logic;
  adapt for exercise card background colors
- `apps/native/src/api/client.ts` — apiClient.get/post/patch/delete; all API calls go
  through this
- `apps/native/src/hooks/useProfile` — Template for new useQuery hooks (enabled guard,
  queryKey pattern, staleTime)
- `apps/api/src/routes/exercise.ts` + controller + service — Exercise API already
  exists: GET /api/exercises (paginated) and GET /api/exercises/:code. No changes
  needed to exercise endpoints.

### Established Patterns
- **API three-tier:** route → controller → service → Prisma. No business logic in
  controllers, no direct DB calls outside services.
- **asyncWrapper:** All async route handlers wrapped — never use try/catch in
  controllers.
- **validateSchema middleware:** Zod schemas in `packages/common/src/schemas/` validate
  request bodies before controllers see them.
- **TanStack React Query v5:** All data fetching uses useQuery/useMutation with
  namespaced query keys (see userKeys pattern in api/keys.ts).
- **useFocusEffect not useEffect:** Screens that display data needing refresh on
  back-navigation use useFocusEffect (Phase 2 lesson — useEffect with [] shows stale
  data after Expo Router stack back-navigation).
- **Prisma modular schema:** New models go in `packages/database/prisma/models/` as
  separate files, not directly in schema.prisma.

### Integration Points
- **New tab:** `apps/native/app/(main)/(tabs)/` — add workouts.tsx tab + update
  _layout.tsx tab configuration
- **New screens:** `apps/native/app/(main)/` — workout-builder.tsx,
  workout-detail.tsx, workout-execute.tsx
- **New Prisma models:** `packages/database/prisma/models/workout.prisma` — Workout,
  WorkoutExercise, WorkoutLog models; run `yarn workspace @repo/db db:generate` after
- **New Zod schemas:** `packages/common/src/schemas/workout.ts` — createWorkout,
  workoutExercise, workoutLog schemas
- **New API routes:** `apps/api/src/routes/workout.ts` — CRUD + start session
- **New hooks:** `apps/native/src/hooks/` — useWorkouts, useWorkoutDetail,
  useCreateWorkout, useUpdateWorkout, useDeleteWorkout, useStartWorkout

</code_context>

<specifics>
## Specific Ideas

- Exercise cards should feel visually richer than a plain list — "not boring like a
  settings menu." Deterministic background color per exercise (similar to how
  AvatarDisplay assigns colors from a palette) gives each card personality without
  needing images.
- Card grid + FAB pattern chosen for a fitness-app feel (similar to Nike Training Club,
  Hevy).
- Drag-and-drop reorder is important for the builder UX — users building multi-exercise
  workouts need to rearrange without delete/re-add friction.

</specifics>

<deferred>
## Deferred Ideas

- Exercise demo videos/GIFs — requires media storage per exercise; deferred until AI
  pipeline validated
- Search-while-typing debounce optimization — simple filter is fine for the small
  current catalog
- Workout templates / community shared workouts — social complexity, own phase
- "Record a set" CTA on the workout completion summary — Phase 5 bridge; deferred
  until Phase 5 exists

</deferred>

---

*Phase: 03-manual-workout-builder*
*Context gathered: 2026-05-01*
