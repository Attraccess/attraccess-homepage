import {createRequire} from 'node:module';import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';import path from 'node:path';
import {open,shot,browser,manifest,write,fixture,OUT,ports,delay} from './capture.mjs';
const root=path.resolve(import.meta.dirname,'../..');const require=createRequire(root+'/software/package.json');const sqlite3=require('sqlite3');const sharp=require('sharp');
const selected=process.argv.includes('--only')?new Set(process.argv[process.argv.indexOf('--only')+1].split(',')):null;
const run=async(db,sql,params=[])=>new Promise((res,rej)=>db.run(sql,params,e=>e?rej(e):res()));
const englishManifest=JSON.parse(readFileSync(root+'/assets/captures/manifest.json'));const captureOrigin=Date.parse(englishManifest.sequences.find(s=>s.name==='seq-start').clock);const captureStart=Date.parse(englishManifest.shots.find(s=>s.file==='laser-start-active.png').clock);
let latestUsage;let lastPage;let flowPage;let cleanFlow;let savedFutureService;
async function freeze(p,time){await p.clock.install({time:new Date(time-1000)});await p.clock.pauseAt(new Date(time));p.__capture.time=time;}
async function frames(p,name,{component='[data-cy="active-session-card"]',action,triggerFrame=0}={}){
 await p.addStyleTag({content:'.animate-pulse {animation:none!important}'});
 mkdirSync(OUT+'/'+name,{recursive:true});mkdirSync(OUT+'/'+name+'-components',{recursive:true});
 const seq={name,page:p.__capture.route,theme:p.__capture.theme,viewport:p.__capture.viewport,fps:30,durationSeconds:4,frameCount:120,clock:new Date(p.__capture.time).toISOString(),frames:[],elements:[]};

 for(let i=0;i<120;i++){
  if(action&&i===triggerFrame)await action();
  if(i)await p.clock.runFor(Math.round(i*1000/30)-Math.round((i-1)*1000/30));
  const f=String(i).padStart(6,'0')+'.png';await p.screenshot({path:OUT+'/'+name+'/'+f,animations:'disabled'});
  const el=(name==='seq-start'&&await p.getByRole('dialog').isVisible())?p.getByRole('dialog'):p.locator(component).first();if(await el.isVisible()){const b=await el.boundingBox();await sharp(OUT+'/'+name+'/'+f).extract({left:Math.round(b.x*2),top:Math.round(b.y*2),width:Math.round(b.width*2),height:Math.round(b.height*2)}).png().toFile(OUT+'/'+name+'-components/'+f);if(!i)seq.elements.push({selector:component,bounds:await el.boundingBox()});}
  seq.frames.push({timerText:await p.locator('[data-cy="resource-usage-session"]').innerText().catch(()=>''),file:name+'/'+f,componentFile:name+'-components/'+f,frame:i,timeMs:Math.round(i*1000/30),componentBounds:await el.isVisible()?await el.boundingBox():null});
 }
 await p.clock.runFor(4000-Math.round(119*1000/30));manifest.sequences=manifest.sequences.filter(s=>s.name!==name);manifest.sequences.push(seq);write();console.log(name+' · 120 frames @30fps');
}
try{
 flowPage=await open('/resources/1/flows',{user:'film.operator',time:Date.now()});
 cleanFlow=await (await flowPage.request.get(ports.frontend.url+'/api/resources/1/flow')).json();
 const original=JSON.parse(readFileSync(new URL('./.runtime/round2-flow-before.json',import.meta.url)));
 const lifecycle={nodes:[...cleanFlow.nodes,...original.nodes.filter(n=>n.id.startsWith('nc-meter-2')&&!cleanFlow.nodes.some(c=>c.id===n.id))].map(n=>({id:n.id,type:n.type,data:n.data,position:n.position})),edges:[...cleanFlow.edges,...original.edges.filter(e=>e.source.startsWith('nc-meter-2')&&!cleanFlow.edges.some(c=>c.id===e.id))].map(e=>({id:e.id,source:e.source,target:e.target,sourceHandle:e.sourceHandle,targetHandle:e.targetHandle}))};
 const saved=await flowPage.request.put(ports.frontend.url+'/api/resources/1/flow',{data:lifecycle});if(!saved.ok())throw Error('Temporary runtime-meter flow failed');
 if(!selected||selected.has('seq-timer')){const p=await open('/resources/1');await freeze(p,fixture.now);await frames(p,'seq-timer');await p.context().close();}
 if(!selected||selected.has('seq-flow')){
  const p=await open('/resources/1/flows');await p.getByRole('button',{name:'Collapse',exact:true}).click();await p.locator('.react-flow__controls-fitview').click();await delay(500);
  const r=await p.request.post(ports.frontend.url+'/api/resources/1/flow/logs/recording',{data:{durationMinutes:15}});if(!r.ok())throw Error('Flow recording failed '+r.status());
  const response=await p.request.post(ports.frontend.url+'/api/resources/1/flow/buttons/nc-1-check/press');if(!response.ok())throw Error('Flow button failed '+response.status());await delay(500);
  await p.getByRole('button',{name:'Flow logs',exact:true}).click();await p.getByRole('dialog').waitFor();await delay(700);
  const expand=p.locator('[role="dialog"] button[aria-expanded="false"]').first();if(await expand.count())await expand.click();await delay(400);
  await freeze(p,Date.now());await frames(p,'seq-flow',{component:'[role="dialog"]'});await shot(p,'flow-live-run',{selectors:['[role="dialog"]','[role="dialog"] [data-slot="accordion-item"]']});
  await p.context().close();
 }
 if(!selected||selected.has('seq-start')){
  const p=await open('/resources/1',{time:Date.now()});lastPage=p;
  const active=await p.request.get(ports.frontend.url+'/api/resources/1/usage/active');
  const current=active.ok()?await active.json():{};
  const end=current.usage?await p.request.put(ports.frontend.url+'/api/resources/1/usage/end',{data:{notes:'Solarmodulhalterungen geschnitten und geprüft. Linsenbereich gereinigt; Absaugung geprüft.',formSubmissions:[]}}):null;if(end&&!end.ok())throw Error('End existing capture session failed '+end.status()+': '+await end.text());
  await p.reload({waitUntil:'domcontentloaded'});await delay(1300);
  await p.locator('[data-cy="projects-select"] button').click();await p.locator('[data-cy="select-item-1"]').click();
  await shot(p,'laser-start-ready',{selectors:['[data-cy="resource-usage-session"]','section']});
  await p.getByRole('button',{name:'Ressource verwenden'}).click();await p.getByRole('dialog').waitFor();
  await p.locator('[role="dialog"] button[aria-haspopup="listbox"]').first().click();await p.getByRole('option',{name:'Birkensperrholz',exact:true}).click();
  await p.locator('[role="dialog"] input[type="number"]').fill('3');await p.getByRole('switch',{name:'Bestätigen',exact:true}).press('Space');
  await p.clock.setFixedTime(new Date(captureOrigin));p.__capture.time=captureOrigin;await shot(p,'laser-start-form',{selectors:['[role="dialog"]','[role="dialog"] [class*="field"]','[role="dialog"] button','[role="dialog"] input']});
  const origin=captureOrigin;await freeze(p,origin);
  await frames(p,'seq-start',{component:'[data-cy="resource-usage-session"]',triggerFrame:10,action:async()=>{
   const wait=p.waitForResponse(r=>r.url().endsWith('/api/resources/1/usage/start')&&r.request().method()==='POST');
   await p.getByRole('button',{name:'Formulare senden',exact:true}).click();const response=await wait;if(!response.ok())throw Error('Start capture session failed '+response.status()+': '+await response.text());const usage=await response.json();latestUsage=usage.id;
   writeFileSync(new URL('./.runtime/seq-start-real-response.json',import.meta.url),JSON.stringify(usage,null,2),{mode:0o600});const captureDb=new sqlite3.Database(new URL('./.runtime/storage/attraccess.sqlite',import.meta.url).pathname);savedFutureService=await new Promise((res,rej)=>captureDb.get('SELECT * FROM resource_maintenance WHERE id=22',(e,r)=>e?rej(e):res(r)));await run(captureDb,"UPDATE resource_maintenance SET startTime='2026-10-18 15:01:07.029',endTime='2026-10-18 18:01:07.029',completedAt=NULL,completedByUserId=NULL WHERE id=22");const frozenStart=new Date(captureStart).toISOString().replace('T',' ').replace('Z','');await run(captureDb,'UPDATE resource_usage SET startTime=? WHERE id=?',[frozenStart,usage.id]);await run(captureDb,'UPDATE resource_operating_interval SET startTime=? WHERE resourceId=1 AND endTime IS NULL',[frozenStart]);await new Promise(r=>captureDb.close(r));const startTime=captureStart;await p.clock.setSystemTime(startTime);await p.reload({waitUntil:'domcontentloaded',timeout:120000});await p.addStyleTag({content:'[data-sonner-toaster],[data-sonner-toast],pwa-install,.Toastify,vite-error-overlay{display:none!important} *{caret-color:transparent!important;cursor:none!important;scrollbar-width:none!important} *::-webkit-scrollbar{display:none!important} .animate-pulse{animation:none!important}'});p.__capture.time=startTime;for(let n=0;n<800&&!await p.locator('[data-cy="active-session-card"]').isVisible();n++){await p.clock.runFor(100);await delay(50);}
   if(!await p.locator('[data-cy="active-session-card"]').isVisible())throw Error('Started session did not render after virtual-clock settling');await p.clock.runFor(11000);await delay(600);await p.clock.runFor(100);await p.clock.setSystemTime(startTime-1000);await p.clock.runFor(1000);
  }});
  await shot(p,'laser-start-active',{selectors:['[data-cy="active-session-card"]','[data-cy="resource-usage-session"]','section']});
  await p.context().close();
 }
}catch(e){if(lastPage){writeFileSync(path.join(import.meta.dirname,'.runtime/sequence-debug.txt'),await lastPage.locator('body').innerText());await lastPage.screenshot({path:path.join(import.meta.dirname,'.runtime/sequence-debug.png')});writeFileSync(path.join(import.meta.dirname,'.runtime/sequence-buttons.json'),JSON.stringify(await lastPage.locator('button').evaluateAll(es=>es.map(e=>({text:e.innerText,aria:e.getAttribute('aria-label'),role:e.getAttribute('role')}))),null,2));}manifest.gaps.push({sequenceError:e.message});write();throw e;}finally{
 if(latestUsage){const now=Date.now();const db=new sqlite3.Database(path.join(import.meta.dirname,'.runtime/storage/attraccess.sqlite'));await run(db,'UPDATE resource_usage SET startTime = ?, projectId = 1, startNotes = ? WHERE id = ?',[new Date(now-14*60000).toISOString().replace('T',' ').replace('Z',''),'Solarmodulhalterungen · 3 mm Birkensperrholz',latestUsage]);if(savedFutureService)await run(db,'UPDATE resource_maintenance SET startTime=?,endTime=?,completedAt=?,completedByUserId=? WHERE id=22',[savedFutureService.startTime,savedFutureService.endTime,savedFutureService.completedAt,savedFutureService.completedByUserId]);await run(db,'UPDATE resource_operating_interval SET startTime=? WHERE resourceId=1 AND endTime IS NULL',[new Date(now-10*60000).toISOString().replace('T',' ').replace('Z','')]);await new Promise(r=>db.close(r));const updated=JSON.parse(readFileSync(path.join(import.meta.dirname,'.runtime/fixture.json')));updated.now=now;writeFileSync(path.join(import.meta.dirname,'.runtime/fixture.json'),JSON.stringify(updated,null,2));}
 if(cleanFlow&&flowPage)await flowPage.request.put(ports.frontend.url+'/api/resources/1/flow',{data:{nodes:cleanFlow.nodes.map(n=>({id:n.id,type:n.type,data:n.data,position:n.position})),edges:cleanFlow.edges.map(e=>({id:e.id,source:e.source,target:e.target,sourceHandle:e.sourceHandle,targetHandle:e.targetHandle}))}});
 await browser.close();
}
