module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    semi: ['off'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/explicit-module-boundary-types': ['error', { allowArgumentsExplicitlyTypedAsAny: true }]
  }
};
