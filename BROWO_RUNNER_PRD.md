# Browo Runner - Product Requirements Document (PRD)

## Überblick

**Produktname:** Browo Runner  
**Version:** 1.2  
**Letzte Aktualisierung:** 30. Januar 2026  
**Zielgruppe:** Verkehrssicherungsmonteure im Außendienst  
**Plattform:** Progressive Web App (PWA)  

### Produktvision

Browo Runner ist eine mobile Field Service App für Verkehrssicherungsmonteure, die eine intuitive Feed-basierte UX (ähnlich Uber Driver) mit einem vollständigen Zeiterfassungs- und Auftragsverwaltungssystem kombiniert. Die App folgt strikten Clean Code Prinzipien mit CSS Modules, CSS-Variablen, domain-driven Struktur und einer maximalen Komponentengröße von 150 Zeilen.

### Kernmerkmale

- **Feed-basierte UX** für schnellen Überblick über Aufträge
- **Striktes Validierungssystem** für Auftragsvervollständigung
- **Vollständiges Zeiterfassungssystem** mit Live-Timern
- **Upload-System** für Fotos und Skizzen mit Kamera-Integration
- **Mobile-First Design** optimiert für Smartphones
- **Clean Code Architecture** mit domain-driven Struktur

---

## 1. Technische Architektur

### 1.1 Code-Richtlinien

**Clean Code Prinzipien:**
- **CSS Modules** (`.module.scss`) für komponenten-spezifische Styles
- **CSS-Variablen** für Theme und Design-Tokens (`/src/styles/theme.css`)
- **Domain-driven Struktur** mit klarer Modultrennung
- **Maximale Komponentengröße:** 150 Zeilen pro Component
- **Mobile-First Design** mit responsiven Breakpoints
- **TypeScript** für Type-Safety
- **Hooks-basierte Architektur** (React Hooks)

### 1.2 Projektstruktur

```
/src
  /app
    App.tsx                    # Haupt-App-Komponente
    App.module.scss           # App-Styles
    /components               # App-weite Komponenten
      /common                 # Wiederverwendbare UI-Komponenten
      /layout                 # Layout-Komponenten (Navigation, Header)
  
  /modules                    # Feature-Module (Domain-driven)
    /orders                   # Auftragsverwaltung
      /components             # Order-spezifische Komponenten (17 Components)
        OrderFeed.tsx         # Haupt-Feed mit Tabs
        OrderCard.tsx         # Auftrags-Karte (Halteverbot)
        UniversalOrderCard.tsx # Universelle Auftrags-Karte
        BaustelleView.tsx     # Baustellen-Ansicht
        BaustelleCard.tsx     # Baustellen-Karte
        BereitschaftView.tsx  # Bereitschafts-Ansicht
        BereitschaftModal.tsx # Bereitschafts-Detail-Modal
        KontrollfahrtView.tsx # Kontrollfahrt-Ansicht
        KontrollfahrtCard.tsx # Kontrollfahrt-Karte
        MapTab.tsx            # Karten-Tab
        LeafletMap.tsx        # Leaflet Karten-Integration
        SketchModal.tsx       # Skizzen-Zeichentool
        DocumentUploadModal.tsx # Foto-Upload-Modal
        MessageModal.tsx      # Nachrichten-Modal
        MyDataView.tsx        # Meine Daten (Logs)
        PlanningView.tsx      # Wochenplanung
      /hooks                  # Custom Hooks
        useOrders.ts          # Auftrags-Logik
      /services               # API Services
      /types                  # TypeScript Typen
      /pages                  # Seiten-Container
      index.ts                # Modul-Export
    
    /profile                  # Nutzerprofil & Einstellungen
      /components             # Profile-Komponenten (7 Components)
        DashboardView.tsx     # Dashboard mit Arbeitszeit-Übersicht
        ProfileView.tsx       # Profil-Einstellungen
        UnfallmeldenView.tsx  # 3-Schritt-Unfallmeldung
        LogsView.tsx          # Aktivitätsprotokolle (11 Kategorien)
        ApplicationsView.tsx  # Bewerbungen
        BenefitsView.tsx      # Benefits & Prämien
        TopBar.tsx            # Top-Navigation
    
    /material                 # Material-Katalog (Infos)
      /components             # Material-Komponenten
        MaterialView.tsx      # Haupt-Material-Ansicht (3 Tabs)
    
    /map                      # Karten-Navigation
      /components             # Karten-Komponenten
    
    /infos                    # Informations-Modul
      /components
  
  /contexts                   # Globale State-Verwaltung
    OrderUploadsContext.tsx   # Upload-Verwaltung (Fotos, Skizzen)
    MapProviderContext.tsx    # Karten-Instanz-Verwaltung
    ActivityLogContext.tsx    # Aktivitätsprotokolle (7 Kategorien)
  
  /components                 # Geteilte UI-Komponenten
    /common                   # Button, Input, Modal, etc.
    /layout                   # Navigation, Header, Footer
  
  /services                   # API Services & Data Fetching
  
  /styles                     # Globale Styles
    theme.css                 # CSS-Variablen (Design-Tokens)
    fonts.css                 # Font-Imports
    globals.css               # Globale Styles
```

### 1.3 Tech Stack

**Frontend Framework:**
- React 18.3.1
- TypeScript
- Vite 6.3.5 (Build Tool)

**UI Libraries:**
- Radix UI (Headless Components)
- Material-UI 7.3.5 (@mui/material)
- Lucide React 0.487.0 (Icons)
- Motion 12.23.24 (Animationen, ehemals Framer Motion)

**Styling:**
- Tailwind CSS 4.1.12
- SCSS/Sass Embedded 1.97.2
- CSS Modules

**Karten:**
- Leaflet 1.9.4
- React Leaflet 5.0.0

**Formulare & Validierung:**
- React Hook Form 7.55.0
- Zod (geplant)

**State Management:**
- React Context API
- Custom Hooks

**Utilities:**
- date-fns 3.6.0 (Datum-Verwaltung)
- clsx 2.1.1 (Classnames)
- Sonner 2.0.3 (Toasts)

---

## 2. Hauptmodule

### 2.1 Orders (Aufträge)

**Beschreibung:** Zentrales Modul für Auftragsverwaltung mit Feed-basierter UX

#### 2.1.1 OrderFeed - Haupt-Navigation

**4 Auftragstyp-Tabs mit Badge-Zählern:**

1. **Halteverbotszone** 🅿️
   - Badge: Anzahl offener Halteverbot-Aufträge (rot)
   - Badge: Anzahl erledigter Aufträge (grün)
   - Komponente: `OrderCard.tsx`
   - Auftragstypen: Zone (2 Schilder), Einzelschild (1 Schild)

2. **Baustelle** 🏗️
   - Badge: Anzahl offener Baustellen-Aufträge
   - Komponente: `BaustelleView.tsx`, `BaustelleCard.tsx`
   - Erweiterte Protokolle für Baustellen-Setup

3. **Bereitschaft** ⏰
   - Badge: Anzahl Bereitschafts-Dienste
   - Komponente: `BereitschaftView.tsx`, `BereitschaftModal.tsx`
   - Bereitschaftszeit-Tracking
   - Verfügbarkeitsstatus

4. **Kontrollfahrt** 🚗
   - Badge: Anzahl offener Kontrollfahrten
   - Komponente: `KontrollfahrtView.tsx`, `KontrollfahrtCard.tsx`
   - Checkpoint-Verwaltung
   - Route-Dokumentation

**UI-Features:**
- Tab-Badges mit Anzahl (rot = ToDo, grün = Erledigt)
- Hover-Effekte (blaue Border für nicht-aktive, dunkelblauer Hintergrund für aktive)
- Active-State mit weißem Text auf blauem Hintergrund
- Responsive Design (Desktop & Mobile)
- Smooth Transitions (0.2s ease)

#### 2.1.2 Zeiterfassungssystem

**Integration in allen OrderFeed-Tabs:**

**1. Einstempeln/Ausstempeln Button:**
```
┌─────────────────────────────────────┐
│  🕐  Einstempeln                    │  (Grün, wenn nicht eingestempelt)
└─────────────────────────────────────┘

Nach Einstempeln:
┌─────────────────────────────────────┐
│  🕐  Ausstempeln                    │  (Rot, wenn eingestempelt)
│  ⏱️  00:34:12                       │  (Live-Timer)
└─────────────────────────────────────┘
```

**Features:**
- Zentrale Zeiterfassung für Arbeitsbeginn/-ende
- Live-Timer-Anzeige während eingestempelt
- Format: HH:MM:SS (z.B. 08:23:45)
- Persistenter Status über alle Tabs
- Grüner Button (nicht eingestempelt) → Roter Button (eingestempelt)
- Hover-Effekt: Dunklerer Farbton + translateY(-1px)

