import http from 'node:http';
let on=true;const events=[];
for(const [index,port] of [19024,19034,19044].entries())http.createServer(async(req,res)=>{let body='';for await(const c of req)body+=c;const u=new URL(req.url,'http://127.0.0.1');if(u.pathname==='/rpc/Switch.Set'){on=u.searchParams.get('on')==='true';}events.push({path:u.pathname,at:Date.now(),body});res.setHeader('Content-Type','application/json');let result={id:0,on,was_on:!on,output:on,apower:on?1280:0,aenergy:{total:48360},temperature:{tC:32.1}};if(u.pathname==='/events')result={accepted:true};if(u.pathname==='/shelly')result={id:'shellypro1pm-north-campus',gen:2,model:'SPSW-001PE16EU',auth_en:false};if(u.pathname==='/rpc/Shelly.GetDeviceInfo')result={id:'shellypro1pm-north-campus',gen:2,model:index===2?'SPSW-002PE16EU':index===1?'SNSW-001P16EU':'SPSW-001PE16EU',ver:'1.6.2',fw_id:'20260924-164019/1.6.2',app:index===2?'Pro2':index===1?'Plus1PM':'Pro1PM',auth_en:false};if(u.pathname==='/rpc/Shelly.CheckForUpdate')result={};res.end(JSON.stringify(result));}).listen(port,'127.0.0.1');
const {default:net}=await import('node:net');net.createServer(s=>{s.write('220 north-campus.local SMTP ready\r\n');s.on('data',()=>s.write('250 OK\r\n'));}).listen(19026,'127.0.0.1');
console.log('Local simulated Shelly/webhook and SMTP sinks listening');

// An isolated transport proxy lets the unmodified Shelly plugin use literal IPv4:80
// while every actual socket goes to a German loopback RPC simulator.
const {default:os}=await import('node:os');const {createRequire}=await import('node:module');
const hosts=Object.entries(os.networkInterfaces()).sort(([a],[b])=>Number(/^en/.test(b))*2+Number(/^bridge/.test(b))-Number(/^en/.test(a))*2-Number(/^bridge/.test(a))).flatMap(([,as])=>as.filter(a=>a.family==='IPv4'&&!a.internal&&!/\.(0|255)$/.test(a.address)).map(a=>a.address)).slice(0,3);
const require=createRequire(new URL('./.runtime/software/package.json',import.meta.url));const sqlite3=require('sqlite3');const db=new sqlite3.Database(new URL('./.runtime/storage/attraccess.sqlite',import.meta.url).pathname);
await new Promise((res,rej)=>db.run("UPDATE plugin_shelly_devices SET ip_address='127.0.0.'||id",e=>e?rej(e):res()));
for(const [i,host] of hosts.entries())await new Promise((res,rej)=>db.run('UPDATE plugin_shelly_devices SET ip_address=? WHERE id=?',[host,i+1],e=>e?rej(e):res()));await new Promise(r=>db.close(r));
const proxy=http.createServer((req,res)=>{res.writeHead(403);res.end('Only dedicated simulated device tunnels are permitted.');});
proxy.on('connect',(req,client,head)=>{const [host,port]=req.url.split(':');const i=hosts.indexOf(host);if(i<0||port!=='80'){client.end('HTTP/1.1 403 Forbidden\r\n\r\n');return;}const upstream=net.connect(19024+i*10,'127.0.0.1',()=>{client.write('HTTP/1.1 200 Connection Established\r\n\r\n');if(head.length)upstream.write(head);client.pipe(upstream);upstream.pipe(client);});upstream.on('error',()=>client.destroy());client.on('error',()=>upstream.destroy());client.on('close',()=>upstream.destroy());});
proxy.listen(19080,'127.0.0.1');console.log('German Shelly transport proxy listening on loopback 19080; no LAN sockets.');
