# Lumio · Geschützter Lernraum

Lern-App im grünen Liquid-Glass-Design mit Oberbegriffen, jeweils bis zu zwölf
Beiträgen, Wissenschecks und dem animierten Lernbegleiter Milo.

## Anmeldung und Rollen

Die gehostete App verwendet die von Sites bereitgestellte Anmeldung mit ChatGPT.
Ohne bestätigte Identität werden weder die App noch ihre Inhalte ausgeliefert.
Benutzer müssen zusätzlich in der Benutzerverwaltung freigeschaltet sein.

- **Admin:** alle Lernbereiche, Inhaltseditor, Benutzer, Gruppen und Freigaben.
- **Benutzer:** nur die Oberbegriffe, die ihrer Gruppe zugeordnet wurden;
  persönlicher Lernfortschritt und serverseitige Quizprüfung.

Das in der geheimen Servervariable `OWNER_EMAIL` konfigurierte Eigentümerkonto
wird der erste Admin. Es kann über die Benutzerverwaltung nicht gesperrt oder
herabgestuft werden. Weitere Admins können angelegt werden. Konten werden über
die bestätigte ChatGPT-E-Mail vorgemerkt und beim ersten Login an die stabile
Sites-Benutzer-ID gebunden. Es werden keine eigenen Passwörter gespeichert.

## Benutzer freischalten

1. Als Admin anmelden und „Benutzer & Gruppen“ öffnen.
2. Eine Gruppe erstellen.
3. Der Gruppe die gewünschten Oberbegriffe zuordnen.
4. Benutzer mit der E-Mail ihres ChatGPT-Kontos und ihrer Gruppe anlegen.
5. Solange die Site privat ist, die Personen zusätzlich über die Site-Freigabe
   als Besucher einladen. Die App ändert die Site-Freigabe nicht automatisch.

Zugriffsprüfungen erfolgen bei jeder Serveranfrage. Deaktivierungen und geänderte
Gruppenfreigaben gelten für nachfolgende Anfragen. Bereits angezeigte Inhalte
können nachträglich nicht vom Gerät einer Person zurückgerufen werden.

## Daten

Lerninhalte, Rollen, Gruppen, Freigaben und persönliche Fortschritte liegen in D1.
Benutzer können keine gemeinsamen Inhalte oder Rechte schreiben. Quizantworten
werden auf dem Server bewertet. Richtige Lösungen werden erst nach erfolgreicher
Beantwortung ausgeliefert. Geänderte Fragen setzen den betreffenden Lernfortschritt
zurück. Gleichzeitige Änderungen durch Admins werden durch Versionsprüfungen erkannt.

Vorherige lokale Inhalte können vom Admin über den Hinweis „Lokale Inhalte
übernehmen“ oder per JSON-Import übernommen werden. Die alte Browsersicherung
bleibt erhalten. Importierte Lerninhalte erhalten neue IDs; Gruppenfreigaben
müssen dafür neu gesetzt werden. Persönliche Fortschritte werden nach der Umstellung
auf dem Server neu geführt. Ein Admin-Export enthält alle Lerninhalte und Tipps.

## Build und Prüfungen

Node.js 22+ und Python 3 (nur für die SQLite-Integrationstests):

```sh
node scripts/build-worker.mjs
node checks/auth.mjs
node checks/topics.cjs
node checks/smoke.cjs
node checks/companion.cjs
node checks/animations.cjs
```

`worker/index.mjs` enthält den Server. `dist/` enthält die Frontend-Quellen und
`dist/server/index.js` den erzeugten Worker mit geschützten Assets. Die
Hosting-Konfiguration bindet D1 als `DB` ein; Schemaänderungen liegen in
`migrations/`. Die Migrationen werden beim Sites-Deployment angewendet.
`OWNER_EMAIL` wird als geheime Sites-Laufzeitvariable konfiguriert und gehört
nicht ins Repository. Ohne DB oder diese Variable verweigert der Server den Zugriff.
Das Öffnen der HTML-Datei über einen einfachen Dateiserver ist nur eine lokale
Demo und bietet keine produktive Anmeldung. Produktionsbetrieb erfordert den Worker
hinter der Sites-Anmeldung.

## Milo

Zehn transparente GIFs in `dist/assets/milo/` werden bei Aufgabenwechseln zufällig
ausgewählt, ohne direkte Wiederholung. Jede Animation läuft einmal. Tippwechsel
starten sie nicht neu. Bei reduzierter Bewegung werden PNG-Standbilder angezeigt.
Die Quellbildfolgen liegen in `artwork/milo/`. Mit Pillow neu erzeugen:

```sh
python3 scripts/build-milo-gifs.py
```
