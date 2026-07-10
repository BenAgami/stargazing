import { readFileSync } from "node:fs";

import { defineConfig } from "tsup";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
) as { dependencies?: Record<string, string> };

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  platform: "node",
  outDir: "dist",
  // Code splitting is required so the dynamic import() in
  // routes/openapi.ts becomes a genuinely separate chunk loaded at request
  // time, not code inlined into this file (which would defeat the point —
  // see the comment in routes/openapi.ts).
  splitting: true,
  clean: true,
  // Never inline real npm packages — only our own src/ files should be
  // bundled. Packages like Prisma ship CJS runtime code with dynamic
  // `require()` calls that break when copied into an ESM bundle.
  external: Object.keys(pkg.dependencies ?? {}),
});
