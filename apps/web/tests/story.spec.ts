import {test,expect} from '@playwright/test';
const acts=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV'];
for(const width of [1440,768,390,320]){
 test(`complete static narrative at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/story');await expect(page.locator('h1')).toContainText('cannot speak');
  for(const act of acts) await expect(page.locator(`[data-act="${act}"]`)).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('#finale a')).toHaveCount(2);
  await page.getByRole('link',{name:'Experience the Prototype'}).click();
  await expect(page).toHaveURL(/(prototype|walkthrough)/);
  await expect(page.locator('h1')).toContainText(/Not a live health service|One trust layer/);
  await page.goto('/walkthrough');
  await page.getByRole('link',{name:/VI Identity is not permission/}).click();
  await expect(page).toHaveURL(/#doctor-consent/);
  await expect(page.locator('#doctor-consent')).toBeInViewport();
  expect(errors).toEqual([]);
 });
}
test('all narrative chapters usable without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto('/story');
 await page.getByRole('link',{name:'Everyday care'}).click();await expect(page.locator('#ordinary-visit')).toBeInViewport();
 await expect(page.getByText('Illustration only. No permission is granted',{exact:false})).toBeAttached();
 await page.getByRole('link',{name:'How the protection model works'}).click();await expect(page).toHaveURL(/architecture#emergency-protection/);
 await expect(page.locator('#emergency-protection')).toBeInViewport();await context.close();
});
