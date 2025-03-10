import {Then, When} from "../fixtures/fixtures";
import {expect} from "@playwright/test";
import {SearchConditions} from "../types/search-conditions";
import {expectMultiple} from "../support/utils";

Then("the searched location is displayed first", async function() {
    const searchConditions:SearchConditions = this.scenarioData.get("searchConditions");
    expect(await this.pages.explorePage.getFirstResult()).toContain(searchConditions.searchTerm);
});

Then("the number of passengers matches the values previously set", async function() {
    const searchConditions:SearchConditions = this.scenarioData.get("searchConditions");
    expect(await this.pages.explorePage.getPassengerCount())
        .toEqual((searchConditions.guests?.adults ?? 0) + (searchConditions.guests?.children ?? 0));
})

Then("departure and return dates match the previously set values", async function() {
    const searchConditions:SearchConditions = this.scenarioData.get("searchConditions");
    const departureDate = await this.pages.explorePage.getDepartureDate();
    const returnDate = await this.pages.explorePage.getReturnDate();

    expectMultiple([
        () => expect(departureDate).toEqual(searchConditions.checkInDate),
        () => expect(returnDate).toEqual(searchConditions.checkOutDate)
    ]);
})

When("the user updates the Explore page passenger data and travel dates", async function() {
    await this.pages.explorePage.openDatepicker();
    const newDepartureDate = await this.pages.explorePage.setDepartureDate();
    const newPassengerCount = await this.pages.explorePage.changeAdultCount();

    const searchConditions:SearchConditions = this.scenarioData.get("searchConditions");

    searchConditions.checkInDate = newDepartureDate;
    searchConditions.guests = { adults: newPassengerCount, children: 0}
});