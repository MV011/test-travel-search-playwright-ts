import {Then, When} from "../fixtures/fixtures";
import {SearchConditions} from "../types/search-conditions";
import {expect} from "@playwright/test";
import {expectMultiple} from "../support/utils";

When("the user opens the guests dialog menu in the search bar", async function () {
    await this.pages.searchPage.clickGuestCountButton();
});

When("the user {string} the number of Adults by {int}", async function (direction:string,count: number) {
    const initialCount = await this.pages.searchPage.guestDialogMenu.getAdultGuestCount();
    await this.pages.searchPage.guestDialogMenu.changeAdultGuestCount(direction,count);

    const searchFilters: SearchConditions = this.scenarioData.get("searchConditions") ?? {};
    if (!searchFilters.guests) {
        searchFilters.guests = { adults: initialCount + count, children: 0 };
    } else {
        searchFilters.guests.children = initialCount + count;
    }

    this.scenarioData.set("searchConditions", searchFilters);
});

When("the user {string} the number of Children by {int}", async function (direction:string,count: number) {
    const initialCount = await this.pages.searchPage.guestDialogMenu.getChildGuestCount();
    await this.pages.searchPage.guestDialogMenu.changeChildGuestCount(direction,count);

    const searchFilters: SearchConditions = this.scenarioData.get("searchConditions") ?? {};
    if (!searchFilters.guests) {
        searchFilters.guests = { adults: 2, children: initialCount + count };
    } else {
        searchFilters.guests.children = initialCount + count;
    }
    this.scenarioData.set("searchConditions", searchFilters);
});

When("clicks the Done button in the guest dropdown", async function() {
    await this.pages.searchPage.guestDialogMenu.clickDoneButton();
})

Then("the total number of guests is {int}", async function(expectedCount :number) {
   const count = await this.pages.searchPage.getGuestCount();

   expect(count).toEqual(expectedCount);
});

Then("the search bar is set to the default of 2 guests", async function() {
    const count = await this.pages.searchPage.getGuestCount();
    expect(count).toEqual(2);
})

Then("the data in the dialog menu is saved", async function() {
    await this.pages.searchPage.clickGuestCountButton();
    const actualAdultCount = await this.pages.searchPage.guestDialogMenu.getAdultGuestCount();
    const actualChildCount = await this.pages.searchPage.guestDialogMenu.getChildGuestCount();

    const searchFilters: SearchConditions = this.scenarioData.get("searchConditions") ?? {};

    expectMultiple([
        () => expect(actualAdultCount).toEqual(searchFilters.guests?.adults),
        () => expect(actualChildCount).toEqual(searchFilters.guests?.children),
    ])
});