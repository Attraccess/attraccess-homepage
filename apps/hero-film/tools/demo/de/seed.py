#!/usr/bin/env python3
"""Translate a private, frozen read-only snapshot of the English film fixture.
Only the explicitly owned German storage directory can be reset.
"""
import json, os, shutil, sqlite3
from datetime import datetime
from pathlib import Path
HERE=Path(__file__).resolve().parent
EN=HERE.parent/'.runtime'
RUNTIME=HERE/'.runtime'
STORAGE=RUNTIME/'storage'
RUNTIME.mkdir(parents=True,exist_ok=True)
BASE=RUNTIME/'english-baseline.sqlite'
if not BASE.exists():
    source=sqlite3.connect(f'file:{EN}/storage/attraccess.sqlite?mode=ro',uri=True)
    target=sqlite3.connect(BASE); source.backup(target); target.close(); source.close(); os.chmod(BASE,0o600)
    for file in ['device-credentials.json','fixture.json','round2-flow-before.json']:
        shutil.copy2(EN/file,RUNTIME/('english-'+file)); os.chmod(RUNTIME/('english-'+file),0o600)
if STORAGE != HERE/'.runtime/storage': raise RuntimeError('Refusing non-German storage')
if STORAGE.exists(): shutil.rmtree(STORAGE)
STORAGE.mkdir()
shutil.copy2(BASE,STORAGE/'attraccess.sqlite')
for folder in ['cdn','plugins']:
    if (EN/'storage'/folder).exists(): shutil.copytree(EN/'storage'/folder,STORAGE/folder)
for file in ['device-credentials.json','fixture.json','round2-flow-before.json']:
    shutil.copy2(RUNTIME/('english-'+file),RUNTIME/file)
