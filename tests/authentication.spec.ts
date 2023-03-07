import { expect, test } from "@playwright/test";
import { CREDENTIALS } from "../data/constants";

test.describe('Herouku - Authentication Validations', () => {

    test('Basic Auth - Authorized', async ({ baseURL, browser }) => {
        const expected_title = 'Basic Auth';
        const context = await browser.newContext({
          httpCredentials: {
            username: CREDENTIALS.username,
            password:  CREDENTIALS.password
          }
        });
        const page = await context.newPage();
        page.goto(baseURL+'basic_auth');
        expect(await page.locator('.example h3').textContent()).toContain(expected_title);
      });

      test('Basic Auth - Unauthorized', async ({ baseURL, browser }) => {
        const expected_text = 'Not authorized';
        const context = await browser.newContext({
          httpCredentials: {
            username: '',
            password:  ''
          }
        });
        const page = await context.newPage();
        page.goto(baseURL+'basic_auth');
        expect(await page.locator('body').textContent()).toContain(expected_text);
      });

      test('Digest Auth - Authorized', async ({ baseURL, browser }) => {
        const expected_title = 'Digest Auth';
        const context = await browser.newContext({
          httpCredentials: {
            username: CREDENTIALS.username,
            password:  CREDENTIALS.password
          }
        });
        const page = await context.newPage();
        page.goto(baseURL+'digest_auth');
        expect(await page.locator('.example h3').textContent()).toContain(expected_title);
      });

      test('Digest Auth - Unauthorized', async ({ baseURL, browser }) => {
        const expected_status_code = 401;
        const context = await browser.newContext({
          httpCredentials: {
            username: '',
            password:  ''
          }
        });
        const page = await context.newPage();
        const request = await page.request.get(baseURL+'digest_auth');
        expect(request.status()).toBe(expected_status_code);
      });

})