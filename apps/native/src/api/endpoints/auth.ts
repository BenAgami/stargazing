import type { LoginValues, RegisterValues } from "@repo/common";

import { tokenStore } from "../tokenStore";
import { apiClient } from "../client";
import { AUTH_ROUTES } from "@src/constants/routes";

type AuthResponse = { token: string; refreshToken: string };

export const authApi = {
  login: (data: LoginValues): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(AUTH_ROUTES.login, data),

  register: (data: RegisterValues): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(AUTH_ROUTES.register, data),

  logout: async (): Promise<void> => {
    const refreshToken = await tokenStore.getRefreshToken();
    if (refreshToken) {
      await apiClient.post<void>(AUTH_ROUTES.logout, { refreshToken });
    }
  },
};
