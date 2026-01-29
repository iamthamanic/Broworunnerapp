# Browo Runner - Product Requirements Document (PRD)

## Überblick

**Produktname:** Browo Runner  
**Version:** 1.0  
**Letzte Aktualisierung:** 13. Januar 2026  
**Zielgruppe:** Verkehrssicherungsmonteure im Außendienst  

### Produktvision

Browo Runner ist eine mobile Field Service App für Verkehrssicherungsmonteure, die eine intuitive Feed-basierte UX (ähnlich Uber Driver) mit einem vollständigen Zeiterfassungs- und Auftragsverwaltungssystem kombiniert. Die App folgt strikten Clean Code Prinzipien mit CSS Modules, CSS-Variablen, domain-driven Struktur und einer maximalen Komponentengröße von 150 Zeilen.

---

## 1. Technische Architektur

### 1.1 Code-Richtlinien

- **CSS Modules** für komponenten-spezifische Styles
- **CSS-Variablen** für Theme und Design-Tokens
- **Domain-driven Struktur** mit klarer Modultrennung
- **Maximale Komponentengröße:** 150 Zeilen pro Component
- **Mobile-First Design** mit responsiven Breakpoints

### 1.2 Projektstruktur

```
/src
  /modules
    /orders      - Auftragsverwaltung
    /map         - Karten-Navigation
    /profile     - Nutzerprofil & Einstellungen
    /material    - Material-Katalog
  /contexts      - Globale State-Verwaltung
  /components    - Geteilte UI-Komponenten
  /styles        - Globale Styles & Theme
```

---

## 2. Hauptmodule

### 2.1 Orders (Aufträge)

**Beschreibung:** Zentrales Modul für Auftragsverwaltung mit Feed-basierter UX

#### 2.1.1 Bottom Navigation

Vier Haupttabs mit Badge-Zählern:

1. **Halteverbotszone**
   - Badge zeigt Anzahl offener Aufträge
   - Auftrags-Cards mit Status-Visualisierung
   - Schnellaktionen: Starten, Details, Navigation

2. **Baustelle**
   - Baustellen-spezifische Aufträge
   - Erweiterte Aufstellprotokolle
   - Multi-Schild-Verwaltung

3. **Bereitschaft**
   - Bereitschaftszeit-Tracking
   - Pausenverwaltung
   - Verfügbarkeitsstatus

4. **Kontrollfahrt**
   - Kontroll-Routen
   - Checkpoint-Verwaltung
   - Foto-Dokumentation

#### 2.1.2 Zeiterfassungssystem

**Integration in allen OrderFeed-Tabs:**

**Einstempeln/Ausstempeln Button:**
- Zentrale Zeiterfassung für Arbeitsbeginn/-ende
- Live-Timer-Anzeige während eingestempelt
- Format: HH:MM:SS
- Persistenter Status über alle Tabs

**Tour starten/beenden Button:**
- Tourenspezifische Zeiterfassung
- Separater Timer für aktive Tour
- Automatische Pause bei Tour-Ende
- Status-Badge "Tour läuft"

**Timer-Funktionalität:**
- Echtzeit-Updates (jede Sekunde)
- Persistenz über Tab-Wechsel
- Lokale Speicherung (LocalStorage/Context)
- Visuelle Indikatoren (grün = aktiv, grau = inaktiv)

#### 2.1.3 Auftragstypen

**Halteverbotszone (Zone):**
- **Foto-Slots:** 3 Pflichtfotos
  - Schild 1 (Einzelaufnahme)
  - Schild 2 (Einzelaufnahme)
  - Totale (Gesamtansicht)
- **Aufstellprotokoll:** Vollständig auszufüllen
- **Validierung:** Keine Fertigstellung ohne alle Fotos + Protokoll

**Einzelschilder:**
- **Foto-Slots:** 2 Pflichtfotos
  - Schild 1 (Einzelaufnahme)
  - Totale (Gesamtansicht)
