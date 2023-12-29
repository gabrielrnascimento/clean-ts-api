module.exports = {
  roots: ['<rootDir>/tests/'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/main/**'
  ],
  preset: '@shelf/jest-mongodb',
  coverageDirectory: 'coverage',
  testEnvironment: 'jest-environment-node',
  transform: {
    '.+\\.ts': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
};
