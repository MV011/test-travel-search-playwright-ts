import {ReadStream} from "node:fs";
import {Serializable} from "playwright-core/types/structs";

/**
 * Represents the options for configuring an HTTP request.
 */

export interface RequestOptions {

    data?: string | Buffer | Serializable;
    failOnStatusCode?: boolean;
    form?: { [p: string]: string | number | boolean } | FormData;
    headers?: { [p: string]: string };
    ignoreHTTPSErrors?: boolean;
    maxRedirects?: number;
    maxRetries?: number;
    multipart?:
        FormData |
        {
            [p: string]:
                string |
                number |
                boolean |
                ReadStream |
                { name: string; mimeType: string; buffer: Buffer }
        };
    params?:
        { [p: string]: string | number | boolean } |
        URLSearchParams |
        string;
    timeout?: number;

}