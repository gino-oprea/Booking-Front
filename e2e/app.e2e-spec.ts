import { BookingFrontPage } from './app.po';

describe('booking-front App', function() {
  let page: BookingFrontPage;

  beforeEach(() => {
    page = new BookingFrontPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('bf works!');
  });
});
