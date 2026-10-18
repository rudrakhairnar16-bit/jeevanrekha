import {test,expect} from '@playwright/test';
for(const width of [1440,390,320]){
 test(`foundation at ${width}px`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:900});await page.goto('/story');
  await expect(page.locator('h1')).toContainText('cannot speak');
  await expect(page.getByText('Concept / prototype — not an official government service.')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.getByRole('link',{name:'Explore the Architecture'}).click();
  await expect(page).toHaveURL(/architecture/);
  await expect(page.locator('h1')).toContainText('Records stay distributed');
  expect(errors).toEqual([]);
 });
}
test('keyboard skip link and reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/story');await page.keyboard.press('Tab');
 await expect(page.getByText('Skip to content')).toBeFocused();
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});
test('static story works without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('/story');
 await expect(page.locator('h1')).toBeVisible();await page.getByRole('link',{name:'Build status'}).click();await expect(page.locator('h1')).toContainText('A careful beginning');await context.close();
});
