module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    transform: {
        '\\.[jt]sx?$': ['jest-preset-angular', { tsconfig: '<rootDir>/tsconfig.json' }]
    }
};
