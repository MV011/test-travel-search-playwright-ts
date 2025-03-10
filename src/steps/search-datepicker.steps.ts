import {Then, When} from "../fixtures/fixtures";
import {getDateDifference, getDateWithOffset} from "../support/date-utils";
import {SearchConditions} from "../types/search-conditions";
import {expect} from "@playwright/test";
import {expectMultiple} from "../support/utils";

When("the user selects a check-out date earlier than the check-in date", async function () {
    const checkInDate = await this.pages.searchPage.getCheckInDate();

    const newCheckOutDate = getDateWithOffset(-2,checkInDate)
    await this.pages.searchPage.datePicker.setCheckOutDate(newCheckOutDate);

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        checkInDate: getDateWithOffset(-1,newCheckOutDate),
        checkOutDate: newCheckOutDate
    };
    this.scenarioData.set("searchConditions", searchFilters);

});

When("selects a check-in date earlier than today's date", async function () {
    const date = getDateWithOffset(-5);
    await this.pages.searchPage.datePicker.setCheckInDate(date);
});

When("selects a check-out date earlier than today's date", async function () {
    const date = getDateWithOffset(-5);
    await this.pages.searchPage.datePicker.setCheckOutDate(date);
});

When("sets the check in date to a date in the future", async function () {
    const date = getDateWithOffset(30);
    await this.pages.searchPage.datePicker.setCheckInDate(date);

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        checkInDate: date,
    };

    if(!searchFilters.checkOutDate) {
        searchFilters.checkOutDate = getDateWithOffset(1,date);
    }

    this.scenarioData.set("searchConditions", searchFilters);
});

When("presses the date picker arrow to {string} the checkout date by {int} days", async function(direction:string,days:number){
    let checkOutDate = await this.pages.searchPage.getCheckOutDate();
    await this.pages.searchPage.datePicker.pressCheckoutDateArrow(direction,days);

    console.log(getDateWithOffset(days,checkOutDate));

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        checkOutDate: getDateWithOffset(days,checkOutDate)
    };
    this.scenarioData.set("searchConditions", searchFilters);
});

When("clicks the Date Picker Done button", async function() {
    await this.pages.searchPage.datePicker.clickDoneButton();
});
Then("the selected check-in and check-out dates are displayed in the search bar", async function () {
    const searchConditions:SearchConditions = this.scenarioData.get("searchConditions") ?? {};
    if(searchConditions.checkInDate) {
        expect(await this.pages.searchPage.getCheckInDate()).toEqual(searchConditions.checkInDate);
    }
    if(searchConditions.checkOutDate) {
        expect(await this.pages.searchPage.getCheckOutDate()).toEqual(searchConditions.checkOutDate);
    }
});

Then("the selected check-in date is displayed in the search bar", async function() {
    const searchConditions:SearchConditions = this.scenarioData.get("searchConditions") ?? {};
    expect(await this.pages.searchPage.getCheckInDate()).toEqual(searchConditions.checkInDate);
});

Then("the selected check-out date is displayed in the search bar", async function() {
    const searchConditions:SearchConditions = this.scenarioData.get("searchConditions") ?? {};
    expect(await this.pages.searchPage.getCheckOutDate()).toEqual(searchConditions.checkOutDate);
});

Then("the check-in date is one day before the new check-out date", async function(){
    const expectedCheckOutDate = (this.scenarioData.get("searchConditions") as SearchConditions).checkOutDate;
    const expectedCheckInDate = (this.scenarioData.get("searchConditions") as SearchConditions).checkInDate;
    const checkInDate = await this.pages.searchPage.getCheckInDate();
    const checkOutDate = await this.pages.searchPage.getCheckOutDate();
    const dateDifference = getDateDifference(checkInDate,checkOutDate);

    expectMultiple([
        () => expect(checkInDate).toEqual(expectedCheckInDate),
        () => expect(checkOutDate).toEqual(expectedCheckOutDate),
        () => expect(dateDifference).toEqual(1)
    ])
});

Then("the check-in date remains unchanged", async function () {
    const initialCheckIn = this.scenarioData.get("initialCheckInDate") as string;
    const actualCheckIn = await this.pages.searchPage.getCheckInDate();

    expect(actualCheckIn).toEqual(initialCheckIn);
});

Then("the check-out date remains unchanged", async function () {
    const initialCheckOut = this.scenarioData.get("initialCheckInDate") as string;
    const actualCheckOut = await this.pages.searchPage.getCheckInDate();

    expect(actualCheckOut).toEqual(initialCheckOut);
});