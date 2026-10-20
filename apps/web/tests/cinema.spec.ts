import {test,expect,type Page} from '@playwright/test';
import {RANGES,beatProgress,resolveNarrative} from '../components/cinema/narrative';
import {createHash} from 'node:crypto';
import {GpuTimer} from '../components/cinema/gpu-timer';
async function go(page:Page,index:number,local=.60){const p=beatProgress(index,local);await page.evaluate(progress=>{const r=document.querySelector<HTMLElement>('.film-root')!;const prelude=r.querySelector<HTMLElement>('.film-prelude');const lead=prelude?.offsetHeight||0;const top=r.getBoundingClientRect().top+scrollY+lead;const distance=Math.max(1,r.offsetHeight-lead-innerHeight);window.scrollTo(0,top+distance*progress);},p);await expect(page.locator('.film-root')).toHaveAttribute('data-current-act',RANGES[index].id);await expect.poll(async()=>Number(await page.locator('canvas').getAttribute('data-progress'))).toBeCloseTo(p,3);}
async function start(page:Page){await page.goto('/');await expect(page.locator('.film-root')).toHaveAttribute('data-film-mode','film',{timeout:30000});}

test('central timeline is deterministic and camera positions are continuous at all boundaries',()=>{
 for(const a of RANGES){const p=beatProgress(a.index,.62);expect(resolveNarrative(p)).toEqual(resolveNarrative(p));if(a.index){const before=resolveNarrative(a.start-1e-7),after=resolveNarrative(a.start+1e-7);expect(Math.hypot(...before.camera.map((x,i)=>x-after.camera[i]))).toBeLessThan(.001);}}
});
test('one persistent real WebGL canvas covers all sixteen forward and reverse beats',async({page})=>{
 test.setTimeout(60000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await start(page);const canvas=page.locator('canvas');
 await canvas.evaluate(e=>(e as HTMLCanvasElement).dataset.instance='original');
 for(const index of[...RANGES.map(a=>a.index),...RANGES.map(a=>a.index).reverse()]){await go(page,index);await expect(canvas).toHaveAttribute('data-instance','original');}
 expect(await canvas.evaluate(c=>!!(c as HTMLCanvasElement).getContext('webgl2'))).toBe(true);expect(errors).toEqual([]);
 await expect(page.locator('.film-debug')).toHaveCount(0);
});
test('stopping scroll stops rendering; reversing restores the exact rendered composition',async({page})=>{
 await start(page);await go(page,8,.64);await page.waitForTimeout(250);const canvas=page.locator('canvas');const count=await canvas.getAttribute('data-render-count');const first=await canvas.screenshot();
 await page.waitForTimeout(500);expect(await canvas.getAttribute('data-render-count')).toBe(count);
 await go(page,12,.8);await go(page,8,.64);await page.waitForTimeout(100);const reversed=await canvas.screenshot();
 expect(createHash('sha256').update(reversed).digest('hex')).toBe(createHash('sha256').update(first).digest('hex'));
});
test('rapid skips, resizing and quality replacement retain complete state without stale canvases',async({page})=>{
 await start(page);for(const index of[15,2,11,5,13,0])await go(page,index,.7);
 await page.setViewportSize({width:390,height:844});await go(page,15,.7);await expect(page.locator('.film-finale-actions>small')).toBeInViewport();await go(page,11,.8);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.setViewportSize({width:1440,height:1000});await go(page,11,.8);await page.locator('canvas').evaluate(e=>e.dataset.qualityInstance='persistent');await page.locator('.film-settings summary').click();for(const quality of['high','medium','low']){await page.getByLabel('Visual quality',{exact:true}).selectOption(quality);await expect(page.locator('.film-root')).toHaveAttribute('data-quality',quality);await expect(page.locator('.film-root')).toHaveAttribute('data-current-act','population');await expect(page.locator('canvas')).toHaveAttribute('data-quality-instance','persistent');}await expect(page.locator('.film-root')).toHaveAttribute('data-film-mode','film');await expect(page.locator('.film-root')).toHaveAttribute('data-quality','low');await expect(page.locator('canvas')).toHaveCount(1);
});
test('native scene menu, opt-in consent and finale links are keyboard usable',async({page})=>{
 await start(page);await page.locator('.film-settings summary').click();await page.getByLabel('Jump to scene',{exact:true}).selectOption('6');await expect(page.locator('.film-root')).toHaveAttribute('data-current-act','doctor-consent');
 await page.locator('.film-demo summary').click();const reports=page.getByRole('checkbox',{name:'Laboratory reports',exact:false});await expect(reports).toBeEnabled();await reports.focus();await page.keyboard.press('Space');await page.getByRole('button',{name:'Allow selected records'}).click();await expect(page.locator('.film-overlay .allowed-records li')).toHaveCount(1);
 await go(page,15,.7);await expect(page.locator('.film-finale-actions a')).toHaveCount(2);await expect(page.locator('.film-finale-actions')).toContainText('not an official Government of India service');
 await page.getByRole('link',{name:'Explore the Architecture',exact:true}).focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/architecture$/);
});
test('WebGL denial has complete readable fallback, not a blank page',async({browser})=>{
 const context=await browser.newContext();await context.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){if(type.startsWith('webgl'))return null;return original.apply(this,[type,...args] as never); } as typeof original;});const page=await context.newPage();await page.goto('/');await expect(page.locator('.film-root')).toHaveAttribute('data-film-mode','reading');await expect(page.locator('#static-story [data-act]')).toHaveCount(14);await expect(page.locator('#static-story #finale')).toContainText('Right Person');await context.close();
});
test('real context loss disposes the film and exposes all semantic information',async({page})=>{
 await start(page);await page.locator('canvas').evaluate(e=>(e as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());await expect(page.locator('.film-root')).toHaveAttribute('data-film-mode','reading');await expect(page.locator('.film-fallback-notice')).toContainText('interrupted');await expect(page.locator('#static-story #doctor-consent')).toBeVisible();
});
test('reduced motion initially and live preference changes select the complete static presentation',async({browser,page})=>{
 const context=await browser.newContext({reducedMotion:'reduce'});const reduced=await context.newPage();await reduced.goto('/');await expect(reduced.locator('.film-root')).toHaveAttribute('data-film-mode','reading');await expect(reduced.locator('#static-story [data-act]')).toHaveCount(14);await context.close();
 await start(page);await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.film-root')).toHaveAttribute('data-film-mode','reading');
});
test('JavaScript-off first response contains the full story and disclosure',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});const page=await context.newPage();await page.goto('/');await expect(page.locator('#static-story [data-act]')).toHaveCount(14);await expect(page.locator('.film-fallback')).toContainText('announced government partnership');await expect(page.locator('#static-story #finale a')).toHaveCount(2);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});
test('reading mode and a fresh 3D retry release the old context and remain local',async({page})=>{
 await start(page);const writes:string[]=[];page.on('request',r=>{if(r.method()!=='GET')writes.push(r.url());});await page.getByRole('button',{name:'Reading mode',exact:true}).click();await expect(page.locator('.film-root')).toHaveAttribute('data-film-mode','reading');await page.getByRole('button',{name:'Try real-time 3D'}).click();await expect(page.locator('.film-root')).toHaveAttribute('data-film-mode','film');expect(writes).toEqual([]);expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
});
test('legacy deep links and a mid-story refresh resolve the requested cinematic beat',async({page})=>{
 await page.goto('/#doctor-consent');await expect(page.locator('.film-root')).toHaveAttribute('data-film-mode','film');await expect(page.locator('.film-root')).toHaveAttribute('data-current-act','doctor-consent');await page.reload();await expect(page.locator('.film-root')).toHaveAttribute('data-current-act','doctor-consent');
 await page.evaluate(()=>{history.replaceState(null,'',location.pathname);});await go(page,12,.64);await page.reload();await expect(page.locator('.film-root')).toHaveAttribute('data-current-act','aggregation');
});
test('GPU geometry buffers are released when reading mode replaces the renderer',async({page})=>{
 await page.addInitScript(()=>{const buffers=new Set<WebGLBuffer>();Object.defineProperty(window,'__liveGeometryBuffers',{get:()=>buffers.size});const create=WebGL2RenderingContext.prototype.createBuffer,remove=WebGL2RenderingContext.prototype.deleteBuffer;WebGL2RenderingContext.prototype.createBuffer=function(){const b=create.call(this);if(b)buffers.add(b);return b;};WebGL2RenderingContext.prototype.deleteBuffer=function(b){if(b)buffers.delete(b);return remove.call(this,b);};});await start(page);await go(page,12);expect(await page.evaluate(()=>(window as Window&{__liveGeometryBuffers?:number}).__liveGeometryBuffers)).toBeGreaterThan(0);await page.getByRole('button',{name:'Reading mode',exact:true}).click();await expect.poll(()=>page.evaluate(()=>(window as Window&{__liveGeometryBuffers?:number}).__liveGeometryBuffers)).toBe(0);
});
test('forced colors keeps information readable instead of placing system text over the canvas',async({page})=>{
 await page.emulateMedia({forcedColors:'active'});await page.goto('/');await expect(page.locator('.film-root')).toHaveAttribute('data-film-mode','reading');await expect(page.locator('.film-fallback-notice')).toContainText('High contrast');await expect(page.getByRole('heading',{name:'Identity ≠ Permission.',exact:false})).toBeVisible();
});
test('missing character assets select complete reading mode instead of a broken or primitive scene',async({page})=>{
 await page.route('**/models/*.glb',route=>route.abort('failed'));await page.goto('/');await expect(page.locator('.film-root')).toHaveAttribute('data-film-mode','reading');await expect(page.locator('#static-story [data-act]')).toHaveCount(14);await expect(page.locator('.film-fallback')).toContainText('announced government partnership');
});
test('compact local care and locomotion models ship; no combat clips enter the runtime assets',async()=>{
 const fs=await import('node:fs'),path=await import('node:path');for(const sex of['male','female']){const bytes=fs.readFileSync(path.resolve(process.cwd(),`public/models/universal_${sex}.glb`));expect(bytes.byteLength).toBeLessThan(800000);const json=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());expect(json.animations.map((a:{name:string})=>a.name)).toEqual(['Crouch','Kneel','Idle','Talk','Sit','Walk']);expect(json.extensionsRequired).toContain('EXT_meshopt_compression');expect(json.images||[]).toHaveLength(0);}
});
test('GPU timers are bounded, asynchronous and dispose pending queries',async()=>{
 let next=0,begun=0,deleted=0,available=false,disjoint=false;const gl={QUERY_RESULT_AVAILABLE:1,QUERY_RESULT:2,getExtension:()=>({TIME_ELAPSED_EXT:3,GPU_DISJOINT_EXT:4}),isContextLost:()=>false,getParameter:()=>disjoint,createQuery:()=>({id:++next}),beginQuery:()=>begun++,endQuery:()=>{},deleteQuery:()=>deleted++,getQueryParameter:(_:unknown,param:number)=>param===1?available:2500000} as unknown as WebGL2RenderingContext;
 const timer=new GpuTimer(gl);for(let i=0;i<12;i++){timer.begin();timer.end();}expect(begun).toBe(4);expect(timer.lastMs).toBeNull();available=true;timer.begin();timer.end();expect(timer.lastMs).toBe(2.5);expect(timer.samples).toBe(4);disjoint=true;timer.begin();expect(timer.lastMs).toBeNull();timer.dispose();expect(deleted).toBe(next);
});
