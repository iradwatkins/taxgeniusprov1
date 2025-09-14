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

    // Take screenshots at different desktop sizes
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({
      path: 'desktop-1920.png',
      fullPage: false
    });

    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.screenshot({
      path: 'desktop-2560.png',
      fullPage: false
    });

    // Check text sizes and containers
    const elementAnalysis = await page.evaluate(() => {
      const heroTitle = document.querySelector('h1');
      const containers = document.querySelectorAll('.container, [class*="max-w"]');

      return {
        heroTitleSize: heroTitle ? window.getComputedStyle(heroTitle).fontSize : 'not found',
        heroTitleClasses: heroTitle ? heroTitle.className : 'not found',
        containerCount: containers.length,
        containerWidths: Array.from(containers).slice(0, 5).map(el => ({
          classes: el.className.substring(0, 100),
          computedWidth: window.getComputedStyle(el).width,
          maxWidth: window.getComputedStyle(el).maxWidth
        }))
      };
    });

    console.log('Desktop Layout Analysis:');
    console.log(JSON.stringify(elementAnalysis, null, 2));

    // Check if layout appears mobile-like
    const layoutCheck = await page.evaluate(() => {
      const body = document.body;
      const bodyWidth = body.offsetWidth;
      const containers = document.querySelectorAll('.container, [class*="max-w"]');
      const largestContainer = Math.max(...Array.from(containers).map(el => el.offsetWidth));

      return {
        bodyWidth,
        largestContainer,
        ratio: largestContainer / bodyWidth,
        appearsMobileOnly: largestContainer < 1200 // If largest container is less than 1200px, might appear mobile-only
      };
    });

    console.log('Layout Check:', layoutCheck);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();