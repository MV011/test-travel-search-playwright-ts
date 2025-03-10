import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * Header component that appears on all Google Travel pages
 */
export class HeaderComponent extends BaseComponent {
    private readonly mainMenuButton: Locator;

    private readonly travelButton: Locator;
    private readonly exploreButton: Locator;
    private readonly flightsButton: Locator;
    private readonly hotelsButton: Locator;
    private readonly holidayRentalsButton: Locator;


    /**
     * Constructor for header component
     * @param page Playwright page
     */
    constructor(page: Page) {
        // Define the root locator for the header
        const rootLocator = page.locator('header, div[role="banner"]');
        super(page, rootLocator);

        // Initialize locators for elements within the header
        this.mainMenuButton = super.getChildElement('div[aria-label=\'Main menu\']');
        this.travelButton = super.getChildElement('//button[.//span[contains(text(),\'Travel\')]]');
        this.exploreButton = super.getChildElement('//button[.//span[contains(text(),\'Explore\')]]');
        this.flightsButton = super.getChildElement('//button[.//span[contains(text(),\'Flights\')]]');
        this.hotelsButton = super.getChildElement('//button[.//span[contains(text(),\'Hotels\')]]');
        this.holidayRentalsButton = super.getChildElement('//button[.//span[contains(text(),\'rentals\')]]');

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
        await this.exploreButton.focus();
        await this.exploreButton.click();
        await this.exploreButton.click();
        await this.page.waitForURL(/.*explore.*/,{waitUntil: 'domcontentloaded'});
    }

    async navigateToFlights(): Promise<void> {
        await this.flightsButton.click();
        await this.page.waitForURL(/.*flights.*/);
    }

    async navigateToHolidayRentals(): Promise<void> {
        await this.holidayRentalsButton.click();
        await this.page.waitForURL(/.*search.*/);
    }

    async clickMainMenu() {
        await this.mainMenuButton.click();
    }

    async isButtonActive(button: Locator): Promise<boolean> {
        return await button.getAttribute('aria-current') === 'true';
    }
}