**2. Tour starten/beenden Button:**
```
┌─────────────────────────────────────┐
│  🚗  Tour starten                   │  (Blau, wenn keine Tour läuft)
└─────────────────────────────────────┘

Während Tour:
┌─────────────────────────────────────┐
│  🛑  Tour beenden                   │  (Blau)
│  Tour läuft: 01:15:32               │  (Badge)
└─────────────────────────────────────┘
```

**Features:**
- Tourenspezifische Zeiterfassung
- Separater Timer für aktive Tour
- Nur aktiv wenn eingestempelt
- Disabled State (grau) wenn nicht eingestempelt
- Status-Badge "Tour läuft" mit Live-Timer

**3. Arbeitszeit-Tracker (anklickbar):**
```
┌─────────────────────────────────────┐
│  ⏰  Heutige Arbeitszeit             │
│  08:23:45                           │  (Große Zeitanzeige)
│  Ziel: 8:00 Std.                    │  (Soll-Zeit)
└─────────────────────────────────────┘
```

**Features:**
- Klickbar → öffnet Zeiterfassungs-Details
- Hover: Elevation-Effekt (translateY(-2px) + shadow)
- Zeigt kumulative Arbeitszeit des Tages
- Vergleich mit Soll-Arbeitszeit (8:00 Std.)

**Timer-Funktionalität:**
- Echtzeit-Updates (jede Sekunde via `setInterval`)
- Persistenz über Tab-Wechsel (Context-basiert)
- Lokale Speicherung (geplant: LocalStorage)
- Visuelle Indikatoren:
  - Grün = Bereit zum Einstempeln
  - Rot = Eingestempelt, bereit zum Ausstempeln
  - Blau = Tour-Buttons
  - Grau = Disabled (wenn Bedingungen nicht erfüllt)

#### 2.1.3 Auftragstypen & Foto-Slots

**Halteverbotszone (Zone):**
```
Auftragsart: Zone (2 Schilder)
Foto-Slots:
  ✅ Schild 1 (Pflicht)
  ✅ Schild 2 (Pflicht)
  ✅ Totale (Gesamtansicht, Pflicht)
Aufstellprotokoll: 100% ausgefüllt (Pflicht)
```

**Validierung:**
- Alle 3 Fotos müssen hochgeladen sein
- Aufstellprotokoll muss vollständig sein
- GPS-Daten müssen vorhanden sein
- **Erst dann:** "Auftrag abschließen"-Button wird aktiv

**Einzelschild:**
```
Auftragsart: Einzelschild (1 Schild)
Foto-Slots:
  ✅ Schild 1 (Pflicht)
  ✅ Totale (Gesamtansicht, Pflicht)
Aufstellprotokoll: 100% ausgefüllt (Pflicht)
```

**Validierung:**
- Alle 2 Fotos müssen hochgeladen sein
- Aufstellprotokoll muss vollständig sein
- GPS-Daten müssen vorhanden sein
- **Erst dann:** "Auftrag abschließen"-Button wird aktiv

**Abholer (Zone):**
```
Auftragsart: Zone abholen (2 Schilder)
Foto-Slots:
  ✅ Schild 1 - nach Abbau (Pflicht)
  ✅ Schild 2 - nach Abbau (Pflicht)
  ✅ Totale - leerer Standort (Pflicht)
Abbauprotokoll: 100% ausgefüllt (Pflicht)
```

#### 2.1.4 Upload-System

**A. Foto-Upload-Modal (`DocumentUploadModal.tsx`)**

**Features:**
- Kamera-Zugriff (Gerät-Kamera via `<input type="file" capture="environment">`)
- Grid-Galerie für Vorschau (2-3 Spalten)
- Vordefinierte Foto-Slots mit Status-Badges
- Drag & Drop Support (Desktop)
- Status-Anzeige:
  - 🔴 Pflicht (noch nicht hochgeladen)
  - ✅ Hochgeladen (grüner Haken)
  - 📷 Upload läuft (Loading-Spinner)
- Thumbnail-Generierung (automatisch)
- Validierungs-Feedback in Echtzeit
- Mobile-optimiert: Touch-friendly Buttons (min. 44x44px)

**Workflow:**
```
1. User klickt "Foto hochladen"
2. Kamera öffnet sich (oder Datei-Browser)
3. Foto aufnehmen/auswählen
4. Vorschau wird angezeigt
5. User kann Foto löschen/ersetzen
6. Automatisches Upload zum Server (geplant)
7. Grüner Haken bei Erfolg
```

**B. Skizze-Modal (`SketchModal.tsx`)**

**Canvas-basiertes Zeichentool:**

**Werkzeuge:**
- 🖊️ **Stift** (verschiedene Farben)
  - Schwarz (Standard)
  - Rot
  - Blau
  - Grün
  - Gelb
- 🧹 **Radiergummi** (löscht Linien)
- 📏 **Liniendicke-Auswahl** (1px, 3px, 5px, 10px)
- ↩️ **Rückgängig** (Undo)
- ↪️ **Wiederholen** (Redo)
- 🗑️ **Alles löschen** (Clear Canvas)
- 💾 **Speichern** (Export als PNG)

**Features:**
- Touch-optimiert für Mobile (Touch Events)
- Mouse-Support für Desktop
- Responsive Canvas (passt sich Fenster an)
- Zoom & Pan-Funktionalität (geplant)
- Export als PNG (Base64)
- Vorschau vor Speichern

**UI:**
```
┌─────────────────────────────────────┐
│  Werkzeuge: 🖊️ 🧹 📏              │
│  Farbe: ⚫ 🔴 🔵 🟢 🟡            │
│  Dicke: • ∘ ○ ⭕                   │
├─────────────────────────────────────┤
│                                     │
│          [Canvas-Bereich]           │
│                                     │
├─────────────────────────────────────┤
│  ↩️ Rückgängig  ↪️ Wiederholen     │
│  🗑️ Löschen     💾 Speichern      │
└─────────────────────────────────────┘
```

#### 2.1.5 Aufstellprotokoll

**Pflichtfelder:**
```
┌─────────────────────────────────────┐
│  Aufstelldatum *                    │
│  [29.01.2026]                       │
├─────────────────────────────────────┤
│  Uhrzeit *                          │
│  [14:30]                            │
├─────────────────────────────────────┤
│  Standort * (GPS automatisch)       │
│  📍 Musterstraße 123, Berlin        │
│  Lat: 52.520008, Lng: 13.404954     │
├─────────────────────────────────────┤
│  Schildtyp *                        │
│  [Halteverbotsschild] ▼             │
├─────────────────────────────────────┤
│  Anzahl Schilder *                  │
│  [2] (Zone)                         │
├─────────────────────────────────────┤
│  Zustand *                          │
│  ◉ Neu      ○ Gebraucht             │
├─────────────────────────────────────┤
│  Montage-Art *                      │
│  [Aufsteller mit Betonplatte] ▼     │
├─────────────────────────────��───────┤
│  Bemerkungen                        │
│  [Zusätzliche Hinweise...]          │
└─────────────────────────────────────┘

Fortschritt: ████████░░ 80%

[ Speichern ]  (nur aktiv bei 100%)
```

**Validierung:**
- Echtzeit-Validierung bei Eingabe
- Fehler-Highlights (rote Border)
- Fortschrittsanzeige (0-100%)
- "Speichern"-Button erst aktiv bei Vollständigkeit
- Pflichtfelder mit * markiert

#### 2.1.6 Map-Integration

**Komponente:** `LeafletMap.tsx`, `MapTab.tsx`

**Features:**
- Interaktive Karte (Leaflet)
- Auftrags-Marker mit Custom-Icons
- Cluster-Funktion (viele Marker)
- GPS-Tracking (Monteur-Standort)
- Routen-Planung (geplant)
- Entfernungsanzeige zu Aufträgen
- Zoom & Pan-Steuerung
- Mobile-Touch-Gesten (Pinch-to-Zoom)

**Map-Tab:**
- Kompakte Karten-Ansicht (280px Höhe)
- Marker für alle offenen Aufträge
- Klick auf Marker → Auftrags-Details
- "Zu Google Maps"-Button für Navigation

---

### 2.2 Map (Karte)

**Beschreibung:** Navigations- und Standort-Modul

**Features:**
- **Interaktive Karte** (MapProvider Context)
- **Auftrags-Marker** mit Cluster-Funktion
- **GPS-Tracking** (Echtzeit-Standort des Monteurs)
- **Routen-Planung** (Multi-Stop-Optimierung, geplant)
- **Entfernungsanzeige** zu Aufträgen
- **Offline-Karten** (geplant)

