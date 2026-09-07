import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { createServer } from "vite";

const origin = "http://127.0.0.1:4193";
const chapters = {
  system: "overview", loop: "identify", permissions: "evaluate", release: "apply",
  sessions: "record", operations: "connect", pilot: "pilot",
};
const machines = { "Table saw": "table-saw", Bandsaw: "bandsaw", "CNC router": "cnc" };
const variants = {
  identify: ["identified", "supervision"], evaluate: ["checked", "submitted"],
  apply: ["automation"], record: ["cleaned", "form", "form-checked", "confirmed"], connect: ["reported", "active", "resolved"],
};
const posters = [...Object.values(chapters), ...Object.values(machines), ...Object.entries(variants).flatMap(([view, states]) => states.map((state) => `${view}-${state}`))];
const rendererModule = /\/(?:WorkshopScene\.tsx|scene-model\.ts|three[./_-])/;
const supervisionImage = "/reader-ui/firmware-theme-supervision.png";
const actionSelector = (name) => `[data-action="${name}"]`;
let server, browser, cacheDir, story;

before(async () => {
  cacheDir = await mkdtemp(join(tmpdir(), "attraccess-workshop-test-"));
  server = await createServer({
    root: fileURLToPath(new URL("..", import.meta.url)), cacheDir, logLevel: "error",
    server: { host: "127.0.0.1", port: 4193, strictPort: true, hmr: false, watch: null },
  });
  await server.listen();
  story = await server.ssrLoadModule("/src/components/workshop/story.ts");
  // The bundled shell avoids stalled animation-frame delivery in full headless Chrome on macOS.
  browser = await puppeteer.launch({
    headless: "shell", executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader"],
  });
});

after(async () => {
  try { await browser?.close(); }
  finally {
    try { await server?.close(); }
    finally { if (cacheDir) await rm(cacheDir, { recursive: true, force: true }); }
  }
});

async function openPage(t, { width = 1440, height = 900, language = "en", mode = "reduced", theme = "light", osDark = false, blockThemeStorage = false, gateTextures = false } = {}) {
  const context = await browser.createBrowserContext();
  const errors = [], requests = [], networkWrites = [], heldTextures = [];
  let holdTextures = gateTextures;
  const releaseTextures = async () => {
    holdTextures = false;
    await Promise.all(heldTextures.splice(0).map((request) => request.continue()));
  };
  t.after(async () => {
    try { await releaseTextures(); }
    finally {
      await context.close();
      assert.deepEqual(networkWrites, [], "Demo forms must stay local; newsletter/contact must never be submitted");
      assert.deepEqual(errors, [], "Unexpected browser JavaScript/console errors");
    }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width < 761, hasTouch: width < 761 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: mode === "reduced" ? "reduce" : "no-preference" },
    { name: "prefers-color-scheme", value: osDark ? "dark" : "light" },
  ]);
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (mode === "webgl-failure" && /^THREE\.WebGLRenderer: Error creating WebGL context\.$/.test(message.text())) return;
    errors.push(message.text());
  });
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    requests.push(request.url());
    if (!["GET", "HEAD"].includes(request.method())) {
      networkWrites.push(`${request.method()} ${request.url()}`);
      void request.abort();
    } else if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== origin) {
      // External fonts/analytics are inert. No form request ever leaves this browser.
      void request.respond({ status: 200, contentType: request.resourceType() === "stylesheet" ? "text/css" : "text/plain", body: "" });
    } else if (mode === "texture-failure" && new URL(request.url()).pathname === supervisionImage) {
      void request.respond({ status: 200, contentType: "image/png", body: "invalid image bytes" });
    } else if (holdTextures && [supervisionImage, "/logo.png"].includes(new URL(request.url()).pathname)) heldTextures.push(request);
    else void request.continue();
  });
  const seed = await page.evaluateOnNewDocument((language, theme) => {
    localStorage.setItem("language", language);
    if (theme !== null) localStorage.setItem("theme", theme);
  }, language, theme);
  await page.evaluateOnNewDocument((mode, blockThemeStorage) => {
    if (mode === "prerender") window.__PRERENDER__ = true;
    if (mode === "save-data") Object.defineProperty(navigator, "connection", { value: { saveData: true } });
    if (blockThemeStorage) {
      // Isolate theme persistence failures from unrelated language preferences.
      for (const method of ["getItem", "setItem"]) {
        const original = Storage.prototype[method];
        Storage.prototype[method] = function (key, ...args) {
          if (key === "theme") throw new DOMException("Theme storage denied", "SecurityError");
          return original.call(this, key, ...args);
        };
      }
    }
    if (mode === "webgl-failure") {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return /webgl/i.test(type) ? null : getContext.call(this, type, ...args);
      };
    }
    window.workshopSubmits = [];
    document.addEventListener("submit", (event) => {
      window.workshopSubmits.push(event.target.closest("[data-testid]")?.dataset.testid ?? "non-demo");
    }, true);
    if (mode === "live") {
      window.workshopDraws = 0;
      window.workshopTextures = [];
      for (const context of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
        if (!context) continue;
        for (const method of ["drawArrays", "drawElements", "drawArraysInstanced", "drawElementsInstanced", "texImage2D", "texSubImage2D"]) {
          const original = context.prototype[method];
          if (!original) continue;
          context.prototype[method] = function (...args) {
            if (method.startsWith("tex")) {
              const image = args.find((value) => value instanceof HTMLImageElement);
              if (image) window.workshopTextures.push({ path: new URL(image.src).pathname, width: image.naturalWidth, height: image.naturalHeight });
            } else window.workshopDraws++;
            return original.apply(this, args);
          };
        }
      }
    }
  }, mode, blockThemeStorage);
  await page.goto(origin, { waitUntil: gateTextures ? "domcontentloaded" : "networkidle0" });
  await page.removeScriptToEvaluateOnNewDocument(seed.identifier);
  await page.waitForSelector("#workshop-title", { visible: true });
  return { page, requests, releaseTextures };
}

async function imageLoaded(page, selector) {
  await page.waitForFunction((selector) => {
    const image = document.querySelector(selector);
    return image?.complete;
  }, {}, selector);
  const image = await page.$eval(selector, (image) => ({ src: image.getAttribute("src"), width: image.naturalWidth, height: image.naturalHeight }));
  assert.ok(image.width > 0 && image.height > 0, `Image failed to decode: ${JSON.stringify(image)}`);
}

async function sceneState(page, key, live = false) {
  await page.waitForSelector(`.workshop-stage[data-story-state="${key}"]`);
  await page.waitForSelector(`.workshop-poster[src="/workshop/${key}.webp"]`);
  await imageLoaded(page, ".workshop-poster");
  if (live) {
    const view = Object.values(chapters).find((view) => key === view || key.startsWith(`${view}-`)) ?? key;
    await page.waitForSelector(`.workshop-visual.is-ready .workshop-canvas[data-view="${view}"][data-story="${key}"][data-settled="true"] canvas`, { visible: true });
  } else {
    assert.equal(await page.$("canvas"), null);
    assert.equal(await page.$eval(".workshop-poster", (image) => getComputedStyle(image).visibility), "visible");
    assert.equal(await page.$eval(".workshop-motion", (button) => button.getAttribute("aria-pressed")), "true");
  }
}

