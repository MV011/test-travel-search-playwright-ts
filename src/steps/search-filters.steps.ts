import {Then, When} from "../fixtures/fixtures";
import {SearchConditions} from "../types/search-conditions";

When("selects free cancellation option as {string}", async function(freeCancellation:string) {
    await this.pages.searchPage.toggleFreeCancellation(freeCancellation);

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        freeCancellation: freeCancellation.toLowerCase() === 'yes'
    };
    this.scenarioData.set("searchConditions", searchFilters);
});

When("sets guest rating filter to {string}", async function (minRating: string) {
    await this.pages.searchPage.setGuestRating(minRating);
    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        minRating: minRating
    };
    this.scenarioData.set("searchConditions", searchFilters);
});

When("chooses {string} hotels", async function (hotelClass: string) {
    if(hotelClass.toLowerCase() !== 'no') {
        await this.pages.searchPage.selectHotelClass(hotelClass);
        const searchFilters: SearchConditions = {
            ...this.scenarioData.get("searchConditions") ?? {},
            hotelClass: hotelClass
        };
        this.scenarioData.set("searchConditions", searchFilters);
    }
});

When("selects amenities {string}", async function (amenities: string) {
    await this.pages.searchPage.selectAmenities([amenities]);
    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        amenities: [amenities]
    };
    this.scenarioData.set("searchConditions", searchFilters);
});

When("the All Filters modal is opened", async function(){
    await this.pages.searchPage.openAllFiltersModal();
});

When("the Close Filters Dialog button is clicked", async function() {
    await this.pages.searchPage.searchFilters.closeDialog();
})

When("the user sets the sorting order to {string}", async function(order: 'Relevance' | 'Lowest price' | 'Highest rating' | 'Most reviewed') {
    await this.pages.searchPage.selectSortOption(order);

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        sortOrder: order
    };

    this.scenarioData.set("searchConditions", searchFilters);
});

When("sets price range from {int} to {int}", async function(minPercentage: number, maxPercentage: number) {

    await this.pages.searchPage.setPriceRange(minPercentage,maxPercentage);

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        prices: {
            min: await this.pages.searchPage.searchFilters.getMinPrice(),
            max: await this.pages.searchPage.searchFilters.getMaxPrice()
        }
    };

    this.scenarioData.set("searchConditions", searchFilters);
});

When("increases the minimum price to {int} percent", async function(minPercentage: number){

    await this.pages.searchPage.setPriceRange(minPercentage);

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        prices: {
            min: await this.pages.searchPage.searchFilters.getMinPrice(),
        }
    };

    this.scenarioData.set("searchConditions", searchFilters);

});

When("selects {string} as the property type", async function(propertyType: string){

    await this.pages.searchPage.searchFilters.selectPropertyTypes([propertyType]);

    const searchFilters: SearchConditions = {
        ...this.scenarioData.get("searchConditions") ?? {},
        propertyTypes: [propertyType]
    };
    this.scenarioData.set("searchConditions", searchFilters);
});

Then("relevant hotel results matching the filters are displayed", async function() {

})