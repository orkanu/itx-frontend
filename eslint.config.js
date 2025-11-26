import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'
import css from '@eslint/css'
import jestPlugin from 'eslint-plugin-jest'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginQuery from '@tanstack/eslint-plugin-query'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist/', 'node_modules/', 'test/__config__/']),
  ...pluginQuery.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },
  {
    // update this to match your test files
    files: ['**/*.{spec.js,spec.jsx,test.js,test.jsx}', '**/__tests__/**/*.{js}'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals,
        ...globals.jest,
      },
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
  pluginPrettier,
])