- **Aufstellprotokoll:** Vollständig auszufüllen
- **Validierung:** Strikte Prüfung vor Abschluss

#### 2.1.4 Upload-System

**Foto-Upload-Modal:**
- Kamera-Zugriff (Gerät-Kamera)
- Grid-Galerie für Vorschau
- Vordefinierte Foto-Slots
- Drag & Drop Support (Desktop)
- Status-Anzeige (Pflicht/Optional)
- Thumbnail-Generierung
- Validierungs-Feedback

**Skizze-Modal:**
- Canvas-basiertes Zeichentool
- Werkzeuge:
  - Stift (verschiedene Farben)
  - Radiergummi
  - Liniendicke-Auswahl
  - Rückgängig/Wiederholen
  - Alles löschen
- Export als PNG
- Touch-optimiert für Mobile
- Zoom & Pan-Funktionalität

#### 2.1.5 Aufstellprotokoll

**Pflichtfelder:**
- Aufstelldatum & Uhrzeit
- Standort (GPS-Koordinaten)
- Schildtyp & Anzahl
- Zustand (Neu/Gebraucht)
- Montage-Art
- Bemerkungen

**Validierung:**
- Echtzeit-Validierung
- Fehler-Highlights
- Fortschrittsanzeige
- "Speichern"-Button erst aktiv bei Vollständigkeit

---

### 2.2 Map (Karte)

**Beschreibung:** Navigations- und Standort-Modul

**Features:**
- Interaktive Karte (MapProvider Integration)
- Auftrags-Marker mit Cluster-Funktion
- GPS-Tracking
- Routen-Planung
- Echtzeit-Standort des Monteurs
- Entfernungsanzeige zu Aufträgen

**Map-Provider:**
- Context-basierte Verwaltung
- Austauschbare Map-Engine
- Offline-Karten-Support (geplant)

---

### 2.3 Profile (Profil)

**Beschreibung:** Benutzerverwaltung und persönliche Einstellungen

#### 2.3.1 Dashboard-View

**Arbeitszeitübersicht:**
- Heute: Aktuelle Arbeitszeit
- Woche: Wochenübersicht
- Monat: Monatsstatistik
- Soll-Stunden Vergleich

**Schnellzugriff-Buttons:**
- **Planung:** Wochenplanung & Schichtübersicht
- **Unfall melden:** 3-Schritt-Unfallmeldungsprozess

**Einstellungen:**
- Benachrichtigungen
- Dokumente
- Hilfe & Support
- Abmelden

#### 2.3.2 Planung-View

**Wochenplanung:**
- Kalender-Ansicht (7 Tage)
- Schicht-Übersicht
- Auftrags-Zuweisung
- Urlaubsanträge
- Verfügbarkeitsmanagement

**Features:**
- Drag & Drop Schichttausch
- Filter nach Auftragstyp
- Export als PDF/iCal

#### 2.3.3 Unfallmelden-View

**3-Schritt-Prozess:**

**Schritt 1: Unfalldetails**
- Datum & Uhrzeit
- Unfallart (Dropdown)
  - Arbeitsunfall
  - Wegeunfall
  - Beinahe-Unfall
- Schweregrad (Dropdown)
  - Leicht
  - Mittel
  - Schwer
- Ort (Freitext + GPS)

**Schritt 2: Beschreibung**
- Unfallhergang (Textarea)
- Beteiligte Personen
- Zeugen (optional)
- Erste-Hilfe-Maßnahmen

**Schritt 3: Zusatzinformationen**
- Foto-Upload (mehrere Fotos)
- Skizze (Canvas-Tool)
- Verletzungsdetails
- Arztbesuch (Ja/Nein)

**Validierung:**
- Pflichtfelder pro Schritt
- Fortschrittsbalken
- "Weiter"-Button nur bei Vollständigkeit
- "Zurück"-Navigation möglich
- Entwurf speichern (Auto-Save)

