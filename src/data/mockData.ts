import { ResourceLocation, ResourceCategory, ActivityLog, AnalyticsDataPoint, UserProfile } from '../types';
import { calculatePriorityScore, getUrgencyLevel } from '../lib/optimizationEngine';

// =========================================================================
// 1. HEALTHCARE DOMAIN DATA (INDIAN HOSPITALS & MEDICAL NETWORKS)
// =========================================================================
export const HEALTHCARE_CATEGORIES: ResourceCategory[] = [
  { id: 'res-icu', name: 'ICU Beds', unit: 'beds', domain: 'healthcare', totalCapacity: 2400, availableStock: 320, allocatedStock: 2080 },
  { id: 'res-vent', name: 'ICU Ventilators', unit: 'units', domain: 'healthcare', totalCapacity: 850, availableStock: 110, allocatedStock: 740 },
  { id: 'res-oxy', name: 'Medical Oxygen Cylinders (D-Type 47L)', unit: 'cylinders', domain: 'healthcare', totalCapacity: 6500, availableStock: 920, allocatedStock: 5580 },
  { id: 'res-amb', name: 'ALS Ambulances (Advanced Life Support)', unit: 'vehicles', domain: 'healthcare', totalCapacity: 280, availableStock: 42, allocatedStock: 238 }
];

const indianHospitals = [
  { name: 'AIIMS (All India Institute of Medical Sciences)', city: 'New Delhi', region: 'Delhi-NCR', lat: 28.5672, lng: 77.2100 },
  { name: 'Seth GS Medical College & KEM Hospital', city: 'Mumbai', region: 'Maharashtra', lat: 19.0026, lng: 72.8422 },
  { name: 'NIMHANS (National Institute of Mental Health)', city: 'Bengaluru', region: 'Karnataka', lat: 12.9372, lng: 77.5973 },
  { name: 'PGIMER (Post Graduate Institute)', city: 'Chandigarh', region: 'Punjab & Haryana', lat: 30.7628, lng: 76.7766 },
  { name: 'CMC (Christian Medical College & Hospital)', city: 'Vellore', region: 'Tamil Nadu', lat: 12.9246, lng: 79.1348 },
  { name: 'IPGMER & SSKM Hospital', city: 'Kolkata', region: 'West Bengal', lat: 22.5392, lng: 88.3432 },
  { name: 'KGMU (King George Medical University)', city: 'Lucknow', region: 'Uttar Pradesh', lat: 26.8687, lng: 80.9167 },
  { name: 'Nizam Institute of Medical Sciences (NIMS)', city: 'Hyderabad', region: 'Telangana', lat: 17.4239, lng: 78.4552 },
  { name: 'SMS Medical College & Hospital', city: 'Jaipur', region: 'Rajasthan', lat: 26.8974, lng: 75.8152 },
  { name: 'Gauhati Medical College and Hospital (GMCH)', city: 'Guwahati', region: 'Assam', lat: 26.1558, lng: 91.7779 },
  { name: 'Government Medical College (GMC)', city: 'Kozhikode', region: 'Kerala', lat: 11.2662, lng: 75.8368 },
  { name: 'Sher-i-Kashmir Institute of Medical Sciences (SKIMS)', city: 'Srinagar', region: 'Jammu & Kashmir', lat: 34.1352, lng: 74.8052 },
  { name: 'BJH Medical College & Civil Hospital', city: 'Ahmedabad', region: 'Gujarat', lat: 23.0510, lng: 72.5935 },
  { name: 'Apollo Gleneagles Hospital', city: 'Kolkata', region: 'West Bengal', lat: 22.5710, lng: 88.3985 },
  { name: 'Fortis Escorts Heart Institute', city: 'New Delhi', region: 'Delhi-NCR', lat: 28.5604, lng: 77.2755 },
  { name: 'Manipal Hospital HAL Airport Road', city: 'Bengaluru', region: 'Karnataka', lat: 12.9578, lng: 77.6475 }
];

