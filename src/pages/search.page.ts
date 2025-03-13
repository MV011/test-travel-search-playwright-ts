import {Page, Locator, BrowserContext} from '@playwright/test';
import BasePage from "./base.page";
import {SearchFiltersComponent} from "./components/search-filters.component";
import {SearchConditions} from "../types/search-conditions";
import {SearchFilterType} from "../enums/search-filter-type.enum";
import {
    extractNumericValue, waitForLocatorAttributeToHaveValue,
    waitForLocatorToBeHidden,
    waitForLocatorToBeVisible,
    waitForRequests
} from "../support/utils";
import {DatePickerComponent} from "./components/datepicker.component";
import {GuestDialogComponent} from "./components/guest-dialog.component";

export class SearchPage extends BasePage {
    public readonly searchFilters: SearchFiltersComponent;
    public readonly datePicker: DatePickerComponent;
    public readonly guestDialogMenu: GuestDialogComponent;

    private readonly allFiltersButton: Locator;
    private readonly searchInput: Locator;
    private readonly searchClearButton: Locator;
    private readonly searchResultItemContainer: Locator;
    private readonly searchResultsHeader: Locator;
    private readonly noSuggestionsTooltip: Locator;
    private readonly noPropertiesMatchContainer: Locator;
    private readonly searchSuggestionsList: Locator;
    private readonly searchBarCheckIn: Locator;
    private readonly searchBarCheckOut: Locator;
    private readonly guestCountButton: Locator;
    private readonly loadingSpinner: Locator;

    private readonly resultPriceSelector = "//div[@jscontroller='yO02F']";


    private searchResultsList: Locator[] = [];

