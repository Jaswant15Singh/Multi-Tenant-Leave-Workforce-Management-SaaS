export default {
  testEnvironment: 'node',
  transform: {}, // no Babel: run native ES modules
  testMatch: ['**/__tests__/**/*.test.js', '**/tests/**/*.test.js'],
};
