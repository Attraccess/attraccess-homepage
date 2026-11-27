# German film vocabulary

Verified against frontend translation sources at software commit `a4d5e3b772686164dc353f2449edf0617a3509f5`. Preserve the product’s exact spelling. Paths are relative to the workspace.

| English | Exact German UI | Source and key |
|---|---|---|
| Usage started | **Nutzung gestartet** | [app/resources/details/flows/node/de.json](../../../software/apps/frontend/src/app/resources/details/flows/node/de.json) · `nodes.input.resource.usage.started.title` |
| Usage stopped | **Nutzung beendet** | [app/resources/details/flows/node/de.json](../../../software/apps/frontend/src/app/resources/details/flows/node/de.json) · `nodes.input.resource.usage.stopped.title` |
| Send HTTP request | **HTTP-Anfrage senden** | [app/resources/details/flows/node/de.json](../../../software/apps/frontend/src/app/resources/details/flows/node/de.json) · `nodes.output.http.sendRequest.title` |
| Send MQTT message | **MQTT-Nachricht senden** | [app/resources/details/flows/node/de.json](../../../software/apps/frontend/src/app/resources/details/flows/node/de.json) · `nodes.output.mqtt.sendMessage.title` |
| Unlock PC | **PC entsperren** | [app/resources/details/flows/node/de.json](../../../software/apps/frontend/src/app/resources/details/flows/node/de.json) · `nodes.output.companion.unlock-pc.title` |
| Report meter | **Zähler melden** | [app/resources/details/flows/node/de.json](../../../software/apps/frontend/src/app/resources/details/flows/node/de.json) · `nodes.output.resource.metering.report.title` |
| Record operation started | **Betriebsbeginn aufzeichnen** | [app/resources/details/flows/node/de.json](../../../software/apps/frontend/src/app/resources/details/flows/node/de.json) · `nodes.output.resource.activity.operating.title` |
| If | **Wenn** | [app/resources/details/flows/node/de.json](../../../software/apps/frontend/src/app/resources/details/flows/node/de.json) · `nodes.processing.if.title` |
| In Use | **In Benutzung** | [app/resourceOverview/resourceGroupCard/statusChip/de.json](../../../software/apps/frontend/src/app/resourceOverview/resourceGroupCard/statusChip/de.json) · `status.inUse` |
| Available | **Verfügbar** | [app/resourceOverview/resourceGroupCard/statusChip/de.json](../../../software/apps/frontend/src/app/resourceOverview/resourceGroupCard/statusChip/de.json) · `status.available` |
| In Maintenance | **In Wartung** | [app/resourceOverview/resourceGroupCard/statusChip/de.json](../../../software/apps/frontend/src/app/resourceOverview/resourceGroupCard/statusChip/de.json) · `status.maintenance` |
| Allowed | **Erlaubt** | [components/IntroductionStatusChip/de.json](../../../software/apps/frontend/src/components/IntroductionStatusChip/de.json) · `status.isValid` |
| Introduction | **Einweisung** (term in “Einweisung gewähren”) | [PeopleManagement/de.json](../../../software/apps/frontend/src/app/resources/PeopleManagement/de.json) · `addOptions.introduction` |
| Resources | **Ressourcen** | [toolbar.de.json](../../../software/apps/frontend/src/app/resourceOverview/toolbar/toolbar.de.json) · `title` |
| Introduction History | **Verlauf** | [components/IntroductionsManagement/history/de.json](../../../software/apps/frontend/src/components/IntroductionsManagement/history/de.json) · `modal.title` |
| Maintenance | **Wartung** | [app/resources/details/maintenance-hub/de.json](../../../software/apps/frontend/src/app/resources/details/maintenance-hub/de.json) · `title` |
| Operating duration | **Betriebsdauer** | [app/resources/details/overview/operatingDurationCard.de.json](../../../software/apps/frontend/src/app/resources/details/overview/operatingDurationCard.de.json) · `title` |
| Meters | **Zähler** | [app/resources/details/meters/de.json](../../../software/apps/frontend/src/app/resources/details/meters/de.json) · `title` |

The German condition node is **Wenn**. Usage stopped is **Nutzung beendet**, rather than the literal “Nutzung gestoppt”. “Zähler melden” is the native Report meter title; the meter panel itself is “Zähler”. The demo meter names are **Strom · kWh** and **Laufzeit · h**.

## Remaining English and technical strings in captures

The rendered German shots retain these terms from the product’s own German copy:

| Visible term | Captures | Source |
|---|---|---|
| **Flows** | `flow2-start` header | [resourceDetails.de.json](../../../software/apps/frontend/src/app/resources/details/resourceDetails.de.json), `tabs.flows`; [settings/de.json](../../../software/apps/frontend/src/app/resources/settings/de.json), `topics.flows.title` |
| **Feedback** | Sidebar in desktop captures | [sidebar.de.json](../../../software/apps/frontend/src/app/layout/sidebar.de.json), `groups.feedback.label` |
| **Maker** | “Willkommen zurück, Maker!” in `companion2-locked` | [loginForm.de.json](../../../software/apps/frontend/src/app/unauthorized/loginForm.de.json), `title` |
| **React Flow** | `flow2-start` renderer attribution | Native `@xyflow/react` branding, retained as in English |
| **Gen 2+** | Shelly model badges | [Shelly de.json](../../../software/apps/plugins/shelly/frontend/src/de.json), `devices.generationPlus` |

`GET`, `user.creditBalance >= 0`, `id=0&on=true`, the loopback HTTP URL and
`lab/laser/extraction` are genuine flow configuration values and identifiers.
Brand/model names (Attraccess, Trotec Speedy 400, Shelly, Companion, Prusa, Bambu,
WAGO), named people and protocol/product identifiers retain their spelling.
“Lasercutter” and “Open-Source-Design” are intentional German workshop terminology.

No English demo descriptions, form fields/options, project names, trainer comments,
meter names or billing item copy remain in the final selected crops. The Companion
kiosk supports German natively. The documentation preview’s native 220-character
ellipsis and the HTTP URL’s native abbreviation remain; no product copy is replaced
in screenshots.
