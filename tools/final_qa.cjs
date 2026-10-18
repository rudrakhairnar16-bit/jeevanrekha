// App must be running. Writes real observations, not a certification.
const{chromium,firefox,webkit}=require('@playwright/test');const fs=require('node:fs');
const folder='evidence/final',base=process.env.BASE_URL||'http://127.0.0.1:3000';
(async()=>{
 fs.mkdirSync(folder,{recursive:true});const report={created:new Date().toISOString(),layout:[],routes:[],screenshots:[],performance:[],failures:[]};
 for(const[name,engine]of Object.entries({chromium,firefox,webkit})){
  const browser=await engine.launch();
  for(const[width,height]of[[320,900],[390,844],[700,900],[701,900],[768,1024],[844,390],[1024,768],[1050,900],[1051,900],[1440,1000],[1920,1080]]){
   const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.evaluate(()=>document.fonts.ready);
   // Visit every chapter: sticky layouts and scroll-driven endpoints must remain bounded.
   for(const section of await page.locator('[data-act],#finale').all())await section.scrollIntoViewIfNeeded();
   const metrics=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,acts:document.querySelectorAll('[data-act]').length,finaleLinks:document.querySelectorAll('#finale a').length}));
   report.layout.push({engine:name,width,height,...metrics,errors});if(metrics.documentWidth>width||errors.length||metrics.acts!==14||metrics.finaleLinks!==2)report.failures.push({engine:name,width,height,metrics,errors});await page.close();
  }
  for(const route of['/','/architecture','/walkthrough','/status']){
   const page=await browser.newPage({viewport:{width:1280,height:1000}});const errors=[],badResponses=[],external=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)badResponses.push({url:r.url(),status:r.status()});});page.on('request',r=>{if(new URL(r.url()).origin!==new URL(base).origin)external.push(r.url());});
   const response=await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);await page.setViewportSize({width:640,height:1000});
   const zoom=await page.evaluate(()=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,horizontalOverflow:document.documentElement.scrollWidth>innerWidth,method:'640 CSS-pixel viewport: layout equivalent of 200% zoom on a 1280px window; not browser-UI zoom',mainCount:document.querySelectorAll('main').length,h1Count:document.querySelectorAll('h1').length,language:document.documentElement.lang,title:document.title}));
   report.routes.push({engine:name,route,status:response.status(),reflow200Equivalent:zoom,errors,badResponses,external});if(zoom.horizontalOverflow||errors.length||badResponses.length||external.length||zoom.mainCount!==1||zoom.h1Count!==1)report.failures.push({engine:name,route,zoom,errors,badResponses,external});
   if(route==='/')await page.screenshot({path:`${folder}/${name}-reflow-200-equivalent.png`,fullPage:false});await page.close();
  }
  // Final scene evidence: all scenes at desktop/mobile in Chromium, selected cross-engine checks.
  for(const[viewport,label]of[[{width:1440,height:1000},'desktop'],[{width:390,height:844},'mobile']]){
   const page=await browser.newPage({viewport});await page.goto(base);await page.evaluate(()=>document.fonts.ready);
   const selectors=name==='chromium'?await page.locator('[data-act],#finale').evaluateAll(nodes=>nodes.map(n=>n.id?'#'+n.id:'.cinema-hero')):(label==='desktop'?['.cinema-hero']:['#doctor-consent','#finale']);
   for(const selector of selectors){const path=`${folder}/${name}-${label}-${selector.replace(/[.#]/g,'')}.png`;await page.locator(selector).screenshot({path,animations:'disabled'});report.screenshots.push(path);}await page.close();
  }
  await browser.close();
 }
 // Local synthetic navigation observations with explicit CPU slowdown; not a Lighthouse or field result.
 const browser=await chromium.launch();
 for(const[scenario,viewport,slowdown]of[['desktop',{width:1440,height:1000},1],['mobile-cpu4x',{width:390,height:844},4]]){
  const context=await browser.newContext({viewport});const page=await context.newPage();const session=await context.newCDPSession(page);await session.send('Emulation.setCPUThrottlingRate',{rate:slowdown});
  await page.addInitScript(()=>{window.__qa={lcp:null,cls:0,longTasks:0,longTaskMs:0};new PerformanceObserver(l=>{for(const e of l.getEntries())window.__qa.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__qa.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__qa.longTasks++;window.__qa.longTaskMs+=e.duration}}).observe({type:'longtask',buffered:true});});
  await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1500);
  report.performance.push({scenario,cpuSlowdown:slowdown,network:'local production server; no network throttle',...await page.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0],resources=performance.getEntriesByType('resource');return{...window.__qa,ttfbMs:n.responseStart-n.requestStart,domContentLoadedMs:n.domContentLoadedEventEnd,loadMs:n.loadEventEnd,transferBytes:n.transferSize+resources.reduce((s,r)=>s+r.transferSize,0),resourceCount:resources.length,scriptBytes:resources.filter(r=>r.initiatorType==='script').reduce((s,r)=>s+r.encodedBodySize,0)}})});await context.close();
 }
 await browser.close();fs.writeFileSync(`${folder}/qa-summary.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({layouts:report.layout.length,routes:report.routes.length,screenshots:report.screenshots.length,performance:report.performance,failures:report.failures},null,2));if(report.failures.length)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1});
