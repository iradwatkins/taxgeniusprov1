const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:3003/theme-test', {
    waitUntil: 'networkidle'
  });

  // Get the full HTML
  const html = await page.content();

  // Check if styles are in the head
  const hasOklchInHead = html.includes('oklch(');
  const hasStyleTag = html.includes('<style');

  console.log('Has OKLCH colors in HTML:', hasOklchInHead);
  console.log('Has style tags:', hasStyleTag);

  // Find first occurrence of oklch
  const oklchIndex = html.indexOf('oklch(');
  if (oklchIndex > -1) {
    console.log('\nFirst OKLCH occurrence:');
    console.log(html.substring(Math.max(0, oklchIndex - 50), Math.min(html.length, oklchIndex + 100)));
  }

  // Check computed background color
  const bgColor = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });

  console.log('\nComputed body background:', bgColor);

  await browser.close();
})();