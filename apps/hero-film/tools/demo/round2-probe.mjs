import {open,browser,delay,ports} from './capture.mjs';
try {
 const p=await open('/resources/1/flows',{user:'film.operator',time:Date.now()});await delay(1800);await p.getByRole('button',{name:'Collapse',exact:true}).click();
 console.log('FIBER',await p.locator('.react-flow').evaluate(e=>{let f=e[Object.keys(e).find(k=>k.startsWith('__reactFiber'))];let r=[];for(let i=0;f&&i<14;i++,f=f.return)r.push({name:f.type?.name,keys:Object.keys(f.memoizedProps||{}),store:!!f.memoizedProps?.store});return r}));
 const r=await open('/resources/1',{time:Date.now()});await r.getByRole('button',{name:'End Session',exact:true}).waitFor();console.log('RESOURCE',await r.locator('main').innerText());
 const c=await open('/devices/companion',{user:'film.operator',time:Date.now()});await delay(1800);console.log('COMP',await c.locator('main').innerText());console.log('BUTTONS',await c.locator('main button').allTextContents());
}finally{await browser.close()}
