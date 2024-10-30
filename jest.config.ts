export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
      "^.+\\.tsx?$": "ts-jest" 
  },
  moduleNameMapper: {
      "\\.(css|scss)$": "<rootDir>/src/__mocks__/fileMock.js"
  },
}