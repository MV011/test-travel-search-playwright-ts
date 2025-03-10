import {BrowserContext, Page} from "playwright";
import {ConsentPage} from "./consent.page";
import {SearchPage} from "./search.page";
import {ExplorePage} from "./explore.page";

export class PagesObject {
    consentPage: ConsentPage;
    searchPage: SearchPage;
    explorePage: ExplorePage;

    constructor(public page: Page, public context: BrowserContext) {
        this.consentPage = new ConsentPage(page, context);
        this.searchPage = new SearchPage(page, context);
        this.explorePage = new ExplorePage(page, context);
    }
}
