import { test,  expect, Page, BrowserContext } from "@playwright/test";
import { HTTPS_CREDENTIALS } from "../data/constants";
import { FileHandler } from "../utils/file-handling";

test.describe('Herouku - Secure Download Validations', () => {

    let page: Page;
    let context: BrowserContext;
    const path = './download';

    test.afterEach( async () => {
        await page.close();
        await context.close();
    });

    test.afterAll( async () => {
        await FileHandler.removeAllFiles(path); 
    });

    test('Secure Download - Authoraized', async ({ browser, baseURL }) => {
        const expected_title = 'Secure File Downloader';
        context = await browser.newContext(HTTPS_CREDENTIALS.validCredentials);
        page = await context.newPage();
        await page.goto(baseURL+'download_secure');
        expect(await page.locator('h3').textContent()).toContain(expected_title);
        const downloadLink = page.locator('.example> a').first();
        const downloadPromise = page.waitForEvent('download');
        await downloadLink.click();
        const fileName = await downloadLink.textContent() || 'NOT DOWNLOADED';
        const downloadedFile = await downloadPromise;
        await downloadedFile.saveAs(`${path}/${fileName}`);
        const files = new Set(await FileHandler.readFiles(path));
        expect(files.has(fileName)).toBeTruthy();
    });    

    test('Secure Download - Unauthoraized', async ({baseURL, browser}) => {
        const expected_text = 'Not authorized';
        context = await browser.newContext(HTTPS_CREDENTIALS.invalidCredentials);
        page = await context.newPage();
        await page.goto(baseURL+'download_secure');
        expect(await page.locator('body').textContent()).toContain(expected_text);
    });

});
