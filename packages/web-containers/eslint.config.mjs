import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import globals from "globals"; // ✅ import browser globals

export default [
  {
    ignores: [
      "**/*.config",
      "**/*.config.*",
      "**/dist/**",
      "**/coverage/**",
      "**/.husky/**",
      "**/.vscode/**",
      "**/.github/**",
    ],
  },
  eslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser, // ✅ this includes MessageEvent, window, etc.
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettier.rules,
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      globals: {
        ...globals.jest, // ✅ optionally add jest globals here
      },
    },
  },
];
