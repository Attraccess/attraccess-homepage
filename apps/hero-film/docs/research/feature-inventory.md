# Verified feature inventory — “Closed Loop”

Verified 2026-10-14 against software commit `a4d5e3b772686164dc353f2449edf0617a3509f5`. Scope: source inspection, English translation files and asset metadata; no server, hardware or payment execution. Current code takes precedence over FEATURES.txt and older docs. IMPLEMENTED means a concrete implementation exists, not that every external device/platform has been tested here. PARTIAL marks a materially narrower implementation. PLANNED-or-NOT-FOUND means no supporting implementation was found; it does not imply a roadmap promise. All paths are workspace-relative.

## Film-critical corrections

| Brief element | Verified decision for production | Evidence |
|---|---|---|
| Reader with screen | Use **Attractap Touch** or **Attractap Touch V2**. Lite is headless with a 24-LED ring. | `software/apps/attractap/firmware/variants/attractap-lite-ethernet.cmake`; `software/apps/attractap/firmware/variants/attractap-touch.cmake`; `software/apps/attractap/firmware/variants/attractap-touch-v2.cmake` |
| Card tap → running machine | Touch authenticates the person, then offers resource actions. Show the start action, or treat the tap→run transition as compressed storytelling; do not imply every Touch tap automatically starts a session. Physical enablement requires the configured integration/flow. | `software/apps/attractap/firmware/src/application/application_cards.cpp`; `software/apps/attractap/firmware/src/application/application_session.cpp`; `software/apps/api/src/resources/flows/execution/trigger-dispatcher.ts` |
| English reader render | The genuine firmware screen copy is predominantly **German**, independent of English web UI: “RFID-Karte auflegen”, “Nutzung gestartet”, “Aufsicht erforderlich”. Do not present an English redraw as a current firmware capture. | `software/apps/attractap/firmware/src/display/screens/lockscreen/lockscreen.cpp`; `software/apps/attractap/firmware/src/application/application.cpp`; `software/apps/attractap/firmware/src/display/screens/supervision/supervisionScreen.cpp` |
| `Session started` / `MQTT publish` | Exact flow labels are **Usage started** / **Send MQTT message**. “Session Started” exists as a web toast, not this node title. | `software/apps/frontend/src/app/resources/details/flows/node/en.json`; `software/apps/frontend/src/app/resources/usage/components/StartSessionControls/translations/en.json` |
| `Shelly · On` node | No Shelly flow node registered. Configure a **Send HTTP request** or **Send MQTT message** to compatible Shelly equipment; a custom node label can describe that demo, but is not a built-in Shelly node. | `software/apps/plugins/shelly/backend/plugin.ts`; `software/apps/api/src/resources/flows/node-executors/http-send-request.executor.ts`; `software/apps/api/src/resources/flows/node-executors/mqtt-send-message.executor.ts` |
| `Meter · kWh` | Named numeric meters exist, but have **no physical-unit field**. Name the seeded meter “Electricity (kWh)” and report values in that convention. | `software/libs/database-entities/src/lib/entities/resource-meter.entity.ts`; `software/apps/frontend/src/app/resources/details/meters/en.json` |
| Session → billing → maintenance | Supported as a configured demonstration. Maintenance evaluation is scheduled/debounced, not a guaranteed synchronous visual consequence of the billing transaction. Operating-duration schedules use reported operating intervals, not simply logged session duration. | `software/apps/api/src/billing/charges/billing.service.ts`; `software/apps/api/src/resources/maintenances/maintenance-schedule-evaluator.service.ts` |
| All integrations “snap in” as nodes | WAGO has four dedicated nodes; Shelly/RabbitMQ have no dedicated nodes here. OIDC/SAML/REST are identity/API capabilities, not flow node types. | `software/apps/plugins/wago/backend/plugin.ts`; `software/apps/plugins/shelly/backend/plugin.ts`; `software/apps/plugins/rabbitmq/backend/plugin.ts`; `software/libs/database-entities/src/lib/entities/resource-flow-node/node-type.ts` |

## 1. Attractap and QR entry

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | **Attractap Lite — Ethernet** (`attractap_lite`, `ethernet`): headless, PN532 NFC, beeper, W5500 Ethernet, 24-LED status ring. No Lite screen or Lite WiFi variant found. | `software/apps/attractap/firmware/variants/attractap-lite-ethernet.cmake` |
| IMPLEMENTED | **Attractap Touch — WiFi** (`attractap_touch`, `wifi`), V3 hardware; **Attractap Touch — Ethernet**, Qualia board. 480×480 touch display. | `software/apps/attractap/firmware/variants/attractap-touch.cmake`; `software/apps/attractap/firmware/variants/attractap-touch-ethernet.cmake` |
| IMPLEMENTED | **Attractap Touch V2 — WiFi** (`attractap_touch_v2`, `wifi`), V4 hardware. Separate Touch Demo / Touch V2 Demo builds use local mock API; these are demonstrations, not offline production access. | `software/apps/attractap/firmware/variants/attractap-touch-v2.cmake`; `software/apps/attractap/firmware/variants/attractap-touch-demo.cmake`; `software/apps/attractap/firmware/variants/attractap-touch-v2-demo.cmake` |
| IMPLEMENTED | Tap: lockscreen prompt; card authentication with feedback; signed-in resource list/details and personalized access. Start: progress “Starte Sitzung”, refreshed ownership/status, success “Nutzung gestartet”; stop “Nutzung beendet” and own-session summary. | `software/apps/attractap/firmware/src/display/screens/lockscreen/lockscreen.cpp`; `software/apps/attractap/firmware/src/application/application_cards.cpp`; `software/apps/attractap/firmware/src/application/application_session.cpp`; `software/apps/attractap/firmware/src/application/application.cpp`; `software/apps/attractap/firmware/src/application/callbacks/api.cpp` |
| IMPLEMENTED | Denial: introduction-required explanation and introducers; maintenance/health gates; action failure popup “Aktion fehlgeschlagen” with translated error. Supervision screen: “Aufsicht erforderlich” → “Aufsichts-Karte auflegen” → “Karte gelesen...\nbitte nicht bewegen” → “Freigegeben!” or error. | `software/apps/attractap/firmware/src/display/screens/resourceDetails/layout.cpp`; `software/apps/attractap/firmware/src/display/screens/resourceDetails/resourceDetailsScreen.cpp`; `software/apps/attractap/firmware/src/display/screens/supervision/supervisionScreen.cpp`; `software/apps/attractap/firmware/src/application/callbacks/api.cpp` |
| IMPLEMENTED | QR resource entry exists: generated resource URLs with View / Start / StartAndTakeover / Stop actions, browser camera scanner accepts same-origin URLs, action hook performs authenticated resource mutation. QR is a web entry/action path, not proof of NFC authentication or offline authorization. | `software/apps/frontend/src/app/resources/details/qrcode/index.tsx`; `software/apps/frontend/src/app/resources/details/qrcode/action.ts`; `software/apps/frontend/src/app/resources/details/useQrCodeAction.ts`; `software/apps/frontend/src/app/resourceOverview/toolbar/scanner/index.tsx` |
| IMPLEMENTED | Secure-card path identifies NTAG424 and DESFire; DESFire hardware earlier than EV2 rejected. DESFire uses an Attraccess application. Do not generalize to every RFID/NFC card. | `software/apps/attractap/firmware/src/rfid/rfid_contract.hpp`; `software/apps/attractap/firmware/src/rfid/rfid.cpp` |
| IMPLEMENTED | Reader enrollment/provisioning, OTA and diagnostics implementation. Firmware configuration is variant-specific. | `software/apps/attractap/firmware/src/display/screens/enrollment/enrollmentScreen.cpp`; `software/apps/attractap/firmware/src/display/screens/connectionConfiguration/connectionConfigurationScreen.cpp`; `software/apps/attractap/firmware/src/api/ota/ota_updater.cpp`; `software/apps/attractap/firmware/src/api/diagnostics/crash-report.cpp` |

