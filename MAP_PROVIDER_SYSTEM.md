# 🗺️ Flexibles Map-Provider-System

## Übersicht

Die App verwendet ein **abstraktes Map-Provider-System**, das einen einfachen Wechsel zwischen verschiedenen Kartenanbietern ermöglicht (OpenStreetMap, Google Maps, Mapbox, HERE Maps, etc.).

## Aktueller Provider: OpenStreetMap

**Standard-Implementierung:** OpenStreetMap mit Leaflet & Nominatim Geocoding
- ✅ **Kostenlos** - Keine API-Keys erforderlich
- ✅ **Echte Geocoding-API** - Adressen werden in GPS-Koordinaten umgewandelt
- ✅ **Echte Karten-Anzeige** - Interaktive Karte mit Zoom & Pan
- ✅ **Benutzer-Position** - GPS-Zugriff über Browser Geolocation API
- ✅ **Route-Visualisierung** - Polyline zwischen allen Stopps

## Architektur

### 📁 Struktur

```
/src/services/map/
  ├── types.ts                      # Map-Provider-Interface & Types
  └── OpenStreetMapProvider.ts      # OpenStreetMap-Implementierung

/src/contexts/
  └── MapProviderContext.tsx        # Provider-Context für App-weiten Zugriff

/src/modules/orders/components/
  ├── LeafletMap.tsx                # Pure Leaflet Karten-Komponente (kein React-Leaflet)
  ├── LeafletMap.module.scss
  ├── MapTab.tsx                    # Integration in OrderFeed
  └── MapTab.module.scss
```

### 🔧 Interface: `IMapProvider`

```typescript
interface IMapProvider {
  name: string;
  
  // Adresse → GPS-Koordinaten
  geocodeAddress(address: string): Promise<GeocodingResult | null>;
  
  // GPS-Koordinaten → Adresse
  reverseGeocode(coordinates: Coordinates): Promise<GeocodingResult | null>;
  
  // Route zwischen mehreren Punkten berechnen
  calculateRoute?(waypoints: Coordinates[]): Promise<MapRoute | null>;
  
  // Aktuelle Benutzer-Position abrufen
  getUserPosition(): Promise<Coordinates | null>;
}
```

## Verwendung

### Als Benutzer

**In der Tour-Ansicht:**
1. **Karte anzeigen** - Scrolle zur Karte unter den Action-Buttons
2. **Standorte sehen** - Alle Aufträge werden als Marker angezeigt
   - 🟢 **Grün** = Aufsteller
   - 🟡 **Gelb** = Abholer
   - 🔵 **Blau** = Deine Position
3. **Route sehen** - Blaue Linie verbindet alle Stopps in Reihenfolge
4. **Navigation** - "Standort"-Button für GPS-Position
5. **Interaktion** - Zoom, Pan, Marker-Klick für Details

### Als Entwickler

#### Context verwenden:

```tsx
import { useMapProvider } from '../contexts/MapProviderContext';

function MyComponent() {
  const { provider, providerType } = useMapProvider();
  
  // Adresse geocodieren
  const result = await provider.geocodeAddress('Berliner Str. 123, 10115 Berlin');
  
  // Benutzer-Position abrufen
  const position = await provider.getUserPosition();
}
```

#### Provider einbinden:

```tsx
import { MapProviderProvider } from '../contexts/MapProviderContext';

<MapProviderProvider defaultProvider="openstreetmap">
  <App />
</MapProviderProvider>
```

#### Karte verwenden:

```tsx
import { LeafletMap } from './LeafletMap';
import type { MapMarker } from '../services/map/types';

const markers: MapMarker[] = [
  {
    id: '1',
    position: { lat: 52.52, lng: 13.405 },
    title: 'Berliner Str. 123',
    type: 'pickup'
  }
];

<LeafletMap 
  markers={markers}
  userPosition={{ lat: 52.52, lng: 13.405 }}
  route={[...]}
  onMarkerClick={(id) => console.log(id)}
/>
```

## Provider wechseln

### Neuen Provider hinzufügen (z.B. Google Maps)

**1. Provider-Klasse erstellen:**

```typescript
// /src/services/map/GoogleMapsProvider.ts
import type { IMapProvider, Coordinates, GeocodingResult } from './types';

export class GoogleMapsProvider implements IMapProvider {
  name = 'Google Maps';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?` +
      `address=${encodeURIComponent(address)}&key=${this.apiKey}`
    );
    const data = await response.json();
    
    if (data.results.length === 0) return null;
    
    const result = data.results[0];
    return {
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      },
      displayName: result.formatted_address,
      address: { /* ... */ }
    };
  }

  // Weitere Methoden implementieren...
}
```

**2. Provider in Context registrieren:**

```typescript
// /src/contexts/MapProviderContext.tsx
function createMapProvider(type: MapProviderType): IMapProvider {
  switch (type) {
    case 'openstreetmap':
      return new OpenStreetMapProvider();
    case 'google':
      return new GoogleMapsProvider('YOUR_API_KEY');  // ← Neu!
    case 'mapbox':
      return new MapboxProvider('YOUR_TOKEN');
    default:
      return new OpenStreetMapProvider();
  }
}
```

**3. Provider wechseln:**

```tsx
const { setProviderType } = useMapProvider();

