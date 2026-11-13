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

## Milos Animationen

Milo hat zehn transparente, animierte GIFs in `dist/assets/milo/`:
Pfote lecken, Katzenbuckel, mit dem Ball spielen, schlafen, sarkastisch schauen,
um Futter betteln, glücklich hüpfen, Beine nach oben strecken, gähnen und schnurren.
Beim Aufgabenwechsel (Öffnen eines anderen Kapitels) wird zufällig eine andere
Animation gewählt; direkte Wiederholungen werden vermieden. Beim Prüfen einer
Antwort oder Wechseln eines Tipps bleibt die gewählte Pose erhalten.
Bei `prefers-reduced-motion: reduce` werden die passenden PNG-Standbilder angezeigt.

Die verlustfreien 2×2-Quellbildfolgen liegen in `artwork/milo/`. Mit Python und Pillow
lassen sich GIFs und Standbilder reproduzieren:

```sh
python3 scripts/build-milo-gifs.py
node checks/animations.cjs
```