## 2. Introductions, supervision and retraining

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | Resource and group introductions, tutor (`tutorUserId`), completion time, grant/revoke history; resource/group introducers and maintainers. Film can show the introducer and “Supervised by”, but the introduction-history table itself is Date / Action / Comment. | `software/libs/database-entities/src/lib/entities/resourceIntroduction.entity.ts`; `software/apps/api/src/resources/introductions/resouceIntroductions.service.ts`; `software/apps/api/src/resources/groups/introductions/resourceGroups.introductions.service.ts`; `software/apps/frontend/src/components/IntroductionsManagement/history/en.json`; `software/apps/frontend/src/app/resources/PeopleManagement/en.json` |
| IMPLEMENTED | Three modes: Introduction required; Supervision allowed (introduced users independent, others supervised); Supervision required (even introduced users supervised). Supervisor must be an eligible introducer and cannot be requester. Reader card or web approval supported. | `software/libs/database-entities/src/lib/entities/resource.supervision.ts`; `software/apps/api/src/resources/usage/authorization/usage-authorization.ts`; `software/apps/api/src/resources/supervision/supervision.service.ts`; `software/apps/frontend/src/app/resources/editModal/resourceEditModal.en.json`; `software/apps/frontend/src/app/resources/usage/components/SupervisedStartModal/translations/en.json` |
| IMPLEMENTED | Auto-promotion after configured count of **completed** supervised sessions; disabled at null/0; grants resource or group introduction, group count aggregates resources. Promotion does not remove a supervision-required policy. | `software/apps/api/src/resources/usage/sessions/supervised-usage-auto-promotion.listener.ts`; `software/libs/database-entities/src/lib/entities/resource.supervision.ts` |
| IMPLEMENTED | Retraining by maximum introduction age and/or inactivity; optional access block until retrained; age/inactivity triggers can be disabled. | `software/libs/database-entities/src/lib/entities/resource.entity.ts`; `software/apps/api/src/resources/retraining/resourceRetraining.service.ts`; `software/apps/api/src/resources/usage/authorization/usage-authorization.ts` |

Exact English introduction vocabulary (preserve case):

| Terms | Translation source |
|---|---|
| “People & Permissions”, “Introducer”, “Maintainer”, “Introduced”, “Grant introduction”, “Revoke introduction”, “Direct introduction”, “Introduced via {{{group}}}” | `software/apps/frontend/src/app/resources/PeopleManagement/en.json` |
| “Allowed”, “Denied” | `software/apps/frontend/src/components/IntroductionStatusChip/en.json` |
| “Introduction required”, “Supervision allowed”, “Supervision required”, “Supervision mode”, “Auto-promotion to introduction”, “Supervised sessions until introduction”, “Grant introduction for”, “This resource”, “A resource group” | `software/apps/frontend/src/app/resources/editModal/resourceEditModal.en.json` |
| “Retraining Requirement”, “Retrain after (days since training)”, “Retrain after inactivity (days)”, “Block access until retrained” | `software/apps/frontend/src/app/resources/editModal/resourceEditModal.en.json` |
| “Supervisor required”, “Ask an introducer”, “Authenticate at a reader”, “An introducer can approve by tapping their card.” | `software/apps/frontend/src/app/resources/usage/components/SupervisedStartModal/translations/en.json` |
| “Retraining due”, “Access blocked - retraining required” | `software/apps/frontend/src/app/resources/usage/components/RetrainingStatusBanner/translations/en.json` |
| “Supervised by” | `software/apps/frontend/src/app/resources/usage/components/ActiveSessionDisplay/translations/en.json` |

