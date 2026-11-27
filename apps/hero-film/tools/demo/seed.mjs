#!/usr/bin/env node
// Seeds a fictional makerspace into an ISOLATED Attraccess database so the marketing site can show
// real product screenshots with believable data. Never point this at a real database.
//
// Usually run by refresh-screenshots.mjs. Standalone, after the API has started once against the demo
// storage root so migrations have created the schema:
//   ATTRACCESS_REPO=../Attraccess node scripts/seed-demo.mjs --storage ../Attraccess/storage/website-demo-en --locale en [--api http://localhost:3000]
import crypto from 'node:crypto';
import path from 'node:path';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// sqlite3 and bcrypt are native modules the Attraccess checkout already has; borrow them from there.
if (!process.env.ATTRACCESS_REPO) throw new Error('Set ATTRACCESS_REPO to a bootstrapped checkout of github.com/Attraccess/Attraccess');
const requireFromAttraccess = createRequire(path.join(path.resolve(process.env.ATTRACCESS_REPO), 'package.json'));
const sqlite3 = requireFromAttraccess('sqlite3').verbose();
const bcrypt = requireFromAttraccess('bcrypt');
const here = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_DIR = path.resolve(here, '../../../web/demo/images');
export const DEMO_PASSWORD = 'Demo1234!';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) out[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return out;
}

// Deterministic randomness so re-seeding produces the same screenshots.
let seed = 20261007;
function rand() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
const pick = (list) => list[Math.floor(rand() * list.length)];
const between = (min, max) => min + Math.floor(rand() * (max - min + 1));

const NOW = Date.now();
const MIN = 60_000;
const DAY = 24 * 60 * MIN;
const ts = (ms) => new Date(ms).toISOString().replace('T', ' ').replace('Z', '');

const PEOPLE = {
  en: [
    'Mia Chen', 'Priya Nair', 'Jordan Lee', 'Sam Rivera', 'Alex Morgan', 'Noah Brooks', 'Emma Walsh',
    'Leo Okafor', 'Hannah Kim', 'Ben Carter', 'Zoe Martin', 'Ethan Price', 'Ava Thompson', 'Lucas Silva',
    'Isla Murphy', 'Omar Haddad', 'Grace Liu', 'Felix Novak',
  ],
  de: [
    'Anna Becker', 'Jonas Weber', 'Mia Schneider', 'Lukas Fischer', 'Lea Wagner', 'Noah Hoffmann',
    'Emma Schulz', 'Elias Koch', 'Sofia Richter', 'Ben Klein', 'Hannah Wolf', 'Paul Neumann',
    'Clara Schwarz', 'Finn Zimmermann', 'Ida Krüger', 'Aylin Yılmaz', 'Mateo García', 'Greta Lang',
  ],
};

