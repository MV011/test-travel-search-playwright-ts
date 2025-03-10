import {defineConfig} from '@playwright/test';
import {defineBddConfig, cucumberReporter} from 'playwright-bdd';
import {config} from './src/support/config'

const testDir = defineBddConfig({
    features: 'src/features',
    steps: ['src/fixtures/fixtures.ts', 'src/steps/*.steps.ts'],
});

export default defineConfig({
    testDir,
    reporter: [cucumberReporter('html', {outputFile: 'cucumber-report/report.html'})],
    projects: [
        {
            name: 'ui',
            use: {
                failOnJSError: false,
                baseURL: config.BASE_URL,
                browserName: config.browser,
                launchOptions: config.launchOptions,
                viewport: {width: 1920, height: 1080},
                trace: {
                    mode: "retain-on-failure",
                },
                actionTimeout: 5000,
                navigationTimeout: 5000,
            },
        },
        {
            name: 'api',
            use: {
                baseURL: config.BASE_API_URI,
            }
        }
    ],
    timeout: 40000,
    workers: 2,
    fullyParallel: true,
    retries: 2,
});