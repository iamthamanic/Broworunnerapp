# Field Service App - Architektur

## Übersicht

Mobile-First Field Service App für Verkehrssicherungsmonteure mit Feed-basierter UX (ähnlich Uber Driver, Delivery Hero).

## Technologie Stack

- **React 18** mit TypeScript (strict mode)
- **CSS Modules** für alle Styles (KEIN Tailwind in JSX)
- **CSS Variables** für Design Tokens
- **Lucide React** für Icons
- **Vite** als Build Tool

## Projekt Struktur

```
/src
├── modules/                    # Domain-driven Modules
│   ├── orders/                # Auftragsverwaltung
│   │   ├── components/        # Order-spezifische UI Komponenten
│   │   ├── pages/             # Order Pages (Detail, etc.)
│   │   ├── hooks/             # Custom Hooks (useOrders)
│   │   ├── services/          # API Services
│   │   ├── types/             # TypeScript Interfaces
│   │   └── index.ts           # Public API
│   ├── map/                   # Kartenansicht & Navigation
│   │   └── components/
│   └── profile/               # Fahrerprofil
│       └── components/
├── components/
│   ├── layout/                # Layout Komponenten (BottomNav)
│   └── common/                # Shared Components
├── styles/
│   ├── theme.css              # CSS Variables & Design Tokens
│   ├── app.css                # Global App Styles
│   └── index.css              # Style Imports
└── app/
    └── App.tsx                # Main App Entry Point
```

## Styling Architektur

### Strikte CSS-First Regel

**VERBOTEN:**
- ❌ Tailwind Klassen in JSX
- ❌ Inline Styles (`style={{ }}`)
- ❌ Hardcoded Colors (`#hex`, `rgb()`)
- ❌ Arbitrary Tailwind Values

**ERLAUBT:**
- ✅ CSS Modules (`.module.scss`)
- ✅ CSS Variables für alle Farben, Spacing, etc.
- ✅ Semantic Class Names

### CSS Variables

Alle Design Tokens sind in `/src/styles/theme.css` definiert:

```css
/* Status Colors */
--status-pending: #f59e0b;
--status-in-progress: #3b82f6;
--status-completed: #10b981;
--status-cancelled: #ef4444;

/* Priority Colors */
--priority-low: #6b7280;
--priority-medium: #f59e0b;
--priority-high: #ef4444;
--priority-critical: #dc2626;

/* Spacing */
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
```

## Module Architektur

### Orders Module

**Zweck:** Verwaltung von Aufträgen (Halteverbot, Straßensperrungen, etc.)

**Komponenten:**
- `OrderCard` - Einzelner Auftrag in der Feed-Ansicht
- `OrderFeed` - Liste aller Aufträge mit Statistiken
- `OrderDetailPage` - Detailansicht eines Auftrags

**Hooks:**
- `useOrders()` - Lädt und verwaltet Aufträge

**Services:**
- `orderService` - Mock API Service (später echte API Integration)

### Map Module

**Zweck:** Kartenansicht und Routenplanung

**Komponenten:**
- `MapView` - Karte mit Routeninformationen

**Zukünftige Integration:**
- GraphHopper für Routenoptimierung
- Echtzeit-Navigation

### Profile Module

**Zweck:** Fahrerprofil und Einstellungen

**Komponenten:**
- `ProfileView` - Profil, Statistiken, Einstellungen

## Komponenten Guidelines

### File Size Limits
- **Max 300 Zeilen** pro File
- **Max 150 Zeilen** pro Component
- Bei Überschreitung: Component aufteilen

### Component Pattern

```tsx
// 1. Imports (geordnet)
import { useState } from 'react';
import styles from './Component.module.scss';

// 2. TypeScript Interfaces
interface ComponentProps {
  title: string;
}

// 3. Component
export function Component({ title }: ComponentProps): JSX.Element {
  // 3a. Hooks
  const [state, setState] = useState(false);
  
  // 3b. Event Handlers
  const handleClick = (): void => {
    setState(true);
  };
  
  // 3c. Early Returns
  if (!title) return null;
  
  // 3d. Render
  return (
    <div className={styles.container}>
      {title}
    </div>
  );
}
```

## API Integration (Vorbereitet)

### Order Service

Der `orderService` ist bereits vorbereitet für API Integration:

```typescript
// Aktuell: Mock Data
async fetchOrders(filters?: OrderFilters): Promise<OrderDto[]> {
  return this.getMockOrders(filters);
}

// Später: Echte API
async fetchOrders(filters?: OrderFilters): Promise<OrderDto[]> {
  const response = await fetch(`${this.apiBaseUrl}?${new URLSearchParams(filters)}`);
  return response.json();
}
```

## Datentypen

### OrderDto

```typescript
interface OrderDto {
  id: string;
  orderNumber: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  jobType: 'no-parking-zone' | 'road-closure' | 'traffic-safety' | 'construction-site';
  location: Location;
  description: string;
  scheduledDate: string;
  estimatedDuration: number;
  weight: number;
  materials?: string[];
  notes?: string;
}
```

## Mobile-First Design

- Touch-optimierte Buttons (min 44x44px)
- Bottom Navigation für einfache Erreichbarkeit
- Sticky Headers für Kontext
- Swipe-Gesten bereit (aktuell noch nicht implementiert)
- Pull-to-Refresh vorbereitet

## Zukünftige Features

### Phase 2
- [ ] Echte API Integration
- [ ] GraphHopper Routenoptimierung
- [ ] Offline-Modus mit Service Worker
- [ ] Push Notifications
- [ ] Photo Upload für Aufträge

### Phase 3
- [ ] Echtzeit-Updates via WebSocket
- [ ] Barcode/QR Scanner für Materialien
- [ ] Digitale Unterschrift
- [ ] Zeiterfassung
- [ ] Reporting & Analytics

## Performance

- Lazy Loading für Module
- CSS Modules für optimiertes Bundle Splitting
- Memoization für teure Berechnungen
- Virtual Scrolling für lange Listen (vorbereitet)

## Accessibility

- Semantic HTML
- ARIA Labels für Icon-Buttons
- Keyboard Navigation
- Screen Reader Support
- High Contrast Mode Support

## Code Quality Rules

1. **Keine Imports zwischen Modulen** (nur über index.ts)
2. **Strikte TypeScript** (no `any`)
3. **CSS Variables** für alle Farben
4. **CSS Modules** für alle Styles
5. **Max 150 Zeilen** pro Component
6. **Explicit Return Types** für alle Funktionen
