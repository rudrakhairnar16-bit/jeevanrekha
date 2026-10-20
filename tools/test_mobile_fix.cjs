const { chromium, devices } = require('@playwright/test');

async function testLocalFix() {
  const browser = await chromium.launch();
  
  // Test 1: Desktop 1440px
  console.log('--- TEST 1: Desktop 1440px ---');
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000');
  await desktopPage.waitForTimeout(2000);
  const desktopLink = desktopPage.getByRole('link', { name: 'Interactive Prototype' });
  await desktopLink.click({ timeout: 4000 });
  console.log('Desktop click SUCCESS! URL:', desktopPage.url());

  // Test 2: Mobile iPhone 14 (390px)
  console.log('--- TEST 2: Mobile iPhone 14 ---');
  const mobileContext = await browser.newContext(devices['iPhone 14']);
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000');
  await mobilePage.waitForTimeout(2000);

  const clickable = await mobilePage.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button')).map(el => {
      const rect = el.getBoundingClientRect();
      const topEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return {
        text: el.innerText.trim(),
        href: el.getAttribute('href'),
        topEl: topEl ? topEl.tagName + '.' + topEl.className : null,
        clickable: topEl === el || el.contains(topEl)
      };
    }).filter(x => x.text && ['Demo', 'Prototype', 'Architecture', 'Interactive Prototype', 'Jury Demo (2 min) →'].includes(x.text));
  });
  console.log('Mobile navigation and action buttons status:');
  console.log(JSON.stringify(clickable, null, 2));

  const mobileLink = mobilePage.getByRole('link', { name: 'Interactive Prototype' });
  await mobileLink.click({ timeout: 4000 });
  console.log('Mobile click SUCCESS! URL:', mobilePage.url());

  // Test 3: Walkthrough page buttons
  console.log('--- TEST 3: Walkthrough Page ---');
  const wtPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await wtPage.goto('http://localhost:3000/walkthrough');
  const wtProtoBtn = wtPage.getByRole('link', { name: 'Launch Interactive Prototype →' });
  await wtProtoBtn.click({ timeout: 4000 });
  console.log('Walkthrough to Prototype click SUCCESS! URL:', wtPage.url());

  await browser.close();
}

testLocalFix().catch(err => {
  console.error('Test FAILED:', err);
  process.exit(1);
});
