// jest.config.ts
export default {
  preset: 'ts-jest', 
  testEnvironment: 'node', 
  roots: ['<rootDir>/tests'], 
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest', 
      {
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/*.test.ts'],
  clearMocks: true,
};