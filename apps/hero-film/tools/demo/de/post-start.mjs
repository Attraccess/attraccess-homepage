import {open,shot,browser,manifest,write,ports,delay} from './capture.mjs';import fs from 'node:fs';
try{
 const p=await open('/resources/1',{time:Date.now()});
 const cleanFlow=await (await p.request.get(ports.frontend.url+'/api/resources/1/flow')).json();const original=JSON.parse(fs.readFileSync(new URL('./.runtime/round2-flow-before.json',import.meta.url)));const temporary={nodes:[...cleanFlow.nodes,...original.nodes.filter(n=>n.id.startsWith('nc-meter-2')&&!cleanFlow.nodes.some(c=>c.id===n.id))].map(n=>({id:n.id,type:n.type,data:n.data,position:n.position})),edges:[...cleanFlow.edges,...original.edges.filter(e=>e.source.startsWith('nc-meter-2')&&!cleanFlow.edges.some(c=>c.id===e.id))].map(e=>({id:e.id,source:e.source,target:e.target,sourceHandle:e.sourceHandle,targetHandle:e.targetHandle}))};await p.request.put(ports.frontend.url+'/api/resources/1/flow',{data:temporary});
 const current=await(await p.request.get(ports.frontend.url+'/api/resources/1/usage/active')).json();
 if(!current.usage)throw Error('Expected active Mia session');
 const usageId=current.usage.id;
 const end=await p.request.put(ports.frontend.url+'/api/resources/1/usage/end',{data:{notes:'Solarmodulhalterungen geschnitten und geprüft. Linsenbereich gereinigt; Absaugung geprüft.',formSubmissions:[]}});if(!end.ok())throw Error('End German session failed '+end.status());
 await delay(12000);
 const history=await open('/resources/1/history',{time:Date.now()});
 await history.locator('tbody tr').first().click();await history.getByRole('button',{name:'Abrechnungsübersicht öffnen',exact:true}).waitFor();await history.getByRole('button',{name:'Abrechnungsübersicht öffnen',exact:true}).click();await history.getByRole('dialog').filter({has:history.getByText('Transaktionsdetails',{exact:true})}).getByText('Beitrag Absaugung & Filter',{exact:true}).waitFor();await delay(800);
 await shot(history,'billing-detail',{selectors:['[role="dialog"]','[role="dialog"] tbody tr']});
 fs.writeFileSync(new URL('./.runtime/billing-detail-visible.txt',import.meta.url),await history.locator('body').innerText());
 await p.request.put(ports.frontend.url+'/api/resources/1/flow',{data:{nodes:cleanFlow.nodes.map(n=>({id:n.id,type:n.type,data:n.data,position:n.position})),edges:cleanFlow.edges.map(e=>({id:e.id,source:e.source,target:e.target,sourceHandle:e.sourceHandle,targetHandle:e.targetHandle}))}});
 manifest.session={usageId,realRequiredFormStart:true,realApiEnd:true,project:'Solarboot 2027'};write();
}catch(e){manifest.gaps.push({error:e.message});write();throw e;}finally{await browser.close()}
