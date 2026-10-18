// With app running: node tools/capture_privacy.cjs
const {chromium}=require('@playwright/test');const fs=require('node:fs');
const folder='evidence/phase-5',baseURL=process.env.BASE_URL||'http://127.0.0.1:3000';
(async()=>{
 fs.mkdirSync(folder,{recursive:true});const browser=await chromium.launch();
 for(const[name,width,height]of[['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small',320,844]]){
  const page=await browser.newPage({viewport:{width,height}});await page.goto(baseURL+'/#distributed-records');await page.evaluate(()=>document.fonts.ready);
  await page.getByRole('button',{name:'Illustrate exchange expiry'}).waitFor();
  await page.locator('#distributed-records').screenshot({path:`${folder}/${name}-network-authorized.png`,animations:'disabled'});
  await page.getByRole('button',{name:'Illustrate exchange expiry'}).click();
  await page.locator('#distributed-records').screenshot({path:`${folder}/${name}-network-expired.png`,animations:'disabled'});
  await page.locator('#sealed-records').screenshot({path:`${folder}/${name}-sealed-overview.png`,animations:'disabled'});
  await page.getByRole('button',{name:'Trace linked information'}).click();
  await page.locator('#sealed-records').screenshot({path:`${folder}/${name}-sealed-linked.png`,animations:'disabled'});
  await page.locator('#family-permission').screenshot({path:`${folder}/${name}-family-off.png`,animations:'disabled'});
  await page.getByRole('switch',{name:'Medication reminder permission'}).click();
  await page.locator('#family-permission').screenshot({path:`${folder}/${name}-family-on.png`,animations:'disabled'});
  await page.close();
 }
 await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
