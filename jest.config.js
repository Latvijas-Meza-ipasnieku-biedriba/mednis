module.exports = {
    testMatch: ["<rootDir>/**/*.test.{ts,tsx,js,jsx}"],
    collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
    moduleNameMapper: {
        "\\.(scss|jpg|png)$": "identity-obj-proxy",
        "\\.svg$": "<rootDir>/src/__mocks__/svg-mock.tsx",
    },
    modulePathIgnorePatterns: ["<rootDir>/cypress/"],
    setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
    reporters: [
        "default",
        [
            "jest-junit",
            {
                outputDirectory: "coverage",
                suiteNameTemplate: "{filepath}",
                classNameTemplate: "{filepath}",
                titleTemplate: "{title}",
            },
        ],
    ],
    coverageReporters: ["text", "lcov", "cobertura"],
};
