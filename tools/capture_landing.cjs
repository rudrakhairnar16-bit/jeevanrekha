// Run after starting the app: node tools/capture_landing.cjs
// Uses the existing Playwright dependency; writes deterministic review evidence.
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:3000';
const folder = 'evidence/phase-2-rebuild';
const ids = ['public-minimum','verified-help','family-alert','ordinary-visit','doctor-consent','distributed-records','sealed-records','family-permission','emergency-locker','population','aggregation','transparency','care-continues','finale'];
(async () => {
  fs.mkdirSync(folder, { recursive: true });
  const browser = await chromium.launch();
  const metrics = [];
  for (const [name, width, height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small',320,844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(baseURL);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${folder}/${name}-hero.png` });
    if (name === 'desktop' || name === 'mobile') {
      for (const id of ids) await page.locator(`#${id}`).screenshot({ path: `${folder}/${name}-${id}.png` });
      await page.screenshot({ path: `${folder}/${name}-full.png`, fullPage: true });
    }
    metrics.push(await page.evaluate(({ name, width }) => ({
      name, width, horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
      pageHeight: document.documentElement.scrollHeight,
      credentialCount: document.querySelectorAll('.health-card').length,
      decorativeQRSizes: [...document.querySelectorAll('.card-owner>svg')].map(n => ({ width: n.getBoundingClientRect().width, height: n.getBoundingClientRect().height }))
    }), { name, width }));
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(`${folder}/viewport-metrics.json`, JSON.stringify(metrics, null, 2));
  console.log(JSON.stringify(metrics, null, 2));
})().catch(err => { console.error(err); process.exitCode = 1; });