async function closeMobileDemo(page) {
  await page.locator('.workshop-mobile-dialog__header button[aria-label]').click();
  await page.waitForSelector('.workshop-mobile-dialog', { hidden: true });
}

async function chapter(page, anchor, { preview = true } = {}) {
  const mobile = await page.evaluate(() => innerWidth <= 760);
  if (mobile && await page.$('.workshop-mobile-dialog')) await closeMobileDemo(page);
  if (mobile) await page.select(".workshop-chapters select", String(Object.keys(chapters).indexOf(anchor)));
  else await page.locator(`.workshop-chapters__links a[href="#${anchor}"]`).click();
  try {
    await page.waitForFunction((anchor) => location.hash === `#${anchor}` && document.querySelector(`.workshop-chapters a[href="#${anchor}"]`)?.getAttribute("aria-current") === "step", {}, anchor);
  } catch (cause) {
    const state = await page.evaluate(() => ({ hash: location.hash, scrollY, selected: document.querySelector(".workshop-chapters select").value, chapter: document.querySelector(".workshop-stage")?.dataset.chapterView }));
    throw new Error(`Chapter navigation to #${anchor} failed: ${JSON.stringify(state)}`, { cause });
  }
  if (mobile && preview) {
    await page.locator(`#${anchor} .workshop-mobile-preview`).click();
    await page.waitForSelector('.workshop-mobile-dialog', { visible: true });
    assert.equal(await page.$$eval('.workshop-stage', (elements) => elements.length), 1);
    assert.equal(await page.$$eval('.workshop-mobile-dialog .demo-workflow', (elements) => elements.length), ['system', 'pilot'].includes(anchor) ? 0 : 1);
    assert.equal(await page.$('.workshop-mobile-dialog a[href^="http"]'), null);
    assert.doesNotMatch(await page.$eval('.workshop-mobile-dialog', (element) => element.textContent), /github|pull request|issuecomment|\b\S+\.tsx\b/i);
  }
}

async function activate(page, name, key, { live = false, touch = false } = {}) {
  const selector = actionSelector(name);
  await page.waitForSelector(selector, { visible: true });
  // Scroll the controls pane on mobile without moving its independent illustration.
  await page.$eval(selector, (element) => element.scrollIntoView({ behavior: "instant", block: "end" }));
  if (touch) assert.ok(await page.$eval(selector, (element) => (element.labels?.[0] ?? element).getBoundingClientRect().height >= 44), `${name} needs a 44px touch target`);
  const draws = live ? await page.evaluate(() => window.workshopDraws) : 0;
  if (touch) await page.tap(selector);
  else await page.click(selector);
  if (key) {
    await sceneState(page, key, live);
    if (live) assert.ok(await page.evaluate((draws) => window.workshopDraws > draws, draws), `${name} must redraw the scene, not only update HTML`);
  }
}

async function noRendererRequests(page, requests) {
  await page.waitForNetworkIdle({ idleTime: 200 });
  assert.deepEqual(requests.filter((url) => rendererModule.test(url)), [], "Static pages must not download Three.js or the workshop renderer");
  assert.equal(await page.$("canvas"), null);
}

async function noOverflow(page) {
  const result = await page.evaluate(() => ({
    viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth,
    clipped: [...document.querySelectorAll("main, section, article, form, input, select, button, .workshop-cue, .workshop-machines")]
      .filter((element) => {
        const box = element.getBoundingClientRect();
        return box.width && (box.left < -1 || box.right > innerWidth + 1);
      }).map((element) => `${element.tagName.toLowerCase()}.${element.className}`),
  }));
  assert.ok(result.document <= result.viewport + 1 && result.body <= result.viewport + 1, JSON.stringify(result));
  assert.deepEqual(result.clipped, [], `Clipped controls at ${result.viewport}px`);
}

async function fillText(page, selector, value) {
  // Native input events also clear React-controlled fields; assigning an empty value does not.
  await page.$eval(selector, (input) => { input.focus(); input.select(); });
  await page.keyboard.press("Backspace");
  if (value) await page.keyboard.sendCharacter(value);
}

async function prepareReport(page, options = {}) {
  await activate(page, "open-report", null, options);
  const reason = actionSelector("problem-reason"), submit = actionSelector("report-problem");
  assert.deepEqual(await page.$eval(reason, (input) => [input.minLength, input.maxLength, input.required]), [3, 2000, true]);
  for (const invalid of ["", "ab", "  x  "]) {
    await fillText(page, reason, invalid);
    await page.waitForFunction((selector) => document.querySelector(selector).disabled, {}, submit);
    assert.equal(await page.$eval(submit, (button) => button.disabled), true, `Invalid trimmed reason: ${JSON.stringify(invalid)}`);
  }
  await fillText(page, reason, "x".repeat(2000));
  await page.keyboard.type("x");
  assert.equal(await page.$eval(reason, (input) => input.value.length), 2000, "Typing cannot exceed the reason limit");
  await page.waitForFunction((selector) => !document.querySelector(selector).disabled, {}, submit);
  await activate(page, "cancel-report", null, options);
  await sceneState(page, "connect", options.live);
  assert.equal(await page.$(".demo-form"), null);
  await activate(page, "open-report", null, options);
  await fillText(page, reason, "Blade chipped during inspection");
  await page.waitForFunction((selector) => !document.querySelector(selector).disabled, {}, submit);
}

