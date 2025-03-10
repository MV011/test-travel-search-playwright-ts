import {Given, When} from "../fixtures/fixtures";
import {expect} from "@playwright/test";


Given("the user is redirected to the consent page", async function()
{
    expect(await this.pages.consentPage.isHeaderDisplayed()).toBeTruthy();
});

When("the user clicks the Accept all cookies button", async function() {
    await this.pages.consentPage.clickAcceptAllButton();
});