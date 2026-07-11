import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

import { baseRules, sharedIgnores } from "../../eslint.config.mjs";

export default tseslint.config(
  {
    ignores: [
      ...sharedIgnores,
      "babel.config.js",
      "metro.config.js",
      "jest.config.js",
    ],
  },
  ...baseRules,
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
