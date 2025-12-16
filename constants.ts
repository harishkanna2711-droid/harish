import { Bin, BinStatus, BinType, KPI, CitizenReport } from './types';

export const INITIAL_BINS: Bin[] = [
  {
    id: 'BIN-101',
    locationName: 'Central Park North',
    type: BinType.GENERAL,
    fillLevel: 45,
    temperature: 22,
    status: BinStatus.NORMAL,
    lastCollection: '2023-10-25T08:00:00',
    coordinates: { lat: 50, lng: 50 }
  },
  {
    id: 'BIN-102',
    locationName: 'Downtown Plaza',
    type: BinType.RECYCLING,
    fillLevel: 92,
    temperature: 24,
    status: BinStatus.CRITICAL,
    lastCollection: '2023-10-24T14:30:00',
    coordinates: { lat: 30, lng: 60 }
  },
  {
    id: 'BIN-103',
    locationName: 'Market Street Corner',
    type: BinType.ORGANIC,
    fillLevel: 12,
    temperature: 35, // High temp anomaly
    status: BinStatus.WARNING,
    lastCollection: '2023-10-26T09:15:00',
    coordinates: { lat: 70, lng: 30 }
  },
  {
    id: 'BIN-104',
    locationName: 'Industrial District A',
    type: BinType.HAZARDOUS,
    fillLevel: 88,
    temperature: 21,
    status: BinStatus.CRITICAL,
    lastCollection: '2023-10-20T10:00:00',
    coordinates: { lat: 20, lng: 20 }
  },
  {
    id: 'BIN-105',
    locationName: 'Residential Zone 4',
    type: BinType.GENERAL,
    fillLevel: 65,
    temperature: 19,
    status: BinStatus.WARNING,
    lastCollection: '2023-10-25T16:45:00',
    coordinates: { lat: 80, lng: 80 }
  },
  {
    id: 'BIN-106',
    locationName: 'City Hospital Rear',
    type: BinType.RECYCLING,
    fillLevel: 30,
    temperature: 20,
    status: BinStatus.NORMAL,
    lastCollection: '2023-10-26T07:00:00',
    coordinates: { lat: 40, lng: 85 }
  }
];

export const MOCK_KPI: KPI = {
  totalWasteCollected: 124.5,
  routeEfficiency: 89,
  activeAlerts: 3,
  carbonOffset: 450
};

export const WEEKLY_DATA = [
  { name: 'Mon', waste: 40, efficiency: 80 },
  { name: 'Tue', waste: 30, efficiency: 85 },
  { name: 'Wed', waste: 55, efficiency: 82 },
  { name: 'Thu', waste: 45, efficiency: 88 },
  { name: 'Fri', waste: 60, efficiency: 92 },
  { name: 'Sat', waste: 75, efficiency: 90 },
  { name: 'Sun', waste: 50, efficiency: 95 },
];

export const MOCK_REPORTS: CitizenReport[] = [
  {
    id: 'REP-2023-001',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    location: '40.7128, -74.0060',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=300&h=300',
    aiAnalysis: 'Identified: Overflowing general waste bin. Severity: High. Recommendation: Immediate dispatch.',
    description: 'Bin on 5th Ave is overflowing onto the sidewalk.',
    status: 'OPEN'
  },
  {
    id: 'REP-2023-002',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    location: '40.7580, -73.9855',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=300&h=300',
    aiAnalysis: 'Identified: Illegal dumping of construction materials. Type: Hazardous potential.',
    description: 'Pile of debris left in the alleyway.',
    status: 'RESOLVED'
  }
];