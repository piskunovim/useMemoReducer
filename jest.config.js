const isDevelopmentCoverage = process.env.NODE_ENV === 'development';

module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['text', 'json', 'lcov'],
  coveragePathIgnorePatterns: isDevelopmentCoverage
    ? []
    : ['src/hooks/useReduxDevtools', 'src/hooks/useTimeline', 'src/utils/Log', 'tests'],
};
