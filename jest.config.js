const enableDevtoolsCoverage = process.env.REDUX_DEVTOOLS_COVERAGE === 'true';

module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['text', 'json', 'lcov'],
  coveragePathIgnorePatterns: enableDevtoolsCoverage ? [] : ['src/hooks/useReduxDevtools'],
};
