import { useState, useEffect, useRef, useCallback } from "react";

export interface UseCountdownReturn {
  secondsLeft: number;
  isRunning: boolean;
  start: (seconds?: number) => void;
  skip: () => void;
}

export const useCountdown = (initialSeconds: number): UseCountdownReturn => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearActiveInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (seconds?: number) => {
      const next = typeof seconds === "number" ? seconds : initialSeconds;
      clearActiveInterval();
      setSecondsLeft(next);
      setIsRunning(next > 0);
    },
    [initialSeconds, clearActiveInterval],
  );

  const skip = useCallback(() => {
    clearActiveInterval();
    setSecondsLeft(0);
    setIsRunning(false);
  }, [clearActiveInterval]);

  useEffect(() => {
    if (!isRunning) {
      clearActiveInterval();
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // Defer state update to next tick to avoid setState-during-render warning.
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return clearActiveInterval;
  }, [isRunning, clearActiveInterval]);

  // Defensive cleanup on unmount in case isRunning never flips off.
  useEffect(() => clearActiveInterval, [clearActiveInterval]);

  return { secondsLeft, isRunning, start, skip };
};
