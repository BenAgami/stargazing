import { Router, Request, Response } from "express";
import helmet from "helmet";
import { apiReference } from "@scalar/express-api-reference";

import asyncHandler from "../utils/asyncWrapper";

const router = Router();

// Lazily imported so the OpenAPI registry (and the Zod schemas it pulls in
// from @repo/common) is only built on first request, after this bundle's
// own top-level code — including the extendZodWithOpenApi(z) patch in
// openapi/extend.ts — has already run. A static import here would let
// @repo/common's schemas construct before that patch exists, since a
// bundled module's own top-level code always runs after all of its
// imports have evaluated.
let specPromise: Promise<{ spec: unknown }> | undefined;
const getSpec = () => {
  specPromise ??= import("../openapi/spec");
  return specPromise;
};

router.get(
  "/openapi.json",
  asyncHandler(async (_req: Request, res: Response) => {
    const { spec } = await getSpec();
    res.json(spec);
  }),
);

router.use(
  "/docs",
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        "img-src": ["'self'", "data:", "https://cdn.jsdelivr.net"],
        "font-src": ["'self'", "data:", "https://cdn.jsdelivr.net"],
        "worker-src": ["'self'", "blob:"],
      },
    },
  }),
  apiReference({
    url: "/api/openapi.json",
    pageTitle: "Cali AI API Reference",
  }),
);

export default router;
