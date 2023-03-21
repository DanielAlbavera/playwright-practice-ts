import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page';

test.describe('2 - The Internet Herouku Validations', () => {

  let mainPage: MainPage;
  const titleHeader: string = 'h3';

  test.beforeEach( async ({ page, baseURL }) => {
    mainPage = new MainPage(page);
    await mainPage.navigate(baseURL!);
  });

  test.afterEach( async ({page}) => {
    await page.close();
  });

  test('Dynamic Controls', async ({page}) => {
    const expected_title = 'Dynamic Controls';
    await mainPage.dynamicControlsLink.click();
    const title = page.locator('h4');
    expect(await title.first().textContent()).toContain(expected_title);
    const checkbox = page.locator('#checkbox input');
    const input = page. locator('form#input-example input');
    expect(await checkbox.isEnabled()).toBeTruthy();
    expect(await input.isEnabled()).toBeFalsy();
    await page.getByText('Remove').last().click();
    await page.getByText('Enable').last().click();
    await page.getByText(`It's gone!`).waitFor({ state: 'visible'});
    await page.getByText(`It's enabled!`).waitFor({ state: 'visible'});
    expect(await checkbox.count()).toBe(0);
    expect(await input.isEnabled()).toBeTruthy();
  });

  test('Dynamic Loading', async ({page}) => {
    const expected_title = 'Dynamically Loaded Page Elements';
    await mainPage.dynamicLoadingLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    await page.getByText('Example 1: Element on page that is hidden').click();
    expect(await page.locator('.example > h4').textContent()).toContain('Example 1: Element on page that is hidden');
    const message = page.locator('div#finish');
    expect(await page.getByText('Example 1: Element on page that is hidden').isVisible()).toBeTruthy();
    expect(await message.isVisible()).toBeFalsy();
    const startButton = page.locator('div#start button');
    await startButton.click();
    await message.waitFor({ state: 'visible' });
    expect(await page.locator('div#finish').isVisible()).toBeTruthy();
    await page.goBack();
    await page.waitForLoadState('load');
    await page.getByText('Example 2: Element rendered after the fact').click();
    expect(await page.locator('h4').textContent()).toContain('Example 2: Element rendered after the fact');
    const message2 = page.locator('div#finish');
    expect(await message2.count()).toBe(0);
    await startButton.click();
    await message2.waitFor({ state: 'visible' });
    expect(await message2.isVisible()).toBeTruthy();
  });

  test('Entry Ad', async ({page}) => {
    const expected_title = 'Entry Ad';
    const expected_modal_body = `It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something or disable their ad blocker).`;
    await mainPage.entryAdLink.click();
    await modalAssertions(page, expected_modal_body);
    await page.locator('div.modal-footer p').click();
    const title = page.locator('div.example h3');
    expect(await title.textContent()).toContain(expected_title);
    await page.getByText('click here').click();
    await modalAssertions(page, expected_modal_body);
  });

  async function modalAssertions(page, expected_modal_body: string) {
    const expected_modal_title = 'This is a modal window';
    const modal_title = page.locator('div.modal-title h3');
    const modal_body = page.locator('div.modal-body p');
    await modal_title.waitFor({ state: 'visible' });
    expect(await modal_title.isVisible()).toBeTruthy();
    expect(await modal_body.isVisible()).toBeTruthy();
    expect(await modal_title.textContent()).toContain(expected_modal_title);
    expect(await modal_body.textContent()).toContain(expected_modal_body);
  }

  test('Exit Intent', async ({page}) => {
    const expected_title = 'Exit Intent';
    const expected_modal_body = `It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something).`;
    await mainPage.exitIntentLink.click();
    await page.waitForLoadState('load');
    await page.locator('html').dispatchEvent('mouseleave');
    await modalAssertions(page, expected_modal_body);
    const title = page.locator('div.example h3');
    expect(await title.isVisible()).toBeTruthy();
    expect(await title.textContent()).toContain(expected_title);
  });

  test('Floating Menu', async ({page}) => {
    const expected_title = 'Floating Menu';
    await mainPage.floatingMenuLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    const poweredByLabel = page.getByText('Powered by ');
    await poweredByLabel.scrollIntoViewIfNeeded();
    await poweredByLabel.waitFor({ state: 'visible' });
    await page.getByText('Home').click();
    expect(page.url()).toContain('#home');
    await page.getByText('News').click();
    expect(page.url()).toContain('#news');
    await page.getByText('Contact').click();
    expect(page.url()).toContain('#contact');
    await page.getByText('About').click();
    expect(page.url()).toContain('#about');
  });

  test('Forgot Password', async ({page}) => {
    const expected_title = 'Forgot Password';
    await mainPage.forgotPassword.click();
    const title = page.locator('h2');
    expect(await title.textContent()).toContain(expected_title);
    await page.locator('input#email').fill('test@test.com');
    await page.getByText('Retrieve password').click();
    expect(await page.locator('h1').textContent()).toContain('Internal Server Error');
  });

  test('Form Authentication', async ({page}) => {
    const expected_title = 'Login Page';
    await mainPage.formAuthenticationLink.click();
    const title = page.locator('h2');
    expect(await title.textContent()).toContain(expected_title);
    const loginButton =  page.locator('button');
    await loginButton.click();
    const flashMessage = page.locator('div#flash');
    expect(await flashMessage.textContent()).toContain('Your username is invalid!');
    await page.locator('input#username').fill('tomsmith'); 
    await page.locator('input#password').fill('SuperSecretPassword!');
    await loginButton.click();
    expect(await flashMessage.textContent()).toContain('You logged into a secure area!'); 
    expect(await title.textContent()).toContain('Secure Area');
    await page.locator('a.button').click();
    expect(await flashMessage.textContent()).toContain('You logged out of the secure area!');
  });

  test('Frames', async ({page}) => {
    const expected_title = 'Frames';
    await mainPage.framesLink.click();
    const title = page.locator(titleHeader);
    await page.waitForLoadState('load');
    expect(await title.textContent()).toContain(expected_title);
    await page.getByText('Nested Frames').click();
    const top_frames = page.frameLocator('[name="frame-top"]').frameLocator('frame');
    expect(await top_frames.nth(0).locator('body').textContent()).toContain('LEFT')
    expect(await top_frames.nth(1).locator('body').textContent()).toContain('MIDDLE');
    expect(await top_frames.nth(2).locator('body').textContent()).toContain('RIGHT');
    const bottom_frame = page.frameLocator('[name="frame-bottom"]');
    expect(await bottom_frame.locator('body').textContent()).toContain('BOTTOM');
    await page.goBack();
    await page.getByText('iFrame').click();
    const iframe_title = 'An iFrame containing the TinyMCE WYSIWYG Editor';
    expect(await page.locator('h3').textContent()).toContain(iframe_title);
    const iframe = page.frameLocator('[title="Rich Text Area"]');
    const text = 'I filled this iFrame';
    const text_area_locator = '#tinymce';
    const p_locator = '#tinymce p';
    await iframe.locator(p_locator).waitFor({ state: 'visible' });
    await iframe.locator(text_area_locator).fill(text);
    expect(await iframe.locator(p_locator).textContent()).toContain(text);
  });

});
