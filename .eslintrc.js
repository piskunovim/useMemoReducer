module.exports = {
  extends: ['airbnb', 'prettier', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  plugins: ['@typescript-eslint'],
  env: {
    es6: true,
    browser: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: './',
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
      },
    },
  },
  rules: {
    'vars-on-top': 'off',
    'no-console': 'off',
    'no-shadow': 'off',
    'no-empty-function': 'off',
    'no-void': ['error', { allowAsStatement: true }],

    'max-len': ['error', { code: 120 }],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': [
      0,
      {
        namedComponents: 'function-declaration',
      },
    ],

    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
  },
};
