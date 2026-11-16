import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
const here=import.meta.dirname,runtime=path.join(here,'.runtime');
function execute(name,args=[]){const r=spawnSync(process.execPath,[path.join(here,name),...args],{stdio:'inherit'});if(r.status)throw Error(name+' failed');}
function stop(all=true){for(const name of all?['server','simulator','mock']:['server']){const file=path.join(runtime,name+'.pid');if(fs.existsSync(file)){const pid=Number(fs.readFileSync(file));try{process.kill(name==='server'?-pid:pid,'SIGTERM');}catch{}fs.rmSync(file,{force:true});}}}
async function waitStop(){for(let n=0;n<100;n++){if(!fs.existsSync(runtime+'/software/.dev-serve-ports.json'))return;await new Promise(r=>setTimeout(r,100));}throw Error('German launcher did not stop');}
const cmd=process.argv[2]||'start';
if(cmd==='stop'){stop();await waitStop();}
else if(cmd==='restart'){stop(false);await waitStop();execute('start.mjs');}
else if(cmd==='seed'){stop();await waitStop();const r=spawnSync('python3',[here+'/seed.py'],{stdio:'inherit'});if(r.status)throw Error('German seed failed');execute('start.mjs');}
else if(cmd==='start')execute('start.mjs');else throw Error('Unknown German command');
