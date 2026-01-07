# 📷 Skizzen & Dokument-Upload System

## Übersicht

Die App verfügt über ein vollständiges Upload-System für Skizzen und Dokumente/Fotos pro Auftrag.

## Features

### 🎨 Skizzen-Modal
- **Canvas-basiertes Zeichentool**
  - Zeichnen mit verschiedenen Farben
  - Radiergummi-Funktion
  - Einstellbare Strichstärke (1-10)
  - Touch-Support für mobile Geräte
  
- **Skizzen-Import**
  - Bilder aus Galerie hochladen
  - Automatische Skalierung auf Canvas-Größe
  
- **Persistenz**
  - Skizzen werden pro Auftrag gespeichert
  - Beim erneuten Öffnen wird die Skizze geladen
  - Löschen-Funktion für Skizzen

- **Indikator**
  - Grüner Punkt am Skizze-Button wenn Skizze vorhanden
  - Button wird leicht hervorgehoben

### 📸 Dokument-Upload-Modal
- **Kamera-Zugriff**
  - Direktes Foto aufnehmen über "Foto aufnehmen" Button
  - `capture="environment"` für Rückkamera (auf mobilen Geräten)
  - Multiple-Upload möglich
  
- **Datei-Upload**
  - Dateien aus Galerie hochladen
  - Unterstützt: Bilder (image/*) und PDFs
  - Mehrere Dateien gleichzeitig hochladbar
  
- **Galerie-Ansicht**
  - Grid-Layout aller hochgeladenen Dokumente
  - Thumbnail-Vorschau
  - Zeitstempel und Dateiname
  - Löschen-Funktion (Hover auf Desktop, immer sichtbar auf Mobile)
  
- **Badge-System**
  - Roter Badge mit Anzahl am Dokument-Button
  - Zeigt Anzahl hochgeladener Dokumente (z.B. "4" bei 4 Fotos)
  - Button wird hervorgehoben wenn Dokumente vorhanden

## Technische Details

### State-Management
**Context:** `/src/contexts/OrderUploadsContext.tsx`
- Zentrale Verwaltung aller Uploads
- Per-Order-Speicherung
- In-Memory-Speicher (bei Reload gehen Daten verloren)

### Komponenten

**SketchModal:** `/src/modules/orders/components/SketchModal.tsx`
- Canvas-basiertes Zeichentool
- Touch-Events unterstützt
- PNG-Export via `toDataURL()`

**DocumentUploadModal:** `/src/modules/orders/components/DocumentUploadModal.tsx`
- FileReader API für Uploads
- Grid-Layout mit CSS Grid
- Responsive Design

**OrderCard:** `/src/modules/orders/components/OrderCard.tsx`
- Integration der Modals
- Badge- und Indikator-Anzeige
- Event-Handling

### Styling
- Konsistentes Design mit App-Primärfarbe (#3c61bc)
- Hover-States und Animationen
- Responsive Grid für Dokumente
- Mobile-optimierte Touch-Targets

## Verwendung

### Als Benutzer
1. **Skizze erstellen:**
   - Auf Skizze-Button klicken
   - Mit Finger/Maus zeichnen
   - Farbe und Strichstärke anpassen
   - "Speichern" klicken
   - Grüner Punkt zeigt gespeicherte Skizze an

2. **Dokumente hochladen:**
   - Auf Dokument-Button klicken
   - "Foto aufnehmen" für Kamera
   - "Dateien hochladen" für Galerie
   - Mehrere Fotos möglich
   - Roter Badge zeigt Anzahl

### Als Entwickler

**Context verwenden:**
```tsx
import { useOrderUploads } from '../contexts/OrderUploadsContext';

const { 
  getDocuments, 
  addDocument, 
  getSketch, 
  saveSketch 
} = useOrderUploads();

// Dokumente abrufen
const docs = getDocuments(orderId);

// Skizze prüfen
const hasSketch = !!getSketch(orderId);
```

**Provider einbinden:**
```tsx
import { OrderUploadsProvider } from '../contexts/OrderUploadsContext';

<OrderUploadsProvider>
  <App />
</OrderUploadsProvider>
```

## Erweiterungen (TODO)

- [ ] LocalStorage-Persistenz für Offline-Nutzung
- [ ] Backend-Integration für Cloud-Speicherung
- [ ] Komprimierung von Bildern vor Upload
- [ ] PDF-Vorschau für hochgeladene PDFs
- [ ] Annotationen auf hochgeladenen Bildern
- [ ] Signatur-Funktion im Skizzen-Tool
- [ ] Export als ZIP-Datei
- [ ] GPS-Koordinaten zu Uploads hinzufügen

## Browser-Kompatibilität

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & iOS)
- ✅ Firefox (Desktop & Mobile)
- ⚠️ Kamera-Zugriff erfordert HTTPS (außer localhost)
