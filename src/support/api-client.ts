import { APIRequestContext, APIResponse } from '@playwright/test';
import { RequestOptions } from "../types/request-options";

/**
 * A client for interacting with APIs using Playwright's APIRequestContext.
 * Provides reusable methods for making HTTP requests with customizable headers.
 */

export class PlaywrightApiClient {
    private readonly apiRequestContext: APIRequestContext;
    private readonly headers: Map<string, string> = new Map();

    constructor(apiRequestContext: APIRequestContext) {
        this.apiRequestContext = apiRequestContext;
    }

    /**
     * Sends an HTTP request using the specified method and endpoint.
     * @param method - The HTTP method (GET, POST, PUT, PATCH, DELETE).
     * @param endpoint - The API endpoint (relative URL).
     * @param options - Optional request parameters (headers, body, etc.).
     * @returns APIResponse or throws an error if the request fails.
     */
    public async sendRequest(method: string, endpoint: string, options: RequestOptions | null = null): Promise<APIResponse> {
        console.debug(`Sending request to endpoint: ${endpoint}`);
        this.setRequestHeaders(options);

        switch (method.toUpperCase()) {
            case 'GET':
                return this.apiRequestContext.get(endpoint, {
                    ...options,
                })
            case 'POST':
                return this.apiRequestContext.post(endpoint, options || {});
            case 'PUT':
                return this.apiRequestContext.put(endpoint, options || {});
            case 'PATCH':
                return this.apiRequestContext.patch(endpoint, options || {});
            case 'DELETE':
                return this.apiRequestContext.delete(endpoint, options || {});
            default:
                throw new Error(`Invalid HTTP method: ${method}`);
        }
    }

    /**
     * Adds a default header to be included in all API requests.
     * @param key - Header name.
     * @param value - Header value.
     */
    public addDefaultHeader(key: string, value: string): void {
        this.headers.set(key, value);
    }

    /**
     * Retrieves all currently set headers.
     * @returns Map of headers.
     */
    public getHeaders(): Map<string, string> {
        return this.headers;
    }

    /**
     * Applies default headers to the request options.
     * @param options - Request options where headers should be merged.
     */
    private setRequestHeaders(options: RequestOptions | null): void {
        if (!options) return;
        for (const [key, value] of this.headers.entries()) {
            if (!options.headers) {
                options.headers = {};
            }
            options.headers[key] = value;
        }
    }
}