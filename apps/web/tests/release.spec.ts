import {test,expect} from '@playwright/test';

test('all public routes have distinct titles and a focusable keyboard skip destination',async({page})=>{
 const titles=new Set<string>();
 for(const route of['/','/architecture','/walkthrough','/status']){
  await page.goto(route);titles.add(await page.title());
  await expect(page.locator('main')).toHaveCount(1);await expect(page.getByRole('heading',{level:1})).toHaveCount(1);await expect(page.locator('html')).toHaveAttribute('lang','en');
  await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to content',exact:true})).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('main#main')).toBeFocused();
 }
 expect(titles.size).toBe(4);
});

test('1280px at 200% layout-equivalent and 320px reflow preserve routes and controls',async({page})=>{
 // CSS viewport reduction models browser-zoom reflow; not a claim of physical/browser-UI zoom testing.
 for(const width of[640,320]){
  await page.setViewportSize({width,height:1000});
  for(const route of['/','/architecture','/walkthrough','/status']){
   await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.goto('/story#doctor-consent');await page.getByRole('button',{name:'Deny request',exact:true}).click();await expect(page.locator('.consent-demo')).toHaveAttribute('data-consent-state','denied');
  await expect(page.locator('#finale a')).toHaveCount(2);
 }
});

test('forced-colors and reduced-motion retain explicit state and keyboard operation',async({page})=>{
 await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});await page.goto('/story#family-permission');
 const reminder=page.getByRole('switch',{name:'Medication reminder permission'});await expect(reminder).toBeEnabled();await reminder.focus();await page.keyboard.press('Space');await expect(reminder).toHaveAttribute('aria-checked','true');await expect(reminder).toContainText('On');
 await page.getByRole('button',{name:'Trace path A',exact:true}).click();await expect(page.locator('.aggregation-trace-reading')).toContainText('Path A is emphasized');
 await page.getByRole('button',{name:'Phone unusable',exact:true}).click();await expect(page.locator('.continuity-explanation')).toContainText('working phone is not a condition');
 await expect(page.locator('#finale a')).toHaveCount(2);await expect(page.locator('.cinema-finale')).not.toHaveAttribute('data-closing-motion');
});
