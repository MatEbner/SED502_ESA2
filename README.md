# Fotowetter-Planer

Der Fotowetter-Planer unterstützt Fotograf:innen dabei, passende Zeitfenster
für ein Motiv zu finden. Nach der Suche eines Orts zeigt die Anwendung
Sonnenauf- und -untergang sowie stündliche Wetterdaten. Ein erklärbarer
Foto-Score berücksichtigt Bewölkung, Regen, Wind, Motiv und Goldene Stunde.

## Technologien

- React 19 mit funktionalen Komponenten
- TypeScript im Strict Mode
- Vite als Entwicklungsserver und Build-Tool
- React Router im Declarative Mode
- CSS mit Variablen und responsiven Layoutregeln

Für Vite 8 wird Node.js 20.19 oder neuer aus der 20er-Reihe beziehungsweise
Node.js 22.12 oder neuer benötigt. Node.js 21 wird nicht unterstützt.

## APIs und Datennutzung

Die Anwendung verwendet die öffentlichen APIs von
[Open-Meteo](https://open-meteo.com/):

- **Geocoding-Suche:** `GET https://geocoding-api.open-meteo.com/v1/search`
  mit Suchbegriff, maximal acht Ergebnissen und deutscher Sprache.
- **Ort per ID:** `GET https://geocoding-api.open-meteo.com/v1/get?id=...`
  zum Laden eines ausgewählten Ortes.
- **Wettervorhersage:** `GET https://api.open-meteo.com/v1/forecast` mit
  stündlicher Bewölkung, Regenwahrscheinlichkeit und Wind sowie täglichen
  Sonnenzeiten. Die Anwendung lädt sieben Tage pro Ort.

Die parallelen API-Arrays werden in typisierte Orts- und Wetterobjekte
umgewandelt. Lade-, Erfolgs-, Fehler- und Keine-Treffer-Zustände werden in der
Oberfläche getrennt behandelt.

Open-Meteo bei der Anzeige der Daten als Quelle nennen. Die kostenlose Nutzung
ist für nicht-kommerzielle Projekte vorgesehen; die
[Nutzungsbedingungen](https://open-meteo.com/en/terms) sind einzuhalten.

## Installation und Start

Voraussetzung ist eine unterstützte Node.js-Version (siehe oben).

```bash
npm install
```

Lege für die lokale Konfiguration eine `.env`-Datei auf Basis der Vorlage an:

```powershell
Copy-Item .env.example .env
```

Die Variable `VITE_LLM_API_KEY` ist in Teil 1 nur ein leerer Platzhalter. Teil 1
führt keine LLM-Aufrufe aus. `.env` ist in `.gitignore` eingetragen und darf
nicht committed werden.

Starte anschließend den Entwicklungsserver:

```bash
npm run dev
```

Produktionsbuild und TypeScript-Prüfung:

```bash
npm run build
```

## Routen

| Route                                             | Ansicht                                         |
| ------------------------------------------------- | ----------------------------------------------- |
| `/`                                               | Startseite mit Ortssuche                        |
| `/ort/:id`                                        | Ortsdetails, Datum, Motiv und Wetter-Zeitleiste |
| `/briefing/:id?datum=YYYY-MM-DD&motiv=Landschaft` | Briefing-Platzhalter                            |
| `/spots`                                          | Spots-Platzhalter                               |

## Aufgabenverteilung

- **Teil 1 – [Mathias Ebner]:** Setup, Routing, Typen, Ortssuche, Wetterdaten,
  Zeitleiste, Foto-Score und Briefing-Daten.
- **Teil 2 – [Maid Kero]:** LLM-Anbindung und Streaming, Briefing-Ausgabe sowie
  gespeicherte Spots.

## Projektstruktur

```text
src/
  komponenten/  Wiederverwendbare UI-Komponenten
  hooks/        Hooks für Ortssuche, Ortsdaten und Wetter
  seiten/       Start-, Ort-, Briefing- und Spots-Seite
  typen/        Gemeinsamer TypeScript-Datenvertrag
  utils/        Foto-Score, Briefing-Daten und Open-Meteo-Aufbereitung
  App.tsx       Routing
  main.tsx      React-Einstiegspunkt
  style.css     Gemeinsames Designsystem
```

## Projektstand

### Teil 1 – abgeschlossen

- [x] Vite-, React- und TypeScript-Grundgerüst mit React Router
- [x] Vier Ansichten und gemeinsame Navigation
- [x] Gemeinsame Typen und Lade-/Fehleranzeigen
- [x] Debouncte Ortssuche mit Open-Meteo Geocoding
- [x] Wetter-Hooks mit Aufbereitung der parallelen API-Arrays
- [x] Datums- und Motivwahl sowie stündliche Wetter-Zeitleiste
- [x] Foto-Score, Goldene Stunde und Briefing-Daten

### Teil 2 – offen

- [ ] `useAIStream` mit Streaming und Fehlerbehandlung
- [ ] `baueBriefingPrompt` für die Briefing-Anfrage
- [ ] Briefing-Seite mit `BriefingAusgabe`
- [ ] Gespeicherte Spots mit `useLocalStorage`
- [ ] Spots-Seite mit gespeicherten Einträgen
- [ ] `SpotButton` in der Ortseite einbauen
- [ ] Fehlerfälle beim KI-Briefing behandeln
- [ ] README-Abschnitt zum KI-Feature ergänzen

## Wichtige Schnittstellen

| Schnittstelle                                                                                    | Dateipfad                   |
| ------------------------------------------------------------------------------------------------ | --------------------------- |
| `useDebounce`                                                                                    | `src/hooks/useDebounce.ts`  |
| `useGeocoding`                                                                                   | `src/hooks/useGeocoding.ts` |
| `useOrt`                                                                                         | `src/hooks/useOrt.ts`       |
| `useWetter`                                                                                      | `src/hooks/useWetter.ts`    |
| `berechneFotoScore`, `istGoldeneStunde`, `istImTageslicht`, `besteZeitfenster`                   | `src/utils/fotoScore.ts`    |
| `baueBriefingDaten`                                                                              | `src/utils/briefing.ts`     |
| `leseOpenMeteoOrt`                                                                               | `src/utils/openMeteo.ts`    |
| `Motiv`, `LadeStatus`, `Ort`, `WetterStunde`, `BewerteteStunde`, `Sonnenzeiten`, `BriefingDaten` | `src/typen/index.ts`        |

## Konventionen

- Komponenten sind funktionale Komponenten mit typisierten Props-Interfaces.
- Komponenten-Dateien verwenden PascalCase, Hooks und Funktionen camelCase.
- Variablen, Funktionen und UI-Texte sind deutsch benannt, sofern keine
  externe API-Bezeichnung verwendet wird.
- Daten werden in Custom Hooks mit `fetch`, `response.ok` und
  `AbortController` geladen. Zustände werden unveränderlich aktualisiert.
- TypeScript bleibt strikt; `any` wird nicht verwendet.
- Für Navigation wird React Router im Declarative Mode verwendet.
- Lokale Open-Meteo-Zeitstrings werden nicht mit `new Date()` geparst.
  Uhrzeiten werden aus den String-Teilen gelesen.
- Keine zusätzlichen UI-, CSS- oder Datenlade-Bibliotheken ohne vorherige
  Abstimmung hinzufügen.
- API-Schlüssel und andere Geheimnisse gehören nicht in den Quellcode oder ins
  Repository.

## AI-Einsatz (Teil 1)

Als AI-Tool habe ich GitHub Copilot in VS Code eingesetzt, vor allem als Sparringpartner. Ich habe die Seite Schritt für Schritt gemeinsam mit dem Copilot-Chat aufgebaut und beim Programmieren auch die Autovervollständigung (Autocomplete) von Copilot genutzt. Auch wenn Fehler aufgetreten sind, habe ich sehr oft AI zur Hilfe genommen.
