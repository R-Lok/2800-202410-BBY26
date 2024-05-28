module.exports = {
    // The root of your source code, typically /src
    // `<rootDir>` is a token Jest substitutes
    roots: ['<rootDir>'],

    // Runs special logic, such as cleaning up components
    // when using React Testing Library and adds special
    // extended assertions to Jest

    // Test spec file resolution pattern
    // Matches parent folder `__tests__` and filename
    // should contain `test` or `spec`.
    coverageReporters: ['clover', 'json', 'lcov', 'text'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
    coverageThreshold: {
        global: {
            branches: 1,
            functions: 1,
            lines: 1,
            statements: 1,
        },
    },
    clearMocks: true,
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/src/public/scripts/'],
    coveragePathIgnorePatterns: ['/node_modules/', '/src/public/scripts/'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
    ],
}
