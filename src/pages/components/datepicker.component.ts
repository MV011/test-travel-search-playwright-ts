import {BaseComponent} from "./base.component";
import {Page} from "playwright";
import {Locator} from "@playwright/test";
import {waitForLocatorToBeVisible} from "../../support/utils";

export class DatePickerComponent extends BaseComponent{
    private readonly checkIn: Locator;
    private readonly checkOut: Locator;
    private readonly doneButton: Locator;

    public constructor(page: Page) {
        const rootLocator = page.locator('div[jscontroller=\'U7bXpf\']');
        super(page,rootLocator)
        this.checkIn = super.getChildElement("(//div[@jscontroller='ViZxZe'])[1]");
        this.checkOut = super.getChildElement("(//div[@jscontroller='ViZxZe'])[2]");
        this.doneButton = super.getChildElement("button[jsname='iib5kc']");
    }

    async setCheckInDate(date: string) {
        await waitForLocatorToBeVisible(this.checkIn);
        await this.checkIn.click({ force: true });
        await this.checkIn.press("Control+a");
        await this.checkIn.press("Backspace");
        await this.checkIn.pressSequentially(date);
        await this.checkIn.press("Enter");
    }

    async setCheckOutDate(date: string) {
        await waitForLocatorToBeVisible(this.checkOut);
        await this.checkOut.click({ force: true, position: { x: 20, y: 20} });
        await this.checkOut.press("Control+a");
        await this.checkOut.press("Backspace");
        await this.checkOut.pressSequentially(date);
        await this.checkIn.press("Enter");
    }

    async getCheckInDate() : Promise<string> {
        const value = await this.checkIn.getAttribute("data-value");
        return value ?? "";
    }

    async getCheckOutDate() : Promise<string> {
        const value = await this.checkOut.getAttribute("data-value");
        return value ?? "";
    }

    async pressCheckoutDateArrow(direction: string, days: number): Promise<void> {
        await waitForLocatorToBeVisible(this.checkOut);
        await this.checkOut.click({ force: true });
        let arrow: Locator;
        if (direction === 'decrease') {
            arrow = super.getChildElement("button.NyzWEd").nth(2);
        }
        else {
            arrow = super.getChildElement("button.NyzWEd").nth(3);
        }
        for (let i = 0; i < days; i++) {
            await arrow.click();
        }
    }

    async clickDoneButton() {
        await this.doneButton.click();
    }
}