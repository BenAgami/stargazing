# Phase 3: Manual Workout Builder - Research

**Researched:** 2026-05-01
**Domain:** React Native UI (drag-and-drop, steppers, tabs) + Express 5 REST CRUD + Prisma 7 schema modeling
**Confidence:** HIGH (all decisions locked in CONTEXT.md; stack is the same as Phase 2)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Exercise Catalog Display**
- D-01: 2-column card grid layout. Each card shows exercise name + Dynamic/Static Hold badge on solid background (no images in Phase 3).
- D-02: Name search (text input) AND type filter (Dynamic / Static Hold segmented control) both included.
- D-03: Card tap → opens exercise detail view (not direct add). Detail shows displayName, exerciseType, description. "Add to workout" button on detail screen.
- D-04: Catalog accessible two ways: (a) standalone Exercises tab/screen, (b) as picker inside workout builder.

**Workout Builder Flow**
- D-05: Name-first flow: user types workout name → lands on empty builder → taps "Add exercise."
- D-06: Sets/reps/rest configured inline on each exercise row (expandable inline, not modal).
- D-07: Drag-and-drop reordering of exercises within builder.
- D-08: Numeric stepper (+/−) controls for Sets, Reps, and Rest.
- D-09: Static Hold exercises auto-switch Reps stepper to a Duration stepper (seconds or mm:ss).

**Workout List & Navigation**
- D-10: New dedicated Workouts tab — third tab alongside Home and Settings.
- D-11: Workout list uses cards: workout name, exercise count, last modified date.
- D-12: Floating action button (FAB, bottom-right +) to create a new workout.
- D-13: Tapping workout card → Workout Detail screen (not direct start). Detail shows all exercises with config, plus "Start" and "Edit" buttons.
- D-14: Edit and Delete are both on Workout Detail screen. Delete requires confirmation prompt.

**Start Workout Scope**
- D-15: "Start" opens a step-through execution screen: current exercise name/config, set counter, auto-countdown rest timer, advance to next exercise.
- D-16: New WorkoutLog model (separate from WorkoutSession). Records which workout, when completed, and duration. No video/analysis fields.
- D-17: Rest timer is auto-countdown using restSeconds per exercise. User can "Skip rest."
- D-18: Completion: summary screen showing workout name, exercises completed, total duration. "Done" navigates back to workout list.

