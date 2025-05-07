module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Or 'node' depending on your test environment
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // If you use path aliases
  },
};
