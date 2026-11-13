# Gesicherter Stand für die spätere Raspberry-Pi-Installation

Stand: 13. November 2026. Referenz: Git-Tag `checkpoint-before-raspi-2026-11-13`.

## Vorhanden

- Grünes Liquid-Glass-Design mit Indian-Summer-Hintergrund.
- Oberbegriffe mit jeweils bis zu zwölf Beiträgen und Wissenschecks.
- Milo mit zehn GIFs, zufälliger Auswahl beim Aufgabenwechsel und einmaliger Wiedergabe.
- Editierbare Tipps, Inhaltseditor und JSON-Import/-Export für Admins.
- Serverseitige Benutzerrollen (Admin/Benutzer), Gruppen und Oberbegriff-Freigaben.
- Persönliche Lernfortschritte und serverseitige Quizbewertung.
- Anmeldung und Berechtigungsprüfung vor Auslieferung der App und ihrer Inhalte.

## Aktuelle Hosting-Abhängigkeiten

Der Stand läuft als Cloudflare Worker auf Sites. Er ist noch keine direkt auf dem
Raspberry Pi installierbare Anwendung.

- Sites übernimmt die ChatGPT-Anmeldung und stellt bestätigte Identitätsheader bereit.
- `worker/index.mjs` erwartet eine Cloudflare-D1-Bindung namens `DB`.
- `OWNER_EMAIL` ist eine geheime Hosting-Variable für das Eigentümerkonto.
- Die private Site-Freigabe ist eine zusätzliche Zugangsschranke neben den App-Rollen.
- `dist/server/index.js` ist ein erzeugtes Worker-Artefakt. `dist/` enthält auch die
  Frontend-Quellen; sie dürfen auf dem Pi nicht ungeschützt statisch ausgeliefert werden.

## Für die spätere Portierung

1. Einen HTTP-Server für den Pi bereitstellen, der alle Assets und API-Routen durch
   die gleiche Anmeldung und Rechteprüfung führt.
2. D1 durch SQLite ersetzen und einen Adapter für die verwendeten vorbereiteten
   Abfragen und Transaktionen bereitstellen. Die SQL-Migrationen liegen in
   `migrations/`; die Drizzle-Kopie und Metadaten liegen in `drizzle/`.
3. Die Sites-Anmeldung durch eine geeignete Anmeldung mit sicheren Sitzungen ersetzen
   oder einen vertrauenswürdigen Identitätsdienst anbinden. Extern eingehende
   `oai-authenticated-user-*`-Header dürfen auf dem Pi niemals direkt vertraut werden.
4. Vor dem Umzug die produktiven D1-Daten vollständig und geschützt exportieren:
   Benutzer, Gruppen, Zuordnungen, Inhalte, Inhaltsblöcke und Fortschritte.
   Der Inhalts-JSON-Export allein ist kein vollständiges Datenbank-Backup.
5. Die geheime Eigentümerkonfiguration separat übertragen; keine Geheimnisse oder
   personenbezogenen Daten ins öffentliche Git-Repository schreiben.
6. HTTPS, Reverse Proxy, Dienststart und regelmässige SQLite-Backups einrichten.
7. Login, Rollen, Gruppenfilterung, Sperren, Quizprüfung und Datenübernahme auf dem Pi
   erneut testen, bevor das alte Hosting abgelöst wird.

## Wiederaufnahme und Prüfungen

```sh
git clone https://github.com/giovannibuy-del/learningAPP.git
cd learningAPP
git checkout checkpoint-before-raspi-2026-11-13
node scripts/build-worker.mjs
npm test
```

Die aktuellen Tests benötigen Node.js 22+ und Python 3 für SQLite. Das Neuerzeugen
der GIFs benötigt zusätzlich Pillow. Die Tests simulieren D1 lokal mit SQLite;
sie ersetzen noch keinen fertigen Pi-Server.

## Was gesichert ist

Der Git-Checkpoint enthält Quellcode, Medien, Migrationen, Build-Skripte und Tests.
Die produktiven Daten bleiben in D1. Sie sind nicht Bestandteil des Git-Repositories
oder des Git-Bundles. Die bisherige Hosting-Version bleibt bestehen; die Pi-Migration
wird erst in einem späteren Arbeitsschritt umgesetzt.
