import type { OrderDto, OrderUpdateDto, OrderFilters, BaustelleMaterial } from '../types';

/**
 * Mock API service for orders
 * In production, this will connect to the actual API
 */
class OrderService {
  private readonly apiBaseUrl: string = '/api/orders';

  async fetchOrders(filters?: OrderFilters): Promise<OrderDto[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.apiBaseUrl}?${new URLSearchParams(filters)}`);
    // return response.json();
    
    return this.getMockOrders(filters);
  }

  async fetchOrderById(id: string): Promise<OrderDto | null> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.apiBaseUrl}/${id}`);
    // return response.json();
    
    const orders = this.getMockOrders();
    return orders.find(order => order.id === id) || null;
  }

  async updateOrder(id: string, data: OrderUpdateDto): Promise<OrderDto> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.apiBaseUrl}/${id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    
    const order = await this.fetchOrderById(id);
    if (!order) {
      throw new Error(`Order ${id} not found`);
    }
    
    return {
      ...order,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }

  private getMockOrders(filters?: OrderFilters): OrderDto[] {
    const materialImages: Record<string, string> = {
      'Absperrgitter': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
      'Warnschilder (Z123)': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
      'Umleitungsschilder (Z454)': 'https://images.unsplash.com/photo-1621274790572-7c32596bc67f?w=600',
      'Leitkegel': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600',
      'Absperrband': 'https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=600',
      'Pylonen': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600',
      'Warnleuchten': 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600',
      'Warntafeln': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600',
      'Blinkleuchten': 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600',
      'Schilderständer': 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=600',
      'Gerüstabsicherung': 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=600',
    };

    const withImages = (list: BaustelleMaterial[]): BaustelleMaterial[] =>
      list.map(m => ({ ...m, imageUrl: materialImages[m.name] }));

    const baustelleMaterialienRaw: Record<string, BaustelleMaterial[]> = {
      '2': [
        { id: 'm1', name: 'Absperrgitter', sollMenge: 12, unit: 'Stück' },
        { id: 'm2', name: 'Warnschilder (Z123)', sollMenge: 4, unit: 'Stück' },
        { id: 'm3', name: 'Umleitungsschilder (Z454)', sollMenge: 6, unit: 'Stück' },
        { id: 'm4', name: 'Leitkegel', sollMenge: 20, unit: 'Stück' },
      ],
      '3': [
        { id: 'm1', name: 'Absperrband', sollMenge: 50, unit: 'm' },
        { id: 'm2', name: 'Pylonen', sollMenge: 15, unit: 'Stück' },
        { id: 'm3', name: 'Warnleuchten', sollMenge: 4, unit: 'Stück' },
      ],
      '4': [
        { id: 'm1', name: 'Absperrgitter', sollMenge: 20, unit: 'Stück' },
        { id: 'm2', name: 'Warntafeln', sollMenge: 3, unit: 'Stück' },
        { id: 'm3', name: 'Blinkleuchten', sollMenge: 6, unit: 'Stück' },
        { id: 'm4', name: 'Schilderständer', sollMenge: 8, unit: 'Stück' },
      ],
      '6': [
        { id: 'm1', name: 'Pylonen', sollMenge: 30, unit: 'Stück' },
        { id: 'm2', name: 'Absperrband', sollMenge: 80, unit: 'm' },
      ],
      '7': [
        { id: 'm1', name: 'Absperrgitter', sollMenge: 18, unit: 'Stück' },
        { id: 'm2', name: 'Umleitungsschilder (Z454)', sollMenge: 8, unit: 'Stück' },
        { id: 'm3', name: 'Warntafeln', sollMenge: 4, unit: 'Stück' },
        { id: 'm4', name: 'Leitkegel', sollMenge: 25, unit: 'Stück' },
      ],
      '8': [
        { id: 'm1', name: 'Gerüstabsicherung', sollMenge: 10, unit: 'm²' },
        { id: 'm2', name: 'Warnschilder (Z123)', sollMenge: 2, unit: 'Stück' },
        { id: 'm3', name: 'Blinkleuchten', sollMenge: 4, unit: 'Stück' },
      ],
      '10': [
        { id: 'm1', name: 'Absperrband', sollMenge: 120, unit: 'm' },
        { id: 'm2', name: 'Pylonen', sollMenge: 40, unit: 'Stück' },
        { id: 'm3', name: 'Warntafeln', sollMenge: 6, unit: 'Stück' },
      ],
    };

    const baustelleMaterialien: Record<string, BaustelleMaterial[]> = Object.fromEntries(
      Object.entries(baustelleMaterialienRaw).map(([key, list]) => [key, withImages(list)])
    );

    const mockOrders: OrderDto[] = [
      {
        id: '1',
        orderNumber: 'ORD-2026-001',
        status: 'pending',
        priority: 'high',
        jobType: 'no-parking-zone',
        actionType: 'aufsteller',
        location: {
          street: 'Hauptstraße',
          number: '45',
          city: 'Berlin',
          postalCode: '10115',
          coordinates: { lat: 52.5200, lng: 13.4050 },
        },
        description: 'Halteverbot einrichten für Umzug',
        scheduledDate: '2026-01-06T08:00:00Z',
        estimatedDuration: 120,
        weight: 10,
        materials: ['Schilder', 'Ständer', 'Absperrbänder'],
        createdAt: '2026-01-05T10:00:00Z',
        updatedAt: '2026-01-05T10:00:00Z',
        numberOfSigns: 2,
        isZone: true,
        requiredSigns: [
          { code: 'Z283', label: 'Absolutes Halteverbot (Anfang)' },
          { code: 'Z283', label: 'Absolutes Halteverbot (Ende)' },
        ],
        validityPeriod: { dateFrom: '17.05.26', dateTo: '17.05.26', timeFrom: '07.00', timeTo: '17.00' },
      },
      {
        id: '2',
        orderNumber: 'ORD-2026-002',
        status: 'pending',
        priority: 'critical',
        jobType: 'road-closure',
        actionType: 'aufsteller',
        location: {
          street: 'Friedrichstraße',
          number: '120',
          city: 'Berlin',
          postalCode: '10117',
          coordinates: { lat: 52.5219, lng: 13.3883 },
        },
        description: 'Vollsperrung wegen Kanalarbeiten',
        scheduledDate: '2026-01-06T08:30:00Z',
        estimatedDuration: 180,
        weight: 15,
        materials: ['Absperrgitter', 'Warnschilder', 'Umleitungsschilder'],
        baustelleMaterials: baustelleMaterialien['2'],
        createdAt: '2026-01-05T09:00:00Z',
        updatedAt: '2026-01-05T09:00:00Z',
      },
      {
        id: '3',
        orderNumber: 'ORD-2026-003',
        status: 'pending',
        priority: 'medium',
        jobType: 'traffic-safety',
        actionType: 'aufsteller',
        location: {
          street: 'Alexanderplatz',
          number: '1',
          city: 'Berlin',
          postalCode: '10178',
          coordinates: { lat: 52.5219, lng: 13.4132 },
        },
        description: 'Verkehrssicherung für Veranstaltung',
        scheduledDate: '2026-01-06T09:00:00Z',
        estimatedDuration: 90,
        weight: 8,
        materials: ['Absperrband', 'Pylonen'],
        baustelleMaterials: baustelleMaterialien['3'],
        createdAt: '2026-01-05T08:00:00Z',
        updatedAt: '2026-01-06T09:15:00Z',
      },
      {
        id: '4',
        orderNumber: 'ORD-2026-004',
        status: 'pending',
        priority: 'high',
        jobType: 'construction-site',
        actionType: 'aufsteller',
        location: {
          street: 'Leipziger Straße',
          number: '88',
          city: 'Berlin',
          postalCode: '10117',
          coordinates: { lat: 52.5105, lng: 13.3890 },
        },
        description: 'Baustellenabsicherung Tiefbau',
        scheduledDate: '2026-01-06T09:30:00Z',
        estimatedDuration: 240,
        weight: 20,
        materials: ['Absperrgitter', 'Warntafeln', 'Blinkleuchten'],
        baustelleMaterials: baustelleMaterialien['4'],
        createdAt: '2026-01-05T11:00:00Z',
        updatedAt: '2026-01-05T11:00:00Z',
      },
      {
        id: '5',
        orderNumber: 'ORD-2026-005',
        status: 'pending',
        priority: 'medium',
        jobType: 'no-parking-zone',
        actionType: 'aufsteller',
        location: {
          street: 'Kantstraße',
          number: '152',
          city: 'Berlin',
          postalCode: '10623',
          coordinates: { lat: 52.5058, lng: 13.3155 },
        },
        description: 'Halteverbot für Kranarbeiten',
        scheduledDate: '2026-01-06T10:00:00Z',
        estimatedDuration: 60,
        weight: 5,
        materials: ['Schilder', 'Ständer'],
        createdAt: '2026-01-05T12:00:00Z',
        updatedAt: '2026-01-05T12:00:00Z',
        requiredSigns: [{ code: 'Z283', label: 'Absolutes Halteverbot' }],
        validityPeriod: { dateFrom: '06.01.26', dateTo: '06.01.26', timeFrom: '10.00', timeTo: '14.00' },
      },
      {
        id: '6',
        orderNumber: 'ORD-2026-006',
        status: 'pending',
        priority: 'low',
        jobType: 'traffic-safety',
        actionType: 'aufsteller',
        location: {
          street: 'Kurfürstendamm',
          number: '201',
          city: 'Berlin',
          postalCode: '10719',
          coordinates: { lat: 52.5025, lng: 13.3280 },
        },
        description: 'Absicherung Straßenfest',
        scheduledDate: '2026-01-06T10:30:00Z',
        estimatedDuration: 120,
        weight: 12,
        materials: ['Pylonen', 'Absperrband'],
        baustelleMaterials: baustelleMaterialien['6'],
        createdAt: '2026-01-05T13:00:00Z',
        updatedAt: '2026-01-05T13:00:00Z',
      },
      {
        id: '7',
        orderNumber: 'ORD-2026-007',
        status: 'pending',
        priority: 'high',
        jobType: 'road-closure',
        actionType: 'aufsteller',
        location: {
          street: 'Unter den Linden',
          number: '40',
          city: 'Berlin',
          postalCode: '10117',
          coordinates: { lat: 52.5170, lng: 13.3888 },
        },
        description: 'Straßensperrung für Filmdreh',
        scheduledDate: '2026-01-06T11:00:00Z',
        estimatedDuration: 300,
        weight: 18,
        materials: ['Absperrgitter', 'Umleitungsschilder', 'Warntafeln'],
        baustelleMaterials: baustelleMaterialien['7'],
        createdAt: '2026-01-05T14:00:00Z',
        updatedAt: '2026-01-05T14:00:00Z',
      },
      {
        id: '8',
        orderNumber: 'ORD-2026-008',
        status: 'pending',
        priority: 'medium',
        jobType: 'construction-site',
        actionType: 'aufsteller',
        location: {
          street: 'Potsdamer Platz',
          number: '5',
          city: 'Berlin',
          postalCode: '10785',
          coordinates: { lat: 52.5096, lng: 13.3760 },
        },
        description: 'Baustelleneinrichtung Fassadensanierung',
        scheduledDate: '2026-01-06T11:30:00Z',
        estimatedDuration: 150,
        weight: 16,
        materials: ['Gerüstabsicherung', 'Warnschilder', 'Blinkleuchten'],
        baustelleMaterials: baustelleMaterialien['8'],
        createdAt: '2026-01-05T15:00:00Z',
        updatedAt: '2026-01-05T15:00:00Z',
      },
      {
        id: '9',
        orderNumber: 'ORD-2026-009',
        status: 'pending',
        priority: 'critical',
        jobType: 'no-parking-zone',
        actionType: 'aufsteller',
        location: {
          street: 'Müllerstraße',
          number: '156',
          city: 'Berlin',
          postalCode: '13353',
          coordinates: { lat: 52.5470, lng: 13.3680 },
        },
        description: 'Notfall-Halteverbot Wasserrohrbruch',
        scheduledDate: '2026-01-06T12:00:00Z',
        estimatedDuration: 90,
        weight: 8,
        materials: ['Schilder', 'Ständer', 'Blinkleuchten'],
        createdAt: '2026-01-06T07:00:00Z',
        updatedAt: '2026-01-06T07:00:00Z',
        requiredSigns: [{ code: 'Z286', label: 'Eingeschränktes Halteverbot' }],
        validityPeriod: { dateFrom: '06.01.26', dateTo: '07.01.26', timeFrom: '08.00', timeTo: '18.00' },
      },
      {
        id: '10',
        orderNumber: 'ORD-2026-010',
        status: 'pending',
        priority: 'high',
        jobType: 'traffic-safety',
        actionType: 'aufsteller',
        location: {
          street: 'Karl-Marx-Allee',
          number: '78',
          city: 'Berlin',
          postalCode: '10243',
          coordinates: { lat: 52.5155, lng: 13.4385 },
        },
        description: 'Verkehrssicherung Marathon',
        scheduledDate: '2026-01-06T12:30:00Z',
        estimatedDuration: 180,
        weight: 14,
        materials: ['Absperrband', 'Pylonen', 'Warntafeln'],
        baustelleMaterials: baustelleMaterialien['10'],
        createdAt: '2026-01-05T16:00:00Z',
        updatedAt: '2026-01-05T16:00:00Z',
      },
      {
        id: '11',
        orderNumber: 'ORD-2026-011',
        status: 'pending',
        priority: 'medium',
        jobType: 'no-parking-zone',
        actionType: 'abholer',
        location: {
          street: 'Schönhauser Allee',
          number: '112',
          city: 'Berlin',
          postalCode: '10439',
          coordinates: { lat: 52.5325, lng: 13.4115 },
        },
        description: 'Abbau Halteverbot nach Umzug',
        scheduledDate: '2026-01-06T15:00:00Z',
        estimatedDuration: 60,
        weight: 5,
        materials: ['Schilder', 'Ständer'],
        requiredSigns: [{ code: 'Z283', label: 'Absolutes Halteverbot' }],
        validityPeriod: { dateFrom: '06.01.26', dateTo: '06.01.26', timeFrom: '07.00', timeTo: '15.00' },
        createdAt: '2026-01-05T17:00:00Z',
        updatedAt: '2026-01-05T17:00:00Z',
      },
      {
        id: '12',
        orderNumber: 'ORD-2026-012',
        status: 'pending',
        priority: 'high',
        jobType: 'construction-site',
        actionType: 'abholer',
        location: {
          street: 'Warschauer Straße',
          number: '42',
          city: 'Berlin',
          postalCode: '10243',
          coordinates: { lat: 52.5055, lng: 13.4485 },
        },
        description: 'Baustellenabbau abgeschlossene Arbeiten',
        scheduledDate: '2026-01-06T15:30:00Z',
        estimatedDuration: 120,
        weight: 18,
        materials: ['Absperrgitter', 'Warntafeln'],
        createdAt: '2026-01-05T18:00:00Z',
        updatedAt: '2026-01-05T18:00:00Z',
      },
      {
        id: '13',
        orderNumber: 'ORD-2026-013',
        status: 'pending',
        priority: 'medium',
        jobType: 'traffic-safety',
        actionType: 'abholer',
        location: {
          street: 'Torstraße',
          number: '95',
          city: 'Berlin',
          postalCode: '10119',
          coordinates: { lat: 52.5285, lng: 13.4020 },
        },
        description: 'Abbau Veranstaltungsabsicherung',
        scheduledDate: '2026-01-06T16:00:00Z',
        estimatedDuration: 90,
        weight: 10,
        materials: ['Pylonen', 'Absperrband'],
        createdAt: '2026-01-05T19:00:00Z',
        updatedAt: '2026-01-05T19:00:00Z',
      },
      {
        id: '14',
        orderNumber: 'ORD-2026-014',
        status: 'pending',
        priority: 'low',
        jobType: 'road-closure',
        actionType: 'abholer',
        location: {
          street: 'Oranienburger Straße',
          number: '67',
          city: 'Berlin',
          postalCode: '10117',
          coordinates: { lat: 52.5255, lng: 13.3930 },
        },
        description: 'Abbau Straßensperrung Filmdreh beendet',
        scheduledDate: '2026-01-06T16:30:00Z',
        estimatedDuration: 150,
        weight: 15,
        materials: ['Absperrgitter', 'Umleitungsschilder'],
        createdAt: '2026-01-05T20:00:00Z',
        updatedAt: '2026-01-05T20:00:00Z',
      },
      {
        id: '15',
        orderNumber: 'ORD-2026-015',
        status: 'pending',
        priority: 'high',
        jobType: 'no-parking-zone',
        actionType: 'abholer',
        location: {
          street: 'Bergmannstraße',
          number: '23',
          city: 'Berlin',
          postalCode: '10961',
          coordinates: { lat: 52.4920, lng: 13.3940 },
        },
        description: 'Halteverbot entfernen Kranarbeiten beendet',
        scheduledDate: '2026-01-06T17:00:00Z',
        estimatedDuration: 45,
        weight: 5,
        materials: ['Schilder', 'Ständer'],
        requiredSigns: [{ code: 'Z283', label: 'Absolutes Halteverbot' }],
        validityPeriod: { dateFrom: '06.01.26', dateTo: '06.01.26', timeFrom: '09.00', timeTo: '17.00' },
        createdAt: '2026-01-06T08:00:00Z',
        updatedAt: '2026-01-06T08:00:00Z',
      },
      {
        id: '16',
        orderNumber: 'ORD-2026-016',
        status: 'pending',
        priority: 'critical',
        jobType: 'construction-site',
        actionType: 'abholer',
        location: {
          street: 'Skalitzer Straße',
          number: '104',
          city: 'Berlin',
          postalCode: '10997',
          coordinates: { lat: 52.4995, lng: 13.4365 },
        },
        description: 'Notabbau Baustelle wegen Unwetter',
        scheduledDate: '2026-01-06T17:30:00Z',
        estimatedDuration: 180,
        weight: 20,
        materials: ['Absperrgitter', 'Warntafeln', 'Blinkleuchten'],
        createdAt: '2026-01-06T09:00:00Z',
        updatedAt: '2026-01-06T09:00:00Z',
      },
      {
        id: '17',
        orderNumber: 'ORD-2026-017',
        status: 'pending',
        priority: 'medium',
        jobType: 'traffic-safety',
        actionType: 'abholer',
        location: {
          street: 'Greifswalder Straße',
          number: '210',
          city: 'Berlin',
          postalCode: '10405',
          coordinates: { lat: 52.5350, lng: 13.4280 },
        },
        description: 'Abbau Marathon-Absicherung',
        scheduledDate: '2026-01-06T18:00:00Z',
        estimatedDuration: 120,
        weight: 12,
        materials: ['Absperrband', 'Pylonen'],
        createdAt: '2026-01-06T10:00:00Z',
        updatedAt: '2026-01-06T10:00:00Z',
      },
      {
        id: '18',
        orderNumber: 'ORD-2026-018',
        status: 'pending',
        priority: 'low',
        jobType: 'no-parking-zone',
        actionType: 'abholer',
        location: {
          street: 'Sonnenallee',
          number: '188',
          city: 'Berlin',
          postalCode: '12059',
          coordinates: { lat: 52.4785, lng: 13.4485 },
        },
        description: 'Abbau Halteverbot Möbeltransport',
        scheduledDate: '2026-01-06T18:30:00Z',
        estimatedDuration: 30,
        weight: 4,
        materials: ['Schilder', 'Ständer'],
        requiredSigns: [{ code: 'Z286', label: 'Eingeschränktes Halteverbot' }],
        validityPeriod: { dateFrom: '06.01.26', dateTo: '06.01.26', timeFrom: '18.00', timeTo: '21.00' },
        createdAt: '2026-01-06T11:00:00Z',
        updatedAt: '2026-01-06T11:00:00Z',
      },
      {
        id: '19',
        orderNumber: 'ORD-2026-019',
        status: 'pending',
        priority: 'high',
        jobType: 'road-closure',
        actionType: 'abholer',
        location: {
          street: 'Invalidenstraße',
          number: '52',
          city: 'Berlin',
          postalCode: '10557',
          coordinates: { lat: 52.5310, lng: 13.3745 },
        },
        description: 'Abbau Vollsperrung Kanalarbeiten fertig',
        scheduledDate: '2026-01-06T19:00:00Z',
        estimatedDuration: 180,
        weight: 16,
        materials: ['Absperrgitter', 'Umleitungsschilder', 'Warntafeln'],
        createdAt: '2026-01-06T12:00:00Z',
        updatedAt: '2026-01-06T12:00:00Z',
      },
      {
        id: '20',
        orderNumber: 'ORD-2026-020',
        status: 'pending',
        priority: 'medium',
        jobType: 'construction-site',
        actionType: 'abholer',
        location: {
          street: 'Prenzlauer Allee',
          number: '145',
          city: 'Berlin',
          postalCode: '10409',
          coordinates: { lat: 52.5390, lng: 13.4195 },
        },
        description: 'Abbau Fassadensanierung abgeschlossen',
        scheduledDate: '2026-01-06T19:30:00Z',
        estimatedDuration: 150,
        weight: 14,
        materials: ['Gerüstabsicherung', 'Warnschilder'],
        createdAt: '2026-01-06T13:00:00Z',
        updatedAt: '2026-01-06T13:00:00Z',
      },
    ];

    if (!filters) {
      return mockOrders;
    }

    return mockOrders.filter(order => {
      if (filters.status && !filters.status.includes(order.status)) {
        return false;
      }
      if (filters.priority && !filters.priority.includes(order.priority)) {
        return false;
      }
      if (filters.jobType && !filters.jobType.includes(order.jobType)) {
        return false;
      }
      return true;
    });
  }
}

export const orderService = new OrderService();