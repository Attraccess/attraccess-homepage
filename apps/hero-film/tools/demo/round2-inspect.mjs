import {open,browser,ports,OUT} from './capture.mjs';
import fs from 'node:fs';
try{
 const p=await open('/resources/1/flows',{user:'film.operator'});
 console.log('FLOW',JSON.stringify(await (await p.request.get(ports.frontend.url+'/api/resources/1/flow')).json()));
 console.log('NODES',await p.locator('.react-flow__node').evaluateAll(es=>es.map(e=>({id:e.dataset.id,w:e.offsetWidth,h:e.offsetHeight,text:e.innerText,handles:[...e.querySelectorAll('.react-flow__handle')].map(h=>({id:h.dataset.handleid,cls:h.className}))}))));
 console.log('CANVAS',await p.locator('.react-flow').boundingBox());
 console.log('SCHEDULES',await (await p.request.get(ports.frontend.url+'/api/resources/1/maintenance-schedules')).json());
 const r=await open('/resources/1');console.log('RESOURCE',await r.locator('main').innerText());
 const c=await open('/devices/companion/1',{user:'film.operator'});console.log('COMPANION',await c.locator('main').innerText());
 await c.screenshot({path:OUT+'/companion2-inspect.png'});
}finally{await browser.close()}
