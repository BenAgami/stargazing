import { defineConfig } from "eslint/config";

import { baseRules, sharedIgnores } from "@repo/eslint-config";

export default defineConfig(baseRules, { ignores: sharedIgnores });
