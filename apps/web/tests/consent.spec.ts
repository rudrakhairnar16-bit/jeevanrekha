import {test,expect} from '@playwright/test';

for(const width of[1440,768,390,320]){
 test(`explicit scoped consent and Deny at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:1000});await page.goto('/story#doctor-consent');
  const demo=page.locator('.consent-demo');
  await expect(page.getByRole('button',{name:'Deny request',exact:true})).toBeEnabled();
  await expect(page.getByRole('checkbox',{name:'Laboratory reports'})).not.toBeChecked();
  await expect(page.getByRole('checkbox',{name:'Previous prescriptions'})).not.toBeChecked();
  await expect(page.getByRole('button',{name:'Allow selected records'})).toBeDisabled();
  await page.getByRole('checkbox',{name:'Laboratory reports'}).check();
  await page.getByRole('button',{name:'Allow selected records'}).click();
  await expect(demo).toHaveAttribute('data-consent-state','allowed');
  await expect(page.locator('#consent-outcome-title')).toBeFocused();
  await expect(page.locator('.allowed-records')).toContainText('Laboratory reports');
  await expect(page.locator('.allowed-records')).not.toContainText('Previous prescriptions');
  await expect(page.locator('.outcome-lock')).toContainText('Unselected categories');
  await expect(demo).toContainText('Current treatment · 2 hours');
  await page.getByRole('button',{name:'Try the request again'}).click();
  await expect(page.getByRole('checkbox',{name:'Laboratory reports'})).toBeFocused();
  await expect(page.getByRole('checkbox',{name:'Laboratory reports'})).not.toBeChecked();
  await page.getByRole('button',{name:'Deny request',exact:true}).click();
  await expect(demo).toHaveAttribute('data-consent-state','denied');
  await expect(page.locator('#consent-outcome-title')).toHaveText('No sharing. Care continues.');
  await expect(page.locator('.allowed-records')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}

test('both requested categories, revocation, expiry and reload are local illustrations',async({page})=>{
 await page.goto('/story#doctor-consent');
 const writes:string[]=[];page.on('request',r=>{if(r.method()!=='GET')writes.push(`${r.method()} ${r.url()}`);});
 await page.getByRole('checkbox',{name:'Laboratory reports'}).check();
 await page.getByRole('checkbox',{name:'Previous prescriptions'}).check();
 await page.getByRole('button',{name:'Allow selected records'}).click();
 await expect(page.locator('.allowed-records li')).toHaveCount(2);
 await page.getByRole('button',{name:'Revoke illustration'}).click();
 await expect(page.locator('.consent-demo')).toHaveAttribute('data-consent-state','revoked');
 await expect(page.locator('.consent-demo')).toContainText('cannot remotely erase copies already received');
 await page.getByRole('button',{name:'Try the request again'}).click();
 await page.getByRole('checkbox',{name:'Previous prescriptions'}).check();
 await page.getByRole('button',{name:'Allow selected records'}).click();
 await page.getByRole('button',{name:'Illustrate expiry'}).click();
 await expect(page.locator('.consent-demo')).toHaveAttribute('data-consent-state','expired');
 await expect(page.locator('.consent-demo')).toContainText('new request would need a new decision');
 await expect(page.locator('.allowed-records')).toHaveCount(0);
 expect(writes).toEqual([]);
 expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
 await page.reload();await expect(page.locator('.consent-demo')).toHaveAttribute('data-consent-state','request');
 await expect(page.getByRole('checkbox',{name:'Previous prescriptions'})).not.toBeChecked();
});

test('keyboard-only request selection, decision and reset',async({page})=>{
 await page.goto('/story#doctor-consent');
 const labs=page.getByRole('checkbox',{name:'Laboratory reports'});
 await expect(labs).toBeEnabled();
 await labs.focus();await page.keyboard.press('Space');await expect(labs).toBeChecked();
 await page.keyboard.press('Tab');await expect(page.getByRole('checkbox',{name:'Previous prescriptions'})).toBeFocused();
 await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'Allow selected records'})).toBeFocused();
 await page.keyboard.press('Enter');await expect(page.locator('#consent-outcome-title')).toBeFocused();
 await page.getByRole('button',{name:'Try the request again'}).focus();await page.keyboard.press('Enter');
 await expect(labs).toBeFocused();
});

test('no-JavaScript request is readable, disabled and includes both outcomes',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:1000}});
 const page=await context.newPage();await page.goto('/story#doctor-consent');
 await expect(page.getByRole('button',{name:'Deny request',exact:true})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Allow selected records'})).toBeDisabled();
 await expect(page.locator('.consent-nojs')).toContainText('no sharing. Care continues.');
 await expect(page.locator('.consent-nojs')).toContainText('two hours');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await context.close();
});

test('routine reset is explicit and reduced motion changes do not prevent consent',async({page})=>{
 await page.goto('/story#ordinary-visit');
 await expect(page.locator('#ordinary-visit')).toContainText('THE EMERGENCY PATH ENDS HERE');
 await expect(page.locator('#ordinary-visit')).toContainText('Emergency access is exceptional.');
 await expect(page.locator('#ordinary-visit')).toHaveAttribute('data-routine-motion','enabled');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('#ordinary-visit')).not.toHaveAttribute('data-routine-motion');
 await expect(page.locator('#doctor-consent')).not.toHaveAttribute('data-routine-motion');
 await page.getByRole('button',{name:'Deny request',exact:true}).click();
 await expect(page.locator('.consent-demo')).toHaveAttribute('data-consent-state','denied');
});
