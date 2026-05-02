import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@src/context/AuthContext";
import { exerciseApi, exerciseKeys } from "@src/api";
import type { ExerciseDetail } from "@src/types/workout";

export const useExerciseDetail = (code: string | undefined) => {
  const { token } = useAuth();
  return useQuery<ExerciseDetail, Error>({
    queryKey: code ? exerciseKeys.detail(code) : ["exercises", "detail", "none"],
    queryFn: () => exerciseApi.getByCode(code!),
    enabled: !!token && !!code,
    staleTime: 10 * 60 * 1000,
  });
};
