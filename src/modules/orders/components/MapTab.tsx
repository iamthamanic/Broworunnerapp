import { useEffect, useState } from 'react';
import { Navigation, MapPin, Loader2 } from 'lucide-react';
import { LeafletMap } from './LeafletMap';
import { useMapProvider } from '../../../contexts/MapProviderContext';
import type { OrderDto } from '../types';
import type { MapMarker, Coordinates } from '../../../services/map/types';
import styles from './MapTab.module.scss';

interface MapTabProps {
  orders: OrderDto[];
}

export function MapTab({ orders }: MapTabProps): JSX.Element {
  const { provider } = useMapProvider();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [userPosition, setUserPosition] = useState<Coordinates | null>(null);
  const [route, setRoute] = useState<Coordinates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  // Geocode orders to get real coordinates
  useEffect(() => {
    const geocodeOrders = async () => {
      setIsLoading(true);
      const geocodedMarkers: MapMarker[] = [];

      // Process orders sequentially to respect rate limits
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const address = `${order.location.street} ${order.location.number}, ${order.location.postalCode} ${order.location.city}, Germany`;
        
        try {
          const result = await provider.geocodeAddress(address);
          
          if (result) {
            geocodedMarkers.push({
              id: order.id,
              position: result.coordinates,
              title: `${order.location.street} ${order.location.number}`,
              description: `${order.location.postalCode} ${order.location.city}`,
              type: order.actionType === 'aufsteller' ? 'pickup' : 'delivery',
              orderNumber: order.orderNumber,
            });
          }

          // Add delay between requests to respect Nominatim rate limit (1 req/sec)
          if (i < orders.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1100));
          }
        } catch (error) {
          console.error(`Failed to geocode order ${order.id}:`, error);
        }
      }

      setMarkers(geocodedMarkers);

      // Create route from markers
      if (geocodedMarkers.length > 0) {
        const waypoints = geocodedMarkers.map((m) => m.position);
        setRoute(waypoints);
      }

      setIsLoading(false);
    };

    if (orders.length > 0) {
      geocodeOrders();
    } else {
      setMarkers([]);
      setRoute([]);
      setIsLoading(false);
    }
  }, [orders, provider]);

  // Get user position
  const handleGetUserPosition = async () => {
    setIsLoadingPosition(true);
    const position = await provider.getUserPosition();
    if (position) {
      setUserPosition(position);
    }
    setIsLoadingPosition(false);
  };

  // Get user position on mount
  useEffect(() => {
    const getUserPos = async () => {
      setIsLoadingPosition(true);
      const position = await provider.getUserPosition();
      if (position) {
        setUserPosition(position);
      }
      setIsLoadingPosition(false);
    };
    getUserPos();
  }, [provider]);

  const handleMarkerClick = (markerId: string) => {
    console.log('Marker clicked:', markerId);
    // TODO: Open order detail or show info
  };

  const handleCenterOnUser = () => {
    handleGetUserPosition();
  };

  const hasPlannedRoute = markers.length > 0;

  return (
    <div className={styles.mapTab}>
      <div className={styles.mapControls}>
        <button 
          className={styles.controlButton} 
          onClick={handleCenterOnUser}
          disabled={isLoadingPosition}
          aria-label="Zu meinem Standort"
        >
          {isLoadingPosition ? <Loader2 size={18} className={styles.spinning} /> : <Navigation size={18} />}
        </button>
        <button 
          className={styles.controlButton} 
          aria-label="Alle Standorte anzeigen"
          title={`${markers.length} ${markers.length === 1 ? 'Standort' : 'Standorte'}`}
        >
          <MapPin size={18} />
        </button>
      </div>

      {isLoading ? (
        <div className={styles.mapLoading}>
          <Loader2 size={32} className={styles.spinning} />
          <p>Lade Karte...</p>
        </div>
      ) : (
        <LeafletMap
          markers={markers}
          userPosition={userPosition}
          route={route}
          onMarkerClick={handleMarkerClick}
          zoom={12}
        />
      )}

      <div className={styles.mapFooter}>
        <div className={styles.footerInfo}>
          <MapPin size={16} />
          <span>
            {hasPlannedRoute 
              ? `Route geplant mit ${orders.length} ${orders.length === 1 ? 'Auftrag' : 'Aufträgen'}` 
              : 'Aktueller Standort - Keine Route geplant'}
          </span>
        </div>
      </div>
    </div>
  );
}