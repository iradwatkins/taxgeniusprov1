const { test, expect } = require('@playwright/test');

test.describe('Tax Genius Pro Responsive Design Analysis', () => {
  const baseUrl = 'http://localhost:3005';

  test('Desktop viewport analysis (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(baseUrl);
    await page.waitForLoadState('domcontentloaded');

    // Take screenshot
    await page.screenshot({
      path: './screenshots/desktop-1920.png',
      fullPage: true
    });

    // Check if content is properly scaled for desktop
    const hero = page.locator('section').first();
    const heroBox = await hero.boundingBox();
    console.log('Desktop Hero section width:', heroBox?.width);

    // Check navigation layout
    const nav = page.locator('header nav, header > div').first();
    const navBox = await nav.boundingBox();
    console.log('Desktop Navigation width:', navBox?.width);

    // Check if mobile elements are hidden
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .md\\:hidden');
    const isMobileMenuVisible = await mobileMenu.isVisible().catch(() => false);
    console.log('Mobile menu visible on desktop:', isMobileMenuVisible);
  });

  test('Tablet viewport analysis (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(baseUrl);
    await page.waitForLoadState('domcontentloaded');

    await page.screenshot({
      path: './screenshots/tablet-768.png',
      fullPage: true
    });

    const hero = page.locator('section').first();
    const heroBox = await hero.boundingBox();
    console.log('Tablet Hero section width:', heroBox?.width);
  });

  test('Mobile viewport analysis (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseUrl);
    await page.waitForLoadState('domcontentloaded');

    await page.screenshot({
      path: './screenshots/mobile-375.png',
      fullPage: true
    });

    const hero = page.locator('section').first();
    const heroBox = await hero.boundingBox();
    console.log('Mobile Hero section width:', heroBox?.width);
  });

  test('Container width analysis across breakpoints', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop-small' },
      { width: 1920, height: 1080, name: 'desktop-large' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(baseUrl);
      await page.waitForLoadState('domcontentloaded');

      // Check main container widths
      const containers = await page.locator('.container').all();
      console.log(`\n=== ${viewport.name} (${viewport.width}x${viewport.height}) ===`);

      for (let i = 0; i < containers.length; i++) {
        const box = await containers[i].boundingBox();
        const classes = await containers[i].getAttribute('class');
        console.log(`Container ${i + 1}: width=${box?.width}, classes="${classes}"`);
      }
    }
  });

  test('Text scaling analysis', async ({ page }) => {
    const viewports = [375, 768, 1024, 1920];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(baseUrl);
      await page.waitForLoadState('domcontentloaded');

      // Check h1 font sizes
      const h1 = page.locator('h1').first();
      const fontSize = await h1.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });

      console.log(`H1 font size at ${width}px: ${fontSize}`);
    }
  });
});