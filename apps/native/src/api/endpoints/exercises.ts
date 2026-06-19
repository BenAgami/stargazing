import type { ExerciseDetail, ExerciseListResponse } from "@src/types/workout";

import { apiClient } from "../client";

export const exerciseApi = {
  list: (params?: {
    limit?: number;
    offset?: number;
  }): Promise<ExerciseListResponse> => {
    const query = new URLSearchParams();
    if (params?.limit !== undefined) query.set("limit", String(params.limit));
    if (params?.offset !== undefined)
      query.set("offset", String(params.offset));
    const qs = query.toString();
    return apiClient.get<ExerciseListResponse>(
      qs ? `/api/exercises?${qs}` : "/api/exercises",
    );
  },

  getByCode: (code: string): Promise<ExerciseDetail> =>
    apiClient.get<ExerciseDetail>(`/api/exercises/${encodeURIComponent(code)}`),
};
