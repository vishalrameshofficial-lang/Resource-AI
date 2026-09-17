import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Domain, 
  ResourceLocation, 
  ResourceCategory, 
  AllocationRecommendation, 
  ActivityLog, 
  DomainWeights, 
  UserProfile,
  ReallocationAlert,
  ReallocationOverride
} from '../types';
import { 
  HEALTHCARE_CATEGORIES, 
  MOCK_HEALTHCARE_LOCATIONS,
  DISASTER_CATEGORIES,
  MOCK_DISASTER_LOCATIONS,
  EDUCATION_CATEGORIES,
  MOCK_EDUCATION_LOCATIONS,
  INITIAL_ACTIVITY_LOGS,
  MOCK_USER_PROFILE
} from '../data/mockData';
import { DEFAULT_WEIGHTS, optimizeAllocations, calculatePriorityScore, getUrgencyLevel } from '../lib/optimizationEngine';
import { detectReallocationTriggers, simulateTelemetrySurge } from '../lib/reallocation/reallocationEngine';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

interface AppContextType {
  domain: Domain;
  setDomain: (domain: Domain) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user: UserProfile;
  weights: DomainWeights;
  setWeights: React.Dispatch<React.SetStateAction<DomainWeights>>;
  
  // Data lists for current domain
  categories: ResourceCategory[];
  locations: ResourceLocation[];
  activityLogs: ActivityLog[];
  recommendations: AllocationRecommendation[];
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
  selectedAllocationModal: AllocationRecommendation | null;
  setSelectedAllocationModal: (rec: AllocationRecommendation | null) => void;

  // Setters for location lists (used when applying scenario)
  setHealthcareLocs: React.Dispatch<React.SetStateAction<ResourceLocation[]>>;
  setDisasterLocs: React.Dispatch<React.SetStateAction<ResourceLocation[]>>;
  setEducationLocs: React.Dispatch<React.SetStateAction<ResourceLocation[]>>;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedUrgencyFilter: string;
  setSelectedUrgencyFilter: (filter: string) => void;

  // Feature 1: What-If Simulation Modal state
  isSimulationOpen: boolean;
  setIsSimulationOpen: (open: boolean) => void;

  // Feature 2: Dynamic Reallocation Engine state & actions
  reallocationAlerts: ReallocationAlert[];
  approveReallocationAlert: (alertId: string, customOverride?: ReallocationOverride) => void;
  dismissReallocationAlert: (alertId: string) => void;
  triggerTelemetrySurge: () => void;

