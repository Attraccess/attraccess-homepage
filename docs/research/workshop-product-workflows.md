# Workshop Product Workflows

Research date: 2026-09-06. Purpose: establish truthful product claims and workflows for an owner-facing, shared-resource marketing homepage. Research only; no application changes, remote mutations, commits, or pull-request inspection.

## Scope And Evidence

The official documentation is a Docsify site. Its HTML specifies `en/` or `de/` as the content base, `home.md` as the homepage, and the official `Attraccess/Attraccess` GitHub repository. Fetching only a hash-route URL would miss the content. This report cites the directly readable official Markdown URLs, not an empty SPA shell. The English and German sidebars were followed through the relevant resource, end-user, forms, automation, hardware, billing, project, permission, and troubleshooting pages. [D00] [D01] [D02]

Where the public guides omit a workflow or contradict one another, this report supplements them with first-party implementation at commit [`9e0a1c47066d5b103ca09606f26f5d2ace6c3091`](https://github.com/Attraccess/Attraccess/commit/9e0a1c47066d5b103ca09606f26f5d2ace6c3091), the repository's `main` revision when checked, committed 2026-09-05. Source links are pinned to that revision. **Source-confirmed does not prove that every deployed release includes a feature.** No live customer instance or physical reader was tested, and the deployed version behind the documentation was not established. The documentation itself says reader firmware is bundled with the running Attraccess release. [D34]

No existing local research-note convention was found: this workspace's `docs/` contained `translation-management.md`. This file uses the requested `docs/research/` location. No collaborative browser tab was opened or changed. PRs #24 and #1816 were not inspected.

Availability labels used below:

| Label | Meaning |
| --- | --- |
| **D: Documented** | Explicitly described in the official user/admin guides. Not a promise about every installed version. |
| **C: Configured** | Requires an owner/admin to set policy, fields, pricing, groups, integrations, or a flow. Not automatic out of the box. |
| **H: Hardware** | Requires the appropriate reader, connectivity, and/or separately integrated physical equipment. |
| **S: Source-confirmed** | Verified in pinned first-party implementation; absent, incomplete, or inconsistent in the public workflow guides. Check the target release before demonstrating. |
| **L: Entitlement** | Depends on a valid license/module entitlement in addition to setup. Current source checks Attractap, billing, and maintenance entitlements; SSO's guide also explicitly requires its module. [S01] [S02] [S03] [S04] [S31] [D30] |
| **U: Unestablished** | No sufficiently specific supporting workflow was found, or the sources conflict. Do not present as an available feature without additional confirmation. |

## Main Conclusions

Additional verification for retained homepage wording: passkey sign-in is present in the [pinned sign-in component](https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/frontend/src/app/unauthorized/passkeyLogin.tsx) and its [English labels](https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/frontend/src/app/unauthorized/passkeyLogin.en.json). It is a separate sign-in option, not an OIDC/SAML protocol. The installation link is [Docker Compose](https://docs.attraccess.org/en/installation/docker-compose.md), not `setup/installation`.

- **The useful product story is a managed handoff, not a decorative connected machine:** identify the user, check resource access, collect the configured information, record use, and prompt the user at the end. These are documented resource/session/form capabilities. "Less chasing and clearer handoffs" is a reasonable owner-value interpretation, not a measured outcome. [D03] [D04] [D05] [D06]
- **Dirty leftovers and missing parts can be made explicit through human input.** The docs specifically give "Workspace cleaned?" as a Boolean-field example. Owners can configure checks or text/select questions about accessories and damage. The latter are applications of the form builder, not built-in inventory or damage-detection features. [D05] [D06]
- **A real problem-reporting path exists in current source:** `Report a problem` / `Problem melden`, a text reason, and `Send request` / `Anfrage senden`. Authorized personnel can start maintenance from the request or dismiss it. **Submitting a request does not itself put the resource into maintenance.** This workflow is not explained on the public maintenance page. [S04] [S05] [S06] [S07] [S08] [S09] [S10] [D07]
- **Maintenance is more than a note in current source:** an active open-ended maintenance window blocks ordinary new usage; maintenance-authorized personnel can still use the resource for service. A configured health signal can separately block access. Neither means the product diagnoses every physical fault or performs certified emergency isolation. [S11] [S12] [S13] [S14]
- **Use a Touch reader for a screen-based story.** Current firmware contains real start/end controls, a project picker, and one-field-at-a-time forms. Do not imply that all readers have these screens, or that one NFC tap always completes a session start. [S15] [S16] [S17] [S18] [D10]
- **Keep daily interaction proportional to policy.** A returning, already authorized user need not obtain a new manual introduction for each session under the normal solo-use policy. Required forms, supervision, a due retraining policy, insufficient credit, maintenance, and unavailable connectivity can still add steps or prevent starting. [D03] [D04] [S12] [S19] [S20] [D08]

## Owner Pain To Workflow Matrix

These are concrete supported interventions, not guarantees that human behavior or physical conditions improve. Custom question examples are proposed configuration, not shipped default text.

| Owner pain | Supported intervention and status | Exact user/personnel workflow | Caveats and owning evidence |
| --- | --- | --- | --- |
| "People use machines without the right briefing." | Resource or resource-group introductions; audited grant/revoke. **D, C** | Authorized introducer/resource manager opens resource details, finds **Introductions**, chooses **Add Introduction**, selects the user, optionally adds a comment, and confirms. User then starts their own usage session. | An introduction records a permission and the briefing decision; it does not itself teach or test competence. Revocation prevents new sessions but explicitly does not interrupt an existing session. Applicable group grants also matter. [D04] [D11] |
| "I need trainees to practice without giving unrestricted access." | Optional or mandatory supervised usage; optional automatic introduction after completed supervised sessions. **D, C** | Manager selects **Supervision allowed** or **Supervision required**. User requests a supervised start on the resource page or appropriate reader flow. An eligible introducer confirms, the user completes required forms, and the session records the supervisor. | Supervisor must be an introducer for the resource or an applicable group; a maintainer/resource manager is not automatically a supervisor. A configured threshold counts completed supervised sessions, not an automated skill assessment. [D03] [D04] |
| "Every returning member needs staff help again." | Account-linked card identification or browser/PWA login; existing resource/group authorization. **D, C; H/L for reader** | Provision account and compatible card once. Returning user presents their card at a connected, assigned reader, or logs into the web app and opens the resource. They use the available session action and satisfy any configured prompts. | Do not promise "no login ever," "one tap regardless of policy," or "authorized forever." Retraining can block stale introductions in current source. SSO and PWA are app login/access options, not proof that a phone can emulate an enrolled NFC card. [D03] [D08] [D09] [D12] [D13] [S12] [S19] |
| "Nobody checks accessories before use." | Required start form with Boolean, Select, Text, or Number fields. **D, C; S/H for exact Touch UI** | Manager opens resource **Forms**, creates a form required at **Session Start**, adds fields, and saves. At start the user answers the questions; the Touch reader shows the configured field, then **Weiter** or **Absenden**. | Example: ask for accessory condition with a required Select and an optional note. A required Boolean must be **true**, not simply answered. The system records the answer; it does not count or locate parts. [D05] [D06] [S16] |
| "Someone leaves dust, scraps, or a dirty work area." | End-of-session cleanup acknowledgement. **D, C** | Configure an end form such as **Workspace cleaned?**. User physically cleans up, chooses **End Usage** in the app or **Sitzung beenden** on Touch, answers the form, and submits it before the ordinary end action succeeds. | Cleanup is performed and assessed by the person. A confirmation is not sensor evidence. A required Boolean blocks normal submission when false; avoid forcing a dishonest "all clean" answer if cleanup is impossible. See form-design guidance below. [D05] [D06] [S16] [S20] |
| "A part is missing or there is visible damage, but I only hear later." | Configured condition questions and session notes; separate problem request. **D/C for forms; S/L for request** | At a configured start/takeover/end checkpoint the user records condition. To notify maintenance personnel through the dedicated path, open the resource in the web app, choose **Report a problem**, describe the observation, and choose **Send request**. | No built-in parts inventory, photo attachment, or automatic culprit attribution is established. A form answer is not automatically a maintenance request. A custom form-to-action automation would require explicit setup and release verification. [D05] [D06] [S05] [S06] [S07] [S08] |
| "A machine is broken but nobody knows who should deal with it." | Resource-specific maintenance request with reporter/time; notification dispatch to relevant personnel. **S, L, C** | Ordinary authenticated user submits a reason. Eligible personnel receive configured notifications and open the resource's maintenance view, where the request shows its reason, reporter, and time. | UI sends a text reason; API permits 3-2000 characters. Notification delivery depends on recipients, channel preferences, connectivity and, for email, SMTP. Success text is not a delivery receipt. The ordinary report button is not shown to maintenance managers and is hidden when active maintenance is shown. [S04] [S05] [S06] [S09] [S21] [S22] [S23] [D29] |
| "People keep starting a machine after a fault is reported." | Authorized conversion of a request into immediate maintenance, or a manual maintenance record. **D/S, L** | Maintenance-authorized person opens **Maintenance requests**, chooses **Start maintenance** (or **Dismiss** if not appropriate). Alternatively create **New Maintenance** with reason and start time. After service, use **Mark done** / the documented completion action. | Report creation alone does not block access. Current gate uses started maintenance with no end time and exempts maintenance-authorized personnel. Do not promise that a report, maintenance start, or access revocation physically cuts power to an already-running machine. [D07] [S06] [S09] [S30] [S11] [S12] [S31] |
| "Routine maintenance slips through the cracks." | Schedules by usage hours, session count, or elapsed time. **D, C, L** | Personnel create a **Maintenance Schedule**, select **USAGE_HOURS**, **USAGE_COUNT**, or **TIME_INTERVAL**, enter the threshold, and enable it. When due, personnel perform the work and complete the maintenance. | The guide calls the result a reminder; current source creates an active maintenance record, which can block ordinary new usage. This operational difference must be verified for the deployed release. Usage time is session time, not necessarily measured motor-running time. [D07] [D14] [S11] [S12] |
| "We cannot tell who used the resource and when." | Usage history and associated form submissions/notes. **D** | User explicitly starts and ends use. Personnel open the resource's **Usage History**, review user/start/end/duration/project and submissions; administrators can export usage data as CSV. | Accountability means recorded account activity and statements, not proof that a particular person caused damage. Shared/borrowed cards weaken real-world attribution. Do not promise immutable, private-to-admin, or legally certified evidence: the usage guide says regular users can see full history too. [D14] [D15] [D05] [S24] |
| "An abandoned open session prevents the next user from starting." | Explicit end; optional takeover; configured inactivity flow. **D, C** | Normal path: previous user ends use. If **Allow Takeover** is enabled, next eligible user chooses takeover and completes its configured form. Alternatively owner builds **No Activity -> End Usage Session**, with activity tracking appropriate to the integration. | Takeover is not a reservation/queue system. Inactivity needs correctly configured activity signals; it is not omniscient presence detection. Reader login timeout is not the machine-use session ending. Automated end may bypass end forms in source, so do not say every ending always captures cleanup consent. [D03] [D16] [D17] [D18] [S12] [S25] [S32] |
| "Turning the machine, extraction, and lights on and off is repetitive." | Resource-event flows with MQTT outputs; HTTP/webhook actions. **D, C, H** | Admin connects an external MQTT broker and devices. Build **Usage Started -> MQTT Send Message** and **Usage Ended -> MQTT Send Message** for the device topics/payloads. User starts/ends the ordinary session; the flow sends the configured commands. | Requires suitable relays/controllers and tested wiring/integration. The software does not include an MQTT broker. Sending a command is not proof it executed, nor a certified safety interlock. Do not depict machinery starting its hazardous motion merely because access was granted. [D18] [D19] [D20] [D21] |
| "A controller is offline or a monitored subsystem signals a fault." | Configured resource health state, including payload-derived state; access gate and reason display. **S, C; H for physical signals** | Configure a flow to pass a known status to the health-set node. An unhealthy entry causes an unavailable state and blocks ordinary new use. Authorized personnel investigate; source includes clearing a stuck health entry. | This is defined input, not generic fault diagnosis. With no unhealthy entry, health summary is healthy, including resources with no health monitoring. **Healthy therefore does not certify clean, complete, or physically safe.** [S12] [S13] [S14] [S26] [S15] |
| "Many similar machines make access administration repetitive." | Resource groups and group introductions. **D, C** | Resource manager creates a group from resource details, adds the relevant machines, and grants the user a group introduction rather than separate introductions for every member resource. | Group access applies to all members. Moving resources into/out of a group changes the effective access scope. Groups are not automatically teams, rooms, payment accounts, or a second safety check. [D11] [D04] |
| "A shared room has a door, not just a machine." | **Door** resource with lock/unlock and optional separate unlatch. **D, C, H** | Configure a door resource and its physical control flow/reader. Eligible user identifies, then uses the appropriate door action; Touch firmware has **Abschliessen**, **Aufschliessen**, and **Falle oeffnen** controls. | Separate unlatch must be configured. Door events are not the same as machine start/end sessions; source handles them separately. No explicit shared-area entity, occupancy counting, room booking, or guaranteed evacuation behavior was established. [D22] [D18] [S15] [S12] |
| "We cannot attribute machine use to a shared project." | Project membership/team management and linking usage to a project. **D, C; S/H for reader picker** | User creates a named project, invites account-holding members by email, and members accept. At session start, user selects the project; on Touch this is **Projekt waehlen**, then tap the project name. | Linking groups usage for reporting; it does not by itself transfer payment liability to a pooled project wallet or grant machine access. Project selection is optional in documented usage. [D23] [D24] [D25] [D03] [S17] |
| "Usage charges are hard to keep track of." | Per-session and/or per-minute credit pricing, own transaction history, optional SumUp credit purchase. **D, C, L** | Billing manager configures resource prices. User maintains credit, starts and ends use; end-of-session billing deducts the configured charge. User reviews own balance/history; billing personnel review system transactions. | Source rounds chargeable minutes up and checks at start for at least the flat fee plus one minute when billing is enabled. Do not promise unlimited credit, zero overdraft, exact-second charging, or that every NFC access card is a payment card. SumUp is separately configured; callbacks may need a public URL. [D26] [D27] [D28] [D35] [S19] [S03] |

## Lifecycle Details And Guardrails

### Identification Is Not The Whole Session

Attractap identifies a registered, account-linked card and checks permissions against the backend. The backend and network are required; it is not a standalone offline access controller. The dedicated card guide restricts supported authentication cards to **NTAG424 DNA** and **MIFARE DESFire EV2/EV3**, excluding DESFire EV1, Classic, Ultralight and NTAG213-216. It documents multiple cards per user and immediate revocation of a removed card. Prefer this specific authentication table over generic reader-chip compatibility language elsewhere. [D08] [D09]

The web application identifies users through username/email and password, optionally configured SSO and 2FA. The installable mobile interface is a PWA, not a documented NFC-card-emulation credential. Previously loaded content may be viewed offline; full operation needs a server connection. Do not animate a generic phone held to a reader as if that is a supported replacement for an enrolled card. [D12] [D13] [D30]

For the Touch implementation, scanning opens an authenticated resource interaction; the person explicitly chooses **Ressource verwenden** or **Sitzung beenden**, then handles any forms. Current source has a resource list and automatically selects a sole assigned resource. The setup guide nevertheless says one reader per resource. For a robust demonstration use **one reader assigned to one machine**, avoiding that unresolved multi-resource product-policy discrepancy. [S15] [S18] [S20] [S25] [D31]

Reader UI authentication and a machine's usage session are distinct. Current firmware relocks its local UI after inactivity; it does not call the usage-end API in that timeout branch. A user returning to end a still-running usage session can identify again. Do not end billing or declare the machine free just because the reader returns to its lock screen. [S25] [D03]

### Forms: Before, During, And After

The explicitly documented triggers are **Session Start**, **Session Takeover**, and **Session End**. "During use" should not be expanded into arbitrary timed inspection popups, continuous checks, or a general submit-anytime checklist. Takeover is the documented checkpoint within an already-running resource-use sequence. The ordinary report action is a separate web workflow, not another documented NFC form trigger. [D05] [D06] [S20] [S23]

Form fields are Text, Number, Boolean, and Select. Owners choose fields, labels, descriptions, options, and whether each answer is required. Required Boolean means **must be Yes/true**; it is not a required Yes-or-No question. Current reader firmware renders Boolean as a switch and Select as option buttons, not the web guide's checkbox/dropdown appearance. It shows one field at a time, with **Weiter**, **Zurueck**, and final **Absenden**. [D05] [D06] [S16]

Recommended configuration, not a product default:

- For an affirmative acknowledgement, use a required Boolean such as "Safety check completed" or "Workspace cleaned?" [D05] [D06]
- For a condition that might truthfully be bad, use a required Select such as "Complete / Part missing / Not checked" plus optional details. This uses documented field types while permitting an honest report. Do not require "Everything is undamaged" as the only way to finish after discovering damage. [D05] [D06]
- Keep ordinary repeat-use forms short. This is a UX recommendation; there is no researched measured completion-time or guaranteed step-count claim.
- Ordinary start/end handlers enforce required submissions. Current source also has an automatic end executor that explicitly sets `skipFormSubmissions: true`; therefore "no session can ever end without a checklist" would be false. [S20] [S12] [S32]

Submissions are associated with the usage session; current web source displays them with session notes. Start/end notes and custom form answers provide contextual records. The inspected standard form types and maintenance-request DTO/UI do **not** include photo/file upload. Resource profile images and images in resource documentation are separate features, not damage-evidence attachments. [D05] [S24] [S05] [S07] [D16] [D33]

### Report, Maintenance, And Health Are Different

**Report:** a human observation and request for attention. The create service saves an open request and emits a notification event. It does not change maintenance or health state. The current UI accepts a reason, not severity, inventory item IDs, attachments, or a full help-desk ticket form. [S04] [S05] [S06] [S07]

**Maintenance:** work explicitly started/planned by an authorized person or a configured schedule. Conversion creates maintenance starting now, then records the request resolution and resolver. Finishing records the completion time and user. Maintenance permission includes system `resources.maintenance.manage` and applicable resource/group maintenance personnel; "only the site administrator can act" is too restrictive. [S06] [S11] [D04] [D36]

**Health:** configured technical status input. An unhealthy entry blocks normal new use; maintenance-authorized personnel can still investigate. Source exposes setting state through a flow and clearing a stuck entry. This is not an image-recognition, cleanup-verification, missing-parts, or universal predictive-maintenance system. [S12] [S13] [S14] [S26]

**Physical control:** separately integrated output. The supported MQTT example sends ON/OFF commands to a relay. The software access gate and the physical machine being isolated are not interchangeable claims. In particular, the examined request and maintenance code does not establish an automatic emergency-stop behavior for an already-running session. [D20] [S06] [S11] [S12]

## Claims Not To Make

| Tempting claim | Evidence boundary / safer alternative |
| --- | --- |
| "Attraccess detects dirt, scraps, missing parts, or visible damage automatically." | Unsupported by the researched standard features. Say **ask users to check and record condition**. Technical monitoring only knows configured input. [D05] [S14] [S26] |
| "A green state means the machine is safe, clean, and complete." | Incorrect inference: source reports healthy when there are no unhealthy entries, even without health-monitoring nodes. Describe it as configured availability/technical state, not a physical inspection result. [S13] [S14] |
| "You know who broke it." | Session history and reporter identity are contextual records, not causal proof. Say **see who used it, when, and what they reported**. [D14] [S09] |
| "Take a photo of the damage at the reader/in the standard report." | No supported camera/upload step found in the inspected form and request UI/schema. Resource images and documentation images do not establish report attachments. [D05] [S05] [S07] [S16] [D33] |
| "One report immediately shuts down the machine." | False for the dedicated request create service. A maintenance-authorized person converts it; physical switching is a separate integration. [S06] [S11] [D20] |
| "The NFC reader guarantees safe operation or replaces a safety interlock." | No certification or such guarantee is established. Depict permission checking and configured machine control, not replacement of physical safety measures. [D08] [D20] |
| "Any NFC card, key fob, bank card, phone, or watch will work." | The dedicated card guide specifies compatible cryptographic card families. No blanket device/card claim is supported. Identification and SumUp payment are separate workflows. [D09] [D26] |
| "No forms, app, staff, or network are ever needed." | Depends on interaction channel and policy. Readers need the backend; forms and supervision can be required. The web/PWA path exists but does not make reader access offline. [D03] [D05] [D08] [D12] |
| "Once briefed, authorized forever." | Access can be revoked; group membership changes matter; current source supports due retraining based on briefing age or inactivity, optionally blocking access. [D04] [S27] [S12] |
| "Checklists pop up whenever a machine needs checking." | Only start/takeover/end are documented form checkpoints. Arbitrary recurring or sensor-triggered in-session forms were not established. [D05] [D18] [S20] |
| "Automatic reminders always reach the owner." | Notification dispatch respects channel preferences and can fail; SMTP/push/device/session conditions apply. Say **notify the relevant personnel through configured channels**. [S21] [S22] [D29] |
| "Shared areas include bookings, occupancy counts, capacity management, or anti-passback." | No concrete workflow establishing these was found. The glossary's isolated "booked" wording is insufficient evidence for a reservation product. Demonstrate door access and resource groups instead. [D22] [D11] [D37] |
| "A project pays for everything from its own pooled wallet." | Project-linked usage is documented; a project wallet/payment responsibility model is not established by these sources. [D23] [D26] |
| "Billing prevents all overdrafts, charges by the exact second, or automatically bills replacement parts." | Current source checks an initial amount and rounds minutes up; damages/parts are not automatically measured or charged. Additional billing items require explicit flow configuration. [S19] [D18] [D26] |
| "All these capabilities are enabled in every installation." | Settings, version, hardware, integration, permission, and module entitlements matter. No commercial packaging/pricing promise follows from the docs' broad feature overview. [S01] [S02] [S03] [S04] [D30] [D34] |

## Documentation Conflicts And Gaps

These should remain visible to anyone turning the findings into production copy or an interactive demo.

| Topic | Conflict or omission | Research decision |
| --- | --- | --- |
| NFC card compatibility | Attractap overview/hardware mention generic MIFARE/NTAG reading; dedicated NFC Cards explicitly requires AES-capable NTAG424 DNA or DESFire EV2/EV3. [D08] [D09] [D38] | Cite the dedicated authentication table; never use "any NFC card." |
| Lite hardware | Hardware table says Lite has a basic LCD, while the dedicated Lite LED guide says it has no display and uses a 24-LED ring. [D38] [D10] | Use a named Touch variant for screen demonstrations. Do not draw a touchscreen on Lite. |
| Reader/resource assignment | Setup headings say resource(s), but its note says one resource per reader. Firmware implements a resource list and the single-resource shortcut. [D31] [S25] | Use one machine per reader in the story; multi-resource support needs target-release confirmation. |
| Who may manage maintenance | Maintenance page says Manage Resources permission; introductions page allows maintainers/introducers; granular permissions page and maintenance service have more precise rules. [D07] [D04] [D36] [S11] | Use "maintenance-authorized personnel" and distinguish resource roles from system-wide roles. |
| Maintenance schedule effect | Public text says a reminder; source creates a started, open maintenance record that gates normal usage. [D07] [S11] [S12] | Flag both, do not present it as harmless reminder-only behavior. |
| Problem reports | No public maintenance-request walkthrough in the inspected maintenance guide. Current request UI/API and review UI are implemented. [D07] [S04] [S07] [S09] | Label S/L; verify deployed version. Do not fabricate a reader-native problem-report screen. |
| Broad forms wording | "During resource usage" is broad, but the concrete trigger list is only start/takeover/end. [D05] [D06] | Use lifecycle-specific wording, not continuous or arbitrary in-session checklists. |
| Access without introductions | End-user guide says some resources can be available without a briefing; introductions guide says introduction required. Current ordinary authorization path checks valid resource/group grants or elevated resource roles, with supervised usage handled separately. [D03] [D04] [S12] | An unrestricted-resource configuration workflow was not established. Do not build the main story around that exception. |
| Billing insufficiency | Billing overview vaguely allows configuration-dependent recording with insufficient credit; current start handler rejects insufficient initial balance. [D26] [S19] [S20] | Keep sufficient existing credit as a story precondition. Do not promise always-start or hard prepaid shutdown. |
| Booking | Glossary says resources can be booked; no booking walkthrough appeared in either sidebar or the followed resource/project docs. [D01] [D02] [D37] | Booking remains unestablished, not a homepage feature inferred from one word. |
| Retraining and health | Pinned implementation has both; no dedicated public user walkthrough found in the sidebars. [S27] [S13] [D01] [D02] | Useful caveats/additional configured features, not invented onboarding screens. |
| Exact labels and release state | Guides alternate **Start Usage**, **Start Session**, **Nutzung starten**; firmware says **Ressource verwenden**. Many public pages contain screenshot TODOs. [D03] [D14] [D39] [S15] | Distinguish suggested marketing wording from literal UI. Pinned source is stronger evidence for exact screens, but still verify the release to be represented. |

## German And English Terminology

Use concrete workshop language for owners; reserve implementation terms for detail. The German phrases below are copy recommendations unless explicitly marked as literal UI. ASCII spellings are used for firmware labels exactly as stored; prose proposals avoid treating these as a promise of an English reader locale.

| Concept | Recommended German | Recommended English | Precision / source |
| --- | --- | --- | --- |
| Product | Attraccess | Attraccess | Software/platform name. [D40] |
| Physical card reader | Attractap NFC-Leser | Attractap NFC reader | Do not call the app Attractap or the reader Attraccess. [D08] |
| Managed thing | Maschine, Werkzeug; Ressource in detailed UI | Machine, tool; resource in detailed UI | Also supports Door as a resource type. [D22] |
| Owner audience | Betreiber gemeinsam genutzter Arbeitsbereiche | Operators of spaces with shared equipment | Audience framing, not a specialized "shared area" database feature. [D40] [D22] |
| Briefing | Einweisung; Sicherheitseinweisung | Safety briefing; introduction in existing product UI | "Introduction" alone is unclear marketing English; explain once. [D04] [D41] |
| Authorized trainer | Einweiser; einweisungsberechtigte Person | Authorized instructor; introducer in product UI | Can grant/revoke introductions. Do not confuse with any senior member. [D04] [D41] |
| Service role | Wartungsberechtigte; Wartender in glossary | Maintainer / maintenance-authorized person | Maintainer does not automatically grant introductions. [D04] [D41] |
| Supervised operation | Beaufsichtigte Nutzung | Supervised use | Qualified supervisor confirmation, not remote surveillance. [D03] [D04] |
| Identity action | NFC-Karte vorhalten | Present/tap your NFC card | "Tap" means present the physical card, not touch the screen or a payment transaction. [D09] |
| Start | Nutzung starten | Start usage / start a session | Marketing/web wording. Exact Touch label: **Ressource verwenden**. [D39] [D03] [S15] |
| Finish | Nutzung beenden | End usage / end a session | Exact Touch label: **Sitzung beenden**. Not **Abmelden**, which logs out of the reader UI. [S15] [S18] |
| Check before use | Check vor der Nutzung | Pre-use check | Configured start form, not a built-in automated inspection. [D05] [D06] |
| End checkpoint | Arbeitsplatz sauber hinterlassen? | Workspace cleaned? | User acknowledgement. End-form example is directly documented. [D05] [D42] |
| Condition note | Zustand dokumentieren; fehlende Teile melden | Record condition; report missing parts | Configuration/application of text/select fields, not inventory tracking. [D05] [D06] |
| Fault report | **Problem melden** | **Report a problem** | Literal current web trigger. Followed by **Wartung anfragen** / **Request maintenance**. [S08] [S10] |
| Maintenance state | In Wartung | Under maintenance | More precise than "permanently disabled" or "broken." [D07] [S11] |
| Technical health | Betriebszustand; technical details: Device health | Device health / monitored component status | Do not translate healthy into "safe/clean/complete." [S13] [S14] |
| Recorded activity | Nutzungsverlauf; Nutzungshistorie | Usage history | Avoid "surveillance" and "proof of fault." [D14] [D39] |
| Project | Projekt | Project | Session context and team collaboration, not resource-access authorization. [D23] [D25] |
| Credits | Guthaben | Credit balance | Do not imply a native bank account or payment card. [D26] [D27] |
| Cost model | Nutzungsbasierte Abrechnung | Usage-based billing | Flat fee, per-minute fee, or both when configured. [D27] |
| Automation | Automatisierter Ablauf; Flow in advanced UI | Automation workflow; Flow in advanced UI | Specific configured triggers/actions; not autonomous physical judgment. [D17] [D18] |
| Shared-room access | Raumzugang; Zugang zur Werkstatt | Room/workshop access | Describe the door access point, not unverified room-booking/occupancy features. [D22] |

Suggested owner-facing copy, grounded but **not literal product UI**:

- **DE:** "Maschinen gemeinsam nutzen. Zugang, Nutzung und Wartung im Blick." **EN:** "Share equipment. Keep access, usage, and maintenance in view." [D22] [D04] [D14] [D07]
- **DE:** "Einweisung dokumentieren. Nutzung erfassen. Probleme melden." **EN:** "Record briefings. Track usage. Report problems." The final clause requires the source-confirmed, entitled maintenance-request workflow. [D04] [D14] [S04] [S07]
- **DE:** "Kurze Checks vor dem Start und zum Abschluss." **EN:** "Short checks before starting and when finishing." Add "configurable" in supporting text; do not imply automatically supplied checklists. [D05] [D06]
- **DE:** "Karte vorhalten, Nutzung starten, loslegen." **EN:** "Tap your card, start your session, get to work." Use only with the visible policy/form step and connected-reader preconditions, not as an unconditional one-tap guarantee. [D08] [S15] [S16]

## One Realistic NFC-Only User Story

### Preconditions

This is a **configured Touch-reader example**, not a claim about default setup or Lite. Lea is a returning member with a compatible enrolled card, a still-valid introduction for the machine (direct or group), and no supervision/retraining block. The machine is available and not under maintenance/unhealthy. A connected Touch reader is assigned to this one machine; required module entitlement exists. Billing is either not configured or Lea already has sufficient credit. [D09] [D04] [D31] [S02] [S12] [S19]

The owner has created **one required Boolean at start**, named `Zubehoer geprueft?`, and **one required Boolean at end**, named `Arbeitsplatz sauber hinterlassen?`. These are sample operator-authored field names, not default checklists. For realistic negative findings, the owner should additionally provide an honest condition-report option as described above; do not pretend these checkboxes detect anything. [D05] [D06]

### At The Machine

| Step | What Lea actually does | Supported reader state/action | Owning evidence |
| --- | --- | --- | --- |
| 1. Identify | Holds her enrolled NFC card to the connected reader. | Successful card authentication unlocks the reader interaction. With one resource assigned, that resource is selected automatically. | [D08] [D09] [S25] [S28] |
| 2. Start | Sees the machine name and chooses **Ressource verwenden**. | Real Touch resource-detail action. Do not replace it with a fabricated instant-power-on screen. | [S15] [S18] |
| 3. Pre-use check | Looks at the actual accessories, then enables the `Zubehoer geprueft?` switch and selects **Absenden**. | Form context is **Bitte vor dem Start ausfuellen**, the configured question is shown, and a required Boolean must be true. One field means the final button is **Absenden**, not **Weiter**. | [S16] [D06] |
| 4. Session active | Waits for successful completion, then operates the machine according to its real-world instructions. | Firmware uses the success toast **Erfolgreich**; resource details support **Startzeit**, **Nutzer**, and **Dauer**. The backend starts the session after forms are satisfied. | [S29] [S15] [S20] |
| 5. Work and clean | Makes the item, removes her material and scraps, cleans the work area, and returns accessories herself. | These are physical human actions, not automatic Attraccess actions. Reader UI can relock during use without ending the machine session. No mid-session inspection popup is needed or asserted. | [S25] [D05] |
| 6. Identify again | If the reader has relocked, presents the same card again. | The resource still has her active session, so the appropriate action is **Sitzung beenden**. | [D03] [S15] [S25] |
| 7. End | Chooses **Sitzung beenden**. | Ordinary end action requests any configured end form instead of assuming that tapping alone ended usage. | [S18] [S20] |
| 8. Confirm handoff | Truthfully enables `Arbeitsplatz sauber hinterlassen?` and selects **Absenden**. | Context is **Bitte vor dem Ende ausfuellen**. After accepted submission and successful end, the reader can show **Erfolgreich**. | [S16] [S20] [S29] |
| 9. Recorded result | Leaves the machine for the next eligible user. | Backend has recorded the ended session and associated form submissions. If billing is configured it charges the account. If an ON/OFF flow is configured it sends the corresponding hardware command. Neither a receipt screen nor a physical cleanliness certification is claimed. | [D14] [D05] [D26] [D20] |

**Optional, verified addition:** before step 2, Lea can use **Projekt waehlen**, tap an existing project name, and then start; the selection is sent with the session. Keep this out of the shortest default story unless project attribution is the owner pain being illustrated. [S17] [S18] [D23]

**Exception boundary:** if Lea finds a missing or damaged part, she should not be shown a fabricated reader-native `Report a problem`, camera, or "disable machine" wizard. The dedicated problem-report UI verified here is in the web application. A custom start/end condition field can record a finding at the reader, but there is no default verified conversion from that answer into a maintenance request. Use the separately sourced web/report/maintenance story if showing fault handling. [S07] [S23] [S16] [S06]

**Do not count setup as daily interaction.** Card enrollment, initial briefing, resource configuration, MQTT wiring, forms, and pricing are prerequisite/admin work. Conversely, do not hide required daily forms or supervision merely to claim "one tap." The truthful low-friction message is that returning users can complete their configured session flow at the machine without reopening the app for that ordinary Touch-reader path. [D09] [D04] [D06] [D20] [S15] [S16] [S18]

## Homepage Research Recommendation

Use a short normal-use sequence as the primary demonstration: **known user -> appropriate access -> brief configured check -> recorded use -> confirmed handoff**. Show the owner benefit in plain language beside it, rather than unexplained status lights. This is an editorial recommendation derived from the supported lifecycle, not a new product feature. [D03] [D04] [D05] [D14]

Use a clearly separate exception example for **observation -> web problem request -> authorized maintenance -> ordinary users cannot start -> service completed**. Do not splice that into a fake all-in-one NFC reader UI, and do not skip the human decision between report and maintenance. [S07] [S06] [S09] [S11] [S12]

Before public screenshots or definitive claims, confirm the exact deployed backend/firmware release, enabled modules, intended reader variant, maintenance-schedule effect, and whether the desired workflow requires an app rather than the reader. These are the remaining release/configuration checks, not reasons to invent screens or advertise unsupported outcomes.

## Official Source Index

All URLs below are first-party sources. `D` references are fetched official docs. `S` references are pinned official repository implementation. Descriptions identify the particular source responsibility; an overview is not substituted for a narrower workflow/schema where one exists.

| Ref | Source responsibility |
| --- | --- |
| [D00] | Docs SPA HTML, language base paths, official repository link. |
| [D01], [D02] | English and German documentation navigation/scope. |
| [D03], [D39] | End-user resource discovery, introduction, supervision, start/end, project workflow. |
| [D04], [D41] | Introductions, resource roles, supervised use, group grants, revocation and audit. |
| [D05], [D06], [D42] | Form trigger boundaries, field types, submission linkage, required-Boolean behavior. |
| [D07] | Manual maintenance, schedule triggers and public reminder wording. |
| [D08], [D09], [D31] | Reader/back-end model, compatible enrollment cards, reader setup. |
| [D10], [D38], [D34] | Lite LEDs, hardware variant descriptions, release-bundled firmware behavior. |
| [D11], [D22], [D16], [D33] | Resource groups, resource types, takeover setting, resource documentation/images. |
| [D12], [D13], [D30] | PWA/offline limits, login, SSO dependency. |
| [D14], [D15] | Session data/history visibility and CSV export. |
| [D17], [D18] | Automation model and concrete trigger/action node list. |
| [D19], [D20], [D21] | MQTT broker dependency, physical-control examples, broker setup. |
| [D23], [D24], [D25] | Projects, creation, membership and invitation workflow. |
| [D26], [D27], [D28] | Credit model, configurable rates, payment provider, transaction visibility. |
| [D29], [D35], [D36] | SMTP, deployment settings, granular system permissions. |
| [D37], [D40] | Glossary wording and overall documented product positioning. |
| [S01], [S02], [S03] | Module entitlements; actual reader connection and billing controller checks. |
| [S04], [S05], [S06] | Maintenance request authentication, reason-only schema, create/resolve semantics. |
| [S07], [S08], [S10], [S23] | Real web report UI, English/German labels, placement/visibility. |
| [S09], [S11], [S30], [S31] | Request review actions and literal labels; maintenance creation/completion, access window, entitlement and personnel checks. |
| [S12] | Ordinary access gates, introduction/retraining paths, form submission enforcement, session/door separation. |
| [S13], [S14], [S26] | Technical health summary defaults, clear-entry action, configured health-setting node. |
| [S15], [S16], [S17], [S18] | Actual Touch screens: start/end, forms, project picker, button API wiring. |
| [S19], [S20] | Billing rounding/initial balance test; reader start/end form handshake. |
| [S21], [S22] | Maintenance notification recipients, preference-aware channels/delivery caveats. |
| [S24] | Actual display of session notes and form submissions in web usage history. |
| [S25], [S28], [S29] | Reader resource selection, local UI timeout, card authentication, success feedback. |
| [S27] | Configured retraining by age or inactivity, optional access blocking. |
| [S32] | Automatic usage-end executor explicitly bypasses end forms. |

[D00]: https://docs.attraccess.org/
[D01]: https://docs.attraccess.org/en/_sidebar.md
[D02]: https://docs.attraccess.org/de/_sidebar.md
[D03]: https://docs.attraccess.org/en/end-user/using-resources.md
[D04]: https://docs.attraccess.org/en/resources/introductions.md
[D05]: https://docs.attraccess.org/en/forms/overview.md
[D06]: https://docs.attraccess.org/en/forms/creating-forms.md
[D07]: https://docs.attraccess.org/en/resources/maintenance.md
[D08]: https://docs.attraccess.org/en/attractap/overview.md
[D09]: https://docs.attraccess.org/en/attractap/nfc-cards.md
[D10]: https://docs.attraccess.org/en/attractap/led-guide.md
[D11]: https://docs.attraccess.org/en/resources/resource-groups.md
[D12]: https://docs.attraccess.org/en/end-user/mobile-pwa.md
[D13]: https://docs.attraccess.org/en/end-user/login.md
[D14]: https://docs.attraccess.org/en/resources/usage-tracking.md
[D15]: https://docs.attraccess.org/en/resources/csv-export.md
[D16]: https://docs.attraccess.org/en/resources/creating-resources.md
[D17]: https://docs.attraccess.org/en/flows/overview.md
[D18]: https://docs.attraccess.org/en/flows/node-types.md
[D19]: https://docs.attraccess.org/en/devices/mqtt/overview.md
[D20]: https://docs.attraccess.org/en/devices/mqtt/examples.md
[D21]: https://docs.attraccess.org/en/devices/mqtt/server-setup.md
[D22]: https://docs.attraccess.org/en/resources/overview.md
[D23]: https://docs.attraccess.org/en/projects/overview.md
[D24]: https://docs.attraccess.org/en/projects/creating-projects.md
[D25]: https://docs.attraccess.org/en/projects/team-management.md
[D26]: https://docs.attraccess.org/en/billing/overview.md
[D27]: https://docs.attraccess.org/en/billing/configuration.md
[D28]: https://docs.attraccess.org/en/billing/transactions.md
[D29]: https://docs.attraccess.org/en/setup/smtp-email.md
[D30]: https://docs.attraccess.org/en/user-management/sso-overview.md
[D31]: https://docs.attraccess.org/en/attractap/setup.md
[D33]: https://docs.attraccess.org/en/resources/documentation.md
[D34]: https://docs.attraccess.org/en/attractap/firmware-updates.md
[D35]: https://docs.attraccess.org/en/installation/environment-variables.md
[D36]: https://docs.attraccess.org/en/user-management/permissions.md
[D37]: https://docs.attraccess.org/en/faq/glossary.md
[D38]: https://docs.attraccess.org/en/attractap/hardware.md
[D39]: https://docs.attraccess.org/de/end-user/using-resources.md
[D40]: https://docs.attraccess.org/en/home.md
[D41]: https://docs.attraccess.org/de/resources/introductions.md
[D42]: https://docs.attraccess.org/de/forms/overview.md
[S01]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/license/license.service.ts
[S02]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/attractap/websockets/websocket.gateway.ts#L163-L172
[S03]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/billing/billing.controller.ts#L49-L52
[S04]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/maintenances/maintenance-request.controller.ts
[S05]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/maintenances/dtos/create-maintenance-request.dto.ts
[S06]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/maintenances/maintenance-request.service.ts
[S07]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/frontend/src/app/resources/details/maintenance-management/request/index.tsx
[S08]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/frontend/src/app/resources/details/maintenance-management/request/en.json
[S09]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/frontend/src/app/resources/details/maintenance-hub/requests-section.tsx
[S10]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/frontend/src/app/resources/details/maintenance-management/request/de.json
[S11]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/maintenances/maintenance.service.ts
[S12]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/usage/resourceUsage.service.ts
[S13]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/health/resource-health.controller.ts
[S14]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/health/resource-health.service.ts
[S15]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/attractap/firmware/src/display/screens/resourceDetails/resourceDetailsScreen.cpp
[S16]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/attractap/firmware/src/display/screens/resourceDetails/resourceDetailsForms.cpp
[S17]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/attractap/firmware/src/display/screens/resourceDetails/resourceDetailsProjects.cpp
[S18]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/attractap/firmware/src/application/application_session.cpp
[S19]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/billing/billing.service.ts
[S20]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/attractap/websockets/handlers/session.handler.ts
[S21]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/maintenances/maintenance-request-notification.listener.ts
[S22]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/notifications/notification-dispatch.service.ts
[S23]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/frontend/src/app/resources/usage/components/ResourceUsageSession/index.tsx#L162-L172
[S24]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/frontend/src/app/resources/usage/components/UsageNotesModal/index.tsx
[S25]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/attractap/firmware/src/application/application_state.cpp
[S26]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/flows/node-executors/health-set.executor.ts
[S27]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/retraining/resourceRetraining.service.ts
[S28]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/attractap/firmware/src/application/application_cards.cpp
[S29]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/attractap/firmware/src/application/application.cpp#L237-L264
[S30]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/frontend/src/app/resources/details/maintenance-hub/en.json
[S31]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/maintenances/maintenance.controller.ts
[S32]: https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091/apps/api/src/resources/flows/node-executors/end-usage-session.executor.ts
