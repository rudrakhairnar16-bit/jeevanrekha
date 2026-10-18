import {test,expect} from '@playwright/test';

for(const width of [1440,768,390,320]){
 test(`protection conditions and population boundaries at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1000});await page.goto('/story#emergency-locker');
  const protection=page.locator('.protection-demo');
  const credential=page.getByRole('checkbox',{name:'Include emergency credential',exact:true});
  const service=page.getByRole('checkbox',{name:'Include protected service',exact:true});
  const context=page.getByRole('checkbox',{name:'Include authorized responder context',exact:true});
  await expect(credential).toBeEnabled();
  for(const condition of[credential,service,context])await expect(condition).not.toBeChecked();
  for(const condition of[credential,service,context]){
   await condition.check();await expect(protection).toHaveAttribute('data-protection-state','incomplete');await condition.uncheck();
  }
  await credential.check();await service.check();await expect(protection).toHaveAttribute('data-protection-state','incomplete');
  await context.check();await expect(protection).toHaveAttribute('data-protection-state','complete');
  await expect(protection).toContainText('Nothing is decrypted or released here');
  await expect(protection).toContainText('Complete medical history stays locked');
  await context.uncheck();await expect(protection).toHaveAttribute('data-protection-state','incomplete');
  await page.getByRole('button',{name:'Reset example',exact:true}).click();
  for(const condition of[credential,service,context])await expect(condition).not.toBeChecked();
  await expect(page.locator('.population-experience .district-signal')).toContainText('81');
  await page.getByRole('button',{name:'Illustrate missing reports'}).click();
  await expect(page.locator('.population-experience')).toHaveAttribute('data-coverage-state','limited');
  await expect(page.locator('.district-signal')).toContainText('43');await expect(page.locator('.district-signal')).toContainText('Low');
  await expect(page.locator('.district-signal')).toContainText('Trend uncertain');
  await expect(page.locator('.population-experience .period-bar')).toHaveCount(0);
  await expect(page.locator('.coverage-reading')).toContainText('Missing reports are not zero cases');
  await expect(page.locator('.legal-reporting-note')).toContainText('separate, legally governed workflow');
  await expect(page.locator('.population-experience circle')).toHaveCount(0);
  await page.getByRole('button',{name:'Restore baseline example'}).click();
  await expect(page.locator('.population-experience')).toHaveAttribute('data-coverage-state','baseline');
  await page.getByRole('button',{name:'Trace path A',exact:true}).click();
  await expect(page.locator('.aggregation-demo')).toHaveAttribute('data-trace-path','a');
  await page.getByRole('button',{name:'Trace path B',exact:true}).click();
  await expect(page.locator('.aggregation-demo')).toHaveAttribute('data-trace-path','b');
  await expect(page.locator('.aggregation-path-a path')).toHaveCount(3);await expect(page.locator('.aggregation-path-b path')).toHaveCount(3);
  for(const label of['Aggregator A','Aggregator B'])await expect(page.getByRole('heading',{name:label,exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Show both paths',exact:true}).click();
  await expect(page.getByRole('button',{name:'Show both paths',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.locator('.aggregation-limits summary').click();
  await expect(page.locator('.aggregation-limits')).toHaveAttribute('open','');
  await expect(page.locator('.aggregation-limits')).toContainText('Small-cell suppression alone is not differential privacy');
  await expect(page.locator('.aggregation-limits')).toContainText('not district-wide unique patients');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}

test('condition selection, scenario and native disclosure work by keyboard',async({page})=>{
 await page.goto('/story#emergency-locker');const credential=page.getByRole('checkbox',{name:'Include emergency credential',exact:true});await expect(credential).toBeEnabled();
 await credential.focus();await page.keyboard.press('Space');await expect(credential).toBeChecked();
 const missing=page.getByRole('button',{name:'Illustrate missing reports'});await missing.focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('button',{name:'Restore baseline example'})).toBeFocused();
 const trace=page.getByRole('button',{name:'Trace path A',exact:true});await trace.focus();await page.keyboard.press('Space');await expect(trace).toHaveAttribute('aria-pressed','true');
 const disclosure=page.locator('.aggregation-limits summary');await disclosure.focus();await page.keyboard.press('Enter');await expect(page.locator('.aggregation-limits')).toHaveAttribute('open','');
});

test('protection and public-health examples remain local and reset on reload',async({page})=>{
 await page.goto('/story');const writes:string[]=[];page.on('request',r=>{if(r.method()!=='GET')writes.push(r.url());});
 for(const name of['Include emergency credential','Include protected service','Include authorized responder context'])await page.getByRole('checkbox',{name,exact:true}).check();
 await page.getByRole('button',{name:'Illustrate missing reports'}).click();await page.getByRole('button',{name:'Trace path B',exact:true}).click();
 expect(writes).toEqual([]);expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
 await expect(page.getByRole('switch',{name:'Medication reminder permission'})).toHaveAttribute('aria-checked','false');
 await expect(page.locator('.consent-demo')).toHaveAttribute('data-consent-state','request');
 await page.reload();await expect(page.locator('.protection-demo')).toHaveAttribute('data-protection-state','incomplete');
 await expect(page.locator('.population-experience')).toHaveAttribute('data-coverage-state','baseline');await expect(page.locator('.aggregation-demo')).toHaveAttribute('data-trace-path','both');
});

test('static diagrams and native limits work without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:1000}});const page=await context.newPage();await page.goto('/story#emergency-locker');
 for(const input of await page.locator('.protection-demo input').all())await expect(input).toBeDisabled();
 await expect(page.getByRole('button',{name:'Illustrate missing reports'})).toBeDisabled();await expect(page.getByRole('button',{name:'Trace path A',exact:true})).toBeDisabled();
 await expect(page.locator('.protection-demo .signal-nojs')).toContainText('No record is unlocked');
 await expect(page.locator('.population-experience .signal-nojs')).toContainText('missing reports cannot be treated as zero cases');
 await page.locator('.aggregation-limits summary').click();await expect(page.locator('.aggregation-limits')).toHaveAttribute('open','');
 await expect(page.locator('.aggregation-limits')).toContainText('non-collusion');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});

test('scroll diagrams reverse and static motion fallback survives preference and breakpoint changes',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/story');const root=page.locator('.aggregation-demo');
 await expect(root).toHaveAttribute('data-signal-motion','enabled');
 await expect.poll(()=>root.evaluate(e=>e.style.getPropertyValue('--signal-progress'))).toBe('0.0000');
 await root.evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY));
 await expect.poll(()=>root.evaluate(e=>e.style.getPropertyValue('--signal-progress'))).toBe('1.0000');
 await page.evaluate(()=>window.scrollTo(0,0));await expect.poll(()=>root.evaluate(e=>e.style.getPropertyValue('--signal-progress'))).toBe('0.0000');
 await page.emulateMedia({reducedMotion:'reduce'});for(const selector of['.protection-demo','.population-experience','.aggregation-demo'])await expect(page.locator(selector)).not.toHaveAttribute('data-signal-motion');
 await page.getByRole('button',{name:'Illustrate missing reports'}).click();await expect(page.locator('.population-experience')).toHaveAttribute('data-coverage-state','limited');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:390,height:844});await expect(root).not.toHaveAttribute('data-signal-motion');
 await page.setViewportSize({width:1440,height:1000});await expect(root).toHaveAttribute('data-signal-motion','enabled');
});
