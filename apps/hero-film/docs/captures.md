# Attraccess film demo and capture handoff

The film uses the real Attraccess frontend and API from `software/`, with a separate SQLite database, CDN, plugin directory and session secret under `apps/hero-film/tools/demo/.runtime/`. That directory is ignored by git. The prepared `software/storage/attraccess.sqlite` remains untouched and empty of users/resources. No software source files were changed and no commits were made.

## Running instance

Resolved URLs are always read from `software/.dev-serve-ports.json`. Current frontend: `http://localhost:4200`; API and OpenAPI: `http://localhost:3000/api`. The launcher uses the Node version in `software/.nvmrc` and **`pnpm serve`**. The advertised preview port is the launcher's reserved build-preview port, not an extra running app.

Administrator username: **`film.operator`**. Named capture accounts use email login: `mia.chen@north-campus.example` and `priya.nair@north-campus.example`. The project-team shot uses owner `jordan.lee@north-campus.example`. The local demo password is defined in the seed/capture tooling; it is deliberately omitted here and from media/filenames. Device tokens and the generated session secret remain in ignored files with private permissions.

From the workspace root:

```bash
./apps/hero-film/tools/demo/run.sh start
./apps/hero-film/tools/demo/run.sh restart
./apps/hero-film/tools/demo/run.sh seed
./apps/hero-film/tools/demo/run.sh capture
```

`start` leaves the servers and simulators detached. `restart` restarts the app while retaining the demo database. `seed` stops only the film-owned processes, rebuilds the dedicated storage from the prepared empty migrated database, installs the three real plugins, seeds the fixture, validates/saves flows through the real API, and restarts the app. It refuses to copy a prepared database containing users/resources and refuses to reset another storage path. The end-to-end reseed command was run successfully.

`capture` runs still captures, three frame sequences, and artifact/database verification. For selective work:

```bash
./apps/hero-film/tools/demo/run.sh capture --only resources,laser-active,flow
./apps/hero-film/tools/demo/run.sh sequences --only seq-timer,seq-flow
./apps/hero-film/tools/demo/run.sh verify
./apps/hero-film/tools/demo/run.sh stop
```

Partial commands preserve the other manifest entries. Logs and PID files are under `.runtime/`. If an app fails to start, inspect `.runtime/serve.log`; do not start an unwrapped Nx server or assume default ports. `inspect.mjs` is an optional local diagnostic tool.

## Fixture

**North Campus Prototyping Lab**, English locale, October 2026. Eighteen named workshop people plus one operator account; fourteen resources in five groups; four projects; four weeks of resource usage; introductions and refresher history; Felix Novak with two completed supervised laser sessions toward a three-session introduction; laser start forms and historical submissions; electricity, operating-time and filament counters; operating intervals; maintenance schedules, requests and completed records; credit balances, per-minute/meter/flow items and fictional top-ups; audit events and messages.

Mia Chen's laser session is active, attributed to **Solar Boat 2027**, with a capture clock set to fourteen minutes elapsed. A CNC spindle service supplies the maintenance state. Other active sessions use different people. Rich historical evidence and current fixtures are seeded directly into the production schema because public APIs cannot backdate all this evidence or represent arbitrary imported history. Flows are validated and saved through the real API; the start sequence performs a real form submission and metered session start/end.

Photos are reused from `apps/web/demo/images/`; see its `credits.json`. Suitable resource images were reused. Incorrect band-saw and Bambu matches were removed, letting the real app show its native icons. Project images are illustrative workshop/team imagery rather than commissioned photos of those fictional projects.

## Real versus simulated

All UI, permission checks, counters, forms, projects, plugin pages, billing calculation, flow execution and session state are real product code. No screenshots use replacement HTML, mocked API responses, text overlays or fabricated product widgets.

Simulated hardware and services:

