import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@src/context/AuthContext";
import { workoutApi, workoutKeys } from "@src/api";
import type { WorkoutWithExercises } from "@src/types/workout";

export const useWorkoutDetail = (id: number | undefined) => {
  const { token } = useAuth();
  return useQuery<WorkoutWithExercises, Error>({
    queryKey: id ? workoutKeys.detail(id) : ["workouts", "detail", "none"],
    queryFn: () => workoutApi.get(id!),
    enabled: !!token && !!id,
    staleTime: 30 * 1000,
  });
};
