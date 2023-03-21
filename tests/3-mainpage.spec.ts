import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { FileHandler } from '../utils/file-handling';

test.describe('3 - The Internet Herouku Validations', () => {

  let mainPage: MainPage;
  const titleHeader: string = 'h3';

  test.beforeEach( async ({ page, baseURL }) => {;
    mainPage = new MainPage(page);
    await mainPage.navigate(baseURL!);
  });

  test.afterEach( async ({page}) => {
    await page.close();
  });

  test.afterAll( async () => {
    await FileHandler.removeAllFiles('./download');
  });

  test('Horizontal Slider', async ({page}) => {
    const expected_title = 'Horizontal Slider';
    await mainPage.horizontalSliderLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    const slider = page.locator('input[type="range"]');
    const slider_value = page.locator('span#range');
    const slider_min_value = 0;
    const slider_max_value = 5;
    let value = 0;
    while( value != slider_max_value) {
      await slider.press('ArrowRight');
      value+=0.5;
      expect(await slider_value.textContent()).toBe(value.toString());
    }
    expect(await slider_value.textContent()).toBe(slider_max_value.toString());
    while( value != slider_min_value) {
      await slider.press('ArrowLeft');
      value-=0.5;
      expect(await page.locator('span#range').textContent()).toBe(value.toString());
    }
    expect(await slider_value.textContent()).toBe(slider_min_value.toString());
    await slider.dragTo(slider_value);
    expect(await slider_value.textContent()).toBe(slider_max_value.toString());
    await slider.dragTo(slider, { targetPosition: { x: 0, y: 0 }});
    expect(await slider_value.textContent()).toBe(slider_min_value.toString());
  });

  test('Hovers', async ({page}) => {
    const expected_title = 'Hovers';
    await mainPage.hoversLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    const images = page.locator('div.figure img');
    for (let index = 0; index < await images.count(); index++) {
      await images.nth(index).hover();
      let name = page.locator('div.figcaption h5');
      expect(await name.nth(index).isVisible()).toBeTruthy();
      expect(await name.nth(index).textContent()).toContain(`name: user${index+1}`);
      await page.getByText('View profile').nth(index).click();
      expect(page.url()).toContain(`users/${index+1}`);
      await page.goBack();
    }
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
  });

  test('Infinite Scroll', async ({ context, page }) => {
    const expected_title = 'Infinite Scroll';
    const pagePromise = context.waitForEvent('page');
    await mainPage.infiniteScrollLink.click();
    expect( await page.locator(titleHeader).textContent()).toContain(expected_title);
    const footerLink = page.locator('#page-footer a');
    await footerLink.scrollIntoViewIfNeeded();
    await footerLink.click();
    const newTab = await pagePromise;
    await newTab.waitForLoadState();
    expect(newTab.url()).toContain('http://elementalselenium.com/');
  });

  test('Inputs', async ({page}) => {
    const expected_title = 'Inputs';
    await mainPage.inputsLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    const input = page.locator('input');
    expect(await input.isVisible()).toBeTruthy();
    await input.fill('0');
    expect(await input.inputValue()).toBe('0');
    await input.press('ArrowDown');
    expect(await input.inputValue()).toBe('-1');
    await input.press('ArrowUp');
    await input.press('ArrowUp');
    expect(await input.inputValue()).toBe('1');
    });

    test('JQuery UI Menus', async ({page}) => {
      const path = './download';
      const expected_title = 'JQueryUI - Menu';
      await mainPage.jQueryUIMenusLink.click();
      expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
      const downloadPromise = page.waitForEvent('download');
      const menu_options = page.locator('#ui-id-4 li a');
      let file, href, name;
      for (let index = 0; index < await menu_options.count(); index++) {
        await page.getByText('Enabled').click();
        await page.getByText('Downloads').click();
        await menu_options.nth(index).click();
        href = await menu_options.nth(index).getAttribute('href');
        name = href.replace('/download/jqueryui/menu/','');
        file = await downloadPromise;
        await file.saveAs(`${path}/${name}`);
      }
      const filesSet = new Set(await FileHandler.readFiles(path));
      expect(filesSet.has('menu.pdf')).toBeTruthy();
      expect(filesSet.has('menu.csv')).toBeTruthy();
      expect(filesSet.has('menu.xls')).toBeTruthy();
      await page.getByText('Enabled').click();
      await page.getByText('Back to JQuery Ui').click();
      expect(await page.locator(titleHeader).textContent()).toContain('JQuery UI');
      await page.getByText('Menu').click();
      expect(await page.locator('#ui-id-1').isDisabled()).toBeTruthy();
    });

    test('JavaScript onload event error', async ({page}) => {
      let error_message = '';
      let error_name = '';
      page.on('pageerror', exception => {
        error_message = exception.message;
        error_name = exception.name;
      });
      await mainPage.jsOnloadEventErrorLink.click();  
      expect(page.url()).toContain('/javascript_error');
      expect(error_message).toBe(`Cannot read properties of undefined (reading 'xyz')`);
      expect(error_name).toBe('TypeError');
      expect(await page.locator('body p').textContent()).toContain(`
      This page has a JavaScript error in the onload event.
      This is often a problem to using normal Javascript injection
      techniques.
    `);
    });

    test('Key Presses', async ({page}) => {
      const expected_title = 'Key Presses';
      const inputTarget = page.locator('#target');
      const resultLabel = page.locator('#result');
      await mainPage.keyPressLink.click();
      expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
      await page.keyboard.press('Escape');
      expect(await resultLabel.textContent()).toContain(`You entered: ESCAPE`);
      await page.keyboard.press('Shift');
      expect(await resultLabel.textContent()).toContain(`You entered: SHIFT`);
      await page.keyboard.press('Control');
      expect(await resultLabel.textContent()).toContain(`You entered: CONTROL`);
      await page.keyboard.press('Alt');
      expect(await resultLabel.textContent()).toContain(`You entered: ALT`);
      await page.keyboard.press('Space');
      expect(await resultLabel.textContent()).toContain(`You entered: SPACE`);
      await page.keyboard.press('Enter');
      expect(await resultLabel.textContent()).toContain(`You entered: ENTER`);
      await  page.keyboard.press('ArrowLeft');
      expect(await resultLabel.textContent()).toContain(`You entered: LEFT`);
      await  page.keyboard.press('ArrowUp');
      expect(await resultLabel.textContent()).toContain(`You entered: UP`);
      await  page.keyboard.press('ArrowRight');
      expect(await resultLabel.textContent()).toContain(`You entered: RIGHT`);
      await  page.keyboard.press('ArrowDown');
      expect(await resultLabel.textContent()).toContain(`You entered: DOWN`);
      await inputTarget.type('1');
      expect(await resultLabel.textContent()).toContain(`You entered: 1`);
      await inputTarget.type('2');
      expect(await resultLabel.textContent()).toContain(`You entered: 2`);
      await inputTarget.type('3');
      expect(await resultLabel.textContent()).toContain(`You entered: 3`);
      await inputTarget.type('4');
      expect(await resultLabel.textContent()).toContain(`You entered: 4`);
      await inputTarget.type('5');
      expect(await resultLabel.textContent()).toContain(`You entered: 5`);
      await inputTarget.type('6');
      expect(await resultLabel.textContent()).toContain(`You entered: 6`);
      await inputTarget.type('7');
      expect(await resultLabel.textContent()).toContain(`You entered: 7`);
      await inputTarget.type('8');
      expect(await resultLabel.textContent()).toContain(`You entered: 8`);
      await inputTarget.type('9');
      expect(await resultLabel.textContent()).toContain(`You entered: 9`);
      await inputTarget.type('0');
      expect(await resultLabel.textContent()).toContain(`You entered: 0`);
    });

    test('Large & Deep DOM', async ({page}) => {
      const expected_title = 'Large & Deep DOM';
      await mainPage.largeDeepDOMLink.click();
      expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
      const lastSibling = page.locator('div[id="sibling-50.3"]');
      const lastTableElement = page.locator('tr.row-50 td').last();
      await lastSibling.scrollIntoViewIfNeeded();
      expect(await lastSibling.textContent()).toContain('50.3');
      await lastTableElement.scrollIntoViewIfNeeded();
      expect(await lastTableElement.textContent()).toContain('50.50');
    });

    test('Multiple Windows', async ({context, page}) => {
      const expected_title = 'Opening a new window';
      await mainPage.multipleWindowsLink.click();
      expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
      const pagePromise = context.waitForEvent('page');
      await page.getByText('Click Here').click();
      const newWindow = await pagePromise;
      newWindow.waitForLoadState();
      expect(newWindow.url()).toContain('/windows/new');
      expect(await newWindow.locator('.example h3').textContent()).toContain('New Window');
      newWindow.close();
    });

    test('Nested Frames', async ({page}) => {
      await mainPage.nestedFramesLink.click();
      expect(page.url()).toContain('/nested_frames');
      const top_frames = page.frameLocator('[name="frame-top"]').frameLocator('frame');
      expect(await top_frames.nth(0).locator('body').textContent()).toContain('LEFT')
      expect(await top_frames.nth(1).locator('body').textContent()).toContain('MIDDLE');
      expect(await top_frames.nth(2).locator('body').textContent()).toContain('RIGHT');
      const bottom_frame = page.frameLocator('[name="frame-bottom"]');
      expect(await bottom_frame.locator('body').textContent()).toContain('BOTTOM');
    });

});
