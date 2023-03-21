import { Page, test, expect } from '@playwright/test';
import { MainPage } from '../pages/main.page';

test.describe('The Internet Herouku Geolocation Validation', () => {

  let mainPage: MainPage;
  const titleHeader: string = 'h3';
  
  test.use({ 
    permissions: ['geolocation'],
    geolocation: { latitude: 15.8400512, longitude: -97.042432 }
  });

  test('Geolocation', async ({ page, context, baseURL }) => {
    mainPage = new MainPage(page);
    await mainPage.navigate(baseURL!);
    const expected_title = 'Geolocation';
    await mainPage.geolocationLink.click();
    expect(await page.locator(titleHeader).textContent()).toContain(expected_title);
    await page.getByText('Where am I?').click();
    const latitude = await page.locator('#lat-value').textContent();
    const longitude = await page.locator('#long-value').textContent();
    await page.getByText('See it on Google').click();
    await page.waitForLoadState('load');
    expect(page.url()).toContain('google.com/maps');
    const google_span = page.locator('.lMbq3e h2 span');
    const lat_round = latitude?.substring(0, latitude.length-2);
    const long_round = longitude?.substring(0, longitude.length-2);
    expect(await google_span.textContent()).toContain(lat_round);
    expect(await google_span.textContent()).toContain(long_round);    
    await page.close();
    await context.close();
  });

});
