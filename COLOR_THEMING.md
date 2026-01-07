# 🎨 Globales Color Theming - Field Service App

## Übersicht

Die gesamte App verwendet ein zentrales Farbverwaltungssystem über CSS Custom Properties (CSS-Variablen). Alle Buttons, Icons und Akzentfarben werden zentral in einer Datei gesteuert.

## 🎯 Primärfarbe ändern

Um die Hauptfarbe der App (aktuell **Königsblau #3c61bc**) zu ändern:

### Datei öffnen
```
/src/styles/theme.css
```

### Variable ändern (Zeile ~77)
```css
/* Field Service App - Brand Colors */
--app-primary: #3c61bc;              /* ← HIER ÄNDERN */
--app-primary-foreground: #ffffff;   /* Text/Icon-Farbe auf primary Hintergrund */
```

### Beispiel: Zurück zu Lichtblau
```css
--app-primary: #4eb2e5;
--app-primary-foreground: #ffffff;
```

### Beispiel: Perlnachtblau (RAL 5026)
```css
--app-primary: #192643;
--app-primary-foreground: #ffffff;
```

### Beispiel: Grüne Unternehmensfarbe
```css
--app-primary: #22c55e;
--app-primary-foreground: #ffffff;
```

### Beispiel: Dunkles Rot
```css
--app-primary: #dc2626;
--app-primary-foreground: #ffffff;
```

## 📦 Wo wird die Farbe verwendet?

Die Variable `var(--app-primary)` wird automatisch in allen folgenden Komponenten verwendet:

### Buttons & Navigation
- ✅ Bottom Navigation (aktive Tabs)
- ✅ View-Tabs (Tour/In Planung)
- ✅ Tour starten Button
- ✅ Einstempeln/Ausstempeln Button-Icons
- ✅ Filter-Buttons (aktive States)
- ✅ Quick Action Button (FAB)
- ✅ Map Control Buttons
- ✅ Action Buttons in OrderCards (Skizze, Nachricht, Dokument)

### Timeline & Visualisierung
- ✅ Timeline-Nummern (1, 2, 3...)
- ✅ Timeline-Verbindungslinie
- ✅ Map Route Line
- ✅ Map Marker (Fahrer-Position)

### Icons & Text
- ✅ Header Icons
- ✅ Arbeitszeit-Timer (Wert + Icon)
- ✅ Material-Anzahl
- ✅ Kategorie-Tags

### Hover States
Alle Hover-States verwenden eine dunklere Variante: `#2d4a8f` (kann ebenfalls angepasst werden)

## 🔧 Erweiterte Anpassung

### Hover-Farbe ändern
Suche in den SCSS-Dateien nach `#2d4a8f` und ersetze durch deine gewünschte dunklere Variante.

### Weitere Farbvariablen hinzufügen
```css
/* In /src/styles/theme.css */

--app-secondary: #10b981;        /* Sekundäre Farbe */
--app-accent: #f59e0b;           /* Akzent-Farbe */
--app-success: #22c55e;          /* Erfolg */
--app-warning: #f59e0b;          /* Warnung */
--app-error: #ef4444;            /* Fehler */
```

## 🎨 Aktuelle Farbpalette

```
Königsblau (Primary): #3c61bc
├─ RGB: 60, 97, 188
├─ Hover: #2d4a8f (dunkler)
└─ Verwendung: Alle Buttons, Navigation, Timeline

Grün (Einstempeln): #22c55e
└─ Verwendung: Clock-In Button

Rot (Ausstempeln): #ef4444
└─ Verwendung: Clock-Out Button (aktiv)

Aufsteller-Tag: #16a34a (Grün)
Abholer-Tag: #ca8a04 (Gelb/Orange)
```

## 💡 Best Practices

1. **Zentrale Verwaltung**: Ändere Farben NUR in `/src/styles/theme.css`
2. **Keine Hardcoded Hex-Werte**: Verwende immer `var(--app-primary)` in SCSS-Dateien
3. **Kontrast prüfen**: Stelle sicher, dass `--app-primary-foreground` auf `--app-primary` lesbar ist
4. **Dark Mode**: Die Variable kann auch für Dark Mode angepasst werden (Zeile 83+)

## 🚀 Änderungen live sehen

Nach dem Ändern von `/src/styles/theme.css`:
1. Datei speichern
2. Browser refreshen (oder Hot-Reload)
3. Alle Buttons verwenden sofort die neue Farbe!

---

**Entwickelt für**: Field Service App - Verkehrssicherungsmonteure  
**CSS Framework**: Tailwind CSS v4.0 mit Custom Properties  
**Architektur**: Domain-Driven Design mit CSS Modules