export const MOCK_HEALTHCARE_LOCATIONS: ResourceLocation[] = Array.from({ length: 60 }).map((_, i) => {
  const base = indianHospitals[i % indianHospitals.length];
  const name = i < indianHospitals.length ? base.name : `${base.name} Sector Annex #${Math.floor(i / indianHospitals.length) + 1}`;
  const severityScore = Math.round((3.2 + (i * 3.7) % 6.8) * 10) / 10;
  const occupancyOrDeficitPct = Math.min(99, Math.round(52 + ((i * 11) % 47)));
  const population = Math.round(45000 + ((i * 24321) % 350000));
  const accessibilityIndex = Math.round((0.55 + ((i * 7) % 5) * 0.09) * 100) / 100;
  
  // Slight geo offset around Indian city coordinates
  const lat = base.lat + (Math.sin(i * 0.8) * 0.08);
  const lng = base.lng + (Math.cos(i * 0.8) * 0.09);

  const neededBeds = Math.round(15 + (i * 9) % 50);
  const currentBeds = Math.max(0, neededBeds - Math.round((i * 4) % 22));

  const history = Array.from({ length: 14 }).map((_, h) => 
    Math.round(45 + Math.sin((h + i) * 0.5) * 22 + (h * 1.8))
  );

  const forecast = Array.from({ length: 30 }).map((_, f) => 
    Math.round(history[13] + Math.sin(f * 0.3) * 18 + (f * 0.9))
  );

  const rawLoc: ResourceLocation = {
    id: `hc-loc-${i + 1}`,
    domain: 'healthcare',
    name,
    code: `IND-HC-${101 + i}`,
    lat,
    lng,
    region: `${base.city}, ${base.region}`,
    severityScore,
    population,
    accessibilityIndex,
    occupancyOrDeficitPct,
    resourcesNeeded: {
      'res-icu': neededBeds,
      'res-vent': Math.round(neededBeds * 0.35),
      'res-oxy': Math.round(neededBeds * 3.2),
      'res-amb': Math.max(1, Math.round(neededBeds * 0.12))
    },
    resourcesCurrent: {
      'res-icu': currentBeds,
      'res-vent': Math.max(0, Math.round(neededBeds * 0.35) - 3),
      'res-oxy': Math.max(10, Math.round(neededBeds * 3.2) - 25),
      'res-amb': 1
    },
    urgencyLevel: 'medium',
    priorityScore: 0,
    trendPrediction: i % 3 === 0 ? 'increasing' : i % 3 === 1 ? 'stable' : 'decreasing',
    historicalDemand: history,
    forecastNext30Days: forecast,
    contactPhone: `+91 98${10000000 + i * 1423}`,
    address: `Ring Road Sector ${i % 12 + 1}, ${base.city}, ${base.region}`
  };

  const score = calculatePriorityScore(rawLoc);
  rawLoc.priorityScore = score;
  rawLoc.urgencyLevel = getUrgencyLevel(score);

  return rawLoc;
});


// =========================================================================
// 2. DISASTER RELIEF DATA (INDIAN FLOOD, CYCLONE & EARTHQUAKE ZONES)
// =========================================================================
export const DISASTER_CATEGORIES: ResourceCategory[] = [
  { id: 'res-food', name: 'Ration Food Packs (Rice & Dal Crates)', unit: 'crates', domain: 'disaster', totalCapacity: 25000, availableStock: 3800, allocatedStock: 21200 },
  { id: 'res-water', name: 'Aqua-Pure Water Purification Kits', unit: 'kits', domain: 'disaster', totalCapacity: 4200, availableStock: 580, allocatedStock: 3620 },
  { id: 'res-medkit', name: 'NDRF Disaster Medical Tents', unit: 'units', domain: 'disaster', totalCapacity: 1200, availableStock: 145, allocatedStock: 1055 },
  { id: 'res-gen', name: 'Diesel Power Generators (75kVA)', unit: 'units', domain: 'disaster', totalCapacity: 450, availableStock: 52, allocatedStock: 398 }
];