    private lowestPrice: number = 0;

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
        this.searchFilters = new SearchFiltersComponent(page);
        this.datePicker = new DatePickerComponent(page);
        this.guestDialogMenu = new GuestDialogComponent(page);
        this.searchInput = page.locator("input[aria-label*=\"Search\"]").last();
        this.allFiltersButton = page.locator("button[aria-label*=\"All filters\"]").first();
        this.searchResultItemContainer = page.locator(".cxc95d.skHThf.Yh5Kfb");
        this.searchResultsHeader = page.locator(".GDEAO");
        this.searchClearButton = page.locator("button[aria-label='Clear']").first();
        this.noSuggestionsTooltip = page.locator(".PNBZM");
        this.noPropertiesMatchContainer = page.locator(".RDtsce.VWq0xb.uLIYJd.eO2Zfd");
        this.searchSuggestionsList = page.locator("ul.F3AVKd");
        this.searchBarCheckIn = page.locator("(//div[@jscontroller='ViZxZe'])[1]");
        this.searchBarCheckOut = page.locator("(//div[@jscontroller='ViZxZe'])[2]");
        this.guestCountButton = page.locator(".YFfNHd > div[jscontroller='sX6Zff']");
        this.loadingSpinner = page.locator("div[role='progressbar']");
    }

    async navigateTo(): Promise<void> {
        await super.navigateTo("/search");
    }

    async enterSearchTerm(searchTerm: string, pressEnter: boolean = true): Promise<void> {
        if (await this.searchClearButton.isVisible()) {
            await this.searchClearButton.click();
            await waitForLocatorToBeHidden(this.searchClearButton);
        }
        await this.searchInput.click();
        await this.searchInput.fill(searchTerm);

        if (pressEnter) {
            await this.searchInput.press("Enter");
            await this.waitForResultsListToLoad();
        }
    }

    async getSearchResultsHeaderText(): Promise<string> {
        await waitForLocatorToBeVisible(this.searchResultsHeader);
        return await this.searchResultsHeader.innerText();
    }

    async getNoPropertiesMatchText(): Promise<string | null> {
        await waitForLocatorToBeVisible(this.noPropertiesMatchContainer);
        return await this.noPropertiesMatchContainer.isVisible() ? await this.noPropertiesMatchContainer.innerText() : null;
    }

    async openAllFiltersModal(): Promise<void> {
        await this.allFiltersButton.click();
        await this.searchFilters.waitForVisible();
    }

    async selectSortOption(option: string): Promise<void> {
        await this.searchFilters.selectSortOption(option);
        await this.waitForResultsListToLoad();
    }

    async setPriceRange(minPercentage?: number, maxPercentage?: number): Promise<void> {

        if (minPercentage) {
            await this.searchFilters.setMinPrice(minPercentage);
            await this.waitForResultsListToLoad();
        }

        if (maxPercentage) {
            await this.searchFilters.setMaxPrice(maxPercentage);
            await this.waitForResultsListToLoad();
        }
    }

    async setGuestRating(minRating: string) {
        await this.searchFilters.setGuestRating(minRating);
        await this.waitForResultsListToLoad();
    }

    async toggleFreeCancellation(freeCancellation: string) {
        await this.searchFilters.toggleFreeCancellation(freeCancellation);
        await this.waitForResultsListToLoad();
    }

    async selectHotelClass(hotelClass: string) {
        await this.searchFilters.setHotelClass(hotelClass);
        await this.waitForResultsListToLoad();
    }

    async selectAmenities(amenities: string[]) {
        await this.searchFilters.selectAmenities(amenities);
        await this.waitForResultsListToLoad();
    }

    async waitForResultsListToLoad(): Promise<void> {
        await waitForRequests(this.page, "batchexecute", async () => {
        });
        for (const item of await this.loadingSpinner.all()) {
            await waitForLocatorAttributeToHaveValue(this.page, item, "aria-hidden", "true");
        }

        this.searchResultsList = await this.searchResultItemContainer.all();
    }

    async waitForSearchResultsToBeVisible(): Promise<void> {
        for (const item of await this.loadingSpinner.all()) {
            await waitForLocatorAttributeToHaveValue(this.page, item, "aria-hidden", "true");
        }
        await waitForLocatorToBeVisible(this.searchResultItemContainer.first());
    }

    async doesResultsListMatchExpectedCondition(filterType: SearchFilterType, expectedCondition: SearchConditions): Promise<boolean> {

        switch (filterType) {
            case SearchFilterType.SORT:
                return await this.checkResultsSortOrder(expectedCondition.sortOrder!.toString());
            default:
                throw new Error("Unknown filter type");
        }
    }

    async doesResultListMatchAllFilterConditions(expectedConditions: SearchConditions): Promise<boolean> {
        if (expectedConditions.sortOrder) {
            const isSortOrderMatching = await this.checkResultsSortOrder(expectedConditions.sortOrder.toString());
            if (!isSortOrderMatching) {
                return false;
            }
        }
        if (expectedConditions.amenities && expectedConditions.amenities.length > 0) {
            // Add method calls here to handle amenities check if applicable
        }

        return true;
    }

    async getLowestAccomodationPrice(): Promise<number> {

        let priceText = await this.searchResultsList[0].locator(this.resultPriceSelector).first().locator("span").last().innerText();
        this.lowestPrice = extractNumericValue(priceText);
        this.searchResultsList.shift();

        for (const resultItem of this.searchResultsList) {
            let priceText = await resultItem.locator(this.resultPriceSelector).first().locator("span").last().innerText();
            const price = extractNumericValue(priceText);
            if (price < this.lowestPrice) {
                this.lowestPrice = price;
            }
        }
        return this.lowestPrice;
    }

    async toggleSustainabilityOption(sustainabilityOption: string) {
        await this.searchFilters.toggleSustainabilityOption(sustainabilityOption);
        await this.waitForResultsListToLoad();
    }

    async getSearchSuggestionItems(): Promise<string[]> {
        await waitForLocatorToBeVisible(this.searchSuggestionsList);

        let suggestionLocators = await this.searchSuggestionsList.locator("li").all();

        let suggestionItems: string[] = [];

        for (const suggestion of suggestionLocators) {
            const suggestionText = await suggestion.getAttribute("data-suggestion");
            if (suggestionText !== null) {
                suggestionItems.push(suggestionText);
            }
        }
        return suggestionItems;
    }

    async isNoSuggestionsDisplayed(): Promise<boolean> {
        return await waitForLocatorToBeVisible(this.noSuggestionsTooltip);
    }

    async doSearchResultsHaveCurrencyCode(currencyCode: string): Promise<boolean> {
        for (const resultItem of this.searchResultsList) {
            let priceText = await resultItem.locator(this.resultPriceSelector).first().locator("span").last().innerText();
            if (!priceText.includes(currencyCode)) {
                return true;
            }
        }
        return false;
    }

    async openDatepicker() {
        await this.searchBarCheckIn.click();
        await this.datePicker.waitForVisible();
    }

    async getCheckInDate(): Promise<string> {
        return await this.searchBarCheckIn.getAttribute("data-value") ?? "";
    }

    async getCheckOutDate(): Promise<string> {
        return await this.searchBarCheckOut.getAttribute("data-value") ?? "";
    }

    async clickGuestCountButton() {
        await this.guestCountButton.click();
        await this.guestDialogMenu.waitForVisible();
    }

    async getGuestCount(): Promise<number> {
        return parseInt(await this.guestCountButton.innerText());
    }

    private async checkResultsSortOrder(expectedSortOrder: string): Promise<boolean> {

        switch (expectedSortOrder) {
            case 'Lowest price': {
                let lastPrice = 0;
                for (const resultItem of this.searchResultsList) {
                    let priceText = await resultItem.locator(this.resultPriceSelector).first().locator("span").last().innerText();
                    const price = extractNumericValue(priceText);
                    if (price < lastPrice) {
                        console.error(`Price of the result item ${price} is lower than the last price ${lastPrice}`);
                        return false;
                    }
                    lastPrice = price;
                }
                break;
            }
            case 'Highest rating': {
                let lastRating = 0;
                for (const resultItem of this.searchResultsList) {
                    let ratingText = await resultItem.locator(this.resultPriceSelector).first().locator("span").last().innerText();
                    const rating = extractNumericValue(ratingText);
                    if (rating < lastRating) {
                        console.error(`Rating of the result item ${rating} is lower than the last price ${lastRating}`);
                        return false;
                    }
                    lastRating = rating;
                }
                break;
            }
            default:
                return false;
        }

        return true;
    }
}