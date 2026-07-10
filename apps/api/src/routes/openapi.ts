import { Router, Request, Response } from "express";
import helmet from "helmet";
import { apiReference } from "@scalar/express-api-reference";

import { spec } from "../openapi/spec";

const router = Router();

router.get("/openapi.json", (_req: Request, res: Response) => {
  res.json(spec);
});

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
