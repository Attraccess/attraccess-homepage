import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import net from 'node:net';
import http from 'node:http';
import os from 'node:os';

const toolRoot = dirname(fileURLToPath(import.meta.url));
const workspace = resolve(toolRoot, '../..');
const software = join(toolRoot, '.runtime/software');
const require = createRequire(join(software, 'package.json'));
const { hash } = require('bcrypt');

/** Stage genuine built plugin packages in the film's isolated storage before restarting the API. */
export async function installPlugins(storageRoot) {
  await mkdir(join(storageRoot, 'plugins'), { recursive: true });
  for (const name of ['shelly', 'wago', 'rabbitmq']) {
    await cp(join(software, 'apps/plugins', name, 'package'), join(storageRoot, 'plugins', name), { recursive: true });
  }
  return ['shelly', 'wago', 'rabbitmq'];
}

/** Only touches the caller's dedicated demo database. No real devices or identity providers. */
export async function seedIntegrations({ db, run, get, insert, storageRoot, resources, now = new Date() }) {
  const time = new Date(now).toISOString();
  const oldTime = new Date(new Date(now).getTime() - 28 * 86400000).toISOString();
  const all = await new Promise((res, rej) => db.all('SELECT id, name, type FROM resource', (err, rows) => err ? rej(err) : res(rows)));
  const find = (pattern, fallback) => all.find((row) => pattern.test(row.name))?.id ?? fallback;
  const laser = find(/Trotec|laser/i, 1);
  const door = find(/entrance|door/i);
  const cnc = find(/CNC/i);
  const cad = all.filter((row) => /CAD|workstation/i.test(row.name));
  const printer = find(/Prusa/i, 2);
  const credentials = { readers: [], companions: [], wago: [] };
  const insertId = async (table, data) => {
    await insert(db, table, data);
    return (await get(db, 'SELECT last_insert_rowid() AS id')).id;
  };
  const tables = await new Promise((res, rej) => db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => err ? rej(err) : res(new Set(rows.map(r => r.name)))));

  // Tokens remain only in the private runtime file; API responses never expose hashes.
  for (const [index, [name, variant, ids]] of [
    ['Digital fabrication · Attractap Touch', 'touch', [laser, printer, cnc].filter(Boolean)],
    ['Woodshop · Attractap Ethernet', 'eth', all.filter(r => /saw/i.test(r.name)).map(r => r.id)],
    ['Electronics lab · Attractap Touch', 'touch', all.filter(r => /Solder|Oscillo|Micro/i.test(r.name)).map(r => r.id)],
    ['Workshop entrance · Attractap Mini', 'mini', [door].filter(Boolean)],
  ].entries()) {
    const token = randomBytes(32).toString('base64url');
    const id = await insertId('attractap', {
      name, apiTokenHash: await hash(token, 10), lastConnection: time, firstConnection: oldTime,
      firmwareName: 'Attractap', firmwareVariant: variant, firmwareVersion: index === 1 ? '1.10.2' : '1.11.0',
      firmwareCapabilitiesResourceselection: variant !== 'mini' ? 1 : 0,
      firmwareCapabilitiesResourceactionselection: 1, firmwareCapabilitiesCardenrollment: variant !== 'mini' ? 1 : 0,
      firmwareCapabilitiesHasleds: 1, ledBrightness: 180,
    });
    for (const resourceId of ids) await insert(db, 'attractap_resources_resource', { attractapId: id, resourceId });
    credentials.readers.push({ id, token });
  }
  await insert(db,'attractap',{name:'Portable teaching kit · Attractap Lite',apiTokenHash:await hash(randomBytes(32).toString('base64url'),10),lastConnection:new Date(new Date(now).getTime()-12*86400000).toISOString(),firstConnection:oldTime,firmwareName:'Attractap',firmwareVariant:'eth',firmwareVersion:'1.10.2'});
  for (const [index, [name, platform, arch]] of [
    ['Laser control · Windows', 'win32', 'x64'],
    ['CAD Studio · macOS', 'darwin', 'arm64'],
    ['Electronics Bench · Linux', 'linux', 'x64'],
  ].entries()) {
    const token = randomBytes(32).toString('base64url');
    const id = await insertId('companion_device', { name, tokenHash: await hash(token, 10), locked: index === 0 ? 0 : 1,
      lastConnection: time, firstConnection: oldTime, appVersion: '1.11.0' });
    const resourceId = index === 0 ? laser : cad[index - 1]?.id;
    if (resourceId) await insert(db, 'companion_device_resources_resource', { companionDeviceId: id, resourceId });
    credentials.companions.push({ id, token, platform, arch, appVersion: '1.11.0' });
  }

  let mqtt = await get(db, "SELECT id FROM mqtt_server WHERE name = ?", ['North Campus · Local MQTT']);
  if (!mqtt) mqtt = { id: await insertId('mqtt_server', { name: 'North Campus · Local MQTT', host: '127.0.0.1', port: 19025,
    username: null, password: null, useTls: 0, defaultPublishQos: 1, defaultPublishRetain: 0, defaultSubscribeQos: 1,
    clientId: 'north-campus-attraccess', createdAt: oldTime, updatedAt: time }) };

  for (const [name, type] of [['Microsoft Entra ID', 'OIDC'], ['Keycloak', 'OIDC'], ['University Identity · SAML', 'SAML']]) {
    const id = await insertId('sso_provider', { name, type, createdAt: oldTime, updatedAt: time });
    if (type === 'OIDC') {
      const slug = name === 'Keycloak' ? 'keycloak' : 'entra';
      const issuer = `http://127.0.0.1:19024/identity/${slug}`;
      await insert(db, 'sso_provider_oidc_configuration', { ssoProviderId: id, issuer,
        authorizationURL: `${issuer}/authorize`, tokenURL: `${issuer}/token`, userInfoURL: `${issuer}/userinfo`,
        clientId: 'north-campus-workshop', clientSecret: randomBytes(24).toString('base64url'), scopes: 'email,profile',
        usernameClaimPaths: 'name,preferred_username', emailClaimPaths: 'email', permissionMappings: JSON.stringify({ 'resource-manager': ['workshop-trainers'] }),
        createdAt: oldTime, updatedAt: time });
    } else {
      await insert(db, 'sso_provider_saml_configuration', { ssoProviderId: id, entryPoint: 'http://127.0.0.1:19024/identity/saml',
        issuer: 'north-campus-prototyping-lab', certificate: '', signRequest: 0, wantAssertionsSigned: 1, wantAuthnResponseSigned: 1,
        forceAuthn: 0, emailAttributeKeys: 'email', createdAt: oldTime, updatedAt: time });
    }
  }

  if (tables.has('plugin_shelly_devices')) {
    for (const [index, name] of ['Laser cutter · Shelly Pro 1PM', 'Extraction · Shelly Plus 1PM', 'Woodshop lighting · Shelly Pro 2'].entries()) {
      await insert(db, 'plugin_shelly_devices', { name, ip_address: `127.0.0.1:${19024 + index * 10}`,
        generation: 2, model: index === 2 ? 'SPSW-002PE16EU' : 'SPSW-001PE16EU', auth_state: 'none', last_probe_at: time,
        last_probe_error: null, created_at: oldTime, updated_at: time });
    }
  }
  if (tables.has('plugin_wago_controllers')) {
    for (const [index, name] of ['Woodshop · WAGO CC100', 'Extraction plant · WAGO CC100'].entries()) {
      const hardwareId = `CC100-NC-${1001 + index}`;
      await insert(db, 'plugin_wago_controllers', { hardware_id: hardwareId, trust_state: 'claimed', name, mqtt_server_id: mqtt.id,
        pairing_code_hash: createHash('sha256').update(randomBytes(16)).digest('hex'), fingerprint: null,
        protocol_version: '1.0.0', runtime_version: '1.11.0', capabilities: JSON.stringify(['claim', 'heartbeat', 'configuration-v1']),
        last_sequence: 1, last_heartbeat_at: time, last_seen_at: time, compatibility_error: null, created_at: oldTime, updated_at: time });
      credentials.wago.push({ hardwareId });
    }
    if (!await get(db, 'SELECT id FROM plugin_wago_settings LIMIT 1')) await insert(db, 'plugin_wago_settings', { default_mqtt_server_id: mqtt.id });
  }

  const nodes = [];
  const edges = [];
  const node = (resourceId, id, type, x, y, data = {}) => {
    const fullId = `nc-${resourceId}-${id}`;
    nodes.push({ id: fullId, type, resourceId, positionX: x, positionY: y, data: JSON.stringify(data), createdAt: time, updatedAt: time });
    return fullId;
  };
  const edge = (resourceId, from, to, sourceHandle = 'output') => edges.push({ id: `${from}-${to}`, resourceId,
    source: from, sourceHandle, target: to, targetHandle: 'input', createdAt: time, updatedAt: time });
  const http = (url, body = '') => ({ url, method: body ? 'POST' : 'GET', headers: body ? { 'Content-Type': 'application/json' } : {}, body,
    completionBehavior: 'dispatch', timeoutSeconds: 5, failureBehavior: 'log-and-continue' });
  const start = node(laser, 'start', 'input.resource.usage.started', 0, 10);
  const condition = node(laser, 'condition', 'processing.if', 390, 10, { path: 'user.creditBalance', comparisonOperator: '>=', comparisonValueIsPath: false, comparisonValue: '0' });
  edge(laser, start, condition);
  const operating = node(laser, 'operating', 'output.resource.activity.operating', 390, -210);
  edge(laser, start, operating);
  const relay = node(laser, 'shelly-on', 'output.http.sendRequest', 800, -160, http('http://127.0.0.1:19024/rpc/Switch.Set?id=0&on=true'));
  const extraction = node(laser, 'extraction-on', 'output.mqtt.sendMessage', 800, 70, { serverId: mqtt.id, topic: 'lab/laser/extraction', payload: 'on', qos: 1, retain: true, completionBehavior: 'dispatch', failureBehavior: 'log-and-continue' });
  const unlock = node(laser, 'unlock', 'output.companion.unlock-pc', 800, 300, { deviceId: credentials.companions[0].id });
  for (const target of [relay, extraction, unlock]) edge(laser, condition, target, 'output-true');
  const stop = node(laser, 'stop', 'input.resource.usage.stopped', 0, 680);
  const idle = node(laser, 'idle', 'output.resource.activity.idle', 0, 900);
  edge(laser, stop, idle);
  const off = node(laser, 'shelly-off', 'output.http.sendRequest', 390, 560, http('http://127.0.0.1:19024/rpc/Switch.Set?id=0&on=false'));
  const bill = node(laser, 'billing', 'output.resource.billing.calculation.set-additional-items', 390, 790, { name: 'Extraction & filter contribution', unitPrice: 25, quantity: 1, description: 'Shared extraction consumables', externalReference: 'laser-extraction' });
  const webhook = node(laser, 'webhook', 'output.http.sendRequest', 800, 560, http('http://127.0.0.1:19024/events', '{"event":"session.ended","resource":"Trotec Speedy 400"}'));
  const extractionOff = node(laser, 'extraction-off', 'output.mqtt.sendMessage', 800, 790, { serverId: mqtt.id, topic: 'lab/laser/extraction', payload: 'off', qos: 1, retain: true, completionBehavior: 'dispatch', failureBehavior: 'log-and-continue' });
  edge(laser, stop, off); edge(laser, off, webhook); edge(laser, stop, bill); edge(laser, stop, extractionOff);

  // A safe manual test produces genuine execution highlights, without altering any session.
  const check = node(laser, 'check', 'input.button', 0, 1110, { label: 'Run extraction check' });
  const inspect = node(laser, 'inspect', 'output.http.sendRequest', 390, 1110, { ...http('http://127.0.0.1:19024/rpc/Shelly.GetStatus'), completionBehavior: 'acknowledged' });
  const health = node(laser, 'health', 'output.resource.health.set', 800, 1110, { identifier: 'extraction', status: 'healthy', reason: 'Extraction system responding' });
  edge(laser, check, inspect); edge(laser, inspect, health);
  if (door) {
    const open = node(door, 'unlatch', 'input.resource.door.unlatched', 50, 80);
    const pulse = node(door, 'lock-pulse', 'output.http.sendRequest', 480, 80, http('http://127.0.0.1:19024/door/unlatch'));
    edge(door, open, pulse);
    const locked = node(door, 'locked', 'input.resource.door.locked', 50, 350);
    const lock = node(door, 'lock', 'output.http.sendRequest', 480, 350, http('http://127.0.0.1:19024/door/lock'));
    edge(door, locked, lock);
    const unlocked = node(door, 'unlocked', 'input.resource.door.unlocked', 50, 620);
    const release = node(door, 'unlock', 'output.http.sendRequest', 480, 620, http('http://127.0.0.1:19024/door/unlock'));
    edge(door, unlocked, release);
  }
  if (cnc) {
    const button = node(cnc, 'health-check', 'input.button', 50, 80, { label: 'Confirm extraction serviced' });
    const healthy = node(cnc, 'healthy', 'output.resource.health.set', 490, 80, { identifier: 'extraction', status: 'healthy', reason: 'Filter and extraction check completed' });
    edge(cnc, button, healthy);
  }
  for (const resourceId of [...new Set(nodes.map(item => item.resourceId))]) {
    await run(db, 'DELETE FROM resource_flow_edge WHERE resourceId = ?', [resourceId]);
    await run(db, 'DELETE FROM resource_flow_node WHERE resourceId = ?', [resourceId]);
  }
  for (const item of nodes) await insert(db, 'resource_flow_node', item);
  for (const item of edges) await insert(db, 'resource_flow_edge', item);
  await patchMeterFlows({ db, run, get, insert, now });
  await mkdir(dirname(storageRoot), { recursive: true });
  await writeFile(join(dirname(storageRoot), 'device-credentials.json'), JSON.stringify(credentials), { mode: 0o600 });
  return { nodes: nodes.length, edges: edges.length, readerIds: credentials.readers.map(d => d.id), companionIds: credentials.companions.map(d => d.id), mqttServerId: mqtt.id,
    laserResourceId: laser, routes: ['/attractap/readers', '/devices/companion', '/shelly', '/wago', '/settings/plugins', '/settings/sso', `/resources/${laser}/flows`],
    gaps: ['Shelly plugin has no flow node; real HTTP request nodes call its simulated Switch.Set RPC.', 'Identity providers are inert display configurations using local URLs.', 'RabbitMQ plugin is installed; broker administration requires a RabbitMQ broker rather than a generic MQTT broker.'] };
}

