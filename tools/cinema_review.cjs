const {chromium}=require('@playwright/test'),fs=require('fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpile(fs.readFileSync(f,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}),f);
const{RANGES,beatProgress}=require('../apps/web/components/cinema/narrative.ts');
(async()=>{
 const browser=await chromium.launch({args:['--enable-unsafe-swiftshader']});
 const results={environment:'Headless Chromium, software WebGL (SwiftShader), not physical GPU/device validation',errors:[],external:[],startup:[],scans:[],views:[]};
 const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
 async function scan(page,width,act){const r=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return{violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>v.id)};});results.scans.push({width,act,...r});}
 for(const width of[1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:width===1440?1000:844}});
  page.on('pageerror',e=>results.errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:3000/'))results.external.push(r.url());});
  await page.goto('http://127.0.0.1:3000');await page.waitForFunction(()=>document.querySelector('.film-root')?.dataset.filmMode==='film');
  results.startup.push({width,...await page.evaluate(()=>({observedReadyMs:performance.now(),encodedResourceBytes:performance.getEntriesByType('resource').reduce((s,r)=>s+(r.encodedBodySize||0),0)}))});
  await page.addScriptTag({content:axe});
  for(const range of RANGES){
   const progress=beatProgress(range.index,.64);
   await page.evaluate(p=>{const root=document.querySelector('.film-root');scrollTo(0,root.getBoundingClientRect().top+scrollY+(root.offsetHeight-innerHeight)*p);},progress);
   await page.waitForFunction(id=>document.querySelector('.film-root')?.dataset.currentAct===id,range.id);await page.waitForTimeout(50);
   await page.screenshot({path:`evidence/cinema/${width}-${String(range.index+1).padStart(2,'0')}-${range.id}.png`});
   const metrics=await page.evaluate(()=>{const overlay=document.querySelector('.film-overlay'),canvas=document.querySelector('canvas');return{overflow:document.documentElement.scrollWidth>innerWidth,overlayScroll:overlay.scrollHeight>overlay.clientHeight,quality:document.querySelector('.film-root').dataset.quality,renderMetrics:JSON.parse(canvas.dataset.renderMetrics||'null'),canvas:[canvas.width,canvas.height]};});
   results.views.push({width,act:range.id,...metrics});await scan(page,width,range.id);
   if([1440,320].includes(width)&&await page.locator('.film-demo').count()){
    await page.locator('.film-demo>summary').click();await scan(page,width,range.id+'-demo-open');await page.screenshot({path:`evidence/cinema/${width}-${range.id}-demo-open.png`});
    if(range.id==='doctor-consent'){
     await page.getByRole('checkbox',{name:'Laboratory reports',exact:false}).check();await page.getByRole('button',{name:'Allow selected records'}).click();await scan(page,width,'consent-allowed');
     await page.getByRole('button',{name:'Try the request again'}).click();await page.getByRole('button',{name:'Deny request',exact:true}).click();await scan(page,width,'consent-denied');
    }
    if(range.id==='family-permission'){await page.getByRole('switch',{name:'Medication reminder permission'}).click();await scan(page,width,'family-reminders-on');}
   }
  }
  await page.close();
 }
 await browser.close();fs.writeFileSync('evidence/cinema/review.json',JSON.stringify(results,null,2));
 const summary={views:results.views.length,axeScans:results.scans.length,axeViolations:results.scans.filter(s=>s.violations.length),overflows:results.views.filter(v=>v.overflow),errors:results.errors,external:results.external};
 if(summary.axeViolations.length||summary.overflows.length||summary.errors.length||summary.external.length)process.exitCode=1;
 console.log(JSON.stringify(summary,null,2));
})();