## 3. Sessions, forms and actual operation

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | Start/stop/takeover with authorization and transactional lifecycle; takeover closes prior use and starts the new user. Current person/start/end times and live duration; optional start/end/takeover notes, session history. | `software/apps/api/src/resources/usage/sessions/usage-sessions.ts`; `software/apps/api/src/resources/usage/lifecycle/usage-lifecycle.ts`; `software/apps/frontend/src/app/resources/usage/components/SessionTimer/index.tsx`; `software/apps/frontend/src/app/resources/usage/components/OtherUserSessionDisplay/translations/en.json`; `software/libs/database-entities/src/lib/entities/resourceUsage.entity.ts` |
| IMPLEMENTED | Project on session start and update session attribution; history and project spend aggregation. | `software/apps/api/src/resources/usage/dtos/startUsageSession.dto.ts`; `software/apps/api/src/resources/usage/dtos/updateUsageSessionProject.dto.ts`; `software/apps/api/src/projects/project-usage.service.ts` |
| IMPLEMENTED | Forms on START / TAKEOVER / END; text, number, boolean/checkbox and select fields; required field validation and session-linked submissions. Form answers are mapped into the usage flow payload, so configured flows can consume them for billing. | `software/libs/database-entities/src/lib/entities/form.ts`; `software/apps/api/src/resources/forms/forms.service.ts`; `software/apps/api/src/resources/usage/authorization/usage-authorization.ts` |
| IMPLEMENTED | Record activity and inactivity timeout; explicit operation-start/stop events create operating intervals. Measured operation is distinct from the logged session, and overlapping intervals are attributed to sessions. Not automatic measurement without configured signals. | `software/apps/api/src/resources/flows/node-executors/activity-track.executor.ts`; `software/apps/api/src/resources/flows/execution/resource-monitor.ts`; `software/apps/api/src/resources/flows/node-executors/operating-transition.executor.ts`; `software/apps/api/src/resources/operating-intervals/resource-operating-interval.service.ts`; `software/apps/api/src/resources/operating-intervals/resource-operating-attribution.service.ts` |

## 4. Complete flow-node inventory

**37 core types + 4 WAGO types.** Category below is a functional classification: input = trigger, processing = condition/transform/control, output = action. The current catalog also groups nodes into domains such as “Usage sessions”, “Operation & activity”, “Billing”, “Access & doors”, “Health monitoring”, “Companion device”, “Messaging”, “Web requests”, “Flow control” (`software/apps/frontend/src/app/resources/details/flows/nodeCatalog/en.json`). Availability is resource-type dependent (e.g. machine sessions vs door events).

Every core row is IMPLEMENTED and has three supporting sources:

- **N** = exact English title/description: `software/apps/frontend/src/app/resources/details/flows/node/en.json`.
- **T** = registered enum: `software/libs/database-entities/src/lib/entities/resource-flow-node/node-type.ts`.
- **C** = schema/ports/resource applicability: `software/apps/api/src/resources/flows/schemas/core-node-schemas.ts`; execution registration in `software/apps/api/src/resources/flows/node-executors/index.ts` and trigger dispatch in `software/apps/api/src/resources/flows/execution/trigger-dispatcher.ts`.

| Category | English label | What it does | Source file / registered type |
|---|---|---|---|
| Trigger | Button | This node is triggered when the button is pressed. | N / T / C — `input.button` |
| Trigger | Usage started | Triggers when a usage session starts. | N / T / C — `input.resource.usage.started` |
| Trigger | Usage stopped | Triggers when a usage session stops. | N / T / C — `input.resource.usage.stopped` |
| Trigger | Usage taken over | Triggers when a usage session is taken over. | N / T / C — `input.resource.usage.takeover` |
| Trigger | Door unlocked | This node is triggered when the door is unlocked. | N / T / C — `input.resource.door.unlocked` |
| Trigger | Door locked | This node is triggered when the door is locked. | N / T / C — `input.resource.door.locked` |
| Trigger | Door unlatched | This node is triggered when the door is unlatched. | N / T / C — `input.resource.door.unlatched` |
| Trigger | MQTT message received | This node is triggered when a MQTT message is received. | N / T / C — `input.mqtt.message.received` |
| Trigger | Inactivity timeout reached | Triggers after the resource has had no recorded activity for the configured duration. | N / T / C — `input.resource.activity.no-activity` |
| Trigger | Variable changed | Triggered when a watched flow variable changes value. | N / T / C — `input.variable.changed` |
| Action | Send HTTP request | This node sends a HTTP request. | N / T / C — `output.http.sendRequest` |
| Action | Send MQTT message | This node sends a MQTT message. | N / T / C — `output.mqtt.sendMessage` |
| Action | Add billing item | With this node you can add an additional item to the billing. | N / T / C — `output.resource.billing.calculation.set-additional-items` |
| Action | End active session | Ends the current usage session, optionally with a note. | N / T / C — `output.resource.usage.end-session` |
| Action | Record activity | Records activity for this resource at the current server time. | N / T / C — `output.resource.activity.track-activity` |
| Action | Record operation started | Records that the resource began operating at the current server time. | N / T / C — `output.resource.activity.operating` |
| Action | Record operation stopped | Records that the resource stopped operating at the current server time. | N / T / C — `output.resource.activity.idle` |
| Processing | Wait | This node waits for a certain time. | N / T / C — `processing.wait` |
| Processing / condition | If | If a value matches a comparison operator, the true-output is triggered, otherwise the false-output. | N / T / C — `processing.if` |
| Processing | Set payload | Set or map keys on the payload using templates. | N / T / C — `processing.set-payload` |
| Processing | Wait for MQTT message | Waits for the next MQTT message matching the topic filter; forwards {topic, payload}. | N / T / C — `processing.mqtt.waitForMessage` |
| Processing | Error | This node throws an error and stops the current flow. | N / T / C — `processing.error` |
| Processing | Set variables | Stores one or more flow variables. Keys and values support Handlebars templates. | N / T / C — `processing.variables.set` |
| Processing | Get variables | Reads flow variables and writes them onto the payload at the configured paths. | N / T / C — `processing.variables.get` |
| Action | Send health heartbeat | Marks the resource healthy when this node fires. If no heartbeat arrives within the configured timeout the resource is automatically marked unhealthy. | N / T / C — `output.resource.health.heartbeat` |
| Action | Set health state | Sets the resource health state. Static config values can be overridden by payload fields (health.identifier, health.status, health.reason). | N / T / C — `output.resource.health.set` |
| Action | Lock PC | Locks the screen on a registered companion device. | N / T / C — `output.companion.lock-pc` |
| Action | Unlock PC | Unlocks the screen on a registered companion device. | N / T / C — `output.companion.unlock-pc` |
| Trigger | Companion: machine idle | Fires when a companion device's machine has been idle for the configured threshold. | N / T / C — `input.companion.idle` |
| Trigger | Companion: machine active | Fires when a companion device's machine returns from idle. | N / T / C — `input.companion.active` |
| Trigger | Companion: foreground app changed | Fires whenever the focused application changes on a companion device. Payload includes appName, bundleId (macOS only), and pid. | N / T / C — `input.companion.foreground_app_changed` |
| Trigger | Companion: USB device connected | Fires when a USB device is connected to a companion device. Payload includes vendorId, productId, manufacturer, product and serialNumber. | N / T / C — `input.companion.usb_device_connected` |
| Trigger | Companion: USB device disconnected | Fires when a USB device is disconnected from a companion device. Payload includes vendorId and productId. | N / T / C — `input.companion.usb_device_disconnected` |
| Trigger | Metering start | Runs when a session starts. Prepare the selected meter, then acknowledge with Metering ready. | N / T / C — `input.resource.metering.start` |
| Trigger | Metering collection | Read the selected meter periodically, including outside sessions, and once at session end. | N / T / C — `input.resource.metering.collect` |
| Action | Metering ready | Confirms the meter is initialized. Billed meters require this acknowledgement before the session starts. Failed zero-rate meters are skipped and the session can still start. | N / T / C — `output.resource.metering.ready` |
| Action | Report meter | Report a cumulative counter value or add an increment. Works with or without a running session. | N / T / C — `output.resource.metering.report` |
| Action / WAGO | WAGO command | IMPLEMENTED — Control a configured WAGO logical channel. | `software/apps/plugins/wago/backend/flow/command-node.ts` — `plugin.wago.command` |
| Trigger / WAGO | WAGO event received | IMPLEMENTED — Start on channel state, measurement or fault. | `software/apps/plugins/wago/backend/flow/state-nodes.ts` — `plugin.wago.event-received` |
| Processing / WAGO | WAGO read state | IMPLEMENTED — Read cached channel state/measurement; unavailable branch. | `software/apps/plugins/wago/backend/flow/state-nodes.ts` — `plugin.wago.read-state` |
| Processing / WAGO | WAGO wait for state | IMPLEMENTED — Wait for matching available channel value; timeout branch. | `software/apps/plugins/wago/backend/flow/state-nodes.ts` — `plugin.wago.wait-for-state` |

