// Supplemental computed-color bounds for axe's complex-paint manual-review items.
// This is NOT a pixel audit, reading-size certification or screen-reader test.
const{chromium}=require('@playwright/test');const fs=require('node:fs');
const luminance=rgb=>rgb.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>{a=luminance(a);b=luminance(b);return(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto(process.env.BASE_URL||'http://127.0.0.1:3000');await page.evaluate(()=>document.fonts.ready);
 const groups=[
  ['credential printing','.health-card span,.health-card small,.health-card strong',[[43,77,72],[30,57,55]],'Both specified gradient stops; brighter stop bounds the linear RGB interpolation. Tiny printing is a fictional visual prop, not actionable body copy.'],
  ['notification shell','.notification-clock,.notification-stage>small',[[36,59,59],[16,38,45]],'Both shell gradient stops.'],
  ['notification contents','.notification-card span,.notification-card small,.notification-card h3,.notification-card p',[[226,232,220]],'Opaque notification-card paint.'],
  ['stage headings','.scene-coordinate,.stage-heading>span,.stage-heading>strong',[[11,29,37]],'Dark emergency canvas; visual stage checks supplement overlap warnings.'],
  ['provider labels','.network-lines text',[[232,234,222]],'Known solid network-scene paint; no clinical data.'],
  ['population labels','.district-signal span,.district-signal strong,.district-signal small,.district-signal h3,.district-signal p,.field-note',[[16,40,42],[41,75,68]],'Canvas and conservative brighter bar/grid composite (covers 0.11 bar opacity plus 0.2 grid opacity).'],
 ];
 const rows=[];
 for(const[group,selector,backgrounds,method]of groups){const nodes=await page.locator(selector).evaluateAll(es=>es.filter(e=>/[A-Za-z0-9]/.test(e.textContent)).map(e=>({text:e.textContent.trim().slice(0,100),foreground:getComputedStyle(e).color,fontSize:getComputedStyle(e).fontSize})));for(const node of nodes){const rgb=node.foreground.match(/[\d.]+/g).slice(0,3).map(Number);rows.push({group,...node,backgrounds,minimumRatio:+Math.min(...backgrounds.map(bg=>ratio(rgb,bg))).toFixed(2),method});}}
 const report={method:'Computed sRGB contrast against documented bounding surfaces; 4.5:1 used conservatively even for large text. Decorative non-text glyph warnings are redundant with adjacent readable state labels. Not certification.',minimumRatio:Math.min(...rows.map(r=>r.minimumRatio)),rows};
 fs.mkdirSync('evidence/final',{recursive:true});fs.writeFileSync('evidence/final/contrast-review.json',JSON.stringify(report,null,2));console.log('Computed surface-bound minimum:',report.minimumRatio);if(report.minimumRatio<4.5)process.exitCode=1;await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1});