**Map-Provider Context:**
```typescript
interface MapProviderContext {
  mapInstance: L.Map | null;
  markers: OrderMarker[];
  userLocation: { lat: number; lng: number } | null;
  addMarker: (order: OrderDto) => void;
  removeMarker: (orderId: string) => void;
  centerOnUser: () => void;
  calculateRoute: (orderIds: string[]) => void;
}
```

---

### 2.3 Profile (Profil)

**Beschreibung:** Benutzerverwaltung, Zeiterfassung und persönliche Einstellungen

#### 2.3.1 DashboardView

**Arbeitszeitübersicht:**
```
┌─────────────────────────────────────┐
│  ⏰  Heutige Arbeitszeit             │
│     08:23:45                        │
│     Ziel: 8:00 Std.                 │
├─────────────────────────────────────┤
│  📅  Woche                          │
│     42:15 Std.                      │
│     Ziel: 40:00 Std. (+2:15)        │
├─────────────────────────────────────┤
│  📊  Monat                          │
│     168:45 Std.                     │
│     Ziel: 160:00 Std. (+8:45)       │
└─────────────────────────────────────┘
```

**Schnellzugriff-Buttons:**
```
┌─────────────────┬─────────────────┐
│  📅 Planung     │  🚨 Unfall      │
│                 │     melden      │
└─────────────────┴─────────────────┘
```

**Einstellungen:**
- ⚙️ Benachrichtigungen
- 📄 Dokumente
- ❓ Hilfe & Support
- 🚪 Abmelden

#### 2.3.2 ApplicationsView (Planung)

**Wochenplanung:**
```
Kalenderwoche 5 (29. Jan - 4. Feb 2026)

Mo  │ Di  │ Mi  │ Do  │ Fr  │ Sa  │ So
────┼─────┼─────┼─────┼─────┼─────┼────
8-16│ 8-16│ 8-16│ 8-16│ 8-14│  -  │  -
────┴─────┴─────┴─────┴─────┴─────┴────
```

**Features:**
- Kalender-Ansicht (7 Tage)
- Schicht-Übersicht
- Auftrags-Zuweisung (Drag & Drop, geplant)
- Urlaubsanträge (geplant)
- Verfügbarkeitsmanagement
- Export als PDF/iCal (geplant)

#### 2.3.3 UnfallmeldenView

**3-Schritt-Prozess:**

**Schritt 1: Unfalldetails**
```
┌─────────────────────────────────────┐
│  Datum *                            │
│  [29.01.2026]                       │
├─────────────────────────────────────┤
│  Uhrzeit *                          │
│  [14:30]                            │
├─────────────────────────────────────┤
│  Unfallart *                        │
│  [Arbeitsunfall] ▼                  │
│    - Arbeitsunfall                  │
│    - Wegeunfall                     │
│    - Beinahe-Unfall                 │
├─────────────────────────────────────┤
│  Schweregrad *                      │
│  [Leicht] ▼                         │
│    - Leicht                         │
│    - Mittel                         │
│    - Schwer                         │
├─────────────────────────────────────┤
│  Ort *                              │
│  [Musterstraße 123, Berlin]         │
│  📍 GPS: 52.520008, 13.404954       │
└─────────────────────────────────────┘

Fortschritt: ███░░░░░░░ 33%

[ Weiter ]
```

**Schritt 2: Beschreibung**
```
┌─────────────────────────────────────┐
│  Unfallhergang * (min. 50 Zeichen)  │
│  ┌─────────────────────────────────┐│
│  │ Beim Aufstellen des Schildes... ││
│  │                                 ││
│  │                                 ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  Beteiligte Personen                │
│  [Max Mustermann, ...]              │
├─────────────────────────────────────┤
│  Zeugen                             │
│  [Anna Schmidt, ...]                │
├─────────────────────────────────────┤
│  Erste-Hilfe-Maßnahmen *            │
│  ◉ Ja      ○ Nein                   │
│  [Beschreibung der Maßnahmen...]    │
└─────────────────────────────────────┘

Fortschritt: ██████░░░░ 66%

[ Zurück ]  [ Weiter ]
```

**Schritt 3: Zusatzinformationen**
```
┌─────────────────────────────────────┐
│  Fotos (empfohlen, min. 1)          │
│  ┌─────┬─────┬─────┐                │
│  │ 📷  │ 📷  │ 📷  │  [+ Foto]      │
│  └─────┴─────┴─────┘                │
├─────────────────────────────────────┤
│  Skizze                             │
│  [ 🖊️ Skizze erstellen... ]         │
├─────────────────────────────────────┤
│  Verletzungsdetails                 │
│  [Beschreibung der Verletzung...]   │
├─────────────────────────────────────┤
│  Arztbesuch *                       │
│  ◉ Ja      ○ Nein                   │
└─────────────────────────────────────┘

Fortschritt: █████████░ 99%

[ Zurück ]  [ Absenden ]
```

**Bestätigung:**
```
✅ Unfallmeldung erfolgreich eingereicht!

Vorgangsnummer: UNF-12345678

Eine Bestätigung wurde an Ihre E-Mail gesendet.

[ Zur Übersicht ]
```

**Validierung:**
- Pflichtfelder pro Schritt
- Fortschrittsbalken (0-33-66-99-100%)
- "Weiter"-Button nur bei Vollständigkeit
- "Zurück"-Navigation möglich (Daten bleiben erhalten)
- Entwurf speichern (Auto-Save alle 30 Sekunden, geplant)

**Activity Log Integration:**
- Automatische Erfassung in `ActivityLogContext`
- Kategorie: `alert` (Unfälle)
- Eintrag in LogsView → Kategorie "Unfälle"

#### 2.3.4 LogsView (Meine Daten)

**Beschreibung:** Kategorisiertes Aktivitätsprotokoll mit 11 Kategorien

**UI:**
```
┌─────────────────────────────────────┐
│  📁 Persönliche Daten           (0) ▼│
├─────────────────────────────────────┤
│  💼 Arbeitsinformationen        (2) ▼│
│    ┌───────────────────────────────┐│
│    │ ✓ Vertrag aktualisiert        ││
│    │   13.01.2026, 10:23           ││
│    │   Status: Vollzeit → Teilzeit ││
│    └───────────────────────────────┘│
├─────────────────────────────────────┤
│  🏖️ Abwesenheiten               (0) ▼│
├─────────────────────────────────────┤
│  📄 Dokumente                   (0) ▼│
├─────────────────────────────────────┤
│  🎁 Benefits                    (0) ▼│
├─────────────────────────────────────┤
│  🪙 Coins                       (0) ▼│
├─────────────────────────────────────┤
│  🏆 Achievements                (0) ▼│
├─────────────────────────────────────┤
│  📚 Lernfortschritt             (0) ▼│
├─────────────────────────────────────┤
│  🔑 Berechtigungen              (0) ▼│
├─────────────────────────────────────┤
│  🚨 Unfälle                     (3) ▼│
│    ┌───────────────────────────────┐│
│    │ UNF-12345678                  ││
│    │ Status: 🟡 In Bearbeitung     ││
│    │ ────────────────────────────  ││
│    │ Arbeitsunfall (Leicht)        ││
│    │ 29.01.2026, 14:30             ││
│    │ Musterstraße 123, Berlin      ││
│    │ Eingereicht: 29.01.2026 15:00 ││
│    └───────────────────────────────┘│
├─────────────────────────────────────┤
│  ℹ️ Allgemein                   (0) ▼│
└─────────────────────────────────────┘
```

**Kategorien (11):**

1. **Persönliche Daten** - Profiländerungen, Kontaktdaten
2. **Arbeitsinformationen** - Vertragsänderungen, Statusänderungen
3. **Abwesenheiten** - Urlaub, Krankheit, Sonderurlaub
4. **Dokumente** - Hochgeladene Dokumente, Verträge, Zertifikate
5. **Benefits** - Leistungen, Prämien
6. **Coins** - Punktesystem, Belohnungen
7. **Achievements** - Errungenschaften, Meilensteine
8. **Lernfortschritt** - Schulungen, Zertifizierungen
9. **Berechtigungen** - Zugriffsrechte, Rollenänderungen
10. **Unfälle** 🚨 - Alle eingereichten Unfallmeldungen
11. **Allgemein** - Sonstige Aktivitäten

**Unfälle-Kategorie (NEU!):**
- Vorgangsnummer (z.B. UNF-12345678)
- Status-Badge:
  - 🟡 In Bearbeitung (gelb)
  - 🟢 Abgeschlossen (grün)
- Unfalldetails:
  - Datum & Uhrzeit
  - Unfallart (Arbeitsunfall, Wegeunfall, Beinahe-Unfall)
  - Schweregrad (Leicht, Mittel, Schwer)
  - Ort
  - Eingereicht am (Timestamp)