| Status | Requested node/capability absent from current registration | Evidence / limitation |
|---|---|---|
| PLANNED-or-NOT-FOUND | Dedicated HTTP webhook **input** node | Core enum/schema above has outbound “Send HTTP request”; it can call a webhook URL. No inbound webhook trigger is registered. REST API is a separate seam. |
| PLANNED-or-NOT-FOUND | Separate “Template” node | Templates are implemented within Set payload, Set variables, Error and request/config fields; see `software/apps/api/src/resources/flows/execution/flow-template.ts`. No standalone Template type. |
| PLANNED-or-NOT-FOUND | “Billing calculation started” trigger | Stale English translation exists, but no matching enum/schema type in T/C. Do not use it as a current selectable node. Current action is singular **Add billing item**. |
| PLANNED-or-NOT-FOUND | Shelly node / RabbitMQ or AMQP node / card-tapped node / OIDC or SAML node | `software/apps/plugins/shelly/backend/plugin.ts`; `software/apps/plugins/rabbitmq/backend/plugin.ts`; T/C. Shelly control can use generic HTTP/MQTT; RabbitMQ contributes broker-management capabilities, not flow nodes. |

## 5. Meters

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | Multiple unique named meters per resource; fixed-point numeric counters; lifetime total includes outside-session readings and current session consumption is separate. UI: Meters / Meter name / Lifetime total / Current session / Waiting for a reading. | `software/libs/database-entities/src/lib/entities/resource-meter.entity.ts`; `software/apps/api/src/resources/metering/resource-metering.service.ts`; `software/apps/frontend/src/app/resources/details/meters/en.json` |
| PARTIAL | Physical units: **no unit field**. Name/convention supplies kWh, liters, material etc.; no automatic conversion or built-in electricity-specific meter. | `software/libs/database-entities/src/lib/entities/resource-meter.entity.ts`; `software/apps/api/src/resources/metering/resource-metering.dto.ts` |
| IMPLEMENTED | Report cumulative total or increment; preparation/acknowledgment before start, periodic collection including outside sessions, final collection/retries at end; missing final readings can leave charge pending. Billed meters require readiness; failed zero-rate meters can be skipped. | `software/apps/api/src/resources/metering/resource-metering.service.ts`; `software/apps/api/src/resources/metering/metering-settlement.ts`; `software/apps/api/src/resources/flows/node-executors/metering-report.executor.ts`; `software/apps/frontend/src/app/resources/details/flows/node/en.json` |
| IMPLEMENTED | Per-meter creditsPerUnit; zero disables billing, rates snapshotted at session start. UI says “per measured value”, not a selected physical unit. | `software/libs/database-entities/src/lib/entities/resource-meter.entity.ts`; `software/apps/frontend/src/app/resources/details/meters/en.json`; `software/apps/api/src/resources/metering/metering-settlement.ts` |

