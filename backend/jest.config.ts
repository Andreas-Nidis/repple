// jest.config.js
export default {
  preset: 'ts-jest', 
  testEnvironment: 'node', 
  roots: ['<rootDir>/tests'], 
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/*.test.ts'],
  clearMocks: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};