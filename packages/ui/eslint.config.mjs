import { defineConfig } from "eslint/config";
import globals from "globals";

import { baseRules, sharedIgnores } from "@repo/eslint-config";

export default defineConfig({ ignores: sharedIgnores }, baseRules, {
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
    globals: globals.browser,
  },
});