- Four Attractap clients authenticate and remain connected to the real WebSocket API. A spare teaching reader is an offline historical fleet entry. A browser reader can also appear when the separate reader-render task is running.
- Three Companion clients authenticate over real WebSockets and appear online. They acknowledge local messages; no real PC is locked or unlocked.
- A local MQTT 3.1.1 protocol simulator listens on loopback port `18925`, handling CONNECT, subscribe, publish, QoS acknowledgements and retained values. It emits local WAGO heartbeat/state packets.
- Flow HTTP requests go to a local mock Shelly RPC/webhook server on loopback `18924`. Additional local mock ports are `18934` and `18944`.
- The real Shelly plugin rejects loopback and non-default ports. Its firmware pages therefore use simulated devices bound to this computer's own enumerated IPv4 addresses via a guarded port-80 listener. The listener accepts only this computer's local source and destination addresses; it does not contact or discover LAN hardware. It reports firmware `1.6.2`. Host assignments are refreshed whenever the simulator starts.
- WAGO and RabbitMQ are genuine installed plugins. WAGO entries have local heartbeats but retain the real software-verification state because full managed commissioning is not simulated. The MQTT simulator is not a RabbitMQ management server.
- OIDC/SAML entries use inert local endpoints. Top-ups are fictional database records. SMTP goes to a loopback sink. No institutional identity provider, payment provider, real hardware or external service is invoked.

## Captures and manifest

Everything is in `apps/hero-film/assets/captures/`, ignored by git. `manifest.json` is the authoritative inventory. Its flat `assets` list gives each file's page, theme, viewport and pixel size. Still entries additionally contain CSS-pixel component bounds, selectors and whether each component lies fully inside the viewport. Native flow-node crops record their scale and padding. The native crop routine pans each node into the actual canvas before capture, preventing off-canvas clipping.

Desktop shots use **1600×1000 CSS pixels at 2×**; phone shots use **390×844 at 3×**. PNGs retain the native product theme and layout. Crops are tight component screenshots; native nodes include twelve CSS pixels around their handles. Product backgrounds remain where the component has one. Toasts, install prompts, cursors, scrollbars and development overlays are hidden. Fonts/images and animations are allowed to settle. The app's permanent live-update stream prevents browser-wide network-idle from ever finishing, so capture waits for ordinary requests to settle and images to decode while preserving that live stream.

Shot families: `resources`/`resources-labs`; `laser-active`/`laser-active-person`; `laser-start-ready`/`laser-start-form`/`laser-start-active`; `laser-people`/`laser-introduction-history`; `flow-collapsed`/`flow-expanded`/`flow-catalog`/`flow-catalog-domains`/`flow-live-run`; `meters`; `history`/`history-notes`; `billing`/`billing-admin`/`billing-detail`; `maintenance`; `projects`/`projects-detail`/`projects-team`; `devices-attractap`/`devices-shelly`/`devices-wago`/`devices-companion`/`devices-mqtt`; `plugins`; `sso`; `audit`; `door`; `messages`; `mobile-active`/`mobile-resources`; `light-resources`/`light-laser-active`.

`seq-start`, `seq-timer`, and `seq-flow` each contain **120 PNG frames at 30 fps (four seconds)**. Corresponding `*-components` folders contain isolated component frames. The Playwright virtual clock advances with deterministic `page.clock.runFor` increments; screenshot capture disables CSS animations so only timer and execution-state changes advance. The start sequence begins at the filled required-form confirmation, submits it through the UI, settles the resulting real API state and ticks the active timer. The two preceding stills supply the start-ready and filled-form stages. The timer sequence starts at fourteen minutes. The flow sequence presses a real local extraction-check button while log recording is enabled, showing genuine execution records in the native Flow Logs panel. Node-canvas highlights did not render in the local live-update path, so the recording panel is the sequence variant. Sequences change only the dedicated demo. After start capture, its active session is reset to fourteen minutes for further exploration.

## Product-version gaps and deviations