# Exact translations preserve scenario IDs, people, timestamps, numerical evidence and type identifiers.
PAIRS=[
('North Campus Prototyping Lab','Prototyping-Labor Nordcampus'),
('Digital fabrication','Digitale Fertigung'),('Woodshop','Holzwerkstatt'),('Electronics lab','Elektroniklabor'),('Shared spaces','Gemeinschaftsräume'),('Workstations','Arbeitsplätze'),
('Laser cutting, additive manufacturing and CNC machining.','Laserschneiden, 3D-Druck und CNC-Bearbeitung.'),('Timber preparation and precision joinery.','Holzvorbereitung und präzise Holzverbindungen.'),('Circuit assembly, measurement and inspection.','Schaltungen aufbauen, messen und prüfen.'),('Teaching, collaboration and workshop access.','Lehre, Zusammenarbeit und Werkstattzugang.'),('CAD and machine preparation computers.','Rechner für CAD und Maschinenvorbereitung.'),
('100 W CO₂ laser · 1,016 × 610 mm cutting bed.','100-W-CO₂-Laser · 1.016 × 610 mm Arbeitsfläche.'),('PLA & PETG · 0.4 mm nozzle · Teaching prototypes.','PLA & PETG · 0,4-mm-Düse · Lehrprototypen.'),('Larger prototypes · 0.6 mm nozzle · PLA & PETG.','Größere Prototypen · 0,6-mm-Düse · PLA & PETG.'),('Enclosed printing · Engineering polymers.','Geschlossener Bauraum · Technische Kunststoffe.'),('Three-axis routing · Spindle service in progress.','Dreiachsfräse · Spindelwartung läuft.'),('Precision timber cuts · Annual refresher required.','Präzise Holzschnitte · Jährliche Auffrischung.'),('Curved cuts & resawing · Check blade guides.','Kurvenschnitte & Auftrennen · Führungen prüfen.'),('Circuit assembly · Local fume extraction.','Schaltungsaufbau · Lokale Lötrauchabsaugung.'),('Four-channel measurement · Shared probe kit.','Vierkanalmessung · Gemeinsamer Tastkopfsatz.'),('Stereo inspection · Fine-pitch electronics.','Stereoprüfung · Feinste Elektronik.'),('Team assembly, collaboration & teaching.','Teamarbeit, Zusammenarbeit & Lehre.'),('Windows CAD & laser preparation · Companion.','Windows-CAD & Laservorbereitung · Companion.'),('Linux simulation & open-source design · Companion.','Linux-Simulation & Open-Source-Design · Companion.'),('Introduced users.','Eingewiesene Nutzer.'),
('CNC router','CNC-Fräse'),('Table saw','Tischkreissäge'),('Band saw','Bandsäge'),('Soldering stations','Lötstationen'),('Oscilloscope','Oszilloskop'),('Microscope','Mikroskop'),('Workshop entrance','Werkstatteingang'),('Project room','Projektraum'),('CAD workstation','CAD-Arbeitsplatz'),
('Lightweight hull, solar array mounts and embedded telemetry for the inter-university challenge.','Leichter Rumpf, Solarmodulhalterungen und integrierte Telemetrie für den Hochschulwettbewerb.'),('Composite tooling, aerodynamic prototypes and control electronics for the campus racing team.','Verbundwerkzeugbau, Aerodynamikprototypen und Steuerelektronik für das Hochschul-Rennteam.'),('Bench-scale culture monitoring, optical sensor housings and fluid-control research.','Kulturüberwachung im Labormaßstab, optische Sensorgehäuse und Forschung zur Flüssigkeitssteuerung.'),('Hands-on teaching projects and repair sessions across the campus community.','Praxisprojekte und Reparaturtermine für die gesamte Campusgemeinschaft.'),
('Solar Boat 2027','Solarboot 2027'),('Bioreactor','Bioreaktor'),('Open Lab · Autumn 2026','Offenes Labor · Herbst 2026'),
('Solar array mounting plates cut and inspected. Lens area cleaned; extraction check complete.','Solarmodulhalterungen geschnitten und geprüft. Linsenbereich gereinigt; Absaugung geprüft.'),('Solar array mounting plates · 3 mm birch ply','Solarmodulhalterungen · 3 mm Birkensperrholz'),('Telemetry enclosure · revision C','Telemetriegehäuse · Revision C'),('Wing profile test pieces','Tragflügelprofil-Probestücke'),('Optical sensor housing batch','Serie optischer Sensorgehäuse'),('Birch plywood test coupon · Focus and extraction checked before cutting.','Birkensperrholz-Probeschnitt · Fokus und Absaugung vor dem Schnitt geprüft.'),('Supervised session 2 of 3: acrylic enclosure panels for Bioreactor.','Beaufsichtigte Sitzung 2 von 3: Acryl-Gehäuseplatten für den Bioreaktor.'),('Supervised session 1 of 3: focus calibration and plywood test coupon.','Beaufsichtigte Sitzung 1 von 3: Fokuskalibrierung und Sperrholz-Probeschnitt.'),('Perfect cut on first try','Schnitt beim ersten Versuch gelungen'),('Lens could use a clean soon','Linse sollte bald gereinigt werden'),('All good, cleaned up afterwards','Alles in Ordnung, anschließend aufgeräumt'),('Ran out of PETG, refilled from storage','PETG aufgebraucht, aus dem Lager nachgefüllt'),('Clean kerf; extraction and focus checked with supervisor.','Saubere Schnittkante; Absaugung und Fokus mit der Aufsicht geprüft.'),('Completed setup, material check and emergency-stop walkthrough.','Einrichtung, Materialprüfung und Einweisung in den Not-Aus abgeschlossen.'),
('Laser cutting preparation','Laserschneiden vorbereiten'),('Thickness (mm)','Stärke (mm)'),('Extraction running','Absaugung läuft'),('Choose an approved material for this cut.','Ein freigegebenes Material für diesen Schnitt wählen.'),('Measure the stock before setting the focus.','Materialstärke vor dem Einstellen des Fokus messen.'),('Confirm that the extraction is running before starting the laser.','Vor dem Laserstart bestätigen, dass die Absaugung läuft.'),('Birch plywood','Birkensperrholz'),('Cast acrylic','Gegossenes Acryl'),('Cardboard','Karton'),('Balsa wood','Balsaholz'),
('Laser setup, approved materials, extraction and supervised test cut completed.','Lasereinrichtung, freigegebene Materialien, Absaugung und beaufsichtigter Probeschnitt abgeschlossen.'),('Refresher with Priya Nair: focus tool, lens inspection and project attribution verified.','Auffrischung mit Priya Nair: Fokuswerkzeug, Linsenprüfung und Projektzuordnung geprüft.'),
('Spindle bearing replacement and runout calibration. Service window: 13–16 October.','Spindellagerwechsel und Rundlaufkalibrierung. Wartungszeitraum: 13.–16. Oktober.'),('Blade swap and fence alignment','Sägeblattwechsel und Anschlagausrichtung'),('Replaced nozzle and recalibrated first layer','Düse gewechselt und erste Schicht neu kalibriert'),('Belt tension check','Riemenspannung prüfen'),('Mirror and lens cleaning','Spiegel und Linse reinigen'),('Quarterly safety inspection','Vierteljährliche Sicherheitsprüfung'),('Annual service by the manufacturer – tube and mirror check','Jährlicher Herstellerservice – Röhre und Spiegel prüfen'),('Lens & mirror cleaning — residue removed, beam alignment checked and extraction filter inspected.','Linse & Spiegel reinigen – Rückstände entfernt, Strahlausrichtung und Absaugfilter geprüft.'),('Lens & mirror cleaning · Operating duration threshold reached (20 hours).','Linse & Spiegel reinigen · Betriebsdauer von 20 Stunden erreicht.'),('Lens & mirror cleaning','Linse & Spiegel reinigen'),('Monthly optics clean','Monatliche Optikreinigung'),
('Intermittent under-extrusion on the first layer. Please inspect the nozzle and extruder gears.','Zeitweise Unterextrusion in der ersten Schicht. Bitte Düse und Extruderzahnräder prüfen.'),('Faint residue on the focusing lens after cutting plywood; edges show more charring than the reference sample.','Leichte Rückstände auf der Fokuslinse nach Sperrholzschnitten; Kanten stärker verkohlt als beim Referenzmuster.'),('Extraction pre-filter is approaching the replacement mark. Please check it during the next scheduled lens cleaning.','Der Absaug-Vorfilter nähert sich der Wechselmarke. Bitte bei der nächsten geplanten Linsenreinigung prüfen.'),
('Electricity · kWh','Strom · kWh'),('Run time · h','Laufzeit · h'),('Laser operating counter','Laser-Betriebszähler'),('Printer filament counter','Drucker-Filamentzähler'),('Shelly Pro 3EM · resettable counter','Shelly Pro 3EM · rücksetzbarer Zähler'),('Extraction & filter contribution','Beitrag Absaugung & Filter'),('Shared extraction consumables','Verbrauchsmaterial für die gemeinsame Absaugung'),('Session setup','Sitzungsvorbereitung'),('Per session','Pro Sitzung'),('Per minute','Pro Minute'),
('Laser cutter · Shelly Pro 1PM','Lasercutter · Shelly Pro 1PM'),('Extraction · Shelly Plus 1PM','Absaugung · Shelly Plus 1PM'),('Woodshop lighting · Shelly Pro 2','Werkstattlicht · Shelly Pro 2'),('Extraction plant · WAGO CC100','Absauganlage · WAGO CC100'),('Laser control · Windows','Lasersteuerung · Windows'),('Electronics Bench · Linux','Elektronik-Arbeitsplatz · Linux'),('Portable teaching kit · Attractap Lite','Mobiles Lehrgerät · Attractap Lite'),('University Identity · SAML','Hochschulidentität · SAML'),('North Campus · Local MQTT','Nordcampus · Lokales MQTT'),('Confirm extraction serviced','Absaugungswartung bestätigen'),('Filter and extraction check completed','Filter und Absaugung geprüft'),('Run extraction check','Absaugung prüfen'),('Extraction system responding','Absauganlage antwortet'),
('The Solar Boat bulkhead drawings are ready. Could we review the 3 mm plywood settings before the afternoon workshop?','Die Solarboot-Spantzeichnungen sind fertig. Können wir vor dem Nachmittagsworkshop die Einstellungen für 3 mm Sperrholz durchgehen?'),('Reviewed the test coupon. Use the birch plywood profile and check extraction before starting. The focus tool is back in its tray.','Probeschnitt geprüft. Bitte das Birkensperrholzprofil nutzen und vor dem Start die Absaugung prüfen. Das Fokuswerkzeug liegt wieder in seiner Ablage.'),('Thanks! I have linked this run to Solar Boat 2027. We are cutting the revised battery cradle first.','Danke! Ich habe diese Sitzung dem Solarboot 2027 zugeordnet. Zuerst schneiden wir die überarbeitete Batteriehalterung.'),
]
PAIRS.sort(key=lambda pair:len(pair[0]),reverse=True)
def translate(s):
    if not isinstance(s,str): return s
    # Structured content: translate values, preserving keys/API identifiers.
    if s.startswith(('{','[')):
        try:
            def walk(v):
                if isinstance(v,dict): return {k:walk(x) for k,x in v.items()}
                if isinstance(v,list): return [walk(x) for x in v]
                return translate(v)
            return json.dumps(walk(json.loads(s)),ensure_ascii=False,separators=(',',':'))
        except json.JSONDecodeError: pass
    for en,de in PAIRS: s=s.replace(en,de)
    for old,new in [('18924','19024'),('18925','19025'),('18934','19034'),('18944','19044')]: s=s.replace(':'+old,':'+new)
    return s
