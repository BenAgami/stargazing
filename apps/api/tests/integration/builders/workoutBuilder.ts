import type { WorkoutExerciseInput } from "@repo/common";

export type WorkoutExerciseDto = WorkoutExerciseInput;

export interface WorkoutDto {
  name?: string;
  exercises?: WorkoutExerciseDto[];
}

export class WorkoutBuilder {
  private workout: WorkoutDto;

  constructor() {
    this.workout = {
      name: "Push Day",
      exercises: [{ exerciseId: 0, sets: 3, reps: 10, restSecs: 60 }],
    };
  }

  setName(name?: string): WorkoutBuilder {
    this.workout.name = name;
    return this;
  }

  setExercises(exercises: WorkoutExerciseDto[]): WorkoutBuilder {
    this.workout.exercises = exercises;
    return this;
  }

  build(): WorkoutDto {
    return {
      ...this.workout,
      exercises: this.workout.exercises
        ? [...this.workout.exercises]
        : undefined,
    };
  }
}
