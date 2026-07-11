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
);
