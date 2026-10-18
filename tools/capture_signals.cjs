// With app running: node tools/capture_signals.cjs
const{chromium}=require('@playwright/test');const fs=require('node:fs');
(async()=>{
 const folder='evidence/phase-6';fs.mkdirSync(folder,{recursive:true});const browser=await chromium.launch();
 for(const[name,width,height]of[['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small',320,844]]){
  const page=await browser.newPage({viewport:{width,height}});await page.goto((process.env.BASE_URL||'http://127.0.0.1:3000')+'/#emergency-locker');await page.evaluate(()=>document.fonts.ready);
  const shot=async(id,state)=>page.locator('#'+id).screenshot({path:`${folder}/${name}-${state}.png`,animations:'disabled'});
  await shot('emergency-locker','protection-initial');
  for(const label of['Include emergency credential','Include protected service'])await page.getByRole('checkbox',{name:label,exact:true}).check();
  await shot('emergency-locker','protection-two-components');await page.getByRole('checkbox',{name:'Include authorized responder context',exact:true}).check();await shot('emergency-locker','protection-complete-example');
  await shot('population','population-baseline');await page.getByRole('button',{name:'Illustrate missing reports'}).click();await shot('population','population-limited');
  await shot('aggregation','aggregation-both');await page.getByRole('button',{name:'Trace path A',exact:true}).click();await shot('aggregation','aggregation-path-a');
  await page.getByRole('button',{name:'Trace path B',exact:true}).click();await page.locator('.aggregation-limits summary').click();await shot('aggregation','aggregation-path-b-limits');
  await page.close();
 }
 await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