const indianDisasterZones = [
  { name: 'Brahmaputra Delta Flood Sector 4', city: 'Guwahati', region: 'Assam Flood Taskforce', lat: 26.1445, lng: 91.7362 },
  { name: 'Coastal Cyclone Shelter Camp 12', city: 'Puri', region: 'Odisha Disaster Mgmt', lat: 19.8135, lng: 85.8312 },
  { name: 'Kosi River Inundation Relief Zone B', city: 'Saharasa', region: 'Bihar State Relief', lat: 25.8835, lng: 86.6006 },
  { name: 'Wayanad Landslide Relief Base', city: 'Kalpetta', region: 'Kerala Taskforce', lat: 11.6103, lng: 76.0827 },
  { name: 'Himalayan Cloudburst Sector Alpha', city: 'Chamoli', region: 'Uttarakhand Relief Command', lat: 30.4042, lng: 79.3308 },
  { name: 'Kutch Earthquake & Heat Relief Post', city: 'Bhuj', region: 'Gujarat Relief Force', lat: 23.2420, lng: 69.6669 },
  { name: 'Marathwada Drought Tanker Hub', city: 'Latur', region: 'Maharashtra Water Taskforce', lat: 18.4088, lng: 76.5604 },
  { name: 'Sundarbans Tidal Inundation Base 7', city: 'Canning', region: 'West Bengal Relief', lat: 22.3164, lng: 88.6582 },
  { name: 'Rameshwaram Coastal Cyclone Base', city: 'Ramanathapuram', region: 'Tamil Nadu Relief', lat: 9.3639, lng: 78.8395 },
  { name: 'Yamuna Floodplain Relief Shelter 3', city: 'New Delhi', region: 'Delhi Flood Control', lat: 28.6562, lng: 77.2410 },
  { name: 'Barmer Desert Drought Station', city: 'Barmer', region: 'Rajasthan Border Relief', lat: 25.7532, lng: 71.4181 },
  { name: 'Jhelum River Valley Inundation Camp', city: 'Srinagar', region: 'J&K Disaster Force', lat: 34.0837, lng: 74.7973 }
];

export const MOCK_DISASTER_LOCATIONS: ResourceLocation[] = Array.from({ length: 60 }).map((_, i) => {
  const base = indianDisasterZones[i % indianDisasterZones.length];
  const name = i < indianDisasterZones.length ? base.name : `${base.name} Sector Grid #${Math.floor(i / indianDisasterZones.length) + 1}`;
  const severityScore = Math.round((4.2 + (i * 4.1) % 5.7) * 10) / 10;
  const occupancyOrDeficitPct = Math.min(98, Math.round(48 + ((i * 13) % 51)));
  const population = Math.round(12000 + ((i * 18211) % 140000));
  const accessibilityIndex = Math.round((0.25 + ((i * 8) % 6) * 0.1) * 100) / 100;
  
  const lat = base.lat + (Math.cos(i * 0.75) * 0.12);
  const lng = base.lng + (Math.sin(i * 0.75) * 0.14);

  const neededFood = Math.round(300 + (i * 95) % 800);
  const currentFood = Math.max(0, neededFood - Math.round((i * 80) % 550));

  const history = Array.from({ length: 14 }).map((_, h) => 
    Math.round(120 + Math.cos((h + i) * 0.4) * 60 + (h * 5))
  );

  const forecast = Array.from({ length: 30 }).map((_, f) => 
    Math.round(history[13] + Math.sin(f * 0.25) * 50 - (f * 0.6))
  );

  const rawLoc: ResourceLocation = {
    id: `dr-loc-${i + 1}`,
    domain: 'disaster',
    name,
    code: `IND-DR-${201 + i}`,
    lat,
    lng,
    region: `${base.city}, ${base.region}`,
    severityScore,
    population,
    accessibilityIndex,
    occupancyOrDeficitPct,
    resourcesNeeded: {
      'res-food': neededFood,
      'res-water': Math.round(neededFood * 0.25),
      'res-medkit': Math.round(neededFood * 0.06),
      'res-gen': Math.max(1, Math.round(neededFood * 0.02))
    },
    resourcesCurrent: {
      'res-food': currentFood,
      'res-water': Math.max(10, Math.round(neededFood * 0.25) - 40),
      'res-medkit': Math.max(2, Math.round(neededFood * 0.06) - 8),
      'res-gen': 0
    },
    urgencyLevel: 'high',
    priorityScore: 0,
    trendPrediction: i % 2 === 0 ? 'increasing' : 'stable',
    historicalDemand: history,
    forecastNext30Days: forecast,
    contactPhone: `+91 94${20000000 + i * 1832}`,
    address: `NDRF Emergency Grid ${i + 1}, ${base.city}, ${base.region}`
  };

  const score = calculatePriorityScore(rawLoc);
  rawLoc.priorityScore = score;
  rawLoc.urgencyLevel = getUrgencyLevel(score);

  return rawLoc;
});


// =========================================================================
// 3. EDUCATION DOMAIN DATA (INDIAN GOVERNMENT & DISTRICT SCHOOLS)
// =========================================================================
export const EDUCATION_CATEGORIES: ResourceCategory[] = [
  { id: 'res-teacher', name: 'Certified STEM & Math Teachers', unit: 'educators', domain: 'education', totalCapacity: 1400, availableStock: 160, allocatedStock: 1240 },
  { id: 'res-tablet', name: 'PM-eVIDYA Digital Learning Tablets', unit: 'devices', domain: 'education', totalCapacity: 28000, availableStock: 3500, allocatedStock: 24500 },
  { id: 'res-stem', name: 'Atal Tinkering Lab (ATL) STEM Kits', unit: 'kits', domain: 'education', totalCapacity: 950, availableStock: 120, allocatedStock: 830 },
  { id: 'res-grant', name: 'Samagra Shiksha Infrastructure Grant', unit: 'INR (₹ Lakhs)', domain: 'education', totalCapacity: 1200, availableStock: 180, allocatedStock: 1020 }
];