**UI/UX:**
- Chevron-Icons (▼) zum Ausklappen
- Badge-Counter für Anzahl Einträge (Zahl in Klammern)
- Farbcodierte Kategorien (Icons)
- Expandierbare Detail-Ansicht (Accordion)
- Chronologische Sortierung (neueste zuerst)
- Suchfunktion (geplant)
- Filter nach Kategorie (geplant)

**Activity Log Context Integration:**
```typescript
// Kategorien
type ActivityCategory = 
  | 'navigation'  // Tab-Wechsel
  | 'order'       // Auftragsaktionen
  | 'time'        // Zeiterfassung
  | 'upload'      // Foto/Skizzen-Upload
  | 'system'      // System-Events
  | 'alert'       // Unfallmeldungen
  | 'other';      // Sonstiges
```

---

### 2.4 Material (Infos)

**Beschreibung:** Materialkatalog mit drei Kategorien

**Komponente:** `MaterialView.tsx`

#### 2.4.1 Tabs

**1. Sticker (Aufkleber)**
```
┌─────────────────────────────────────┐
│  🔍 Suche...                        │
├─────────────────────────────────────┤
│  📄 Halteverbot_Zone_A.pdf          │
│     1.2 MB • Hochgeladen: 15.01.2026│
│     [ Herunterladen ]               │
├─────────────────────────────────────┤
│  📄 Baustelle_Beschilderung.pdf     │
│     2.8 MB • Hochgeladen: 10.01.2026│
│     [ Herunterladen ]               │
└─────────────────────────────────────┘
```

**Features:**
- PDF-Dokumente
- Vorlagen & Spezifikationen
- PDF-Preview-Icon
- Dateiname & Dateigröße
- Upload-Datum
- Download-Button
- Suchfunktion (Filter nach Namen)

**2. Schilder**
```
┌─────────────────────────────────────┐
│  🔍 Suche...                        │
├─────────────────────────────────────┤
│  ┌────┐                             │
│  │ 🚫 │  Halteverbot (VZ 283)       │
│  └────┘  Gefahrenzeichen            │
│          [ Details ]                │
├─────────────────────────────────────┤
│  ┌────┐                             │
│  │ 🚧 │  Baustelle (VZ 123)         │
│  └────┘  Gefahrenzeichen            │
│          [ Details ]                │
└─────────────────────────────────────┘
```

**Features:**
- Verkehrszeichen-Katalog
- Thumbnail-Bild
- Name & Nummer (StVO)
- Kategorie (z.B. Gefahrenzeichen, Vorschriftszeichen)
- **Detailansicht** (Modal):
  - Großes Bild
  - Vollständige Beschreibung
  - StVO-Informationen
  - Montageanleitung
- Suchfunktion (Name, Nummer, Kategorie)

**3. Sonstiges**
```
┌─────────────────────────────────────┐
│  🔍 Suche...                        │
├─────────────────────────────────────┤
│  ┌────┐                             │
│  │ 🔧 │  Aufsteller Typ A           │
│  └────┘  Bestand: 45 Stk.           │
│          Lager: Berlin-Mitte        │
│          [ Details ]                │
├─────────────────────────────────────┤
│  ┌────┐                             │
│  │ ⚙️ │  Betonplatte 50kg           │
│  └────┘  Bestand: 120 Stk.          │
│          Lager: Berlin-Mitte        │
│          [ Details ]                │
└─────────────────────────────────────┘
```

**Features:**
- Lager-Material & Werkzeuge
- Produktbild
- Name & Beschreibung
- Bestand (Anzahl + Einheit)
- Lagerort
- **Detailansicht** (Modal):
  - Technische Details
  - Verwendungszweck
  - Verfügbarkeit
- Suchfunktion

#### 2.4.2 Mobile Optimierungen

**Problem gelöst: Abgeschnittene Texte**

**Vorher:**
```
│  Aufsteller Typ A - Standa...      │  ❌ Text abgeschnitten
```

**Nachher:**
```
│  Aufsteller Typ A - Standard-      │  ✅ Umbruch auf 2 Zeilen
│  modell mit Betonplatte             │
```

**CSS-Optimierungen:**
```scss
.itemName {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;        // Max. 2 Zeilen
  overflow: hidden;
  word-break: break-word;       // Umbrich bei langen Wörtern
  line-height: 1.3;
  min-height: 2.6em;            // Platz für 2 Zeilen
}
```

**Touch-freundlich:**
- Größere Touch-Targets (min. 44x44px)
- Optimierte Abstände (padding: 12px 16px)
- Swipe-Gesten (geplant)
- Haptic Feedback (iOS, geplant)

**Responsive Breakpoints:**
```scss
// Desktop
@media (min-width: 769px) {
  .materialGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}

// Tablet
@media (min-width: 481px) and (max-width: 768px) {
  .materialGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Mobile
@media (max-width: 480px) {
  .materialGrid {
    grid-template-columns: 1fr;
  }
}
```

---

## 3. Kontexte (State Management)

### 3.1 OrderUploadsContext

**Beschreibung:** Verwaltung von Foto- und Skizzen-Uploads

```typescript
interface OrderUploadsContextValue {
  uploads: Record<string, Upload[]>;        // Key: orderId
  uploadStates: Record<string, UploadState>; // Key: slotName
  
  // Actions
  addUpload: (orderId: string, slot: string, file: File) => void;
  removeUpload: (orderId: string, uploadId: string) => void;
  getUploadsForOrder: (orderId: string) => Upload[];
  validateUploads: (orderId: string) => ValidationResult;
}

interface Upload {
  id: string;
  orderId: string;
  slotName: string;
  type: 'photo' | 'sketch';
  file: File;
  preview: string; // Base64 oder URL
  uploadedAt: string;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number; // 0-100
  error?: string;
}
```

**Features:**
- Upload-Verwaltung pro Auftrag
- Foto-Slot-Validierung
- Progress-Tracking
- Preview-Generierung
- Fehler-Handling

### 3.2 MapProviderContext

**Beschreibung:** Verwaltung der Karten-Instanz

```typescript
interface MapProviderContextValue {
  mapInstance: L.Map | null;
  markers: OrderMarker[];
  userLocation: { lat: number; lng: number } | null;
  
  // Actions
  addMarker: (order: OrderDto) => void;
  removeMarker: (orderId: string) => void;
  centerOnUser: () => void;
  calculateRoute: (orderIds: string[]) => void;
}
```

### 3.3 ActivityLogContext

**Beschreibung:** Aktivitätsprotokolle für LogsView

```typescript
type ActivityCategory = 
  | 'navigation'  // Tab-Wechsel
  | 'order'       // Auftragsaktionen
  | 'time'        // Zeiterfassung
  | 'upload'      // Foto/Skizzen-Upload
  | 'system'      // System-Events
  | 'alert'       // Unfallmeldungen (NEU!)
  | 'other';

interface ActivityLog {
  id: string;
  category: ActivityCategory;
  action: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ActivityLogContextValue {
  logs: ActivityLog[];
  
  // Actions
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  getLogsByCategory: (category: ActivityCategory) => ActivityLog[];
  clearLogs: () => void;
}
```

**Automatische Erfassung:**
- Navigation: Tab-Wechsel in OrderFeed
- Order: Auftragsaktionen (Start, Abschluss, Aktualisierung)
- Time: Zeiterfassung (Einstempeln, Ausstempeln, Tour)
- Upload: Foto- und Skizzen-Uploads
- Alert: Unfallmeldungen (Vorgangsnummer, Status)
- System: Systemereignisse (Login, Logout, Fehler)

---

## 4. Validierungsregeln

### 4.1 Auftrags-Abschluss

**Halteverbotszone (Zone):**
```javascript
function validateZoneCompletion(order) {
  const requiredPhotos = ['schild_1', 'schild_2', 'totale'];
  const uploadedPhotos = getUploadsForOrder(order.id);
  
  // Prüfe Fotos
  const allPhotosUploaded = requiredPhotos.every(slot =>
    uploadedPhotos.some(upload => upload.slotName === slot)
  );
  
  // Prüfe Protokoll
  const protocolComplete = order.protocol?.completeness === 100;
  
  // Prüfe GPS
  const hasGPS = order.location?.coordinates?.lat && 
                 order.location?.coordinates?.lng;
  
  return allPhotosUploaded && protocolComplete && hasGPS;
}
```

**Einzelschild:**
```javascript
function validateSingleSignCompletion(order) {
  const requiredPhotos = ['schild_1', 'totale'];
  const uploadedPhotos = getUploadsForOrder(order.id);
  
  const allPhotosUploaded = requiredPhotos.every(slot =>
    uploadedPhotos.some(upload => upload.slotName === slot)
  );
  
  const protocolComplete = order.protocol?.completeness === 100;
  const hasGPS = order.location?.coordinates?.lat && 
                 order.location?.coordinates?.lng;
  
  return allPhotosUploaded && protocolComplete && hasGPS;
}
```

