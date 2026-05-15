---
status: testing
phase: 03-manual-workout-builder
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md, 03-04-SUMMARY.md, 03-05-SUMMARY.md, 03-06-SUMMARY.md, 03-07-SUMMARY.md, 03-08-SUMMARY.md]
started: 2026-05-15T00:00:00Z
updated: 2026-05-15T00:00:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files).
  Start the API from scratch (e.g. yarn workspace api dev). Server boots without errors,
  the workout migration runs cleanly, and a basic authenticated API call (e.g. GET /api/workouts)
  returns a valid JSON response (200 with data array, not a crash or 500).
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the API from scratch (e.g. yarn workspace api dev). Server boots without errors, the workout migration runs cleanly, and a basic authenticated API call (e.g. GET /api/workouts) returns a valid JSON response (200 with data array, not a crash or 500).
result: [pending]

### 2. Workouts Tab
expected: The bottom tab bar has 3 tabs — Home, Workouts (barbell icon), Settings. Tapping Workouts shows a list screen. If no workouts exist, an empty state or blank list is shown. A "+" FAB button is visible in the bottom-right corner.
result: [pending]

### 3. Exercise Catalog Browse
expected: From the workout builder screen (or wherever the catalog is accessible), navigate to the exercise catalog. A 2-column grid of colored exercise cards loads, each showing the exercise name and a Dynamic/Static Hold badge. The screen has a search bar at the top and an All / Dynamic / Static Hold toggle below it.
result: [pending]

### 4. Exercise Catalog Search and Filter
expected: With the exercise catalog open, type text into the search bar — the grid filters to matching exercises in real time. Tap "Static Hold" in the toggle — only Static Hold exercises are shown. Tap "All" — the full list returns. Filters work independently or combined.
result: [pending]

### 5. Exercise Detail Screen
expected: Tap any exercise card in the catalog. A detail screen opens showing the exercise display name, a type badge (Dynamic or Static Hold), and a description. A "Done" button is visible (in standalone mode) or "Add to workout" (in picker mode from the builder).
result: [pending]

### 6. Create a Workout (with picker round-trip)
expected: Tap the "+" FAB on the Workouts tab. The workout builder opens with an empty name field and no exercises. Type a name. Tap "+ Add exercise" — the exercise catalog opens in picker mode. Browse, tap an exercise card, then tap "Add to workout" on the detail screen. You return to the builder with that exercise in the list. Set sets and reps (or duration for a Static Hold exercise) using the +/- steppers. Tap "Save". The new workout appears in the Workouts list.
result: [pending]

### 7. Edit a Workout
expected: Tap a workout card to open its detail screen (shows name, exercise rows with sets/reps/duration, Start/Edit/Delete buttons). Tap "Edit". The builder opens pre-filled with the workout's current name and exercises. Change the name or adjust an exercise's sets/reps. Tap "Save". The detail screen reflects the updated values.
result: [pending]

### 8. Reorder Exercises in Builder
expected: In the workout builder with 2 or more exercises, long-press an exercise row — the row becomes draggable. Drag it above or below another exercise and release. The order updates immediately. Tap Save. When you reopen the workout detail or builder, the new order is preserved.
result: [pending]

### 9. Delete a Workout
expected: From the workout detail screen, tap "Delete". A native confirmation dialog appears with destructive (red) styling asking you to confirm. Confirm the deletion. The workout is removed from the Workouts list immediately, and the detail screen dismisses.
result: [pending]

### 10. Execute a Workout + Rest Timer
expected: From a workout detail screen, tap "Start". The execution screen opens showing the first exercise name, current set (e.g. "Set 1 of 3"), and the reps or hold duration. Tap "Complete Set" — if that exercise has rest time, a countdown rest timer appears (e.g. "60s") that counts down in real time. A "Skip rest" button is visible and tapping it immediately advances to the next set or exercise. Work through all sets of all exercises this way.
result: [pending]

### 11. Workout Completion Summary + Done
expected: After completing all sets of all exercises in the execution screen, the screen transitions to a completion summary showing the workout name, number of exercises completed, and total elapsed time. Tapping "Done" navigates back to the Workouts tab with no error shown.
result: [pending]

## Summary

total: 11
passed: 0
issues: 0
pending: 11
skipped: 0
blocked: 0

## Gaps

[none yet]
