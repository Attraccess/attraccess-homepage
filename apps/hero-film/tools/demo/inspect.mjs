import {createRequire} from 'node:module';import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');const req=createRequire(root+'/../web/package.json');const {chromium}=req('playwright');
const ports=JSON.parse(fs.readFileSync(root+'/software/.dev-serve-ports.json'));const browser=await chromium.launch();const ctx=await browser.newContext({viewport:{width:1600,height:1000},deviceScaleFactor:2,colorScheme:'dark'});const p=await ctx.newPage();
const r=await p.request.post(ports.frontend.url+'/api/auth/session/local',{data:{username:'priya.nair@north-campus.example',password:process.env.DEMO_PASSWORD??'Demo1234!',tokenLocation:'cookie'}});if(!r.ok())throw Error(await r.text());
await p.addInitScript(()=>{localStorage.setItem('heroui-theme','dark');localStorage.setItem('i18nextLng','en');localStorage.setItem('donationPrompt:snoozedUntil',String(Date.now()+1e10));});
for(const route of process.argv.slice(2)){await p.goto(ports.frontend.url+route);await p.waitForTimeout(1800);console.log(route+'\n'+(await p.locator('body').innerText()).slice(0,16000));await p.screenshot({path:root+'/tools/demo/.runtime/inspect-'+route.replace(/\W+/g,'-')+'.png'});}
await browser.close();
