/* eslint-disable no-undef */
describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should have home screen', async () => {
    await expect(element(by.id('home'))).toBeVisible();
  });

  it('should type text', async () => {
    await element(by.id('organization-text-input')).typeText('Facebook');
    await element(by.id('repo-text-input')).typeText('React');
    await element(by.id('search')).tap();
  });

  it('should have item in list', async () => {
    await expect(element(by.id('issue-item')).atIndex(1)).toBeVisible();
  });
});
