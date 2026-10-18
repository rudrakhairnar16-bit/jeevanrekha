// With app running: node tools/capture_closing.cjs
const{chromium}=require('@playwright/test');const fs=require('node:fs');
(async()=>{
 const folder='evidence/phase-7';fs.mkdirSync(folder,{recursive:true});const browser=await chromium.launch();
 for(const[name,width,height]of[['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small',320,844]]){
  const page=await browser.newPage({viewport:{width,height}});await page.goto((process.env.BASE_URL||'http://127.0.0.1:3000')+'/#transparency');await page.evaluate(()=>document.fonts.ready);
  const shot=async(id,state)=>page.locator('#'+id).screenshot({path:`${folder}/${name}-${state}.png`,animations:'disabled'});
  await shot('transparency','evidence-aligned');await page.getByRole('button',{name:'Illustrate a historical edit',exact:true}).click();await shot('transparency','evidence-edited');
  await page.getByRole('button',{name:'Remove witness reference',exact:true}).click();await shot('transparency','evidence-edited-unavailable');
  await page.getByRole('button',{name:'Restore original example',exact:true}).click();await shot('transparency','evidence-original-unavailable');
  await shot('care-continues','care-internet');await page.getByRole('button',{name:'Service unavailable',exact:true}).click();await shot('care-continues','care-service');
  await page.getByRole('button',{name:'Phone unusable',exact:true}).click();await shot('care-continues','care-phone');await shot('finale','finale');await page.close();
 }
 await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
