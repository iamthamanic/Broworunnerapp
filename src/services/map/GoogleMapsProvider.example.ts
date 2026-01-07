/**
 * EXAMPLE: Google Maps Provider Implementation
 * 
 * To use this provider:
 * 1. Rename this file to GoogleMapsProvider.ts
 * 2. Get API Key from: https://console.cloud.google.com/
 * 3. Enable "Geocoding API" and "Maps JavaScript API"
 * 4. Add to MapProviderContext.tsx
 * 5. Install @googlemaps/js-api-loader if needed
 */

import type { IMapProvider, Coordinates, GeocodingResult, MapRoute } from './types';

export class GoogleMapsProvider implements IMapProvider {
  name = 'Google Maps';
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Google Maps API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Geocode address using Google Geocoding API
   * Docs: https://developers.google.com/maps/documentation/geocoding
   */
  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?` +
          new URLSearchParams({
            address: address,
            key: this.apiKey,
          })
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();

      if (data.status !== 'OK' || data.results.length === 0) {
        return null;
      }

      const result = data.results[0];
      const location = result.geometry.location;

      // Parse address components
      const addressComponents = result.address_components;
      const getComponent = (type: string) => 
        addressComponents.find((c: any) => c.types.includes(type))?.long_name;

      return {
        coordinates: {
          lat: location.lat,
          lng: location.lng,
        },
        displayName: result.formatted_address,
        address: {
          street: getComponent('route'),
          city: getComponent('locality') || getComponent('postal_town'),
          postalCode: getComponent('postal_code'),
          country: getComponent('country'),
        },
      };
    } catch (error) {
      console.error('Google Maps geocoding error:', error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates
   */
  async reverseGeocode(coordinates: Coordinates): Promise<GeocodingResult | null> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?` +
          new URLSearchParams({
            latlng: `${coordinates.lat},${coordinates.lng}`,
            key: this.apiKey,
          })
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();

      if (data.status !== 'OK' || data.results.length === 0) {
        return null;
      }

      const result = data.results[0];
      const addressComponents = result.address_components;
      const getComponent = (type: string) => 
        addressComponents.find((c: any) => c.types.includes(type))?.long_name;

      return {
        coordinates,
        displayName: result.formatted_address,
        address: {
          street: getComponent('route'),
          city: getComponent('locality') || getComponent('postal_town'),
          postalCode: getComponent('postal_code'),
          country: getComponent('country'),
        },
      };
    } catch (error) {
      console.error('Google Maps reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Calculate route using Google Directions API
   * Docs: https://developers.google.com/maps/documentation/directions
   */
  async calculateRoute(waypoints: Coordinates[]): Promise<MapRoute | null> {
    if (waypoints.length < 2) {
      return null;
    }

    try {
      const origin = waypoints[0];
      const destination = waypoints[waypoints.length - 1];
      const waypointsParam = waypoints
        .slice(1, -1)
        .map((wp) => `${wp.lat},${wp.lng}`)
        .join('|');

      const params = new URLSearchParams({
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: this.apiKey,
      });

      if (waypointsParam) {
        params.append('waypoints', waypointsParam);
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?${params}`
      );

      if (!response.ok) {
        throw new Error('Route calculation failed');
      }

      const data = await response.json();

      if (data.status !== 'OK' || data.routes.length === 0) {
        return null;
      }

      const route = data.routes[0];
      const routePoints: Coordinates[] = [];

      // Decode polyline (simplified version)
      route.legs.forEach((leg: any) => {
        leg.steps.forEach((step: any) => {
          routePoints.push({
            lat: step.start_location.lat,
            lng: step.start_location.lng,
          });
        });
      });

      return {
        waypoints: routePoints,
        color: '#3c61bc',
        weight: 4,
      };
    } catch (error) {
      console.error('Google Maps route calculation error:', error);
      return null;
    }
  }

  /**
   * Get user position using browser Geolocation API
   */
  async getUserPosition(): Promise<Coordinates | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }
}

/**
 * USAGE EXAMPLE:
 * 
 * // In MapProviderContext.tsx:
 * import { GoogleMapsProvider } from '../services/map/GoogleMapsProvider';
 * 
 * function createMapProvider(type: MapProviderType): IMapProvider {
 *   switch (type) {
 *     case 'google':
 *       return new GoogleMapsProvider(process.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY');
 *     // ...
 *   }
 * }
 * 
 * // In your component:
 * const { setProviderType } = useMapProvider();
 * setProviderType('google');
 */