**Bestätigung:**
- Zusammenfassung aller Daten
- "Absenden"-Button
- Erfolgsbestätigung mit Vorgangsnummer
- E-Mail-Bestätigung an Monteur & Verwaltung

#### 2.3.4 Logs-View (Meine Daten)

**Beschreibung:** Kategorisiertes Aktivitätsprotokoll

**Kategorien (ausklappbar):**

1. **Persönliche Daten** (0)
   - Profiländerungen
   - Kontaktdaten-Updates

2. **Arbeitsinformationen** (2)
   - Vertragsänderungen
   - Statusänderungen
   - Letzte Aktualisierung

3. **Abwesenheiten** (0)
   - Urlaub
   - Krankheit
   - Sonderurlaub

4. **Dokumente** (0)
   - Hochgeladene Dokumente
   - Verträge
   - Zertifikate

5. **Benefits** (0)
   - Leistungen
   - Prämien

6. **Coins** (0)
   - Punktesystem
   - Belohnungen

7. **Achievements** (0)
   - Errungenschaften
   - Meilensteine

8. **Lernfortschritt** (0)
   - Schulungen
   - Zertifizierungen

9. **Berechtigungen** (0)
   - Zugriffsrechte
   - Rollenänderungen

10. **Unfälle** (NEU!) 🔴
    - Alle eingereichten Unfallmeldungen
    - Vorgangsnummer (z.B. UNF-12345678)
    - Status-Badge ("In Bearbeitung" / "Abgeschlossen")
    - Unfalldetails:
      - Datum & Uhrzeit
      - Unfallart
      - Schweregrad
      - Ort
      - Eingereicht am

11. **Allgemein** (0)
    - Sonstige Aktivitäten

**UI/UX:**
- Chevron-Icons zum Ausklappen
- Badge-Counter für Anzahl Einträge
- Farbcodierte Kategorien
- Expandierbare Detail-Ansicht
- Chronologische Sortierung
- Suchfunktion (geplant)

**Activity Log Context:**
- Kategorien: `navigation`, `order`, `time`, `upload`, `system`, `alert`, `other`
- Automatische Erfassung bei:
  - Navigation (Tab-Wechsel)
  - Auftragsaktionen (Start, Abschluss)
  - Zeiterfassung (Einstempeln, Tour)
  - Uploads (Fotos, Skizzen)
  - Unfallmeldungen (alert)
  - Systemereignisse

---

### 2.4 Material (Infos)

**Beschreibung:** Materialkatalog mit drei Kategorien

#### 2.4.1 Tabs

**1. Sticker (Aufkleber)**
- PDF-Dokumente
- Vorlagen & Spezifikationen
- Features:
  - PDF-Preview-Icon
  - Dateiname & Dateigröße
  - Upload-Datum
  - Download-Button
  - Suchfunktion

**2. Schilder**
- Verkehrszeichen-Katalog
- Features:
  - Thumbnail-Bild
  - Name & Nummer (StVO)
  - Kategorie (z.B. Gefahrenzeichen)
  - Detailansicht mit:
    - Großes Bild
    - Vollständige Beschreibung
    - StVO-Informationen
    - Montageanleitung
  - Suchfunktion nach Name, Nummer, Kategorie

**3. Sonstiges**
- Lager-Material & Werkzeuge
- Features:
  - Produktbild
  - Name & Beschreibung
  - Bestand (Anzahl + Einheit)
  - Lagerort
  - Detailansicht mit:
    - Technische Details
    - Verwendungszweck
    - Verfügbarkeit
  - Suchfunktion

#### 2.4.2 Mobile Optimierungen

**Keine abgeschnittenen Texte:**
- Mehrzeilige Darstellung (bis zu 2 Zeilen)
- `word-break: break-word` für lange Wörter
- `-webkit-line-clamp: 2` für kontrolliertes Umbrechen