- This revision has **meter totals and per-session values, without meter charts**. The real meter cards and project usage/cost charts are captured.
- Maintenance requests have no photo or assigned-maintainer field. Reporter, resolver and completed-by maintainer records are seeded and shown. Operating-hour schedules exist, but this UI has no hour-progress visualization.
- Supervised sessions and automatic progression exist in the backend, but this revision has no supervision-progress widget. The supervised history and introduction records are supplied.
- Overview rows show resource status, without active-user avatar badges. The detail observer view and all-user history show Mia and the other people. The user's own detail view supplies the large timer/project card.
- Shelly has no dedicated flow node. Its real HTTP request node calls the local simulated RPC. Companion, MQTT, billing, health, metering and operating-state nodes are native product nodes. Door flows use native lock/unlock/unlatch events rather than an unsupported door button-input node.
- The flow sequence uses the real execution-log panel; canvas node highlights did not render in this local live-update path.
- WAGO's table retains **Checking software** for the simulated controller registry. Full managed SSH/runtime commissioning is beyond this simulator. RabbitMQ administration is unavailable without its broker-management API.
- Identity entries are inert; no real authentication redirects or payments were attempted. SumUp top-ups are records only.
- There is no suitable local photo for every resource. Native icons are used for those resources.

Screenshots were visually inspected, including dark/light desktop, mobile, the start form, active cards, tables, project team, and far-right flow nodes. Wrong native-node crops, empty project access, mismatched resource photos, long overview descriptions and missing operating data were corrected. Artifact verification checks referenced PNGs, viewport dimensions, image errors and SQLite foreign-key integrity. Unreferenced intermediate PNGs are removed with `node apps/hero-film/tools/demo/verify.mjs --prune`.

## Round 2 — legible flow, maintenance and session ending

Round 2 adds **15 desktop stills, 144 component crops, and 90 full frames plus 90
component frames**. All desktop PNGs use dark appearance, 1600×1000 CSS pixels at
2× (3200×2000 PNGs). Existing round-1 files and manifest entries are retained.
The full new asset list is `apps/hero-film/assets/captures/round2-files.txt`.

| Still | Content |
|---|---|
| `flow2-start.png` | Usage started → If → HTTP / MQTT / Unlock PC / Record operation started; zoom 1.0 |
| `flow2-stop.png` | Usage stopped → HTTP off / Lock PC / Record operation stopped / Add billing item; zoom 1.0 |
| `flow2-metering.png` | Electricity metering start/ready and collection/report; zoom 1.15 |
| `flow2-overview.png` | Native fit-view of all three clusters; zoom ≈0.482 |
| `maint2-active.png` | Evaluator-created Lens & mirror cleaning task, Live now, logged in as Noah Brooks |
| `maint2-resource.png` | Mia's resource overview with the genuine maintenance restriction |
| `maint2-resource-maintainer.png` | Noah's resource overview with maintenance controls |
| `maint2-overview.png` | Resource overview: Trotec Speedy 400 In Maintenance |
| `maint2-schedule.png` | Expanded Lens & mirror cleaning operating-duration schedule |
| `maint2-completed.png` | Maintenance history: same task completed by Noah Brooks |
| `avail2-overview.png` | Resource overview: Trotec Speedy 400 Available; no active session |
| `end2-resource.png` | No active session, Start Using Resource, top recent-session row completed (14m 35s) |
| `companion2-locked.png` | Genuine Companion kiosk login gate, empty credential fields |
| `companion2-unlocked.png` | Genuine Companion kiosk resource page with Mia's active Solar Boat 2027 session |
| `companion2-device.png` | Real Companion registry, including the online Laser control · Windows device |

Associated still crops retain the parent prefix and `__` naming convention.
`flow2-*__node-*.png` includes every node at its parent shot's real zoom, with
12 CSS pixels of padding for the handles. The metering display keeps the native
fixture vocabulary **Electricity · kWh**.

### Flow geometry and persistence

`apps/hero-film/assets/captures/flow2-coordinates.json` is the convenient animation
handoff. The same data also lives under the four flow shots in `manifest.json`:

- `flowViewport` and `canvasBounds` describe the actual React Flow transform and viewport.
- Each node has `bounds`, its crop file, `topCentre`, `bottomCentre`, and `handles`.
  Every actual handle records its ID, source/target type, side, CSS centre and bounds.
- Every edge records source/target node and handle IDs, actual screen-space
  `start`/`end`, native SVG `d`, graph-space path length, and **61 screen-space
  samples** along the rendered edge. Pulses can follow these samples directly.

