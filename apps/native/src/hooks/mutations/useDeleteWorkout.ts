import { useMutation, useQueryClient } from "@tanstack/react-query";

import { workoutApi, workoutKeys } from "@src/api";

export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => workoutApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
};
