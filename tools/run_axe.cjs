const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const axeScriptPath = require.resolve('axe-core/axe.min.js');
  const routes = ['/', '/prototype', '/demo', '/beastmode', '/architecture', '/status', '/story', '/walkthrough'];
  const viewports = [1440, 768, 390, 320];
  const results = {};
  let totalViolations = 0;

  for (const route of routes) {
    results[route] = {};
    for (const w of viewports) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 } });
      await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded' });
      await page.addScriptTag({ path: axeScriptPath });
      const res = await page.evaluate(async () => {
        return await axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] }
        });
      });
      const violationsCount = res.violations.length;
      totalViolations += violationsCount;
      results[route][w] = {
        violations: violationsCount,
        details: res.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description }))
      };
      console.log(`${route} @ ${w}px: ${violationsCount} violations`);
      await page.close();
    }
  }

  console.log('=== TOTAL VIOLATIONS:', totalViolations, '===');
  await browser.close();
  fs.mkdirSync('evidence/final', { recursive: true });
  fs.writeFileSync('evidence/final/accessibility-summary.json', JSON.stringify(results, null, 2));
})().catch(e => {
  console.error(e);
  process.exit(1);
});
