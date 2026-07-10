import { z } from "zod";

import { registry } from "../registry";
import { errorResponse } from "../schemas";

registry.registerPath({
  method: "get",
  path: "/health",
  tags: ["Health"],
  summary: "Health check",
  responses: {
    200: {
      description: "Service is healthy",
      content: {
        "application/json": {
          schema: z.object({
            status: z.literal("ok"),
            db: z.literal("ok"),
          }),
        },
      },
    },
    503: errorResponse("Service unavailable — database unreachable"),
    500: errorResponse("Internal server error"),
  },
});
