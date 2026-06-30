import type { IMapProvider, Coordinates, GeocodingResult, MapRoute } from './types';

/**
 * OpenStreetMap Provider Implementation
 * Uses Nominatim for geocoding (free, no API key required)
 */
export class OpenStreetMapProvider implements IMapProvider {
  name = 'OpenStreetMap';
  private baseUrl = 'https://nominatim.openstreetmap.org';
  private cache = new Map<string, GeocodingResult>();

  /**
   * Geocode address to coordinates using Nominatim
   */
  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    // Check cache first
    if (this.cache.has(address)) {
      return this.cache.get(address)!;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/search?` +
          new URLSearchParams({
            q: address,
            format: 'json',
            limit: '1',
            addressdetails: '1',
          }),
        {
          headers: {
            'User-Agent': 'FieldServiceApp/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();

      if (data.length === 0) {
        return null;
      }

      const result = data[0];
      const geocodingResult: GeocodingResult = {
        coordinates: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        },
        displayName: result.display_name,
        address: {
          street: result.address?.road,
          city: result.address?.city || result.address?.town || result.address?.village,
          postalCode: result.address?.postcode,
          country: result.address?.country,
        },
      };

      // Cache result
      this.cache.set(address, geocodingResult);

      return geocodingResult;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(coordinates: Coordinates): Promise<GeocodingResult | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/reverse?` +
          new URLSearchParams({
            lat: coordinates.lat.toString(),
            lon: coordinates.lng.toString(),
            format: 'json',
            addressdetails: '1',
          }),
        {
          headers: {
            'User-Agent': 'FieldServiceApp/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const result = await response.json();

      return {
        coordinates,
        displayName: result.display_name,
        address: {
          street: result.address?.road,
          city: result.address?.city || result.address?.town || result.address?.village,
          postalCode: result.address?.postcode,
          country: result.address?.country,
        },
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Calculate route between waypoints
   * Note: For production, consider using OSRM (Open Source Routing Machine)
   */
  async calculateRoute(waypoints: Coordinates[]): Promise<MapRoute | null> {
    if (waypoints.length < 2) {
      return null;
    }

    // Simple route - just connecting waypoints
    // For production routing, use OSRM: http://router.project-osrm.org/
    return {
      waypoints,
      color: '#3c61bc',
      weight: 4,
    };
  }

  /**
   * Get current user position using browser Geolocation API
   */
  async getUserPosition(): Promise<Coordinates | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
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
          // Silent error handling - only log in development
          if (process.env.NODE_ENV === 'development') {
            let errorMessage = 'GPS: ';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += 'Standortzugriff nicht erlaubt';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += 'Position nicht verfügbar';
                break;
              case error.TIMEOUT:
                errorMessage += 'Timeout';
                break;
              default:
                errorMessage += 'Unbekannter Fehler';
          }
            console.log(errorMessage);
          }
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000 // Accept 5 minute old position
        }
      );
    });
  }

  /**
   * Clear geocoding cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}