### Claude's Discretion
- Loading skeleton / empty states visual design
- Exact card background colors for exercise cards (adapt AvatarDisplay's deterministic palette)
- Animation details for drag-and-drop reordering
- Exact rest timer visual (ring, bar, or numeric countdown)
- Error state handling for failed API calls

### Deferred Ideas (OUT OF SCOPE)
- Exercise demo videos/GIFs
- Search-while-typing debounce optimization
- Workout templates / community shared workouts
- "Record a set" CTA on workout completion summary (Phase 5 bridge)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WKT-01 | User can browse the exercise catalog and view exercise details | Exercise API already exists (`GET /api/exercises`, `GET /api/exercises/:code`). Client needs useExercises/useExerciseDetail hooks + 2-column grid + detail screen. |
| WKT-02 | User can create a named workout by selecting exercises and setting sets, reps, and rest | New Workout + WorkoutExercise models needed. POST /api/workouts endpoint. Builder screen with expandable rows + numeric steppers + drag-and-drop. |
| WKT-03 | User can edit and delete their saved workouts | PATCH /api/workouts/:id (replace exercises array) + DELETE /api/workouts/:id. Edit flows through same builder screen. |
| WKT-04 | User can start a workout session from a saved workout | POST /api/workouts/:id/logs creates a WorkoutLog. Execution screen tracks elapsed time client-side. |
</phase_requirements>

---

## Summary

Phase 3 adds a complete workout management surface on top of existing Phase 2 infrastructure. The API layer requires three new Prisma models (Workout, WorkoutExercise, WorkoutLog), a full CRUD route set, and standard three-tier architecture. No new API patterns are needed — the existing exercise service is the template.

The most complex native work is the workout builder screen: drag-and-drop reordering (requires react-native-reanimated + react-native-gesture-handler, neither of which is currently installed), expandable inline rows with numeric stepper controls, and the Static Hold duration-stepper swap. The rest timer is pure client-side state — no API polling required.

A new Workouts tab must be added to the existing tab navigator. The current tabs use the JS `<Tabs>` API from Expo Router; the skill reference recommends `NativeTabs` from `expo-router/unstable-native-tabs`. Since the tabs layout migration was not done in Phase 2, Phase 3 should either add the new tab using the existing Tabs API (consistent with current code) or migrate the tab navigator to NativeTabs as part of this phase. The planner should make this explicit.

**Primary recommendation:** Build the API layer first (data model → routes → tests), then the native UI in screen order: Workouts tab → Workout list → Workout detail → Exercise catalog (read-only) → Workout builder → Workout execution. Install Reanimated + Gesture Handler as the first task in the native wave since drag-and-drop depends on them.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react-native-reanimated` | `~4.3.0` (Expo SDK 54 default) | Drag-and-drop animations, layout transitions | Required for Gesture Handler interop; Expo SDK 54 ships Reanimated 4 |
| `react-native-gesture-handler` | `~2.28.0` (Expo SDK 54 default) | Touch gesture recognition for drag | Required peer dep of draggable list and Reanimated gesture interop |
| `react-native-worklets` | `~0.8.x` | Reanimated 4 peer dep (worklet runtime) | Required when using Reanimated 4 |
| `react-native-draggable-flatlist` | `4.0.3` | Drag-and-drop sortable list | Battle-tested, works with Reanimated >= 2.8.0 (satisfied by v4), correct peer constraint |
| `@tanstack/react-query` v5 | already installed (`^5.96.2`) | Data fetching, mutations, cache invalidation | Already in codebase; all data hooks use this |
| Prisma 7 | already installed (`^7.3.0`) | ORM for new workout models | Existing pattern |
| Zod 4 | already installed (`^4.3.6`) | Schema validation for API boundaries | Existing pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@react-native-segmented-control/segmented-control` | (not currently installed) | Type filter (Dynamic / Static Hold) for catalog | Skill reference recommends this for non-navigational tabs/mode selection (D-02) |
| `expo-haptics` | (bundled with Expo SDK 54) | Haptic feedback on stepper +/− taps | iOS only; skill reference: use conditionally |

**Note on `@react-native-segmented-control/segmented-control`:** The `controls.md` skill reference shows this library for `SegmentedControl`. The project does NOT currently have it installed. Check if `@react-native-community/segmented-control` is available, or build a simple two-button toggle. The skill reference code imports from `@react-native-segmented-control/segmented-control`.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `react-native-draggable-flatlist` | `react-native-reorderable-list` | reorderable-list requires Reanimated >=3.12.0 (satisfied by v4), has a cleaner API but fewer community examples for Expo; draggable-flatlist is more battle-tested with the Expo ecosystem and has explicit Expo Snack examples |
| `react-native-draggable-flatlist` | Build from scratch (Gesture Handler + Reanimated) | More control but significantly more implementation work for a feature with a good existing library |
| `NativeTabs` for tab navigator migration | Keep existing `<Tabs>` | Adding a third tab to existing JS Tabs is a one-line change; NativeTabs migration is optional scope; both are valid |

**Installation:**
```bash
npx expo install react-native-reanimated react-native-worklets react-native-gesture-handler
yarn workspace native add react-native-draggable-flatlist
```

**Version verification (run before implementation):**
```bash
npm view react-native-draggable-flatlist version
npm view react-native-reanimated version
npm view react-native-gesture-handler version
```
Verified at research time: reanimated 4.3.0, gesture-handler 2.31.1, draggable-flatlist 4.0.3.

---

## Architecture Patterns

### Recommended Project Structure (new files only)

```
packages/database/prisma/models/
  workout.prisma              # Workout, WorkoutExercise, WorkoutLog models

packages/common/src/
  validations/workout.ts      # createWorkout, updateWorkout, workoutLog Zod schemas
  index.ts                    # re-export new schemas

apps/api/src/
  routes/workout.ts           # CRUD + start-workout endpoints
  controllers/workout.ts      # Thin handlers, asyncWrapper throughout
  services/workoutService.ts  # All Prisma calls; no business logic in controller

apps/api/tests/integration/
  workouts/
    createWorkout.test.ts
    listWorkouts.test.ts
    getWorkout.test.ts
    updateWorkout.test.ts
    deleteWorkout.test.ts
    startWorkout.test.ts
  helpers/db/workoutHelper.ts
  helpers/requestSender/workoutsRequests.ts

apps/native/app/(main)/
  (tabs)/workouts.tsx          # Workout list screen (new tab)
  workout-builder.tsx          # Create/edit builder screen
  workout-detail.tsx           # Detail + Start/Edit/Delete
  workout-execute.tsx          # Step-through execution screen
  exercise-catalog.tsx         # Standalone exercise browse screen (also used as picker)
  exercise-detail.tsx          # Detail view with "Add to workout" button

apps/native/src/
  hooks/queries/useWorkouts.ts
  hooks/queries/useWorkoutDetail.ts
  hooks/mutations/useCreateWorkout.ts
  hooks/mutations/useUpdateWorkout.ts
  hooks/mutations/useDeleteWorkout.ts
  hooks/mutations/useStartWorkout.ts
  hooks/queries/useExercises.ts      # (may already exist from Phase 2 remnants)
  services/workoutService.ts
  api/keys.ts                         # add workoutKeys constant
```

### Pattern 1: Prisma Model — Workout with ordered exercises

The WorkoutExercise join model carries ordering via a `position` integer (not auto-increment; set by the client based on the drag order). When reordering, the client sends the full exercises array in new order; the service replaces all WorkoutExercise records atomically.

```prisma
// packages/database/prisma/models/workout.prisma
model Workout {
  id          Int      @id @default(autoincrement())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      Int      @map("user_id")
  name        String   @db.VarChar(100)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  exercises   WorkoutExercise[]
  logs        WorkoutLog[]

  @@index([userId, updatedAt(sort: Desc)], map: "idx_workouts_user_updated_at")
  @@map("workouts")
}

model WorkoutExercise {
  id            Int      @id @default(autoincrement())
  workout       Workout  @relation(fields: [workoutId], references: [id], onDelete: Cascade)
  workoutId     Int      @map("workout_id")
  exercise      Exercise @relation(fields: [exerciseId], references: [id])
  exerciseId    Int      @map("exercise_id")
  position      Int                          // 0-based ordering; re-set on each update
  sets          Int      @default(3)
  reps          Int?                         // null for Static Hold
  durationSecs  Int?     @map("duration_secs") // null for Dynamic
  restSecs      Int      @default(60) @map("rest_secs")
  createdAt     DateTime @default(now()) @map("created_at")

  @@unique([workoutId, position])
  @@index([workoutId], map: "idx_workout_exercises_workout_id")
  @@map("workout_exercises")
}

model WorkoutLog {
  id              Int      @id @default(autoincrement())
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId          Int      @map("user_id")
  workout         Workout  @relation(fields: [workoutId], references: [id])
  workoutId       Int      @map("workout_id")
  completedAt     DateTime @default(now()) @map("completed_at")
  durationSecs    Int      @map("duration_secs")
  createdAt       DateTime @default(now()) @map("created_at")

  @@index([userId, completedAt(sort: Desc)], map: "idx_workout_logs_user_completed")
  @@map("workout_logs")
}
```

**Important:** The `Exercise` model must gain a `workoutExercises WorkoutExercise[]` relation field. Add it to `exercise.prisma`.
The `User` model must gain `workouts Workout[]` and `workoutLogs WorkoutLog[]` relation fields. Add to `user.prisma`.

### Pattern 2: API Route — Workout CRUD

```typescript
// apps/api/src/routes/workout.ts
import { Router } from "express";
import authenticateToken from "../middlewares/authentication";
import validateSchema from "../middlewares/validateSchema";
import { createWorkoutSchema, updateWorkoutSchema } from "@repo/common";
import {
  listWorkouts, getWorkout, createWorkout,
  updateWorkout, deleteWorkout, startWorkout
} from "../controllers/workout";

const router: Router = Router();

// All workout routes require auth
router.use(authenticateToken);

router.get("/", listWorkouts);
router.post("/", validateSchema(z.object({ body: createWorkoutSchema })), createWorkout);
router.get("/:id", getWorkout);
router.patch("/:id", validateSchema(z.object({ params: workoutIdSchema, body: updateWorkoutSchema })), updateWorkout);
router.delete("/:id", deleteWorkout);
router.post("/:id/logs", validateSchema(z.object({ params: workoutIdSchema, body: workoutLogSchema })), startWorkout);

export default router;
```

Register in `apps/api/src/routes/index.ts`:
```typescript
router.use("/workouts", workoutRoutes);
```

### Pattern 3: Workout Service — atomic exercise replacement on update

```typescript
// apps/api/src/services/workoutService.ts  (sketch)
async updateWorkout(userId: number, workoutId: number, input: UpdateWorkoutInput) {
  // Verify ownership first
  const workout = await this.prisma.workout.findFirst({
    where: { id: workoutId, userId },
  });
  if (!workout) throw new NotFoundError("Workout not found");

  return this.prisma.$transaction(async (tx) => {
    if (input.name) {
      await tx.workout.update({ where: { id: workoutId }, data: { name: input.name } });
    }
    if (input.exercises) {
      // Delete all and re-insert in correct position order
      await tx.workoutExercise.deleteMany({ where: { workoutId } });
      await tx.workoutExercise.createMany({
        data: input.exercises.map((ex, idx) => ({
          workoutId,
          exerciseId: ex.exerciseId,
          position: idx,
          sets: ex.sets,
          reps: ex.reps ?? null,
          durationSecs: ex.durationSecs ?? null,
          restSecs: ex.restSecs,
        })),
      });
    }
    return tx.workout.findUnique({
      where: { id: workoutId },
      include: { exercises: { include: { exercise: true }, orderBy: { position: "asc" } } },
    });
  });
}
```

### Pattern 4: Drag-and-drop with react-native-draggable-flatlist

```typescript
// Source: https://github.com/computerjazz/react-native-draggable-flatlist
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Root of the screen must be wrapped:
<GestureHandlerRootView style={{ flex: 1 }}>
  <DraggableFlatList
    data={exercises}
    keyExtractor={(item) => item.id.toString()}
    onDragEnd={({ data }) => setExercises(data)}
    renderItem={({ item, drag, isActive }: RenderItemParams<WorkoutExerciseRow>) => (
      <ScaleDecorator>
        <ExerciseBuilderRow item={item} onDragStart={drag} isActive={isActive} />
      </ScaleDecorator>
    )}
  />
</GestureHandlerRootView>
```

**Critical:** `GestureHandlerRootView` must wrap the screen, not just the list. If the app root already wraps with it (recommended), individual screens don't need it.

### Pattern 5: Numeric stepper control

The skill reference documents a React Native `Stepper` component, but it is iOS-only and not universally available. Build a simple custom stepper: two `Pressable` components (`−` / `+`) flanking a `Text` counter. This is already the pattern the CONTEXT.md describes (D-08), and it avoids a platform gap.

```typescript
// CustomStepper.tsx
interface StepperProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
}

// Use tabular-nums for counter alignment per skill reference
<Text style={{ fontVariant: ["tabular-nums"] }}>{value}</Text>
```

### Pattern 6: TanStack Query keys for workouts

Follow the `userKeys` pattern from `apps/native/src/api/keys.ts`:

```typescript
// Add to apps/native/src/api/keys.ts
export const workoutKeys = {
  all: ["workouts"] as const,
  lists: () => ["workouts", "list"] as const,
  detail: (id: number) => ["workouts", id] as const,
  logs: (id: number) => ["workouts", id, "logs"] as const,
};

export const exerciseKeys = {
  all: ["exercises"] as const,
  list: (params?: { search?: string; type?: string }) =>
    ["exercises", "list", params ?? {}] as const,
  detail: (code: string) => ["exercises", code] as const,
};
```

### Pattern 7: useFocusEffect for workout list

Per Phase 2 lesson in CONTEXT.md: use `useFocusEffect` on screens that need fresh data after back-navigation. The workout list must use `useFocusEffect` to trigger a query refetch when returning from builder or detail screens.

```typescript
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

useFocusEffect(
  useCallback(() => {
    queryClient.invalidateQueries({ queryKey: workoutKeys.lists() });
  }, [queryClient])
);
```

### Anti-Patterns to Avoid
- **Storing exercise order as a timestamp or UUID sort** — use the explicit `position` integer; timestamps introduce ordering ambiguity
- **Modal for exercise config** — locked decision D-06 mandates inline expandable rows, not bottom sheets or modals
- **Starting the rest timer in a useEffect** — use `useRef` for interval ID + `useState` for countdown; clean up in the effect return
- **Updating workout exercises with individual PATCH calls per row** — do it in a single PATCH with the full exercises array; backend replaces atomically
- **Calling apiClient directly from screens** — service layer only (native-code-standards Rule 2)
- **Using `any` on Prisma transaction callback** — type it as `PrismaClient` or the transaction variant
- **Reading `process.env` directly in the API** — add new vars to `apps/api/src/config/env.ts` schema

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag-and-drop sortable list | Custom pan-gesture tracking with position math | `react-native-draggable-flatlist` | Cell-swap logic, scroll-while-dragging, active-item decoration — all solved; building from scratch takes 2-3x longer and misses edge cases |
| Segmented control type filter | Two styled Pressable buttons | `@react-native-segmented-control/segmented-control` (skill ref) or simple toggle | Native control has correct accessibility, haptics, dark mode adaptation |
| Countdown timer | `setInterval` in `useEffect` inside a component | Custom `useCountdown` hook with `useRef` for interval | Prevents stale closure bugs and leaked intervals on unmount; isolate timer logic in a hook |
| Zod schema inference to TypeScript types | Manual type definitions | `z.infer<typeof schema>` | Types stay in sync with validation; defined once in `@repo/common` |

**Key insight:** The workout builder's drag-and-drop and the rest-timer countdown are the two areas most likely to produce subtle bugs if hand-rolled. Use the library for DnD and a dedicated hook for the timer.

---

## Common Pitfalls

### Pitfall 1: GestureHandlerRootView not at the correct level
**What goes wrong:** Gestures (drag) are silently swallowed; items appear to not respond to drag at all.
**Why it happens:** `react-native-gesture-handler` requires `GestureHandlerRootView` as an ancestor. If the app's root layout doesn't include it, each screen that uses gestures must wrap its content.
**How to avoid:** Add `GestureHandlerRootView` to the root `_layout.tsx` once so all screens inherit it. Verify by checking `apps/native/app/_layout.tsx` or the outermost layout.
**Warning signs:** Drag gesture starts but items don't move; no errors thrown.

### Pitfall 2: Reanimated + Gesture Handler version mismatch
**What goes wrong:** Build error or runtime crash referencing worklets or Reanimated plugin.
**Why it happens:** Reanimated 4 introduced `react-native-worklets` as a mandatory peer dep. Expo SDK 54 targets Reanimated 4.x. If installed with plain `yarn add` instead of `npx expo install`, the version may not match what Expo SDK 54 expects.
**How to avoid:** Always use `npx expo install react-native-reanimated react-native-worklets react-native-gesture-handler` — Expo resolves the compatible version. Confirm `babel-preset-expo` picks up the Reanimated plugin automatically (no manual babel.config.js changes needed).
**Warning signs:** `[Reanimated] Tried to synchronously call a non-worklet function` error at runtime.

### Pitfall 3: Position uniqueness constraint violated on workout exercise update
**What goes wrong:** Prisma throws a unique constraint error on `(workoutId, position)` during the delete+recreate transaction.
**Why it happens:** If the transaction partially executes (delete + recreate) and a crash occurs mid-transaction, no issue — Postgres rolls back. The constraint is only a problem if code attempts to update positions in place without deleting first.
**How to avoid:** Use the delete-all + createMany pattern inside a `$transaction`. Never attempt in-place position swaps.
**Warning signs:** `P2002 unique constraint failed on workout_exercises` during update.

### Pitfall 4: Stale workout list after navigation back
**What goes wrong:** User creates a workout, presses back, sees old list without the new entry.
**Why it happens:** Expo Router stack navigation does not remount the previous screen; a `useEffect([], [])` query only fires on mount.
**How to avoid:** Use `useFocusEffect` on the workout list screen to invalidate `workoutKeys.lists()`. This is the same lesson from Phase 2 (`useFocusEffect not useEffect` — recorded in STATE.md).
**Warning signs:** User creates workout, navigates back, new workout is missing until manual refresh.

### Pitfall 5: Duration stepper for Static Hold exercises — value format confusion
**What goes wrong:** Stepper stores seconds as a number but display shows mm:ss; off-by-one in formatting or parsing causes wrong values to be sent to the API.
**Why it happens:** The UI formats `90` as `1:30` but the backing state must store `90` (integer seconds). If display parsing and state are not kept separate, edited values drift.
**How to avoid:** Store all durations as plain integers (seconds) in state and in the API. The mm:ss display is a pure formatting layer: `const display = Math.floor(val/60) + ':' + String(val%60).padStart(2,'0')`. The stepper steps through integers; the display converts.
**Warning signs:** User sets 1:30, API receives 130 (parsing error) or 1 (type coercion).

### Pitfall 6: Workout ownership — missing user ID scoping on queries
**What goes wrong:** Users can read, edit, or delete other users' workouts.
**Why it happens:** Omitting `userId` from Prisma `where` clause when looking up by workout ID.
**How to avoid:** Every service method that fetches a workout by ID must include `where: { id: workoutId, userId }`. Throw `NotFoundError` (not `ForbiddenError`) on miss — consistent with existing service pattern and avoids leaking ID existence.
**Warning signs:** Postman can fetch workout IDs belonging to other users.

### Pitfall 7: Missing `exercises` relation field on Exercise and User models
**What goes wrong:** Prisma migration fails or generates a schema with missing relation.
**Why it happens:** Adding `WorkoutExercise` model without updating the `Exercise.workoutExercises` and `User.workouts` relation fields in their respective `.prisma` files.
**How to avoid:** After writing `workout.prisma`, explicitly add back-relation fields to `exercise.prisma` and `user.prisma` before running `db:generate`.
**Warning signs:** `yarn workspace @repo/db db:generate` errors: `Error validating field 'exercises' in model 'Exercise'`.

---

## Code Examples

### Zod schema for createWorkout (packages/common)

```typescript
// packages/common/src/validations/workout.ts
import { z } from "zod";

const workoutExerciseSchema = z.object({
  exerciseId: z.number().int().positive(),
  sets: z.number().int().min(1).max(99),
  reps: z.number().int().min(1).max(999).nullable().optional(),
  durationSecs: z.number().int().min(1).max(3600).nullable().optional(),
  restSecs: z.number().int().min(0).max(600),
});

export const createWorkoutSchema = z.object({
  name: z.string().trim().min(1).max(100),
  exercises: z.array(workoutExerciseSchema).min(1).max(50),
});

export const updateWorkoutSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  exercises: z.array(workoutExerciseSchema).min(1).max(50).optional(),
});

export const workoutLogSchema = z.object({
  durationSecs: z.number().int().min(0),
  completedAt: z.iso.datetime().optional(),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
export type WorkoutLogInput = z.infer<typeof workoutLogSchema>;
```

### Countdown hook for rest timer

```typescript
// apps/native/src/hooks/useCountdown.ts
import { useState, useEffect, useRef, useCallback } from "react";

export const useCountdown = (initialSeconds: number) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const skip = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(0);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  return { secondsLeft, isRunning, start, skip };
};
```

### Deterministic card background color (adapt AvatarDisplay pattern)

```typescript
// Adapt from apps/native/src/components/AvatarDisplay
const CARD_PALETTE = [
  "#E57373", "#F06292", "#BA68C8", "#7986CB",
  "#4FC3F7", "#4DB6AC", "#81C784", "#FFD54F",
  "#FF8A65", "#A1887F",
];

export const getExerciseCardColor = (exerciseCode: string): string => {
  let hash = 0;
  for (let i = 0; i < exerciseCode.length; i++) {
    hash = exerciseCode.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CARD_PALETTE[Math.abs(hash) % CARD_PALETTE.length];
};
```

### Adding the Workouts tab (existing JS Tabs API)

```typescript
// apps/native/app/(main)/(tabs)/_layout.tsx — add after existing Settings tab
<Tabs.Screen
  name="workouts"
  options={{
    title: "Workouts",
    tabBarIcon: ({ color }) => (
      <Ionicons name="barbell-outline" size={24} color={color} />
    ),
  }}
/>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Reanimated 2/3 Babel plugin in babel.config.js | Auto-configured via babel-preset-expo; no manual config | Expo SDK 54 / Reanimated 4 | Don't add `react-native-reanimated/plugin` to babel.config.js — it now lives in worklets |
| Reanimated `useAnimatedGestureHandler` (deprecated in Rean. 3) | `Gesture.Pan().onUpdate()` via `GestureDetector` | Reanimated 3+ | DraggableFlatList handles this internally; only relevant if building gestures from scratch |
| Prisma schema as single schema.prisma | Modular schema: `schema.prisma` + `prisma/models/*.prisma` | Phase 2 established | All new models go in separate files in `packages/database/prisma/models/` |

**Deprecated/outdated:**
- `react-native-reanimated/plugin` in babel.config: replaced by `react-native-worklets/plugin`; babel-preset-expo configures this automatically when both packages are installed

---

## Open Questions

1. **Tab navigator migration: JS Tabs → NativeTabs**
   - What we know: Current `_layout.tsx` uses `<Tabs>` (JS tabs). Skill reference recommends `NativeTabs` for best iOS experience (SDK 54+).
   - What's unclear: Whether to migrate the tab navigator as part of Phase 3 or leave it for a future cleanup phase.
   - Recommendation: Add the Workouts tab using the existing `<Tabs>` API to keep scope minimal. Document NativeTabs migration as a separate cleanup task.

2. **Exercise catalog as router screen vs. modal**
   - What we know: D-04 says catalog is accessible two ways: standalone tab and as picker inside builder. The screen is the same component.
   - What's unclear: How the picker variant is presented — pushed onto the workout builder's stack or presented as a formSheet?
   - Recommendation: Push as a stack screen from the builder. Pass a callback or use React Query invalidation to signal selection back. Avoids complex modal state passing.

3. **`@react-native-segmented-control/segmented-control` availability**
   - What we know: Skills reference shows this package. It's not in the current package.json.
   - What's unclear: Whether the managed Expo workflow permits it without a custom build.
   - Recommendation: Install with `npx expo install @react-native-segmented-control/segmented-control`. It works in Expo Go and managed workflow. If unavailable, a two-`Pressable` toggle achieves the same result.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.17 |
| Config file | `apps/api/vitest.config.ts` |
| Quick run command | `yarn workspace api test --reporter=verbose --testPathPattern=workouts` |
| Full suite command | `yarn workspace api test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WKT-01 | GET /api/exercises returns paginated list | integration | `yarn workspace api test --testPathPattern=listExercises` | YES (existing) |
| WKT-01 | GET /api/exercises/:code returns detail | integration | `yarn workspace api test --testPathPattern=getExerciseByCode` | YES (existing) |
| WKT-02 | POST /api/workouts creates workout with exercises | integration | `yarn workspace api test --testPathPattern=createWorkout` | NO — Wave 0 |
| WKT-02 | POST /api/workouts returns 401 without auth | integration | `yarn workspace api test --testPathPattern=createWorkout` | NO — Wave 0 |
| WKT-02 | POST /api/workouts returns 400 for invalid body | integration | `yarn workspace api test --testPathPattern=createWorkout` | NO — Wave 0 |
| WKT-03 | PATCH /api/workouts/:id updates name and exercises | integration | `yarn workspace api test --testPathPattern=updateWorkout` | NO — Wave 0 |
| WKT-03 | DELETE /api/workouts/:id removes workout | integration | `yarn workspace api test --testPathPattern=deleteWorkout` | NO — Wave 0 |
| WKT-03 | PATCH/DELETE return 404 for another user's workout | integration | `yarn workspace api test --testPathPattern=updateWorkout` | NO — Wave 0 |
| WKT-04 | POST /api/workouts/:id/logs creates WorkoutLog | integration | `yarn workspace api test --testPathPattern=startWorkout` | NO — Wave 0 |
| WKT-04 | GET /api/workouts/:id returns exercises in position order | integration | `yarn workspace api test --testPathPattern=getWorkout` | NO — Wave 0 |

### Sampling Rate
- **Per task commit:** `yarn workspace api test --testPathPattern=workouts`
- **Per wave merge:** `yarn workspace api test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `apps/api/tests/integration/workouts/createWorkout.test.ts` — covers WKT-02
- [ ] `apps/api/tests/integration/workouts/listWorkouts.test.ts` — covers WKT-02 (list owned workouts)
- [ ] `apps/api/tests/integration/workouts/getWorkout.test.ts` — covers WKT-01 detail + WKT-04 (position ordering)
- [ ] `apps/api/tests/integration/workouts/updateWorkout.test.ts` — covers WKT-03 edit
- [ ] `apps/api/tests/integration/workouts/deleteWorkout.test.ts` — covers WKT-03 delete
- [ ] `apps/api/tests/integration/workouts/startWorkout.test.ts` — covers WKT-04 log creation
- [ ] `apps/api/tests/integration/helpers/db/workoutHelper.ts` — shared fixture for creating test workouts
- [ ] `apps/api/tests/integration/helpers/requestSender/workoutsRequests.ts` — request helper
- [ ] `apps/api/tests/integration/helpers/testSetup.ts` — update `cleanupDatabase` to include `workoutLog`, `workoutExercise`, `workout` deletes (in dependency order)

---

## Sources

### Primary (HIGH confidence)
- Codebase direct inspection — exercise service, route, controller patterns; existing test helpers; Prisma model files; package.json versions
- `.claude/skills/native-code-standards/SKILL.md` — TanStack Query patterns, service layer rules, hook conventions
- `.claude/skills/building-native-ui/references/animations.md` — Reanimated v4 gesture + animation patterns
- `.claude/skills/building-native-ui/references/controls.md` — SegmentedControl, Stepper patterns
- `.claude/skills/building-native-ui/references/tabs.md` — NativeTabs SDK 54 API, JS Tabs migration
- `.claude/skills/native-data-fetching/SKILL.md` — React Query patterns confirmed

### Secondary (MEDIUM confidence)
- Expo SDK 54 changelog and docs (via WebSearch + WebFetch): Reanimated 4.x is the SDK 54 default; `npx expo install` resolves correct versions; babel plugin auto-configured via babel-preset-expo
- npm registry (via Bash): react-native-draggable-flatlist 4.0.3, peer dep reanimated >= 2.8.0 (satisfied by 4.x), gesture-handler >= 2.0.0
- npm registry: react-native-reanimated 4.3.0 peer dep `react-native-worklets ~0.8.x`

### Tertiary (LOW confidence — flag for validation)
- react-native-draggable-flatlist Reanimated 4 compatibility: peer dep constraint allows it (>= 2.8.0) but GitHub issues from 2024-2025 show historic compatibility problems with major Reanimated version bumps. **Validate by installing and running a minimal drag example before committing to the library.** Alternative is `react-native-reorderable-list` (>= 3.12.0 peer dep, satisfied by 4.x).

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions confirmed from npm registry; Expo SDK 54 context confirmed via docs
- Architecture: HIGH — directly mirrors existing exercise route/controller/service pattern in codebase
- Drag-and-drop library choice: MEDIUM — peer dep satisfied but Reanimated 4 + draggable-flatlist combination has not been tested in this specific project; validate early
- Pitfalls: HIGH — derived from existing codebase patterns, Phase 2 decisions in STATE.md, and known Prisma/Reanimated behaviors

**Research date:** 2026-05-01
**Valid until:** 2026-06-01 (React Native ecosystem; 30-day window)
