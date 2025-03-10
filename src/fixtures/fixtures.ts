import {test as base, createBdd} from 'playwright-bdd';
import {World} from "../support/world";
import {config} from "../support/config";
import {expect} from "@playwright/test";

/**
 * Extends the Playwright-bdd base test to introduce the following fixtures:
 *
 * - A `failOnJSError` property that tracks JavaScript errors during the test execution.
 *   If set to `true`, the test will fail when JavaScript errors are detected on the page.
 *
 * - A `world` property that initializes a World scenario context object for use during testing.
 *   Behavior depends on certain tags:
 *     - Skips the test if the "@Ignore" tag is present.
 *     - Navigates the page to a base URL if the "@UI" tag is present.
 *     - Constructs the World object differently based on the test tags.
 */
export const test =
    base.extend<{ world: World; failOnJSError: boolean}>(
        {
            failOnJSError: [true, { option: true }],
            page: async({page, failOnJSError}, use) => {
                const errors: Array<Error> = [];

                page.addListener("pageerror", (error) => {
                    errors.push(error);
                });

                await use(page);

                if (failOnJSError) {
                    expect(errors).toHaveLength(0);
                }
            },
            world: async ({$tags, page, request}, use, testInfo) => {

                let world: World;

                if ($tags.includes("@Ignore")) {
                    testInfo.skip();
                }
                if ($tags.includes("@UI")) {
                    await page.goto(config.BASE_URL);
                    world = new World(page, testInfo);
                } else {
                    world = new World(page, testInfo, request);
                }
                await use(world);


            },
        });

/**
 * Enables BDD-style step definitions (`Given`, `When`, `Then`) with access to the `world` fixture.
 */
export const {Given, When, Then, Before, After} = createBdd(test, {worldFixture: 'world'});