const workflows = {
  "NFC identifies without starting use; supervision uses the actual firmware PNG": async (page, options) => {
    await chapter(page, "loop");
    await sceneState(page, "identify", options.live);
    await activate(page, "tap-card", "identify-identified", options);
    assert.match(await page.$eval('[data-testid="demo-identify"] [role="status"]', (element) => element.innerText), /hasn't started a session|startet noch keine Nutzung/i);
    assert.equal(await page.$eval('[data-testid="demo-identify"] .demo-reader', (element) => element.lang), "de");
    assert.match(await page.$eval('[data-testid="demo-identify"] .demo-reader', (element) => element.innerText), /Lea/);
    await activate(page, "next-permissions");
    await sceneState(page, "evaluate", options.live);
    assert.equal(await page.$eval(actionSelector("submit-check"), (button) => button.disabled), true);
    await chapter(page, "loop");
    await sceneState(page, "identify-identified", options.live);
    await activate(page, "show-supervision", "identify-supervision", options);
    const image = `[data-testid="demo-identify"] img[src="${supervisionImage}"]`;
    await page.$eval(image, (element) => element.scrollIntoView({ behavior: "instant", block: "end" }));
    await imageLoaded(page, image);
    assert.deepEqual(await page.$eval(image, (image) => [image.naturalWidth, image.naturalHeight]), [480, 480]);
    if (options.live) assert.ok(await page.evaluate((path) => window.workshopTextures.some((image) => image.path === path && image.width === 480 && image.height === 480), supervisionImage), "The actual supervision PNG must reach the GPU, not just the HTML example");
    assert.match(await page.$eval('[data-testid="demo-identify"] .demo-capture', (element) => element.innerText), /Alex/);
    assert.equal(await page.$('[data-testid="demo-identify"] [data-action="next-permissions"]'), null, "A supervision prompt must not approve usage");
    await activate(page, "reset-identity", "identify", options);
  },
  "preflight requires a deliberate answer and local submit": async (page, options) => {
    await chapter(page, "permissions");
    await sceneState(page, "evaluate", options.live);
    const check = actionSelector("check-accessory"), submit = actionSelector("submit-check");
    assert.deepEqual(await page.$eval(check, (input) => [input.checked, input.required, input.type]), [false, true, "checkbox"]);
    assert.equal(await page.$eval(submit, (button) => button.disabled), true);
    await activate(page, "check-accessory", "evaluate-checked", options);
    assert.equal(await page.$eval(submit, (button) => button.disabled), false);
    await activate(page, "check-accessory", "evaluate", options);
    assert.equal(await page.$eval(submit, (button) => button.disabled), true);
    await activate(page, "check-accessory", "evaluate-checked", options);
    await activate(page, "submit-check", "evaluate-submitted", options);
    assert.ok(await page.evaluate(() => window.workshopSubmits.includes("demo-evaluate")));
    assert.equal(await page.$(check), null);
    await activate(page, "next-release");
    await sceneState(page, "apply", options.live);
    await chapter(page, "permissions");
    await sceneState(page, "evaluate-submitted", options.live);
    await activate(page, "reset-check", "evaluate", options);
  },
  "configured extraction control can be enabled and disabled independently": async (page, options) => {
    await chapter(page, "release");
    await sceneState(page, "apply", options.live);
    assert.equal(await page.$eval(actionSelector("toggle-automation"), (input) => input.checked), false);
    await activate(page, "toggle-automation", "apply-automation", options);
    assert.match(await page.$eval('.demo-flow[data-enabled="true"]', (element) => element.innerText), /starting a session.*signal.*extraction|Sitzungsstart.*Einschaltsignal.*Absaugung/s);
    assert.match(await page.$eval('[data-testid="demo-apply"] .demo-reader', (element) => element.innerText), /Lea.*00:18:42/s);
    await activate(page, "toggle-automation", "apply", options);
    assert.equal(await page.$eval(".demo-flow", (element) => element.dataset.enabled), "false");
  },
  "cleanup is not a handoff answer; only confirmed forms create the usage record": async (page, options) => {
    await chapter(page, "sessions");
    await sceneState(page, "record", options.live);
    await activate(page, "clean-workspace", "record-cleaned", options);
    assert.equal(await page.$('[data-testid="demo-usage-record"]'), null);
    assert.equal(await page.$(actionSelector("handoff-answer")), null);
    await activate(page, "end-session", "record-form", options);
    assert.equal(await page.$eval(actionSelector("handoff-answer"), (input) => input.checked), false);
    assert.equal(await page.$eval(actionSelector("confirm-handoff"), (button) => button.disabled), true);
    await activate(page, "handoff-answer", null, options);
    await sceneState(page, "record-form-checked", options.live);
    assert.equal(await page.$eval(actionSelector("confirm-handoff"), (button) => button.disabled), false);
    await activate(page, "confirm-handoff", "record-confirmed", options);
    assert.ok(await page.evaluate(() => window.workshopSubmits.includes("demo-record")));
    const record = await page.$eval('[data-testid="demo-usage-record"]', (element) => element.innerText);
    assert.match(record, /Lea/);
    assert.match(record, /18:42/);
    assert.match(record, /Zubeh(?:oe|\u00f6)r gepr(?:ue|\u00fc)ft/);
    assert.match(record, /Arbeitsplatz sauber hinterlassen/);
    assert.equal(await page.$$eval('.demo-record-fields > div', (fields) => fields.length), 4);
    await activate(page, "reset-handoff", "record", options);
    await activate(page, "clean-workspace", "record-cleaned", options);
    await activate(page, "end-session", "record-form", options);
    assert.equal(await page.$eval(actionSelector("handoff-answer"), (input) => input.checked), false, "Reset must clear the person's previous answer");
    assert.equal(await page.$eval(actionSelector("confirm-handoff"), (button) => button.disabled), true);
    await activate(page, "reset-handoff", "record", options);
  },
  "reporting does not block use; only active maintenance does, followed by repair completion": async (page, options) => {
    await chapter(page, "operations");
    await sceneState(page, "connect", options.live);
    await prepareReport(page, options);
    await activate(page, "report-problem", "connect-reported", options);
    assert.ok(await page.evaluate(() => window.workshopSubmits.includes("demo-connect")));
    assert.match(await page.$eval('[data-testid="demo-connect"] [role="status"]', (element) => element.innerText), /not.*blocked|nicht.*gesperrt/i);
    assert.equal(await page.$eval(".workshop-cue", (element) => element.dataset.tone), "normal");
    assert.equal(await page.$eval(".demo-reason", (element) => element.innerText), "Blade chipped during inspection");
    assert.equal(await page.$(actionSelector("complete-maintenance")), null);
    await activate(page, "start-maintenance", "connect-active", options);
    assert.equal(await page.$eval(".workshop-cue", (element) => element.dataset.tone), "danger");
    assert.match(await page.$eval('[data-testid="demo-connect"] [role="status"]', (element) => element.innerText), /blocked|gesperrt/i);
    await activate(page, "complete-maintenance", "connect-resolved", options);
    assert.equal(await page.$eval(".workshop-cue", (element) => element.dataset.tone), "normal");
    assert.match(await page.$eval('[data-testid="demo-connect"] [role="status"]', (element) => element.innerText), /available again|wieder/i);
    await activate(page, "reset-maintenance", "connect", options);
    assert.equal(await page.$(".demo-reason"), null);
  },
};

test("report form validates native typing and cancellation without changing availability", { timeout: 45000 }, async (t) => {
  const { page, requests } = await openPage(t);
  await chapter(page, "operations");
  await prepareReport(page);
  await activate(page, "cancel-report");
  assert.equal(await page.$eval(".demo-web", (element) => element.dataset.state), "observed");
  assert.deepEqual(await page.evaluate(() => window.workshopSubmits), []);
  await noRendererRequests(page, requests);
});

test("story reducer guards skipped transitions and resets only the relevant example", () => {
  const { initialStory, storyReducer: reduce } = story;
  const initial = Object.freeze({ ...initialStory });
  assert.deepEqual(initial, { identity: "locked", preflight: "pending", handoff: "dirty", handoffAnswer: false, maintenance: "observed", automation: false });
  for (const action of ["submit-check", "end-session", "answer-handoff", "confirm-handoff", "start-maintenance", "complete-maintenance"]) assert.strictEqual(reduce(initial, action), initial, `${action} needs its prerequisite`);
  for (const [field, actions, states, reset] of [
    ["identity", ["tap-card", "show-supervision"], ["identified", "supervision"], "reset-identity"],
    ["preflight", ["check-accessory", "submit-check"], ["checked", "submitted"], "reset-check"],
    ["handoff", ["clean-workspace", "end-session", "answer-handoff", "confirm-handoff"], ["cleaned", "form", "form", "confirmed"], "reset-handoff"],
    ["maintenance", ["report-problem", "start-maintenance", "complete-maintenance"], ["reported", "active", "resolved"], "reset-maintenance"],
  ]) {
    let state = Object.freeze({ ...initial, automation: true });
    for (const [index, action] of actions.entries()) {
      state = Object.freeze(reduce(state, action));
      assert.deepEqual(state, { ...initial, automation: true, [field]: states[index], handoffAnswer: field === "handoff" && index >= 2 });
      if (field === "handoff" && index === 1) assert.strictEqual(reduce(state, "confirm-handoff"), state, "Cleanup alone must not submit the human's answer");
      if (field === "maintenance" && index === 0) assert.strictEqual(reduce(state, "complete-maintenance"), state, "A report cannot skip directly to completed maintenance");
    }
    assert.deepEqual(reduce(state, reset), { ...initial, automation: true });
  }
  assert.deepEqual(reduce(reduce(initial, "toggle-automation"), "toggle-automation"), initial);
});

test("poster keys cover exactly the 22 loaded story illustrations, not obsolete permission scenarios", { timeout: 130000 }, async () => {
  const { initialStory, posterKey } = story;
  const keys = [...Object.values(chapters), ...Object.values(machines)].map((view) => posterKey(view, initialStory));
  for (const [view, field] of [["identify", "identity"], ["evaluate", "preflight"], ["record", "handoff"], ["connect", "maintenance"]]) {
    for (const state of variants[view]) {
      const key = posterKey(view, { ...initialStory, [field]: state === "form-checked" ? "form" : state, handoffAnswer: state === "form-checked" });
      assert.equal(key, `${view}-${state}`);
      keys.push(key);
    }
  }
  keys.push(posterKey("apply", { ...initialStory, automation: true }));
  assert.equal(new Set(keys).size, 22);
  assert.deepEqual(keys.sort(), [...posters].sort());
  for (const view of Object.values(machines)) assert.equal(posterKey(view, { identity: "supervision", preflight: "submitted", handoff: "confirmed", maintenance: "active", automation: true }), view);
  // The independent poster generator may still be writing. Never accept Vite's HTML fallback as an image.
  let missing = posters;
  const deadline = Date.now() + 120000;
  while (missing.length) {
    const results = await Promise.all(missing.map(async (key) => {
      const response = await fetch(`${origin}/workshop/${key}.webp`);
      const bytes = Buffer.from(await response.arrayBuffer());
      return response.ok && /image\/webp/.test(response.headers.get("content-type") || "") && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" && bytes.readUInt32LE(4) + 8 === bytes.length ? null : key;
    }));
    missing = results.filter(Boolean);
    assert.ok(!missing.length || Date.now() < deadline, `Posters unavailable after 120s: ${missing.join(", ")}`);
    if (missing.length) await delay(500);
  }
});

test("unrelated examples cannot change the scene behind an unchanged poster key", () => {
  const { initialStory, sceneStory, posterKey } = story;
  const otherSteps = { ...initialStory, automation: true, maintenance: "active" };
  assert.equal(posterKey("record", otherSteps), "record");
  assert.deepEqual(sceneStory("record", otherSteps), initialStory);
  assert.equal(posterKey("pilot", otherSteps), "pilot");
  assert.deepEqual(sceneStory("pilot", otherSteps), initialStory);
  const confirmedAnswer = { ...otherSteps, handoff: "form", handoffAnswer: true };
  assert.equal(posterKey("record", confirmedAnswer), "record-form-checked");
  assert.deepEqual(sceneStory("record", confirmedAnswer), { ...initialStory, handoff: "form", handoffAnswer: true });
});

test("live owner story: texture readiness, causal scene changes and route cleanup", { timeout: 240000 }, async (t) => {
  const { page, requests, releaseTextures } = await openPage(t, { mode: "live", gateTextures: true });
  await t.test("waits for real local textures, renders finite geometry and then stops drawing", async () => {
    try {
      await page.waitForSelector(".workshop-canvas canvas");
      assert.equal(await page.$(".workshop-visual.is-ready"), null, "A texture-incomplete scene is not ready");
      assert.notEqual(await page.$eval(".workshop-canvas", (element) => element.dataset.settled), "true");
    } finally { await releaseTextures(); }
    await sceneState(page, "overview", true);
    assert.ok(requests.includes(`${origin}${supervisionImage}`));
    const textures = await page.evaluate(() => window.workshopTextures);
    assert.ok(textures.some((image) => image.path === "/logo.png" && image.width > 0), "The brand mascot must reach the GPU");
    assert.ok(await page.$eval(".workshop-canvas canvas", (canvas) => [canvas.width, canvas.height, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height].every((value) => Number.isFinite(value) && value > 0)));
    assert.match(await page.$eval("canvas", (canvas) => getComputedStyle(canvas).touchAction), /pan-y/);
    const counts = await page.evaluate(async () => {
      const samples = [];
      for (let frame = 0; frame < 12; frame++) { await new Promise(requestAnimationFrame); samples.push(window.workshopDraws); }
      return samples;
    });
    assert.ok(counts[0] > 0);
    assert.equal(new Set(counts).size, 1, "A settled scene must not keep drawing");
  });
  await t.test("machine inspection is limited to overview/pilot and scrolling drives chapters", async () => {
    for (const [name, key] of Object.entries(machines)) {
      await page.locator(`.workshop-machines button::-p-text(${name})`).click();
      await sceneState(page, key, true);
      assert.equal(await page.$eval(`.workshop-machines button::-p-text(${name})`, (button) => button.getAttribute("aria-pressed")), "true");
      assert.match(await page.$eval(".workshop-cue", (element) => element.innerText), new RegExp(name));
    }
    await page.$eval("#loop", (section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
    await sceneState(page, "identify", true);
    assert.equal(new URL(page.url()).hash, "", "Ordinary scrolling does not require hash navigation");
    for (const [anchor, view] of Object.entries(chapters)) {
      await chapter(page, anchor);
      await sceneState(page, view, true);
      assert.equal(Boolean(await page.$(".workshop-machines")), ["overview", "pilot"].includes(view));
    }
  });
  for (const [name, run] of Object.entries(workflows)) await t.test(name, () => run(page, { live: true }));
  await t.test("inspection is neutral without erasing the underlying maintenance story", async () => {
    await chapter(page, "operations");
    if (await page.$(actionSelector("cancel-report"))) await activate(page, "cancel-report");
    if (await page.$(actionSelector("reset-maintenance"))) await activate(page, "reset-maintenance", "connect", { live: true });
    await activate(page, "open-report");
    await fillText(page, actionSelector("problem-reason"), "Inspection report");
    await activate(page, "report-problem", "connect-reported", { live: true });
    await activate(page, "start-maintenance", "connect-active", { live: true });
    await chapter(page, "pilot");
    await page.locator('.workshop-machines button::-p-text(Bandsaw)').click();
    await sceneState(page, "bandsaw", true);
    await chapter(page, "operations");
    await sceneState(page, "connect-active", true);
    assert.equal(await page.$eval(".demo-web", (element) => element.dataset.state), "active");
    await activate(page, "reset-maintenance", "connect", { live: true });
  });
  await t.test("static toggle and changed motion preference remove the live renderer", async () => {
    await chapter(page, "system");
    await sceneState(page, "overview", true);
    await page.locator(".workshop-motion").click();
    await sceneState(page, "overview");
    await page.locator(".workshop-motion").click();
    await sceneState(page, "overview", true);
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.waitForFunction(() => !document.querySelector("canvas"));
    await sceneState(page, "overview");
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
    await page.locator(".workshop-motion").click();
    await sceneState(page, "overview", true);
  });
  await t.test("contact unmounts the canvas and retains bilingual fields, mailto and privacy", async () => {
    const canvas = await page.$("canvas");
    await page.locator('.prototype-header__tools a[href="/contact"]').click();
    await page.waitForSelector(".contact-form");
    assert.equal(new URL(page.url()).pathname, "/contact");
    assert.equal(await canvas.evaluate((element) => element.isConnected), false);
    assert.equal(await page.$("canvas, .workshop-canvas"), null);
    const draws = await page.evaluate(() => window.workshopDraws);
    for (const language of ["en", "de"]) {
      if (language === "de") await page.locator('button[aria-label="Auf Deutsch wechseln"]').click();
      await page.waitForFunction((language) => document.documentElement.lang === language, {}, language);
      assert.deepEqual(await page.$$eval(".contact-form input, .contact-form textarea", (fields) => fields.map((field) => [field.name, field.type, field.required, Boolean(field.labels?.[0]?.innerText.trim())])), [
        ["name", "text", true, true], ["organization", "text", true, true], ["email", "email", true, true], ["message", "textarea", true, true],
      ]);
      const privacy = await page.$eval("#contact-privacy", (element) => element.innerText);
      assert.match(privacy, language === "en" ? /opens your email app/ : /E-Mail-Programm/);
      assert.match(privacy, language === "en" ? /not sent to this website/ : /nicht an unsere Website/);
      assert.equal(await page.$eval(".contact-form", (form) => form.getAttribute("aria-describedby")), "contact-privacy");
      assert.equal(await page.$eval('#contact-privacy a', (link) => link.getAttribute("href")), "/datenschutz");
      assert.equal(await page.$eval('.contact-aside a', (link) => link.getAttribute("href")), "mailto:contact@attraccess.org");
    }
    assert.equal(await page.evaluate(() => window.workshopDraws), draws);
    assert.equal(await page.$(".contact-form__success"), null);
    assert.equal(await page.evaluate(() => window.workshopSubmits.includes("non-demo")), false);
  });
});

for (const mode of ["reduced", "prerender", "save-data"]) {
  test(`${mode}: all workflows use loaded posters without downloading the renderer`, { timeout: 90000 }, async (t) => {
    const { page, requests } = await openPage(t, { mode });
    await sceneState(page, "overview");
    await noRendererRequests(page, requests);
    for (const run of Object.values(workflows)) await run(page, {});
    for (const [anchor, key] of Object.entries(chapters)) { await chapter(page, anchor); await sceneState(page, key); }
    for (const [name, key] of Object.entries(machines)) {
      await page.locator(`.workshop-machines button::-p-text(${name})`).click();
      await sceneState(page, key);
    }
    await noRendererRequests(page, requests);
    assert.equal(await page.evaluate(() => window.workshopSubmits.includes("non-demo")), false);
  });
}

for (const width of [390, 320]) {
  test(`mobile ${width}px: touch story, bilingual menu, keyboard access and overflow`, { timeout: 90000 }, async (t) => {
    const { page, requests } = await openPage(t, { width, height: 844, language: "de" });
    assert.equal(await page.$('.workshop-stage, .demo-workflow'), null, 'Mobile articles have no permanent stage or inline demos');
    assert.equal(await page.$$eval('[data-chapter] .workshop-mobile-preview', (elements) => elements.length), 7);
    await noRendererRequests(page, requests);
    await noOverflow(page);
    const smallTargets = await page.$$eval('.workshop-machines button, .prototype-header__tools > button, .workshop-motion, .workshop-chapters select, .demo-button, .demo-link, .demo-check', (elements) => elements.filter((element) => {
      const box = element.getBoundingClientRect();
      return box.width && box.height < 44;
    }).map((element) => element.outerHTML));
    assert.deepEqual(smallTargets, [], "Buttons and checkbox labels need 44px touch targets");
    await page.tap(".prototype-menu");
    await page.waitForSelector('#home-mobile-navigation:not([hidden])', { visible: true });
    await page.tap('button[aria-label="Switch to English"]');
    await page.waitForFunction(() => document.documentElement.lang === "en");
    assert.equal(await page.$eval(".prototype-menu", (button) => button.getAttribute("aria-expanded")), "true");
    assert.equal(await page.$eval(".prototype-menu", (button) => button.getAttribute("aria-label")), "Close menu");
    assert.equal(await page.$eval('#home-mobile-navigation a[href="/#loop"]', (link) => link.innerText), "Workflow");
    await page.tap('#home-mobile-navigation a[href="/#loop"]');
    await page.waitForSelector("#home-mobile-navigation[hidden]");
    assert.equal(await page.$('.workshop-mobile-dialog, .workshop-stage'), null, 'Article links must not open the demo');
    for (const run of Object.values(workflows)) { await run(page, { touch: true }); await noOverflow(page); }
    await chapter(page, "permissions");
    await page.focus(actionSelector("check-accessory"));
    await page.keyboard.press("Space");
    await sceneState(page, "evaluate-checked");
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("data-action")), "submit-check");
    assert.equal(await page.evaluate(() => document.activeElement.matches(":focus-visible")), true);
    await page.keyboard.press("Enter");
    await sceneState(page, "evaluate-submitted");
    await page.waitForFunction(() => document.activeElement?.matches('[data-testid="demo-evaluate"] .demo-title'));
    await chapter(page, "system", { preview: false });
    await page.tap(".prototype-menu");
    await page.keyboard.press("Escape");
    await page.waitForSelector("#home-mobile-navigation[hidden]");
    await noOverflow(page);
    await noRendererRequests(page, requests);
  });
}

for (const language of ['en', 'de']) {
  test(`mobile dialog ${language}: Escape, focus restoration, persistent state and cross-step links`, { timeout: 60000 }, async (t) => {
    const { page } = await openPage(t, { width: 390, language });
    await chapter(page, 'loop');
    const closeLabel = language === 'de' ? 'Zurück zum Artikel' : 'Back to the story';
    assert.equal(await page.$eval('.workshop-mobile-dialog__header button', (button) => button.getAttribute('aria-label')), closeLabel);
    const article = await page.evaluate(() => ({ hash: location.hash, scrollY, chapter: document.querySelector('.workshop-chapters select').value }));
    await page.focus(actionSelector('tap-card'));
    await page.keyboard.press('Enter');
    await sceneState(page, 'identify-identified');
    await page.waitForFunction(() => document.activeElement?.matches('[data-testid="demo-identify"] .demo-title'));
    for (const [action, state] of [['next-permissions', 'evaluate'], ['next-operations', 'connect']]) {
      await activate(page, action, state);
      assert.deepEqual(await page.evaluate(() => ({ hash: location.hash, scrollY, chapter: document.querySelector('.workshop-chapters select').value })), article, 'Modal links must not navigate the underlying article');
      assert.equal(await page.$$eval('.workshop-mobile-dialog .demo-workflow', (elements) => elements.length), 1);
    }
    await page.keyboard.press('Escape');
    await page.waitForSelector('.workshop-mobile-dialog', { hidden: true });
    await page.waitForFunction(() => document.activeElement?.matches('#loop .workshop-mobile-preview'));
    await page.keyboard.press('Enter');
    await sceneState(page, 'identify-identified');
    await activate(page, 'next-permissions', 'evaluate');
    await activate(page, 'check-accessory', 'evaluate-checked');
    await activate(page, 'submit-check', 'evaluate-submitted');
    await activate(page, 'next-release', 'apply');
    await activate(page, 'toggle-automation', 'apply-automation');
    await activate(page, 'next-sessions', 'record');
    await activate(page, 'clean-workspace', 'record-cleaned');
    await activate(page, 'end-session', 'record-form');
    await activate(page, 'handoff-answer', 'record-form-checked');
    await closeMobileDemo(page);
    await page.waitForFunction(() => document.activeElement?.matches('#loop .workshop-mobile-preview'));
    for (const [anchor, key] of [['permissions', 'evaluate-submitted'], ['release', 'apply-automation'], ['sessions', 'record-form-checked']]) {
      await chapter(page, anchor);
      await sceneState(page, key);
    }
    assert.equal(await page.$eval(actionSelector('handoff-answer'), (input) => input.checked), true);
    assert.equal(await page.$eval(actionSelector('confirm-handoff'), (button) => button.disabled), false);
    const close = '.workshop-mobile-dialog__header button';
    await page.focus(close);
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    assert.equal(await page.evaluate(() => Boolean(document.activeElement?.closest('.workshop-mobile-dialog'))), true, 'Tab must remain trapped in the dialog');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.matches('.workshop-mobile-dialog__header button')), true);
    await chapter(page, 'operations');
    await activate(page, 'open-report');
    await fillText(page, actionSelector('problem-reason'), 'Blade needs inspection');
    await activate(page, 'report-problem', 'connect-reported');
    await closeMobileDemo(page);
    await chapter(page, 'operations');
    assert.equal(await page.$eval('.demo-reason', (element) => element.textContent), 'Blade needs inspection');
  });
}

