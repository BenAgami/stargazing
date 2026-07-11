import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

import { env } from "../config/env";

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.runtimeEnv === "test",
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    code: "RATE_LIMITED",
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
});

export default authRateLimiter;