// Machine catalogue. `minutes` is the typical session length range; `weight` how popular it is.
const CATALOGUE = {
  en: {
    groups: [
      {key:'digital',name:'Digital fabrication',description:'Laser cutting, additive manufacturing and CNC machining.'},
      {key:'wood',name:'Woodshop',description:'Timber preparation and precision joinery.'},
      {key:'electronics',name:'Electronics lab',description:'Circuit assembly, measurement and inspection.'},
      {key:'access',name:'Shared spaces',description:'Teaching, collaboration and workshop access.'},
      {key:'workstations',name:'Workstations',description:'CAD and machine preparation computers.'},
    ],
    resources: [
      {key:'laser',group:'digital',name:'Trotec Speedy 400',image:'laser-cutter',description:'100 W CO₂ laser · 1,016 × 610 mm cutting bed.',minutes:[15,95],weight:9},
      {key:'printer',group:'digital',name:'Prusa MK4 · 01',image:'3d-printer',description:'PLA & PETG · 0.4 mm nozzle · Teaching prototypes.',minutes:[60,240],weight:8},
      {key:'prusa2',group:'digital',name:'Prusa MK4 · 02',image:'3d-printer',description:'Larger prototypes · 0.6 mm nozzle · PLA & PETG.',minutes:[45,250],weight:7},
      {key:'bambu',group:'digital',name:'Bambu Lab X1 Carbon',description:'Enclosed printing · Engineering polymers.',minutes:[40,260],weight:6},
      {key:'cnc',group:'digital',name:'CNC router',image:'cnc-router',description:'Three-axis routing · Spindle service in progress.',minutes:[45,180],weight:4},
      {key:'tablesaw',group:'wood',name:'Table saw',image:'table-saw',description:'Precision timber cuts · Annual refresher required.',minutes:[10,50],weight:5},
      {key:'bandsaw',group:'wood',name:'Band saw',description:'Curved cuts & resawing · Check blade guides.',minutes:[10,40],weight:4},
      {key:'solder',group:'electronics',name:'Soldering stations',image:'soldering-station',description:'Circuit assembly · Local fume extraction.',minutes:[20,120],weight:6},
      {key:'scope',group:'electronics',name:'Oscilloscope',description:'Four-channel measurement · Shared probe kit.',minutes:[20,90],weight:4},
      {key:'microscope',group:'electronics',name:'Microscope',description:'Stereo inspection · Fine-pitch electronics.',minutes:[15,60],weight:3},
      {key:'entrance',group:'access',name:'Workshop entrance',type:'door',description:'North Campus Prototyping Lab · Introduced users.',minutes:[1,1],weight:0},
      {key:'projectroom',group:'access',name:'Project room',description:'Team assembly, collaboration & teaching.',minutes:[30,150],weight:3},
      {key:'cad',group:'workstations',name:'CAD workstation · 01',description:'Windows CAD & laser preparation · Companion.',minutes:[20,180],weight:5},
      {key:'cad2',group:'workstations',name:'CAD workstation · 02',description:'Linux simulation & open-source design · Companion.',minutes:[20,160],weight:4},
    ],
    projects: [
      {image:'project-cargo-trailer',name:'Solar Boat 2027',description:'Lightweight hull, solar array mounts and embedded telemetry for the inter-university challenge.'},
      {image:'project-robotics-kit',name:'Formula Student',description:'Composite tooling, aerodynamic prototypes and control electronics for the campus racing team.'},
      {image:'project-escape-room',name:'Bioreactor',description:'Bench-scale culture monitoring, optical sensor housings and fluid-control research.'},
      {image:'project-repair-cafe',name:'Open Lab · Autumn 2026',description:'Hands-on teaching projects and repair sessions across the campus community.'},
    ],
    startNotes: ['Solar array mounting plates · 3 mm birch ply', 'Telemetry enclosure · revision C', 'Wing profile test pieces', 'Optical sensor housing batch', '', '', '', ''],
    endNotes: ['All good, cleaned up afterwards', 'Lens could use a clean soon', 'Ran out of PETG, refilled from storage', 'Perfect cut on first try', '', '', '', '', ''],
    maintenanceReasons: {
      active: 'Spindle bearing replacement and runout calibration. Service window: 13–16 October.',
      past: ['Mirror and lens cleaning', 'Belt tension check', 'Replaced nozzle and recalibrated first layer', 'Blade swap and fence alignment', 'Quarterly safety inspection'],
      request: 'Intermittent under-extrusion on the first layer. Please inspect the nozzle and extruder gears.',
      upcoming: 'Annual service by the manufacturer – tube and mirror check',
    },
    schedules: { thirty: 'Monthly optics clean', hundred: 'Every 100 laser hours', inspection: 'Quarterly safety inspection' },
    laserDocs: `## Before you start\n\n1. Turn on the **exhaust** (Attraccess does this automatically when you start a session).\n2. Check the material list – **no PVC, no vinyl**.\n3. Never leave the laser unattended while it is cutting.\n\n## Material settings\n\n| Material | Thickness | Speed | Power |\n| --- | --- | --- | --- |\n| Plywood | 3 mm | 20 mm/s | 65 % |\n| Plywood | 6 mm | 10 mm/s | 85 % |\n| Acrylic | 4 mm | 12 mm/s | 75 % |\n| Card | 1 mm | 60 mm/s | 30 % |`,
    form: { name: 'Session report', material: 'Material used', options: ['Plywood', 'Acrylic', 'Card', 'Leather'], ok: 'Machine left clean?' },
    flow: { fanOn: 'Exhaust fan on', fanOff: 'Exhaust fan off' },
  },
  de: {
    groups: [
      { key: 'digital', name: 'Digitale Fertigung', description: 'Laser, Drucker und die CNC. Slot buchen, Datei mitbringen.' },
      { key: 'wood', name: 'Holzwerkstatt', description: 'Sägen und Bohren. Schutzbrille auf, Haare zusammen.' },
      { key: 'metal', name: 'Metallwerkstatt', description: 'Drehen, Schleifen, Schweißen. Gehörschutz ist Pflicht.' },
      { key: 'electronics', name: 'Elektroniklabor', description: 'Löten, Messen und gelegentlich magischer Rauch.' },
      { key: 'textile', name: 'Textilecke', description: 'Nähen und Sticken für Kostüme, Taschen und Reparaturen.' },
      { key: 'access', name: 'Türen & Zugang', description: 'Zutritt zum Space, entsperrt mit deiner NFC-Karte.' },
    ],
    resources: [
      { key: 'laser', group: 'digital', name: 'Lasercutter', image: 'laser-cutter', description: '60-W-CO₂-Laser, 900 × 600 mm Arbeitsfläche. Holz und Acryl bis 8 mm.', minutes: [15, 90], weight: 9 },
      { key: 'printer', group: 'digital', name: '3D-Drucker (Prusa)', image: '3d-printer', description: 'FDM-Drucker mit 0,4-mm-Düse. Bitte nur PLA und PETG.', minutes: [60, 420], weight: 8 },
      { key: 'cnc', group: 'digital', name: 'CNC-Fräse', image: 'cnc-router', description: 'Portalfräse 1,2 × 1,2 m für Plattenware und Aluminium.', minutes: [45, 180], weight: 4 },
      { key: 'vinyl', group: 'digital', name: 'Schneideplotter', image: 'vinyl-cutter', description: 'Sticker, Schablonen und Flexfolie bis 60 cm Breite.', minutes: [10, 45], weight: 3 },
      { key: 'tablesaw', group: 'wood', name: 'Tischkreissäge', image: 'table-saw', description: 'Einweisung und jährliche Auffrischung erforderlich.', minutes: [10, 60], weight: 6 },
      { key: 'mitre', group: 'wood', name: 'Kappsäge', image: 'mitre-saw', description: 'Zug-Kapp-Gehrungssäge für Querschnitte bis 305 mm.', minutes: [5, 40], weight: 5 },
      { key: 'drill', group: 'wood', name: 'Standbohrmaschine', image: 'drill-press', description: 'Tischbohrmaschine mit Tiefenanschlag und Schraubstock.', minutes: [5, 30], weight: 4 },
      { key: 'lathe', group: 'metal', name: 'Drehbank', image: 'metal-lathe', description: 'Leit- und Zugspindeldrehbank, 1 m Spitzenweite. Erste Sessions unter Aufsicht.', minutes: [30, 150], weight: 3 },
      { key: 'solder', group: 'electronics', name: 'Lötstation', image: 'soldering-station', description: 'Temperaturgeregelte Station mit Absaugung.', minutes: [20, 120], weight: 5 },
      { key: 'sewing', group: 'textile', name: 'Nähmaschine', image: 'sewing-machine', description: 'Computer-Nähmaschine mit Obertransportfuß.', minutes: [30, 150], weight: 3 },
      { key: 'entrance', group: 'access', name: 'Haupteingang', type: 'door', description: 'Eingangstür der Werkstatt. Für Mitglieder rund um die Uhr offen.', minutes: [1, 1], weight: 0 },
      { key: 'storage', group: 'access', name: 'Materiallager', type: 'door', description: 'Abgeschlossener Raum mit Plattenmaterial und Verbrauchsmaterial.', minutes: [1, 1], weight: 0 },
    ],
    projects: [
      { image: 'project-cargo-trailer', name: 'Lastenrad-Anhänger', description: 'Ein Flatpack-Anhänger aus Sperrholz für den Gemeinschaftsgarten.' },
      { image: 'project-escape-room', name: 'Escape-Room-Requisiten', description: 'Rätsel, Schlösser und blinkende Kisten für den Herbst-Escape-Room.' },
      { image: 'project-repair-cafe', name: 'Repair Café', description: 'Monatliche Reparatur-Sessions. Kaputtes rein, Heiles raus.' },
      { image: 'project-robotics-kit', name: 'Schul-Robotik-Kit', description: 'Gelaserte Chassis und gelötete Controller für 30 Schüler:innen.' },
    ],
    startNotes: ['Seitenteile für den Anhänger', 'Testdruck für die Halterung', 'Untersetzer für den Tag der offenen Tür', '12 Gehäuse am Stück', '', '', '', ''],
    endNotes: ['Alles gut, aufgeräumt', 'Linse sollte bald gereinigt werden', 'PETG war leer, aus dem Lager nachgefüllt', 'Erster Schnitt sofort perfekt', '', '', '', '', ''],
    maintenanceReasons: {
      active: 'Spindellager wird getauscht. Freitag wieder da, versprochen.',
      past: ['Spiegel und Linse gereinigt', 'Riemenspannung geprüft', 'Düse getauscht und erste Schicht kalibriert', 'Sägeblatt getauscht, Anschlag ausgerichtet', 'Quartalsweise Sicherheitsprüfung'],
      request: 'Düse scheint verstopft – erste Schicht zieht Fäden.',
      upcoming: 'Jährlicher Herstellerservice – Röhre und Spiegel prüfen',
    },
    schedules: { thirty: 'Monatliche Optik-Reinigung', hundred: 'Alle 100 Laserstunden', inspection: 'Quartalsweise Sicherheitsprüfung' },
    laserDocs: `## Bevor du startest\n\n1. **Absaugung** einschalten (macht Attraccess automatisch, wenn du eine Sitzung startest).\n2. Materialliste prüfen – **kein PVC, kein Vinyl**.\n3. Den Laser beim Schneiden nie unbeaufsichtigt lassen.\n\n## Materialeinstellungen\n\n| Material | Stärke | Geschwindigkeit | Leistung |\n| --- | --- | --- | --- |\n| Sperrholz | 3 mm | 20 mm/s | 65 % |\n| Sperrholz | 6 mm | 10 mm/s | 85 % |\n| Acryl | 4 mm | 12 mm/s | 75 % |\n| Karton | 1 mm | 60 mm/s | 30 % |`,
    form: { name: 'Sitzungsbericht', material: 'Verwendetes Material', options: ['Sperrholz', 'Acryl', 'Karton', 'Leder'], ok: 'Maschine sauber hinterlassen?' },
    flow: { fanOn: 'Absaugung an', fanOff: 'Absaugung aus' },
  },
};

