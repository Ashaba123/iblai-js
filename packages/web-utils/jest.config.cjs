/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: [
    "**/*.test.tsx",
    "**/*.test.ts",
    "**/__tests__/**/*.tsx",
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).tsx",
    "**/?(*.)+(spec|test).ts",
  ],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  moduleDirectories: ["node_modules", "src"],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
};
