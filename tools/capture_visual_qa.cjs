const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const outDir = 'evidence/final/screenshots';
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();

  // Helper
  const snap = async (url, file, width = 1440, height = 900, action = null) => {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto('http://127.0.0.1:3000' + url, { waitUntil: 'domcontentloaded' });
    if (action) await action(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`[Snap] ${file} (overflow: ${overflow})`);
    await page.screenshot({ path: path.join(outDir, file), fullPage: false });
    await page.close();
    return { file, overflow };
  };

  // 1. Landing
  await snap('/', '01_landing_desktop.png', 1440, 900);
  await snap('/', '01_landing_mobile.png', 390, 844);

  // 2. /prototype Hub
  await snap('/prototype', '02_prototype_hub_desktop.png', 1440, 900);
  await snap('/prototype', '02_prototype_hub_mobile.png', 390, 844);

  // 3. Citizen pending request
  await snap('/prototype', '03_citizen_pending.png', 1440, 900, async (page) => {
    await page.getByRole('button', { name: /Doctor/ }).first().click();
    await page.getByRole('button', { name: 'Confirm correct patient' }).click();
    await page.getByRole('button', { name: /Prescriptions/ }).click(); // labs only
    await page.getByRole('button', { name: '2 hours' }).click(); // 1 hour
    await page.getByRole('button', { name: 'Send consent request' }).click();
    await page.getByRole('button', { name: /Citizen/ }).first().click();
    await page.getByRole('button', { name: 'Access', exact: true }).click();
  });

  // 4. Active Labs-only grant
  await snap('/prototype', '04_active_labs_grant.png', 1440, 900, async (page) => {
    await page.getByRole('button', { name: /Doctor/ }).first().click();
    await page.getByRole('button', { name: 'Confirm correct patient' }).click();
    await page.getByRole('button', { name: /Prescriptions/ }).click();
    await page.getByRole('button', { name: '2 hours' }).click();
    await page.getByRole('button', { name: 'Send consent request' }).click();
    await page.getByRole('button', { name: /Citizen/ }).first().click();
    await page.getByRole('button', { name: 'Access', exact: true }).click();
    await page.getByRole('button', { name: 'Allow Access for 1 hour' }).click();
  });

  // 5. Doctor Labs-only retrieval
  await snap('/prototype', '05_doctor_labs_retrieval.png', 1440, 900, async (page) => {
    await page.getByRole('button', { name: /Doctor/ }).first().click();
    await page.getByRole('button', { name: 'Confirm correct patient' }).click();
    await page.getByRole('button', { name: /Prescriptions/ }).click();
    await page.getByRole('button', { name: '2 hours' }).click();
    await page.getByRole('button', { name: 'Send consent request' }).click();
    await page.getByRole('button', { name: /Citizen/ }).first().click();
    await page.getByRole('button', { name: 'Access', exact: true }).click();
    await page.getByRole('button', { name: 'Allow Access for 1 hour' }).click();
    await page.getByRole('button', { name: /Doctor/ }).first().click();
  });

  // 6. Post-revoke blocked state
  await snap('/prototype', '06_post_revoke_blocked.png', 1440, 900, async (page) => {
    await page.getByRole('button', { name: /Doctor/ }).first().click();
    await page.getByRole('button', { name: 'Confirm correct patient' }).click();
    await page.getByRole('button', { name: /Prescriptions/ }).click();
    await page.getByRole('button', { name: '2 hours' }).click();
    await page.getByRole('button', { name: 'Send consent request' }).click();
    await page.getByRole('button', { name: /Citizen/ }).first().click();
    await page.getByRole('button', { name: 'Access', exact: true }).click();
    await page.getByRole('button', { name: 'Allow Access for 1 hour' }).click();
    await page.getByRole('button', { name: 'Revoke access' }).click();
    await page.getByRole('button', { name: /Doctor/ }).first().click();
  });

  // 7. Failure state (Responder offline)
  await snap('/prototype', '07_offline_failure_state.png', 1440, 900, async (page) => {
    await page.getByRole('button', { name: /Responder/ }).first().click();
    await page.getByRole('button', { name: 'Simulate network loss' }).click();
  });

  // 8. /demo
  await snap('/demo', '08_demo_launch.png', 1440, 900);
  await snap('/demo?autoplay=1&clean=1', '08_demo_clean.png', 1440, 900);
  await snap('/demo', '08_demo_mobile.png', 390, 844);

  // 9. /beastmode
  await snap('/beastmode', '09_beastmode.png', 1440, 900);

  await browser.close();
  console.log('Visual QA complete. All screenshots captured.');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
