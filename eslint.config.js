/* eslint-disable @typescript-eslint/no-var-requires */
const globals = require('globals');
const js = require('@eslint/js');
const airbnb = require('eslint-config-airbnb');
const prettier = require('eslint-config-prettier');
const tseslint = require('@typescript-eslint/eslint-plugin');
const reactHooks = require('eslint-plugin-react-hooks');
const react = require('eslint-plugin-react');
const tseslintParser = require('@typescript-eslint/parser');

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    // files: ['**/*.{js|jsx|ts|tsx}', 'src/**/*.{js|jsx|ts|tsx}'],
    ignores: ['coverage/**', 'dist/**', 'node_modules/**', 'tests/**'],
    plugins: { '@typescript-eslint': tseslint, react, 'react-hooks': reactHooks, prettier, airbnb },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
      sourceType: 'module',
      globals: {
        ...Object.entries(globals.browser).reduce((acc, [key, value]) => {
          acc[key.trim()] = value;

          return acc;
        }, {}),
        ...Object.entries(globals.node).reduce((acc, [key, value]) => {
          acc[key.trim()] = value;

          return acc;
        }, {}),
        ...globals.jest,
      },
    },
    settings: {
      'import/resolver': {
        node: { extensions: ['.ts', '.tsx'] },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...airbnb.rules,
      ...prettier.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-console': 'off',
      'no-shadow': 'off',
      'arrow-body-style': 'off',
      'no-empty-function': 'off',
      'no-void': ['error', { allowAsStatement: true }],
      'max-len': ['error', { code: 120 }],
      'react/button-has-type': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/function-component-definition': [0, { namedComponents: 'function-declaration' }],
      'import/prefer-default-export': 'off',
      'import/extensions': 'off',
    },
  },
];
