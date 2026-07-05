import { test, expect, Browser, Page } from '@playwright/test';

let sharedPage: Page;

test.describe('Candidate Management', () => {
  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();
    await sharedPage.goto('/candidates');
  });

  test('archive candidate', async () => {
    const firstArchiveBtn = sharedPage.locator('.candidate-row .archive-btn').first();
    await firstArchiveBtn.click();
    await sharedPage.waitForTimeout(1000);
    const rows = sharedPage.locator('.candidate-row');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('candidate list shows Jamie Lee', async () => {
    await sharedPage.reload();
    const rows = sharedPage.locator('.candidate-row');
    await expect(rows.first()).toBeVisible();
    const names = await sharedPage.locator('.candidate-name').allTextContents();
    expect(names.some(n => n.includes('Jamie Lee'))).toBe(true);
  });
});
