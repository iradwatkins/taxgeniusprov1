const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:3003/theme-test', {
    waitUntil: 'networkidle'
  });

  // Get all stylesheets
  const styles = await page.evaluate(() => {
    const sheets = Array.from(document.styleSheets);
    const cssRules = [];

    sheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        rules.forEach(rule => {
          if (rule.cssText && rule.cssText.includes('--')) {
            cssRules.push(rule.cssText.substring(0, 200));
          }
        });
      } catch (e) {
        // Cross-origin stylesheets can't be accessed
      }
    });

    return cssRules;
  });

  console.log('CSS Rules with custom properties:');
  styles.forEach(rule => console.log(rule));

  // Check :root styles
  const rootStyles = await page.evaluate(() => {
    const rootElement = document.documentElement;
    const styles = window.getComputedStyle(rootElement);

    // Try to get the --primary variable
    return {
      primary: styles.getPropertyValue('--primary'),
      background: styles.getPropertyValue('--background'),
      hasRootClass: rootElement.classList.contains('root'),
      className: rootElement.className
    };
  });

  console.log('\nRoot element styles:', rootStyles);

  await browser.close();
})();