**Touch-freundlich:**
- Größere Touch-Targets (min. 44x44px)
- Optimierte Abstände
- Swipe-Gesten
- Haptic Feedback (iOS)

**Responsive Breakpoints:**
- Desktop: > 768px
- Tablet: 768px - 481px
- Mobile: ≤ 480px

---

## 3. Kontexte (State Management)

### 3.1 OrdersContext
- Auftragsliste
- Filterung nach Typ & Status
- CRUD-Operationen
- Offline-Sync (geplant)

### 3.2 OrderUploadsContext
- Upload-Verwaltung
- Foto-Slots
- Skizzen
- Validierungsstatus
- Cloud-Upload (geplant)

### 3.3 MapProviderContext
- Karten-Instanz
- Marker-Verwaltung
- Routen-Caching

### 3.4 ActivityLogContext
- Aktivitätsprotokolle
- Kategorisierung
- Export-Funktionalität
- Kategorien: `navigation`, `order`, `time`, `upload`, `system`, `alert`, `other`

### 3.5 TimeTrackingContext (geplant)
- Zeiterfassung
- Timer-Management
- Arbeitszeitauswertung

---

## 4. Validierungsregeln

### 4.1 Auftrags-Abschluss

**Halteverbotszone:**
```
WENN Auftragstyp = "Zone" DANN
  - 3 Fotos erforderlich (Schild 1, Schild 2, Totale)
  - Aufstellprotokoll 100% ausgefüllt
  - GPS-Daten vorhanden
SONST Abschluss gesperrt
```

**Einzelschild:**
```
WENN Auftragstyp = "Einzelschild" DANN
  - 2 Fotos erforderlich (Schild 1, Totale)
  - Aufstellprotokoll 100% ausgefüllt
  - GPS-Daten vorhanden
SONST Abschluss gesperrt
```

### 4.2 Foto-Upload

```
- Maximale Dateigröße: 10 MB pro Foto
- Erlaubte Formate: JPG, PNG, HEIC
- Mindestauflösung: 1280x720
- Automatische Kompression bei Upload
- EXIF-Daten erhalten (GPS, Zeitstempel)
```

### 4.3 Unfallmeldung

```
Schritt 1 (Pflichtfelder):
  - Datum & Uhrzeit
  - Unfallart (Dropdown-Auswahl)
  - Schweregrad (Dropdown-Auswahl)
  - Ort (min. 10 Zeichen)

Schritt 2 (Pflichtfelder):
  - Unfallhergang (min. 50 Zeichen)
  - Erste-Hilfe-Maßnahmen (Ja/Nein)

Schritt 3 (Optional):
  - Fotos (empfohlen, min. 1)
  - Skizze (optional)
  - Verletzungsdetails (bei Schweregrad "Schwer" Pflicht)
```

---

## 5. UI/UX Design System

### 5.1 Farbpalette

**Primary Colors:**
```css
--app-primary: #3c61bc;        /* Hauptfarbe */
--app-primary-hover: #2d4a8f;  /* Hover-Zustand */
```

**Semantic Colors:**
```css
--color-success: #22c55e;      /* Erfolg, aktiv */
--color-warning: #eab308;      /* Warnung */
--color-error: #ef4444;        /* Fehler */
--color-info: #3b82f6;         /* Info */
```

**Neutral Colors:**
```css
--color-background: #f5f5f5;
--color-surface: #ffffff;
--color-border: #e5e7eb;
--color-text-primary: #1f2937;
--color-text-secondary: #6b7280;
--color-text-tertiary: #9ca3af;
```

### 5.2 Typografie

**Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

**Font Sizes:**
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
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
```

### 5.4 Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-card: 12px;
--radius-button: 8px;
--radius-pill: 9999px;
```

