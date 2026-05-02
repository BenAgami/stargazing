import { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { useCountdown } from "@src/hooks/useCountdown";
import type { WorkoutWithExercises, WorkoutExerciseHydrated } from "@src/types/workout";

export type ExecutionPhase = "working" | "resting" | "complete";

export interface UseWorkoutExecutionResult {
  phase: ExecutionPhase;
  currentExerciseIndex: number;
  currentSet: number; // 1-based
  currentExercise: WorkoutExerciseHydrated | null;
  isLastSet: boolean;
  isLastExercise: boolean;
  totalElapsedSecs: number;
  // For resting phase:
  restSecondsLeft: number;
  restTotalSecs: number;
  // Actions:
  completeSet: () => void;
  skipRest: () => void;
}

export const useWorkoutExecution = (
  workout: WorkoutWithExercises | undefined,
): UseWorkoutExecutionResult => {
  const exercises = workout?.exercises ?? [];
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setNumber, setSetNumber] = useState(1); // 1-based
  const [phase, setPhase] = useState<ExecutionPhase>("working");
  const startedAtRef = useRef<number>(Date.now());
  const [totalElapsed, setTotalElapsed] = useState(0);

  const currentExercise: WorkoutExerciseHydrated | null =
    exercises[exerciseIndex] ?? null;
  const restTotal = currentExercise?.restSecs ?? 0;

  const countdown = useCountdown(restTotal);

  // Wall-clock elapsed updater (ticks every second while not complete)
  useEffect(() => {
    if (phase === "complete") return;
    const interval = setInterval(() => {
      setTotalElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // When countdown ends naturally during rest, advance to next set/exercise
  useEffect(() => {
    if (phase !== "resting") return;
    if (countdown.isRunning) return;
    if (countdown.secondsLeft !== 0) return;
    advanceAfterRest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, countdown.isRunning, countdown.secondsLeft]);

  const advanceAfterRest = useCallback(() => {
    if (!currentExercise) return;
    if (setNumber < currentExercise.sets) {
      // More sets remain on the current exercise
      setSetNumber((s) => s + 1);
      setPhase("working");
      return;
    }
    // Move to next exercise (or complete)
    if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex((i) => i + 1);
      setSetNumber(1);
      setPhase("working");
      return;
    }
    setPhase("complete");
  }, [currentExercise, setNumber, exerciseIndex, exercises.length]);

  const completeSet = useCallback(() => {
    if (!currentExercise) return;
    if (phase !== "working") return;

    const isLastSetOfExercise = setNumber >= currentExercise.sets;
    const isLastExerciseOfWorkout = exerciseIndex >= exercises.length - 1;

    if (isLastSetOfExercise && isLastExerciseOfWorkout) {
      setPhase("complete");
      return;
    }
    if (currentExercise.restSecs <= 0) {
      // No rest configured — go straight to the next set/exercise
      advanceAfterRest();
      return;
    }
    setPhase("resting");
    countdown.start(currentExercise.restSecs);
  }, [currentExercise, phase, setNumber, exerciseIndex, exercises.length, countdown, advanceAfterRest]);

  const skipRest = useCallback(() => {
    if (phase !== "resting") return;
    countdown.skip();
    advanceAfterRest();
  }, [phase, countdown, advanceAfterRest]);

  const isLastSet = useMemo(
    () => !!currentExercise && setNumber >= currentExercise.sets,
    [currentExercise, setNumber],
  );
  const isLastExercise = exerciseIndex >= exercises.length - 1;

  return {
    phase,
    currentExerciseIndex: exerciseIndex,
    currentSet: setNumber,
    currentExercise,
    isLastSet,
    isLastExercise,
    totalElapsedSecs: totalElapsed,
    restSecondsLeft: countdown.secondsLeft,
    restTotalSecs: restTotal,
    completeSet,
    skipRest,
  };
};
