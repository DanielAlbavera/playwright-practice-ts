import { Locator, test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { MainPage } from '../pages/main.page';

test.describe('1 - The Internet Herouku Validations', () => {

  let mainPage: MainPage;
  const titleHeader: string = 'h3';

  test.beforeEach( async ({ page, baseURL }) => {
    mainPage = new MainPage(page);
    await mainPage.navigate(baseURL!);
  });

  test.afterEach( async ({page}) => {
    await page.close();
  });

  test('A/B Testing', async ({page})=> {
    const expected_title = 'A/B Test';
    await mainPage.abTestingLink.click();
    expect(page.url()).toContain('abtest');
    const title = page.locator(titleHeader)
    expect(await title.textContent()).toContain(expected_title);
  });

  test('Add/Remove Elements', async ({page}) => {
    const expected_title = 'Add/Remove Elements';
    const expected_times = 10;
    const deleteButon = page.getByText('Delete');
    await mainPage.addRemoveLink.click();
    expect(page.url()).toContain('add_remove_elements');
    const title = page.locator(titleHeader)
    expect(await title.textContent()).toContain(expected_title);
    await mainPage.clickMultiple('Add Element', expected_times);
    expect(await deleteButon.count()).toBe(expected_times);
    await mainPage.clickMultiple('Delete', expected_times);
    expect(await deleteButon.count()).toBe(0);
  });

  test('Broken Images', async ({ page, baseURL, request }) => {
    const expected_title = 'Broken Images';
    await mainPage.brokenImagesLink.click();
    expect(page.url()).toContain('broken_images');
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    const image1 = await request.get(baseURL+'asdf.jpg');
    const image2 = await request.get(baseURL+'hjkl.jpg');
    const image3 = await request.get(baseURL+'img/avatar-blank.jpg');
    expect(image1.status()).toBe(404);
    expect(image2.status()).toBe(404);
    expect(image3.status()).toBe(200);
  });

  test('Challenging DOM', async ({page}) => {
    const expected_title = 'Challenging DOM';
    await mainPage.challengingDOMLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    await page.getByText('edit').first().click()
    expect(page.url()).toContain('#edit');
    await page.getByText('delete').first().click()
    expect(page.url()).toContain('#delete');
  });

  test('Checkboxes', async ({page}) => {
    const expected_title = 'Checkboxes';
    await mainPage.checkBoxesLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    const checkbox1 = page.locator('input[type="checkbox"]').first();
    const checkbox2 = page.locator('input[type="checkbox"]').last();
    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).toBeChecked();
    await checkbox1.check();
    await expect(checkbox1).toBeChecked();
    await expect(checkbox2).toBeChecked();
    await checkbox2.uncheck();
    await checkbox1.uncheck();
    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).not.toBeChecked();
  });

  test('Context Menu', async ({page}) => {
    const expected_title = 'Context Menu';
    const expected_dialog_text = 'You selected a context menu';
    const expected_text = `Right-click in the box below to see one called 'the-internet'. When you click it, it will trigger a JavaScript alert.`;
    await mainPage.contextMenuLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    let alertText: string = '';
    page.on('dialog', async (dialog) => {
      alertText = dialog.message();
      dialog.accept();
    });
    await page.locator('#hot-spot').click({ button: 'right' });
    expect(alertText).toContain(expected_dialog_text);
    expect(await page.locator('.example p').last().textContent()).toContain(expected_text);
  });

  test('Disappearing Elements', async ({page}) => {
    const expected_title = 'Disappearing Elements';
    await mainPage.disappearingElementsLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    let galleryButton = page.getByText('Gallery');
    let galleryCount = await galleryButton.count();
    while ( galleryCount === 0) {
      try {
        //Element is not visible yet, reloading the page...
        await page.reload();
        await page.waitForLoadState('load');
        galleryButton = page.getByText('Gallery');
        galleryCount = await galleryButton.count();
      }
      catch (error) {
        console.log(error);
      }
    }
    expect(await galleryButton.isVisible()).toBeTruthy();
  });

  test('Drag and Drop', async ({page}) => {
    const expected_title = 'Drag and Drop';
    await mainPage.dragAndDropLink.click();
    const firstColumn = page.locator('div#columns header').first();
    const secondColumn = page.locator('div#columns header').last();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    
    const aBox = page.locator('#column-a');
    const bBox = page.locator('#column-b');
    await aBox.dragTo(bBox);
    await assertBFirst(firstColumn, secondColumn);
    await bBox.dragTo(aBox);
    await assertAFirst(firstColumn, secondColumn);
    await bBox.dragTo(aBox);
    await assertBFirst(firstColumn, secondColumn);
    await aBox.dragTo(bBox);
    await assertAFirst(firstColumn, secondColumn);
  });

  async function assertAFirst(first: Locator, second: Locator) {
    expect(await first.textContent()).toContain('A');
    expect(await second.textContent()).toContain('B');
  }

  async function assertBFirst(first: Locator, second: Locator) {
    expect(await first.textContent()).toContain('B');
    expect(await second.textContent()).toContain('A');
  }

  test('Dropdown', async ({page}) => {
    const expected_title = 'Dropdown List';
    await mainPage.dropdownLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    const select = page.locator('select#dropdown');
    const default_option = 'Please select an option';
    const firstOption = 'Option 1';
    const secondOption = 'Option 2';
    expect(await select.innerText()).toContain(default_option)
    await select.selectOption(firstOption);
    expect(await select.innerText()).toContain(firstOption)
    await select.selectOption(secondOption);
    expect(await select.innerText()).toContain(secondOption)
  });

  test('Dynamic Content', async ({page}) => {
    const expected_title = 'Dynamic Content';
    await mainPage.dynamicContentLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    const rows = page.locator('div#content > div.row');
    const images = page.locator('div#content > div.row img');
    const paragraphs = page.locator('div#content > div.row div.large-10.columns');
    await iterateRowAssertions(rows, images, paragraphs);
    await page.getByText('click here').click();
    await iterateRowAssertions(rows, images, paragraphs);
  });

  async function iterateRowAssertions(rows: Locator, images: Locator, paragraphs: Locator) {
    for (let i = 0; i < await rows.count(); i++ ) {
      expect(await images.nth(i).getAttribute('src')).toContain('/img/avatars/Original-Facebook-Geek-Profile-Avatar');
      expect(await paragraphs.nth(i).isVisible()).toBeTruthy();
    }
  }

});