## 6. Maintenance and health

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | Schedules: TIME_INTERVAL (elapsed calendar duration), USAGE_COUNT (session count), USAGE_HOURS (selectable **Session duration** or **Operating duration** basis; operation includes time outside sessions). Minutes/hours/days configuration; baseline last completed schedule maintenance or fallback creation. Calendar interval is not evidence of arbitrary cron/date-recurrence rules. | `software/libs/database-entities/src/lib/entities/resource-maintenance-schedule.entity.ts`; `software/apps/api/src/resources/maintenances/maintenance-schedule-evaluator.service.ts`; `software/apps/api/src/resources/maintenances/maintenance-schedule.service.ts`; `software/apps/api/src/resources/maintenances/evaluation/resource-evaluation.ts` |
| IMPLEMENTED | Automatic maintenance creation; active maintenance and unhealthy health entries block ordinary users at resource control/start. Maintenance-authorized users allowed for diagnosis/repair. Do not imply that merely reaching a number physically kills machine power. | `software/apps/api/src/resources/maintenances/maintenance-schedule-evaluator.service.ts`; `software/apps/api/src/resources/usage/authorization/usage-authorization.ts` |
| IMPLEMENTED | Maintenance requests/periods and completion history; health states Healthy / Unhealthy by source identifier; heartbeat timeout automatically marks unhealthy; manual clear; notifications. | `software/apps/api/src/resources/maintenances/maintenance.controller.ts`; `software/libs/database-entities/src/lib/entities/resource-maintenance-request.entity.ts`; `software/apps/api/src/resources/health/resource-health.service.ts`; `software/apps/api/src/resources/health/resource-health-notification.listener.ts`; `software/apps/frontend/src/app/resources/details/health-state/en.json` |

| Status | Additional maintenance boundary | Evidence |
|---|---|---|
| IMPLEMENTED | Scheduled-maintenance and maintenance-request notifications; reasons, creator and completer identities | `software/apps/api/src/resources/maintenances/maintenance.service.ts`; `software/apps/api/src/resources/maintenances/maintenance-request-notification.listener.ts`; `software/libs/database-entities/src/lib/entities/resource.maintenance.ts` |
| PLANNED-or-NOT-FOUND | Maintenance photo attachments, per-task assignee field, or configurable advance reminder offsets | No such fields in current maintenance/request entities or maintenance UI. Resource maintainers are authorized people, not a per-task assignment. `software/libs/database-entities/src/lib/entities/resource.maintenance.ts`; `software/libs/database-entities/src/lib/entities/resource-maintenance-request.entity.ts`; `software/apps/frontend/src/app/resources/details/maintenance-hub/index.tsx` |

## 7. Billing and payments

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | Per-use, session-minute and operating-minute rates; session and operating minutes rounded upward separately; flow-added item quantities × unit prices; user billing factor; transaction/balance ledger. Film can show per-minute + measured charge after configured collection. | `software/apps/api/src/billing/charges/billing.service.ts`; `software/libs/database-entities/src/lib/entities/resource-billing-configuration.entity.ts`; `software/apps/api/src/billing/accounting/billing-ledger.ts`; `software/apps/api/src/resources/flows/node-executors/billing-set-additional-items.executor.ts` |
| IMPLEMENTED | Meter rates, readings and pending settlement, separate from time fees. Snapshot protects current sessions from rate changes. | `software/apps/api/src/resources/metering/metering-settlement.ts`; `software/libs/database-entities/src/lib/entities/resourceUsage.entity.ts` |
| IMPLEMENTED | SumUp top-up checkout/reader integration and callback processing; administrative balance adjustment/refund/history. External SumUp account and connectivity required for a real payment. | `software/apps/api/src/billing/sumup/sumup.service.ts`; `software/apps/api/src/billing/billing.controller.ts`; `software/apps/frontend/src/app/billing/dashboard/topup/en.json` |
| PARTIAL | Currency: only **EUR** in supported configuration enum. Store/payment amounts use currency minor unit; do not imply multi-currency support. | `software/apps/api/src/billing/dto/set-configuration.dto.ts`; `software/apps/api/src/billing/sumup/sumup.service.ts` |

## 8. Projects

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | Projects and member invitations; owner management, membership and permission checks; sessions attributed to project; usage history, sessions/minutes/spend summaries across resources. | `software/apps/api/src/projects/projects.service.ts`; `software/apps/api/src/projects/project-invitations.controller.ts`; `software/apps/api/src/projects/project-access.service.ts`; `software/apps/api/src/projects/project-usage.service.ts`; `software/apps/frontend/src/app/projects/details/components/projectSummaryCards/en.json` |
| PARTIAL | Team roles: current ProjectMemberRole enum has only **VIEWER**. Owner is separate. Cost attribution aggregates credits charged for project sessions; no separate pooled project wallet or broad editor/admin project-role hierarchy proven. | `software/libs/database-entities/src/lib/entities/project-member.entity.ts`; `software/apps/api/src/projects/project-access.service.ts`; `software/apps/api/src/projects/project-usage.service.ts` |

