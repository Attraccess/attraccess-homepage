# Attraccess hero film — creative brief

Owner: Claude (creative direction). Codex agents support research, demo engineering, captures and QA.

## Concept — "Closed Loop"

Attraccess's strongest idea is a closed operational loop: a qualified person is authorized, the
resource is enabled through its configured control path, the real session is recorded, and that
session feeds billing and maintenance, which in turn decide whether the resource is available. The
film *is* that loop, so it loops seamlessly on the homepage.

Everything happens on one infinite canvas borrowed from the product's flow editor: dark app surface,
faint dot grid, wires in the dark-theme accent. Real UI fragments are the nodes. Light pulses travel
along wires from one fragment to the next. One unbroken camera move, no hard cuts.

Simple (one tap) → flexible (rules and flows shape what happens) → extensible (plugins, protocols,
identity, many resource types plug into the same loop).

## Beats (52 s, 60 fps master)

Revised after review: every screen holds 3–5 s with only a slow push-in; the camera travels between
holds in ≈1.5 s. One-word captions (Tap · Check · Start · Automate · Bill · Maintain · Ready) sit on the
holds. Node titles use exact UI vocabulary (see `docs/research/feature-inventory.md`); the effects
are the real Shelly device, Companion kiosk and meter rather than per-protocol nodes.

| # | Hold (s) | Caption | What we see (all real UI / genuine renders) |
|---|----------|---------|---------------------------------------------|
| 1 | 0–3.8 | Tap | Attractap Touch (CAD render) with genuine LVGL screens: idle clock → "Karte wird geprüft" → "Nutzung gestartet". |
| 2 | 5.4–8.9 | Check | Mia Chen's introduction history for the Trotec Speedy 400: "Allowed", trainer notes. |
| 3 | 10.5–14.5 | Start | Required start form (material, thickness, extraction) → live session timer, project "Solar Boat 2027". |
| 4 | 16.1–26.6 | Automate | The real flow (Usage started → If → Send HTTP request / Send MQTT message / Unlock PC / Record operation started) with pulses on its edges; then its effects: Shelly Pro 1PM device, Companion kiosk locked → live session, Electricity · kWh meter. |
| 5 | 28.2–32.2 | Bill | Transaction details: extraction contribution, electricity kWh, per session, per minute. |
| 6 | 33.8–37.8 | Maintain | "Lens & mirror cleaning · 20 h of use (Operating duration)" → live maintenance → completed by Noah Brooks. |
| 7 | 39.4–42.4 | Ready | Resources overview: Trotec Speedy 400 back to "Available". |
| — | 42.4–49 | — | Pull out: the whole loop around the Attraccess lockup; integration chips snap on (OIDC · SAML, WAGO CC100, RabbitMQ, Shelly, Companion, HTTP · Webhooks, SumUp, Prometheus · Grafana, REST · OpenAPI, Attractap, Plugins). Poster frame. |
| — | 49–52 | — | Dolly back to the idle reader → seamless loop point. |

## Visual rules

- Brand: app tokens only (see Outline "Attraccess Corporate Identity — App Brand Reference").
  Dark stage `#162124`, surfaces `#1E2C2F`/`#26363A`, borders `#42575C`, text `#F4F8F8`/`#AFC0C3`,
  accent `#82C4CE`, accent-soft `#203C42`. Water blue `#256D7B` for light moments. Status colors only
  for status. System sans-serif; monospace for identifiers/values. 2 px / 4 px radii, thin borders.
- Mascot never tinted; wordmark from the supplied vector asset.
- Real product UI from a seeded local demo instance (dark appearance primarily). Fictional
  organisation: **North Campus Prototyping Lab** (university teaching workshop, English locale).
- No on-screen claims the product can't back up: no "impossible to bypass", no booking, no safety /
  compliance / GDPR guarantees. Diegetic node labels instead of marketing copy.

## Deliverables

- `apps/hero-film/film/` — editable Remotion source (landscape 16:9 and portrait 4:5 compositions). See `apps/hero-film/README.md`.
- `apps/hero-film/out/` — master + lightweight web exports (AV1/WebM + H.264/MP4), poster stills.
- `apps/hero-film/preview/` — tested hero embed: silent autoplay, seamless loop, responsive framing,
  `prefers-reduced-motion` static fallback.

## File ownership

| Area | Owner |
|------|-------|
| `apps/hero-film/film/`, `apps/hero-film/out/`, `apps/hero-film/preview/`, this brief | Claude |
| `apps/hero-film/docs/research/` | Codex research |
| Demo instance, seed tooling, `apps/hero-film/assets/captures/`, `apps/hero-film/docs/captures.md` | Codex demo/capture |
| `apps/hero-film/assets/reader/`, `apps/hero-film/tools/reader/` | Codex reader renders |