// Zu Google Maps wechseln
setProviderType('google');
```

### Unterstützte Provider (erweiterbar)

| Provider | Status | API-Key | Geocoding | Routing | Kosten |
|----------|--------|---------|-----------|---------|--------|
| **OpenStreetMap** | ✅ Implementiert | ❌ Nicht nötig | ✅ Nominatim | ⚠️ Basic | 🆓 Kostenlos |
| **Google Maps** | 📝 Vorlage | ✅ Erforderlich | ✅ Ja | ✅ Ja | 💰 Pay-per-use |
| **Mapbox** | 📝 Vorlage | ✅ Erforderlich | ✅ Ja | ✅ Ja | 💰 Free Tier + Pay |
| **HERE Maps** | 📝 Vorlage | ✅ Erforderlich | ✅ Ja | ✅ Ja | 💰 Free Tier + Pay |

## Features

### ✅ Aktuell implementiert

- **Echtes Geocoding** - Adressen werden live in GPS-Koordinaten umgewandelt
- **Interaktive Karte** - Leaflet-basiert mit Zoom, Pan, Marker
- **Benutzer-Position** - GPS-Zugriff (Browser Geolocation API)
- **Route-Anzeige** - Polyline zwischen allen Auftrags-Stopps
- **Marker-Typen** - Unterschiedliche Farben für Aufsteller/Abholer
- **Caching** - Geocoding-Ergebnisse werden gecacht
- **Provider-Abstraktion** - Einfacher Wechsel zwischen Anbietern

### 🚧 Geplant / Erweiterbar

- **Turn-by-turn Navigation** - OSRM-Integration für echtes Routing
- **Offline-Karten** - Tile-Caching für Offline-Nutzung
- **Verkehrslage** - Live-Traffic-Daten
- **Alternative Routen** - Mehrere Routenvorschläge
- **ETA-Berechnung** - Geschätzte Ankunftszeit pro Stopp
- **Cluster-Marker** - Marker-Gruppierung bei Zoom-Out
- **Custom Map Styles** - Dark Mode, minimalistisch, etc.

## Technische Details

### OpenStreetMap-Stack

**Karten-Rendering:**
- **Leaflet.js** - Leichtgewichtige Karten-Library (Pure JS, kein React-Wrapper)
- **OSM Tile Server** - `https://tile.openstreetmap.org`

**Geocoding:**
- **Nominatim API** - OpenStreetMap's Geocoding-Service
- **Endpoint:** `https://nominatim.openstreetmap.org`
- **Rate Limit:** 1 Request/Sekunde (Caching implementiert!)
- **User-Agent:** Erforderlich für API-Zugriff

**Routing (Basic):**
- Derzeit: Simple Polyline zwischen Punkten
- Upgrade möglich: OSRM (Open Source Routing Machine)
  - `http://router.project-osrm.org`
  - Echte Straßen-Routen mit Turn-by-turn

### Custom Marker-Icons

```typescript
function getMarkerIcon(type?: 'pickup' | 'delivery' | 'user'): L.DivIcon {
  const colors = {
    pickup: '#22c55e',    // Grün für Aufsteller
    delivery: '#eab308',  // Gelb für Abholer
    user: '#3c61bc'       // App-Primärfarbe für User
  };
  
  // Custom CSS-basierter Marker (Tropfen-Form)
  return L.divIcon({ /* ... */ });
}
```

## Performance

### Optimierungen

1. **Geocoding-Cache** - Adressen nur einmal geocodieren
2. **Lazy Loading** - Karte lädt nur wenn sichtbar
3. **Debouncing** - Position-Updates gedrosselt
4. **Tile-Caching** - Browser cached OSM-Tiles automatisch
5. **Auto-Bounds** - Zoom passt sich automatisch an Marker an

### Browser-Kompatibilität

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & iOS)
- ✅ Firefox (Desktop & Mobile)
- ⚠️ GPS erfordert HTTPS (außer localhost)
- ⚠️ GPS erfordert User-Permission

## API-Limits & Best Practices

### Nominatim (OpenStreetMap)

**Limits:**
- Max. 1 Request pro Sekunde
- User-Agent Header erforderlich
- Keine schweren Bulk-Requests

**Best Practices:**
- ✅ Caching implementiert
- ✅ User-Agent gesetzt
- ✅ Error-Handling
- ✅ Throttling bei zu vielen Requests

### Für Produktion

**Empfehlungen:**
1. **Eigener Tile-Server** - Für hohen Traffic
2. **Geocoding-Backend** - Cache auf Server-Seite
3. **CDN für Tiles** - Schnellere Ladezeiten
4. **Rate-Limiting** - Client & Server
5. **Fehler-Behandlung** - Fallback auf statische Karten

## Troubleshooting

### Karte lädt nicht
- Prüfe Internet-Verbindung
- Prüfe Browser-Console auf Errors
- Prüfe ob Leaflet CSS geladen ist

### GPS funktioniert nicht
- HTTPS erforderlich (außer localhost)
- User muss Location-Permission erteilen
- Prüfe Browser-Settings

### Geocoding schlägt fehl
- Prüfe Adress-Format (vollständig?)
- Nominatim Rate-Limit (1/sec)
- Prüfe Network-Tab in DevTools

### Marker erscheinen nicht
- Prüfe ob Coordinates valide sind
- Prüfe ob Leaflet Icons korrekt geladen
- Prüfe Browser-Console

## Erweiterungen (TODO)

- [ ] OSRM-Integration für echtes Turn-by-turn Routing
- [ ] Offline-Karten mit Service Worker
- [ ] Google Maps Provider implementieren
- [ ] Mapbox Provider implementieren
- [ ] Verkehrslage-Layer
- [ ] Satelliten-Ansicht
- [ ] Dark-Mode für Karten
- [ ] Marker-Clustering
- [ ] Search/Autocomplete für Adressen
- [ ] Export als GPX/KML