### 5.5 Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
```

### 5.6 Komponenten-Richtlinien

**Buttons:**
- Mindesthöhe: 44px (Touch-Target)
- Padding: 12px 20px
- Border-Radius: var(--radius-button)
- Hover: Transform + Shadow
- Active: Scale(0.98)

**Cards:**
- Border: 1px solid var(--color-border)
- Border-Radius: var(--radius-card)
- Padding: var(--space-md) - var(--space-lg)
- Shadow: var(--shadow-sm)
- Hover: translateY(-2px) + shadow-md

**Inputs:**
- Höhe: 44px
- Border: 1px solid var(--color-border)
- Focus: border-color = var(--app-primary)
- Font-Size: 16px (verhindert Zoom auf iOS)

**Modals:**
- Backdrop: rgba(0, 0, 0, 0.6) + blur(4px)
- Content: max-width 600px
- Animation: slideUp (300ms)
- Mobile: Full-width, bottom-sheet

---

## 6. Performance-Anforderungen

### 6.1 Ladezeiten
- **Initial Load:** < 2 Sekunden
- **Route Navigation:** < 200ms
- **Image Loading:** Progressive (lazy)

### 6.2 Offline-Fähigkeit (geplant)
- Service Worker für Asset-Caching
- IndexedDB für Auftrags-Daten
- Sync-Queue für Uploads

### 6.3 Optimierungen
- Code-Splitting nach Routen
- Image-Kompression automatisch
- CSS-in-JS vermeiden (CSS Modules)
- Virtualisierte Listen bei > 50 Items

---

## 7. Sicherheit & Datenschutz

### 7.1 Authentifizierung
- OAuth 2.0 / JWT-Tokens
- Biometrische Authentifizierung (Face ID, Touch ID)
- Session-Timeout: 30 Minuten Inaktivität

### 7.2 Datenverschlüsselung
- HTTPS/TLS für alle API-Calls
- Lokale Daten verschlüsselt (AES-256)
- Fotos mit Wasserzeichen (optional)

### 7.3 Berechtigungen
- Kamera-Zugriff (nur bei Bedarf)
- GPS-Standort (Hintergrund für Tracking)
- Benachrichtigungen
- Photo Library (nur lesend)

### 7.4 DSGVO-Konformität
- Datenminimierung
- Einwilligungen transparent
- Recht auf Löschung
- Datenportabilität (Export)

---

## 8. Implementierte Features (Status)

### ✅ Vollständig implementiert

- [x] Haupt-Navigation (4 Module)
- [x] OrderFeed mit 4 Tabs (Halteverbot, Baustelle, Bereitschaft, Kontrollfahrt)
- [x] Badge-Zähler in allen Tabs
- [x] Zeiterfassungssystem (Einstempeln/Ausstempeln)
- [x] Tour-Timer (Starten/Beenden)
- [x] Timer-Integration in alle OrderFeed-Tabs
- [x] Foto-Upload-System mit vordefinierten Slots
- [x] Skizze-Modal mit Canvas-Zeichentool
- [x] Foto-Upload-Modal mit Kamera-Zugriff
- [x] Grid-Galerie für Foto-Vorschau
- [x] Aufstellprotokoll-Validierung
- [x] Profile-Dashboard mit Arbeitszeitübersicht
- [x] Planung-View (Wochenplanung)
- [x] Unfallmelden-View (3-Schritt-Prozess)
- [x] Logs-View mit 11 Kategorien (inkl. Unfälle)
- [x] Activity Log Context mit alert-Kategorie
- [x] Material-View mit 3 Tabs (Sticker, Schilder, Sonstiges)
- [x] Suchfunktion in Material-View
- [x] Detail-Modals für Schilder & Sonstiges
- [x] Mobile Optimierung (keine abgeschnittenen Texte)
- [x] Responsive Design (3 Breakpoints)
- [x] CSS Modules & CSS-Variablen
- [x] Domain-driven Struktur
- [x] Max. 150 Zeilen pro Component

### 🚧 In Arbeit / Geplant

- [ ] Backend-Integration (API)
- [ ] Offline-Sync (Service Worker)
- [ ] Push-Benachrichtigungen
- [ ] Echtzeit-Updates (WebSocket)
- [ ] Biometrische Authentifizierung
- [ ] Erweiterte Routen-Planung
- [ ] Export-Funktionen (PDF, CSV)
- [ ] Multi-Language Support (DE, EN)
- [ ] Dark Mode
- [ ] Accessibility (WCAG 2.1 AA)

---

## 9. API-Anforderungen (für Backend-Team)

### 9.1 Endpoints

**Authentifizierung:**
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

**Aufträge:**
```
GET    /api/orders              # Liste aller Aufträge
GET    /api/orders/:id          # Einzelner Auftrag
POST   /api/orders/:id/start    # Auftrag starten
POST   /api/orders/:id/complete # Auftrag abschließen
PATCH  /api/orders/:id          # Auftrag aktualisieren
```

**Uploads:**
```
POST   /api/uploads/photo       # Foto hochladen
POST   /api/uploads/sketch      # Skizze hochladen
GET    /api/uploads/:id         # Upload abrufen
DELETE /api/uploads/:id         # Upload löschen
```

**Zeiterfassung:**
```
POST   /api/timetracking/clock-in   # Einstempeln
POST   /api/timetracking/clock-out  # Ausstempeln
POST   /api/timetracking/tour/start # Tour starten
POST   /api/timetracking/tour/end   # Tour beenden
GET    /api/timetracking/summary    # Zusammenfassung
```

**Unfallmeldungen:**
```
POST   /api/incidents           # Unfallmeldung erstellen
GET    /api/incidents           # Liste aller Meldungen
GET    /api/incidents/:id       # Einzelne Meldung
PATCH  /api/incidents/:id       # Meldung aktualisieren
```

**Material:**
```
GET    /api/materials/stickers  # Sticker/PDFs
GET    /api/materials/signs     # Schilder
GET    /api/materials/misc      # Sonstiges
GET    /api/materials/search    # Suche
```

### 9.2 Datenmodelle

**Order (Auftrag):**
```typescript
interface Order {
  id: string;
  orderNumber: string;
  type: 'halteverbot' | 'baustelle' | 'bereitschaft' | 'kontrollfahrt';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  requiredPhotos: number;
  uploadedPhotos: number;
  protocolCompleted: boolean;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}
