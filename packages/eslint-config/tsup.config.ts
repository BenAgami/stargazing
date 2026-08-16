import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  external: ["eslint", "@eslint/js", "typescript-eslint"],
  dts: true,
  ...options,
  clean: !options.watch,
}));
