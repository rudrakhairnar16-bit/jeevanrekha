// App must be running. Supply a local axe-core bundle: AXE_SCRIPT=/path/axe.min.js node tools/check_privacy_accessibility.cjs
const{chromium}=require('@playwright/test');const fs=require('node:fs');
(async()=>{
 if(!process.env.AXE_SCRIPT)throw Error('Set AXE_SCRIPT to a local axe-core bundle.');
 const browser=await chromium.launch(),report=[];
 for(const width of[1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000}});
  await page.goto((process.env.BASE_URL||'http://127.0.0.1:3000')+'/#distributed-records');await page.evaluate(()=>document.fonts.ready);
  await page.addScriptTag({path:process.env.AXE_SCRIPT});
  for(const state of['initial','expired','sealed-linked','family-on']){
   if(state==='expired')await page.getByRole('button',{name:'Illustrate exchange expiry'}).click();
   if(state==='sealed-linked')await page.getByRole('button',{name:'Trace linked information'}).click();
   if(state==='family-on')await page.getByRole('switch',{name:'Medication reminder permission'}).click();
   const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
   report.push({width,state,violations:result.violations,manualReview:result.incomplete});
   console.log(`${width}/${state}: ${result.violations.length} reported violations; ${result.incomplete.length} manual-review categories`);
   if(result.violations.length)process.exitCode=1;
  }
  await page.close();
 }
 fs.mkdirSync('evidence/phase-5',{recursive:true});fs.writeFileSync('evidence/phase-5/accessibility-summary.json',JSON.stringify(report,null,2));await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
