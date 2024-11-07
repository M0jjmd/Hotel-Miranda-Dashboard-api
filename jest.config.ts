module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/'],
    roots: ['<rootDir>/__tests__'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
}  