c=sqlite3.connect(STORAGE/'attraccess.sqlite')
fields={'resource':['name','description','documentationMarkdown'],'resource_group':['name','description'],'project':['name','description'],'resource_usage':['startNotes','endNotes','meterRates'],'form':['name'],'form_field':['name','description','options'],'form_submission':['data'],'resource_introduction_history_item':['comment'],'resource_maintenance':['reason'],'resource_maintenance_schedule':['name'],'resource_maintenance_request':['reason'],'resource_meter':['name'],'resource_metering_session':['meterName','source'],'resource_metering_operation':['source'],'resource_flow_node':['data'],'billing_transaction_item':['name','description'],'message':['content','referenceLabel'],'attractap':['name'],'companion_device':['name'],'plugin_shelly_devices':['name'],'plugin_wago_controllers':['name'],'mqtt_server':['name'],'sso_provider':['name'],'sso_provider_oidc_configuration':['issuer','authorizationURL','tokenURL','userInfoURL'],'sso_provider_saml_configuration':['entryPoint']}
for table,cols in fields.items():
    for col in cols:
        for rowid,value in c.execute(f'SELECT rowid,"{col}" FROM "{table}" WHERE "{col}" IS NOT NULL').fetchall():
            new=translate(value)
            if value!=new:c.execute(f'UPDATE "{table}" SET "{col}"=? WHERE rowid=?',(new,rowid))
