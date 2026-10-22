export default {
  cacheDirectory: '<rootDir>/.jest',
  collectCoverage: true,
  collectCoverageFrom: ['src/*.ts', '!src/index.ts'],
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 92,
      lines: 96,
      statements: 94,
    },
  },
  roots: ['src'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};
