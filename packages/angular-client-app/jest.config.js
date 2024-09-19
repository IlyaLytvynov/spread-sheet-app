module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  globalSetup: "jest-preset-angular/global-setup",
  moduleNameMapper: {
    // "@services/(.*)": "<rootDir>/src/app/shared/services/$1",
    "@core/(.*)": "<rootDir>/src/app/core/$1",
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.spec.json'
    }
  }
};
