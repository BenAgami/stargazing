import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@src/context/AuthContext";
import { workoutApi, workoutKeys } from "@src/api";
import type { WorkoutWithExercises } from "@repo/common";

export const useWorkoutDetail = (id: number | undefined) => {
  const { token } = useAuth();
  return useQuery<WorkoutWithExercises, Error>({
    queryKey: workoutKeys.detail(id!),
    queryFn: () => workoutApi.get(id!),
    enabled: !!token && !!id,
    staleTime: 30 * 1000,
  });
};