test('mobile live renderer downloads only on opening a preview and unmounts on close', { timeout: 60000 }, async (t) => {
  const { page, requests } = await openPage(t, { width: 390, mode: 'live' });
  await noRendererRequests(page, requests);
  for (const anchor of Object.keys(chapters)) await chapter(page, anchor, { preview: false });
  await noRendererRequests(page, requests);
  await chapter(page, 'loop');
  await sceneState(page, 'identify', true);
  assert.ok(requests.some((url) => rendererModule.test(url)));
  await activate(page, 'tap-card', 'identify-identified', { live: true, touch: true });
  const canvas = await page.$('canvas');
  await closeMobileDemo(page);
  assert.equal(await canvas.evaluate((element) => element.isConnected), false);
  assert.equal(await page.$('.workshop-stage, canvas'), null);
  const draws = await page.evaluate(() => window.workshopDraws);
  await page.evaluate(async () => { for (let i = 0; i < 12; i++) await new Promise(requestAnimationFrame); });
  assert.equal(await page.evaluate(() => window.workshopDraws), draws);
  await page.locator('#loop .workshop-mobile-preview').click();
  await sceneState(page, 'identify-identified', true);
});

test('loaded assets do not time out while the workshop is offscreen', { timeout: 45000 }, async (t) => {
  const { page, releaseTextures } = await openPage(t, { mode: 'live', gateTextures: true });
  await page.$eval('.workshop-newsletter', (element) => element.scrollIntoView({ behavior: 'instant' }));
  await page.waitForFunction(() => document.querySelector('.workshop-stage').getBoundingClientRect().bottom <= 0);
  await releaseTextures();
  await delay(11000);
  assert.ok(await page.$('.workshop-canvas'), 'An offscreen scene with loaded assets must not fall back');
  await chapter(page, 'system');
  await sceneState(page, 'overview', true);
});

