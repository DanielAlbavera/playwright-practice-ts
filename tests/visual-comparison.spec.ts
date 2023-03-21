import { test, expect, Page } from '@playwright/test';
import { MainPage } from '../pages/main.page';

test.describe('Heroku Visual Comparison', () => {
    
    let page: Page;
    let mainPage: MainPage;

    test.afterEach( async () => {
        await page.close();
    });

    test('Sortable Data Tables', async ({browser, baseURL}) => {
        page = await browser.newPage({ viewport: { height: 1920, width: 1080}});
        mainPage = new MainPage(page);
        await mainPage.navigate(baseURL!);
        const expected_title = 'Data Tables';
        await mainPage.sortableDataTablesLink.click();
        expect(await page.locator('h3').textContent()).toContain(expected_title);
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('unsorted-tables.png');        
        await page.getByText('Last Name').first().click();
        await page.getByText('Last Name').last().click();
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('last-name-ascend-sorted-tables.png');
        await page.getByText('Last Name').first().click();
        await page.getByText('Last Name').last().click();
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('last-name-descend-sorted-tables.png');
        await page.getByText('First Name').first().click();
        await page.getByText('First Name').last().click();
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('first-name-ascend-sorted-tables.png');
        await page.getByText('First Name').first().click();
        await page.getByText('First Name').last().click();
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('first-name-descend-sorted-tables.png');
        await page.getByText('Email').first().click();
        await page.getByText('Email').last().click();
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('email-ascend-sorted-tables.png');
        await page.getByText('Email').first().click();
        await page.getByText('Email').last().click();
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('email-descend-sorted-tables.png');
        await page.getByText('Due').first().click();
        await page.getByText('Due').last().click();
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('due-ascend-sorted-tables.png');
        await page.getByText('Due').first().click();
        await page.getByText('Due').last().click();
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('due-descend-sorted-tables.png');
        await page.getByText('Web Site').first().click();
        await page.getByText('Web Site').last().click();
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('web-site-ascend-sorted-tables.png');
        await page.getByText('Web Site').first().click();
        await page.getByText('Web Site').last().click();
        await page.waitForLoadState();
        expect(await page.screenshot({fullPage: true})).toMatchSnapshot('web-site-descend-sorted-tables.png');
      });

});
