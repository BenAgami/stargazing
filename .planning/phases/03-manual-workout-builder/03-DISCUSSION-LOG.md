# Phase 3: Manual Workout Builder - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-01
**Phase:** 03-manual-workout-builder
**Areas discussed:** Exercise catalog UX, Workout builder flow, Workout list & navigation, Start workout scope

---

## Exercise Catalog UX

| Option | Description | Selected |
|--------|-------------|----------|
| Simple list | Vertical list rows: name + type badge | |
| Card grid | 2-column grid of cards with name + badge | ✓ |
| Grouped list | Section headers by exercise type | |

**User's choice:** Card grid — user noted the simple list "sounds boring" and wanted the catalog to feel like a fitness app, not a settings menu.

| Option | Description | Selected |
|--------|-------------|----------|
| No search/filter | Plain grid only | |
| Filter by type only | Segmented control for Dynamic/Static Hold | |
| Both name search + type filter | Text input + type segmented control | ✓ |

**User's choice:** Both — user sees value for future catalog growth, wants it now rather than later.

| Option | Description | Selected |
|--------|-------------|----------|
| Name, type, description | Data from existing Exercise model | ✓ |
| Name, type, description + video demo | Requires media storage — out of scope | |
| Skip detail view | Add directly from grid | |

**User's choice:** Name, type, description on a detail view. "Add to workout" button on the detail screen.

| Option | Description | Selected |
|--------|-------------|----------|
| Only inside workout builder | Catalog is a picker, no standalone screen | |
| Standalone tab/screen + inside builder | Accessible any time + inside builder | ✓ |

**User's choice:** Standalone + inside builder — exercises are a first-class concept worth standalone browsing.

| Option | Description | Selected |
|--------|-------------|----------|
| Open detail view | Tap card → detail with "Add to workout" | ✓ |
| Direct add to workout | Tap card → immediately added | |

**User's choice:** Detail view on tap — gives context before adding.

---

## Workout Builder Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Name first, then add exercises | Type name → empty builder → add exercises | ✓ |
| Add exercises first, name at save | Pick exercises → name on save | |

**User's choice:** Name first — clearest mental model.

| Option | Description | Selected |
|--------|-------------|----------|
| Inline in the builder | Expandable rows per exercise | ✓ |
| Separate configure step | Modal/bottom sheet per exercise | |

**User's choice:** Inline — edit everything on one screen without navigating away.

| Option | Description | Selected |
|--------|-------------|----------|
| Drag-and-drop | Long-press to grab and drag | ✓ |
| Up/Down arrows | ↑ ↓ buttons per row | |
| No reordering in Phase 3 | Delete and re-add only | |

**User's choice:** Drag-and-drop — native feel, important for multi-exercise workout building.

| Option | Description | Selected |
|--------|-------------|----------|
| Numeric stepper (+/−) | Tap +/− to increment/decrement | ✓ |
| Text input (keyboard) | Standard number keyboard | |

**User's choice:** Numeric stepper — avoids keyboard popup.

**Follow-up — Static Hold exercises:**

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-switch to Duration stepper | Reps → Duration based on exerciseType | ✓ |
| Always show Reps | User interprets seconds themselves | |
| Let me decide later | Claude's discretion | |

**User's choice:** Auto-switch — correct behavior, cleaner UX.

---

## Workout List & Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| New Workouts tab | Third tab alongside Home and Settings | ✓ |
| Section on Home screen | Workouts buried below other home content | |

**User's choice:** New Workouts tab — first-class destination.

| Option | Description | Selected |
|--------|-------------|----------|
| Cards — name + exercise count + last modified | Card layout consistent with exercise grid | ✓ |
| Compact rows | Dense list rows | |

**User's choice:** Cards.

| Option | Description | Selected |
|--------|-------------|----------|
| FAB (floating action button) | + button bottom-right | ✓ |
| Header button | '+ New Workout' in top-right of header | |
| Empty state CTA only | Only shows create button when list empty | |

**User's choice:** FAB — standard mobile pattern.

| Option | Description | Selected |
|--------|-------------|----------|
| Detail view first | Tap card → detail with Start/Edit buttons | ✓ |
| Directly starts the workout | Tap card → immediately starts | |

**User's choice:** Detail view — no accidental starts.

| Option | Description | Selected |
|--------|-------------|----------|
| From the detail screen | Edit button + Delete button with confirmation | ✓ |
| Swipe-to-delete on list + edit from detail | Gesture-based delete | |
| Long-press context menu | Action sheet on long-press | |

**User's choice:** Both Edit and Delete on the detail screen. Delete has a confirmation prompt.

---

## Start Workout Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Step-through execution screen | Exercise-by-exercise with rest timer | ✓ |
| Just create a session record + confirm | Minimal — record created, success shown | |

**User's choice:** Step-through execution — full workout experience.

| Option | Description | Selected |
|--------|-------------|----------|
| New WorkoutLog model | Separate from WorkoutSession (video/analysis) | ✓ |
| Reuse WorkoutSession | Create one session per exercise on finish | |

**User's choice:** New WorkoutLog model — keeps video analysis pipeline clean for Phase 5.

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-countdown rest timer | Timer counts down, user can skip | ✓ |
| Manual 'Done resting' button | Display rest time, user taps when ready | |
| No rest management | User watches own rest time | |

**User's choice:** Auto-countdown with skip option.

| Option | Description | Selected |
|--------|-------------|----------|
| Summary screen — name, exercises, duration | Completion screen before returning to list | ✓ |
| Just navigate back — no summary | Return to detail, no completion moment | |
| Summary + prompt to record a set | Phase 5 bridge CTA | |

**User's choice:** Summary screen with workout name, exercises done, total duration.

---

## Claude's Discretion

- Loading skeleton and empty state visual design
- Exact exercise card background color palette
- Animation details for drag-and-drop reordering
- Rest timer visual style (ring, progress bar, or numeric countdown)
- Error state handling for API failures

## Deferred Ideas

- Exercise demo videos/GIFs (media storage not in scope for Phase 3)
- Search-while-typing debounce optimization
- Workout templates / community shared workouts
- "Record a set" CTA on completion summary (Phase 5 bridge — deferred)
