// Ported from the previous homepage's legal pages and kept verbatim apart from styling.
// This is legal text: change wording only deliberately and update the "Stand" date.
export function PrivacyContent() {
  return (
    <>
                    <header>
            <h1>
              Datenschutzerklärung
            </h1>
            <p>
              Stand: 7. Oktober 2026
            </p>

                        <div>
              <h2>
                Verantwortlicher im Sinne der DSGVO
              </h2>
              <div>
                <p>Jan Jaap</p>
                <p>Platanenallee 2a</p>
                <p>22529 Hamburg</p>
                <p>Deutschland</p>
                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:contact@attraccess.org"
                  >
                    contact@attraccess.org
                  </a>
                </p>
                <p>
                  Ein Datenschutzbeauftragter ist gesetzlich nicht bestellt.
                </p>
              </div>
            </div>
          </header>

                    <div>
            <section>
              <h2>
                1. Geltungsbereich und Grundsätzliches
              </h2>
              <p>
                Diese Datenschutzerklärung gilt für die Website{" "}
                <span>attraccess.org</span> und die dort eingebundenen
                Funktionen. Sie gilt nicht für die selbst gehostete Attraccess-Software, die auf
                Servern der jeweiligen Betreiber läuft – dort ist der jeweilige Betreiber
                Verantwortlicher.
              </p>
              <p>
                Personenbezogene Daten werden nur verarbeitet, soweit dies für eine
                funktionsfähige Website und für die hier beschriebenen Zwecke erforderlich ist.
                Die Übertragung erfolgt ausschließlich verschlüsselt über HTTPS/TLS.
              </p>
            </section>

            <section>
              <h2>
                2. Hosting und Server-Logfiles
              </h2>
              <p>
                Die Website wird bei einem externen Hosting-Dienstleister betrieben, der die
                Website in unserem Auftrag als Auftragsverarbeiter nach Art. 28 DSGVO
                bereitstellt. Beim Aufruf der Website verarbeitet der Server technisch notwendige
                Verbindungsdaten in Logfiles:
              </p>
              <ul>
                <li>IP-Adresse des anfragenden Geräts</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei sowie übertragene Datenmenge</li>
                <li>Meldung über den erfolgreichen Abruf (HTTP-Statuscode)</li>
                <li>Referrer-URL, sofern vom Browser übermittelt</li>
                <li>Browsertyp, Browserversion und Betriebssystem (User-Agent)</li>
              </ul>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse
                besteht in der technisch fehlerfreien Auslieferung, der Stabilität und der
                Sicherheit der Website. Eine Zusammenführung dieser Daten mit anderen
                Datenquellen findet nicht statt; eine Auswertung zu Marketingzwecken erfolgt
                nicht.
              </p>
              <p>
                Schriftarten, Bilder und Skripte dieser Website liefern wir ausschließlich von
                unserem eigenen Server aus. Beim Seitenaufruf werden keine Inhalte von Servern
                Dritter (etwa Google Fonts oder Content-Delivery-Netzwerken) nachgeladen.
              </p>
            </section>

            <section>
              <h2>
                3. Cookies und lokale Speicherung im Browser
              </h2>
              <p>
                Diese Website setzt <span>keine Cookies</span>. Auch die
                eingesetzte Reichweitenmessung (siehe Ziffer 4) arbeitet ausdrücklich ohne
                Cookies. Ein Cookie-Banner ist daher nicht erforderlich.
              </p>
              <p>
                Im lokalen Speicher (localStorage) Ihres Browsers werden Ihre Auswahl des hellen
                oder dunklen Designs unter dem Schlüssel <code>theme</code> sowie die gewählte
                Sprache unter <code>language</code> abgelegt. Diese Informationen werden nicht an
                uns übertragen, enthalten keinen Personenbezug und können
                jederzeit über die Einstellungen Ihres Browsers gelöscht werden. Die Speicherung
                erfolgt auf Ihre ausdrückliche Anforderung hin (§ 25 Abs. 2 Nr. 2 TDDDG).
              </p>
              <p>
                Zur Vorauswahl der Anzeigesprache wird die im Browser eingestellte Sprache
                (<code>navigator.language</code>) ausgelesen. Diese Auswertung findet
                ausschließlich lokal in Ihrem Browser statt; die Sprache wird weder gespeichert
                noch an uns oder Dritte übermittelt.
              </p>
            </section>

            <section>
              <h2>
                4. Reichweitenmessung mit Umami (selbst gehostet, ohne Cookies)
              </h2>
              <p>
                Wir nutzen die Open-Source-Analysesoftware{" "}
                <a
                  href="https://umami.is/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Umami
                </a>
                , um die Nutzung unserer Website statistisch auszuwerten und unser Angebot zu
                verbessern. Umami läuft auf einer{" "}
                <span>von uns selbst betriebenen Instanz</span>. Es
                besteht keine Verbindung zu Umami als Unternehmen und keine Weitergabe der
                erhobenen Daten an Dritte; die Daten verlassen unsere eigene Infrastruktur nicht.
              </p>
              <p>
                Umami arbeitet{" "}
                <span>ohne Cookies</span> und ohne vergleichbare
                Speichertechniken. Es werden also keine Informationen auf Ihrem Endgerät
                gespeichert oder ausgelesen, sodass nach § 25 Abs. 1 TDDDG keine Einwilligung
                erforderlich ist.
              </p>
              <p>
                Bei einem Seitenaufruf werden insbesondere folgende Daten verarbeitet:
              </p>
              <ul>
                <li>aufgerufene Seiten-URL und Seitentitel, auch bei Seitenwechseln innerhalb der Anwendung</li>
                <li>Zeitpunkt und Dauer des Aufrufs</li>
                <li>Referrer-URL (die zuvor besuchte Seite)</li>
                <li>Browser, Betriebssystem, Gerätetyp, Bildschirmauflösung und Spracheinstellung</li>
                <li>
                  eine grobe regionale Zuordnung (Land/Region), die serverseitig aus der
                  IP-Adresse abgeleitet wird
                </li>
                <li>
                  einzelne Interaktionsereignisse, konkret das Absenden des Kontaktformulars
                  (<code>contact-submit</code>) und das Absenden des Newsletter-Formulars
                  (<code>newsletter-subscribe</code>)
                </li>
              </ul>
              <p>
                Ihre <span>IP-Adresse wird nicht gespeichert</span>. Sie
                wird ausschließlich flüchtig für die regionale Zuordnung und für die Bildung einer
                pseudonymen Besuchskennung verwendet: Aus IP-Adresse, Browserkennung, Website und
                einem geheimen, täglich wechselnden Wert wird ein nicht umkehrbarer Hashwert
                gebildet. Da sich dieser Wert täglich ändert, ist eine Wiedererkennung über den
                Tag hinaus technisch ausgeschlossen.
              </p>
              <p>
                Die Auswertung erfolgt ausschließlich statistisch und pseudonym; eine
                Identifizierung einzelner Personen ist damit nicht beabsichtigt und findet nicht
                statt. Eine automatisierte Entscheidungsfindung oder ein Profiling im Sinne des
                Art. 22 DSGVO erfolgt nicht.
              </p>
              <p>
                Transparenzhinweis: Das Tracking-Skript unserer Umami-Instanz kann unter einem
                vom Standardnamen abweichenden Dateinamen ausgeliefert werden (z. B.{" "}
                <code>not_umami.js</code> statt <code>script.js</code>). Es handelt sich dabei
                ausschließlich um die hier beschriebene eigene Reichweitenmessung und um keinen
                weiteren Dienst.
              </p>
              <p>
                Die Messung ist nur in der veröffentlichten Fassung der Website aktiv. In
                Entwicklungsfassungen sowie beim automatisierten Erzeugen der statischen Seiten
                während des Builds findet keine Erfassung statt.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse
                besteht in der bedarfsgerechten Gestaltung und der Optimierung unseres
                Web-Angebots. Sie können der Verarbeitung nach Art. 21 DSGVO jederzeit
                widersprechen – formlos per E-Mail an{" "}
                <a
                  href="mailto:contact@attraccess.org"
                >
                  contact@attraccess.org
                </a>
                . Unabhängig davon können Sie die Erfassung verhindern, indem Sie in Ihrem
                Browser die Einstellung „Do Not Track“ aktivieren oder das Laden des Skripts über
                einen Inhaltsblocker unterbinden. Die Nutzung der Website bleibt in beiden Fällen
                uneingeschränkt möglich.
              </p>
            </section>

            <section>
              <h2>
                5. Kontaktformular und Kontaktaufnahme per E-Mail
              </h2>
              <p>
                Das Kontaktformular auf dieser Website{" "}
                <span>überträgt keine Daten an unsere Server</span>. Ihre
                Eingaben (Name, E-Mail-Adresse, Organisation und Ihre Nachricht)
                verbleiben ausschließlich in Ihrem Browser. Beim Absenden wird
                lediglich das E-Mail-Programm Ihres Geräts mit einer vorausgefüllten Nachricht an{" "}
                <span>contact@attraccess.org</span> geöffnet. Ob und mit
                welchem Inhalt Sie die E-Mail tatsächlich versenden, entscheiden Sie selbst.
              </p>
              <p>
                Versenden Sie die Nachricht, verarbeiten wir die darin enthaltenen Angaben
                einschließlich Ihrer E-Mail-Adresse zur Bearbeitung Ihrer Anfrage und für
                mögliche Anschlussfragen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit
                die Anfrage auf den Abschluss oder die Durchführung eines Vertrags gerichtet ist,
                im Übrigen Art. 6 Abs. 1 lit. f DSGVO (Interesse an der Beantwortung von
                Anfragen).
              </p>
              <p>
                Wir löschen die Anfragedaten, sobald sie für den Zweck der Erhebung nicht mehr
                erforderlich sind, spätestens wenn der jeweilige Vorgang abgeschlossen ist und
                keine gesetzlichen Aufbewahrungsfristen (insbesondere handels- und
                steuerrechtliche) entgegenstehen. Beachten Sie, dass der Transport
                unverschlüsselter E-Mails über das Internet nicht vollständig abgesichert werden
                kann.
              </p>
            </section>

            <section>
              <h2>6. Newsletter</h2>
              <p>
                Für den Newsletter setzen wir die Open-Source-Software Listmonk auf einer{" "}
                <span>eigenen Instanz</span> unter{" "}
                <code>listmonk.attraccess.org</code> ein. Ein Versand über Dritt-Dienstleister
                findet nicht statt.
              </p>
              <p>
                Bei der Anmeldung übermitteln Sie Ihre E-Mail-Adresse (Pflichtangabe), optional
                Ihren Namen sowie die von Ihnen ausgewählten Sprachlisten. Zusätzlich
                protokolliert das System technische Daten der Anmeldung (u. a. IP-Adresse und
                Zeitpunkt), um die Einwilligung nachweisen und Missbrauch verhindern zu können.
                Das Formular enthält zu diesem Zweck außerdem ein für Sie unsichtbares
                Spamschutz-Feld. Die Anmeldung wird im Double-Opt-in-Verfahren durch Bestätigung
                der von Ihnen angegebenen Adresse abgeschlossen.
              </p>
              <p>
                Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Sie können
                diese jederzeit mit Wirkung für die Zukunft widerrufen, etwa über den
                Abmeldelink in jedem Newsletter oder per E-Mail an uns. Nach der Abmeldung werden
                Ihre Daten aus dem Verteiler entfernt; Nachweise der Einwilligung können bis zum
                Ablauf möglicher Verjährungsfristen aufbewahrt werden.
              </p>
            </section>

            <section>
              <h2>
                7. Eingebundene Inhalte Dritter
              </h2>

              <h3>Impressum</h3>
              <p>
                Unser Impressum wird über den Dienst online-impressum.de{" "}
                (<code>mein.online-impressum.de</code>) in einem Rahmen (iframe) eingebunden.
                Erst wenn Sie das Impressum öffnen, stellt Ihr Browser eine Verbindung zu den
                Servern dieses Anbieters her und übermittelt dabei technisch notwendige Daten wie
                Ihre IP-Adresse und Browserinformationen. Rechtsgrundlage sind Art. 6 Abs. 1 lit.
                c DSGVO (Erfüllung unserer gesetzlichen Impressumspflicht) und Art. 6 Abs. 1 lit.
                f DSGVO.
              </p>

              <h3>Externe Links</h3>
              <p>
                Unsere Seiten enthalten Links zu externen Websites, etwa zu GitHub. Beim Anklicken
                gelten die Datenschutzbestimmungen der jeweiligen Anbieter; auf deren
                Datenverarbeitung haben wir keinen Einfluss.
              </p>
            </section>

            <section>
              <h2>
                8. Empfänger und Drittlandübermittlung
              </h2>
              <p>
                Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, soweit dies zur Erbringung der
                oben beschriebenen Funktionen erforderlich ist (Hosting-Dienstleister, online-impressum.de), wir gesetzlich dazu verpflichtet sind oder Sie
                eingewilligt haben. Analyse- und Newsletter-Daten werden ausschließlich auf
                eigenen Systemen verarbeitet. Eine Übermittlung in Drittländer außerhalb der
                EU/des EWR findet nicht statt.
              </p>
            </section>

            <section>
              <h2>9. Ihre Rechte</h2>
              <p>
                Sie haben uns gegenüber folgende Rechte hinsichtlich Ihrer personenbezogenen
                Daten:
              </p>
              <ul>
                <li>Auskunft über die verarbeiteten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>
                  Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21
                  DSGVO)
                </li>
                <li>
                  Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3
                  DSGVO)
                </li>
              </ul>
              <p>
                Zur Ausübung genügt eine formlose Nachricht an{" "}
                <a
                  href="mailto:contact@attraccess.org"
                >
                  contact@attraccess.org
                </a>
                .
              </p>
              <p>
                Außerdem steht Ihnen ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu
                (Art. 77 DSGVO). Für uns zuständig ist der Hamburgische Beauftragte für
                Datenschutz und Informationsfreiheit, Ludwig-Erhard-Str. 22, 20459 Hamburg.
              </p>
            </section>

            <section>
              <h2>
                10. Änderungen dieser Datenschutzerklärung
              </h2>
              <p>
                Wir passen diese Datenschutzerklärung an, sobald Änderungen an der Website oder an
                den eingesetzten Diensten dies erfordern. Es gilt jeweils die hier veröffentlichte
                Fassung mit dem oben genannten Stand.
              </p>
            </section>
          </div>
    </>
  );
}
