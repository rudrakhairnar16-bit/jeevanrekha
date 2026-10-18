// AXE_SCRIPT=/path/to/local/axe.min.js node tools/final_accessibility.cjs
const{chromium}=require('@playwright/test');const fs=require('node:fs');
(async()=>{
 if(!process.env.AXE_SCRIPT)throw Error('Provide local AXE_SCRIPT; axe is QA-only, never shipped.');
 const browser=await chromium.launch(),report=[];
 const scan=async(page,width,state)=>{const r=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));report.push({width,state,violations:r.violations,manualReview:r.incomplete});console.log(`${width}/${state}: ${r.violations.length} violations`);if(r.violations.length)process.exitCode=1};
 for(const width of[1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000}});await page.goto((process.env.BASE_URL||'http://127.0.0.1:3000'));await page.evaluate(()=>document.fonts.ready);await page.addScriptTag({path:process.env.AXE_SCRIPT});
  await scan(page,width,'opening');
  for(const id of['public-minimum','verified-help','family-alert']){await page.locator('#'+id).scrollIntoViewIfNeeded();await scan(page,width,id);}
  await page.getByRole('checkbox',{name:'Laboratory reports',exact:false}).check();await page.getByRole('button',{name:'Allow selected records'}).click();await scan(page,width,'consent-allowed');
  await page.getByRole('button',{name:'Revoke illustration',exact:true}).click();await scan(page,width,'consent-revoked');
  await page.getByRole('button',{name:'Try the request again',exact:true}).click();await page.getByRole('button',{name:'Deny request',exact:true}).click();await scan(page,width,'consent-denied');
  await page.getByRole('button',{name:'Illustrate exchange expiry'}).click();await scan(page,width,'exchange-expired');
  await page.getByRole('button',{name:'Trace linked information'}).click();await scan(page,width,'sealed-relations');
  await page.getByRole('switch',{name:'Medication reminder permission'}).click();await scan(page,width,'family-opt-in');
  for(const name of['Include emergency credential','Include protected service','Include authorized responder context'])await page.getByRole('checkbox',{name,exact:true}).check();await scan(page,width,'protection-conditions');
  await page.getByRole('button',{name:'Illustrate missing reports'}).click();await scan(page,width,'coverage-limited');
  await page.getByRole('button',{name:'Trace path B',exact:true}).click();await page.locator('.aggregation-limits summary').click();await scan(page,width,'aggregation-limits');
  await page.getByRole('button',{name:'Illustrate a historical edit'}).click();await scan(page,width,'evidence-mismatch');
  await page.getByRole('button',{name:'Remove witness reference'}).click();await scan(page,width,'evidence-unavailable');
  await page.getByRole('button',{name:'Phone unusable',exact:true}).click();await scan(page,width,'care-phone');
  await page.locator('#finale').scrollIntoViewIfNeeded();await scan(page,width,'finale');
  for(const route of['/architecture','/status','/walkthrough']){await page.goto((process.env.BASE_URL||'http://127.0.0.1:3000')+route);await page.addScriptTag({path:process.env.AXE_SCRIPT});await scan(page,width,route);}
  await page.close();
 }
 fs.mkdirSync('evidence/final',{recursive:true});fs.writeFileSync('evidence/final/accessibility-summary.json',JSON.stringify(report,null,2));await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