/** Valid lifecycle branches for the locally simulated resettable counters. Safe to re-run alone. */
export async function patchMeterFlows({ db, run, insert, now = new Date() }) {
  const meters = await new Promise((res, rej) => db.all('SELECT * FROM resource_meter ORDER BY resourceId, id', (err, rows) => err ? rej(err) : res(rows)));
  const time = new Date(now).toISOString();
  for (const [index, meter] of meters.entries()) {
    const prefix = `nc-meter-${meter.id}`;
    await run(db, 'DELETE FROM resource_flow_edge WHERE id LIKE ?', [`${prefix}%`]);
    await run(db, 'DELETE FROM resource_flow_node WHERE id LIKE ?', [`${prefix}%`]);
    const isLaser = /Electricity|Run time/i.test(meter.name);
    const y = /Run time/i.test(meter.name) ? 730 : 10;
    const left = isLaser ? 1230 : 50;
    const right = isLaser ? 1640 : 490;
    for (const [id, type, x, nodeY, data] of [
      ['start', 'input.resource.metering.start', left, y, { meterId: meter.id, timeoutSeconds: 10 }],
      ['ready', 'output.resource.metering.ready', right, y, { meterId: meter.id, source: /Electricity/i.test(meter.name) ? 'Shelly Pro 3EM · resettable counter' : /Filament/i.test(meter.name) ? 'Printer filament counter' : 'Laser operating counter' }],
      ['collect', 'input.resource.metering.collect', left, y + 290, { meterId: meter.id, timeoutSeconds: 10, interimIntervalMinutes: 0, finalAttempts: 1, finalRetryDelaySeconds: 0 }],
      ['report', 'output.resource.metering.report', right, y + 290, { meterId: meter.id, mode: 'increment', value: /Electricity/i.test(meter.name) ? '0.017' : /Filament/i.test(meter.name) ? '5' : '0.002', source: /Electricity/i.test(meter.name) ? 'Shelly Pro 3EM' : /Filament/i.test(meter.name) ? 'Printer filament counter' : 'Laser operating counter' }],
    ]) await insert(db, 'resource_flow_node', { id: `${prefix}-${id}`, type, resourceId: meter.resourceId,
      positionX: x, positionY: nodeY, data: JSON.stringify(data), createdAt: time, updatedAt: time });
    for (const [from, to] of [['start', 'ready'], ['collect', 'report']]) await insert(db, 'resource_flow_edge', {
      id: `${prefix}-${from}-${to}`, source: `${prefix}-${from}`, sourceHandle: 'output', target: `${prefix}-${to}`, targetHandle: 'input',
      resourceId: meter.resourceId, createdAt: time, updatedAt: time });
  }
  return meters.length;
}

