import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@src/context/AuthContext";
import { exerciseApi, exerciseKeys } from "@src/api";
import type { ExerciseDetail } from "@repo/common";

export const useExerciseDetail = (code: string | undefined) => {
  const { token } = useAuth();
  return useQuery<ExerciseDetail, Error>({
    queryKey: exerciseKeys.detail(code!),
    queryFn: () => exerciseApi.getByCode(code!),
    enabled: !!token && !!code,
    staleTime: 10 * 60 * 1000,
  });
};
