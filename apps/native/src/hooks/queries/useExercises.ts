import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@src/context/AuthContext";
import { exerciseApi, exerciseKeys } from "@src/api";
import type { ExerciseListResponse } from "@src/types/workout";

const PAGE_SIZE = 100; // catalog is small (~20 exercises today); fetch all in one page

export const useExercises = () => {
  const { token } = useAuth();
  return useQuery<ExerciseListResponse, Error>({
    queryKey: exerciseKeys.lists(),
    queryFn: () => exerciseApi.list({ limit: PAGE_SIZE, offset: 0 }),
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10 min — exercises rarely change
  });
};
