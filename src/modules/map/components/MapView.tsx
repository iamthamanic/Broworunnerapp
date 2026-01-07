import { Navigation, Layers, Zap, Map as MapIcon } from 'lucide-react';
import styles from './MapView.module.scss';

interface RouteInfo {
  totalDistance: number;
  estimatedTime: number;
  stops: number;
}

interface MapViewProps {
  routeInfo?: RouteInfo;
  onStartNavigation?: () => void;
  onOptimizeRoute?: () => void;
}

export function MapView({
  routeInfo,
  onStartNavigation,
  onOptimizeRoute,
}: MapViewProps): JSX.Element {
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} min`;
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Route</h1>
        <div className={styles.headerActions}>
          <button className={styles.iconButton} aria-label="Ebenen">
            <Layers size={20} />
          </button>
          <button className={styles.iconButton} aria-label="Navigation">
            <Navigation size={20} />
          </button>
        </div>
      </div>

      <div className={styles.mapPlaceholder}>
        <MapIcon className={styles.mapIcon} />
        <p className={styles.mapText}>Karte wird geladen</p>
        <p className={styles.mapSubtext}>
          GraphHopper Integration für Routenoptimierung
        </p>
      </div>

      {routeInfo && (
        <div className={styles.routeInfo}>
          <div className={styles.routeCard}>
            <div className={styles.routeHeader}>
              <span className={styles.routeTitle}>Tagesroute</span>
              <button className={styles.routeOptimize} onClick={onOptimizeRoute}>
                <Zap size={16} />
                Optimieren
              </button>
            </div>
            
            <div className={styles.routeStats}>
              <div className={styles.routeStat}>
                <span className={styles.routeStatValue}>
                  {formatDistance(routeInfo.totalDistance)}
                </span>
                <span className={styles.routeStatLabel}>Gesamtstrecke</span>
              </div>
              <div className={styles.routeStat}>
                <span className={styles.routeStatValue}>
                  {formatTime(routeInfo.estimatedTime)}
                </span>
                <span className={styles.routeStatLabel}>Geschätzte Zeit</span>
              </div>
              <div className={styles.routeStat}>
                <span className={styles.routeStatValue}>{routeInfo.stops}</span>
                <span className={styles.routeStatLabel}>Stopps</span>
              </div>
            </div>

            <button className={styles.startButton} onClick={onStartNavigation}>
              Navigation starten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}