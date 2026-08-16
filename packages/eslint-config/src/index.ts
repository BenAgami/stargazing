import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export const sharedIgnores = [
  "**/dist/**",
  "**/build/**",
  "**/.expo/**",
  "**/node_modules/**",
  "**/coverage/**",
  "**/android/**",
  "**/ios/**",
  "**/generated/**",
  "eslint.config.mjs",
  "**/tsup.config.ts",
  "**/vitest.config.ts",
  "**/prisma.config.ts",
];

export const baseRules = defineConfig(
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
