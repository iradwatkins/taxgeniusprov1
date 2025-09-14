const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:3003/theme-test', {
    waitUntil: 'networkidle'
  });

  // Get computed styles for CSS variables
  const cssVariables = await page.evaluate(() => {
    const root = document.documentElement;
    const computedStyles = getComputedStyle(root);

    const variables = [
      '--background',
      '--primary',
      '--secondary',
      '--accent',
      '--muted',
      '--destructive',
      '--chart-1',
      '--chart-2'
    ];

    const result = {};
    variables.forEach(varName => {
      result[varName] = computedStyles.getPropertyValue(varName);
    });

    return result;
  });

  console.log('CSS Variables loaded:');
  console.log(JSON.stringify(cssVariables, null, 2));

  // Check if any element has the primary color
  const primaryElement = await page.evaluate(() => {
    const elem = document.querySelector('[style*="--primary"]');
    return elem ? elem.outerHTML : 'No element found with primary color';
  });

  console.log('\nElement with primary color:', primaryElement);

  await browser.close();
})();