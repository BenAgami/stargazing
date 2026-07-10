import { z } from "zod";

import { registry } from "../registry";

import {
  ExerciseResponse,
  paginatedData,
  successResponse,
  errorResponse,
} from "../schemas";

const optionalBearerAuth: Record<string, string[]>[] = [{}, { BearerAuth: [] }];

registry.registerPath({
  method: "get",
  path: "/exercises",
  tags: ["Exercises"],
  summary: "List exercises",
  security: optionalBearerAuth,
  request: {
    query: z.object({
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .openapi({ description: "Max items to return (1-100)", example: 20 }),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .openapi({ description: "Number of items to skip", example: 0 }),
      includeInactive: z.string().optional().openapi({
        description:
          "Set to 'true' to include inactive exercises. Requires an admin bearer token.",
        example: "true",
      }),
    }),
  },
  responses: {
    200: successResponse(
      paginatedData(ExerciseResponse),
      "Paginated exercise list",
    ),
    400: errorResponse("Invalid query parameters"),
    403: errorResponse("Admin access required for includeInactive"),
    500: errorResponse("Internal server error"),
  },
});

registry.registerPath({
  method: "get",
  path: "/exercises/{code}",
  tags: ["Exercises"],
  summary: "Get an exercise by code",
  security: optionalBearerAuth,
  request: {
    params: z.object({
      code: z.string().openapi({ example: "push-up" }),
    }),
  },
  responses: {
    200: successResponse(ExerciseResponse, "Exercise"),
    404: errorResponse("Exercise not found"),
    500: errorResponse("Internal server error"),
  },
});
