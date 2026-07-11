export const AUTH_ROUTES = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  logout: "/api/auth/logout",
} as const;

export const USER_ROUTES = {
  me: "/api/users/me",
  avatarUploadUrl: "/api/users/me/avatar-upload-url",
  goals: "/api/users/me/goals",
} as const;

export const EXERCISE_ROUTES = {
  list: "/api/exercises",
  byCode: (code: string) => `/api/exercises/${encodeURIComponent(code)}`,
} as const;

export const WORKOUT_ROUTES = {
  list: "/api/workouts",
  detail: (id: number) => `/api/workouts/${id}`,
  logs: (id: number) => `/api/workouts/${id}/logs`,
} as const;
