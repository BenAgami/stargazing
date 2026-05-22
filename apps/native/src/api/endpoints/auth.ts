import { apiClient } from "../client";
import type { LoginValues, RegisterValues } from "@repo/common";

type AuthResponse = { token: string; refreshToken: string };

export const authApi = {
  login: (data: LoginValues): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>("/api/auth/login", data),

  register: (data: RegisterValues): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>("/api/auth/register", data),
};