All screen coordinates are CSS pixels relative to the full screenshot; multiply
by two to address the PNG pixels. The If true/false outputs and HTTP/MQTT
output/error handles occupy the bottom corners. Centre anchors are also supplied,
but actual pulse endpoints should use the recorded edge geometry/handle IDs.

The API validated and saved **15 nodes and 11 edges**. A fresh editor load verified
persistence; captures use the real React Flow store to set the camera. The start
and stop branches each have a single four-child row with no crossing edges. The
catalog is collapsed. Unrelated check/webhook/extraction-off and run-time-meter
branches are removed from the final laser canvas; the original full flow is saved
privately in `.runtime/round2-flow-before.json`. The run-time meter's historical data
is retained, and its original lifecycle branch is temporarily restored only while
running the real start/end capture, then removed again.

**Native-renderer limitation:** this revision renders fan-out wires as cubic Bezier
curves and offers no persisted edge-style field. Vertical stems are straight;
fan-out remains the genuine non-crossing curved renderer. The exported paths match
these real edges exactly.

### Real maintenance and fixture adjustments

The existing **Lens & mirror cleaning** schedule (ID 2) retains its
`ATTRIBUTABLE_OPERATING_DURATION` basis. Its threshold was lowered from 40 to
**20 hours**, below the fixture's approximately 20.6 completed operating hours
since the last clean. Updating the schedule through Noah's authenticated real API
session invoked the real evaluator, which created maintenance **ID 24**. The server
log records its creation at `2026-10-14T15:29:57.759Z`. Noah completed the same task
through the real finish endpoint; final completion is `2026-10-14T15:36:22.168Z`,
with completed-by user ID 6. Evidence is in private runtime JSON files.

Two data adjustments were needed for clean, accurate captures:

- Mixed ISO and SQLite timestamp formats in the prior demo sessions/intervals
  disrupted newest-first ordering and caused the operating transition service to
  select an older interval. Laser timestamps were normalized to the production
  SQLite UTC format. Recorded flow logs now show successful operation-start,
  operation-stop, Companion lock/unlock, billing and final meter collection.
- Native scheduled-reason translation escapes the ampersand into visible `&amp;`.
  The evaluator-created task's original reason is preserved in
  `.runtime/round2-maintenance-original.json`; its stored demo reason was normalized
  to plain text on that same schedule-linked record. For the clean recapture, the
  fixture task was temporarily reopened and then completed again through Noah's
  real API session. No screenshot text or widgets were replaced.

The unrelated future manufacturer-service fixture (ID 22) was moved into completed
seed history. This was necessary because the overview's maintenance query includes
upcoming tasks by default, and any returned task yields In Maintenance. Its original
row is preserved in `.runtime/round2-upcoming-maintenance-before.json`. Final laser
state is **Available**, no active usage, and no open operating interval.

### End sequence and Companion boundary

`seq-end/000000.png` through `000089.png` are **90 frames at 30 fps / 3 seconds**.
`seq-end-components/` supplies a crop for every frame and per-frame bounds in the
manifest. The virtual clock advances with `page.clock.runFor`. Frame 15 clicks
**End Session**, invoking the real API (HTTP 200); crops switch to the real Session
billing summary while it is open. Frame 60 presses **Done**. The last frames show
Start Using Resource and the completed recent-session row. Toast suppression is
reinstalled after reload, so the sequence contains no toasts, cursors or scrollbars.

The final sequence uses Mia's real form-submitted session (usage ID 1054), with
Solar Boat 2027 and the required birch-plywood checks. Only the dedicated fixture's
start timestamp is backdated to provide the fourteen-minute capture state.
`end2-resource.png` uses a fresh resource load after final metering settled, so its
meter cards correctly say No active session.

