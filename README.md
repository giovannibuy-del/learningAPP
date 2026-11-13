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
Animation gewählt; direkte Wiederholungen werden vermieden. Jede GIF-Animation läuft nur einmal und bleibt danach auf ihrem letzten Bild stehen. Tippwechsel starten sie nicht erneut. Beim Prüfen einer
Antwort oder Wechseln eines Tipps bleibt die gewählte Pose erhalten.
Bei `prefers-reduced-motion: reduce` werden die passenden PNG-Standbilder angezeigt.

Die verlustfreien 2×2-Quellbildfolgen liegen in `artwork/milo/`. Mit Python und Pillow
lassen sich GIFs und Standbilder reproduzieren:

```sh
python3 scripts/build-milo-gifs.py
node checks/animations.cjs
```

## Oberbegriffe und Beiträge

Über dem Inhalt wählst du einen Oberbegriff. Jeder Oberbegriff hat bis zu zwölf
Beiträge sowie einen eigenen Lernpfad, Fortschritt und Wissenschecks. Weitere
Oberbegriffe legst du unter „Inhalte verwalten“ über „Oberbegriff anlegen“ an.
Der Name lässt sich im Feld „Oberbegriff“ des Beitragseditors ändern.
Es gibt kein globales Zwölferlimit mehr.

Bestehende lokale Daten und ältere JSON-Exporte werden automatisch übernommen.
Falls ein alter Export mehr als zwölf Beiträge enthält, werden zusätzliche
Oberbegriffe für die Fortsetzungen erstellt. Beiträge, Antworten und Fortschritt
bleiben dabei erhalten. Exporte enthalten alle Oberbegriffe und Milos Tipps.
Die Speicherung bleibt lokal im Browser.

```sh
node checks/topics.cjs
```
