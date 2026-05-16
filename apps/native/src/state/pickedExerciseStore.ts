import type { ExerciseType } from "@src/types/workout";

export interface PickedExercise {
  exerciseId: number;
  exerciseCode: string;
  exerciseDisplayName: string;
  exerciseType: ExerciseType;
}

// Module-level slot. The builder consumes-and-clears on focus, so we never
// need subscribers — this is a transient hand-off, not reactive state.
let pending: PickedExercise | undefined;

export const setPickedExercise = (picked: PickedExercise): void => {
  pending = picked;
};

export const consumePickedExercise = (): PickedExercise | undefined => {
  const value = pending;
  pending = undefined;
  return value;
};

export const __resetPickedExerciseStore = (): void => {
  pending = undefined;
};