/** Preserve the browser-based reader while giving it a capture-ready location label. */
export async function normalizeBrowserReaderNames({ db, run }) {
  await run(db, "UPDATE attractap SET name = 'Teaching desk · Attractap simulator' WHERE firmwareVariant = 'desktop' AND (name IS NULL OR length(name) < 8)");
}

/** Production Shelly validation allows literal nonloopback IPv4 only on port 80.
 * Bind only addresses already owned by this computer; never probe any other address. */
export async function startNativeShellySimulators(storageRoot) {
  const hosts = Object.entries(os.networkInterfaces())
    .sort(([a], [b]) => Number(/^(en|bridge)/.test(b)) - Number(/^(en|bridge)/.test(a)))
    .flatMap(([, addresses]) => addresses.filter(a => a.family === 'IPv4' && !a.internal && !/\.(0|255)$/.test(a.address)).map(a => a.address))
    .slice(0, 3);
  const servers = [];
  const sqlite3 = require('sqlite3');
  const db = new sqlite3.Database(join(storageRoot, 'attraccess.sqlite'));
  const run = (sql, params = []) => new Promise((res, rej) => db.run(sql, params, e => e ? rej(e) : res()));
  const rows = await new Promise((res, rej) => db.all('SELECT id, name FROM plugin_shelly_devices ORDER BY id', (e, rows) => e ? rej(e) : res(rows)));
  const outputs = hosts.map((_, index) => index === 0);
  // macOS rejects binding port 80 directly to the assigned interface addresses.
  // The permitted wildcard bind is guarded to accept only machine-owned source
  // and destination addresses; it cannot serve a remote LAN client.
  const server = http.createServer(async (req, res) => {
      const address = req.socket.localAddress;
      const remote = req.socket.remoteAddress;
      const index = hosts.indexOf(address);
      if (index < 0 || !rows[index] || (!hosts.includes(remote) && remote !== '127.0.0.1')) { req.socket.destroy(); return; }
      for await (const chunk of req) { void chunk; }
      const url = new URL(req.url, `http://${address}`);
      if (url.pathname === '/rpc/Switch.Set') outputs[index] = url.searchParams.get('on') === 'true';
      const output = outputs[index];
      const model = index === 2 ? 'SPSW-002PE16EU' : index === 1 ? 'SNSW-001P16EU' : 'SPSW-001PE16EU';
      const info = { id: `shelly-north-campus-${index + 1}`, name: rows[index].name, gen: 2, model, ver: '1.6.2', fw_id: '20260924-164019/1.6.2', app: index === 1 ? 'Plus1PM' : index === 2 ? 'Pro2' : 'Pro1PM', auth_en: false };
      let body = { id: 0, output, was_on: !output, apower: output ? 1280 : 0, aenergy: { total: 48360 }, temperature: { tC: 32.1 } };
      if (url.pathname === '/shelly' || url.pathname === '/rpc/Shelly.GetDeviceInfo') body = info;
      else if (url.pathname === '/rpc/Shelly.CheckForUpdate') body = {};
      else if (url.pathname === '/rpc/Shelly.GetStatus') body = { 'switch:0': body, sys: { uptime: 382400, available_updates: {} } };
      else if (url.pathname === '/rpc/Shelly.GetConfig') body = { sys: { device: { name: rows[index].name } }, 'switch:0': { name: rows[index].name, initial_state: 'off' } };
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(body));
  });
  await new Promise((res, rej) => { server.once('error', rej); server.listen(80, '0.0.0.0', res); });
  servers.push(server);
  for (const [index, address] of hosts.entries()) {
    if (!rows[index]) continue;
    await run('UPDATE plugin_shelly_devices SET ip_address = ?, last_probe_at = ?, last_probe_error = NULL WHERE id = ?', [address, new Date().toISOString(), rows[index].id]);
  }
  await new Promise(res => db.close(res));
  await writeFile(join(dirname(storageRoot), 'shelly-local-hosts.json'), JSON.stringify(hosts));
  return () => servers.forEach(server => server.close());
}

