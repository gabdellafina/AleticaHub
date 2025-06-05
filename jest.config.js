// Jest Configuration for AtleticaHub
// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\jest.config.js

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**',
    '!src/server/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/layers/(.*)$': '<rootDir>/src/layers/$1',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1'
  },
  testTimeout: 10000
};