for (const [width, height] of [[390, 844], [320, 700], [390, 650], [320, 500]]) {
  test(`mobile ${width}x${height}: modal scene and controls scroll in the correct container`, { timeout: 45000 }, async (t) => {
    const { page } = await openPage(t, { width, height });
    await chapter(page, 'permissions');
    const layout = await page.evaluate(() => {
      const controls = document.querySelector('.workshop-mobile-dialog__controls');
      const body = document.querySelector('.workshop-mobile-dialog__body');
      const stage = document.querySelector('.workshop-stage');
      const before = stage.getBoundingClientRect().top;
      const scroll = innerHeight >= 650 ? controls : body;
      scroll.scrollTop = scroll.scrollHeight;
      return { controlsOverflow: getComputedStyle(controls).overflowY, bodyOverflow: getComputedStyle(body).overflowY, scrolled: scroll.scrollTop, before, after: stage.getBoundingClientRect().top, bottom: stage.getBoundingClientRect().bottom, viewport: innerHeight };
    });
    assert.ok(layout.scrolled > 0, JSON.stringify(layout));
    if (height >= 650) {
      assert.equal(layout.controlsOverflow, 'auto');
      assert.equal(layout.after, layout.before, 'The scene must stay visible while controls scroll');
      assert.ok(layout.after >= 0 && layout.bottom <= layout.viewport);
    } else {
      assert.equal(layout.bodyOverflow, 'auto');
      assert.equal(layout.controlsOverflow, 'visible');
      assert.ok(layout.after < layout.before, 'Short screens scroll the whole dialog body');
    }
    await activate(page, 'check-accessory', 'evaluate-checked', { touch: true });
    await activate(page, 'submit-check', 'evaluate-submitted', { touch: true });
    await noOverflow(page);
  });
}