**UI-Feedback:**
```
┌─────────────────────────────────────┐
│  Fortschritt: ████████░░ 80%        │
├─────────────────────────────────────┤
│  ✅ Schild 1 hochgeladen            │
│  ✅ Schild 2 hochgeladen            │
│  ❌ Totale fehlt                    │
│  ✅ Protokoll vollständig           │
│  ✅ GPS-Daten vorhanden             │
├─────────────────────────────────────┤
│  [ Auftrag abschließen ]  (disabled)│
└─────────────────────────────────────┘
```

### 4.2 Foto-Upload

```javascript
const PHOTO_VALIDATION = {
  maxFileSize: 10 * 1024 * 1024,        // 10 MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/heic'],
  minResolution: { width: 1280, height: 720 },
  
  validate: (file) => {
    // Dateigröße
    if (file.size > PHOTO_VALIDATION.maxFileSize) {
      return { valid: false, error: 'Datei zu groß (max. 10 MB)' };
    }
    
    // Format
    if (!PHOTO_VALIDATION.allowedFormats.includes(file.type)) {
      return { valid: false, error: 'Ungültiges Format (nur JPG, PNG, HEIC)' };
    }
    
    // Auflösung (async)
    return validateResolution(file);
  }
};
```

**Features:**
- Automatische Kompression bei Upload (geplant)
- EXIF-Daten erhalten (GPS, Zeitstempel)
- Thumbnail-Generierung (640px Breite)
- Progress-Tracking (0-100%)

### 4.3 Unfallmeldung

```javascript
const INCIDENT_VALIDATION = {
  step1: {
    date: { required: true },
    time: { required: true },
    type: { required: true, enum: ['arbeitsunfall', 'wegeunfall', 'beinahe_unfall'] },
    severity: { required: true, enum: ['leicht', 'mittel', 'schwer'] },
    location: { required: true, minLength: 10 }
  },
  
  step2: {
    description: { required: true, minLength: 50 },
    involvedPersons: { required: false },
    witnesses: { required: false },
    firstAid: { required: true, type: 'boolean' }
  },
  
  step3: {
    photos: { required: false, recommended: true, minCount: 1 },
    sketch: { required: false },
    injuryDetails: { 
      required: (formData) => formData.severity === 'schwer' 
    },
    doctorVisit: { required: true, type: 'boolean' }
  }
};
```

---

## 5. UI/UX Design System

### 5.1 Farbpalette

**Primary Colors:**
```css
--app-primary: #3c61bc;           /* Hauptfarbe (Blau) */
--app-primary-hover: #2d4a8f;     /* Hover-Zustand (Dunkelblau) */
--app-primary-light: rgba(60, 97, 188, 0.1); /* Hintergrund-Light */
```

**Semantic Colors:**
```css
--color-success: #22c55e;         /* Erfolg, aktiv (Grün) */
--color-warning: #eab308;         /* Warnung (Gelb) */
--color-error: #ef4444;           /* Fehler (Rot) */
--color-info: #3b82f6;            /* Info (Hellblau) */
```

**Status Colors:**
```css
--status-pending: #f59e0b;        /* Ausstehend (Orange) */
--status-in-progress: #3b82f6;    /* In Bearbeitung (Blau) */
--status-completed: #22c55e;      /* Abgeschlossen (Grün) */
--status-cancelled: #9ca3af;      /* Abgebrochen (Grau) */
```

**Neutral Colors:**
```css
--color-background: #f5f5f5;      /* Haupt-Hintergrund */
--color-surface: #ffffff;         /* Karten-Hintergrund */
--color-surface-elevated: #f9fafb;/* Elevated Surface */
--color-border: #e5e7eb;          /* Borders */
--color-text-primary: #1f2937;    /* Haupt-Text */
--color-text-secondary: #6b7280;  /* Sekundär-Text */
--color-text-tertiary: #9ca3af;   /* Tertiär-Text */
```

### 5.2 Typografie

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
             "Helvetica Neue", Arial, sans-serif;
```

**Font Sizes:**
```css
--font-size-xs: 0.75rem;      /* 12px */
--font-size-sm: 0.875rem;     /* 14px */
--font-size-base: 1rem;       /* 16px */
--font-size-lg: 1.125rem;     /* 18px */
--font-size-xl: 1.25rem;      /* 20px */
--font-size-2xl: 1.5rem;      /* 24px */
--font-size-3xl: 1.875rem;    /* 30px */
```

**Font Weights:**
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 5.3 Spacing

```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

### 5.4 Border Radius

```css
--radius-xs: 4px;
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-card: 12px;
--radius-button: 8px;
--radius-input: 8px;
--radius-pill: 9999px;
```

### 5.5 Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

### 5.6 Komponenten-Richtlinien

**Buttons:**
```scss
.button {
  min-height: 44px;                    // Touch-Target (iOS)
  padding: 12px 20px;
  border-radius: var(--radius-button);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: var(--font-size-sm);
  }
}
```

**Cards:**
```scss
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    border-radius: var(--radius-md);
  }
}
```

**Inputs:**
```scss
.input {
  height: 44px;                        // iOS Zoom vermeiden
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  font-size: 16px;                     // iOS Zoom vermeiden!
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--app-primary);
  }
  
  &::placeholder {
    color: var(--color-text-tertiary);
  }
}
```

**Modals:**
```scss
.modalBackdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.modalContent {
  max-width: 600px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  animation: slideUp 0.3s ease;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    position: fixed;
    bottom: 0;
    animation: slideUpMobile 0.3s ease;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 6. Performance-Anforderungen

### 6.1 Ladezeiten

**Ziele:**
- **Initial Load:** < 2 Sekunden (3G)
- **Route Navigation:** < 200ms
- **Image Loading:** Progressive (lazy loading)
- **Time to Interactive (TTI):** < 3.5 Sekunden

**Metriken:**
- Lighthouse Performance Score: > 90
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

### 6.2 Offline-Fähigkeit (geplant)

```javascript
// Service Worker für Asset-Caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('browo-runner-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/app/App.tsx',
        '/src/styles/theme.css',
        // ... weitere Assets
      ]);
    })
  );
});

// IndexedDB für Auftrags-Daten
const db = await openDB('browo-runner', 1, {
  upgrade(db) {
    db.createObjectStore('orders', { keyPath: 'id' });
    db.createObjectStore('uploads', { keyPath: 'id' });
    db.createObjectStore('logs', { keyPath: 'id' });
  }
});

// Sync-Queue für Uploads
navigator.serviceWorker.ready.then((registration) => {
  registration.sync.register('sync-uploads');
});
```

### 6.3 Optimierungen

**Code-Splitting:**
```javascript
// Lazy Loading für Routen
const OrderFeed = lazy(() => import('./modules/orders/components/OrderFeed'));
const MaterialView = lazy(() => import('./modules/material/components/MaterialView'));
const ProfileView = lazy(() => import('./modules/profile/components/ProfileView'));
```

**Image-Kompression:**
```javascript
// Automatische Kompression bei Upload
async function compressImage(file: File): Promise<File> {
  const maxWidth = 1920;
  const maxHeight = 1080;
  const quality = 0.85;
  
  // Canvas-basierte Kompression
  // ... Implementation
}
```

**Virtualisierte Listen:**
```jsx
// Bei > 50 Items
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={orders.length}
  itemSize={120}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <OrderCard order={orders[index]} />
    </div>
  )}
</FixedSizeList>
```

---

## 7. Sicherheit & Datenschutz

### 7.1 Authentifizierung

**Methoden:**
- OAuth 2.0 / JWT-Tokens
- Biometrische Authentifizierung (Face ID, Touch ID) - geplant
- Session-Timeout: 30 Minuten Inaktivität
- Refresh-Token-Rotation

**Token-Verwaltung:**
```typescript
interface AuthTokens {
  accessToken: string;      // Gültig: 15 Minuten
  refreshToken: string;     // Gültig: 7 Tage
  expiresAt: number;
}

// Auto-Refresh
setInterval(() => {
  if (tokenExpiresIn < 5 * 60 * 1000) { // 5 Minuten vor Ablauf
    refreshAccessToken();
  }
}, 60 * 1000); // Prüfe jede Minute
```

### 7.2 Datenverschlüsselung

**Transport:**
- HTTPS/TLS 1.3 für alle API-Calls
- Certificate Pinning (Mobile App)

**Speicherung:**
- Lokale Daten verschlüsselt (AES-256)
- Fotos mit Wasserzeichen (optional)
- Sensitive Daten nie in LocalStorage (nur SessionStorage)

### 7.3 Berechtigungen

**Kamera-Zugriff:**
```javascript
// Nur bei Bedarf anfragen
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then(stream => {
    // Kamera-Stream verwenden
  })
  .catch(error => {
    console.error('Kamera-Zugriff verweigert:', error);
  });
