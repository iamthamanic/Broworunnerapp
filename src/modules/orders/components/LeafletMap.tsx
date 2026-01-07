import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { MapMarker, Coordinates } from '../../../services/map/types';
import 'leaflet/dist/leaflet.css';
import styles from './LeafletMap.module.scss';

// Fix for default marker icons in Leaflet
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

interface LeafletMapProps {
  markers: MapMarker[];
  center?: Coordinates;
  zoom?: number;
  userPosition?: Coordinates | null;
  route?: Coordinates[];
  onMarkerClick?: (markerId: string) => void;
  className?: string;
}

/**
 * Custom marker icons based on type
 */
function getMarkerIcon(type?: 'pickup' | 'delivery' | 'user'): L.DivIcon {
  const colors = {
    pickup: '#22c55e', // green
    delivery: '#eab308', // yellow
    user: '#3c61bc', // blue
  };

  const color = type ? colors[type] : '#6b7280';
  
  // User marker is larger and more prominent
  const isUser = type === 'user';
  const size = isUser ? 40 : 20;
  const borderWidth = isUser ? 4 : 2;
  const fontSize = isUser ? 16 : 10;

  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        border: ${borderWidth}px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: ${fontSize}px;
        ">
          ${isUser ? '●' : ''}
        </div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

/**
 * Leaflet Map Component - Pure Leaflet implementation without React-Leaflet
 */
export function LeafletMap({
  markers,
  center,
  zoom = 13,
  userPosition,
  route,
  onMarkerClick,
  className,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const isUnmountingRef = useRef(false);

  // Default center (Berlin, Germany)
  const defaultCenter: Coordinates = center || { lat: 52.52, lng: 13.405 };
  const mapCenter = markers.length > 0 ? markers[0].position : defaultCenter;

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    isUnmountingRef.current = false;

    // Create map
    const map = L.map(mapRef.current, {
      center: [mapCenter.lat, mapCenter.lng],
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
      preferCanvas: false,
      renderer: L.svg(), // Force SVG renderer instead of Canvas
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create layers
    markersLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      isUnmountingRef.current = true;
      
      // Cleanup in the correct order
      try {
        // Stop all animations first
        if (mapInstanceRef.current) {
          mapInstanceRef.current.stop();
        }

        // Remove user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
          userMarkerRef.current = null;
        }
        
        // Remove route layer
        if (routeLayerRef.current) {
          routeLayerRef.current.remove();
          routeLayerRef.current = null;
        }
        
        // Clear and remove markers layer
        if (markersLayerRef.current) {
          markersLayerRef.current.clearLayers();
          markersLayerRef.current.remove();
          markersLayerRef.current = null;
        }
        
        // Remove map instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (e) {
        // Ignore cleanup errors
        console.warn('Map cleanup error:', e);
      }
    };
  }, []); // Empty dependency array - only run once

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || isUnmountingRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Add order markers
    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.position.lat, marker.position.lng], {
        icon: getMarkerIcon(marker.type),
      });

      // Add popup
      const popupContent = `
        <div style="font-size: 0.875rem; line-height: 1.5;">
          <strong style="display: block; margin-bottom: 0.25rem;">${marker.title}</strong>
          ${marker.orderNumber ? `<div style="color: #666; font-size: 0.8rem;">Auftrag: ${marker.orderNumber}</div>` : ''}
          ${marker.description ? `<div style="color: #666; font-size: 0.8rem;">${marker.description}</div>` : ''}
        </div>
      `;
      leafletMarker.bindPopup(popupContent);

      // Add click handler
      if (onMarkerClick) {
        leafletMarker.on('click', () => onMarkerClick(marker.id));
      }

      leafletMarker.addTo(markersLayerRef.current!);
    });
  }, [markers, onMarkerClick]);

  // Update user position marker
  useEffect(() => {
    if (!mapInstanceRef.current || isUnmountingRef.current) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // Add new user marker
    if (userPosition) {
      const marker = L.marker([userPosition.lat, userPosition.lng], {
        icon: getMarkerIcon('user'),
      });

      marker.bindPopup('<strong>Deine Position</strong>');
      marker.addTo(mapInstanceRef.current);

      userMarkerRef.current = marker;
    }
  }, [userPosition]);

  // Update route
  useEffect(() => {
    if (!mapInstanceRef.current || isUnmountingRef.current) return;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    // Add new route
    if (route && route.length > 1) {
      const polyline = L.polyline(
        route.map((coord) => [coord.lat, coord.lng]),
        {
          color: '#3c61bc',
          weight: 4,
          opacity: 0.7,
        }
      );

      polyline.addTo(mapInstanceRef.current);
      routeLayerRef.current = polyline;
    }
  }, [route]);

  // Auto-fit bounds when markers or user position change
  useEffect(() => {
    if (!mapInstanceRef.current || isUnmountingRef.current) return;
    if (markers.length === 0 && !userPosition) return;

    const bounds = L.latLngBounds([]);

    // Add markers to bounds
    markers.forEach((marker) => {
      bounds.extend([marker.position.lat, marker.position.lng]);
    });

    // Add user position to bounds
    if (userPosition) {
      bounds.extend([userPosition.lat, userPosition.lng]);
    }

    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [markers, userPosition]);

  return (
    <div className={`${styles.mapContainer} ${className || ''}`}>
      <div ref={mapRef} className={styles.leafletMap} />
    </div>
  );
}