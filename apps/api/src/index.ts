import type { Server } from "node:http";

import { connectPrisma, disconnectPrisma } from "@repo/db";

import { env } from "./config/env";
import { createApp } from "./app";
import { videoAnalysisQueue } from "./lib/queue";
import { redisConnection } from "./lib/redis";
import { logger } from "./lib/logger";

const initializeExpress = (): Server => {
  const PORT = env.port;
  const app = createApp();
  return app.listen(PORT, () => {
    logger.info(`Server running on port: ${PORT}`);
  });
};

let server: Server | undefined;

const SHUTDOWN_TIMEOUT_MS = 10_000;

const shutdown = async (signal: string): Promise<void> => {
  logger.info(`Received ${signal}, shutting down gracefully...`);

  const forceExitTimer = setTimeout(() => {
    logger.error("Graceful shutdown timed out, forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExitTimer.unref();

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((err) => (err ? reject(err) : resolve()));
    });
  }

  await videoAnalysisQueue.close();
  await redisConnection.quit();
  await disconnectPrisma();

  clearTimeout(forceExitTimer);
  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

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