const indianSchools = [
  { name: 'Kendriya Vidyalaya No. 1 AIIMS Campus', city: 'New Delhi', region: 'Delhi-NCR', lat: 28.5685, lng: 77.2120 },
  { name: 'Jawahar Navodaya Vidyalaya JNV', city: 'Wardha', region: 'Maharashtra', lat: 20.7453, lng: 78.6022 },
  { name: 'Government Model Higher Secondary School', city: 'Kozhikode', region: 'Kerala', lat: 11.2588, lng: 75.7804 },
  { name: 'Zilla Parishad High School (ZPHS)', city: 'Satara', region: 'Maharashtra', lat: 17.6805, lng: 74.0183 },
  { name: 'Sarvodaya Kanya Vidyalaya SKV', city: 'Lajpat Nagar, New Delhi', region: 'Delhi-NCR', lat: 28.5698, lng: 77.2435 },
  { name: 'Government Tribal Residential Ashram School', city: 'Araku Valley', region: 'Andhra Pradesh', lat: 18.3273, lng: 82.8825 },
  { name: 'Kasturba Gandhi Balika Vidyalaya KGBV', city: 'Ranchi', region: 'Jharkhand', lat: 23.3441, lng: 85.3096 },
  { name: 'PM SHRI School Government Senior Secondary', city: 'Jaipur', region: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Government Multipurpose Higher Secondary', city: 'Bilaspur', region: 'Chhattisgarh', lat: 22.0797, lng: 82.1391 },
  { name: 'Government High School Sector 16', city: 'Chandigarh', region: 'Punjab & Haryana', lat: 30.7415, lng: 76.7791 },
  { name: 'Collegiate Government Boys High School', city: 'Kolkata', region: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Government Girls Model School Unit-9', city: 'Bhubaneswar', region: 'Odisha', lat: 20.2961, lng: 85.8245 }
];

export const MOCK_EDUCATION_LOCATIONS: ResourceLocation[] = Array.from({ length: 60 }).map((_, i) => {
  const base = indianSchools[i % indianSchools.length];
  const name = i < indianSchools.length ? base.name : `${base.name} District Wing #${Math.floor(i / indianSchools.length) + 1}`;
  const severityScore = Math.round((2.8 + (i * 3.3) % 6.9) * 10) / 10;
  const occupancyOrDeficitPct = Math.min(96, Math.round(38 + ((i * 14) % 58)));
  const population = Math.round(600 + ((i * 145) % 3200));
  const accessibilityIndex = Math.round((0.65 + ((i * 6) % 4) * 0.08) * 100) / 100;
  
  const lat = base.lat + (Math.sin(i * 1.05) * 0.09);
  const lng = base.lng + (Math.cos(i * 1.05) * 0.10);

  const neededTeachers = Math.round(4 + (i * 3) % 18);
  const currentTeachers = Math.max(0, neededTeachers - Math.round((i * 2) % 8));

  const history = Array.from({ length: 14 }).map((_, h) => 
    Math.round(25 + Math.sin((h + i) * 0.3) * 10 + (h * 0.6))
  );

  const forecast = Array.from({ length: 30 }).map((_, f) => 
    Math.round(history[13] + Math.sin(f * 0.2) * 8 + (f * 0.4))
  );

  const rawLoc: ResourceLocation = {
    id: `edu-loc-${i + 1}`,
    domain: 'education',
    name,
    code: `IND-EDU-${301 + i}`,
    lat,
    lng,
    region: `${base.city}, ${base.region}`,
    severityScore,
    population,
    accessibilityIndex,
    occupancyOrDeficitPct,
    resourcesNeeded: {
      'res-teacher': neededTeachers,
      'res-tablet': Math.round(neededTeachers * 55),
      'res-stem': Math.round(neededTeachers * 2.2),
      'res-grant': Math.max(1, Math.round(neededTeachers * 1.8))
    },
    resourcesCurrent: {
      'res-teacher': currentTeachers,
      'res-tablet': Math.max(15, Math.round(neededTeachers * 55) - 95),
      'res-stem': Math.max(0, Math.round(neededTeachers * 2.2) - 3),
      'res-grant': 0
    },
    urgencyLevel: 'medium',
    priorityScore: 0,
    trendPrediction: i % 3 === 0 ? 'increasing' : 'stable',
    historicalDemand: history,
    forecastNext30Days: forecast,
    contactPhone: `+91 97${30000000 + i * 2194}`,
    address: `School District Block ${i % 10 + 1}, ${base.city}, ${base.region}`
  };

  const score = calculatePriorityScore(rawLoc);
  rawLoc.priorityScore = score;
  rawLoc.urgencyLevel = getUrgencyLevel(score);

  return rawLoc;
});


// =========================================================================
// 4. INDIAN ACTIVITY LOGS & USER PROFILE
// =========================================================================
export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'log-1', domain: 'healthcare', action: 'Allocation Approved', locationName: 'AIIMS New Delhi', details: '45 ICU Beds & 15 Ventilators dispatched via Express Corridor.', timestamp: '8 mins ago', status: 'success' },
  { id: 'log-2', domain: 'disaster', action: 'Urgency Surge Alert', locationName: 'Brahmaputra Delta Flood Sector 4', details: 'Brahmaputra water level exceeded danger mark. Deficit stress at 92%.', timestamp: '18 mins ago', status: 'warning' },
  { id: 'log-3', domain: 'education', action: 'Manual Override Applied', locationName: 'Kendriya Vidyalaya No. 1 AIIMS Campus', details: 'Allocated +8 STEM Teachers under Samagra Shiksha Abhiyan.', timestamp: '45 mins ago', status: 'info' },
  { id: 'log-4', domain: 'healthcare', action: 'Oxygen Express Dispatched', locationName: 'Seth GS Medical College & KEM Hospital Mumbai', details: '200 D-Type Oxygen Cylinders dispatched from Panvel hub. ETA 40 mins.', timestamp: '1.5 hrs ago', status: 'success' },
  { id: 'log-5', domain: 'disaster', action: 'Water Purification Deployed', locationName: 'Coastal Cyclone Shelter Camp 12 Puri', details: '120 Aqua-Pure Filtration Kits operational at Puri shelter camp.', timestamp: '2.5 hrs ago', status: 'success' }
];

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Dr. Aarav Sharma',
  email: 'aarav.sharma@resourceai.gov.in',
  role: 'Director General of National Disaster & Health Operations',
  organization: 'NDMA & Ministry of Health and Family Welfare (MoHFW), Govt of India',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'
};

