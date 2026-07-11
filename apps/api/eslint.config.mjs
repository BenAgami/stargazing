import tseslint from "typescript-eslint";
import globals from "globals";

import { baseRules, sharedIgnores } from "../../eslint.config.mjs";

export default tseslint.config(
  { ignores: sharedIgnores },
  ...baseRules,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.node,
    },
  },
  {
    // supertest's Response#body is typed `any` by design (arbitrary JSON
    // payloads); test assertions on res.body.* trip the unsafe-* family
    // for reasons unrelated to real bugs.
    files: ["tests/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
);
