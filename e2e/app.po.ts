import { browser, element, by } from 'protractor';

export class BookingFrontPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('bf-root h1')).getText();
  }
}
