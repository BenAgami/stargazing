import type { Server } from "node:http";

import { disconnectPrisma } from "@repo/db";

import { videoAnalysisQueue } from "./queue";
import { redisConnection } from "./redis";
import { logger } from "./logger";

let isShuttingDown = false;
const SHUTDOWN_TIMEOUT_MS = 10_000;

export const registerShutdownHandlers = (
  getServer: () => Server | undefined,
): void => {
  const shutdown = async (signal: string, exitCode = 0): Promise<void> => {
    if (isShuttingDown) {
      logger.warn(`Received ${signal} during shutdown, ignoring`);
      return;
    }
    isShuttingDown = true;

    logger.info(`Received ${signal}, shutting down gracefully...`);

    const forceExitTimer = setTimeout(() => {
      logger.error("Graceful shutdown timed out, forcing exit");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExitTimer.unref();

    try {
      const server = getServer();
      if (server) {
        await new Promise<void>((resolve, reject) => {
          server.close((err) => (err ? reject(err) : resolve()));
        });
      }

      await videoAnalysisQueue.close();
      await redisConnection.quit();
      await disconnectPrisma();

      process.exit(exitCode);
    } catch (error) {
      logger.error(error, "Error during graceful shutdown");
      process.exit(1);
    } finally {
      clearTimeout(forceExitTimer);
    }
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on("uncaughtException", (error) => {
    logger.fatal(error, "Uncaught exception");
    void shutdown("uncaughtException", 1);
  });
  process.on("unhandledRejection", (reason) => {
    logger.fatal(reason, "Unhandled promise rejection");
    void shutdown("unhandledRejection", 1);
  });
};
