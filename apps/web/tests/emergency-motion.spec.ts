import {test,expect} from '@playwright/test';

test('desktop native scroll advances and reverses emergency stages',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/story');
 const root=page.locator('.rebuilt');await expect(root).toHaveAttribute('data-motion','desktop');
 const hero=page.locator('.floating-credential');const initial=await hero.evaluate(el=>getComputedStyle(el).transform);
 await page.evaluate(()=>scrollTo(0,300));
 await expect.poll(()=>hero.evaluate(el=>getComputedStyle(el).transform)).not.toBe(initial);
 await page.locator('#public-minimum').scrollIntoViewIfNeeded();
 await expect(root).toHaveAttribute('data-emergency-stage','public');
 await page.locator('#verified-help').evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-50));
 await expect(root).toHaveAttribute('data-emergency-stage','responder');
 await expect.poll(()=>page.locator('.stage-authorization').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
 await expect(page.locator('#verified-help .limited-output')).toBeVisible();
 await page.evaluate(()=>scrollTo(0,0));await expect(root).toHaveAttribute('data-emergency-stage','public');
 await expect.poll(()=>hero.evaluate(el=>getComputedStyle(el).transform)).toBe(initial);
});

test('reduced motion, including a live preference change, restores static fallback',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/story#verified-help');
 const root=page.locator('.rebuilt');await expect(root).toHaveAttribute('data-motion','desktop');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(root).not.toHaveAttribute('data-motion');
 await expect(page.locator('.stage-authorization')).toBeHidden();
 await expect(page.locator('.scan-sweep')).toBeHidden();
 await expect(page.locator('#verified-help .limited-output')).toBeVisible();
 expect(await page.locator('.notification-card').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await expect(root).toHaveAttribute('data-motion','desktop');
});

test('mobile keeps document flow, then responds correctly to desktop resizing',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/story');
 const root=page.locator('.rebuilt');await expect(root).toHaveAttribute('data-motion','mobile');
 expect(await page.locator('.emergency-anchor').evaluate(el=>getComputedStyle(el).position)).toBe('relative');
 await expect(page.locator('.stage-authorization')).toBeHidden();
 await page.getByRole('link',{name:'Everyday care',exact:true}).click();await expect(page).toHaveURL(/#ordinary-visit/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.setViewportSize({width:1440,height:1000});await expect(root).toHaveAttribute('data-motion','desktop');
 await page.setViewportSize({width:320,height:844});await expect(root).toHaveAttribute('data-motion','mobile');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('notification arrives on scroll but never dispatches a real alert',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/story');
 await expect(page.locator('.rebuilt')).toHaveAttribute('data-motion','desktop');
 const phone=page.locator('.notification-card');const start=await phone.evaluate(el=>getComputedStyle(el).transform);
 await page.locator('#family-alert').evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY));
 await expect.poll(()=>phone.evaluate(el=>getComputedStyle(el).transform)).not.toBe(start);
 await expect.poll(()=>phone.evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
 await expect(phone).toContainText('Emergency credential triggered');
 await expect(page.locator('#family-alert')).toContainText('NOTHING IS SENT');
 // No consent decision occurs as a side effect of emergency scrolling.
 expect(await page.locator('#doctor-consent').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
 await expect(page.locator('#doctor-consent button').first()).toBeDisabled();
});

test('no-JavaScript emergency narrative needs no animated duplicate to explain the boundary',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}});
 const page=await context.newPage();await page.goto('/story#verified-help');
 await expect(page.locator('.rebuilt')).not.toHaveAttribute('data-motion');
 await expect(page.locator('.stage-authorization')).toBeHidden();
 await expect(page.locator('#verified-help .limited-output')).toBeVisible();
 await page.getByRole('link',{name:'Everyday care',exact:true}).click();
 await expect(page.locator('#ordinary-visit')).toBeInViewport();await context.close();
});


test('scan is not already complete when the public scene reaches its reading position',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/story');
 await expect(page.locator('.rebuilt')).toHaveAttribute('data-motion','desktop');
 await page.locator('#public-minimum').evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-35));
 await expect.poll(()=>page.locator('.rebuilt').evaluate(el=>Number((el as HTMLElement).style.getPropertyValue('--scan-travel')))).toBeLessThan(.3);
 await expect(page.locator('.stage-public')).toBeVisible();
 await expect(page.locator('.stage-authorization')).toBeHidden();
 await expect(page.locator('.stage-permanent-lock')).toBeVisible();
 await page.evaluate(()=>scrollBy(0,500));
 await expect.poll(()=>page.locator('.rebuilt').evaluate(el=>Number((el as HTMLElement).style.getPropertyValue('--scan-travel')))).toBeGreaterThan(.9);
 await expect(page.locator('.stage-permanent-lock')).toContainText('Locked');
});

test('verified stage has space for responder, summary and permanently locked history',async({page})=>{
 for(const width of[1440,768]){
  await page.setViewportSize({width,height:1000});await page.goto('/story#verified-help');
  await expect(page.locator('.rebuilt')).toHaveAttribute('data-emergency-stage','responder');
  await expect(page.locator('.stage-authorization')).toBeVisible();
  await expect(page.locator('.stage-public')).toBeHidden();
  const bounds=await page.evaluate(()=>{const summary=document.querySelector('.stage-summary')!.getBoundingClientRect(),lock=document.querySelector('.stage-permanent-lock')!.getBoundingClientRect();return {summaryBottom:summary.bottom,lockTop:lock.top};});
  expect(bounds.summaryBottom).toBeLessThan(bounds.lockTop);
  await expect(page.locator('.stage-permanent-lock')).toContainText('Locked');
 }
});
