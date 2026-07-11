import { useState } from "react";

import { authApi } from "@src/api";
import { useAuth } from "@src/context/AuthContext";

export const useLogout = () => {
  const { setToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch {
      // best-effort server logout; local token is always cleared below
    } finally {
      try {
        await setToken(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { handleSignOut, isLoading };
};