c.execute("UPDATE user SET locale='de', dateTimeLocale='de-DE'")
c.execute("DELETE FROM setting WHERE parent='push'")
c.execute("UPDATE mqtt_server SET port=19025")
c.execute("UPDATE setting SET value='http://localhost:3010' WHERE parent='app' AND key='backend_url'")
c.execute("UPDATE setting SET value='http://localhost:4210' WHERE parent='app' AND key='public_internet_url'")
c.execute("UPDATE setting SET value='19026' WHERE parent='smtp' AND key='port'")
c.execute("UPDATE setting SET value='Prototyping-Labor Nordcampus <lab@north-campus.example>' WHERE parent='smtp' AND key='from'")
c.execute('UPDATE resource SET documentationMarkdown=? WHERE id=1',('''## Vor dem Start

1. **Absaugung** einschalten (Attraccess erledigt dies automatisch beim Sitzungsstart).
2. Materialliste prüfen – **kein PVC, kein Vinyl**.
3. Den Laser während des gesamten Schneidvorgangs nie unbeaufsichtigt lassen.

## Materialeinstellungen

| Material | Stärke | Geschwindigkeit | Leistung |
| --- | --- | --- | --- |
| Sperrholz | 3 mm | 20 mm/s | 65 % |
| Sperrholz | 6 mm | 10 mm/s | 85 % |
| Acryl | 4 mm | 12 mm/s | 75 % |
| Karton | 1 mm | 60 mm/s | 30 % |''',))
# Reset schedule 2 to its original 40 h threshold; the capture updates it to 20 h through the API.
c.execute('DELETE FROM resource_maintenance WHERE id=24')
c.execute("UPDATE resource_maintenance_schedule_usage_hours_config SET duration=40 WHERE scheduleId=2")
# Restore the original round-1 active laser state for the early film shots.
c.execute("DELETE FROM billing_transaction_item WHERE billingTransactionId IN (SELECT id FROM billing_transaction WHERE resourceUsageId=138)")
c.execute("DELETE FROM billing_transaction WHERE resourceUsageId=138")
c.execute("INSERT INTO billing_transaction(userId,resourceUsageId,amount,status,createdAt,updatedAt) VALUES(1,138,0,'pending','2026-10-14 14:47:07.029','2026-10-14 14:47:07.029')")
c.execute("UPDATE resource_usage SET endTime=NULL,endNotes=NULL,isFinalized=1 WHERE id=138")
c.execute("UPDATE resource_usage SET startTime=datetime(startTime,'-1 day'), endTime=datetime(endTime,'-1 day') WHERE id>=1051")
c.execute("UPDATE resource_operating_interval SET startTime=datetime(startTime,'-1 day'),endTime=datetime(endTime,'-1 day') WHERE id>=139")
c.execute("UPDATE resource_operating_interval SET endTime=NULL WHERE id=138")
c.execute("UPDATE resource_metering_session SET status='active',settledAt=NULL,finalOperationId=NULL,consumedValue=CASE meterId WHEN 1 THEN '182000000' ELSE '233000000' END,latestValue=CASE meterId WHEN 1 THEN '182000000' ELSE '233000000' END WHERE usageId=138")
c.execute("UPDATE resource_meter SET lifetimeValue=CASE id WHEN 1 THEN '208586000000' ELSE '357730000000' END, counterValue=CASE id WHEN 1 THEN '182000000' ELSE '233000000' END WHERE id IN (1,2)")
c.execute("UPDATE companion_device SET locked=0 WHERE id=1")
c.execute("UPDATE user SET creditBalance=15424 WHERE id=1")
c.execute("UPDATE resource_meter SET latestObservedAt='2026-10-14 15:01:07.029' WHERE id IN(1,2)")
c.execute("UPDATE resource_metering_session SET latestObservedAt='2026-10-14 15:01:07.029' WHERE usageId=138")
c.commit()
assert not c.execute('PRAGMA foreign_key_check').fetchall()
c.close()
f=json.loads(translate((RUNTIME/'fixture.json').read_text())); f['now']=int(datetime.fromisoformat('2026-10-14T15:01:07.029+00:00').timestamp()*1000)
(RUNTIME/'fixture.json').write_text(json.dumps(f,indent=2))
# The optional temporary runtime-meter lifecycle branch must also have translated source labels.
p=RUNTIME/'round2-flow-before.json'; p.write_text(translate(p.read_text()));os.chmod(p,0o600)
print('German scenario translated in isolated storage; Private frozen English baseline reused; the English database is untouched.')
