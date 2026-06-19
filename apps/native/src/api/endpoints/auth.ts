import type { LoginValues, RegisterValues } from "@repo/common";

import { tokenStore } from "../tokenStore";
import { apiClient } from "../client";

type AuthResponse = { token: string; refreshToken: string };

export const authApi = {
  login: (data: LoginValues): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>("/api/auth/login", data),

  register: (data: RegisterValues): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>("/api/auth/register", data),

  logout: async (): Promise<void> => {
    const refreshToken = await tokenStore.getRefreshToken();
    if (refreshToken) {
      await apiClient.post<void>("/api/auth/logout", { refreshToken });
    }
  },
};