/** Keeps simulated Attractap and Companion clients genuinely connected to the local API. */
export async function startDeviceSimulators(apiUrl, storageRoot) {
  const WebSocket = require('ws');
  const saved = JSON.parse(await readFile(join(dirname(storageRoot), 'device-credentials.json'), 'utf8'));
  const wsUrl = apiUrl.replace(/^http/, 'ws');
  const sockets = new Set();
  const timers = new Set();
  let closing = false;
  const schedule = (fn, delay) => { const timer = setTimeout(() => { timers.delete(timer); fn(); }, delay); timers.add(timer); };
  const connect = (kind, device) => {
    if (closing) return;
    const socket = new WebSocket(`${wsUrl}/api/${kind}/websocket`);
    sockets.add(socket);
    let heartbeat;
    const send = (event, data) => socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({ event, data }));
    socket.on('message', (raw) => {
      let message;
      try { message = JSON.parse(raw.toString()); } catch { return; }
      if (kind === 'attractap' && message.event === 'EVENT') {
        send('EVENT', { type: `ACK_${message.data.type}`, payload: {}, messageId: message.data.messageId });
        if (message.data.type === 'READER_REQUEST_AUTHENTICATION') send('EVENT', { type: 'READER_AUTHENTICATE', payload: { id: device.id, token: device.token } });
      }
      if (kind === 'companion' && message.event === 'COMPANION_REQUEST_AUTHENTICATION') send('COMPANION_AUTHENTICATE', device);
    });
    socket.on('open', () => {
      if (kind === 'attractap') heartbeat = setInterval(() => send('HEARTBEAT', {}), 10000);
    });
    socket.on('error', () => {});
    socket.on('close', () => { clearInterval(heartbeat); sockets.delete(socket); schedule(() => connect(kind, device), 2000); });
  };
  for (const device of saved.readers) connect('attractap', device);
  for (const device of saved.companions) connect('companion', device);
  return () => { closing = true; for (const timer of timers) clearTimeout(timer); for (const socket of sockets) socket.close(); };
}

