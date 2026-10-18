// AXE_SCRIPT=/path/to/local/axe.min.js node tools/check_signals_accessibility.cjs
const{chromium}=require('@playwright/test');const fs=require('node:fs');
(async()=>{
 if(!process.env.AXE_SCRIPT)throw Error('Set AXE_SCRIPT to a local axe-core bundle.');
 const browser=await chromium.launch(),report=[];
 for(const width of[1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000}});await page.goto((process.env.BASE_URL||'http://127.0.0.1:3000')+'/#emergency-locker');await page.evaluate(()=>document.fonts.ready);await page.addScriptTag({path:process.env.AXE_SCRIPT});
  for(const state of['initial','protection-complete','limited-coverage','path-a','path-b-limits']){
   if(state==='protection-complete')for(const name of['Include emergency credential','Include protected service','Include authorized responder context'])await page.getByRole('checkbox',{name,exact:true}).check();
   if(state==='limited-coverage')await page.getByRole('button',{name:'Illustrate missing reports'}).click();
   if(state==='path-a')await page.getByRole('button',{name:'Trace path A',exact:true}).click();
   if(state==='path-b-limits'){await page.getByRole('button',{name:'Trace path B',exact:true}).click();await page.locator('.aggregation-limits summary').click();}
   const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
   report.push({width,state,violations:result.violations,manualReview:result.incomplete});console.log(`${width}/${state}: ${result.violations.length} reported violations; ${result.incomplete.length} manual-review categories`);if(result.violations.length)process.exitCode=1;
  }
  await page.close();
 }
 fs.mkdirSync('evidence/phase-6',{recursive:true});fs.writeFileSync('evidence/phase-6/accessibility-summary.json',JSON.stringify(report,null,2));await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
