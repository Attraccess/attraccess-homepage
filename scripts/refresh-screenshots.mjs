#!/usr/bin/env node
// One-shot pipeline for the marketing screenshots: for each locale, boot the real Attraccess app (from a
// local checkout of github.com/Attraccess/Attraccess) on a throw-away storage root, seed the demo
// makerspace, capture every screen in light and dark, shut down.
//
//   ATTRACCESS_REPO=../Attraccess pnpm screenshots [--locale en|de] [--only resources,kiosk]
//
// The checkout must be bootstrapped (`./scripts/setup-dev-dependencies.sh` there).
import { spawn } from 'node:child_process';
import { createWriteStream, existsSync, rmSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
if (!process.env.ATTRACCESS_REPO) throw new Error('Set ATTRACCESS_REPO to a bootstrapped checkout of github.com/Attraccess/Attraccess');
const attraccessRepo = path.resolve(process.env.ATTRACCESS_REPO);
if (!existsSync(path.join(attraccessRepo, 'scripts', 'dev-serve.mts'))) throw new Error(`${attraccessRepo} is not an Attraccess checkout`);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) out[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const locales = args.locale ? [String(args.locale)] : ['en', 'de'];
const ADMIN = { en: 'alex.morgan', de: 'anna.becker' };

function runNode(script, scriptArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(here, script), ...scriptArgs], {
      stdio: 'inherit',
      env: { ...process.env, ATTRACCESS_REPO: attraccessRepo },
    });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${script} exited with ${code}`))));
  });
}

/** Stops the whole `pnpm serve` process group and waits until it has exited. */
async function stopServers(child) {
  if (child.exitCode !== null) return;
  const exited = new Promise((resolve) => child.once('exit', resolve));
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
  await Promise.race([exited, new Promise((r) => setTimeout(r, 15_000))]);
}

/** Starts `pnpm serve` and resolves with the URLs printed in its banner once the API answers. */
function startServers(storageRoot) {
  return new Promise((resolve, reject) => {
    const child = spawn('pnpm', ['serve'], {
      cwd: attraccessRepo,
      env: { ...process.env, STORAGE_ROOT: storageRoot },
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: true,
    });
    // Full server output goes to a log next to the demo database; the banner is parsed from memory.
    const logPath = path.join(storageRoot, 'serve.log');
    const logFile = createWriteStream(logPath);
    let output = '';
    let urls;
    const timeout = setTimeout(() => {
      void stopServers(child);
      reject(new Error(`Dev servers did not come up within 5 minutes, see ${logPath}`));
    }, 300_000);
    const onData = async (chunk) => {
      logFile.write(chunk);
      output += chunk;
      if (!urls) {
        const api = output.match(/API\s+→\s+(http:\/\/\S+)/)?.[1];
        const frontend = output.match(/Frontend\s+→\s+(http:\/\/\S+)/)?.[1];
        if (api && frontend) {
          urls = { api, frontend };
          for (;;) {
            try {
              const [apiRes, webRes] = await Promise.all([fetch(`${api}/api/info`), fetch(frontend)]);
              if (apiRes.status < 500 && webRes.ok) break;
            } catch {
              // still booting
            }
            await new Promise((r) => setTimeout(r, 2000));
          }
          clearTimeout(timeout);
          resolve({ ...urls, stop: () => stopServers(child) });
        }
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.once('exit', (code) => reject(new Error(`pnpm serve exited early (${code}), see ${logPath}`)));
  });
}

for (const locale of locales) {
  // Inside the checkout's gitignored storage/ folder, next to (never inside) its regular dev database.
  const storageRoot = path.join(attraccessRepo, 'storage', `website-demo-${locale}`);
  rmSync(storageRoot, { recursive: true, force: true });
  mkdirSync(storageRoot, { recursive: true });
  console.info(`\n▶ ${locale}: booting Attraccess on ${storageRoot}`);
  const servers = await startServers(storageRoot);
  try {
    await runNode('seed-demo.mjs', ['--storage', storageRoot, '--locale', locale, '--api', servers.api]);
    const captureArgs = ['--url', servers.frontend, '--locale', locale, '--user', ADMIN[locale]];
    if (args.only) captureArgs.push('--only', String(args.only));
    await runNode('capture-screenshots.mjs', captureArgs);
  } finally {
    await servers.stop();
  }
}
await runNode('optimize-screenshots.mjs', []);
await runNode('generate-og.mjs', []);
