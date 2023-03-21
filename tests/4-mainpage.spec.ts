import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { TransformString } from '../utils/string-functions';

test.describe('4 - The Internet Herouku Validations', () => {

  let mainPage: MainPage;
  const titleHeader: string = 'h3';

  test.beforeEach( async ({ page, baseURL }) => {
    mainPage = new MainPage(page);
    await mainPage.navigate(baseURL!);
  });

  test.afterEach( async ({page}) => {
    await page.close();
  });

  test('Notification Messages', async ({page}) => {
    const expected_title = 'Notification Message';
    const success = 'Action successful';
    const unsuccess = 'Action unsuccesful, please try again';
    await mainPage.notificationMessageLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    const notification = page.locator('#flash');
    await page.locator('a.close').click();
    await page.getByText('Click here').click();
    const resultsSet = new Set([ success, unsuccess]);
    const text = await notification.textContent() || 'INVALID TEXT';
    const removeAlphas = TransformString.removeNonAlphaNumericKeepingComa(text);
    const textModified = TransformString.removeSpacesAtBeginandEnd(removeAlphas);
    expect(resultsSet.has(textModified)).toBeTruthy();
  });

  test('Redirect Link', async ({page}) => {
    const expected_title = 'Redirection';
    const currentUrl = 'https://the-internet.herokuapp.com/redirector';
    const redirect = 'https://the-internet.herokuapp.com/redirect';
    const to = 'https://the-internet.herokuapp.com/status_codes';
    let redirectedFrom: string = '';
    let redirectedTo: string = ''; 
    await mainPage.redirectLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    expect(page.url()).toBe(currentUrl);
    page.on('response', async response => {
      let requestURL = response.request().url();
      if(requestURL.includes('/redirect')){
        redirectedFrom = requestURL;
        redirectedTo = response.headers()['location'];      
      }
    });
    await page.getByText('here').click();
    await page.waitForLoadState();
    expect(redirect).toBe(redirectedFrom);
    expect(to).toBe(redirectedTo);
  });

  test('Shadow DOM', async ({page}) => {
    const expected_title = 'Simple template';
    const span_text = `Let's have some different text!`;
    const li_text = `Let's have some different text!
    In a list!`;
    await mainPage.shadowDOMLink.click();
    expect(await page.locator('h1').textContent()).toContain(expected_title);
    const shadowDOMSpan = page.locator('my-paragraph span');
    const shadowDOMList = page.locator('my-paragraph ul');
    expect(await shadowDOMSpan.textContent()).toContain(span_text);
    expect(await shadowDOMList.textContent()).toContain(li_text);
  });

  test('Shifting Content', async ({page}) => {
    const expected_title = 'Shifting Content';
    const not_found = 'Not Found';
    await mainPage.shiftingContentLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    await page.getByText('Example 1: Menu Element').click();
    expect(await page.locator(titleHeader).textContent()).toContain('Shifting Content: Menu Element');
    await page.getByText('Gallery').click();
    expect(await page.locator('h1').textContent()).toContain(not_found);
    expect(page.url()).toContain('gallery');
    await page.goBack();
    await page.goBack();
    await page.getByText('Example 2: An image').click();
    expect(await page.locator(titleHeader).textContent()).toContain('Shifting Content: Image');
    const image = page.locator('img.shift');
    await image.waitFor({ state: 'visible' });
    expect(await image.isVisible()).toBeTruthy();
    expect(page.url()).toContain('image');
    await page.goBack();
    await page.getByText('Example 3: List').click();
    expect(await page.locator(titleHeader).textContent()).toContain('Shifting Content: List');
    expect(page.url()).toContain('list');
  });

  test('Slow Resources', async ({page}) => {
    const expected_title = 'Slow Resources';
    let status: number = 0;
    //mocking slow_external request to be 200
    page.route('**/slow_external', route => { route.fulfill() });
    page.on('response', response => {
      const url = response.request().url();
      if (url.includes('slow_external')) status = response.status();
    });
    await mainPage.slowResourcesLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    expect(status).toBe(200);
  });

  test('Status Codes', async ({page}) => {
    const expected_title = 'Status Codes';
    let statusCode: number = 0;
    await mainPage.statusCodesLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    page.on('response', response => {
      if (response.url().includes('/status_codes/200')) {
        statusCode = response.status();
      }
    });
    await page.getByText('200').click();
    expect(statusCode).toBe(200);
    await page.goBack();
    page.on('response', response => {
      if (response.url().includes('/status_codes/301')) {
        statusCode = response.status();
      }
    });
    await page.getByText('301').click();
    expect(statusCode).toBe(301);
    await page.goBack();
    page.on('response', response => {
      if (response.url().includes('/status_codes/404')) {
        statusCode = response.status();
      }
    });
    await page.getByText('404').click();
    expect(statusCode).toBe(404);
    await page.goBack();
    page.on('response', response => {
      if (response.url().includes('/status_codes/500')) {
        statusCode = response.status();
      }
    });
    await page.getByText('500').click();
    expect(statusCode).toBe(500);
 });

  test('Typos', async ({page}) => {
    const expected_title = 'Typos';
    const typo = /Sometimes you'll see a typo, other times you won('|,)t\./;
    await mainPage.typosLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    expect(await page.locator('.example p').last().textContent()).toMatch(typo);
  });

  test('WYSIWYG Editor', async ({page}) => {
    const expected_title = 'An iFrame containing the TinyMCE WYSIWYG Editor';
    const test_text = 'Testing inside an iFrame';
    await mainPage.wysiwygEditorLink.click();
    await page.waitForLoadState();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    const iFrame = page.frameLocator('.tox-edit-area__iframe');
    const textArea = iFrame.locator('#tinymce');
    await textArea.clear();
    await textArea.type(test_text);
    expect(await textArea.textContent()).toContain(test_text);
  });

});
