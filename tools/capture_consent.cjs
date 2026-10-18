// With the app running: node tools/capture_consent.cjs
const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const baseURL=process.env.BASE_URL||'http://127.0.0.1:3000';
const folder='evidence/phase-4';
(async()=>{
 fs.mkdirSync(folder,{recursive:true});
 const browser=await chromium.launch();
 for(const[name,width,height]of[['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small',320,844]]){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto(baseURL+'/#ordinary-visit');await page.evaluate(()=>document.fonts.ready);
  await page.locator('#ordinary-visit').screenshot({path:`${folder}/${name}-reset.png`,animations:'disabled'});
  await page.getByRole('button',{name:'Deny request',exact:true}).waitFor();
  await page.locator('#doctor-consent').screenshot({path:`${folder}/${name}-request.png`,animations:'disabled'});
  await page.getByRole('checkbox',{name:'Laboratory reports'}).check();
  await page.getByRole('button',{name:'Allow selected records'}).click();
  await page.locator('.consent-demo').screenshot({path:`${folder}/${name}-allowed.png`,animations:'disabled'});
  await page.getByRole('button',{name:'Revoke illustration'}).click();
  await page.locator('.consent-demo').screenshot({path:`${folder}/${name}-revoked.png`,animations:'disabled'});
  await page.getByRole('button',{name:'Try the request again'}).click();
  await page.getByRole('button',{name:'Deny request',exact:true}).click();
  await page.locator('.consent-demo').screenshot({path:`${folder}/${name}-denied.png`,animations:'disabled'});
  await page.getByRole('button',{name:'Try the request again'}).click();
  await page.getByRole('checkbox',{name:'Previous prescriptions'}).check();
  await page.getByRole('button',{name:'Allow selected records'}).click();
  await page.getByRole('button',{name:'Illustrate expiry'}).click();
  await page.locator('.consent-demo').screenshot({path:`${folder}/${name}-expired.png`,animations:'disabled'});
  await page.close();
 }
 await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