Companion's Electron lock window loads `/kiosk/resources/:id` for a single paired
resource (`software/apps/companion/src/kiosk.ts`). The two Companion state captures
render that **same genuine page in Chromium**, against the local API and existing
paired-device WebSocket simulator. Device ID 1 is online and server-locked after
session ending. The native Electron unlock action hides the overlay; the unlocked
capture is its authenticated kiosk session page, not an OS desktop screenshot.
No native OS lock, startup entry, global shortcut interception or permission prompt
was invoked. This revision has no dedicated web device-detail route; the real
registry page and laser device row are included as `companion2-device*`.

### Tooling and checks

New tooling lives entirely in `apps/hero-film/tools/demo/`: `round2-flow.mjs`,
`round2-lifecycle.mjs`, `round2-maintenance.mjs`, `round2-final-stills.mjs`, and
`round2-verify.mjs`; diagnostic helpers also remain there. These are scenario tools,
so session and maintenance capture commands mutate the dedicated demo fixture.
Run them with the Node version selected by `software/.nvmrc`, as in `run.sh`.
The existing verifier now checks a sequence's declared frame count, supporting
both the original 120-frame sequences and the new 90-frame end sequence.

Both `run.sh verify` and `round2-verify.mjs` passed: referenced PNG dimensions,
component files, fully visible flow nodes, finite handle coordinates, matching edge
endpoints, 90 sequence crops, completed Mia usage, completed Noah maintenance,
no open laser operating interval, and SQLite foreign-key integrity. Stills, node
crops, sequence transitions and component sheets were visually inspected. The
software worktree remains clean, no git commits were made, and the demo services
remain running at the URLs resolved in `.dev-serve-ports.json`.

## German film captures

The German fixture runs independently at **http://localhost:4210**, with its API at
**http://localhost:3010/api**. Its launcher port file is
`apps/hero-film/tools/demo/de/.runtime/software/.dev-serve-ports.json`; the English launcher
file and English database remain untouched. The German software worktree is the
same commit, `a4d5e3b772686164dc353f2449edf0617a3509f5`, prepared with
`software/scripts/create-worktree.sh`. All German storage, plugins, images, sessions,
device tokens and logs live under `apps/hero-film/tools/demo/de/.runtime/`.

From the workspace root:

```bash
./apps/hero-film/tools/demo/de/run.sh start
./apps/hero-film/tools/demo/de/run.sh restart     # retain the German database
./apps/hero-film/tools/demo/de/run.sh stop        # only German-owned processes
./apps/hero-film/tools/demo/de/run.sh seed        # reset only the German storage, then start
./apps/hero-film/tools/demo/de/run.sh recapture   # ordered early shots → start → bill → flow → maintenance → available
./apps/hero-film/tools/demo/de/run.sh verify
```

Selective commands: `capture --only laser-introduction-history,devices-shelly`,
`sequences`, `flow`, and `maintenance`. `prepare-start.mjs` restores the full
original control flow for the start/active-card captures, including the translated
extraction-check button; `round2-flow.mjs` returns the canvas to its final 15-node layout. The lifecycle commands mutate the German
fixture; for a complete reproducible run, use `seed` followed by `recapture`.
`maintenance` requires that the laser session has ended.

`de/seed.py` first takes a **read-only SQLite backup** of the English round-2
fixture into a private frozen baseline. Later reseeds use this baseline and do
not read or reset the English database. The exact people, IDs, resource catalogue,
projects, historical evidence, rates and meter types are retained. Content strings
are translated recursively, preserving structured keys, types and technical
identifiers. All users have `locale=de`, `dateTimeLocale=de-DE`; Chromium also uses
`de-DE`, Europe/Berlin, dark appearance and German language selection.
The original active round-1 laser state and pending billing transaction are restored
for the early shots. Imported
round-2 diagnostic sessions are shifted one day earlier to keep them outside this
active-shot clock. The operating-duration schedule starts at 40 hours and is
lowered through Noah's real API session to 20 hours for the maintenance capture.

