import {test,expect} from '@playwright/test';

for(const width of[1440,768,390,320]){
 test(`evidence, outage boundaries and finale at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1000});await page.goto('/story#transparency');
  const evidence=page.locator('.evidence-interactive'),reference=evidence.locator('.witness-reference code');
  const edit=page.getByRole('button',{name:'Illustrate a historical edit',exact:true});await expect(edit).toBeEnabled();
  await expect(evidence).toHaveAttribute('data-evidence-state','aligned');await expect(reference).toHaveText('f1b8…2c04');
  await expect(evidence).toContainText('No hashes are computed');await expect(page.getByRole('button',{name:'Reset evidence example'})).toBeDisabled();
  await edit.click();await expect(evidence).toHaveAttribute('data-evidence-state','mismatch');
  await expect(evidence.locator('.proof-event[data-example-edit="changed"] code')).toContainText('a49c…6d20');
  await expect(reference).toHaveText('f1b8…2c04');await expect(evidence.locator('.evidence-comparison')).toContainText('does not identify who changed it');
  await page.getByRole('button',{name:'Remove witness reference',exact:true}).click();
  await expect(evidence).toHaveAttribute('data-evidence-state','unavailable');await expect(evidence.locator('.evidence-comparison')).toContainText('not successful verification');
  await page.getByRole('button',{name:'Restore witness reference',exact:true}).click();await expect(evidence).toHaveAttribute('data-evidence-state','mismatch');
  await page.getByRole('button',{name:'Reset evidence example',exact:true}).click();await expect(evidence).toHaveAttribute('data-evidence-state','aligned');
  await expect(evidence.locator('.proof-event')).toHaveCount(3);
  const care=page.locator('.continuity-demo');await expect(care).toHaveAttribute('data-failure-scenario','internet');
  await expect(care.locator('.continuity-explanation')).toContainText('URL-only credential cannot be assumed to load offline');
  await page.getByRole('button',{name:'Service unavailable',exact:true}).click();await expect(care).toHaveAttribute('data-failure-scenario','service');
  await expect(care).toContainText('No blanket override');await expect(care).toContainText('never becomes permission to receive healthcare');
  await page.getByRole('button',{name:'Phone unusable',exact:true}).click();await expect(care).toHaveAttribute('data-failure-scenario','phone');
  await expect(care.locator('.continuity-explanation')).toContainText('Do not unlock an unconscious person’s phone');
  await expect(page.getByRole('heading',{name:'CARE CONTINUES.'})).toBeVisible();
  await page.getByRole('button',{name:'Internet offline',exact:true}).click();await expect(care).toHaveAttribute('data-failure-scenario','internet');
  await expect(page.locator('#finale .finale-line')).toHaveCount(4);await expect(page.locator('#finale a')).toHaveCount(2);
  await expect(page.locator('#finale .official-disclaimer')).toHaveText('Concept / prototype — not an official government service.');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}

test('closing examples and both CTA destinations work by keyboard',async({page})=>{
 await page.goto('/story#transparency');const edit=page.getByRole('button',{name:'Illustrate a historical edit',exact:true});await expect(edit).toBeEnabled();await edit.focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('button',{name:'Restore original example',exact:true})).toBeFocused();
 const missing=page.getByRole('button',{name:'Remove witness reference',exact:true});await missing.focus();await page.keyboard.press('Space');
 await expect(page.locator('.evidence-interactive')).toHaveAttribute('data-evidence-state','unavailable');
 const phone=page.getByRole('button',{name:'Phone unusable',exact:true});await phone.focus();await page.keyboard.press('Space');await expect(phone).toHaveAttribute('aria-pressed','true');
 const prototype=page.getByRole('link',{name:'Experience the Prototype',exact:true});await prototype.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/(prototype|walkthrough)$/);await expect(page.locator('h1')).toContainText(/Not a live health service|One trust layer/);
 await page.goto('/story#finale');const architecture=page.getByRole('link',{name:'Explore the Architecture',exact:true});await architecture.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/architecture$/);
});

test('closing examples are ephemeral and cannot change other permissions or real connectivity',async({page})=>{
 await page.goto('/story');const writes:string[]=[];page.on('request',request=>{if(request.method()!=='GET')writes.push(request.url());});
 const online=await page.evaluate(()=>navigator.onLine);
 await page.getByRole('button',{name:'Illustrate a historical edit'}).click();await page.getByRole('button',{name:'Remove witness reference'}).click();await page.getByRole('button',{name:'Phone unusable',exact:true}).click();
 expect(await page.evaluate(()=>navigator.onLine)).toBe(online);expect(writes).toEqual([]);expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
 await expect(page.locator('.consent-demo')).toHaveAttribute('data-consent-state','request');await expect(page.getByRole('switch',{name:'Medication reminder permission'})).toHaveAttribute('aria-checked','false');
 await page.reload();await expect(page.locator('.evidence-interactive')).toHaveAttribute('data-evidence-state','aligned');await expect(page.locator('.continuity-demo')).toHaveAttribute('data-failure-scenario','internet');
});

test('closing narrative remains complete without JavaScript and CTAs are honest',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:1000}});const page=await context.newPage();await page.goto('/story#transparency');
 await expect(page.locator('.evidence-controls button,.outage-row button')).toHaveCount(6);
 for(const button of await page.locator('.evidence-controls button,.outage-row button').all())await expect(button).toBeDisabled();
 await expect(page.locator('.evidence-interactive .closing-nojs')).toContainText('missing reference means the comparison is unavailable');
 await expect(page.locator('.continuity-demo .closing-nojs')).toContainText('Phone unusable');
 await expect(page.locator('#care-title')).toContainText('CONTINUES');await expect(page.locator('#finale a')).toHaveCount(2);
 await page.getByRole('link',{name:'Experience the Prototype',exact:true}).click();await expect(page.locator('h1')).toContainText(/Not a live health service|One trust layer/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});

test('closing movement reverses and static fallback handles live preferences and mobile sizing',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/story');const evidence=page.locator('.evidence-interactive');
 await expect(evidence).toHaveAttribute('data-closing-motion','enabled');await expect.poll(()=>evidence.evaluate(e=>e.style.getPropertyValue('--closing-progress'))).toBe('0.0000');
 await evidence.evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY));await expect.poll(()=>evidence.evaluate(e=>e.style.getPropertyValue('--closing-progress'))).toBe('1.0000');
 await page.evaluate(()=>window.scrollTo(0,0));await expect.poll(()=>evidence.evaluate(e=>e.style.getPropertyValue('--closing-progress'))).toBe('0.0000');
 await expect(evidence).toHaveAttribute('data-evidence-state','aligned');
 await page.emulateMedia({reducedMotion:'reduce'});for(const selector of['.evidence-interactive','.continuity-demo','.cinema-finale'])await expect(page.locator(selector)).not.toHaveAttribute('data-closing-motion');
 await page.getByRole('button',{name:'Illustrate a historical edit'}).click();await expect(evidence).toHaveAttribute('data-evidence-state','mismatch');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:390,height:844});await expect(evidence).not.toHaveAttribute('data-closing-motion');
 await page.setViewportSize({width:1440,height:1000});await expect(evidence).toHaveAttribute('data-closing-motion','enabled');
 for(const line of await page.locator('.finale-line').all())expect(await line.evaluate(e=>getComputedStyle(e).opacity)).toBe('1');
});