```

**Upload:**
```typescript
interface Upload {
  id: string;
  orderId: string;
  type: 'photo' | 'sketch';
  slotName: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  fileSize: number;
  metadata?: {
    gps?: { lat: number; lng: number };
    timestamp?: string;
    device?: string;
  };
  createdAt: string;
}
```

**TimeEntry:**
```typescript
interface TimeEntry {
  id: string;
  userId: string;
  type: 'work' | 'tour';
  startTime: string;
  endTime?: string;
  duration?: number;
  orderId?: string;
  createdAt: string;
}
```

**Incident (Unfallmeldung):**
```typescript
interface Incident {
  id: string;
  incidentNumber: string;
  userId: string;
  date: string;
  time: string;
  type: 'arbeitsunfall' | 'wegeunfall' | 'beinahe_unfall';
  severity: 'leicht' | 'mittel' | 'schwer';
  location: {
    address: string;
    gps?: { lat: number; lng: number };
  };
  description: string;
  involvedPersons?: string[];
  witnesses?: string[];
  firstAid: boolean;
  photos?: string[];
  sketch?: string;
  injuryDetails?: string;
  doctorVisit: boolean;
  status: 'in_bearbeitung' | 'abgeschlossen';
  createdAt: string;
  updatedAt: string;
}
```

---

## 10. Testing-Strategie

### 10.1 Unit Tests
- Alle Context-Provider (>80% Coverage)
- Validierungs-Funktionen (100% Coverage)
- Utility-Funktionen

### 10.2 Integration Tests
- Upload-Flow (Foto + Skizze)
- Auftrags-Abschluss-Flow
- Zeiterfassungs-Flow
- Unfallmeldungs-Flow

### 10.3 E2E Tests
- Kritische User-Journeys:
  - Monteur stempelt ein → startet Tour → schließt Auftrag ab
  - Monteur meldet Unfall (3 Schritte)
  - Material-Suche & Detail-Ansicht

### 10.4 Browser/Device Testing
- **Mobile:**
  - iOS Safari (14+)
  - Chrome Android (90+)
- **Desktop:**
  - Chrome (90+)
  - Firefox (85+)
  - Safari (14+)

---

## 11. Deployment & CI/CD

### 11.1 Environments
- **Development:** dev.browo-runner.app
- **Staging:** staging.browo-runner.app
- **Production:** app.browo-runner.app

### 11.2 Build-Pipeline
```yaml
1. Lint & Format Check
2. Unit Tests
3. Integration Tests
4. Build (Vite)
5. E2E Tests
6. Deploy to Environment
```

### 11.3 Monitoring
- Error Tracking (Sentry)
- Analytics (Google Analytics / Matomo)
- Performance Monitoring (Lighthouse CI)
- Uptime Monitoring

---

## 12. Roadmap

### Phase 1 (Q1 2026) - ✅ ABGESCHLOSSEN
- Grundlegende Architektur
- Haupt-Navigation
- Auftragsverwaltung (OrderFeed)
- Zeiterfassungssystem
- Upload-System (Fotos + Skizzen)
- Profile-Dashboard
- Unfallmeldung
- Material-Katalog

### Phase 2 (Q2 2026)
- Backend-Integration
- Authentifizierung
- Push-Benachrichtigungen
- Offline-Modus
- Echtzeit-Sync

### Phase 3 (Q3 2026)
- Erweiterte Routen-Planung
- Team-Kommunikation (Chat)
- Statistiken & Reporting
- Admin-Dashboard

### Phase 4 (Q4 2026)
- KI-gestützte Tourenoptimierung
- Vorausschauende Wartung
- Multi-Language Support
- Barrierefreiheit (WCAG 2.1)

---

## 13. Support & Wartung

### 13.1 Support-Kanäle
- In-App Support (Chat)
- E-Mail: support@browo-runner.app
- Hotline: +49 (0) XXX XXX XXX
- FAQ & Knowledge Base

### 13.2 Update-Zyklik
- **Minor Updates:** Alle 2 Wochen
- **Major Updates:** Quartalsweise
- **Hotfixes:** Bei kritischen Bugs innerhalb 24h

### 13.3 Wartungsfenster
- Sonntag 02:00 - 04:00 Uhr (CET)
- Vorankündigung: 48h

---

## Anhang

### A. Glossar

**Monteur:** Verkehrssicherungsmonteur, Hauptnutzer der App  
**Auftrag:** Arbeitseinsatz zur Aufstellung von Verkehrssicherungsmaßnahmen  
**Zone:** Halteverbotszone mit 2 Schildern  
**Aufstellprotokoll:** Dokumentation der durchgeführten Aufstellung  
**Skizze:** Handgezeichnete Darstellung des Aufstellorts  
**Tour:** Zeitraum zwischen Tour-Start und Tour-Ende  
**Einstempeln:** Beginn der Arbeitszeit  

### B. Abkürzungen

**PRD:** Product Requirements Document  
**UX:** User Experience  
**UI:** User Interface  
**GPS:** Global Positioning System  
**StVO:** Straßenverkehrs-Ordnung  
**DSGVO:** Datenschutz-Grundverordnung  
**WCAG:** Web Content Accessibility Guidelines  

---

**Dokumenten-Ende**

*Erstellt von: Browo Runner Produktteam*  
*Letzte Aktualisierung: 13. Januar 2026*  
*Version: 1.0*
