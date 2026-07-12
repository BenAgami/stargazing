import type { Server } from "node:http";

import { connectPrisma } from "@repo/db";

import { env } from "./config/env";
import { createApp } from "./app";

import { registerShutdownHandlers } from "./lib/shutdown";
import { logger } from "./lib/logger";

const initializeExpress = (): Server => {
  const PORT = env.port;
  const app = createApp();
  return app.listen(PORT, () => {
    logger.info(`Server running on port: ${PORT}`);
  });
};

let server: Server | undefined;

registerShutdownHandlers(() => server);

const startServer = async (): Promise<void> => {
  try {
    await connectPrisma(env.databaseUrl, env.runtimeEnv === "production");
    server = initializeExpress();
  } catch (error) {
    logger.error(error, "Failed to start server");
    process.exit(1);
  }
};

void startServer();
