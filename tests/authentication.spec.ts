import { expect, test, Page, BrowserContext, Browser } from "@playwright/test";
import { HTTPS_CREDENTIALS } from "../data/constants";

test.describe('Herouku - Authentication Validations', () => {

    let page: Page;
    let context: BrowserContext;

    test.afterEach( async () => {
      await page.close();
      await context.close();
    });

    test('Basic Auth - Authorized', async ({ browser, baseURL  }) => {
        const expected_title = 'Basic Auth';
        context = await browser.newContext(HTTPS_CREDENTIALS.validCredentials);
        page = await context.newPage();
        await page.goto(baseURL+'basic_auth');
        expect(await page.locator('.example h3').textContent()).toContain(expected_title);
      });

      test('Basic Auth - Unauthorized', async ({ baseURL, browser }) => {
        const expected_text = 'Not authorized';
        context = await browser.newContext(HTTPS_CREDENTIALS.invalidCredentials);
        page = await context.newPage();
        await page.goto(baseURL+'basic_auth');
        expect(await page.locator('body').textContent()).toContain(expected_text);
      });

      test('Digest Auth - Authorized', async ({ browser, baseURL }) => {
        const expected_title = 'Digest Auth';
        context = await browser.newContext(HTTPS_CREDENTIALS.validCredentials);
        page = await context.newPage();
        await page.goto(baseURL+'digest_auth');
        expect(await page.locator('.example h3').textContent()).toContain(expected_title);
      });

      test('Digest Auth - Unauthorized', async ({ baseURL, browser }) => {
        const expected_status_code = 401;
        context = await browser.newContext(HTTPS_CREDENTIALS.invalidCredentials);
        page = await context.newPage();
        const request = await page.request.get(baseURL+'digest_auth');
        expect(request.status()).toBe(expected_status_code);
      });

});
