import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@src/context/AuthContext";
import { workoutApi, workoutKeys } from "@src/api";
import type { WorkoutListResponse } from "@src/types/workout";

const PAGE_SIZE = 50;

export const useWorkouts = () => {
  const { token } = useAuth();
  return useQuery<WorkoutListResponse, Error>({
    queryKey: workoutKeys.lists(),
    queryFn: () => workoutApi.list({ limit: PAGE_SIZE, offset: 0 }),
    enabled: !!token,
    staleTime: 30 * 1000,
  });
};
