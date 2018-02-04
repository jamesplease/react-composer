module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/node_modules/**'],
  coverageDirectory: 'coverage',
  setupTestFrameworkScriptFile: './test/setup.js',
}
