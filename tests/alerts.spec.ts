import { test, expect, Page, Locator } from '@playwright/test';
import { MainPage } from '../pages/main.page';

test.describe('The Internet Herouku Dialogs Validations', () => {

  const titleHeader: string = 'h3';
  const expected_title = 'JavaScript Alerts';
  let mainPage: MainPage;
  let alert_message = '';
  let prompt_message = 'testing prompt';
  let resultLabel: Locator;

  test.beforeEach( async ({ page, baseURL }) => {
    mainPage = new MainPage(page);
    await mainPage.navigate(baseURL!);
    await mainPage.javaScriptAlertsLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    resultLabel = page.locator('#result');
  });

  test.afterEach( async ({page}) => {
    await page.close();
  });

  test('JavaScript Alert', async ({page}) => {
    page.on('dialog', async dialog => {
      alert_message = dialog.message();
      await dialog.accept();
    });
    await page.getByText('Click for JS Alert').click();
    expect(alert_message).toContain('I am a JS Alert');
    expect(await resultLabel.textContent()).toContain('You successfully clicked an alert');
  });

  test('JavaScript Confirm', async ({page}) => {
    page.on('dialog', async dialog => {
        alert_message = dialog.message();
        await dialog.accept();
      });
    await page.getByText('Click for JS Confirm').click();
    expect(alert_message).toContain('I am a JS Confirm');
    expect(await resultLabel.textContent()).toContain('You clicked: Ok');
  });

  test('JavaScript Cancel', async ({page}) => {
    page.on('dialog', dialog => {
        alert_message = dialog.message();
        dialog.dismiss();
      });
      await page.getByText('Click for JS Confirm').click();
      expect(alert_message).toContain('I am a JS Confirm');
      expect(await resultLabel.textContent()).toContain('You clicked: Cancel');
  });

  test('JavaScript Prompt Accept', async ({page}) => {
    page.on('dialog', dialog => {
        alert_message = dialog.message();
        dialog.accept(prompt_message);
      });
      await page.getByText('Click for JS Prompt').click();
      expect(alert_message).toContain('I am a JS prompt');
      expect(await resultLabel.textContent()).toContain(`You entered: ${prompt_message}`);
  });

  test('JavaScript Prompt Cancel', async ({page}) => {
    page.on('dialog', dialog => {
        alert_message = dialog.message();
        dialog.dismiss();
      });
      await page.getByText('Click for JS Prompt').click();
      expect(alert_message).toContain('I am a JS prompt');
      expect(await resultLabel.textContent()).toContain('You entered: null');
    });

  });
