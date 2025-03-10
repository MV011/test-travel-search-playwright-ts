import {BrowserContext, Page} from "playwright";
import {HeaderComponent} from "./header.component";
import {MainMenuComponent} from "./main-menu.component";

/**
 * Container for common component page objects
 */
export class ComponentsObject {
    public readonly header: HeaderComponent;
    public readonly mainMenu: MainMenuComponent;

    constructor(public page: Page, public context: BrowserContext) {
        this.header = new HeaderComponent(page);
        this.mainMenu = new MainMenuComponent(page);

    }
}
