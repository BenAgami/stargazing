export type ExerciseType = "DYNAMIC" | "STATIC_HOLD";

export interface ExerciseSummary {
  id: number;
  code: string;
  displayName: string;
  exerciseType: ExerciseType;
}

export interface ExerciseDetail extends ExerciseSummary {
  description: string | null;
  isActive: boolean;
}

export interface ExerciseListResponse {
  items: ExerciseSummary[];
  page: {
    limit: number;
    offset: number;
    hasMore: boolean;
    nextOffset: number | null;
  };
}

export interface WorkoutExerciseHydrated {
  id: number;
  workoutId: number;
  exerciseId: number;
  position: number;
  sets: number;
  reps: number | null;
  durationSecs: number | null;
  restSecs: number;
  createdAt: string;
  exercise: ExerciseSummary;
}

export interface WorkoutWithExercises {
  id: number;
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutExerciseHydrated[];
}

export interface WorkoutListResponse {
  items: WorkoutWithExercises[];
  page: {
    limit: number;
    offset: number;
    hasMore: boolean;
    nextOffset: number | null;
  };
}

export interface WorkoutLogResponse {
  id: number;
  userId: number;
  workoutId: number;
  durationSecs: number;
  completedAt: string;
  createdAt: string;
}
