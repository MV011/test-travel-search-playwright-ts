# Google Travel Search Testing Framework

An end-to-end testing framework for Google Travel built with Playwright, TypeScript, and BDD.

## Overview

This project provides an automated testing solution for the Google Travel application, focusing on the search, filters, and exploration features.
The framework uses a BDD (Behavior-Driven Development) approach with Playwright and the Playwright-BDD library.

## Features

- **BDD Testing Approach**: Clear, readable test scenarios in Gherkin syntax
- **Page Object Model**: Structured approach to UI element management
- **Component Pattern**: Reusable UI components for consistent interaction
- **Cross-browser Testing**: Support for Chromium, Firefox, and WebKit
- **Parallel Test Execution**: Efficient test runs across multiple workers
- **Tag-based Test Selection**: Run specific subsets of tests with tags
- **Reporting**: Visual HTML reports for test results with Cucumber Report
- **API Testing Support**: Dedicated client for API interaction tests

## Tech Stack

- **Playwright**: Browser automation
- **TypeScript**: Type-safe test implementation
- **Playwright-BDD**: Cucumber/Gherkin integration with Playwright

## Why Playwright-BDD and not CucumberJS?

Playwright-bdd allows for the use of the Playwright Test Runner, reducing the overhead, removing the need to create custom hooks to manage all the Playwright components.

## Project Structure

```
test-travel-search-playwright-ts/
├── src/
│   ├── enums/              # Type definitions for enumerated values
│   ├── features/           # BDD feature files (Gherkin syntax)
│   ├── fixtures/           # Custom test fixtures
│   ├── pages/              # Page Object Models
│   │   ├── components/     # Reusable UI components
│   ├── steps/              # Step definitions for BDD scenarios
│   ├── support/            # Helper utilities and configuration
│   └── types/              # TypeScript interface definitions
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
└── run-tag.js              # Script that allows for execution of specific Gerkin tags from the command line
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/test-travel-search-playwright-ts.git
   cd test-travel-search-playwright-ts
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

## Quickstart

After installation, run the following:

```bash
npm run test:ui
```

## BDD Test Generation

This framework uses playwright-bdd to generate test files from Gherkin feature files. The BDD generation step is essential before running the tests.

### Generate all BDD tests:

```bash
npx bddgen
```

### Generate tests for specific tags:

```bash
npx bddgen --tags "@UI"
```

### Generate and run tests in a single command:

```bash
npm test
```

## Running Tests

### Run all tests:

```bash
npm test
```

### Run UI tests only (Will generate and run the tests for the UI project and @UI tag):

```bash
npm run test:ui
```

### Run API tests only (Will generate and run the tests for the API project and @API tag):

```bash
npm run test:api
```

### Run tests with specific tags:

```bash
npm run test:tag -- --tags="@Smoke"
```

### Run tests and open report:

```bash
npm test && npm run report
```

### Understanding the BDD-to-Test Process

1. Write Gherkin features in `src/features/*.feature`
2. Define step implementations in `src/steps/*.steps.ts`
3. Run `npx bddgen` to generate test files in `features-gen/`
4. Playwright executes the generated test files

The `playwright-bdd` package bridges the gap between Cucumber-style BDD and Playwright's test runner.

#### More info:

https://vitalets.github.io/playwright-bdd/

## Test Tags

The framework uses tags to categorize tests:

- `@UI`: UI-based tests that run in a browser
- `@API`: API-based tests
- `@Regression`: Full regression test suite
- `@Smoke`: Critical path tests for smoke testing

## Configuration

The framework can be configured through environment variables:

- `BROWSER`: Browser to use (chromium, firefox, webkit)
- `BASEURL`: Base URL for the application
- `APIURL`: Base URL for API testing

Example:

```bash
BROWSER=firefox BASEURL=https://www.google.com/travel npm test
```

## Adding New Tests

1. Create a new feature file in `src/features/`
2. Implement step definitions in `src/steps/`
3. Add page objects or components as needed
4. Run the tests to verify

## Debugging with Playwright Traces

Playwright provides powerful tracing capabilities that capture detailed information about test execution.
The framework is configured to retain traces on test failure.

### Trace location

Traces are located in the test-results folder. 
A folder is created for each failed test, with the pattern:
```
src-features-search-core.f-a279d-check-in-and-check-out-dates-ui
```
The name contains the feature, in this case search-core, and part of the test name and tags


### Viewing Traces

After running tests that have failed, you can view the traces with:

```bash
npx playwright show-trace test-results/subfolder/trace-filename.zip
```

## Reporting

After running tests, view the HTML report with:

```bash
npm run report
```

This will open the Cucumber HTML report in your default browser.

## Project future potential improvements

* Config - Introduce more ENV variables, more flexibility for different browser/platform types
* Logging with a dedicated logger and log to file
* Accesibility tests with axe-playwright
* Refactoring some test steps and logic
