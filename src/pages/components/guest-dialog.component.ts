import {BaseComponent} from "./base.component";
import {Page} from "playwright";
import {Locator} from "@playwright/test";

export class GuestDialogComponent extends BaseComponent {

    private readonly adultGuestLocator: Locator;
    private readonly arrowLocators: Locator;
    private readonly doneButton: Locator;
    private readonly childGuestLocator: Locator;

    public constructor(page: Page) {
        const rootLocator = page.locator(".YFfNHd div[jsname='bN97Pc']");
        super(page,rootLocator);
        this.adultGuestLocator = super.getChildElement("div[aria-label='Adults']");
        this.arrowLocators = super.getChildElement("span[data-is-tooltip-wrapper='true']");
        this.doneButton = super.getChildElement("button[jsname='kZlJze']");
        this.childGuestLocator = super.getChildElement("div[aria-label='Children']");
    }

    async getAdultGuestCount(): Promise<number> {
        return parseInt(await this.adultGuestLocator.locator("span[jsname='NnAfwf']").innerText());
    }

    async getChildGuestCount(): Promise<number> {
        return parseInt(await this.childGuestLocator.locator("span[jsname='NnAfwf']").innerText());

    }

    async changeAdultGuestCount(direction: string, count: number) {
        let arrow: Locator;
        if (direction === 'decrease') {
            arrow = this.arrowLocators.nth(0);
        }
        else {
            arrow = this.arrowLocators.nth(1);
        }
        for (let i = 0; i < count; i++) {
            await arrow.click();
        }
    }

    async changeChildGuestCount(direction: string, count: number) {
        let arrow: Locator;
        if (direction === 'decrease') {
            arrow = this.arrowLocators.nth(2);
        }
        else {
            arrow = this.arrowLocators.nth(3);
        }
        for (let i = 0; i < count; i++) {
            await arrow.click();
        }
    }

    async clickDoneButton() {
        await this.doneButton.click();
    }

}