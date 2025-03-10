import {Page, Locator, BrowserContext} from '@playwright/test';
import BasePage from "./base.page";
import {waitForLocatorToBeVisible} from "../support/utils";

export class ConsentPage extends BasePage {
    private readonly rejectAllButton: Locator;
    private readonly acceptAllButton: Locator;
    private readonly header: Locator;

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
        this.rejectAllButton = page.locator("button[aria-label=\"Reject all\"]").first();
        this.acceptAllButton = page.locator("button[aria-label=\"Accept all\"]").first();
        this.header = page.locator("//h1[contains(text(), 'Before you continue to Google')]");
    }

    public async clickRejectAllButton(): Promise<void> {
        await this.rejectAllButton.click();
    }

    public async clickAcceptAllButton(): Promise<void> {
        await this.acceptAllButton.click();
    }

    public async isHeaderDisplayed(): Promise<boolean> {
        return await waitForLocatorToBeVisible(this.header);
    }
}