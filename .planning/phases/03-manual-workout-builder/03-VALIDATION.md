---
phase: 3
slug: manual-workout-builder
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-01
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.17 |
| **Config file** | `apps/api/vitest.config.ts` |
| **Quick run command** | `yarn workspace api test --reporter=verbose --testPathPattern=workouts` |
| **Full suite command** | `yarn workspace api test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `yarn workspace api test --reporter=verbose --testPathPattern=workouts`
- **After every plan wave:** Run `yarn workspace api test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 3-01-01 | 01 | 0 | WKT-02 | integration | `yarn workspace api test --testPathPattern=createWorkout` | ❌ W0 | ⬜ pending |
| 3-01-02 | 01 | 0 | WKT-02 | integration | `yarn workspace api test --testPathPattern=listWorkouts` | ❌ W0 | ⬜ pending |
| 3-01-03 | 01 | 0 | WKT-04 | integration | `yarn workspace api test --testPathPattern=getWorkout` | ❌ W0 | ⬜ pending |
| 3-01-04 | 01 | 0 | WKT-03 | integration | `yarn workspace api test --testPathPattern=updateWorkout` | ❌ W0 | ⬜ pending |
| 3-01-05 | 01 | 0 | WKT-03 | integration | `yarn workspace api test --testPathPattern=deleteWorkout` | ❌ W0 | ⬜ pending |
| 3-01-06 | 01 | 0 | WKT-04 | integration | `yarn workspace api test --testPathPattern=startWorkout` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `apps/api/tests/integration/workouts/createWorkout.test.ts` — stubs for WKT-02
- [ ] `apps/api/tests/integration/workouts/listWorkouts.test.ts` — stubs for WKT-02
- [ ] `apps/api/tests/integration/workouts/getWorkout.test.ts` — stubs for WKT-01 detail + WKT-04
- [ ] `apps/api/tests/integration/workouts/updateWorkout.test.ts` — stubs for WKT-03 edit
- [ ] `apps/api/tests/integration/workouts/deleteWorkout.test.ts` — stubs for WKT-03 delete
- [ ] `apps/api/tests/integration/workouts/startWorkout.test.ts` — stubs for WKT-04 log creation
- [ ] `apps/api/tests/integration/helpers/db/workoutHelper.ts` — shared fixture for creating test workouts
- [ ] `apps/api/tests/integration/helpers/requestSender/workoutsRequests.ts` — request helper
- [ ] Update `apps/api/tests/integration/helpers/testSetup.ts` — add `workoutLog`, `workoutExercise`, `workout` deletes to `cleanupDatabase` (in dependency order)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Exercise card 2-column grid renders correctly | WKT-01 | UI layout, no integration test harness for native | Open Exercises tab, verify 2-column grid with name + badge per card |
| Drag-and-drop reordering works in workout builder | WKT-02 | Gesture interaction, cannot be automated in integration tests | Open builder, long-press exercise row, drag to new position, verify order persists on save |
| Inline exercise row expansion (sets/reps/rest steppers) | WKT-02 | Native UI interaction | Tap exercise row in builder, verify steppers appear inline (not modal), increment/decrement all fields |
| Static Hold auto-switches Reps to Duration stepper | WKT-02 | Conditional UI logic | Add a Static Hold exercise to builder, verify Reps stepper becomes Duration (mm:ss) |
| Rest timer auto-countdown + Skip rest | WKT-04 | Time-dependent native UI | Start workout, complete a set, verify timer counts down, tap Skip rest to advance early |
| Workout completion summary screen | WKT-04 | Native UI | Complete a full workout, verify summary shows name + exercises completed + total duration |
| Delete workout requires confirmation prompt | WKT-03 | Native UI interaction | Tap Delete on workout detail, verify confirmation dialog appears before deletion |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
