const { chromium, devices } = require('@playwright/test');

const PROD_URL = 'https://jeevanrekha-delta.vercel.app';

async function verifyProd() {
  console.log('Testing live production at:', PROD_URL);
  const browser = await chromium.launch();
  
  // Test 1: Desktop
  console.log('\n--- 1. DESKTOP 1440px ---');
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto(PROD_URL, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000);
  
  const desktopProto = desktopPage.getByRole('link', { name: 'Interactive Prototype' });
  await desktopProto.click({ timeout: 4000 });
  console.log('Desktop click URL:', desktopPage.url());

  // Test 2: Mobile iPhone 14
  console.log('\n--- 2. MOBILE iPhone 14 (390px) ---');
  const mobileContext = await browser.newContext(devices['iPhone 14']);
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(PROD_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);

  const status = await mobilePage.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button')).map(el => {
      const rect = el.getBoundingClientRect();
      const topEl = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return {
        text: el.innerText.trim(),
        href: el.getAttribute('href'),
        topEl: topEl ? topEl.tagName + '.' + topEl.className : null,
        clickable: topEl === el || el.contains(topEl)
      };
    }).filter(x => x.text && ['Interactive Prototype', 'Jury Demo (2 min) →', 'Architecture'].includes(x.text));
  });
  console.log('Mobile buttons clickability:', JSON.stringify(status, null, 2));

  const mobileProto = mobilePage.getByRole('link', { name: 'Interactive Prototype' });
  await mobileProto.click({ timeout: 4000 });
  console.log('Mobile click URL:', mobilePage.url());

  // Test 3: Walkthrough Page
  console.log('\n--- 3. WALKTHROUGH PAGE ---');
  const wtPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await wtPage.goto(PROD_URL + '/walkthrough', { waitUntil: 'networkidle' });
  const wtBtn = wtPage.getByRole('link', { name: 'Launch Interactive Prototype →' });
  await wtBtn.click({ timeout: 4000 });
  console.log('Walkthrough to Prototype click URL:', wtPage.url());

  await browser.close();
  console.log('\nALL VERIFICATIONS PASSED ON PRODUCTION!');
}

verifyProd().catch(err => {
  console.error('Verification failed:', err.message);
  process.exit(1);
});
