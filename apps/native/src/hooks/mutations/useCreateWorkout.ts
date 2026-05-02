import { useMutation, useQueryClient } from "@tanstack/react-query";

import { workoutApi, workoutKeys } from "@src/api";
import type { CreateWorkoutValues } from "@repo/common";
import type { WorkoutWithExercises } from "@src/types/workout";

export const useCreateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation<WorkoutWithExercises, Error, CreateWorkoutValues>({
    mutationFn: (data: CreateWorkoutValues) => workoutApi.create(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.lists() });
      // Seed the detail cache so navigating to the new workout is instant.
      queryClient.setQueryData(workoutKeys.detail(created.id), created);
    },
  });
};
