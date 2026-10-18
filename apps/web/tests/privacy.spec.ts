import {test,expect} from '@playwright/test';

for(const width of[1440,768,390,320]){
 test(`distributed exchange and privacy boundaries at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1000});await page.goto('/story#distributed-records');
  const network=page.locator('.network-experience');
  await expect(network).toContainText('does not use or grant your consent choice above');
  await expect(network.locator('.network-facility')).toHaveCount(4);
  await expect(page.getByRole('button',{name:'Illustrate exchange expiry'})).toBeEnabled();
  await page.getByRole('button',{name:'Illustrate exchange expiry'}).click();
  await expect(network).toHaveAttribute('data-exchange-state','expired');
  await expect(network.locator('.authorized-packet')).toHaveCount(0);
  await expect(network.locator('.exchange-status')).toContainText('Records stay');
  await expect(network).toContainText('cannot be remotely erased');
  await expect(network.locator('.network-facility')).toHaveCount(4);
  await page.getByRole('button',{name:'Replay authorized example'}).click();
  await expect(network).toHaveAttribute('data-exchange-state','authorized');
  const boundary=page.locator('.sealed-experience');
  await page.getByRole('button',{name:'Trace linked information'}).click();
  await expect(boundary).toHaveAttribute('data-boundary-state','relationships');
  await expect(page.getByRole('button',{name:'Reset boundary view'})).toHaveAttribute('aria-pressed','true');
  for(const label of['Sensitive clinical episode','Linked prescription','Related test','Revealing metadata'])await expect(boundary.locator('.sealed-art')).toContainText(label);
  await expect(boundary).toContainText('ALL RELATED INFORMATION REMAINS SEALED');
  await page.getByRole('button',{name:'Reset boundary view'}).click();
  await expect(boundary).toHaveAttribute('data-boundary-state','overview');
  const reminder=page.getByRole('switch',{name:'Medication reminder permission'});
  await expect(reminder).toHaveAttribute('aria-checked','false');
  await reminder.click();await expect(reminder).toHaveAttribute('aria-checked','true');
  await expect(page.locator('.family-reminder-preview')).toContainText('A care reminder is due.');
  await expect(page.locator('.family-reminder-preview')).toContainText('No medicine name');
  await expect(page.locator('.family-interactive .disabled-setting')).toContainText('Remains locked');
  await reminder.click();await expect(reminder).toHaveAttribute('aria-checked','false');
  await expect(page.locator('.family-reminder-preview')).toContainText('No reminder permission');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}

test('privacy illustrations are keyboard operated and keep focus on their controls',async({page})=>{
 await page.goto('/story#distributed-records');
 let expiry=page.getByRole('button',{name:'Illustrate exchange expiry'});await expect(expiry).toBeEnabled();
 await expiry.focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('button',{name:'Replay authorized example'})).toBeFocused();
 const trace=page.getByRole('button',{name:'Trace linked information'});await trace.focus();await page.keyboard.press('Space');
 await expect(page.getByRole('button',{name:'Reset boundary view'})).toBeFocused();
 const reminder=page.getByRole('switch',{name:'Medication reminder permission'});await reminder.focus();await page.keyboard.press('Space');
 await expect(reminder).toHaveAttribute('aria-checked','true');await expect(reminder).toBeFocused();
});

test('privacy state is local, independent of consent and resets on reload',async({page})=>{
 await page.goto('/story#doctor-consent');const writes:string[]=[];
 page.on('request',r=>{if(r.method()!=='GET')writes.push(r.method()+' '+r.url());});
 await page.getByRole('button',{name:'Deny request',exact:true}).click();
 await expect(page.locator('.consent-demo')).toHaveAttribute('data-consent-state','denied');
 await expect(page.locator('.network-example-note')).toContainText('SEPARATE ILLUSTRATIVE SCENARIO');
 await page.getByRole('button',{name:'Illustrate exchange expiry'}).click();
 await page.getByRole('switch',{name:'Medication reminder permission'}).click();
 await page.getByRole('button',{name:'Trace linked information'}).click();
 expect(writes).toEqual([]);
 expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
 await expect(page.locator('.consent-demo')).toHaveAttribute('data-consent-state','denied');
 await page.reload();
 await expect(page.getByRole('switch',{name:'Medication reminder permission'})).toHaveAttribute('aria-checked','false');
 await expect(page.locator('.sealed-experience')).toHaveAttribute('data-boundary-state','overview');
 await expect(page.locator('.network-experience')).toHaveAttribute('data-exchange-state','authorized');
});

test('privacy story works without JavaScript and controls are explicitly disabled',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:1000}});const page=await context.newPage();
 await page.goto('/story#distributed-records');
 await expect(page.getByRole('button',{name:'Illustrate exchange expiry'})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Trace linked information'})).toBeDisabled();
 await expect(page.getByRole('switch',{name:'Medication reminder permission'})).toBeDisabled();
 await expect(page.locator('.network-experience .privacy-nojs')).toContainText('path closes');
 await expect(page.locator('.sealed-experience')).toContainText('Revealing metadata');
 await expect(page.locator('.family-interactive .privacy-nojs')).toContainText('never automatically includes');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await context.close();
});

test('reduced motion disables diagrams motion without disabling privacy choices',async({page})=>{
 await page.goto('/story#distributed-records');
 await expect(page.locator('.network-experience')).toHaveAttribute('data-network-motion','enabled');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.network-experience')).not.toHaveAttribute('data-network-motion');
 await expect(page.locator('.sealed-experience')).not.toHaveAttribute('data-boundary-motion');
 await page.getByRole('button',{name:'Illustrate exchange expiry'}).click();
 await expect(page.locator('.network-experience')).toHaveAttribute('data-exchange-state','expired');
 await page.getByRole('switch',{name:'Medication reminder permission'}).click();
 await expect(page.getByRole('switch',{name:'Medication reminder permission'})).toHaveAttribute('aria-checked','true');
});
