import { apiClient } from "../client";
import type {
  CreateWorkoutValues,
  UpdateWorkoutValues,
  WorkoutLogValues,
} from "@repo/common";
import type {
  WorkoutWithExercises,
  WorkoutListResponse,
  WorkoutLogResponse,
} from "@src/types/workout";

export const workoutApi = {
  list: (params?: { limit?: number; offset?: number }): Promise<WorkoutListResponse> => {
    const query = new URLSearchParams();
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    if (params?.offset !== undefined) query.set("offset", String(params.offset));
    const qs = query.toString();
    return apiClient.get<WorkoutListResponse>(
      qs ? `/api/workouts?${qs}` : "/api/workouts",
    );
  },

  get: (id: number): Promise<WorkoutWithExercises> =>
    apiClient.get<WorkoutWithExercises>(`/api/workouts/${id}`),

  create: (data: CreateWorkoutValues): Promise<WorkoutWithExercises> =>
    apiClient.post<WorkoutWithExercises>("/api/workouts", data),

  update: (id: number, data: UpdateWorkoutValues): Promise<WorkoutWithExercises> =>
    apiClient.patch<WorkoutWithExercises>(`/api/workouts/${id}`, data),

  remove: (id: number): Promise<void> =>
    apiClient.delete<void>(`/api/workouts/${id}`),

  startLog: (id: number, data: WorkoutLogValues): Promise<WorkoutLogResponse> =>
    apiClient.post<WorkoutLogResponse>(`/api/workouts/${id}/logs`, data),
};
