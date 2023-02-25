module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    transform: {
        '\\.[jt]sx?$': ['jest-preset-angular', { tsconfig: '<rootDir>/tsconfig.json' }]
    }
};
