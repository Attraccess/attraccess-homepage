import {readFileSync,existsSync,mkdirSync,rmSync} from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {createRequire} from 'node:module';
const here=import.meta.dirname;const root=path.resolve(here,'../..');const software=path.join(root,'software');const runtime=path.join(here,'.runtime');const storage=path.join(runtime,'storage');
function execute(script,args=[]){const result=spawnSync(process.execPath,[path.join(here,script),...args],{cwd:root,env:{...process.env,ATTRACCESS_REPO:software},stdio:'inherit'});if(result.status)throw Error(`${script} failed (${result.status})`);}
function stop(all=true){for(const name of all?['server','simulator','mock']:['server']){const file=path.join(runtime,name+'.pid');if(existsSync(file)){const pid=Number(readFileSync(file));try{process.kill(name==='server'?-pid:pid,'SIGTERM');}catch{}}}}
async function waitStop(){for(let i=0;i<30;i++){if(!existsSync(software+'/.dev-serve-ports.json'))return;await new Promise(r=>setTimeout(r,100));}}
const command=process.argv[2]??'start';
if(command==='stop'){stop();await waitStop();}
else if(command==='restart'){stop(false);await waitStop();execute('start.mjs');}
else if(command==='start'){execute('start.mjs');}
else if(command==='seed'){
 if(storage!==path.join(root,'tools/demo/.runtime/storage'))throw Error('Refusing to reset non-film storage');
 stop();await waitStop();await new Promise(r=>setTimeout(r,500));
 const require=createRequire(software+'/package.json');const sqlite3=require('sqlite3');
 const source=new sqlite3.Database(software+'/storage/attraccess.sqlite',sqlite3.OPEN_READONLY);
 const count=t=>new Promise((res,rej)=>source.get(`SELECT count(*) AS n FROM ${t}`,(e,r)=>e?rej(e):res(r.n)));
 if(await count('user')||await count('resource'))throw Error('Prepared source database must still be empty; refusing to copy real data.');
 rmSync(path.join(runtime,'device-credentials.json'),{force:true});rmSync(storage,{recursive:true,force:true});mkdirSync(storage,{recursive:true});
 await new Promise((res,rej)=>{const backup=source.backup(storage+'/attraccess.sqlite');backup.step(-1,e=>{if(e)rej(e);else backup.finish(err=>err?rej(err):res());});});await new Promise(r=>source.close(r));
 // Only the empty migrated schema and app settings are borrowed, never users or devices.
 const db=new sqlite3.Database(storage+'/attraccess.sqlite');await new Promise((res,rej)=>db.run('DELETE FROM attractap',e=>e?rej(e):res()));await new Promise(r=>db.close(r));
 if(!existsSync(software+'/apps/plugins/shelly/package/plugin.json')){const result=spawnSync('pnpm',['nx','run-many','-t','build','--projects=plugin-shelly,plugin-wago,plugin-rabbitmq'],{cwd:software,stdio:'inherit'});if(result.status)throw Error('Plugin build failed');}
 execute('integrations.mjs',['--install']);execute('start.mjs');
 const ports=JSON.parse(readFileSync(software+'/.dev-serve-ports.json'));execute('seed.mjs',['--storage',storage,'--api',ports.api.url]);
 stop(false);await waitStop();execute('start.mjs');console.log('Film demo re-seeded and running.');
}else throw Error('Unknown demo command: '+command);
