import {open,shot,browser,manifest,write,fixture,OUT,ports,delay} from './capture.mjs';
import fs from 'node:fs';
const now=Date.now();
try{
 const p=await open('/resources/1',{time:now});await p.getByRole('button',{name:'End Session',exact:true}).waitFor();await delay(900);
 await p.clock.install({time:new Date(now-1000)});await p.clock.pauseAt(new Date(now));p.__capture.time=now;
 await p.addStyleTag({content:'.animate-pulse{animation:none!important}'});
 const name='seq-end';fs.mkdirSync(OUT+'/'+name,{recursive:true});fs.mkdirSync(OUT+'/'+name+'-components',{recursive:true});
 const seq={name,page:p.__capture.route,theme:'dark',viewport:p.__capture.viewport,fps:30,durationSeconds:3,frameCount:90,clock:new Date(now).toISOString(),frames:[],elements:[],action:{frame:15,label:'End Session',method:'PUT',endpoint:'/api/resources/1/usage/end'}};
 let responsePromise;let response;
 for(let i=0;i<90;i++){
  if(i===15){responsePromise=p.waitForResponse(r=>r.url().endsWith('/api/resources/1/usage/end')&&r.request().method()==='PUT');await p.getByRole('button',{name:'End Session',exact:true}).click();responsePromise.then(r=>response=r);}
  if(i)await p.clock.runFor(Math.round(i*1000/30)-Math.round((i-1)*1000/30));
  const f=String(i).padStart(6,'0')+'.png';const el=p.locator('[data-cy="resource-usage-session"]');const box=await el.boundingBox();
  await p.screenshot({path:OUT+'/'+name+'/'+f,animations:'disabled'});await el.screenshot({path:OUT+'/'+name+'-components/'+f,omitBackground:true,animations:'disabled'});
  seq.frames.push({file:name+'/'+f,componentFile:name+'-components/'+f,frame:i,timeMs:Math.round(i*1000/30),componentBounds:box});if(!i)seq.elements.push({selector:'[data-cy="resource-usage-session"]',bounds:box});
 }
 const ended=await responsePromise;if(!ended.ok())throw Error('End Session failed '+ended.status()+': '+await ended.text());seq.action.status=ended.status();
 await p.clock.runFor(400);await delay(1000);await p.getByRole('button',{name:/^Start Using Resource$/i}).waitFor();
 seq.finalState='No active session; Start Using Resource visible';manifest.sequences.push(seq);write();
 await shot(p,'end2-resource',{selectors:['[data-cy="resource-usage-session"]','section','section tbody tr']});
 console.log('seq-end: 90 frames @30 fps; real End Session succeeded');
 const evidence=await p.request.get(ports.frontend.url+'/api/resources/1/usage/active');fs.writeFileSync(new URL('./.runtime/round2-end-evidence.json',import.meta.url),JSON.stringify({at:new Date().toISOString(),response:await evidence.json()},null,2));
}catch(e){console.error(e);process.exitCode=1;}finally{await browser.close()}
