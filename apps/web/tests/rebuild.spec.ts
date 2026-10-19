import {test,expect} from '@playwright/test';

for(const width of [1440,768,390,320]){
 test(`rebuild visual boundaries at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1000});await page.goto('/story');await page.evaluate(()=>document.fonts.ready);
  // The credential is a prop in two relevant places, never a repeated scene template.
  await expect(page.locator('.health-card')).toHaveCount(2);
  const sizes=await page.locator('.card-owner>svg').evaluateAll(nodes=>nodes.map(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})));
  for(const size of sizes){expect(size.width).toBeLessThanOrEqual(44);expect(size.height).toBeLessThanOrEqual(44);}
  const publicScope=page.locator('#public-minimum');
  await expect(publicScope.getByText('Critical allergy',{exact:true})).toBeVisible();
  await expect(publicScope.locator('.closed')).toHaveCount(3);
  await expect(page.locator('#verified-help .limited-output')).toContainText('Complete lifetime medical record remains locked');
  await expect(page.locator('#doctor-consent button')).toHaveCount(2);
  await expect(page.getByRole('button',{name:'Allow selected records'})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Deny request',exact:true})).toBeEnabled();
  for(const scope of await page.locator('#doctor-consent input[type=checkbox]').all())await expect(scope).not.toBeChecked();
  await expect(page.locator('#doctor-consent')).toContainText('2 hours');
  await expect(page.locator('#doctor-consent')).toContainText('No permission is granted');
  await expect(page.locator('#distributed-records .network-facility')).toHaveCount(4);
  await expect(page.locator('#distributed-records')).toContainText('Expired · no access');
  await expect(page.locator('#sealed-records .sealed-art')).toContainText('Related test');
  await expect(page.locator('#sealed-records .sealed-art')).toContainText('Revealing metadata');
  await expect(page.getByRole('switch',{name:'Medication reminder permission'})).toHaveAttribute('aria-checked','false');
  await expect(page.locator('#transparency .proof-event')).toHaveCount(3);
  await expect(page.locator('#transparency')).toContainText('Not tamper-impossible');
  await expect(page.locator('#transparency button')).toHaveCount(3);
  await expect(page.locator('.evidence-interactive')).toHaveAttribute('data-evidence-state','aligned');
  await expect(page.getByRole('button',{name:'Reset evidence example',exact:true})).toBeDisabled();
  const stage=await page.locator('.emergency-anchor').evaluate(el=>getComputedStyle(el).position);
  expect(stage).toBe(width>700?'sticky':'relative');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);expect(overflow).toBe(false);
 });
}

test('all same-page anchors have unique targets and native navigation',async({page})=>{
 await page.goto('/story');
 const broken=await page.locator('a[href^="#"]').evaluateAll(nodes=>nodes.flatMap(node=>{const href=node.getAttribute('href')!;return document.querySelectorAll(href).length===1?[]:[href];}));
 expect(broken).toEqual([]);
 await page.getByRole('link',{name:'Public health',exact:true}).click();
 await expect(page).toHaveURL(/#population$/);await expect(page.locator('#population')).toBeInViewport();
});

test('complete story is available with JavaScript and motion disabled',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce',viewport:{width:320,height:900}});
 const page=await context.newPage();await page.goto('/story');
 for(const chapter of await page.locator('[data-act]').all()){
  await chapter.scrollIntoViewIfNeeded();
  expect(await chapter.evaluate(el=>getComputedStyle(el).visibility)).toBe('visible');
 }
 await page.locator('#finale a').first().click();await expect(page.locator('h1')).toContainText('Not a live health service');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await context.close();
});

test('skip navigation targets exist on supporting pages',async({page})=>{
 for(const route of ['/architecture','/status','/walkthrough']){
  await page.goto(route);await page.keyboard.press('Tab');await expect(page.getByText('Skip to content',{exact:true})).toBeFocused();
  await page.keyboard.press('Enter');await expect(page).toHaveURL(/#main$/);await expect(page.locator('main#main')).toHaveCount(1);
 }
});
