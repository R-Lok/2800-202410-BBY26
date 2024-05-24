module.exports = {
    // The root of your source code, typically /src
    // `<rootDir>` is a token Jest substitutes
    roots: ['<rootDir>/src'],

    // Runs special logic, such as cleaning up components
    // when using React Testing Library and adds special
    // extended assertions to Jest

    // Test spec file resolution pattern
    // Matches parent folder `__tests__` and filename
    // should contain `test` or `spec`.
    // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',

    // Module file extensions for importing
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageThreshold: {
        global: {
            branches: 1,
            functions: 1,
            lines: 1,
            statements: 1,
        },
    },
    clearMocks: true,
    coverageReporters: ['text', 'cobertura', 'lcov'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
}