test('keyboard replacement focus stays in the active desktop workflow', { timeout: 60000 }, async (t) => {
  const { page } = await openPage(t);
  for (const [anchor, actions] of [
    ['loop', [['tap-card', '.demo-title'], ['show-supervision', '.demo-title']]],
    ['permissions', [['check-accessory', actionSelector('check-accessory')], ['submit-check', '.demo-title']]],
    ['operations', [['open-report', actionSelector('problem-reason')], ['cancel-report', actionSelector('open-report')], ['open-report', actionSelector('problem-reason')], ['report-problem', '.demo-title'], ['start-maintenance', '.demo-title'], ['complete-maintenance', '.demo-title']]],
  ]) {
    await chapter(page, anchor);
    for (const [action, focus] of actions) {
      await page.focus(actionSelector(action));
      await page.keyboard.press(action === 'check-accessory' ? 'Space' : 'Enter');
      await page.waitForFunction((selector) => document.activeElement?.matches(selector), {}, `[data-testid="demo-${chapters[anchor]}"] ${focus}`);
    }
  }
});

test('contact starts at the top and privacy opens a new tab without losing form drafts', { timeout: 60000 }, async (t) => {
  const { page } = await openPage(t);
  for (const [form, privacy, fields] of [
    ['.workshop-newsletter', '.workshop-newsletter a[href="/datenschutz"]', { email: 'draft@example.invalid', name: 'Draft owner' }],
    ['.contact-form', '#contact-privacy a', { name: 'Draft owner', organization: 'Workshop', email: 'draft@example.invalid', message: 'Please retain this draft.' }],
  ]) {
    if (form === '.contact-form') {
      await chapter(page, 'pilot');
      assert.ok(await page.evaluate(() => scrollY > 500));
      await page.locator('#pilot a[href="/contact"]').click();
      await page.waitForSelector('.contact-form');
      await page.waitForFunction(() => scrollY === 0);
    }
    for (const [name, value] of Object.entries(fields)) await fillText(page, `${form} [name="${name}"]`, value);
    assert.deepEqual(await page.$eval(privacy, (link) => [link.target, link.relList.contains('noopener'), link.relList.contains('noreferrer')]), ['_blank', true, true]);
    const popupReady = new Promise((resolve) => page.once('popup', resolve));
    await page.locator(privacy).click();
    const popup = await popupReady;
    try {
      await popup.waitForSelector('h1');
      assert.equal(new URL(popup.url()).pathname, '/datenschutz');
      assert.match(await popup.$eval('h1', (element) => element.innerText), /Datenschutzerkl/);
      assert.equal(await popup.evaluate(() => window.opener), null);
      for (const [name, value] of Object.entries(fields)) assert.equal(await page.$eval(`${form} [name="${name}"]`, (input) => input.value), value);
    } finally { await popup.close(); }
  }
});

