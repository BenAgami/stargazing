import { useMutation, useQueryClient } from "@tanstack/react-query";

import { workoutApi, workoutKeys } from "@src/api";
import type { CreateWorkoutValues } from "@repo/common";
import type { WorkoutWithExercises } from "@src/types/workout";

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation<WorkoutWithExercises, Error, CreateWorkoutValues>({
    mutationFn: (data: CreateWorkoutValues) => workoutApi.create(data),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: workoutKeys.lists() });
      queryClient.setQueryData(workoutKeys.detail(created.id), created);
    },
  });
};
