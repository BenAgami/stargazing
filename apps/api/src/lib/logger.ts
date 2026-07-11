import pino from "pino";

import { env } from "../config/env";

export const logger = pino({
  level: env.runtimeEnv === "production" ? "info" : "debug",
  transport:
    env.runtimeEnv === "production"
      ? undefined
      : { target: "pino-pretty", options: { colorize: true } },
});