test("WebGL failure leaves the story usable with real posters", { timeout: 90000 }, async (t) => {
  const { page, requests } = await openPage(t, { mode: "webgl-failure" });
  await sceneState(page, "overview");
  assert.ok(requests.some((url) => rendererModule.test(url)), "Must attempt rendering, not silently bypass it");
  for (const run of Object.values(workflows)) await run(page, {});
});

test("failed required reader texture uses illustrations rather than a fabricated firmware render", { timeout: 45000 }, async (t) => {
  const { page, requests } = await openPage(t, { mode: "texture-failure" });
  await sceneState(page, "overview");
  assert.ok(requests.includes(`${origin}${supervisionImage}`));
  assert.equal(await page.$(".workshop-visual.is-ready"), null);
  assert.equal(await page.$(".workshop-canvas"), null);
  await chapter(page, "loop");
  await activate(page, "tap-card", "identify-identified", { live: false });
});

test("mobile chapter picker returns to the current hash after ordinary scrolling", { timeout: 45000 }, async (t) => {
  const { page } = await openPage(t, { width: 390, height: 844 });
  await chapter(page, "system", { preview: false });
  await page.$eval("#features", (section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await page.waitForFunction(() => document.querySelector('.workshop-chapters select').value === '6');
  assert.equal(new URL(page.url()).hash, "#system");
  await chapter(page, "system", { preview: false });
  assert.equal(await page.$('.workshop-stage, .workshop-mobile-dialog'), null);
});

for (const preference of ["absent", "invalid", "blocked"]) {
  test(`brand defaults to white with a dark OS and ${preference} theme storage`, { timeout: 45000 }, async (t) => {
    const { page, requests } = await openPage(t, { osDark: true, theme: preference === "invalid" ? "invalid-theme" : null, blockThemeStorage: preference === "blocked" });
    await sceneState(page, "overview");
    const colors = await page.evaluate(() => ({
      dark: document.documentElement.classList.contains("dark"),
      paper: getComputedStyle(document.querySelector(".prototype-header")).backgroundColor,
      heading: getComputedStyle(document.querySelector("h1 em")).color,
      cta: getComputedStyle(document.querySelector(".prototype-header__cta")).backgroundColor,
    }));
    assert.deepEqual(colors, { dark: false, paper: "rgb(255, 255, 255)", heading: "rgb(37, 109, 123)", cta: "rgb(37, 109, 123)" });
    await page.locator('button[aria-label="Change color scheme"]').click();
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    if (preference !== "blocked") {
      assert.equal(await page.evaluate(() => localStorage.getItem("theme")), "dark");
      await page.reload({ waitUntil: "networkidle0" });
      await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    }
    await noRendererRequests(page, requests);
  });
}

test("light/dark contrast, white reader UI, actual app assets and short-screen reading", { timeout: 60000 }, async (t) => {
  const { page, requests } = await openPage(t, { width: 390, height: 844 });
  for (const theme of ["light", "dark"]) {
    if (theme === "dark") await page.locator('button[aria-label="Change color scheme"]').click();
    await page.waitForFunction((theme) => document.documentElement.classList.contains("dark") === (theme === "dark"), {}, theme);
    await chapter(page, "permissions");
    const contrasts = await page.evaluate(() => {
      function luminance(color) {
        const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((value) => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
      }
      return ["h1", "h1 em", ".workshop-lede", ".workshop-motion", ".prototype-header__tools > button", ".workshop-mobile-dialog__header h2", ".workshop-mobile-dialog__header p", ".workshop-mobile-dialog .workshop-motion", ".workshop-mobile-dialog .workshop-cue p", ".demo-note", ".demo-reader", ".demo-reader .demo-note"].map((selector) => {
        const element = document.querySelector(selector);
        let background = element;
        while (getComputedStyle(background).backgroundColor === "rgba(0, 0, 0, 0)") background = background.parentElement;
        const paper = luminance(getComputedStyle(background).backgroundColor), ink = luminance(getComputedStyle(element).color);
        return [selector, (Math.max(paper, ink) + 0.05) / (Math.min(paper, ink) + 0.05)];
      });
    });
    for (const [selector, ratio] of contrasts) assert.ok(ratio >= (selector.startsWith("h1") ? 3 : 4.5), `${theme} ${selector}: contrast ${ratio}`);
    assert.deepEqual(await page.$eval(".demo-reader", (element) => [getComputedStyle(element).backgroundColor, getComputedStyle(element).borderTopColor, element.lang]), ["rgb(255, 255, 255)", "rgb(37, 109, 123)", "de"]);
    await closeMobileDemo(page);
    const image = `.workshop-app-preview img[src="/hero/app-screenshot${theme === "dark" ? "-dark" : ""}.png"]`;
    await page.waitForSelector(image);
    await page.$eval(image, (element) => element.scrollIntoView({ behavior: "instant", block: "end" }));
    await imageLoaded(page, image);
    await page.waitForFunction(() => document.querySelector('.workshop-chapters select').value === '6');
    await page.$eval("#system", (section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
    await page.waitForFunction(() => document.querySelector('.workshop-chapters select').value === '0');
  }
  for (const [width, height] of [[390, 700], [320, 500], [844, 390]]) {
    await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await chapter(page, "permissions", { preview: false });
    const bounds = await page.evaluate(() => ({ title: document.querySelector("#evaluate-title").getBoundingClientRect().top, nav: document.querySelector(".workshop-chapters").getBoundingClientRect().bottom }));
    assert.ok(bounds.title >= bounds.nav - 1, `Short-screen heading covered at ${width}x${height}: ${JSON.stringify(bounds)}`);
    await noOverflow(page);
    await chapter(page, "system", { preview: false });
    if (width > 760) assert.ok(await page.$eval(".workshop-machines", (element) => element.getBoundingClientRect().bottom <= innerHeight), "Landscape machine controls must fit on screen");
  }
  await noRendererRequests(page, requests);
});

test("bilingual owner information, feature accordions, audiences, newsletter and legal routes", { timeout: 60000 }, async (t) => {
  const { page, requests } = await openPage(t, { mode: "prerender", language: "de" });
  for (const language of ["de", "en"]) {
    if (language === "en") await page.locator('button[aria-label="Switch to English"]').click();
    await page.waitForFunction((language) => document.documentElement.lang === language, {}, language);
    assert.match(await page.$eval("h1", (element) => element.innerText), language === "de" ? /Mehr Werkstatt/ : /More time making/);
    assert.equal(await page.$$eval("main", (elements) => elements.length), 1);
    assert.equal(await page.$$eval("[data-chapter] h1, [data-chapter] h2", (elements) => elements.filter((element) => element.innerText.trim()).length), 7);
    assert.equal(await page.$$eval("#features .workshop-feature-list details", (elements) => elements.length), 8);
    for (const details of await page.$$("#features .workshop-feature-list details")) {
      await (await details.$("summary")).click();
      assert.ok(await details.$eval("p", (element) => element.innerText.length > 20));
      assert.equal(await details.$("a"), null, 'Feature explanations stay on the page');
      await (await details.$("summary")).click();
    }
    assert.equal(await page.$$eval("#use-cases article", (elements) => elements.length), 3);
    assert.equal(await page.$$eval('#use-cases article a[href="/contact"]', (elements) => elements.length), 3);
    assert.match(await page.$eval(".workshop-safety", (element) => element.innerText), language === "de" ? /ersetzt keine Schutzvorrichtung/ : /does not replace guarding/);
    assert.doesNotMatch(await page.$eval("#pilot", (element) => element.innerText), /90 (?:Tage|days)/);
    assert.equal(await page.$$eval('.workshop-page a[href^="http"]', (links) => links.length), 0, 'Marketing pages must not send visitors to documentation, GitHub or other external resources');
    assert.doesNotMatch(await page.$eval('main', (element) => element.textContent), /github|pull request|issuecomment|\b\S+\.tsx\b/i);
    const form = await page.$eval(".workshop-newsletter form", (form) => ({
      method: form.method, action: form.action, list: form.elements.namedItem("l").value,
      email: [form.elements.namedItem("email").type, form.elements.namedItem("email").required],
      nameRequired: form.elements.namedItem("name").required,
      consent: [form.querySelector('[type="checkbox"]').required, form.querySelector('[type="checkbox"]').checked],
      privacy: form.querySelector("a").getAttribute("href"), text: form.innerText,
    }));
    assert.equal(form.method, "post");
    assert.equal(form.action, "https://listmonk.attraccess.org/subscription/form");
    assert.equal(form.list, language === "de" ? "d21f9904-1a25-4ad7-8e7b-24379133163f" : "9764fb4c-fddd-43eb-9eaf-5c7c3265940e");
    assert.deepEqual(form.email, ["email", true]);
    assert.equal(form.nameRequired, false);
    assert.deepEqual(form.consent, [true, false]);
    assert.equal(form.privacy, "/datenschutz");
    assert.match(form.text, language === "de" ? /Ich willige ein/ : /I consent/);
    assert.match(form.text, language === "de" ? /Abmeldung jederzeit/ : /Unsubscribe at any time/);
    await fillText(page, '.workshop-newsletter input[name="email"]', "regression@example.invalid");
    assert.equal(await page.$eval(".workshop-newsletter form", (form) => form.checkValidity()), false);
    await page.locator('.workshop-newsletter input[type="checkbox"]').click();
    assert.equal(await page.$eval(".workshop-newsletter form", (form) => form.checkValidity()), true);
    await page.locator('.workshop-newsletter input[type="checkbox"]').click();
    await fillText(page, '.workshop-newsletter input[name="email"]', "");
    assert.deepEqual(await page.$$eval('.prototype-footer__links a[href^="/"]', (links) => links.map((link) => link.innerText)), language === "de" ? ["Datenschutz", "AGB"] : ["Privacy (German)", "Terms (German)"]);
  }
  await chapter(page, "operations");
  await activate(page, "show-maintenance-source");
  const maintenanceImage = '#operations img[src="/reader-ui/brand-resource-maintenance.png"]';
  await page.$eval(maintenanceImage, (image) => image.scrollIntoView({ behavior: "instant", block: "end" }));
  await imageLoaded(page, maintenanceImage);
  for (const [selector, path, title] of [['.prototype-footer__links a[href="/datenschutz"]', "/datenschutz", /Datenschutzerkl/], ['.prototype-footer__links a[href="/agb"]', "/agb", /Allgemeine.*AGB/]]) {
    await page.locator(selector).click();
    await page.waitForFunction((path) => location.pathname === path, {}, path);
    assert.match(await page.$eval("h1", (element) => element.innerText), title);
    assert.equal(await page.$$eval("main", (elements) => elements.length), 1);
    await page.goBack({ waitUntil: "networkidle0" });
    await page.waitForSelector(".workshop-newsletter");
  }
  assert.deepEqual(await page.evaluate(() => window.workshopSubmits), [], "Only local demo forms may be submitted in this suite");
  await noRendererRequests(page, requests);
});
