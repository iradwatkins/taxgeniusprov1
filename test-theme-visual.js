const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport to capture full page
  await page.setViewportSize({ width: 1440, height: 900 });

  try {
    // Navigate to the theme test page
    console.log('Navigating to theme test page...');
    await page.goto('http://localhost:3003/theme-test', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Take screenshot of light mode
    console.log('Taking screenshot of light mode...');
    await page.screenshot({
      path: '/root/websites/taxgeniuspro/theme-test-light.png',
      fullPage: true
    });

    // Click dark mode toggle
    console.log('Switching to dark mode...');
    await page.click('button:has-text("Switch to Dark")');
    await page.waitForTimeout(1000); // Wait for transition

    // Take screenshot of dark mode
    console.log('Taking screenshot of dark mode...');
    await page.screenshot({
      path: '/root/websites/taxgeniuspro/theme-test-dark.png',
      fullPage: true
    });

    console.log('Screenshots saved successfully!');
    console.log('- Light mode: /root/websites/taxgeniuspro/theme-test-light.png');
    console.log('- Dark mode: /root/websites/taxgeniuspro/theme-test-dark.png');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();