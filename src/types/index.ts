export type Domain = 'healthcare' | 'disaster' | 'education';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ResourceCategory {
  id: string;
  name: string;
  unit: string;
  domain: Domain;
  totalCapacity: number;
  availableStock: number;
  allocatedStock: number;
}

export interface ResourceLocation {
  id: string;
  domain: Domain;
  name: string;
  code: string;
  lat: number;
  lng: number;
  region: string;
  severityScore: number; // 1.0 to 10.0
  population: number;
  accessibilityIndex: number; // 0.1 to 1.0
  occupancyOrDeficitPct: number; // 0 to 100
  resourcesNeeded: Record<string, number>; // resourceId -> count required
  resourcesCurrent: Record<string, number>; // resourceId -> count on hand
  urgencyLevel: UrgencyLevel;
  priorityScore: number; // Dynamic calculated priority
  trendPrediction: 'increasing' | 'stable' | 'decreasing';
  historicalDemand: number[]; // Array for sparkline & time series
  forecastNext30Days: number[]; // Prophet projection curve
  contactPhone: string;
  address: string;
  explainabilityNote?: string;
}

export interface AllocationRecommendation {
  id: string;
  locationId: string;
  locationName: string;
  domain: Domain;
  resourceId: string;
  resourceName: string;
  unit: string;
  recommendedAmount: number;
  userOverrideAmount: number;
  currentStock: number;
  neededAmount: number;
  priorityScore: number;
  urgencyLevel: UrgencyLevel;
  status: 'pending' | 'approved' | 'dispatched' | 'overridden';
  explainabilityReason: string;
  impactCoveragePct: number; // % of shortage covered
  transportEtaHours: number;
}

export interface DomainWeights {
  severityWeight: number; // Default e.g. 0.40
  deficitWeight: number;  // Default e.g. 0.35
  populationWeight: number; // Default e.g. 0.15
  accessibilityWeight: number; // Default e.g. 0.10
}

export interface ActivityLog {
  id: string;
  domain: Domain;
  action: string;
  locationName: string;
  details: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
  overrideReason?: string;
  originalAiRec?: string;
  humanOverrideAmount?: number;
}

export interface AnalyticsDataPoint {
  date: string;
  demand: number;
  supply: number;
  allocated: number;
  forecastUpper: number;
  forecastLower: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
  avatar: string;
}

// ==========================================
// FEATURE 1: WHAT-IF SIMULATION INTERFACES
// ==========================================

export interface SimulationInputs {
  // Healthcare Controls
  patientDemandChangePct: number;      // e.g. +30%
  occupancyChangePct: number;          // e.g. +15%
  icuBedChangePct: number;             // e.g. -10%
  oxygenSupplyChangePct: number;       // e.g. -20%
  staffAvailabilityChangePct: number;  // e.g. -15%
  roadDisruptionNodeId?: string;       // Node ID with blocked road

  // Disaster Relief Controls
  affectedPopChangePct: number;        // e.g. +30%
  severityScoreIncrease: number;       // e.g. +2.0
  inventoryDecreasePct: number;        // e.g. -25%
  disasterRoadClosureId?: string;      // Road blockage node ID

  // Education Controls
  studentPopChangePct: number;         // e.g. +20%
  teacherAvailabilityChangePct: number;// e.g. -15%
  dropoutRiskSurgePct: number;         // e.g. +25%
  budgetChangePct: number;             // e.g. -20%
}

export interface SimulationSummary {
  availableResources: number;
  simulatedAvailableResources: number;
  expectedDemand: number;
  simulatedExpectedDemand: number;
  shortagePct: number;
  simulatedShortagePct: number;
  criticalLocationsCount: number;
  simulatedCriticalLocationsCount: number;
  unservedPopulation: number;
  simulatedUnservedPopulation: number;
  aiRecommendationText: string;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  inputs: SimulationInputs;
  summary?: SimulationSummary;
  simulatedLocations?: ResourceLocation[];
  simulatedRecs?: AllocationRecommendation[];
}

// ==========================================
// FEATURE 2: DYNAMIC REALLOCATION INTERFACES
// ==========================================

export interface ReallocationTransferItem {
  fromLocationName: string;
  toLocationName: string;
  resourceName: string;
  amount: number;
  unit: string;
}

export interface ReallocationAlert {
  id: string;
  locationId: string;
  locationName: string;
  domain: Domain;
  sourceLocationId: string;
  sourceLocationName: string;
  resourceId: string;
  resourceName: string;
  unit: string;
  recommendedAmount: number;
  userOverrideAmount?: number;
  currentOccupancyPct: number;
  previousOccupancyPct: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  reason: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'overridden' | 'dismissed';
  beforeAllocations: ReallocationTransferItem[];
  afterAllocations: ReallocationTransferItem[];
  impactCriticalCountBefore: number;
  impactCriticalCountAfter: number;
  impactCoveragePctBefore: number;
  impactCoveragePctAfter: number;
}

export interface ReallocationOverride {
  alertId: string;
  originalRecText: string;
  humanOverrideText: string;
  finalApprovedAmount: number;
  overrideReason: string;
  timestamp: string;
  userName: string;
}

