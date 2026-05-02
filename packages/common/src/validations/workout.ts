import { z } from "zod";

const workoutExerciseInputSchema = z.object({
  exerciseId: z.number().int().positive(),
  sets: z.number().int().min(1).max(99),
  reps: z.number().int().min(1).max(999).nullable().optional(),
  durationSecs: z.number().int().min(1).max(3600).nullable().optional(),
  restSecs: z.number().int().min(0).max(600),
});

export const createWorkoutSchema = z.object({
  name: z.string().trim().min(1).max(100),
  exercises: z.array(workoutExerciseInputSchema).min(1).max(50),
});

export const updateWorkoutSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  exercises: z.array(workoutExerciseInputSchema).min(1).max(50).optional(),
});

export const workoutLogSchema = z.object({
  durationSecs: z.number().int().min(0).max(86_400),
  completedAt: z.iso.datetime().optional(),
});

export type CreateWorkoutValues = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutValues = z.infer<typeof updateWorkoutSchema>;
export type WorkoutLogValues = z.infer<typeof workoutLogSchema>;
export type WorkoutExerciseInput = z.infer<typeof workoutExerciseInputSchema>;
