import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class MainPage extends BasePage  {


    readonly abTestingLink: Locator;
    readonly addRemoveLink: Locator;
    readonly brokenImagesLink: Locator;
    readonly challengingDOMLink: Locator;
    readonly checkBoxesLink: Locator;
    readonly contextMenuLink: Locator;
    readonly digestAuthLink: Locator;
    readonly disappearingElementsLink: Locator;
    readonly dragAndDropLink: Locator;
    readonly dropdownLink: Locator;
    readonly dynamicContentLink: Locator;
    readonly dynamicControlsLink: Locator;
    readonly dynamicLoadingLink: Locator;
    readonly entryAdLink: Locator;
    readonly exitIntentLink: Locator;
    readonly fileDownloadLink: Locator;
    readonly fileUploadLink: Locator;
    readonly floatingMenuLink: Locator;
    readonly forgotPassword: Locator;
    readonly formAuthenticationLink: Locator;
    readonly framesLink: Locator;
    readonly geolocationLink: Locator;
    readonly horizontalSliderLink: Locator;
    readonly hoversLink: Locator;
    readonly infiniteScrollLink: Locator;
    readonly inputsLink: Locator;
    readonly jQueryUIMenusLink: Locator;
    readonly javaScriptAlertsLink: Locator;
    readonly jsOnloadEventErrorLink: Locator;
    readonly keyPressLink: Locator;
    readonly largeDeepDOMLink: Locator;
    readonly multipleWindowsLink: Locator;
    readonly nestedFramesLink: Locator;
    readonly notificationMessageLink: Locator;
    readonly redirectLink: Locator;
    readonly secureFileDownloadLink: Locator;
    readonly shadowDOMLink: Locator;
    readonly shiftingContentLink: Locator;
    readonly slowResourcesLink: Locator;
    readonly sortableDataTablesLink: Locator;
    readonly statusCodesLink: Locator;
    readonly typosLink: Locator;
    readonly wysiwygEditorLink: Locator;

    constructor(page: Page) {
        super(page);
        this.abTestingLink = page.locator('a[href="/abtest"]');
        this.addRemoveLink = page.locator('a[href="/add_remove_elements/"]');
        this.brokenImagesLink = page.locator('a[href="/broken_images"]');
        this.challengingDOMLink = page.locator('a[href="/challenging_dom"]');
        this.checkBoxesLink = page.locator('a[href="/checkboxes"]');
        this.contextMenuLink = page.locator('a[href="/context_menu"]');
        this.digestAuthLink = page.locator('a[href="/digest_auth"]');
        this.disappearingElementsLink = page.locator('a[href="/disappearing_elements"]');
        this.dragAndDropLink = page.getByText('Drag and Drop');
        this.dropdownLink = page.getByText('Dropdown');
        this.dynamicContentLink = page.getByText('Dynamic Content');
        this.dynamicControlsLink = page.getByText('Dynamic Controls');
        this.dynamicLoadingLink = page.getByText('Dynamic Loading');
        this.entryAdLink = page.getByText('Entry Ad');
        this.exitIntentLink = page.getByText('Exit Intent');
        this.fileDownloadLink = page.getByText('File Download').first();
        this.fileUploadLink = page.getByText('File Upload');
        this.floatingMenuLink = page.getByText('Floating Menu');
        this.forgotPassword = page.getByText('Forgot Password');
        this.formAuthenticationLink = page.getByText('Form Authentication');
        this.framesLink = page.getByText('Frames').first();
    }



}