const run = (db, sql, params = []) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, function callback(error) {
      if (error) reject(new Error(`${error.message}\n  in: ${sql}`));
      else resolve(this);
    }),
  );
const get = (db, sql, params = []) =>
  new Promise((resolve, reject) => db.get(sql, params, (error, row) => (error ? reject(error) : resolve(row))));

async function insert(db, table, values) {
  const columns = Object.keys(values);
  const result = await run(
    db,
    `INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
    Object.values(values),
  );
  return result.lastID;
}

function slug(name) {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/[^a-z]+/g, '.');
}

async function seedUsers(db, people) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const roles = Object.fromEntries(
    await Promise.all(['user', 'administrator', 'resource-manager'].map(async (key) => [key, (await get(db, 'SELECT id FROM role WHERE key = ?', [key])).id])),
  );
  const users = [];
  for (const [index, fullName] of people.entries()) {
    const username = fullName;
    const createdAt = ts(NOW - between(30, 700) * DAY);
    const id = await insert(db, 'user', {
      username,
      email: `${slug(fullName)}@north-campus.example`,
      isEmailVerified: index === 7 ? 0 : 1,
      createdAt,
      updatedAt: createdAt,
      creditBalance: between(-5, 60) * 100,
    });
    await insert(db, 'authentication_detail', { userId: id, type: 'local_password', password: passwordHash });
    await insert(db, 'user_role', { userId: id, roleId: roles.user, source: 'manual' });
    if (index === 0 || index === 1) await insert(db, 'user_role', { userId: id, roleId: roles.administrator, source: 'manual' });
    if (index === 1 || index === 3) await insert(db, 'user_role', { userId: id, roleId: roles['resource-manager'], source: 'manual' });
    users.push({ id, username, fullName });
  }
  return users;
}

async function seedResources(db, catalogue, storageRoot) {
  const groups = {};
  for (const group of catalogue.groups) {
    groups[group.key] = await insert(db, 'resource_group', { name: group.name, description: group.description });
  }
  const resources = {};
  for (const resource of catalogue.resources) {
    const id = await insert(db, 'resource', {
      name: resource.name,
      description: resource.description,
      type: resource.type ?? 'machine',
      allowTakeOver: resource.key === 'printer' ? 1 : 0,
      retrainingMaxAgeDays: resource.key === 'tablesaw' ? 365 : null,
      retrainingBlocksAccess: resource.key === 'tablesaw' ? 1 : 0,
      supervisionMode: resource.key === 'lathe' ? 'supervision_allowed' : 'introduction_required',
      supervisedUsagesUntilIntroduction: resource.key === 'lathe' ? 3 : null,
      documentationType: resource.key === 'laser' ? 'markdown' : null,
      documentationMarkdown: resource.key === 'laser' ? catalogue.laserDocs : null,
    });
    await run(db, 'INSERT INTO resource_groups_resource_group (resourceId, resourceGroupId) VALUES (?, ?)', [id, groups[resource.group]]);
    if (resource.image) {
      const filename = `${resource.image}.jpg`;
      const target = path.join(storageRoot, 'cdn', 'resources', String(id), 'original');
      mkdirSync(target, { recursive: true });
      copyFileSync(path.join(IMAGE_DIR, filename), path.join(target, filename));
      await run(db, 'UPDATE resource SET imageFilename = ? WHERE id = ?', [filename, id]);
    }
    resources[resource.key] = { ...resource, id };
  }
  return { groups, resources };
}

async function seedProjects(db, projects, users, storageRoot) {
  const created = [];
  for (const [index, project] of projects.entries()) {
    const owner = users[(index * 3 + 2) % users.length];
    const filename = `${project.image}.jpg`;
    const id = await insert(db, 'project', { name: project.name, description: project.description, logo: filename, userId: owner.id, createdAt: ts(NOW - between(20, 90) * DAY) });
    mkdirSync(path.join(storageRoot, 'cdn', 'projects', String(id)), { recursive: true });
    copyFileSync(path.join(IMAGE_DIR, filename), path.join(storageRoot, 'cdn', 'projects', String(id), filename));
    // The demo admin (users[0]) is on every team so the projects page has something to show.
    const members = [owner, users[0], ...Array.from({ length: 3 }, () => pick(users))].filter((u, i, all) => all.indexOf(u) === i);
    for (const member of members.slice(1)) await insert(db, 'project_members', { projectId: id, userId: member.id });
    created.push({ id, members });
  }
  return created;
}

async function seedIntroductions(db, resources, users) {
  const tutors = [users[1], users[3], users[0]];
  const introduced = {};
  for (const resource of Object.values(resources)) {
    if (resource.type === 'door') continue;
    for (const tutor of tutors) {
      await insert(db, 'resource_introducer', { resourceId: resource.id, userId: tutor.id, type: 'introducer', grantedAt: ts(NOW - 400 * DAY) });
    }
    await insert(db, 'resource_introducer', { resourceId: resource.id, userId: users[5].id, type: 'maintainer', grantedAt: ts(NOW - 300 * DAY) });
    const count = Math.round(users.length * (0.45 + resource.weight / 25));
    const receivers = [users[0], ...[...users.slice(1)].sort(() => rand() - 0.5).slice(0, count - 1)];
    introduced[resource.key] = receivers;
    for (const receiver of receivers) {
      // The table saw has a yearly refresher, so a few introductions are deliberately overdue.
      const ageDays = resource.key === 'tablesaw' && receiver !== users[0] && rand() < 0.3 ? between(380, 520) : between(5, 330);
      const tutor = pick(tutors.filter((t) => t.id !== receiver.id));
      const completedAt = ts(NOW - ageDays * DAY);
      const introId = await insert(db, 'resource_introduction', { resourceId: resource.id, receiverUserId: receiver.id, tutorUserId: tutor.id, completedAt, createdAt: completedAt });
      await insert(db, 'resource_introduction_history_item', { introductionId: introId, action: 'grant', performedByUserId: tutor.id, createdAt: completedAt });
    }
  }
  return introduced;
}

async function seedUsage(db, catalogue, resources, introduced, projects) {
  // `user` indexes into the introduced list; index 0 is always the demo admin.
  const active = { laser: { user: 0, startedMinAgo: 14 }, printer: { user: 9, startedMinAgo: 136 }, solder: { user: 6, startedMinAgo: 18 } };
  const billing = { laser: { perUsage: 50, perMinute: 10 }, printer: { perUsage: 0, perMinute: 2 } };
  const admin = introduced.laser[0];
  let adminCharges = 0;
  for (const resource of Object.values(resources)) {
    const people = introduced[resource.key];
    if (!people?.length || !resource.weight) continue;
    // Walk backwards from now so sessions never overlap on one machine.
    let cursor = NOW - (active[resource.key] ? active[resource.key].startedMinAgo * MIN + 30 * MIN : between(60, 600) * MIN);
    const horizon = NOW - 28 * DAY;
    while (cursor > horizon) {
      const minutes = between(resource.minutes[0], resource.minutes[1]);
      const end = cursor;
      const start = end - minutes * MIN;
      const user = rand() < 0.22 ? people[0] : pick(people);
      const project = rand() < 0.8 ? projects.find((p) => p.members.some((m) => m.id === user.id)) : undefined;
      const usageId = await insert(db, 'resource_usage', {
        resourceId: resource.id,
        userId: user.id,
        startTime: ts(start),
        endTime: ts(end),
        startNotes: pick(catalogue.startNotes) || null,
        endNotes: pick(catalogue.endNotes) || null,
        usageAction: 'usage',
        projectId: project?.id ?? null,
        isFinalized: 1,
      });
      const rate = billing[resource.key];
      if (rate && user === admin) {
        const amount = rate.perUsage + rate.perMinute * minutes;
        adminCharges += amount;
        const transactionId = await insert(db, 'billing_transaction', { userId: user.id, amount: -amount, resourceUsageId: usageId, status: 'completed', createdAt: ts(end), updatedAt: ts(end) });
        if (rate.perUsage) await insert(db, 'billing_transaction_item', { billingTransactionId: transactionId, name: resource.name, unitPrice: rate.perUsage, quantity: 1 });
        await insert(db, 'billing_transaction_item', { billingTransactionId: transactionId, name: `${resource.name} · ${minutes} min`, unitPrice: rate.perMinute, quantity: minutes, durationMs: minutes * MIN });
      }
      // Busy machines get used several times a day, quiet ones every couple of days.
      cursor = start - between(20, Math.round((60 * 24 * 3) / resource.weight)) * MIN;
    }
    if (active[resource.key]) {
      const user = introduced[resource.key][active[resource.key].user % people.length];
      await insert(db, 'resource_usage', {
        resourceId: resource.id,
        userId: user.id,
        startTime: ts(NOW - active[resource.key].startedMinAgo * MIN),
        startNotes: resource.key === 'laser' ? catalogue.startNotes[0] : null,
        usageAction: 'usage',
        isFinalized: 1,
        projectId: resource.key === 'laser' ? projects[0].id : projects[1].id,
      });
    }
  }
  // Top-ups that keep the admin's balance positive.
  let balance = -adminCharges;
  // Four top-ups, rounded to 5 €, that leave the admin with a small positive balance.
  const topUp = Math.ceil((adminCharges + 4200) / 4 / 500) * 500;
  for (let i = 0; i < 4; i++) {
    const amount = topUp;
    balance += amount;
    await insert(db, 'billing_transaction', { userId: admin.id, amount, initiatorId: admin.id, status: 'completed', externalReference: `SUMUP-${4711 + i}`, createdAt: ts(NOW - (8 + i * 17) * DAY), updatedAt: ts(NOW - (8 + i * 17) * DAY) });
  }
  await run(db, 'UPDATE user SET creditBalance = ? WHERE id = ?', [balance, admin.id]);
  // Door events for the access log.
  for (const door of Object.values(resources).filter((r) => r.type === 'door')) {
    for (let i = 0; i < 40; i++) {
      const at = NOW - between(10, 60 * 24 * 20) * MIN;
      await insert(db, 'resource_usage', {
        resourceId: door.id,
        userId: pick(Object.values(introduced).flat()).id,
        startTime: ts(at),
        endTime: ts(at),
        usageAction: 'door.unlock',
        isFinalized: 1,
      });
    }
  }
}

async function seedMaintenance(db, catalogue, resources, users) {
  const maintainer = users[5];
  await insert(db, 'resource_maintenance', {
    resourceId: resources.cnc.id,
    startTime: ts(NOW - 2 * DAY),
    reason: catalogue.maintenanceReasons.active,
    createdByUserId: maintainer.id,
  });
  const schedules = [
    { resource: 'laser', name: catalogue.schedules.thirty, trigger: 'TIME_INTERVAL', table: 'resource_maintenance_schedule_time_interval_config', duration: 30, unit: 'DAYS' },
    { resource: 'laser', name: catalogue.schedules.hundred, trigger: 'USAGE_HOURS', table: 'resource_maintenance_schedule_usage_hours_config', duration: 100, unit: 'HOURS' },
    { resource: 'tablesaw', name: catalogue.schedules.inspection, trigger: 'TIME_INTERVAL', table: 'resource_maintenance_schedule_time_interval_config', duration: 90, unit: 'DAYS' },
    { resource: 'cnc', name: catalogue.schedules.inspection, trigger: 'TIME_INTERVAL', table: 'resource_maintenance_schedule_time_interval_config', duration: 90, unit: 'DAYS' },
  ];
  const scheduleIds = {};
  for (const schedule of schedules) {
    const scheduleId = await insert(db, 'resource_maintenance_schedule', {
      resourceId: resources[schedule.resource].id,
      name: schedule.name,
      triggerType: schedule.trigger,
      createdAt: ts(NOW - 200 * DAY),
    });
    await insert(db, schedule.table, { scheduleId, duration: schedule.duration, unit: schedule.unit });
    scheduleIds[schedule.resource] ??= scheduleId;
  }
  for (const key of ['laser', 'printer', 'tablesaw', 'cnc', 'bandsaw']) {
    for (let i = 0; i < 4; i++) {
      const start = NOW - (i * 31 + between(5, 20)) * DAY;
      await insert(db, 'resource_maintenance', {
        resourceId: resources[key].id,
        startTime: ts(start),
        endTime: ts(start + between(30, 240) * MIN),
        completedAt: ts(start + between(30, 240) * MIN),
        reason: pick(catalogue.maintenanceReasons.past),
        createdByUserId: maintainer.id,
        completedByUserId: maintainer.id,
        maintenanceScheduleId: i === 0 ? (scheduleIds[key] ?? null) : null,
      });
    }
  }
  const upcoming = NOW + 4 * DAY;
  await insert(db, 'resource_maintenance', {
    resourceId: resources.laser.id,
    startTime: ts(upcoming),
    endTime: ts(upcoming + 3 * 60 * MIN),
    reason: catalogue.maintenanceReasons.upcoming,
    createdByUserId: maintainer.id,
  });
  await insert(db, 'resource_maintenance_request', {
    resourceId: resources.printer.id,
    reason: catalogue.maintenanceReasons.request,
    createdByUserId: users[9].id,
    createdAt: ts(NOW - 5 * 60 * MIN),
  });
}

async function seedExtras(db, catalogue, resources, users) {
  await insert(db, 'resource_billing_configuration', { resourceId: resources.laser.id, creditsPerUsage: 50, creditsPerMinute: 10 });
  await insert(db, 'resource_billing_configuration', { resourceId: resources.printer.id, creditsPerUsage: 0, creditsPerMinute: 2 });
  const formId = await insert(db, 'form', { name: catalogue.form.name, resourceId: resources.laser.id, isRequiredOnResourceUsageEnd: 1 });
  await insert(db, 'form_field', { formId, name: catalogue.form.material, type: 'select', isRequired: 1, options: JSON.stringify(catalogue.form.options), position: 0 });
  await insert(db, 'form_field', { formId, name: catalogue.form.ok, type: 'boolean', isRequired: 1, position: 1 });
  for (const [index, user] of users.entries()) {
    const uid = crypto.createHash('sha256').update(user.username).digest('hex').slice(0, 14).toUpperCase();
    await insert(db, 'nfc_card', { uid, userId: user.id, isActive: index === 7 ? 0 : 1, keyNo: 1, key: crypto.randomBytes(16).toString('hex'), lastSeen: ts(NOW - between(1, 4000) * MIN) });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const locale = args.locale === 'de' ? 'de' : 'en';
  if (!args.storage) throw new Error('--storage <isolated storage root> is required');
  const storageRoot = path.resolve(String(args.storage));
  if (!storageRoot.endsWith('/hero-film/tools/demo/.runtime/storage')) throw new Error('Refusing to seed a storage root that is not a website demo root');
  const dbPath = path.join(storageRoot, 'attraccess.sqlite');
  if (!existsSync(dbPath)) throw new Error(`DB not found at ${dbPath}. Start the API once with STORAGE_ROOT=${storageRoot}.`);

  const catalogue = CATALOGUE[locale];
  const db = new sqlite3.Database(dbPath);
  let users;
  let resources;
  let projects;
  try {
    if ((await get(db, 'SELECT COUNT(*) AS n FROM resource')).n > 0) throw new Error('Demo DB already has resources – delete the storage root and start over.');
    await run(db, 'BEGIN');
    users = await seedUsers(db, PEOPLE[locale]);
    ({ resources } = await seedResources(db, catalogue, storageRoot));
    projects = await seedProjects(db, catalogue.projects, users, storageRoot);
    const introduced = await seedIntroductions(db, resources, users);
    await seedUsage(db, catalogue, resources, introduced, projects);
    await seedMaintenance(db, catalogue, resources, users);
    await seedExtras(db, catalogue, resources, users);
    await run(db, "UPDATE user SET locale = ?", [locale]);
    const {seedEvidence}=await import('./evidence.mjs');
    await seedEvidence({db,run,get,insert,storageRoot,resources,users,now:NOW,projects});
    await run(db, 'COMMIT');
  } catch (error) {
    await run(db, 'ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    db.close();
  }
  console.info(`Seeded ${users.length} members and ${Object.keys(resources).length} resources (${locale}).`);
  console.info('  demo login username: film.operator');
  if (args.api) {
    process.env.DEMO_ADMIN = users[0].username;
    const {seedIntegrations}=await import('./integrations.mjs');
    const integrationDb=new sqlite3.Database(dbPath);
    try{
      await seedIntegrations({db:integrationDb,run,get,insert,storageRoot,api:String(args.api),resources,users,now:NOW});
      const login=await fetch(`${args.api}/api/auth/session/local`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'mia.chen@north-campus.example',password:DEMO_PASSWORD,tokenLocation:'body'})});
      if(!login.ok)throw Error('API flow seed login failed: '+login.status);const {authToken}=await login.json();
      const all=(sql,params)=>new Promise((res,rej)=>integrationDb.all(sql,params,(e,rows)=>e?rej(e):res(rows)));
      const flowResources=await all('SELECT DISTINCT resourceId FROM resource_flow_node',[]);
      for(const {resourceId} of flowResources){
        const nodes=(await all('SELECT * FROM resource_flow_node WHERE resourceId = ?',[resourceId])).map(n=>({id:n.id,type:n.type,position:{x:n.positionX,y:n.positionY},data:JSON.parse(n.data)}));
        const edges=(await all('SELECT * FROM resource_flow_edge WHERE resourceId = ?',[resourceId])).map(e=>({id:e.id,source:e.source,target:e.target,sourceHandle:e.sourceHandle,targetHandle:e.targetHandle}));
        const response=await fetch(`${args.api}/api/resources/${resourceId}/flow`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${authToken}`},body:JSON.stringify({nodes,edges})});
        if(!response.ok)throw Error('API flow seed failed: '+response.status);const result=await response.json();if(result.validationErrors?.length)throw Error('Seed flow failed validation');
      }
      const {seedSupplementalEvidence}=await import('./evidence.mjs');await seedSupplementalEvidence({db:integrationDb,run,get,insert,resources,users,now:NOW,projects});
    }finally{integrationDb.close();}

    const {writeFileSync}=await import('node:fs');
    writeFileSync(path.join(here,'.runtime/fixture.json'),JSON.stringify({now:NOW,resources,users:users.map(({id,username})=>({id,username})),projects},null,2));
    console.info('  integrations and flows: configured');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
