import {BaseComponent} from "./base.component";
import {expect, Locator, Page} from "@playwright/test";
import {extractNumericValue, waitForLocatorToBeHidden, waitForLocatorToBeVisible} from "../../support/utils";

export class SearchFiltersComponent extends BaseComponent {
    private readonly sortFilterSection: Locator;
    private readonly priceSlider: Locator;
    private readonly priceSliderMinLabel: Locator;
    private readonly priceSliderMaxLabel: Locator;
    private readonly freeCancellation: Locator;
    private readonly sustainabilityOption: Locator;
    private readonly closeButton: Locator;

    constructor(page: Page) {
        const rootLocator = page.locator('//div[@role="dialog" and @aria-modal="true" and contains(@class, "dq93Ae")]');
        super(page, rootLocator);
        this.sortFilterSection = super.getChildElement('div[aria-label=\'Sort results\']');
        this.closeButton = super.getChildElement('(//button[@aria-label=\'Close dialog\'])[1]');
        this.priceSlider = super.getChildElement('div[jsname=SxecR]');
        this.priceSliderMinLabel = super.getChildElement('.VfPpkd-MIfjnf-uDEFge-fmcmS').nth(0);
        this.priceSliderMaxLabel = super.getChildElement('.VfPpkd-MIfjnf-uDEFge-fmcmS').nth(1);
        this.freeCancellation = super.getChildElement('//label[text()=\'Free cancellation\']');
        this.sustainabilityOption = super.getChildElement('//label[text()=\'Eco-certified\']');

    }

    async selectSortOption(option: string): Promise<void> {
        await this.sortFilterSection.locator(`//label[contains(text(), '${option}')]`).click();
    }

    async closeDialog(): Promise<void> {
        await this.closeButton.click();
        await waitForLocatorToBeHidden(this.closeButton);
    }

    async setMinPrice(minPercentage: number): Promise<void> {
        const sliderBox = await this.priceSlider.boundingBox();
        const minPriceLabelBoxInitial = await this.priceSliderMinLabel.boundingBox();


        if (sliderBox) {
            const {x, y, width, height} = sliderBox;
            await this.page.mouse.move(x, y + height / 2, {steps: 30});
            await this.page.mouse.down();
            await this.page.mouse.move(x + (minPercentage / 100) * width, y + height / 2, {steps: 30});
            await this.page.mouse.up();

            await this.priceSliderMinLabel.boundingBox().then(box => {
                expect(box!.x > minPriceLabelBoxInitial!.x)
            });

        } else {
            throw new Error('Slider not visible or bounding box unavailable.');
        }
    }

    async setMaxPrice(maxPercentage: number): Promise<void> {
        const sliderBox = await this.priceSlider.boundingBox();
        const maxPriceLabelBoxInitial = await this.priceSliderMinLabel.boundingBox();

        if (sliderBox) {

            const {x, y, width, height} = sliderBox;
            await this.page.mouse.move(x + width, y + height / 2, {steps: 30});
            await this.page.mouse.down();
            await this.page.mouse.move(x + (maxPercentage / 100) * width, y + height / 2, {steps: 30});
            await this.page.mouse.up();

            await this.priceSliderMaxLabel.boundingBox().then(box => {
                expect(box!.x < maxPriceLabelBoxInitial!.x)
            });

        } else {
            throw new Error('Slider not visible or bounding box unavailable.');
        }
    }

    async selectPropertyTypes(types: string[]): Promise<void> {
        await waitForLocatorToBeVisible(this.page.locator(`//span[text()=\'${types[0]}\']`))
        for (const type of types) {
            await this.page.locator(`//span[text()='${type}']`).click();
        }
    }

    async toggleFreeCancellation(freeCancellation: any) {
        let getCurrentState = await this.freeCancellation.locator('xpath=following::input[1]').getAttribute('checked');

        if (freeCancellation.toLowerCase() === "yes" && getCurrentState !== "true" ||
            freeCancellation.toLowerCase() === "no" && getCurrentState === "true") {
            await this.freeCancellation.click();
        }
    }

    async setGuestRating(minRating: string) {
        let element = super.getChildElement(`div.FgDwhd.QB2Jof:has(span:text("${minRating}"))`);
        await element.click();
    }

    async setHotelClass(hotelClass: string) {
        let element = super.getChildElement(`div.FgDwhd:has(span:text("${hotelClass}"))`);
        await element.click();
    }

    async selectAmenities(amenities: string[]) {
        for (const amenity of amenities) {
            let element = super.getChildElement(`div.FgDwhd:has(input[aria-label="${amenity}"])`);
            await element.click();
        }
    }

    async toggleSustainabilityOption(sustainabilityOption: string) {
        let getCurrentState = await this.sustainabilityOption.locator('xpath=following::input[1]').getAttribute('checked');

        if (sustainabilityOption.toLowerCase() === "yes" && getCurrentState !== "true" ||
            sustainabilityOption.toLowerCase() === "no" && getCurrentState === "true") {
            await this.sustainabilityOption.click();
        }
    }

    async getMinPrice(): Promise<number> {
        const minPrice = await this.priceSliderMinLabel.innerText();
        return extractNumericValue(minPrice);
    }

    async getMaxPrice(): Promise<number> {
        const maxPrice = await this.priceSliderMinLabel.innerText();
        return extractNumericValue(maxPrice);
    }
}


