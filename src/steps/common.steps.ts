import {Given, When} from "../fixtures/fixtures";
import {PageName} from "../enums/page.enum";

const pageNavigationMap = {
    [PageName.HOTELS_SEARCH]: async function(context: any) {
        await context.pages.searchPage.navigateTo();
    },
    [PageName.VACATION_RENTALS]: async function(context: any) {
        await context.commonComponents.header.navigateToHolidayRentals();
    },
    [PageName.EXPLORE]: async function(context: any) {
        await context.commonComponents.header.navigateToExplore();
    },
    [PageName.FLIGHTS]: async function(context: any) {
        await context.commonComponents.header.navigateToFlights();
    }
};


Given("user navigates to the {string} page", async function(pageName: string) {
    const navigationFunction = pageNavigationMap[pageName as PageName];
    if (!navigationFunction) {
        const availablePages = Object.values(PageName).join(', ');
        throw new Error(
            `Invalid page name: "${pageName}". Available pages are: ${availablePages}`
        );
    }
    await navigationFunction(this);
});

When("the currency is changed to {string}", async function(currencyCode: string) {
    await this.commonComponents.header.clickMainMenu();
    await this.commonComponents.mainMenu.changeCurrency(currencyCode);
    await this.pages.searchPage.waitForResultsListToLoad();
})