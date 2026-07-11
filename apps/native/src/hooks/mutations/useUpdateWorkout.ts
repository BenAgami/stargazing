import { useMutation, useQueryClient } from "@tanstack/react-query";

import { workoutApi, workoutKeys } from "@src/api";
import type { UpdateWorkoutValues } from "@repo/common";
import type { WorkoutWithExercises } from "@src/types/workout";

interface UpdateWorkoutVariables {
  id: number;
  data: UpdateWorkoutValues;
}

export const useUpdateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation<WorkoutWithExercises, Error, UpdateWorkoutVariables>({
    mutationFn: ({ id, data }) => workoutApi.update(id, data),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: workoutKeys.lists() });
      queryClient.setQueryData(workoutKeys.detail(updated.id), updated);
    },
  });
};
