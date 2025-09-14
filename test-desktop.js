const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3005');
    await page.waitForLoadState('networkidle');

    // Take screenshot of desktop view
    await page.screenshot({
      path: 'desktop-view.png',
      fullPage: true
    });

    // Check container widths and responsive classes
    const containerWidths = await page.evaluate(() => {
      const containers = document.querySelectorAll('.container, [class*="max-w"]');
      return Array.from(containers).map(el => ({
        classes: el.className,
        computedWidth: window.getComputedStyle(el).width,
        offsetWidth: el.offsetWidth
      }));
    });

    console.log('Container Analysis:', JSON.stringify(containerWidths, null, 2));

    // Check viewport and responsive behavior
    const viewportInfo = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      documentWidth: document.documentElement.offsetWidth
    }));

    console.log('Viewport Info:', viewportInfo);

  } catch (error) {
    console.error('Error analyzing desktop layout:', error);
  } finally {
    await browser.close();
  }
})();