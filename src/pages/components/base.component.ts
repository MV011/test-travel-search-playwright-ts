import { Page, Locator } from '@playwright/test';

/**
 * Base component that all component objects inherit from
 */
export class BaseComponent {
    readonly page: Page;
    readonly rootLocator: Locator;

    /**
     * Constructor for the base component
     * @param page Playwright page
     * @param rootLocator The root element locator for this component
     */
    constructor(page: Page, rootLocator: Locator) {
        this.page = page;
        this.rootLocator = rootLocator;
    }

    /**
     * Wait for the component to be visible
     */
    async waitForVisible(): Promise<void> {
        await this.rootLocator.waitFor({ state: 'visible' });
    }

    /**
     * Check if the component is visible
     */
    async isVisible(): Promise<boolean> {
        return await this.rootLocator.isVisible();
    }

    /**
     * Get a child element within this component
     * @param selector Selector relative to the root element
     */
    getChildElement(selector: string): Locator {
        return this.rootLocator.locator(selector);
    }
}