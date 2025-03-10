import { APIRequestContext, Page, TestInfo } from '@playwright/test';
import { PagesObject } from '../pages/pages-object';
import { PlaywrightApiClient } from './api-client';
import {ComponentsObject} from "../pages/components/components-object";

/**
 * Represents the test execution environment.
 *
 * The `World` class provides a shared context for test steps, including:
 * - `pages`: Manages UI interactions via `PagesObject`
 * - `apiClient`: Handles API interactions (if applicable)
 * - `scenarioData`: Stores temporary data during test execution
 */
export class World {
    public pages: PagesObject;
    public commonComponents: ComponentsObject;
    public apiClient?: PlaywrightApiClient;
    public scenarioData: Map<string, any>;

    constructor(
        public page: Page,
        public testInfo: TestInfo,
        public apiContext?: APIRequestContext
    ) {
        this.pages = new PagesObject(page, page.context());
        this.commonComponents = new ComponentsObject(page, page.context());
        this.scenarioData = new Map<string, any>();

        // Initialize API client only if an API request context is provided
        if (apiContext) {
            this.apiClient = new PlaywrightApiClient(apiContext);
        }
    }
}