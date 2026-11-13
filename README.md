# Lumio · Dein Lernraum

Browserbasierte Lern-App mit grünem Liquid-Glass-Design, einer Indian-Summer-Landschaft und dem animierten schwarzweissen Lernbegleiter Milo.

## Funktionen

- Lernpfad mit frei zugänglichen Kapiteln und Fortschrittsanzeige
- Klimakurs mit fünf Kapiteln und Wissenschecks
- Editor für Lerntexte, Bilder und Quizfragen
- Editierbare Tipps und Wechselintervall für Milo
- Lokale Speicherung sowie JSON-Import und -Export
- Responsive Oberfläche und Berücksichtigung reduzierter Bewegung

## Lokal starten

Keine Installation oder Build-Schritte erforderlich. Im Projektverzeichnis ausführen:

```sh
python3 -m http.server 8000 --directory dist
```

Anschliessend http://localhost:8000 öffnen.

## Prüfungen

Mit Node.js:

```sh
node checks/smoke.cjs
node checks/companion.cjs
```

## Daten und Zugriff

Kursänderungen, Tipps und Lernfortschritt werden ausschliesslich im Local Storage des jeweiligen Browsers gespeichert. Die App hat keine Benutzerkonten, geschützte Admin-Rollen oder gemeinsame Datenbank. Der Inhaltseditor ist für alle Besucher zugänglich; Änderungen betreffen deren eigenen Browser. Über den JSON-Export lassen sich die lokalen Daten sichern und übertragen.

## Dateien

- `dist/index.html`: Einstiegspunkt
- `dist/app.js`: Lerninhalte, Quiz, Editor und Speicherung
- `dist/companion.js`: Milo, Tippwechsel und Tippeditor
- `dist/style.css`, `dist/nature.css`: Layout und Naturdesign
- `dist/assets/`: generierte Landschaft und Katergrafik
- `checks/`: Funktionsprüfungen ohne zusätzliche Abhängigkeiten
