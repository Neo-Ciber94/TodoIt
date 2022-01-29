/* eslint-disable no-undef */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/test/**/*test.ts"],
  moduleDirectories: ["node_modules", "."],
  testPathIgnorePatterns: [".d.ts", "test/utils.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  setupFiles: ["jest-localstorage-mock"],
};
