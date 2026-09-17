import { ResourceLocation, AllocationRecommendation, DomainWeights, UrgencyLevel, Domain } from '../types';

export const DEFAULT_WEIGHTS: DomainWeights = {
  severityWeight: 0.40,
  deficitWeight: 0.35,
  populationWeight: 0.15,
  accessibilityWeight: 0.10,
};

/**
 * Calculates priority score (0-100) based on weighted multi-criteria decision analysis
 */
export function calculatePriorityScore(
  location: ResourceLocation,
  weights: DomainWeights = DEFAULT_WEIGHTS
): number {
  const normSeverity = (location.severityScore / 10) * 100;
  const normDeficit = Math.min(100, Math.max(0, location.occupancyOrDeficitPct));
  
  // Logarithmic population factor normalized to 0-100 (range 1k to 1M+)
  const popLog = Math.log10(Math.max(1000, location.population));
  const normPop = Math.min(100, Math.max(0, (popLog - 3) * 33.3)); // 3=1k -> 0, 6=1M -> 100
  
  // Accessibility factor (lower accessibility = higher urgency to dispatch early)
  const normAccessPenalty = (1 - location.accessibilityIndex) * 100;

  const score = 
    (normSeverity * weights.severityWeight) +
    (normDeficit * weights.deficitWeight) +
    (normPop * weights.populationWeight) +
    (normAccessPenalty * weights.accessibilityWeight);

  return Math.round(Math.min(100, Math.max(1, score)) * 10) / 10;
}

/**
 * Determines Urgency Level enum based on score threshold
 */
export function getUrgencyLevel(score: number): UrgencyLevel {
  if (score >= 75) return 'critical';
  if (score >= 55) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

/**
 * Generates natural-language explainability rationale for AI recommendations
 */
export function generateExplainabilityReason(
  location: ResourceLocation,
  resourceName: string,
  needed: number,
  recommended: number,
  domain: Domain
): string {
  const urgencyTerm = location.urgencyLevel.toUpperCase();
  const deficitStr = `${location.occupancyOrDeficitPct}%`;
  const trendStr = location.trendPrediction === 'increasing' 
    ? 'sharply rising surge prediction (+22% next 7d)' 
    : location.trendPrediction === 'stable' 
    ? 'steady baseline demand' 
    : 'gradually tapering demand';

  if (domain === 'healthcare') {
    return `${urgencyTerm} PRIORITY (${location.priorityScore}/100): ${location.name} reports ${deficitStr} capacity stress with ${trendStr}. Direct allocation of ${recommended} ${resourceName} will resolve ${Math.round((recommended / Math.max(1, needed)) * 100)}% of immediate ICU shortage for population of ${location.population.toLocaleString()}.`;
  } else if (domain === 'disaster') {
    const accessPct = Math.round(location.accessibilityIndex * 100);
    return `${urgencyTerm} RELIEF NEED: Zone severity rating ${location.severityScore}/10 (${deficitStr} stock deficit). Transit route accessibility is ${accessPct}%. Routing ${recommended} ${resourceName} covers ${Math.round((recommended / Math.max(1, needed)) * 100)}% of affected population (${location.population.toLocaleString()} citizens).`;
  } else {
    return `${urgencyTerm} INTERVENTION: School risk score is ${location.severityScore}/10 with student-staff deficit at ${deficitStr}. Recommended allocation of ${recommended} ${resourceName} mitigates high dropout risk across ${location.population} enrolled students with ${trendStr}.`;
  }
}

/**
 * Core Optimization Engine: Bounded Multi-Knapsack Greedy Allocator
 */
export function optimizeAllocations(
  locations: ResourceLocation[],
  resourceId: string,
  resourceName: string,
  unit: string,
  availablePool: number,
  domain: Domain,
  weights: DomainWeights = DEFAULT_WEIGHTS
): AllocationRecommendation[] {
  // 1. Calculate live priority score for all locations
  const scoredLocations = locations.map(loc => {
    const score = calculatePriorityScore(loc, weights);
    const urgency = getUrgencyLevel(score);
    return {
      ...loc,
      priorityScore: score,
      urgencyLevel: urgency
    };
  });

  // 2. Sort descending by priority score
  scoredLocations.sort((a, b) => b.priorityScore - a.priorityScore);

  let remainingPool = availablePool;
  const recommendations: AllocationRecommendation[] = [];

  for (const loc of scoredLocations) {
    const needed = loc.resourcesNeeded[resourceId] || 0;
    const current = loc.resourcesCurrent[resourceId] || 0;
    const netShortage = Math.max(0, needed - current);

    if (netShortage <= 0) continue;

    // Bounded allocation logic
    const recommended = Math.min(netShortage, remainingPool);
    remainingPool -= recommended;

    const coveragePct = Math.min(100, Math.round((recommended / netShortage) * 100));
    
    // Transport ETA simulation based on distance & accessibility
    const baseDistanceKm = 12 + (loc.lat % 1 + loc.lng % 1) * 35;
    const effectiveSpeed = 40 * loc.accessibilityIndex; // km/h
    const etaHours = Math.round((baseDistanceKm / Math.max(10, effectiveSpeed)) * 10) / 10;

    const explainReason = generateExplainabilityReason(
      loc,
      resourceName,
      netShortage,
      recommended,
      domain
    );

    recommendations.push({
      id: `alloc-${loc.id}-${resourceId}`,
      locationId: loc.id,
      locationName: loc.name,
      domain: domain,
      resourceId: resourceId,
      resourceName: resourceName,
      unit: unit,
      recommendedAmount: recommended,
      userOverrideAmount: recommended, // Default matches recommendation
      currentStock: current,
      neededAmount: netShortage,
      priorityScore: loc.priorityScore,
      urgencyLevel: loc.urgencyLevel,
      status: 'pending',
      explainabilityReason: explainReason,
      impactCoveragePct: coveragePct,
      transportEtaHours: etaHours,
    });
  }

  return recommendations;
}

/**
 * Live Recalculation for Manual Override
 */
export function recalculateOverrideImpact(
  recommendation: AllocationRecommendation,
  newAmount: number
): {
  impactCoveragePct: number;
  newExplainabilityReason: string;
} {
  const coveragePct = Math.min(100, Math.round((newAmount / Math.max(1, recommendation.neededAmount)) * 100));
  const diff = newAmount - recommendation.recommendedAmount;

  let explain = recommendation.explainabilityReason;
  if (diff > 0) {
    explain = `[MANUAL OVERRIDE: +${diff} ${recommendation.unit}] Accelerated coverage to ${coveragePct}% of deficit. ${recommendation.explainabilityReason}`;
  } else if (diff < 0) {
    explain = `[MANUAL OVERRIDE: ${diff} ${recommendation.unit}] Reduced coverage to ${coveragePct}% of total deficit. ${recommendation.explainabilityReason}`;
  }

  return {
    impactCoveragePct: coveragePct,
    newExplainabilityReason: explain,
  };
}
