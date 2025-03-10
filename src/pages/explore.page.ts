import BasePage from "./base.page";
import {BrowserContext, Page} from "playwright";
import {Locator} from "@playwright/test";
import {waitForLocatorToBeVisible} from "../support/utils";
import {getDateWithOffset} from "../support/date-utils";

export class ExplorePage extends BasePage {
    private readonly searchResultLocationName: Locator;
    private readonly passengerCount: Locator;
    private readonly passengerDialog: Locator;
    private readonly dateField: Locator;
    private readonly datePicker: Locator;

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
        this.searchResultLocationName = page.locator(".W6bZuc.YMlIz");
        this.passengerCount = page.locator("(//button[@aria-haspopup='dialog'])[2]");
        this.dateField = page.locator("div[jscontroller='ViZxZe']");
        this.datePicker = page.locator("div[jscontroller='DAizJd']");
        this.passengerDialog = page.locator("div[aria-label='Number of passengers']");
    }

    async getFirstResult():Promise<string> {
        return await this.searchResultLocationName.nth(0).innerText();
    }

    async getPassengerCount():Promise<number> {
        return parseInt(await this.passengerCount.innerText());
    }

    async getDepartureDate() {
        return (await this.dateField.nth(0).getAttribute("data-value"))!;
    }

    async getReturnDate() {
        return (await this.dateField.nth(1).getAttribute("data-value"))!;
    }

    async openDatepicker() {
        await this.dateField.nth(0).click();
        await waitForLocatorToBeVisible(this.datePicker);
    }

    async setDepartureDate():Promise<string> {
        const previousDate = await this.getDepartureDate();
        const newDate = getDateWithOffset(5, previousDate);

        const departureLocator = this.datePicker.locator("input[placeholder='Departure']");
        await departureLocator.click({ force: true });
        await departureLocator.press("Control+a");
        await departureLocator.press("Backspace");
        await departureLocator.pressSequentially(newDate);
        await departureLocator.press("Enter");

        return newDate;
    }

    async changeAdultCount(): Promise<number> {
        const previousCount = await this.getPassengerCount();
        await this.passengerCount.click();
        await this.page.locator("button[aria-label='Remove adult']").first().click();
        await this.passengerDialog.locator("//span[text()='Done']").click();

        return previousCount - 1;

    }

}