## 9. Plugins and SDK

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | WAGO: /wago controllers, commissioning/configuration/history, resource diagnostics, CC100 runtime and logical/physical channel mapping; digital I/O and Modbus configuration. Four nodes listed above. Hardware profiles include 751-9301, 879-3000, 879-1300 and modbus; channel foundations include generic digital output. | `software/apps/plugins/wago/frontend/src/plugin.tsx`; `software/apps/plugins/wago/backend/plugin.ts`; `software/apps/plugins/wago/backend/configuration/model.ts`; `software/apps/plugins/wago/backend/commissioning/service.ts`; `software/apps/plugins/wago/cc100-runtime/manifest.json` |
| IMPLEMENTED | Shelly: /shelly device registry, manual IP add, mDNS/network discovery/probe, live Gen1 vs newer RPC status/config, admin-password management and firmware update UI/service. Device registry stores discovered devices; not a new core ResourceType. | `software/apps/plugins/shelly/frontend/src/plugin.tsx`; `software/apps/plugins/shelly/backend/plugin.ts`; `software/apps/plugins/shelly/backend/devices/discovery/service.ts`; `software/apps/plugins/shelly/backend/communication/device-api.service.ts`; `software/apps/plugins/shelly/backend/devices/types.ts`; `software/apps/plugins/shelly/backend/firmware/service.service.ts` |
| PARTIAL | Shelly relay “On”: no dedicated switching node or relay-control implementation in this plugin found. Generic outbound HTTP/MQTT flows can be configured for compatible hardware; show the generic node and a tested simulated integration. | `software/apps/plugins/shelly/backend/communication/device-api.service.ts`; `software/apps/plugins/shelly/backend/plugin.ts`; `software/apps/api/src/resources/flows/node-executors/http-send-request.executor.ts`; `software/apps/api/src/resources/flows/node-executors/mqtt-send-message.executor.ts` |
| IMPLEMENTED | RabbitMQ: badge in MQTT-server list, status/detail panel, broker user/vhost permission management and MQTT credential provisioning provider. No standalone page/sidebar route, dedicated device type or flow node. | `software/apps/plugins/rabbitmq/frontend/src/plugin.tsx`; `software/apps/plugins/rabbitmq/backend/plugin.ts`; `software/apps/plugins/rabbitmq/backend/users/service.ts`; `software/apps/plugins/rabbitmq/backend/credentials/provider.ts` |
| PLANNED-or-NOT-FOUND | Direct AMQP publishing/consumption flow node. RabbitMQ support here is through MQTT and its management interface; do not label a core node AMQP. | `software/apps/plugins/rabbitmq/backend/plugin.ts`; `software/libs/database-entities/src/lib/entities/resource-flow-node/node-type.ts` |
| IMPLEMENTED | Plugin upload/enable/disable/removal; SDK frontend routes/sidebar/slots, API client and live updates; backend Nest modules/controllers, owned entities/migrations, custom flow definitions, context MQTT/events/audit/permissions and credential provisioning. Manifest-declared host capabilities. | `software/apps/api/src/plugin-system/plugin.controller.ts`; `software/libs/plugins-frontend-sdk/src/lib/frontend.pluggable.ts`; `software/libs/plugins-frontend-sdk/src/lib/frontend.slots.ts`; `software/libs/plugins-backend-sdk/src/lib/plugin-backend-module.ts`; `software/libs/plugins-backend-sdk/src/lib/plugin-context.ts`; `software/libs/plugins-backend-sdk/src/lib/plugin-migrations.ts`; `software/libs/plugins-backend-sdk/src/lib/plugin.interface.ts` |

## 10. Companion

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | Electron builds: Windows x64 NSIS, macOS universal DMG, Linux x64/arm64 AppImage. Platform adapters, session-controlled lock overlay/system-lock facilities, pairing wizard, admin override and kiosk integration. “Unlock PC” should be shown as Companion control, not a promise to bypass OS authentication. | `software/apps/companion/electron-builder.config.cjs`; `software/apps/companion/src/main.ts`; `software/apps/companion/src/windows-lock.ts`; `software/apps/companion/src/macos-lock.ts`; `software/apps/companion/src/linux-lock.ts`; `software/apps/companion/src/admin-override.ts`; `software/apps/companion/src/kiosk.ts`; `software/apps/api/src/resources/flows/node-executors/companion-unlock-pc.executor.ts` |
| IMPLEMENTED | Activity/idle detection; foreground app and USB connect/disconnect metrics, events bridged to resource flows. Collection depends on OS permissions and adapter support; macOS-only bundleId field. Linux foreground detection uses X11 xprop/xdotool and produces no foreground events when xprop is unavailable; do not imply complete Wayland foreground-app support. | `software/apps/companion/src/idle-detection.ts`; `software/apps/companion/src/foreground-app.ts`; `software/apps/companion/src/usb-devices.ts`; `software/apps/companion/src/metrics/index.ts`; `software/apps/companion/src/metrics/adapters/linux.ts`; `software/apps/api/src/companion/companion-gateway.service.ts`; `software/apps/frontend/src/app/resources/details/flows/node/en.json` |

## 11. Identity

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | Local account/password, passkeys/WebAuthn, TOTP 2FA, session/password policies and permission-scoped API tokens. | `software/apps/api/src/users-and-auth/auth/passkey/passkey.service.ts`; `software/apps/api/src/users-and-auth/auth/two-factor.service.ts`; `software/apps/api/src/users-and-auth/auth/session.service.ts`; `software/apps/api/src/users-and-auth/password-policy/password-policy.service.ts`; `software/apps/api/src/users-and-auth/auth/api-token/api-token.service.ts` |
| IMPLEMENTED | OIDC and SAML SSO; configured external role/group mappings synchronize SSO-managed RBAC assignments (not all provider permissions unconditionally). Keycloak/Authentik discovery UI exists; protocol-based provider capability is not a blanket certification. | `software/apps/api/src/users-and-auth/auth/sso/oidc/oidc.strategy.ts`; `software/apps/api/src/users-and-auth/auth/sso/saml/saml.strategy.ts`; `software/apps/api/src/users-and-auth/rbac/rbac.service.ts`; `software/apps/frontend/src/app/sso/providers/discovery/keycloak/index.tsx`; `software/apps/frontend/src/app/sso/providers/discovery/authentik/index.tsx` |
| IMPLEMENTED | REST/OpenAPI and WebSocket/live-update integration seams, distinct from flow node catalog. | `software/apps/api/src/main.bootstrap.ts`; `software/apps/api/src/companion/companion.gateway.ts`; `software/apps/api/src/attractap/websockets/handlers/projects/projects.handler.ts` |

## 12. Communication and evidence

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | Direct messaging; preference-controlled email, web-push and live in-app toast channels. In-app toast is presence-based; do not assume a durable notification inbox. Email templates/layout customization. | `software/apps/api/src/messaging/messaging.service.ts`; `software/apps/api/src/notifications/notification-dispatch.service.ts`; `software/apps/api/src/notifications/notification-preference.service.ts`; `software/apps/api/src/email-template/email-template.service.ts`; `software/apps/frontend/src/app/email-layout/en.json` |
| IMPLEMENTED | Administrative/operational audit events and filtered search, old/new change details, domain/retention settings; filtered CSV export in frontend. Audit does not guarantee every conceivable event is recorded. | `software/apps/api/src/audit/audit.service.ts`; `software/apps/api/src/audit/audit.controller.ts`; `software/apps/frontend/src/app/settings/sections/audit-log/index.tsx`; `software/apps/frontend/src/app/settings/sections/audit-log/audit-log-model.ts`; `software/apps/frontend/src/app/settings/sections/audit-log/en.json` |
| IMPLEMENTED | Analytics: resource usage, operating durations and billing transactions; project aggregates and usage history. Flow debug logs are temporary recordings, not persistent audit evidence. | `software/apps/api/src/analytics/analytics.controller.ts`; `software/apps/api/src/analytics/analytics.service.ts`; `software/apps/api/src/projects/project-usage.service.ts`; `software/apps/api/src/resources/flows/resource-flows.controller.ts` |