  // Actions
  approveAllocation: (recommendationId: string, finalAmount: number) => void;
  runOptimization: (resourceId?: string) => void;
  addToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
  toasts: ToastItem[];
  isLoggedIn: boolean;
  loginAs: (roleName: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [domain, setDomainState] = useState<Domain>('healthcare');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [weights, setWeights] = useState<DomainWeights>(DEFAULT_WEIGHTS);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUrgencyFilter, setSelectedUrgencyFilter] = useState<string>('all');
  
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedAllocationModal, setSelectedAllocationModal] = useState<AllocationRecommendation | null>(null);

  // Simulation modal open state
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false);

  // Reallocation alerts state
  const [reallocationAlerts, setReallocationAlerts] = useState<ReallocationAlert[]>([]);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  // Locations state map per domain
  const [healthcareLocs, setHealthcareLocs] = useState<ResourceLocation[]>(MOCK_HEALTHCARE_LOCATIONS);
  const [disasterLocs, setDisasterLocs] = useState<ResourceLocation[]>(MOCK_DISASTER_LOCATIONS);
  const [educationLocs, setEducationLocs] = useState<ResourceLocation[]>(MOCK_EDUCATION_LOCATIONS);

  // Categories state
  const [healthcareCats, setHealthcareCats] = useState<ResourceCategory[]>(HEALTHCARE_CATEGORIES);
  const [disasterCats, setDisasterCats] = useState<ResourceCategory[]>(DISASTER_CATEGORIES);
  const [educationCats, setEducationCats] = useState<ResourceCategory[]>(EDUCATION_CATEGORIES);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<AllocationRecommendation[]>([]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const addToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]); // Keep max 5 toasts
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Switch domain
  const setDomain = (newDomain: Domain) => {
    setDomainState(newDomain);
    setSelectedLocationId(null);
    setSelectedAllocationModal(null);
    addToast(`Switched workspace domain to ${newDomain.toUpperCase()}`, 'info');
  };

  // Current domain active locations
  const rawLocations = useMemo(() => {
    if (domain === 'healthcare') return healthcareLocs;
    if (domain === 'disaster') return disasterLocs;
    return educationLocs;
  }, [domain, healthcareLocs, disasterLocs, educationLocs]);

  // Recalculate live scores when weights or rawLocations change
  const locations = useMemo(() => {
    return rawLocations.map(loc => {
      const score = calculatePriorityScore(loc, weights);
      const urgency = getUrgencyLevel(score);
      return {
        ...loc,
        priorityScore: score,
        urgencyLevel: urgency
      };
    });
  }, [rawLocations, weights]);

  // Detect dynamic reallocation triggers whenever locations change
  useEffect(() => {
    const alerts = detectReallocationTriggers(locations, recommendations, domain);
    setReallocationAlerts(alerts);
  }, [locations, domain]);

  // Current categories
  const categories = useMemo(() => {
    if (domain === 'healthcare') return healthcareCats;
    if (domain === 'disaster') return disasterCats;
    return educationCats;
  }, [domain, healthcareCats, disasterCats, educationCats]);

  // Run AI Optimization
  const runOptimization = (resourceId?: string) => {
    const targetCat = categories.find(c => resourceId ? c.id === resourceId : true) || categories[0];
    if (!targetCat) return;

    const newRecs = optimizeAllocations(
      locations,
      targetCat.id,
      targetCat.name,
      targetCat.unit,
      targetCat.availableStock,
      domain,
      weights
    );

    setRecommendations(newRecs);
    if (newRecs.length > 0) {
      addToast(`AI Engine generated ${newRecs.length} optimal allocation proposals for ${targetCat.name}`, 'success');
    } else {
      addToast(`All locations have sufficient stock for ${targetCat.name}`, 'info');
    }
  };

  // Auto-run optimization on domain or weight change
  useEffect(() => {
    runOptimization();
  }, [domain, weights]);

  // Trigger telemetry surge simulation for live demonstration
  const triggerTelemetrySurge = () => {
    const updateFn = (prev: ResourceLocation[]) => simulateTelemetrySurge(prev, domain);
    if (domain === 'healthcare') setHealthcareLocs(updateFn);
    else if (domain === 'disaster') setDisasterLocs(updateFn);
    else setEducationLocs(updateFn);

    addToast('Telemetry Surge Triggered! Live Resource Monitor detected rapid occupancy spike.', 'warning');
  };

  // Approve reallocation alert (or human override)
  const approveReallocationAlert = (alertId: string, customOverride?: ReallocationOverride) => {
    const alert = reallocationAlerts.find(a => a.id === alertId);
    if (!alert) return;

    const finalAmt = customOverride ? customOverride.finalApprovedAmount : alert.recommendedAmount;

    // Log to Audit Trail
    const newLog: ActivityLog = {
      id: `log-realloc-${Date.now()}`,
      domain,
      action: customOverride ? 'Reallocation Human Override Approved' : 'Dynamic Reallocation AI Approved',
      locationName: alert.locationName,
      details: customOverride 
        ? `[HUMAN OVERRIDE by ${customOverride.userName}]: Transferred ${finalAmt} ${alert.unit} of ${alert.resourceName} from ${alert.sourceLocationName} → ${alert.locationName}. Reason: "${customOverride.overrideReason}".`
        : `[AI REALLOCATION]: Transferred ${finalAmt} ${alert.unit} of ${alert.resourceName} from ${alert.sourceLocationName} → ${alert.locationName}. (Shortage reduced from 8 to 3 nodes).`,
      timestamp: 'Just now',
      status: customOverride ? 'warning' : 'success',
      overrideReason: customOverride?.overrideReason,
      originalAiRec: customOverride?.originalRecText,
      humanOverrideAmount: customOverride?.finalApprovedAmount
    };

    setActivityLogs(prev => [newLog, ...prev]);
    setReallocationAlerts(prev => prev.filter(a => a.id !== alertId));

    addToast(
      customOverride 
        ? `Human Override approved! ${finalAmt} ${alert.unit} reallocated from ${alert.sourceLocationName} → ${alert.locationName}`
        : `Dynamic Reallocation approved! ${finalAmt} ${alert.unit} reallocated from ${alert.sourceLocationName} → ${alert.locationName}`,
      'success'
    );
  };

  const dismissReallocationAlert = (alertId: string) => {
    setReallocationAlerts(prev => prev.filter(a => a.id !== alertId));
    addToast('Reallocation alert dismissed.', 'info');
  };

  // Approve and dispatch standard allocation
  const approveAllocation = (recommendationId: string, finalAmount: number) => {
    const rec = recommendations.find(r => r.id === recommendationId);
    if (!rec) return;

    // 1. Update location stock
    const updateLocFn = (prev: ResourceLocation[]) => prev.map(loc => {
      if (loc.id === rec.locationId) {
        const curStock = loc.resourcesCurrent[rec.resourceId] || 0;
        const newStock = curStock + finalAmount;
        const needed = loc.resourcesNeeded[rec.resourceId] || 0;
        const newDeficitPct = Math.max(0, Math.round(((needed - newStock) / Math.max(1, needed)) * 100));

        return {
          ...loc,
          occupancyOrDeficitPct: newDeficitPct,
          resourcesCurrent: {
            ...loc.resourcesCurrent,
            [rec.resourceId]: newStock
          }
        };
      }
      return loc;
    });

    if (domain === 'healthcare') setHealthcareLocs(updateLocFn);
    else if (domain === 'disaster') setDisasterLocs(updateLocFn);
    else setEducationLocs(updateLocFn);

    // 2. Update category available stock
    const updateCatFn = (prev: ResourceCategory[]) => prev.map(cat => {
      if (cat.id === rec.resourceId) {
        return {
          ...cat,
          availableStock: Math.max(0, cat.availableStock - finalAmount),
          allocatedStock: cat.allocatedStock + finalAmount
        };
      }
      return cat;
    });

    if (domain === 'healthcare') setHealthcareCats(updateCatFn);
    else if (domain === 'disaster') setDisasterCats(updateCatFn);
    else setEducationCats(updateCatFn);

    // 3. Mark recommendation as approved/dispatched
    setRecommendations(prev => prev.filter(r => r.id !== recommendationId));

    // 4. Log activity
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      domain: domain,
      action: 'Allocation Approved & Dispatched',
      locationName: rec.locationName,
      details: `${finalAmount} ${rec.unit} of ${rec.resourceName} dispatched (Priority Score: ${rec.priorityScore}).`,
      timestamp: 'Just now',
      status: 'success'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    // 5. Toast feedback
    addToast(`Approved & Dispatched ${finalAmount} ${rec.unit} to ${rec.locationName}!`, 'success');
    setSelectedAllocationModal(null);
  };

  const loginAs = (roleName: string) => {
    setIsLoggedIn(true);
    setUser({
      ...MOCK_USER_PROFILE,
      role: roleName,
    });
    setActiveTab('dashboard');
    addToast(`Signed in as ${roleName}`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActiveTab('landing');
    addToast(`Logged out successfully`, 'info');
  };

  return (
    <AppContext.Provider value={{
      domain,
      setDomain,
      activeTab,
      setActiveTab,
      isDarkMode,
      toggleDarkMode,
      user,
      weights,
      setWeights,
      categories,
      locations,
      activityLogs,
      recommendations,
      selectedLocationId,
      setSelectedLocationId,
      selectedAllocationModal,
      setSelectedAllocationModal,
      setHealthcareLocs,
      setDisasterLocs,
      setEducationLocs,
      searchQuery,
      setSearchQuery,
      selectedUrgencyFilter,
      setSelectedUrgencyFilter,
      isSimulationOpen,
      setIsSimulationOpen,
      reallocationAlerts,
      approveReallocationAlert,
      dismissReallocationAlert,
      triggerTelemetrySurge,
      approveAllocation,
      runOptimization,
      addToast,
      removeToast,
      toasts,
      isLoggedIn,
      loginAs,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};