export const MOCK_HISTORICAL_TRENDS: AnalyticsDataPoint[] = [
  { date: 'Sep 01', demand: 2800, supply: 2100, allocated: 2050, forecastUpper: 2900, forecastLower: 2700 },
  { date: 'Sep 03', demand: 3100, supply: 2250, allocated: 2200, forecastUpper: 3250, forecastLower: 2980 },
  { date: 'Sep 05', demand: 3450, supply: 2400, allocated: 2380, forecastUpper: 3600, forecastLower: 3300 },
  { date: 'Sep 07', demand: 3800, supply: 2550, allocated: 2500, forecastUpper: 3950, forecastLower: 3650 },
  { date: 'Sep 09', demand: 4200, supply: 2700, allocated: 2680, forecastUpper: 4400, forecastLower: 4000 },
  { date: 'Sep 11', demand: 4650, supply: 2850, allocated: 2820, forecastUpper: 4850, forecastLower: 4450 },
  { date: 'Sep 13', demand: 5100, supply: 3000, allocated: 2950, forecastUpper: 5300, forecastLower: 4900 },
  { date: 'Sep 15 (Today)', demand: 5500, supply: 3150, allocated: 3100, forecastUpper: 5750, forecastLower: 5250 },
  // 7-day Prophet Forecast
  { date: 'Sep 17 (Est)', demand: 5900, supply: 3300, allocated: 3250, forecastUpper: 6200, forecastLower: 5600 },
  { date: 'Sep 19 (Est)', demand: 6350, supply: 3450, allocated: 3400, forecastUpper: 6700, forecastLower: 6000 },
  { date: 'Sep 21 (Est)', demand: 6800, supply: 3600, allocated: 3550, forecastUpper: 7200, forecastLower: 6400 },
  { date: 'Sep 23 (Est)', demand: 7250, supply: 3750, allocated: 3700, forecastUpper: 7700, forecastLower: 6800 }
];