```

**GPS-Standort:**
```javascript
// Hintergrund-Tracking nur mit Erlaubnis
navigator.geolocation.watchPosition(
  (position) => {
    updateUserLocation(position.coords);
  },
  (error) => {
    console.error('GPS-Fehler:', error);
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
);
```

**Benachrichtigungen:**
```javascript
// Push-Benachrichtigungen
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    // Benachrichtigungen aktivieren
  }
});
```

### 7.4 DSGVO-Konformität

**Prinzipien:**
- **Datenminimierung:** Nur notwendige Daten erfassen
- **Einwilligungen transparent:** Cookie-Banner, Berechtigungs-Dialoge
- **Recht auf Löschung:** "Meine Daten löschen"-Funktion
- **Datenportabilität:** Export als JSON/CSV

**Datenverarbeitung:**
```
Erfasste Daten:
  - Profildaten (Name, E-Mail, Personalnummer)
  - Standortdaten (GPS-Koordinaten bei Auftrag)
  - Arbeitszeitdaten (Einstempeln, Ausstempeln)
  - Fotos (mit EXIF-Daten)
  - Unfallmeldungen (inkl. personenbezogene Daten)

Speicherdauer:
  - Aufträge: 10 Jahre (gesetzliche Aufbewahrungspflicht)
  - Arbeitszeitdaten: 10 Jahre
  - Unfallmeldungen: Unbegrenzt (Versicherungsrecht)
  - Fotos: 10 Jahre (Nachweispflicht)

Zugriff:
  - Monteur: Eigene Daten (read-only für Aufträge)
  - Disponent: Alle Aufträge & Monteur-Daten
  - Admin: Vollzugriff
```

---

## 8. Implementierte Features (Status)

### ✅ Vollständig implementiert

**Haupt-Navigation:**
- [x] Bottom Navigation mit 4 Tabs
- [x] Smooth Transitions
- [x] Active-State-Highlighting

**OrderFeed:**
- [x] 4 Auftragstyp-Tabs (Halteverbot, Baustelle, Bereitschaft, Kontrollfahrt)
- [x] Badge-Zähler in allen Tabs (rot/grün)
- [x] Hover-Effekte (optimiert, kein weißer Hintergrund mehr)
- [x] Filter-Tabs (Alle, ToDo, Erledigt)
- [x] Suchfunktion
- [x] OrderCard-Komponenten
- [x] UniversalOrderCard (wiederverwendbar)

**Zeiterfassungssystem:**
- [x] Einstempeln/Ausstempeln Button
- [x] Tour starten/beenden Button
- [x] Live-Timer (HH:MM:SS)
- [x] Timer-Integration in alle OrderFeed-Tabs
- [x] Arbeitszeit-Tracker (klickbar)
- [x] Persistenz über Tab-Wechsel

**Upload-System:**
- [x] Foto-Upload-Modal (`DocumentUploadModal.tsx`)
- [x] Kamera-Zugriff (Gerät-Kamera)
- [x] Grid-Galerie für Vorschau
- [x] Vordefinierte Foto-Slots
- [x] Skizze-Modal (`SketchModal.tsx`)
- [x] Canvas-Zeichentool (Stift, Radiergummi, Farben, Dicke)
- [x] Rückgängig/Wiederholen
- [x] Export als PNG

**Validierung:**
- [x] Aufstellprotokoll-Validierung
- [x] Foto-Slot-Validierung
- [x] Fortschrittsanzeige
- [x] "Auftrag abschließen"-Button nur bei Vollständigkeit

**Profile-Modul:**
- [x] DashboardView (Arbeitszeitübersicht)
- [x] ProfileView (Einstellungen)
- [x] UnfallmeldenView (3-Schritt-Prozess)
- [x] LogsView (11 Kategorien inkl. Unfälle)
- [x] ApplicationsView (Planung)
- [x] BenefitsView
- [x] TopBar

**Material-Modul:**
- [x] MaterialView (3 Tabs: Sticker, Schilder, Sonstiges)
- [x] Suchfunktion in allen Tabs
- [x] Detail-Modals für Schilder & Sonstiges
- [x] Mobile Optimierung (keine abgeschnittenen Texte)
- [x] Touch-freundliche Buttons (min. 44x44px)

**Map-Modul:**
- [x] LeafletMap-Integration
- [x] MapTab (kompakte Karten-Ansicht)
- [x] Auftrags-Marker
- [x] GPS-Tracking

**Contexts:**
- [x] OrderUploadsContext
- [x] MapProviderContext
- [x] ActivityLogContext (7 Kategorien)

**Design & UX:**
- [x] CSS Modules & CSS-Variablen
- [x] Domain-driven Struktur
- [x] Max. 150 Zeilen pro Component
- [x] Responsive Design (3 Breakpoints)
- [x] Mobile-First Design
- [x] Touch-optimiert

### 🚧 In Arbeit / Geplant

**Backend-Integration:**
- [ ] REST API-Anbindung
- [ ] Authentifizierung (OAuth 2.0)
- [ ] Datensynchronisation
- [ ] Upload zu Cloud-Storage

**Offline-Modus:**
- [ ] Service Worker
- [ ] IndexedDB für Auftrags-Daten
- [ ] Sync-Queue für Uploads
- [ ] Offline-Karten

**Erweiterte Features:**
- [ ] Push-Benachrichtigungen
- [ ] Echtzeit-Updates (WebSocket)
- [ ] Biometrische Authentifizierung
- [ ] Erweiterte Routen-Planung
- [ ] Team-Kommunikation (Chat)
- [ ] Statistiken & Reporting

**UX-Verbesserungen:**
- [ ] Dark Mode
- [ ] Multi-Language Support (DE, EN)
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Swipe-Gesten
- [ ] Haptic Feedback (iOS)

**Export-Funktionen:**
- [ ] PDF-Export (Aufträge, Arbeitszeitübersicht)
- [ ] CSV-Export (Logs, Statistiken)
- [ ] iCal-Export (Wochenplanung)

---

## 9. API-Anforderungen (für Backend-Team)

### 9.1 Endpoints

**Authentifizierung:**
```
POST   /api/auth/login           # Login (E-Mail + Passwort)
POST   /api/auth/logout          # Logout
POST   /api/auth/refresh         # Refresh Access Token
GET    /api/auth/me              # Aktueller User
```

**Aufträge:**
```
GET    /api/orders               # Liste aller Aufträge
GET    /api/orders/:id           # Einzelner Auftrag
POST   /api/orders/:id/start     # Auftrag starten
POST   /api/orders/:id/complete  # Auftrag abschließen
PATCH  /api/orders/:id           # Auftrag aktualisieren
GET    /api/orders/filter        # Filter (status, type, date)
```

**Uploads:**
```
POST   /api/uploads/photo        # Foto hochladen
POST   /api/uploads/sketch       # Skizze hochladen
GET    /api/uploads/:id          # Upload abrufen
DELETE /api/uploads/:id          # Upload löschen
GET    /api/uploads/order/:orderId # Uploads für Auftrag
```

**Zeiterfassung:**
```
POST   /api/timetracking/clock-in    # Einstempeln
POST   /api/timetracking/clock-out   # Ausstempeln
POST   /api/timetracking/tour/start  # Tour starten
POST   /api/timetracking/tour/end    # Tour beenden
GET    /api/timetracking/summary     # Zusammenfassung (Tag, Woche, Monat)
GET    /api/timetracking/history     # Historie
```

**Unfallmeldungen:**
```
POST   /api/incidents            # Unfallmeldung erstellen
GET    /api/incidents            # Liste aller Meldungen
GET    /api/incidents/:id        # Einzelne Meldung
PATCH  /api/incidents/:id        # Meldung aktualisieren (Status)
```

**Material:**
```
GET    /api/materials/stickers   # Sticker/PDFs
GET    /api/materials/signs      # Schilder
GET    /api/materials/misc       # Sonstiges
GET    /api/materials/search     # Suche (Query-Parameter: q, category)
```

**User/Profile:**
```
GET    /api/users/me             # Profil
PATCH  /api/users/me             # Profil aktualisieren
GET    /api/users/me/logs        # Activity Logs
GET    /api/users/me/stats       # Statistiken
```

### 9.2 Datenmodelle

**Order (Auftrag):**
```typescript
interface OrderDto {
  id: string;
  orderNumber: string;
  type: 'no-parking-zone' | 'road-closure' | 'traffic-safety' | 'construction-site';
  actionType: 'aufsteller' | 'abholer';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  location: {
    street: string;
    number: string;
    city: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  description: string;
  scheduledDate: string;        // ISO 8601
  estimatedDuration: number;    // Minuten
  weight: number;               // kg
  materials?: string[];
  notes?: string;
  
  numberOfSigns?: number;       // 1 oder 2
  isZone?: boolean;             // true = Zone (2 Schilder)
  
  requiredPhotos: number;       // 2 oder 3
  uploadedPhotos: number;       // Anzahl hochgeladen
  protocolCompleted: boolean;   // Protokoll vollständig?
  
  assignedTo: string;           // User-ID
  createdAt: string;            // ISO 8601
  updatedAt: string;            // ISO 8601
}
```

**Upload:**
```typescript
interface UploadDto {
  id: string;
  orderId: string;
  userId: string;
  type: 'photo' | 'sketch';
  slotName: string;             // 'schild_1', 'schild_2', 'totale'
  
