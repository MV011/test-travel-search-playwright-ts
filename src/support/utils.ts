import {Locator} from '@playwright/test';
import {DataTable} from "playwright-bdd";
import {Page, Request} from "playwright";


/**
 * Waits for the specified locator to be visible on the page.
 * If the locator does not become visible after waiting, an error is thrown.
 *
 * @param {Locator} locator - The locator of the element to wait for visibility.
 * @return {Promise<boolean>} A promise that resolves to true if the locator is visible.
 * @throws {Error} If the element does not become visible after waiting.
 */
export async function waitForLocatorToBeVisible(locator: Locator): Promise<boolean> {
    await locator.waitFor();
    if (!(await locator.isVisible())) {
        throw new Error(`Element is not visible after waiting: ${locator}`);
    }
    return true;
}


/**
 * Waits for a specific locator to become hidden before proceeding.
 * Will throw an error if the locator is still visible after waiting.
 *
 * @param {Locator} locator - The locator object representing the element to wait for.
 * @return {Promise<boolean>} A promise that resolves to true if the locator successfully becomes hidden.
 */
export async function waitForLocatorToBeHidden(locator: Locator): Promise<boolean> {
    await locator.waitFor({state: 'hidden'});
    if (await locator.isVisible()) {
        throw new Error(`Element is not visible after waiting: ${locator}`);
    }
    return true;
}


/**
 * Waits for all matching network requests to complete after executing the specified action.
 *
 * @param page - The Playwright Page object to monitor
 * @param urlPattern - The URL substring to match requests against
 * @param action - The async action to execute and wait for its requests to complete
 * @param timeoutMs - Maximum time to wait for requests to complete (default: 30000ms)
 */
export async function waitForRequests(
    page: Page,
    urlPattern: string,
    action: () => Promise<void>,
    timeoutMs = 30000
): Promise<void> {
    const pendingRequests = new Set<Request>();
    let requestCompleted = false;

    const onRequest = (request: Request): void => {
        if (request.url().includes(urlPattern)) {
            console.log(`Waiting for request: ${request.url()}`);
            pendingRequests.add(request);
        }
    };

    const onRequestComplete = (request: Request): void => {
        if (request.url().includes(urlPattern)) {
            console.log(`Request completed: ${request.url()}`);
            pendingRequests.delete(request);
        }
        if (pendingRequests.size === 0) {
            requestCompleted = true;
        }
    };

    page.on('request', onRequest);
    page.on('requestfinished', onRequestComplete);
    page.on('requestfailed', onRequestComplete);

    try {
        await action();

        const startTime = Date.now();
        while (!requestCompleted && Date.now() - startTime < timeoutMs) {
            await page.waitForTimeout(100); // Poll every 100ms
        }

        if (!requestCompleted) {
            throw new Error(`Pending requests did not complete within ${timeoutMs}ms timeout`);
        }
    } finally {
        page.off('request', onRequest);
        page.off('requestfinished', onRequestComplete);
        page.off('requestfailed', onRequestComplete);
    }
}

/**
 * Waits for a specific attribute of an element to update from its initial value within a specified timeout.
 *
 * @param {Page} page - The Playwright page instance to interact with.
 * @param {Locator} locator - The locator identifying the element to monitor for attribute changes.
 * @param {string} attribute - The name of the attribute to monitor for changes.
 * @param {string} initialValue - The initial value of the attribute to compare against.
 * @param {number} [timeout=5000] - The maximum time to wait, in milliseconds, for the attribute to change. Defaults to 5000ms.
 * @return {Promise<boolean>} Returns true if the attribute is updated within the timeout, otherwise throws an error.
 */
export async function waitForAttributeUpdate(page: Page, locator: Locator, attribute: string, initialValue: string, timeout: number = 5000): Promise<boolean> {
    console.log(`Waiting for attribute '${attribute}' to change from '${initialValue}'`);
    const result = await page.waitForFunction(
        async (args) => {
            console.log(args.elementHandle?.getAttribute(args.attributeName));
            return args.elementHandle && args.elementHandle.getAttribute(args.attributeName) !== args.initialValue;
        },
        {
            elementHandle: await locator.elementHandle(),
            attributeName: attribute,
            initialValue,
            timeout: timeout
        }
    ).catch(() => false);
    if (!result) {
        throw new Error(`Attribute '${attribute}' did not change from '${initialValue}' within ${timeout}ms timeout`);
    }
    return true;
}


/**
 * Processes a data table and converts it into an array of maps with string keys and values.
 *
 * @param {any} dataTable - The data table input to be processed. It is expected to have a method `asMaps` for conversion.
 * @return {Array<Map<string, string>>} An array of maps where each map represents a row of the table with string keys and values.
 */
export function processDataTable(dataTable: DataTable): Array<Map<string, string>> {
    return dataTable.hashes().map(row => new Map(Object.entries(row)));
}

/**
 * Executes multiple assertions and collects all failures before reporting them
 * @param assertions An array of assertion functions to execute
 * @throws Error with all collected assertion failures if any assertions fail
 */
export function expectMultiple(assertions: Array<() => void>): void {
    const failures: string[] = [];

    assertions.forEach((assertion, index) => {
        try {
            assertion();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? `Assertion ${index + 1}: ${error.message}`
                : `Assertion ${index + 1}: ${String(error)}`;

            failures.push(errorMessage);
        }
    });

    if (failures.length > 0) {
        throw new Error(`The following assertions failed:\n${failures.join('\n')}`);
    }
}

/**
 * Extracts the numeric value from a string by removing non-numeric characters.
 *
 * @param text The string containing the price value with possible non-numeric characters.
 * @return The numeric value extracted from the price string as a number.
 */
export function extractNumericValue(text: string): number {
    return parseFloat(text.replace(/[^0-9.]/g, ""));
}