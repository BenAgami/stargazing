import { apiClient } from "../client";
import type { LoginValues, RegisterValues } from "@repo/common";

export const authApi = {
  login: (data: LoginValues): Promise<{ token: string }> =>
    apiClient.post<{ token: string }>("/api/auth/login", data),

  register: (data: RegisterValues): Promise<{ token: string }> =>
    apiClient.post<{ token: string }>("/api/auth/register", data),
};
