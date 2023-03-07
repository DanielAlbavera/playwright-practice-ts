import { Browser, Page } from '@playwright/test';

export abstract class BasePage {

    protected browser: Browser;
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string) {
        await this.page.goto(url);
        await this.page.waitForLoadState('load');
    }

    async clickMultiple(text: string, count: number) {
        for (let i = 0; i < count; i++) {
            await this.page.getByText(text).first().click();
        }
    }

}