import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals'; // ✅ import browser globals

export default [
  {
    ignores: [
      '**/*.config',
      '**/*.config.*',
      '**/dist/**',
      '**/coverage/**',
      '**/.husky/**',
      '**/.vscode/**',
      '**/.github/**',
    ],
  },
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser, // ✅ this includes MessageEvent, window, etc.
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettier.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'no-prototype-builtins': 'warn',
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.tsx', '**/*.spec.tsx'],
    languageOptions: {
      globals: {
        ...globals.jest, // ✅ optionally add jest globals here
        ...globals.node, // ✅ add node globals for global object
      },
    },
  },
];
