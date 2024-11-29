module.exports = {
  plugins: ['@typescript-eslint', 'node', 'prettier'],
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    '@adonisjs/eslint-config/app',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'node/no-unpublished-import': 'off',
    'node/no-unsupported-features/node-builtins': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'node/no-missing-import': 'off',
    'no-console': 'warn',
    'prettier/prettier': 'error',
  },
}