## 13. Deployment and everyday UI

| Status | Capability / verified behavior | Code evidence |
|---|---|---|
| IMPLEMENTED | Docker/self-hosted deployment assets and installation workflow; customer operates own installation. Do not convert deployment choice into a data-protection guarantee. | `software/Dockerfile`; `software/services.docker-compose.yml`; `software/coolify.docker-compose.yml`; `software/docs/en/installation/docker-compose.md` |
| IMPLEMENTED | Prometheus metrics and provisioned Grafana dashboards (usage/devices/integrations/API/system health etc.). Requires deployment/configuration. | `software/apps/api/src/metrics/metrics.module.ts`; `software/monitoring/prometheus/prometheus.yml`; `software/monitoring/grafana/dashboards/attraccess-usage.json`; `software/monitoring/grafana/provisioning/datasources/prometheus.yml` |
| IMPLEMENTED | Installable web PWA, light/dark toggle, English/German web translations and language detection. Do not extend localization claim to hardcoded reader copy or PWA installability to offline access control. | `software/apps/frontend/src/service-worker/site.webmanifest.json`; `software/apps/frontend/src/main.tsx`; `software/apps/frontend/src/components/themeToggle.tsx`; `software/apps/frontend/src/app/app.en.json`; `software/apps/frontend/src/app/app.de.json` |

## Safe on-screen vocabulary

All entries below are IMPLEMENTED translation strings. Film labels may be editorial, but should not masquerade as built-in node names.

| Use | Exact English UI vocabulary | Source |
|---|---|---|
| Resource status | **In Use**, **Available**, **In Maintenance** | `software/apps/frontend/src/app/resourceOverview/resourceGroupCard/statusChip/en.json` |
| Operation | **Operating**, **Idle**, **Operating duration**, **Running outside a session** | `software/apps/frontend/src/app/resources/details/diagnostics/en.json`; `software/apps/frontend/src/app/resources/details/overview/operatingDurationCard.en.json` |
| Maintenance | **Usage hours**, **Usage count**, **Time interval**, **Session duration**, **Operating duration**, **Sessions threshold**, **Enabled**, **Paused** | `software/apps/frontend/src/app/resources/details/maintenance-hub/en.json` |
| Health | **Device health**, **Healthy**, **Unhealthy** | `software/apps/frontend/src/app/resources/details/health-state/en.json` |
| Access | **Allowed**, **Denied**; **Introducer**, **Maintainer**, **Introduced** | `software/apps/frontend/src/components/IntroductionStatusChip/en.json`; `software/apps/frontend/src/app/resources/PeopleManagement/en.json` |
| Session controls | **Start Using Resource**, **End Session**, **Takeover Resource**, **Start with Notes**, **End with Notes**, **Takeover with Notes**, **Project**, **Supervised by** | `software/apps/frontend/src/app/resources/usage/components/StartSessionControls/translations/en.json`; `software/apps/frontend/src/app/resources/usage/components/ActiveSessionDisplay/translations/en.json`; `software/apps/frontend/src/app/resources/usage/components/OtherUserSessionDisplay/translations/en.json` |
| Meter | **Meters**, **Meter name**, **Lifetime total**, **Current session**, **Waiting for a reading**, **Reading unavailable** | `software/apps/frontend/src/app/resources/details/meters/en.json` |
| Project totals | **Sessions**, **Minutes**, **Spend** | `software/apps/frontend/src/app/projects/details/components/projectSummaryCards/en.json` |
| Hero flow chain | **Usage started** → **Send MQTT message** / **Send HTTP request** / **Unlock PC** → **Report meter**; **Usage stopped** → **Add billing item** | `software/apps/frontend/src/app/resources/details/flows/node/en.json` (full list above) |
| Training | **Introduction required**, **Supervision allowed**, **Supervision required**, **Auto-promotion to introduction**, **Retraining due** | `software/apps/frontend/src/app/resources/editModal/resourceEditModal.en.json`; `software/apps/frontend/src/app/resources/usage/components/RetrainingStatusBanner/translations/en.json` |

“Introduction · current”, “Attractap · Card tapped”, “Shelly · On”, “Meter · kWh” and “Maintenance due in …” are editorial labels, not verified exact UI strings. Use them only as film annotations or verified custom demo labels.

## Do not claim

