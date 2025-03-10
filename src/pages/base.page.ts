import {BrowserContext, Page} from "@playwright/test";
import {config} from "../support/config";

/**
 * Represents the base page for all page objects
 */
export default class BasePage {

    protected page: Page
    context: BrowserContext;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }

    async navigateTo(optionalUrl?: string): Promise<any> {
        const url = optionalUrl ? (config.BASE_URL + optionalUrl) : config.BASE_URL;

        return this.page.goto(url);
    }


}