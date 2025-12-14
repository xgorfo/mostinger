import { test, expect } from '@playwright/test';

test.describe('Posts', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="text"]', 'testuser');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should create new post', async ({ page }) => {
    await page.goto('/create');
    
    await page.fill('input[name="title"]', 'Test Post');
    await page.fill('textarea[name="content"]', 'This is a test post content with enough characters');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('h1')).toContainText('Test Post');
  });

  test('should like post', async ({ page }) => {
    await page.goto('/');
    
    const likeButton = page.locator('button').filter({ hasText: /0/ }).first();
    await likeButton.click();
    
    await expect(likeButton).toContainText('1');
  });
});