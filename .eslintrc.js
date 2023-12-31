module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true
  },
  rules: {
    semi: ['off'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/explicit-module-boundary-types': ['error', { allowArgumentsExplicitlyTypedAsAny: true }],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    'n/handle-callback-err': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    '@typescript-eslint/no-namespace': 'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // TypeScript-specific rules can go here
      }
    }
  ]
};
