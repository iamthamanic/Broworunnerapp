export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type OrderPriority = 'low' | 'medium' | 'high' | 'critical';

export type JobType = 
  | 'no-parking-zone'
  | 'road-closure'
  | 'traffic-safety'
  | 'construction-site';

export type ActionType = 'aufsteller' | 'abholer';

export interface Location {
  street: string;
  number: string;
  city: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  priority: OrderPriority;
  jobType: JobType;
  actionType: ActionType;
  location: Location;
  description: string;
  scheduledDate: string;
  estimatedDuration: number;
  weight: number;
  materials?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  numberOfSigns?: number; // Anzahl der Schilder (1 oder 2)
  isZone?: boolean; // Ob es eine Zone ist (2 Schilder)
}

export interface OrderUpdateDto {
  status?: OrderStatus;
  notes?: string;
  completedAt?: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  priority?: OrderPriority[];
  jobType?: JobType[];
  date?: string;
}