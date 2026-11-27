import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(import.meta.dirname,'../..');
const require=createRequire(path.join(root,'../web/package.json'));
const {chromium}=require('playwright');
const ports=JSON.parse(readFileSync(path.join(root,'software/.dev-serve-ports.json')));
const fixture=JSON.parse(readFileSync(path.join(import.meta.dirname,'.runtime/fixture.json')));
const OUT=path.join(root,'assets/captures');mkdirSync(OUT,{recursive:true});
const only=process.argv.includes('--only')?new Set(process.argv[process.argv.indexOf('--only')+1].split(',')):null;
const manifest=existsSync(OUT+'/manifest.json')?JSON.parse(readFileSync(OUT+'/manifest.json')):{version:1,coordinateSystem:'CSS pixels relative to screenshot viewport',generatedAt:new Date().toISOString(),baseUrl:ports.frontend.url,shots:[],sequences:[],gaps:[]};
const DESKTOP={width:1600,height:1000,deviceScaleFactor:2};const MOBILE={width:390,height:844,deviceScaleFactor:3,isMobile:true,hasTouch:true};
const browser=await chromium.launch();const states=new Map();
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function auth(user){if(states.has(user))return states.get(user);const ctx=await browser.newContext();const response=await ctx.request.post(ports.frontend.url+'/api/auth/session/local',{data:{username:user,password:process.env.DEMO_PASSWORD??'Demo1234!',tokenLocation:'cookie'}});if(!response.ok())throw Error('Local demo login failed: '+response.status());const state=await ctx.storageState();states.set(user,state);await ctx.close();return state;}
async function open(route,{theme='dark',mobile=false,user='mia.chen@north-campus.example',time=fixture.now}={}){
 const v=mobile?MOBILE:DESKTOP;const ctx=await browser.newContext({viewport:{width:v.width,height:v.height},deviceScaleFactor:v.deviceScaleFactor,isMobile:!!v.isMobile,hasTouch:!!v.hasTouch,locale:'en-US',timezoneId:'Europe/Berlin',colorScheme:theme,reducedMotion:'reduce',storageState:await auth(user)});
 await ctx.route('**/*',route=>{const u=new URL(route.request().url());return ['http:','https:'].includes(u.protocol)&&!['localhost','127.0.0.1','[::1]'].includes(u.hostname)?route.abort():route.continue();});
 const p=await ctx.newPage();p.__capture={theme,viewport:v,user,route,time,errors:[]};p.on('pageerror',e=>p.__capture.errors.push(e.message));
 await p.addInitScript(theme=>{localStorage.setItem('heroui-theme',theme);localStorage.setItem('i18nextLng','en');localStorage.setItem('donationPrompt:snoozedUntil',String(Date.now()+1e11));},theme);
 await p.clock.setFixedTime(new Date(time));await p.goto(ports.frontend.url+route,{waitUntil:'domcontentloaded'});await p.waitForLoadState('networkidle',{timeout:2500}).catch(()=>{});await delay(1100);await settled(p);return p;
}
async function settled(p){await p.waitForFunction(()=>[...document.images].every(i=>i.complete),null,{timeout:15000});await p.addStyleTag({content:'[data-sonner-toaster],pwa-install,.Toastify,vite-error-overlay {display:none!important} *{caret-color:transparent!important;cursor:none!important;scrollbar-width:none!important} *::-webkit-scrollbar{display:none!important}'});await delay(200);}
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);
async function shot(p,name,{selectors=[],fullPage=false}={}){
 await settled(p);const vp=p.__capture.viewport;const data={file:name+'.png',page:p.__capture.route,url:p.url(),theme:p.__capture.theme,viewport:vp,clock:new Date(p.__capture.time).toISOString(),kind:'viewport',elements:[],errors:p.__capture.errors,brokenImages:await p.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).map(i=>i.getAttribute('src')))};
 let locators=[...selectors];if(!locators.length)locators=['main header','main section','main img','main button:has(.text-left)','[data-cy="active-session-card"]','[data-cy="other-user-session-card"]','.card','.card__header','.card__footer','.chip','.badge','article','table','tbody tr','[role="dialog"]','[role="region"][aria-label="Node catalog"]','.react-flow__node'];
 const seen=new Set();const crops=[];
 for(const selector of locators){const l=p.locator(selector);const count=await l.count();for(let i=0;i<Math.min(count,24);i++){const el=l.nth(i);if(!await el.isVisible())continue;const box=await el.boundingBox();if(!box||box.width<12||box.height<12)continue;const identity=JSON.stringify(Object.values(box).map(x=>Math.round(x)));if(seen.has(identity))continue;seen.add(identity);const label=await el.evaluate(e=>e.getAttribute('data-id')||e.getAttribute('data-cy')||e.getAttribute('aria-label')||e.querySelector('h1,h2,h3')?.textContent||e.textContent?.trim().slice(0,80)||e.tagName);const id=slug(label)||'component';const cropFile=`${name}__${String(crops.length+1).padStart(2,'0')}-${id}.png`;data.elements.push({label,file:cropFile,bounds:{x:box.x,y:box.y,width:box.width,height:box.height},visibleInShot:box.y>=0&&box.y+box.height<=vp.height&&box.x>=0&&box.x+box.width<=vp.width,selector,index:i});crops.push({el,file:cropFile});}}
 await p.mouse.move(0,0);await p.screenshot({path:path.join(OUT,data.file),fullPage,animations:'disabled'});
 for(const {el,file} of crops){try{await el.screenshot({path:path.join(OUT,file),omitBackground:true,animations:'disabled'});}catch(e){data.errors.push('Crop '+file+': '+e.message.slice(0,180));}}
 // Pan every node into the live canvas before cropping at native scale.
 if(!name.includes('catalog')&&!await p.getByRole('dialog').count()&&await p.locator('.react-flow__node').count()){
 const view=p.locator('.react-flow__viewport');const transform=await view.evaluate(e=>e.style.transform);const canvas=await p.locator('.react-flow').boundingBox();
 const clean=await p.addStyleTag({content:'.react-flow__panel,.react-flow__attribution {visibility:hidden!important}'});
 for(const el of await p.locator('.react-flow__node').all()){
  const id=await el.getAttribute('data-id');const f=`${name}__node-native-${slug(id)}.png`;
  await view.evaluate(e=>e.style.transform='translate(0px,0px) scale(1)');const raw=await el.boundingBox();
  const tx=canvas.x+canvas.width/2-(raw.x+raw.width/2),ty=canvas.y+canvas.height/2-(raw.y+raw.height/2);
  await view.evaluate((e,{tx,ty})=>e.style.transform=`translate(${tx}px,${ty}px) scale(1)`,{tx,ty});const box=await el.boundingBox();
  await p.screenshot({path:OUT+'/'+f,clip:{x:box.x-12,y:box.y-12,width:box.width+24,height:box.height+24},omitBackground:true,animations:'disabled'});
  data.elements.push({label:id,file:f,nativeScale:1,captureMode:'native-node-pan',paddingCssPx:12});
 }
 await clean.evaluate(e=>e.remove());await view.evaluate((e,t)=>e.style.transform=t,transform);
 }
 manifest.shots=manifest.shots.filter(s=>s.file!==data.file);manifest.shots.push(data);write();console.log(name+' ('+data.elements.length+' crops)');return data;
}
function write(){writeFileSync(OUT+'/manifest.json',JSON.stringify(manifest,null,2));}
const routes=[
 ['resources','/resources'],['laser-active','/resources/1'],['laser-active-person','/resources/1',{user:'priya.nair@north-campus.example'}],
 ['laser-people','/resources/1/people'],['history','/resources/1/history'],['billing','/billing'],['billing-admin','/billing/administration'],
 ['maintenance','/resources/1/maintenance'],['projects','/projects'],['projects-detail','/projects/1'],['projects-team','/projects/1/team',{user:'jordan.lee@north-campus.example'}],
 ['devices-attractap','/attractap/readers'],['devices-shelly','/shelly'],['devices-wago','/wago'],['devices-companion','/devices/companion'],['devices-mqtt','/devices/mqtt/servers'],
 ['plugins','/settings/plugins'],['sso','/settings/sso'],['audit','/settings/audit-log'],['door','/resources/11'],['messages','/messages'],
 ['mobile-active','/resources/1',{mobile:true}],['mobile-resources','/resources',{mobile:true}],['light-resources','/resources',{theme:'light'}],['light-laser-active','/resources/1',{theme:'light'}],
];
export {open,shot,browser,manifest,write,fixture,OUT,ports,delay};
if(process.argv[1]===fileURLToPath(import.meta.url)){
try{
 for(const [name,route,options] of routes){if(only&&!only.has(name))continue;const p=await open(route,options);if(name==='history'){await p.locator('[data-cy="show-all-users-toggle"]').click();await delay(600);}
 if(name==='maintenance'){await p.getByRole('button',{name:/Lens & mirror cleaning/}).click();await delay(300);}
 if(name==='billing-admin'){await p.getByRole('button',{name:'Choose user'}).click();await p.getByRole('textbox').fill('Mia');await delay(600);await p.getByRole('option',{name:/Mia Chen/}).click();await delay(700);}
 if(name==='billing')await p.getByText('Summary',{exact:true}).evaluate(e=>e.scrollIntoView({block:'start'}));await shot(p,name);
 if(name==='laser-people'){await p.locator('[data-cy="people-row-history-1"]').click();await delay(500);await shot(p,'laser-introduction-history',{selectors:['[role="dialog"]','[role="dialog"] tbody tr']});}
 if(name==='history'){await p.locator('tbody tr').nth(1).click();await delay(500);await shot(p,'history-notes',{selectors:['[role="dialog"]','[role="dialog"] section','[role="dialog"] .card']});
 if(await p.getByRole('button',{name:'Open billing overview',exact:true}).count()){await p.getByRole('button',{name:'Open billing overview',exact:true}).click();await delay(600);await shot(p,'billing-detail',{selectors:['[role="dialog"]','[role="dialog"] tbody tr']});}}
 if(name==='resources'){await p.getByText('Electronics lab',{exact:true}).scrollIntoViewIfNeeded();await shot(p,'resources-labs');}if(name==='laser-active'){const section=p.locator('section').filter({has:p.getByRole('heading',{name:/^Meters$/i})});await section.scrollIntoViewIfNeeded();await shot(p,'meters',{selectors:['section']});}await p.context().close();}
 if(!only||only.has('flow')){const p=await open('/resources/1/flows');await p.getByRole('button',{name:'Collapse',exact:true}).click();await p.locator('.react-flow__controls-fitview').click();await delay(400);await shot(p,'flow-collapsed',{selectors:['.react-flow','.react-flow__node']});await p.getByRole('button',{name:'Expand',exact:true}).click();await p.locator('.react-flow__controls-fitview').click();await delay(400);await shot(p,'flow-expanded',{selectors:['[role="region"][aria-label="Node catalog"]','.react-flow','.react-flow__node']});await shot(p,'flow-catalog',{selectors:['[role="region"][aria-label="Node catalog"]']});
 const aside=p.getByRole('region',{name:'Node catalog'});while(await aside.locator('button[aria-expanded="true"]').count())await aside.locator('button[aria-expanded="true"]').first().click();await shot(p,'flow-catalog-domains',{selectors:['[role="region"][aria-label="Node catalog"]']});await p.context().close();}
}catch(e){manifest.gaps.push({error:e.message,at:new Date().toISOString()});write();throw e;}finally{await browser.close();}
}
