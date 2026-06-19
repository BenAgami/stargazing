import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { StatusCodes } from "http-status-codes";

import { useAuth } from "@src/context/AuthContext";
import { authApi, ApiError } from "@src/api";

import type { LoginValues } from "@repo/common";

export const useLogin = () => {
  const { setToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  const handleSignIn = async (data: LoginValues) => {
    setError(null);
    try {
      const result = await authApi.login(data);
      await setToken(result.token, result.refreshToken);
      const destination = returnTo?.startsWith("/") ? returnTo : "/";
      router.replace(destination as Parameters<typeof router.replace>[0]);
    } catch (err) {
      if (err instanceof ApiError && err.status === StatusCodes.UNAUTHORIZED) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return { handleSignIn, error };
};