/** A bounded, local MQTT 3.1.1 protocol simulator. No upstream broker or network discovery. */
export async function startMqttSimulator(storageRoot) {
  const mqttRequire = createRequire(require.resolve('mqtt/package.json'));
  const packet = mqttRequire('mqtt-packet');
  const clients = new Map();
  const retained = new Map();
  const matches = (filter, topic) => {
    const parts = filter.split('/'); const actual = topic.split('/');
    return parts.every((part, i) => part === '#' || (i < actual.length && (part === '+' || part === actual[i]))) && (parts.at(-1) === '#' || parts.length === actual.length);
  };
  const send = (socket, value) => { if (!socket.destroyed) socket.write(packet.generate(value)); };
  const publish = (topic, payload, retain = false) => {
    const body = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
    if (retain) retained.set(topic, body);
    for (const [socket, filters] of clients) if (filters.some(filter => matches(filter, topic))) send(socket, { cmd: 'publish', topic, payload: body, qos: 0, retain });
  };
  const server = net.createServer(socket => {
    clients.set(socket, []);
    const parser = packet.parser();
    socket.on('data', data => parser.parse(data));
    socket.on('error', () => {}); socket.on('close', () => clients.delete(socket));
    parser.on('error', () => socket.destroy());
    parser.on('packet', message => {
      if (message.cmd === 'connect') send(socket, { cmd: 'connack', returnCode: 0, sessionPresent: false });
      else if (message.cmd === 'subscribe') {
        clients.get(socket).push(...message.subscriptions.map(s => s.topic));
        send(socket, { cmd: 'suback', messageId: message.messageId, granted: message.subscriptions.map(() => 0) });
        for (const [topic, payload] of retained) if (message.subscriptions.some(s => matches(s.topic, topic))) send(socket, { cmd: 'publish', topic, payload, qos: 0, retain: true });
      } else if (message.cmd === 'unsubscribe') {
        clients.set(socket, clients.get(socket).filter(filter => !message.unsubscriptions.includes(filter)));
        send(socket, { cmd: 'unsuback', messageId: message.messageId });
      } else if (message.cmd === 'publish') {
        publish(message.topic, message.payload, message.retain);
        if (message.qos === 1) send(socket, { cmd: 'puback', messageId: message.messageId });
        if (message.qos === 2) send(socket, { cmd: 'pubrec', messageId: message.messageId });
      } else if (message.cmd === 'pubrel') send(socket, { cmd: 'pubcomp', messageId: message.messageId });
      else if (message.cmd === 'pingreq') send(socket, { cmd: 'pingresp' });
      else if (message.cmd === 'disconnect') socket.end();
    });
  });
  await new Promise((res, rej) => { server.once('error', rej); server.listen(19025, '127.0.0.1', res); });
  const saved = JSON.parse(await readFile(join(dirname(storageRoot), 'device-credentials.json'), 'utf8'));
  const streamId = randomUUID();
  let sequence = 0;
  const report = () => {
    sequence += 1;
    for (const device of saved.wago ?? []) {
      const base = { timestamp: new Date().toISOString(), streamId, sequence };
      const root = `attraccess/wago/v1/controllers/${device.hardwareId}`;
      publish(`${root}/heartbeat`, JSON.stringify({ ...base, hardwareId: device.hardwareId, protocolVersion: '1.0.0', runtimeVersion: '1.11.0', capabilities: ['claim', 'heartbeat', 'configuration-v1'] }), true);
      publish(`${root}/state`, JSON.stringify({ ...base, category: 'state', connected: true, revision: null, contentHash: null, outputs: { extraction: true, lighting: true }, inputs: { doorContact: true }, readiness: { hardwareAvailable: true } }), true);
    }
  };
  report();
  const timer = setInterval(report, 10000);
  return () => { clearInterval(timer); for (const socket of clients.keys()) socket.destroy(); server.close(); };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const storageRoot = join(toolRoot, '.runtime/storage');
  if (process.argv.includes('--install')) {
    await installPlugins(storageRoot);
    console.log('Staged Shelly, WAGO and RabbitMQ plugins in the dedicated film storage.');
  }
  if (process.argv.includes('--simulate')) {
    const ports = JSON.parse(await readFile(join(software, '.dev-serve-ports.json'), 'utf8'));
    const stopMqtt = await startMqttSimulator(storageRoot);
    const stopShelly = () => {}; // Existing guarded port-80 fixture is read-only; German flows use 19024.
    const stopDevices = await startDeviceSimulators(ports.api.url, storageRoot);
    const stop = () => { stopDevices(); stopMqtt(); stopShelly(); };
    process.on('SIGTERM', () => { stop(); process.exit(0); });
    process.on('SIGINT', () => { stop(); process.exit(0); });
    console.log('Local reader and Companion simulations connected.');
  }
}
