import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import { baseRules, sharedIgnores } from "@repo/eslint-config";

export default defineConfig(
  {
    ignores: [
      ...sharedIgnores,
      "babel.config.js",
      "metro.config.js",
      "jest.config.js",
    ],
  },
  baseRules,
  reactHooks.configs["recommended-latest"],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        __DEV__: "readonly",
      },
    },
  },
);
