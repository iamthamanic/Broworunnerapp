// Geocoding Service - SOLID: Single Responsibility
export interface GeocodingResult {
  lat: number;
  lon: number;
  displayName: string;
  address: {
    road?: string;
    houseNumber?: string;
    postcode?: string;
    city?: string;
    country?: string;
  };
}

class GeocodingService {
  // Mock data for demonstration when API is unavailable
  private mockLocations: GeocodingResult[] = [
    // Berlin
    {
      lat: 52.520008,
      lon: 13.404954,
      displayName: 'Brandenburger Tor, Pariser Platz, 10117 Berlin, Deutschland',
      address: { road: 'Pariser Platz', postcode: '10117', city: 'Berlin', country: 'Deutschland' }
    },
    {
      lat: 52.516275,
      lon: 13.377704,
      displayName: 'Potsdamer Platz, 10785 Berlin, Deutschland',
      address: { road: 'Potsdamer Platz', postcode: '10785', city: 'Berlin', country: 'Deutschland' }
    },
    {
      lat: 52.519171,
      lon: 13.406091,
      displayName: 'Unter den Linden, 10117 Berlin, Deutschland',
      address: { road: 'Unter den Linden', postcode: '10117', city: 'Berlin', country: 'Deutschland' }
    },
    // München
    {
      lat: 48.137154,
      lon: 11.576124,
      displayName: 'Marienplatz, 80331 München, Deutschland',
      address: { road: 'Marienplatz', postcode: '80331', city: 'München', country: 'Deutschland' }
    },
    {
      lat: 48.144581,
      lon: 11.558432,
      displayName: 'Nymphenburger Straße, 80335 München, Deutschland',
      address: { road: 'Nymphenburger Straße', postcode: '80335', city: 'München', country: 'Deutschland' }
    },
    // Köln
    {
      lat: 50.937531,
      lon: 6.960279,
      displayName: 'Kölner Dom, Domkloster 4, 50667 Köln, Deutschland',
      address: { road: 'Domkloster', houseNumber: '4', postcode: '50667', city: 'Köln', country: 'Deutschland' }
    },
    {
      lat: 50.935173,
      lon: 6.953101,
      displayName: 'Hohe Straße, 50667 Köln, Deutschland',
      address: { road: 'Hohe Straße', postcode: '50667', city: 'Köln', country: 'Deutschland' }
    },
    // Hamburg
    {
      lat: 53.551085,
      lon: 9.993682,
      displayName: 'Hamburger Rathaus, Rathausmarkt 1, 20095 Hamburg, Deutschland',
      address: { road: 'Rathausmarkt', houseNumber: '1', postcode: '20095', city: 'Hamburg', country: 'Deutschland' }
    },
    {
      lat: 53.544367,
      lon: 9.990214,
      displayName: 'Mönckebergstraße, 20095 Hamburg, Deutschland',
      address: { road: 'Mönckebergstraße', postcode: '20095', city: 'Hamburg', country: 'Deutschland' }
    },
    // Düsseldorf
    {
      lat: 51.227741,
      lon: 6.773456,
      displayName: 'Königsallee, 40212 Düsseldorf, Deutschland',
      address: { road: 'Königsallee', postcode: '40212', city: 'Düsseldorf', country: 'Deutschland' }
    },
    {
      lat: 51.225402,
      lon: 6.776314,
      displayName: 'Altstadt, 40213 Düsseldorf, Deutschland',
      address: { road: 'Altstadt', postcode: '40213', city: 'Düsseldorf', country: 'Deutschland' }
    },
    // Frankfurt
    {
      lat: 50.110924,
      lon: 8.682127,
      displayName: 'Römerberg, 60311 Frankfurt am Main, Deutschland',
      address: { road: 'Römerberg', postcode: '60311', city: 'Frankfurt am Main', country: 'Deutschland' }
    },
    {
      lat: 50.113655,
      lon: 8.679789,
      displayName: 'Zeil, 60313 Frankfurt am Main, Deutschland',
      address: { road: 'Zeil', postcode: '60313', city: 'Frankfurt am Main', country: 'Deutschland' }
    },
    // Stuttgart
    {
      lat: 48.777106,
      lon: 9.180769,
      displayName: 'Königstraße, 70173 Stuttgart, Deutschland',
      address: { road: 'Königstraße', postcode: '70173', city: 'Stuttgart', country: 'Deutschland' }
    },
    // Leipzig
    {
      lat: 51.340199,
      lon: 12.360103,
      displayName: 'Augustusplatz, 04109 Leipzig, Deutschland',
      address: { road: 'Augustusplatz', postcode: '04109', city: 'Leipzig', country: 'Deutschland' }
    },
    // Dortmund
    {
      lat: 51.514244,
      lon: 7.468429,
      displayName: 'Westenhellweg, 44137 Dortmund, Deutschland',
      address: { road: 'Westenhellweg', postcode: '44137', city: 'Dortmund', country: 'Deutschland' }
    }
  ];

  async searchAddress(query: string): Promise<GeocodingResult[]> {
    if (!query.trim()) {
      return [];
    }

    // Use mock data directly in this environment
    // In production, you would connect to a real geocoding service
    console.log('Using mock geocoding data for query:', query);
    return this.searchMockLocations(query);
  }

  private searchMockLocations(query: string): GeocodingResult[] {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return this.mockLocations.slice(0, 5);
    }

    const results = this.mockLocations.filter(loc =>
      loc.displayName.toLowerCase().includes(lowerQuery) ||
      loc.address.city?.toLowerCase().includes(lowerQuery) ||
      loc.address.road?.toLowerCase().includes(lowerQuery) ||
      loc.address.postcode?.includes(lowerQuery)
    );

    // If no results, return all locations as fallback
    return results.length > 0 ? results.slice(0, 5) : this.mockLocations.slice(0, 5);
  }

  private formatDisplayName(props: any): string {
    const parts: string[] = [];

    if (props.street) {
      let street = props.street;
      if (props.housenumber) {
        street += ` ${props.housenumber}`;
      }
      parts.push(street);
    } else if (props.name) {
      parts.push(props.name);
    }

    if (props.postcode || props.city) {
      const cityPart = [props.postcode, props.city || props.town || props.village]
        .filter(Boolean)
        .join(' ');
      if (cityPart) parts.push(cityPart);
    }

    if (props.country) {
      parts.push(props.country);
    }

    return parts.join(', ') || 'Unbekannter Ort';
  }

  formatCoordinates(lat: number, lon: number): string {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }
}

export const geocodingService = new GeocodingService();
