module.exports = {
  projects: [
    '<rootDir>/packages/core',
    '<rootDir>/packages/react',
    '<rootDir>/packages/layouts',
    '<rootDir>/packages/validators',
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/*.stories.{ts,tsx}',
    '!packages/*/src/**/__tests__/**',
  ],
};

