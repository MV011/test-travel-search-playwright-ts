import {BaseComponent} from "./base.component";
import {Locator, Page} from "@playwright/test";




export class MainMenuComponent extends BaseComponent {

    private readonly travelButton: Locator;
    private readonly exploreButton: Locator;
    private readonly flightsButton: Locator;
    private readonly hotelsButton: Locator;
    private readonly vacationRentalsButton: Locator;
    private readonly changeCurrencyButton: Locator;
    private readonly travelSettingsButton: Locator;

    constructor(page: Page) {
        const rootLocator = page.locator('gm-raised-drawer');
        super(page, rootLocator);

        this.travelButton = super.getChildElement('div[aria-label=\'Travel\']');
        this.exploreButton = super.getChildElement('div[aria-label=\'Explore\']');
        this.flightsButton = super.getChildElement('div[aria-label=\'Flights\']');
        this.hotelsButton = super.getChildElement('div[aria-label=\'Hotels\']');
        this.vacationRentalsButton = super.getChildElement('div[aria-label=\'Vacation rentals\']');
        this.changeCurrencyButton = super.getChildElement('div[aria-label=\'Change currency\']');
        this.travelSettingsButton = super.getChildElement('div[aria-label=\'Travel settings\']');
    }

    async navigateToTravel(): Promise<void> {
        await this.travelButton.click();
        await this.page.waitForURL(/.*travel\/\?.*/);
    }

    async navigateToHotels(): Promise<void> {
        await this.hotelsButton.click();
        await this.page.waitForURL(/.*search.*/);
    }

    async navigateToExplore(): Promise<void> {
        await this.exploreButton.click();
        await this.page.waitForURL(/.*explore.*/);
    }

    async navigateToFlights(): Promise<void> {
        await this.flightsButton.click();
        await this.page.waitForURL(/.*flights.*/);
    }

    async navigateToVacationRentals(): Promise<void> {
        await this.vacationRentalsButton.click();
        await this.page.waitForURL(/.*search.*/);
    }

    async navigateToTravelSettings(): Promise<void> {
        await this.travelSettingsButton.click();
        await this.page.waitForURL(/.*settings.*/);
    }

    async changeCurrency(currency: string): Promise<void> {
        await this.changeCurrencyButton.last().click();
        await this.page.locator(`#${currency}`).first().click();
        await this.page.locator('(//button[@aria-label="Done"])[2]').click();
    }

    async isTabSelected(button: Locator): Promise<boolean> {
        return (await button.getAttribute('aria-label'))?.includes('Selected Tab') ?? false;
    }
}