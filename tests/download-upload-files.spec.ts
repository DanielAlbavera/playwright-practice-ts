import { test, expect, Page, BrowserContext } from '@playwright/test';
import { MainPage } from '../pages/main.page';
import { FileHandler } from '../utils/file-handling';

test.describe('Herouku Download/Upload Validations', () => {

  test.describe.configure({ mode: 'serial' });

  let page: Page;
  let context: BrowserContext;
  let mainPage: MainPage;
  const titleHeader: string = 'h3';
  const downloadPath = './download';

  test.beforeAll( async ({ browser }) => {
    context = await browser.newContext();
  });

  test.beforeEach( async ({ baseURL }) => {
    page = await context.newPage();
    mainPage = new MainPage(page);
    await mainPage.navigate(baseURL!);
  });

  test.afterEach( async () => {
    await page.close();
  });

  test.afterAll( async () => {
    await context.close();
  });

  test('File Download', async () => { 
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
    console.log('File Downloaded: ', downloadedFile);
    expect(downloadedFile[0]).toBe(fileName);
  });

  test('File Upload', async () => {
    const files = await FileHandler.readFiles(downloadPath);
    console.log('Files Downloaded: ', files);
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
    // By Drag and Drop - A liitle bit Flakky 
    // await page.goBack();
    // await page.waitForLoadState();
    // const fileChooserPromise = page.waitForEvent('filechooser');
    // await page.locator('div#content div#drag-drop-upload').click();
    // const dragFileChooser = await fileChooserPromise;
    // await dragFileChooser.setFiles(filePath);
    // expect(await page.getByText(fileName).textContent()).toContain(fileName);
    await FileHandler.removeAllFiles(downloadPath);
  });

});
