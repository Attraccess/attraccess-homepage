import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';
const root=path.resolve(import.meta.dirname,'../..');const out=path.join(root,'assets/captures');const file=out+'/manifest.json';const m=JSON.parse(fs.readFileSync(file));
const assets=[];const errors=[];
function check(file,expected){const p=path.join(out,file);if(!fs.existsSync(p)){errors.push('Missing '+file);return;}const b=fs.readFileSync(p);if(b.toString('ascii',1,4)!=='PNG'){errors.push('Invalid PNG '+file);return;}const width=b.readUInt32BE(16),height=b.readUInt32BE(20);if(expected&&(width!==expected.width||height!==expected.height))errors.push(`Dimensions ${file}: ${width}×${height}`);return {width,height,bytes:b.length};}
for(const s of m.shots){const pixels=check(s.file,{width:s.viewport.width*s.viewport.deviceScaleFactor,height:s.viewport.height*s.viewport.deviceScaleFactor});assets.push({file:s.file,page:s.page,theme:s.theme,viewport:s.viewport,kind:s.kind,pixels,clock:s.clock});if(s.errors?.length)errors.push(...s.errors);if(s.brokenImages?.length)errors.push('Broken page images '+s.file);for(const e of s.elements){assets.push({file:e.file,page:s.page,theme:s.theme,viewport:s.viewport,kind:'component',label:e.label,bounds:e.bounds,nativeScale:e.nativeScale,pixels:check(e.file)});}}
for(const seq of m.sequences){if(seq.frames.length!==seq.frameCount)errors.push(seq.name+' wrong frame count');for(const f of seq.frames){assets.push({file:f.file,page:seq.page,theme:seq.theme,viewport:seq.viewport,kind:'sequence-frame',frame:f.frame,timeMs:f.timeMs,pixels:check(f.file,{width:seq.viewport.width*seq.viewport.deviceScaleFactor,height:seq.viewport.height*seq.viewport.deviceScaleFactor})});if(f.componentFile&&fs.existsSync(out+'/'+f.componentFile))assets.push({file:f.componentFile,page:seq.page,theme:seq.theme,viewport:seq.viewport,kind:'sequence-component',frame:f.frame,timeMs:f.timeMs,bounds:f.componentBounds,pixels:check(f.componentFile)});}}
const unique=new Map(assets.map(a=>[a.file,a]));m.assets=[...unique.values()];
m.gaps=[
'Meter charts are absent in this revision; genuine lifetime and current-session totals were captured.',
'Maintenance request photos and assigned-maintainer fields are absent; reporter, resolver and completed-by maintainer records exist.',
'Supervision progression is stored as completed supervised sessions; this revision has no progress widget. Felix Novak has two of three required sessions.',
'Maintenance schedules show operating-hour settings and next-run summary, without an hour-progress widget.',
'Resource overview rows show availability; active users are displayed on the resource detail/history, without user avatars in overview rows.',
'Shelly has device-management plugin UI, without a Shelly-specific flow node. Real HTTP nodes call local RPC simulation.',
'WAGO controllers have live local MQTT heartbeats; full managed runtime verification is not simulated, so the UI retains Checking software.',
'RabbitMQ plugin is loaded; a local MQTT protocol simulator supplies messaging, without RabbitMQ management endpoints.',
'OIDC/SAML providers are display configurations using local inert endpoints. No identity or payment provider is contacted.',
'No suitable photographs exist locally for every resource; unsupported photo matches were removed and the app uses its native resource icons.',
'The flow sequence shows genuine execution records in the native Flow Logs panel; node-canvas highlights did not render in the local live-update path.',
'Start sequence begins at the filled required-form confirmation and continues into the active session; start-ready and filled-form states are also supplied as stills.',
];
m.verification={at:new Date().toISOString(),shots:m.shots.length,componentCrops:m.shots.reduce((n,s)=>n+s.elements.length,0),sequences:m.sequences.map(s=>({name:s.name,frames:s.frameCount,fps:s.fps})),assetCount:m.assets.length,errors};
if(process.argv.includes('--prune')){const referenced=new Set(m.assets.map(a=>a.file));for(const f of fs.readdirSync(out))if(f.endsWith('.png')&&!referenced.has(f))fs.unlinkSync(path.join(out,f));}
fs.writeFileSync(file,JSON.stringify(m,null,2));
const req=createRequire(root+'/software/package.json');const sqlite3=req('sqlite3');const db=new sqlite3.Database(path.join(import.meta.dirname,'.runtime/storage/attraccess.sqlite'));
const rows=await new Promise((res,rej)=>db.all('PRAGMA foreign_key_check',(e,r)=>e?rej(e):res(r)));await new Promise(r=>db.close(r));if(rows.length)errors.push('Foreign key violations: '+rows.length);
console.log(JSON.stringify(m.verification,null,2));if(errors.length)process.exitCode=1;
