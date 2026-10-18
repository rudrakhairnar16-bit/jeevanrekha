// Test-only injection; never shipped to or loaded by the landing page.
// AXE_SCRIPT=/path/to/axe.min.js node tools/check_consent_accessibility.cjs
const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const source=process.env.AXE_SCRIPT;
if(!source||!fs.existsSync(source))throw Error('Set AXE_SCRIPT to a local axe-core browser bundle.');
(async()=>{
 const browser=await chromium.launch();const report=[];
 for(const width of[1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000}});
  await page.goto((process.env.BASE_URL||'http://127.0.0.1:3000')+'/#doctor-consent');
  await page.addScriptTag({path:source});
  for(const state of['request','allowed','revoked','denied','expired']){
   if(state==='allowed'||state==='expired'){
    if(state==='expired')await page.getByRole('button',{name:'Try the request again'}).click();
    await page.getByRole('checkbox',{name:'Laboratory reports'}).check();
    await page.getByRole('button',{name:'Allow selected records'}).click();
    if(state==='expired')await page.getByRole('button',{name:'Illustrate expiry'}).click();
   }
   if(state==='revoked')await page.getByRole('button',{name:'Revoke illustration'}).click();
   if(state==='denied'){
    await page.getByRole('button',{name:'Try the request again'}).click();
    await page.getByRole('button',{name:'Deny request',exact:true}).click();
   }
   const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
   report.push({width,state,engine:result.testEngine,violations:result.violations.map(rule=>({id:rule.id,nodes:rule.nodes.map(node=>({target:node.target,message:node.failureSummary}))})),manualReview:result.incomplete.map(rule=>rule.id)});
   if(result.violations.length)process.exitCode=1;
  }
  await page.close();
 }
 await browser.close();fs.mkdirSync('evidence/phase-4',{recursive:true});
 fs.writeFileSync('evidence/phase-4/accessibility-summary.json',JSON.stringify(report,null,2));
 console.log(report.map(row=>`${row.width}px ${row.state}: ${row.violations.length} reported violations`).join('\n'));
})().catch(error=>{console.error(error);process.exitCode=1});
