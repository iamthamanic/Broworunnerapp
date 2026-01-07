// Map Provider Types & Interfaces

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  position: Coordinates;
  title: string;
  description?: string;
  type?: 'pickup' | 'delivery' | 'user';
  orderNumber?: string;
}

export interface MapRoute {
  waypoints: Coordinates[];
  color?: string;
  weight?: number;
}

export interface MapBounds {
  northEast: Coordinates;
  southWest: Coordinates;
}

export interface MapViewport {
  center: Coordinates;
  zoom: number;
}

export interface GeocodingResult {
  coordinates: Coordinates;
  displayName: string;
  address: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

/**
 * Abstract Map Provider Interface
 * Allows easy switching between different map providers (OpenStreetMap, Google Maps, Mapbox, etc.)
 */
export interface IMapProvider {
  name: string;
  
  /**
   * Geocode an address to coordinates
   */
  geocodeAddress(address: string): Promise<GeocodingResult | null>;
  
  /**
   * Reverse geocode coordinates to address
   */
  reverseGeocode(coordinates: Coordinates): Promise<GeocodingResult | null>;
  
  /**
   * Calculate route between multiple points
   */
  calculateRoute?(waypoints: Coordinates[]): Promise<MapRoute | null>;
  
  /**
   * Get current user position
   */
  getUserPosition(): Promise<Coordinates | null>;
}

export type MapProviderType = 'openstreetmap' | 'google' | 'mapbox' | 'here';
