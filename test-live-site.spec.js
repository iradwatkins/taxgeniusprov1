const { test, expect } = require('@playwright/test');

test('Test live site responsive behavior', async ({ page }) => {
  const liveUrl = 'http://taxgeniuspro.tax';

  console.log('Testing live site at:', liveUrl);

  // Test desktop viewport
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto(liveUrl);
  await page.waitForLoadState('domcontentloaded');

  // Take screenshot
  await page.screenshot({
    path: './screenshots/live-desktop-1200.png',
    fullPage: true
  });

  // Check mobile menu visibility on desktop
  const mobileMenuTrigger = page.locator('[data-testid="mobile-menu"], .md\\:hidden button', { timeout: 5000 });
  const isMobileMenuVisible = await mobileMenuTrigger.isVisible().catch(() => false);
  console.log('Mobile menu trigger visible on desktop:', isMobileMenuVisible);

  // Check if desktop navigation is visible
  const desktopNav = page.locator('.hidden.md\\:flex, .md\\:flex');
  const isDesktopNavVisible = await desktopNav.isVisible().catch(() => true);
  console.log('Desktop navigation visible:', isDesktopNavVisible);

  // Check h1 font size
  const h1 = page.locator('h1').first();
  const h1FontSize = await h1.evaluate(el => window.getComputedStyle(el).fontSize);
  console.log('H1 font size on desktop:', h1FontSize);

  // Test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(500); // Let styles recalculate

  const h1FontSizeMobile = await h1.evaluate(el => window.getComputedStyle(el).fontSize);
  console.log('H1 font size on mobile:', h1FontSizeMobile);

  await page.screenshot({
    path: './screenshots/live-mobile-375.png',
    fullPage: true
  });

  // Test tablet viewport
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);

  const h1FontSizeTablet = await h1.evaluate(el => window.getComputedStyle(el).fontSize);
  console.log('H1 font size on tablet:', h1FontSizeTablet);

  await page.screenshot({
    path: './screenshots/live-tablet-768.png',
    fullPage: true
  });
});