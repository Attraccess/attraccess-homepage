import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,existsSync,openSync} from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../..');
const repo=path.join(import.meta.dirname,'.runtime/software');
const runtime=path.join(import.meta.dirname,'.runtime');
mkdirSync(runtime,{recursive:true});
const portsFile=path.join(repo,'.dev-serve-ports.json');
let serverAlive=false;if(existsSync(portsFile)){const p=JSON.parse(readFileSync(portsFile));try{process.kill(p.pid,0);if(!existsSync(path.join(runtime,'server.pid')))throw Error('This worktree server is not owned by the film demo.');process.kill(Number(readFileSync(path.join(runtime,'server.pid'))),0);serverAlive=true;}catch(e){if(e.message.includes('not owned'))throw e;}}
try{process.loadEnvFile(path.join(repo,'.env'));}catch{}
const secretFile=path.join(runtime,'session-secret');
if(!existsSync(secretFile))writeFileSync(secretFile,crypto.randomBytes(32).toString('hex'),{mode:0o600});
const sessionSecret=readFileSync(secretFile,'utf8');
const env={...process.env,PORT:"3010",VITE_PORT:"4210",VITE_PREVIEW_PORT:"4310",NX_DAEMON:"false",NODE_USE_ENV_PROXY:"1",HTTP_PROXY:"http://127.0.0.1:19080",HTTPS_PROXY:"http://127.0.0.1:19080",NO_PROXY:"localhost,127.0.0.1,[::1]",STORAGE_ROOT:path.join(runtime,'storage'),PLUGIN_DIR:path.join(runtime,'storage/plugins'),AUTH_SESSION_SECRET:sessionSecret,SMTP_HOST:'127.0.0.1',SMTP_PORT:'19026',SMTP_FROM:'lab@north-campus.example',SMTP_USER:'',SMTP_PASS:'',SMTP_SECURE:'false',LOG_LEVELS:'error,warn,log',LOG_DESTINATIONS:'console,file',LOG_FILE_PATH:path.join(runtime,'api.log')};
delete env.VALKEY_URL;
delete env.REDIS_URL;
env.PATH=path.join(process.env.HOME,'.nvm/versions/node/v'+readFileSync(path.join(repo,'.nvmrc'),'utf8').trim(),'bin')+':'+env.PATH;
const require=createRequire(path.join(repo,'package.json'));const sqlite3=require('sqlite3');
const db=new sqlite3.Database(path.join(runtime,'storage/attraccess.sqlite'));
const encKey=Buffer.from(crypto.hkdfSync('sha256',Buffer.from(sessionSecret),Buffer.from('attraccess.encryption.salt'),Buffer.from('attraccess|aes-256-gcm|content-encryption'),32));
const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',encKey,iv);
const license='I AM USING THIS SOFTWARE ONLY FOR NON-PROFIT AND COMPLY TO ALL TERMS OF THE LICENSE.md at https://github.com/Attraccess/Attraccess/blob/main/LICENSE.md';
const encrypted='v1.'+Buffer.concat([iv,cipher.update(license,'utf8'),cipher.final(),cipher.getAuthTag()]).toString('base64url');
for(const [parent,key,value] of [['app','license_key',encrypted],['smtp','host','127.0.0.1'],['smtp','port','19026'],['smtp','from','Prototyping-Labor Nordcampus <lab@north-campus.example>'],['smtp','user',''],['smtp','service','SMTP'],['smtp','secure','false']])await new Promise((resolve,reject)=>db.run('INSERT INTO setting(parent,key,value) VALUES(?,?,?) ON CONFLICT(parent,key) DO UPDATE SET value=excluded.value',[parent,key,value],e=>e?reject(e):resolve()));
await new Promise(resolve=>db.close(resolve));
if(!serverAlive){
const log=openSync(path.join(runtime,'serve.log'),'a');
const child=spawn('pnpm',['serve'],{cwd:repo,env,detached:true,stdio:['ignore',log,log]});child.unref();
writeFileSync(path.join(runtime,'server.pid'),String(child.pid));
}
let mockAlive=false;if(existsSync(path.join(runtime,'mock.pid'))){try{process.kill(Number(readFileSync(path.join(runtime,'mock.pid'))),0);mockAlive=true;}catch{}}
if(!mockAlive){
const mocklog=openSync(path.join(runtime,'mock.log'),'a');
const mock=spawn(process.execPath,[path.join(import.meta.dirname,'mock.mjs')],{cwd:root,env,detached:true,stdio:['ignore',mocklog,mocklog]});mock.unref();writeFileSync(path.join(runtime,'mock.pid'),String(mock.pid));
}
for(let i=0;i<120&&!existsSync(portsFile);i++)await new Promise(r=>setTimeout(r,500));
if(existsSync(path.join(runtime,'device-credentials.json'))){let alive=false;try{process.kill(Number(readFileSync(path.join(runtime,'simulator.pid'))),0);alive=true;}catch{}if(!alive){const l=openSync(path.join(runtime,'simulator.log'),'a');const sim=spawn(process.execPath,[path.join(import.meta.dirname,'integrations.mjs'),'--simulate'],{cwd:root,env,detached:true,stdio:['ignore',l,l]});sim.unref();writeFileSync(path.join(runtime,'simulator.pid'),String(sim.pid));}}


for(let i=0;i<600;i++){
 if(existsSync(portsFile)){const p=JSON.parse(readFileSync(portsFile));try{const [a,f]=await Promise.all([fetch(p.api.url+'/api'),fetch(p.frontend.url)]);if(a.ok&&f.ok){console.log(JSON.stringify(p,null,2));break;}}catch{}}
 if(i===599)throw Error('Demo startup did not become ready; inspect .runtime/serve.log');
 await new Promise(r=>setTimeout(r,1000));
}