  url: string;                  // S3/Cloud URL
  thumbnailUrl?: string;        // Thumbnail (640px)
  mimeType: string;             // 'image/jpeg', 'image/png'
  fileSize: number;             // Bytes
  
  metadata?: {
    gps?: {
      lat: number;
      lng: number;
    };
    timestamp?: string;         // Aufnahme-Zeitpunkt
    device?: string;            // Gerät
    exif?: Record<string, any>; // EXIF-Daten
  };
  
  createdAt: string;            // ISO 8601
}
```

**TimeEntry:**
```typescript
interface TimeEntryDto {
  id: string;
  userId: string;
  type: 'work' | 'tour';
  
  startTime: string;            // ISO 8601
  endTime?: string;             // ISO 8601
  duration?: number;            // Sekunden
  
  orderId?: string;             // Optional: Verknüpfter Auftrag
  notes?: string;
  
  createdAt: string;            // ISO 8601
  updatedAt: string;            // ISO 8601
}
```

**Incident (Unfallmeldung):**
```typescript
interface IncidentDto {
  id: string;
  incidentNumber: string;       // UNF-12345678
  userId: string;
  
  date: string;                 // ISO 8601 Date
  time: string;                 // HH:MM
  type: 'arbeitsunfall' | 'wegeunfall' | 'beinahe_unfall';
  severity: 'leicht' | 'mittel' | 'schwer';
  
  location: {
    address: string;
    gps?: {
      lat: number;
      lng: number;
    };
  };
  
  description: string;          // Unfallhergang (min. 50 Zeichen)
  involvedPersons?: string[];   // Beteiligte Personen
  witnesses?: string[];         // Zeugen
  firstAid: boolean;            // Erste Hilfe geleistet?
  firstAidDescription?: string;
  
  photos?: string[];            // Upload-IDs
  sketch?: string;              // Upload-ID
  injuryDetails?: string;       // Verletzungsdetails
  doctorVisit: boolean;         // Arztbesuch?
  
  status: 'in_bearbeitung' | 'abgeschlossen';
  
  createdAt: string;            // ISO 8601
  updatedAt: string;            // ISO 8601
}
```

**Material (Schild):**
```typescript
interface MaterialSignDto {
  id: string;
  name: string;
  number: string;               // VZ 283
  category: 'gefahrenzeichen' | 'vorschriftszeichen' | 'richtzeichen';
  
  imageUrl: string;
  description: string;
  stvoInfo?: string;            // StVO-Informationen
  assemblyInstructions?: string; // Montageanleitung
  
  createdAt: string;
  updatedAt: string;
}
```

**Material (Sonstiges):**
```typescript
interface MaterialMiscDto {
  id: string;
  name: string;
  description: string;
  
  imageUrl?: string;
  stock: {
    quantity: number;
    unit: string;               // 'Stk.', 'kg', 'm'
  };
  location: string;             // Lagerort
  
  technicalDetails?: string;
  usage?: string;               // Verwendungszweck
  
