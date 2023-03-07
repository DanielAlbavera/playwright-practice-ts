import { Page, Locator, test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { FileHandler } from '../utils/file-handling';

test.describe('The Internet Herouku Validations', () => {

  let page: Page;
  let mainPage: MainPage;
  const titleHeader: string = 'h3';

  test.beforeEach( async ({ context, baseURL }) => {
    page = await context.newPage();
    mainPage = new MainPage(page);
    mainPage.navigate(baseURL!);
  });

  test.afterEach( async () => {
    await page.close();
  });

  test('A/B Testing', async ()=> {
    const expected_title = 'A/B Test';
    await mainPage.abTestingLink.click();
    expect(page.url()).toContain('abtest');
    const title = page.locator(titleHeader)
    expect(await title.textContent()).toContain(expected_title);
  });

  test('Add/Remove Elements', async () => {
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

  test('Broken Images', async ({ baseURL, request }) => {
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

  test('Challenging DOM', async () => {
    const expected_title = 'Challenging DOM';
    await mainPage.challengingDOMLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    await page.getByText('edit').first().click()
    expect(page.url()).toContain('#edit');
    await page.getByText('delete').first().click()
    expect(page.url()).toContain('#delete');
  });

  test('Checkboxes', async () => {
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

  test('Context Menu', async () => {
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
    console.log(alertText);
    expect(alertText).toContain(expected_dialog_text);
    expect(await page.locator('.example p').last().textContent()).toContain(expected_text);
  });

  test('Disappearing Elements', async () => {
    const expected_title = 'Disappearing Elements';
    await mainPage.disappearingElementsLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    let galleryButton = page.getByText('Gallery');
    let galleryCount = await galleryButton.count();
    while ( galleryCount === 0) {
      try {
        console.log('Element is not visible yet, reloading the page...');
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

  test('Drag and Drop', async () => {
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

  test('Dropdown', async () => {
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

  test('Dynamic Content', async () => {
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

  test('Dynamic Controls', async () => {
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

  test('Dynamic Loading', async () => {
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

  test('Entry Ad', async () => {
    const expected_title = 'Entry Ad';
    const expected_modal_body = `It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something or disable their ad blocker).`;
    await mainPage.entryAdLink.click();
    await modalAssertions(expected_modal_body);
    await page.locator('div.modal-footer p').click();
    const title = page.locator('div.example h3');
    expect(await title.textContent()).toContain(expected_title);
    await page.getByText('click here').click();
    await modalAssertions(expected_modal_body);
  });

  async function modalAssertions(expected_modal_body: string) {
    const expected_modal_title = 'This is a modal window';
    const modal_title = page.locator('div.modal-title h3');
    const modal_body = page.locator('div.modal-body p');
    await modal_title.waitFor({ state: 'visible' });
    expect(await modal_title.isVisible()).toBeTruthy();
    expect(await modal_body.isVisible()).toBeTruthy();
    expect(await modal_title.textContent()).toContain(expected_modal_title);
    expect(await modal_body.textContent()).toContain(expected_modal_body);
  }

  test('Exit Intent', async () => {
    const expected_title = 'Exit Intent';
    const expected_modal_body = `It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something).`;
    await mainPage.exitIntentLink.click();
    await page.waitForLoadState('load');
    await page.locator('html').dispatchEvent('mouseleave');
    await modalAssertions(expected_modal_body);
    const title = page.locator('div.example h3');
    expect(await title.isVisible()).toBeTruthy();
    expect(await title.textContent()).toContain(expected_title);
  });

  test('File Download', async () => {
    const downloadPath = './download';
    const expected_title = 'File Downloader';
    await mainPage.fileDownloadLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    const linkToDownload = '.example a';
    const downloadPromise = page.waitForEvent('download');
    await page.locator(linkToDownload).first().click();
    const downloadFile = await downloadPromise;
    const fileName = await page.locator(linkToDownload).first().textContent() || '';
    await downloadFile.saveAs(`${downloadPath}/${fileName}`);
    const downloadedFile = await FileHandler.readFiles(downloadPath);
    expect(downloadedFile[0]).toBe(fileName);
  });

  test('File Upload', async () => {
    const downloadPath = './download';
    const files = await FileHandler.readFiles(downloadPath);
    const fileName = files[0];
    const filePath = `${downloadPath}/${fileName}`;
    const expected_title = 'File Uploader';
    await mainPage.fileUploadLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    const fileChooser = page.locator('input#file-upload');
    await fileChooser.setInputFiles(filePath);
    await page.locator('input#file-submit').click();
    const uploaded_title = 'File Uploaded!';
    expect(await title.textContent()).toContain(uploaded_title);
    expect(await page.locator('div#uploaded-files').textContent()).toContain(fileName);
    await page.goBack();
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('div#content div#drag-drop-upload').click();
    const dragFileChooser = await fileChooserPromise;
    await dragFileChooser.setFiles(filePath);
    expect(await page.locator('div .dz-details div.dz-filename span').first().textContent()).toContain(fileName);
    await FileHandler.removeFile(filePath);
  });

  test('Floating Menu', async () => {
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

  test('Forgot Password', async () => {
    const expected_title = 'Forgot Password';
    await mainPage.forgotPassword.click();
    const title = page.locator('h2');
    expect(await title.textContent()).toContain(expected_title);
    await page.locator('input#email').fill('test@test.com');
    await page.getByText('Retrieve password').click();
    expect(await page.locator('h1').textContent()).toContain('Internal Server Error');
  });

  test('Form Authentication', async () => {
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

  test('Frames', async () => {
    const expected_title = 'Frames';
    await mainPage.framesLink.click();
    const title = page.locator(titleHeader);
    expect(await title.textContent()).toContain(expected_title);
    await page.getByText('Nested Frames').click();
    const top_frames = page.frameLocator('frame[name="frame-top"]').frameLocator('frame');
    expect(await top_frames.nth(0).locator('body').textContent()).toContain('LEFT')
    expect(await top_frames.nth(1).locator('body').textContent()).toContain('MIDDLE');
    expect(await top_frames.nth(2).locator('body').textContent()).toContain('RIGHT');
  });

});

//test('', async () => {});