| Status | Claim to avoid | Verified boundary / evidence |
|---|---|---|
| PLANNED-or-NOT-FOUND | Booking/reservations | No booking implementation found in resource/session routes, entities or frontend resource area. `software/apps/api/src/resources/usage/sessions/resource-usage.controller.ts`; `software/libs/database-entities/src/lib/entities/resourceUsage.entity.ts`. |
| PLANNED-or-NOT-FOUND | Safety, compliance, GDPR or certification guarantees | Permission gates and workflow checks are software behavior, not certification or a safety controller. `software/apps/api/src/resources/usage/authorization/usage-authorization.ts`. Brief correctly excludes these claims. |
| PLANNED-or-NOT-FOUND | Offline production readers | Normal firmware authorization depends on API transport; demo variants explicitly replace networking with mock API. `software/apps/attractap/firmware/src/api/api.cpp`; `software/apps/attractap/firmware/variants/attractap-touch-demo.cmake`. |
| PLANNED-or-NOT-FOUND | “Impossible to bypass” / physical power guaranteed to match session | Operation is reported via integration; authorized maintainers/admin capabilities intentionally allow exceptions. `software/apps/api/src/resources/usage/authorization/usage-authorization.ts`; `software/apps/api/src/resources/flows/node-executors/operating-transition.executor.ts`. |
| PARTIAL | Works with any RFID/NFC/student card | NTAG424 and DESFire EV2-or-later path; provisioning/keys/application compatibility matters. Generic PN532 helper code for other card families is not proof of the Attraccess authentication path. `software/apps/attractap/firmware/src/rfid/rfid.cpp`. |
| PARTIAL | All plugins/protocols are selectable flow nodes | Dedicated WAGO nodes only among these plugins; HTTP outbound, MQTT in/out; no inbound webhook/AMQP/Shelly/RabbitMQ/OIDC/SAML nodes registered. Core T/C and plugin registration files in §4/§9. |
| PARTIAL | Automatic independence under all policies / continuously verified human supervision | Promotion grants introduction after completed supervised sessions; supervision-required remains required. Approval and supervisor identity are recorded; software does not prove the supervisor remained physically present. `software/apps/api/src/resources/usage/sessions/supervised-usage-auto-promotion.listener.ts`; `software/apps/api/src/resources/supervision/supervision.service.ts`; `software/libs/database-entities/src/lib/entities/resource.supervision.ts`. |
| PARTIAL | Arbitrary currency, project wallets, built-in physical units | EUR enum only; project spend attribution; unitless named meters. `software/apps/api/src/billing/dto/set-configuration.dto.ts`; `software/apps/api/src/projects/project-usage.service.ts`; `software/libs/database-entities/src/lib/entities/resource-meter.entity.ts`. |

## Genuine brand and hardware assets

Dimensions read from actual file metadata (`sips`) or SVG viewBox. IMPLEMENTED here means an asset exists; photographs/screenshots are references, not proof of current functionality. Preserve original mascot colors.

| Status | Asset | Path | Dimensions / use |
|---|---|---|---|
| IMPLEMENTED | App wordmark/lockup SVG | `software/apps/api/src/assets/logo.svg`; `software/apps/companion/src/assets/logo.svg`; `software/scripts/brand/lockup-original.svg` | viewBox 0 0 7038 2112; resolution-independent vector |
| IMPLEMENTED | Raster app lockup | `software/apps/api/src/assets/logo.png` | 400×120 |
| IMPLEMENTED | Mascot/keyhole original | `software/scripts/brand/keyhole-original.png`; `software/apps/frontend/Attraccess.icon/Assets/key-hole.png` | 853×1704 |
| IMPLEMENTED | Frontend mascot/logo PNG | `software/apps/frontend/public/logo.png` | 150×300; also used in resource QR codes |
| IMPLEMENTED | App/PWA icons | `software/apps/frontend/public/icon-192.png`; `software/apps/frontend/public/icon-192-maskable.png`; `software/apps/frontend/public/icon-512.png`; `software/apps/frontend/public/icon-512-maskable.png` | 192×192 / 512×512 |
| IMPLEMENTED | Apple / badge icon | `software/apps/frontend/public/apple-touch-icon.png`; `software/apps/frontend/public/badge-72.png`; `software/apps/companion/assets/icon.ico` | 180×180 / 72×72; ICO multi-resolution container |
| IMPLEMENTED | Login wallpaper | `software/apps/frontend/public/login-wallpaper.jpg`; `software/apps/frontend/public/login-wallpaper-RAL5020.png` | 951×1080 |
| IMPLEMENTED | Wallpaper blue / reader crop | `software/apps/frontend/public/login-wallpaper-blue.jpg`; `software/apps/frontend/public/login-wallpaper-RAL5020-480.png` | 955×1080 / 480×480 |
| IMPLEMENTED | Attractap hardware frame image | `software/apps/attractap/desktop/assets/attractap.png` | 1880×3388; genuine repository image for desktop reader shell |
| IMPLEMENTED | Homepage Attractap image | `apps/web/public/hardware/attractap.webp` | 900×1622; outside software, as specifically requested |
| IMPLEMENTED | Reader reference screens | `software/docs/_media/attractap/card-prompt.png`; `software/docs/_media/attractap/resource-list-signed-in.png`; `software/docs/_media/attractap/usage-details.png`; `software/docs/_media/attractap/supervision-request.png`; `software/docs/_media/attractap/usage-end-form.png`; `software/docs/_media/attractap/session-summary-billed.png`; `software/docs/_media/attractap/session-summary-unbilled.png` | All 480×480; use current desktop LVGL capture for film proof |
| IMPLEMENTED | Hardware board reference images | `software/reference/esp32-s3-v4/touchscreen.png`; `software/reference/esp32-s3-v4/interface.png`; `software/reference/esp32-s3-v4/power.png` | 1221×1123 / 525×390 / 1360×481 respectively; technical board references, not finished enclosure renders |
| IMPLEMENTED | OpenSCAD runtime | `software/apps/frontend/public/openscad/openscad.wasm`; `software/apps/frontend/public/openscad/openscad.wasm.js`; `software/apps/frontend/public/openscad/NOTICE.md` | Browser rendering engine, not a model |
| IMPLEMENTED | Renderable OpenSCAD printable | `software/apps/frontend/src/app/printables/rfid-keychain-card.scad` | Default overall W=60, H=40, T=2 mm; RFID keychain/card printable, **not Attractap enclosure** |
| PLANNED-or-NOT-FOUND | Attractap enclosure 3D model | Repository searches for `.scad`, `.stl`, `.step`, `.stp`, `.3mf` and enclosure paths found no reader enclosure model | Do not infer an enclosure model from bundled OpenSCAD engine; use the genuine hardware image |

## Capture handoff

The proposed laser-cutter loop is feasible with dedicated demo data and simulated hardware. Seed the introduction and completed supervised sessions; configure supervision-allowed if the person is meant to become independent. Use a named “Electricity (kWh)” meter with a rate and actual reported start/final totals; configure session-minute billing separately. Configure operating-state reports if maintenance/billing uses operating duration. Set maintenance threshold so a completed session causes the evaluator to create a task. Connect the generic MQTT/HTTP/Companion branches explicitly. Capture the true Touch UI in German or make that copy change an explicit separately owned implementation decision. Research did not modify software, start servers, or exercise live payments/hardware.