German simulations use loopback **19024 / 19034 / 19044** for HTTP/RPC, **19025**
for MQTT and **19026** for SMTP. Dedicated reader/Companion WebSocket clients
connect only to the German API. Node's native environment-proxy support routes
Shelly's required literal-IPv4 port-80 requests through a dedicated loopback
**19080** CONNECT proxy. It accepts only the three registered machine-owned
addresses, forwards them to 19024/19034/19044, and rejects every other destination.
The displayed IP addresses are refreshed from the computer's interfaces at startup;
no actual LAN socket is opened. German actions and firmware queries do not contact
the English simulator. No real hardware, identity provider, payment provider or
mail service is contacted.

Output is `apps/hero-film/assets/captures/de/`, using the English shot/sequence filenames.
`manifest.json` follows the English schema, including CSS-pixel component bounds,
per-frame bounds and a flat asset inventory. `flow2-coordinates.json` provides the
native zoom-1 start-chain geometry, handles and 61 samples per edge. `files.txt` is
the full file inventory. Desktop viewports are 1600×1000 CSS px at 2×; full PNGs
are 3200×2000. Native product text and widgets are captured without replacements. Fully visible
components are extracted losslessly from the same full PNG using their measured
DOM bounds, so the crops retain the exact captured frame.
The start capture performs a real required-form submission. The original upcoming
manufacturer-service fixture is restored during the active timer pose and then
returned to its saved state, preserving the English controls and component height. Its newly created
usage start timestamp is normalized in the dedicated German database to the
English start shot, and the real UI is reloaded while the virtual clock is paused.
The original API response remains private. After capture, the usage is reset to
fourteen minutes elapsed for the real session-end/billing step. It follows the
English virtual-clock procedure and records timer
text for every frame, including any `-1:-1:-1` transient. Its exact frame ranges
are written into the sequence manifest by `verify`.

The maintenance task is **created by the real operating-duration evaluator** and
**finished by Noah Brooks through the real endpoint**. Its imported demo timestamps
and plain-text reason are normalized in the German database to the English film
clock (14 October 2026, 17:29–17:36 local time), preserving the original API payloads
privately. Companion captures use the genuine `/kiosk/resources/1?autoLogoff=0`
page, as in English; the native Electron/OS lock is not invoked.

The final `snapshot-stills.mjs` step temporarily restores the imported English
laser, Companion and original billing poses, using the exact corresponding
English manifest clocks and unchanged numerical evidence. It captures genuine
German UI and then restores every changed database row and the final flow in a
`finally` block. This aligns the original 0.182 kWh / 0.233 h active meter evidence,
Companion’s 17:19 start, and the original transaction’s quantities/time. The separately
captured new start/end retains real API and form evidence. Maintenance captures
retain the future manufacturer-service entry while showing the active/completed
task, then move that fixture entry back to completed September history for Available,
matching the English round-2 sequence.

Exact German labels and any remaining English UI copy are documented in
[`docs/research/de-vocabulary.md`](research/de-vocabulary.md). QA is complete. The observed timer glitch is **frames 10–32 inclusive**, zero-based,
at 30 fps; all glitched frames remain in both directories. Verification passed for
**14 desktop stills, 98 still/component crops, 120 full sequence frames and 120
sequence component frames (352 PNGs)**, with no missing images, page errors,
broken images, invalid flow geometry or SQLite foreign-key violations. Every
requested crop is present. The final laser is Available, with no active session or
open operating interval; the schedule-created task is completed by Noah Brooks.
Both software worktrees remain clean, and no commits were made.

The documented `seed` → `recapture` workflow was run end to end. A final targeted
replay aligned the original upcoming-service pose during the timer/active captures,
so the session component has the same **422.5 CSS-pixel height** as English. Fully
visible crops are extracted from the same PNG frame; generated SQLite columns are
excluded when restoring temporary poses. The temporary-row snapshot is retained
privately in `de/.runtime/snapshot-stills-before.json`.

All selected stills, the full-frame form/start transition, negative timer frames,
normal timer frames, node crops, key panel crops, device rows and both Companion
states were visually reviewed. Native German copy still contains **Flows**, **Feedback**,
**Maker**, **Gen 2+**, and **React Flow** branding; the vocabulary document lists
these and the preserved technical identifiers. The native documentation/URL
abbreviations remain. There are no missing requested shots or untranslated demo
content in the selected crops.
