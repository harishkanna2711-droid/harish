export enum BinStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING', // Getting full
  CRITICAL = 'CRITICAL', // Overflowing or Anomaly
  SERVICED = 'SERVICED'
}

export enum BinType {
  GENERAL = 'General Waste',
  RECYCLING = 'Recycling',
  ORGANIC = 'Organic',
  HAZARDOUS = 'Hazardous'
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Bin {
  id: string;
  locationName: string;
  type: BinType;
  fillLevel: number; // 0 to 100
  temperature: number; // Celsius
  status: BinStatus;
  lastCollection: string;
  coordinates: GeoLocation;
}

export interface RouteStop {
  binId: string;
  estimatedArrival: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface RoutePlan {
  id: string;
  driverName: string;
  vehicleId: string;
  stops: RouteStop[];
  totalDistanceKm: number;
  estimatedFuelSavings: number;
}

export interface KPI {
  totalWasteCollected: number; // Tons
  routeEfficiency: number; // Percentage
  activeAlerts: number;
  carbonOffset: number; // kg CO2
}

export type ReportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface CitizenReport {
  id: string;
  timestamp: string;
  location: string;
  imageUrl: string; // Base64 or URL
  aiAnalysis: string;
  description: string;
  status: ReportStatus;
}