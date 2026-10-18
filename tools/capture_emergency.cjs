// With the app running: node tools/capture_emergency.cjs
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const folder = process.env.CAPTURE_DIR || 'evidence/phase-3';
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:3000';
(async () => {
  fs.mkdirSync(folder, { recursive: true });
  const browser = await chromium.launch();
  for (const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(baseURL);
    await page.locator('.rebuilt[data-motion]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const [label,selector] of [['opening','.cinema-hero'],['public','#public-minimum'],['responder','#verified-help'],['family','#family-alert']]) {
      await page.locator(selector).evaluate(el => scrollTo(0,el.getBoundingClientRect().top+scrollY-35));
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.screenshot({ path: `${folder}/${name}-${label}.png` });
    }
    if (name === 'desktop') {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${baseURL}/#verified-help`);
      await page.screenshot({ path: `${folder}/desktop-reduced-motion.png` });
    }
    await page.close();
  }
  await browser.close();
})().catch(err => { console.error(err); process.exitCode=1; });