  createdAt: string;
  updatedAt: string;
}
```

### 9.3 Error Responses

**Standard Error Response:**
```typescript
interface ApiError {
  error: {
    code: string;               // 'VALIDATION_ERROR', 'NOT_FOUND', etc.
    message: string;            // Benutzerfreundliche Nachricht
    details?: Record<string, string[]>; // Feld-spezifische Fehler
  };
}
```

**Beispiel:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validierung fehlgeschlagen",
    "details": {
      "date": ["Datum ist erforderlich"],
      "description": ["Beschreibung muss mindestens 50 Zeichen haben"]
    }
  }
}
```

---

## 10. Testing-Strategie

### 10.1 Unit Tests

**Ziel:** >80% Coverage

**Test-Beispiele:**
```typescript
describe('OrderUploadsContext', () => {
  it('should add upload to order', () => {
    const { result } = renderHook(() => useOrderUploads());
    
    act(() => {
      result.current.addUpload('order-123', 'schild_1', mockFile);
    });
    
    expect(result.current.uploads['order-123']).toHaveLength(1);
  });
  
  it('should validate uploads for zone order', () => {
    const { result } = renderHook(() => useOrderUploads());
    
    // Füge 3 Fotos hinzu
    act(() => {
      result.current.addUpload('order-123', 'schild_1', mockFile);
      result.current.addUpload('order-123', 'schild_2', mockFile);
      result.current.addUpload('order-123', 'totale', mockFile);
    });
    
    const validation = result.current.validateUploads('order-123');
    expect(validation.isValid).toBe(true);
  });
});
```

### 10.2 Integration Tests

**Kritische Flows:**

**Upload-Flow:**
```typescript
it('should complete photo upload flow', async () => {
  render(<OrderFeed />);
  
  // Klicke "Foto hochladen"
  fireEvent.click(screen.getByText('Foto hochladen'));
  
  // Upload Datei
  const input = screen.getByLabelText('Foto auswählen');
  fireEvent.change(input, { target: { files: [mockFile] } });
  
  // Warte auf Vorschau
  await waitFor(() => {
    expect(screen.getByAltText('Vorschau')).toBeInTheDocument();
  });
  
  // Speichern
  fireEvent.click(screen.getByText('Speichern'));
  
  // Prüfe Upload-Status
  await waitFor(() => {
    expect(screen.getByText('✅ Hochgeladen')).toBeInTheDocument();
  });
});
```

**Auftrags-Abschluss-Flow:**
```typescript
it('should complete order when all requirements met', async () => {
  render(<OrderCard order={mockZoneOrder} />);
  
  // Upload alle 3 Fotos
  await uploadPhoto('schild_1');
  await uploadPhoto('schild_2');
  await uploadPhoto('totale');
  
  // Protokoll ausfüllen
  await fillProtocol();
  
  // "Auftrag abschließen"-Button sollte aktiv sein
  const completeButton = screen.getByText('Auftrag abschließen');
  expect(completeButton).not.toBeDisabled();
  
  // Abschließen
  fireEvent.click(completeButton);
  
  // Prüfe Status
  await waitFor(() => {
    expect(mockOrder.status).toBe('completed');
  });
});
```

### 10.3 E2E Tests (Playwright/Cypress)

**Kritische User-Journeys:**

**Journey 1: Monteur arbeitet Auftrag ab**
```typescript
test('Monteur completes order end-to-end', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'monteur@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Einstempeln
  await page.click('text=Einstempeln');
  await expect(page.locator('text=Ausstempeln')).toBeVisible();
  
  // Tour starten
  await page.click('text=Tour starten');
  await expect(page.locator('text=Tour läuft')).toBeVisible();
  
  // Auftrag öffnen
  await page.click('text=HVZ-2024-001');
  
  // Fotos hochladen
  await page.click('text=Foto hochladen');
  await page.setInputFiles('[type="file"]', 'test-images/schild1.jpg');
  await page.click('text=Speichern');
  
  // Protokoll ausfüllen
  await page.fill('[name="date"]', '2026-01-29');
  await page.fill('[name="time"]', '14:30');
  await page.selectOption('[name="signType"]', 'Halteverbotsschild');
  // ... weitere Felder
  
  // Auftrag abschließen
  await page.click('text=Auftrag abschließen');
  await expect(page.locator('text=✅ Auftrag abgeschlossen')).toBeVisible();
  
  // Tour beenden
  await page.click('text=Tour beenden');
  
  // Ausstempeln
  await page.click('text=Ausstempeln');
});
```

### 10.4 Browser/Device Testing

**Desktop:**
- Chrome (90+)
- Firefox (85+)
- Safari (14+)
- Edge (90+)

**Mobile:**
- iOS Safari (14+)
- Chrome Android (90+)
- Samsung Internet

**Devices:**
- iPhone 12/13/14/15 (iOS 15+)
- Samsung Galaxy S21/S22/S23
- Google Pixel 5/6/7
- iPad (10. Generation)

---

## 11. Deployment & CI/CD

### 11.1 Environments

**Development:**
- URL: dev.browo-runner.app
- Auto-Deploy bei Push zu `develop`
- Feature-Flags aktiv

**Staging:**
- URL: staging.browo-runner.app
- Auto-Deploy bei Push zu `staging`
- Produktions-ähnliche Daten

**Production:**
- URL: app.browo-runner.app
- Manual Deploy (nach Review)
- Monitoring aktiv

### 11.2 Build-Pipeline

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [develop, staging, main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Install Dependencies
        run: pnpm install
      - name: Lint
        run: pnpm lint
      - name: Type Check
        run: pnpm tsc --noEmit
      - name: Unit Tests
        run: pnpm test
      - name: Integration Tests
        run: pnpm test:integration
  
  build:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Build
        run: pnpm build
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
  
  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: E2E Tests
        run: pnpm test:e2e
  
  deploy:
    needs: e2e
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel/Netlify
        run: pnpm deploy
```

### 11.3 Monitoring

**Error Tracking:**
- Sentry (Frontend Errors)
- Custom Error Logging

**Analytics:**
- Google Analytics / Matomo
- Custom Event Tracking:
  - Auftrags-Abschluss
  - Upload-Fehler
  - Zeiterfassungs-Events

**Performance Monitoring:**
- Lighthouse CI (bei jedem Build)
- Web Vitals Reporting
- Custom Metrics (API Response Times)

**Uptime Monitoring:**
- Pingdom / UptimeRobot
- Status-Page: status.browo-runner.app

---

## 12. Roadmap

### Phase 1 (Q1 2026) - ✅ ABGESCHLOSSEN

**Grundlegende Architektur:**
- [x] Projektstruktur (domain-driven)
- [x] CSS Modules & CSS-Variablen
- [x] Haupt-Navigation (Bottom Nav)
- [x] Responsive Design

**Auftragsverwaltung:**
- [x] OrderFeed mit 4 Tabs
- [x] Badge-Zähler
- [x] Filter-Tabs
- [x] Suchfunktion

**Zeiterfassung:**
- [x] Einstempeln/Ausstempeln
- [x] Tour-Timer
- [x] Arbeitszeit-Tracker

**Upload-System:**
- [x] Foto-Upload-Modal
- [x] Skizze-Modal (Canvas)
- [x] Validierung

**Profile & Logs:**
- [x] Dashboard
- [x] Unfallmeldung (3 Schritte)
- [x] LogsView (11 Kategorien)

**Material:**
- [x] MaterialView (3 Tabs)
- [x] Suchfunktion
- [x] Mobile Optimierung

### Phase 2 (Q2 2026)

**Backend-Integration:**
- [ ] REST API-Anbindung
- [ ] Authentifizierung (OAuth 2.0 + JWT)
- [ ] Datensynchronisation (real-time)
- [ ] Upload zu Cloud-Storage (S3/CDN)

**Offline-Modus:**
- [ ] Service Worker (Caching)
- [ ] IndexedDB (Auftrags-Daten)
- [ ] Sync-Queue (Uploads)
- [ ] Offline-Karten (Leaflet Tiles)

**Push-Benachrichtigungen:**
- [ ] Neue Aufträge
- [ ] Erinnerungen (Zeiterfassung)
- [ ] Unfallmeldungs-Status

### Phase 3 (Q3 2026)

**Erweiterte Features:**
- [ ] Routen-Planung (Multi-Stop-Optimierung)
- [ ] Team-Kommunikation (Chat)
- [ ] Video-Calls (Support)
- [ ] Statistiken & Reporting (Dashboard)

**Admin-Dashboard:**
- [ ] Auftrags-Verwaltung
- [ ] Monteur-Übersicht
- [ ] Echtzeit-Tracking
- [ ] Reporting (PDF/Excel)

**UX-Verbesserungen:**
- [ ] Dark Mode
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Swipe-Gesten
- [ ] Haptic Feedback

### Phase 4 (Q4 2026)

**KI-Features:**
- [ ] KI-gestützte Tourenoptimierung
- [ ] Vorausschauende Wartung (Predictive Maintenance)
- [ ] Automatische Protokoll-Ausfüllung (OCR)

**Internationalisierung:**
- [ ] Multi-Language Support (DE, EN, PL, TR)
- [ ] Währungs-Umrechnung
- [ ] Regionale Anpassungen

**Erweiterte Sicherheit:**
- [ ] Biometrische Authentifizierung (Face ID, Touch ID)
- [ ] 2FA (Two-Factor Authentication)
- [ ] Ende-zu-Ende-Verschlüsselung

---

## 13. Support & Wartung

### 13.1 Support-Kanäle

**In-App Support:**
- Chat-Widget (rechts unten)
- FAQ & Knowledge Base
- Video-Tutorials

**Externe Kanäle:**
- E-Mail: support@browo-runner.app
- Hotline: +49 (0) XXX XXX XXX (Mo-Fr, 8-18 Uhr)
- Ticket-System: support.browo-runner.app

### 13.2 Update-Zyklik

**Minor Updates:**
- Alle 2 Wochen (Feature-Updates, Bug-Fixes)
- Release Notes in App anzeigen

**Major Updates:**
- Quartalsweise (Breaking Changes, neue Module)
- Changelog & Migration-Guide

**Hotfixes:**
- Bei kritischen Bugs innerhalb 24h
- Sofortige Benachrichtigung an User

### 13.3 Wartungsfenster

**Geplante Wartung:**
- Sonntag 02:00 - 04:00 Uhr (CET)
- Vorankündigung: 48h
- Status-Update: status.browo-runner.app

**Notfall-Wartung:**
- Sofort bei kritischen Problemen
- Benachrichtigung via Push & E-Mail

---

## Anhang

### A. Glossar

**Monteur:** Verkehrssicherungsmonteur, Hauptnutzer der App  
**Auftrag:** Arbeitseinsatz zur Aufstellung von Verkehrssicherungsmaßnahmen  
**Zone:** Halteverbotszone mit 2 Schildern  
**Aufsteller:** Auftrag zum Aufstellen von Schildern  
**Abholer:** Auftrag zum Abholen/Entfernen von Schildern  
**Aufstellprotokoll:** Dokumentation der durchgeführten Aufstellung  
**Skizze:** Handgezeichnete Darstellung des Aufstellorts  
**Tour:** Zeitraum zwischen Tour-Start und Tour-Ende  
**Einstempeln:** Beginn der Arbeitszeit  
**Feed:** Übersicht aller Aufträge (wie Social Media Feed)  
**VZ:** Verkehrszeichen (StVO-Nummer)  

### B. Abkürzungen

**PRD:** Product Requirements Document  
**UX:** User Experience  
**UI:** User Interface  
**GPS:** Global Positioning System  
**StVO:** Straßenverkehrs-Ordnung  
**DSGVO:** Datenschutz-Grundverordnung  
**WCAG:** Web Content Accessibility Guidelines  
**PWA:** Progressive Web App  
**API:** Application Programming Interface  
**JWT:** JSON Web Token  
**OAuth:** Open Authorization  
**EXIF:** Exchangeable Image File Format  
**CDN:** Content Delivery Network  
**S3:** Simple Storage Service (AWS)  

### C. Komponenten-Übersicht

**Orders-Modul (17 Komponenten):**
- OrderFeed.tsx (Haupt-Feed)
- OrderCard.tsx (Halteverbot-Karte)
- UniversalOrderCard.tsx (Wiederverwendbare Karte)
- BaustelleView.tsx, BaustelleCard.tsx
- BereitschaftView.tsx, BereitschaftModal.tsx, BereitschaftDetailModal.tsx
- KontrollfahrtView.tsx, KontrollfahrtCard.tsx
- MapTab.tsx, LeafletMap.tsx
- SketchModal.tsx (Canvas-Zeichentool)
- DocumentUploadModal.tsx (Foto-Upload)
- MessageModal.tsx
- MyDataView.tsx (Logs)
- PlanningView.tsx (Wochenplanung)

**Profile-Modul (7 Komponenten):**
- DashboardView.tsx
- ProfileView.tsx
- UnfallmeldenView.tsx (3-Schritt-Unfallmeldung)
- LogsView.tsx (11 Kategorien)
- ApplicationsView.tsx
- BenefitsView.tsx
- TopBar.tsx

**Material-Modul (1 Komponente):**
- MaterialView.tsx (3 Tabs)

**Map-Modul:**
- MapView.tsx (geplant)

**Gesamt: 28 TSX-Komponenten**

---

## Dokumenten-Ende

**Erstellt von:** Browo Runner Produktteam  
**Letzte Aktualisierung:** 30. Januar 2026  
**Version:** 1.2  
**Kontakt:** product@browo-runner.app  

**Änderungshistorie:**
- v1.0 (13.01.2026): Initiale Version
- v1.1 (29.01.2026): Unfälle-Kategorie in LogsView hinzugefügt
- v1.2 (30.01.2026): Vollständige Überarbeitung, Hover-Fix für Buttons, detaillierte Strukturdokumentation
