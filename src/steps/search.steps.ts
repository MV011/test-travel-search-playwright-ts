import {Then, When} from "../fixtures/fixtures";
import {expect} from "@playwright/test";
import {SearchConditions} from "../types/search-conditions";
import {SearchFilterType} from "../enums/search-filter-type.enum";
import {expectMultiple, extractNumericValue} from "../support/utils";

When("the user enters the search term {string} and submits the search", async function(searchTerm:string) {
    await this.pages.searchPage.enterSearchTerm(searchTerm);

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        searchTerm: searchTerm
    };

    this.scenarioData.set("searchConditions", searchFilters);
});

When("the user enters the search term {string}", async function(searchTerm:string) {
    await this.pages.searchPage.enterSearchTerm(searchTerm,false);

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        searchTerm: searchTerm
    };

    this.scenarioData.set("searchConditions", searchFilters);
});

Then("no results are displayed and the {string} message is shown", async function(message:string){
    const noProperties = await this.pages.searchPage.getNoPropertiesMatchText();
    expect(noProperties).not.toBeNull();
    expect(noProperties).toContain(message);
});

Then("the search results for {string} are displayed", async function(location:string){
    const resultsHeaderText = await this.pages.searchPage.getSearchResultsHeaderText();
    expectMultiple([
        () => expect(resultsHeaderText).toContain(location),
        () => expect(extractNumericValue(resultsHeaderText)).toBeGreaterThan(0)
    ]);
});

When("waits for the results to load", async function() {
    await this.pages.searchPage.waitForResultsListToLoad();
});

When("waits for the search results to be visible", async function() {
    await this.pages.searchPage.waitForSearchResultsToBeVisible();
});

Then("the results list matches the sort order", async function() {
    const searchConditions: SearchConditions = this.scenarioData.get("searchConditions");
    expect(await this.pages.searchPage.doesResultsListMatchExpectedCondition(SearchFilterType.SORT,searchConditions)).toBeTruthy();
});

Then("no results that are cheaper than the minimum price are displayed", async function () {
    const searchConditions: SearchConditions = this.scenarioData.get("searchConditions");
    expect(await this.pages.searchPage.getLowestAccomodationPrice()).not.toBeLessThan(searchConditions.prices!.min);
});

When("sets sustainability option to {string}", async function (sustainabilityOption:string) {
    await this.pages.searchPage.toggleSustainabilityOption(sustainabilityOption);
    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        sustainability: sustainabilityOption.toLowerCase() === 'yes'
    };
    this.scenarioData.set("searchConditions", searchFilters);
});

Then("list of suggestions containing {string} is displayed below the search bar", async function (condition: string) {
    const searchTerm = (this.scenarioData.get("searchConditions") as SearchConditions).searchTerm;
    switch (condition) {
        case "accommodations and flights for the location":
        case "web search suggestions are displayed": {
            const suggestions = await this.pages.searchPage.getSearchSuggestionItems();
            expectMultiple([
                () => expect(suggestions.length).toBeGreaterThan(0),
                () => expect(suggestions.some(suggestion => searchTerm!.split(' ').some(term => suggestion.includes(term)))).toBeTruthy()
            ]);
            break;
        }
        case "no suggestions message":
            await this.pages.searchPage.isNoSuggestionsDisplayed();
            break;
        default:
            throw new Error(`Invalid parameter ${condition}`);
    }
});

When("the user opens the date picker in the search bar", async function() {
    await this.pages.searchPage.openDatepicker();

    this.scenarioData.set("initialCheckInDate",await this.pages.searchPage.datePicker.getCheckInDate());
    this.scenarioData.set("initialCheckOutDate",await this.pages.searchPage.datePicker.getCheckOutDate());
});

When("sets the check in date to {string} and the check out date to {string}", async function (startDate: string, endDate: string) {
    await this.pages.searchPage.datePicker.setCheckInDate(startDate);
    await this.pages.searchPage.datePicker.setCheckOutDate(endDate);

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        checkInDate: startDate,
        checkOutDate: endDate
    };
    this.scenarioData.set("searchConditions", searchFilters);
});

Then("the search result prices reflect the {string} currency", async function (currencyCode: string) {
    expect(await this.pages.searchPage.doSearchResultsHaveCurrencyCode(currencyCode)).toBeTruthy();
});

Then("the updated passenger and travel data is displayed", async function() {
    const actualCheckIn = await this.pages.searchPage.getCheckInDate();
    const actualGuestCount = await this.pages.searchPage.getGuestCount();
    const searchFilters: SearchConditions = this.scenarioData.get("searchConditions");

    expectMultiple([
        () => expect(actualCheckIn).toContain(searchFilters.checkInDate),
        () => expect(actualGuestCount).toContain(searchFilters.guests?.adults)
    ]);
})

