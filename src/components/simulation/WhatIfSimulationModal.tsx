import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Layers, 
  TrendingUp, 
  MapPin, 
  Building2, 
  ShieldAlert, 
  GraduationCap 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SimulationInputs, ScenarioDefinition } from '../../types';
import { 
  DEFAULT_SIMULATION_INPUTS, 
  cloneAndSimulateLocations, 
  runSimulationOptimization, 
  generateSimulationSummary 
} from '../../lib/simulation/simulationEngine';

interface WhatIfSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatIfSimulationModal: React.FC<WhatIfSimulationModalProps> = ({ isOpen, onClose }) => {
  const { 
    domain, 
    locations, 
    categories, 
    weights, 
    recommendations, 
    addToast,
    setHealthcareLocs,
    setDisasterLocs,
    setEducationLocs
  } = useApp();

  const [inputs, setInputs] = useState<SimulationInputs>(DEFAULT_SIMULATION_INPUTS);
  const [activeTab, setActiveTab] = useState<'controls' | 'results' | 'scenarios'>('controls');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showApplyConfirm, setShowApplyConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  // Run simulation calculation over cloned state
  const simulatedLocations = cloneAndSimulateLocations(locations, inputs, domain, weights);
  const simulatedRecs = runSimulationOptimization(simulatedLocations, categories, domain, weights);
  const summary = generateSimulationSummary(locations, simulatedLocations, recommendations, simulatedRecs, inputs, domain);

  // Pre-defined scenarios for multi-scenario comparison
  const scenario1Inputs: SimulationInputs = {
    ...DEFAULT_SIMULATION_INPUTS,
    patientDemandChangePct: 20,
    affectedPopChangePct: 20,
    studentPopChangePct: 20,
  };

  const scenario2Inputs: SimulationInputs = {
    ...DEFAULT_SIMULATION_INPUTS,
    patientDemandChangePct: 30,
    occupancyChangePct: 15,
    roadDisruptionNodeId: locations[0]?.id,
    affectedPopChangePct: 30,
    severityScoreIncrease: 2.0,
    disasterRoadClosureId: locations[0]?.id,
    studentPopChangePct: 30,
    dropoutRiskSurgePct: 25,
  };

  const sim1Locs = cloneAndSimulateLocations(locations, scenario1Inputs, domain, weights);
  const sim1Summary = generateSimulationSummary(locations, sim1Locs, recommendations, [], scenario1Inputs, domain);

  const sim2Locs = cloneAndSimulateLocations(locations, scenario2Inputs, domain, weights);
  const sim2Summary = generateSimulationSummary(locations, sim2Locs, recommendations, [], scenario2Inputs, domain);

  const handleControlChange = (key: keyof SimulationInputs, value: any) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_SIMULATION_INPUTS);
    addToast('Simulation parameters reset to baseline current state.', 'info');
  };

  const handleRunSimulation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setActiveTab('results');
      addToast('What-If Simulation scenario calculated successfully!', 'success');
    }, 220);
  };

  const handleApplyScenario = () => {
    // Modify actual working locations state safely upon admin confirmation
    if (domain === 'healthcare') setHealthcareLocs(simulatedLocations);
    else if (domain === 'disaster') setDisasterLocs(simulatedLocations);
    else setEducationLocs(simulatedLocations);

    addToast('Applied What-If Scenario to live operational state!', 'success');
    setShowApplyConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white border border-[#E5EAF0] rounded-[16px] shadow-[0_20px_50px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EAF0] bg-[#F8FAFC]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#1677E8]/10 border border-[#1677E8]/20 flex items-center justify-center text-[#1677E8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#102A43]">What-If Simulation Engine</h2>
              <p className="text-xs text-[#64748B] font-medium">
                Test hypothetical demand, inventory, and logistics disruption scenarios non-destructively.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#102A43] hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 pt-3 border-b border-[#E5EAF0] bg-white gap-2">
          <button
            onClick={() => setActiveTab('controls')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'controls'
                ? 'border-[#1677E8] text-[#1677E8]'
                : 'border-transparent text-[#64748B] hover:text-[#102A43]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulation Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'results'
                ? 'border-[#1677E8] text-[#1677E8]'
                : 'border-transparent text-[#64748B] hover:text-[#102A43]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Results & Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab('scenarios')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'scenarios'
                ? 'border-[#1677E8] text-[#1677E8]'
                : 'border-transparent text-[#64748B] hover:text-[#102A43]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Scenario Matrix</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
          {isCalculating ? (
            /* Loading Skeleton */
            <div className="space-y-4 py-8">
              <div className="h-6 bg-slate-100 rounded-lg w-1/3 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
              <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          ) : activeTab === 'controls' ? (
            /* TAB 1: CONTROLS */
            <div className="space-y-6">
              <div className="bg-[#F8FAFC] border border-[#E5EAF0] p-4 rounded-xl flex items-center space-x-3">
                <span className="p-2 rounded-lg bg-blue-50 text-[#1677E8]">
                  {domain === 'healthcare' ? <Building2 className="w-4 h-4" /> : domain === 'disaster' ? <ShieldAlert className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
                    {domain.toUpperCase()} Domain Simulation Parameters
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Adjust sliders to model stress conditions. Changes apply only within this temporary sandbox.
                  </p>
                </div>
              </div>

              {domain === 'healthcare' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Patient Demand */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102A43]">Patient Demand Surge / Drop</span>
                      <span className="text-[#1677E8] font-bold font-mono">
                        {inputs.patientDemandChangePct > 0 ? `+${inputs.patientDemandChangePct}%` : `${inputs.patientDemandChangePct}%`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-50}
                      max={100}
                      step={5}
                      value={inputs.patientDemandChangePct}
                      onChange={(e) => handleControlChange('patientDemandChangePct', parseInt(e.target.value))}
                      className="w-full accent-[#1677E8] bg-slate-200 h-2 rounded-lg cursor-pointer"
                    />
                    <p className="text-[11px] text-[#64748B]">Simulates incoming emergency patient admission volume.</p>
                  </div>

                  {/* Hospital Occupancy Change */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102A43]">Hospital Occupancy Stress Shift</span>
                      <span className="text-[#1677E8] font-bold font-mono">
                        {inputs.occupancyChangePct > 0 ? `+${inputs.occupancyChangePct}%` : `${inputs.occupancyChangePct}%`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-30}
                      max={50}
                      step={5}
                      value={inputs.occupancyChangePct}
                      onChange={(e) => handleControlChange('occupancyChangePct', parseInt(e.target.value))}
                      className="w-full accent-[#1677E8] bg-slate-200 h-2 rounded-lg cursor-pointer"
                    />
                    <p className="text-[11px] text-[#64748B]">Modifies baseline ward and bed occupancy stress.</p>
                  </div>

                  {/* ICU Beds Supply Shift */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102A43]">Available ICU Beds / Oxygen On-Hand</span>
                      <span className="text-[#1677E8] font-bold font-mono">
                        {inputs.icuBedChangePct > 0 ? `+${inputs.icuBedChangePct}%` : `${inputs.icuBedChangePct}%`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      step={5}
                      value={inputs.icuBedChangePct}
                      onChange={(e) => handleControlChange('icuBedChangePct', parseInt(e.target.value))}
                      className="w-full accent-[#1677E8] bg-slate-200 h-2 rounded-lg cursor-pointer"
                    />
                    <p className="text-[11px] text-[#64748B]">Simulates reserve stock depletion or supply delivery.</p>
                  </div>

                  {/* Road Disruption */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102A43]">Simulated Transit Road Blockage</span>
                      <span className="text-[#EF4444] font-bold">
                        {inputs.roadDisruptionNodeId ? 'Road Blocked' : 'Normal Access'}
                      </span>
                    </div>
                    <select
                      value={inputs.roadDisruptionNodeId || ''}
                      onChange={(e) => handleControlChange('roadDisruptionNodeId', e.target.value || undefined)}
                      className="w-full bg-white border border-[#E5EAF0] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-none"
                    >
                      <option value="">No Transit Disruption</option>
                      {locations.map(l => (
                        <option key={l.id} value={l.id}>{l.name} ({l.region})</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-[#64748B]">Applies 80% transit penalty to selected facility route.</p>
                  </div>
                </div>
              )}

              {domain === 'disaster' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Affected Population */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102A43]">Affected Population Increase</span>
                      <span className="text-[#F59E0B] font-bold font-mono">
                        +{inputs.affectedPopChangePct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={inputs.affectedPopChangePct}
                      onChange={(e) => handleControlChange('affectedPopChangePct', parseInt(e.target.value))}
                      className="w-full accent-[#F59E0B] bg-slate-200 h-2 rounded-lg cursor-pointer"
                    />
                    <p className="text-[11px] text-[#64748B]">Models rapid migration or expanded flood zone population.</p>
                  </div>

                  {/* Severity Increase */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102A43]">Severity Rating Shift</span>
                      <span className="text-[#EF4444] font-bold font-mono">
                        +{inputs.severityScoreIncrease} Score
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={4}
                      step={0.5}
                      value={inputs.severityScoreIncrease}
                      onChange={(e) => handleControlChange('severityScoreIncrease', parseFloat(e.target.value))}
                      className="w-full accent-[#EF4444] bg-slate-200 h-2 rounded-lg cursor-pointer"
                    />
                    <p className="text-[11px] text-[#64748B]">Increases crisis severity score (1.0 - 10.0 scale).</p>
                  </div>

                  {/* Inventory Decrease */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102A43]">Relief Inventory Depletion</span>
                      <span className="text-[#EF4444] font-bold font-mono">
                        -{inputs.inventoryDecreasePct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={75}
                      step={5}
                      value={inputs.inventoryDecreasePct}
                      onChange={(e) => handleControlChange('inventoryDecreasePct', parseInt(e.target.value))}
                      className="w-full accent-[#EF4444] bg-slate-200 h-2 rounded-lg cursor-pointer"
                    />
                    <p className="text-[11px] text-[#64748B]">Depletes local warehouses and ration reserves.</p>
                  </div>

                  {/* Road Closure */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102A43]">Zone Access Road Blockage</span>
                      <span className="text-[#EF4444] font-bold">
                        {inputs.disasterRoadClosureId ? 'Zone Road Closed' : 'All Routes Clear'}
                      </span>
                    </div>
                    <select
                      value={inputs.disasterRoadClosureId || ''}
                      onChange={(e) => handleControlChange('disasterRoadClosureId', e.target.value || undefined)}
                      className="w-full bg-white border border-[#E5EAF0] rounded-lg px-3 py-2 text-xs text-[#102A43] focus:outline-none"
                    >
                      <option value="">No Road Closures</option>
                      {locations.map(l => (
                        <option key={l.id} value={l.id}>{l.name} ({l.region})</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-[#64748B]">Simulates bridge collapse or landslide blocking delivery.</p>
                  </div>
                </div>
              )}

              {domain === 'education' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Student Population */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102A43]">Student Enrollment Surge</span>
                      <span className="text-[#7257E8] font-bold font-mono">
                        +{inputs.studentPopChangePct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      step={5}
                      value={inputs.studentPopChangePct}
                      onChange={(e) => handleControlChange('studentPopChangePct', parseInt(e.target.value))}
                      className="w-full accent-[#7257E8] bg-slate-200 h-2 rounded-lg cursor-pointer"
                    />
                    <p className="text-[11px] text-[#64748B]">Models district enrollment spikes.</p>
                  </div>

                  {/* Dropout Risk Surge */}
                  <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#102A43]">Dropout Risk Surge</span>
                      <span className="text-[#EF4444] font-bold font-mono">
                        +{inputs.dropoutRiskSurgePct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      step={5}
                      value={inputs.dropoutRiskSurgePct}
                      onChange={(e) => handleControlChange('dropoutRiskSurgePct', parseInt(e.target.value))}
                      className="w-full accent-[#EF4444] bg-slate-200 h-2 rounded-lg cursor-pointer"
                    />
                    <p className="text-[11px] text-[#64748B]">Elevates severity score across vulnerable school clusters.</p>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'results' ? (
            /* TAB 2: RESULTS & COMPARISON */
            <div className="space-y-6">
              {/* AI Recommendation Banner */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-[#1677E8] font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>ResourceAI Simulated Recommendation</span>
                </div>
                <p className="text-xs sm:text-sm text-[#102A43] font-semibold leading-relaxed">
                  "{summary.aiRecommendationText}"
                </p>
              </div>

              {/* Side-by-side KPI Comparison Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#F8FAFC] border border-[#E5EAF0] p-4 rounded-xl space-y-1">
                  <p className="text-[11px] text-[#64748B] font-semibold">Expected Demand</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-[#102A43]">{summary.expectedDemand.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="text-lg font-extrabold text-[#1677E8]">{summary.simulatedExpectedDemand.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 font-medium">Simulated Load</p>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E5EAF0] p-4 rounded-xl space-y-1">
                  <p className="text-[11px] text-[#64748B] font-semibold">Net Resource Shortage</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-[#102A43]">{summary.shortagePct}%</span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="text-lg font-extrabold text-[#EF4444]">{summary.simulatedShortagePct}%</span>
                  </div>
                  <p className="text-[10px] text-[#EF4444] font-medium">+{summary.simulatedShortagePct - summary.shortagePct}% deficit expansion</p>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E5EAF0] p-4 rounded-xl space-y-1">
                  <p className="text-[11px] text-[#64748B] font-semibold">Critical Locations</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-[#102A43]">{summary.criticalLocationsCount}</span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="text-lg font-extrabold text-[#EF4444]">{summary.simulatedCriticalLocationsCount}</span>
                  </div>
                  <p className="text-[10px] text-[#EF4444] font-medium">High priority nodes</p>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E5EAF0] p-4 rounded-xl space-y-1">
                  <p className="text-[11px] text-[#64748B] font-semibold">Unserved Population Impact</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-[#102A43]">{summary.unservedPopulation.toLocaleString()}</span>
                    <span className="text-xs text-slate-400">→</span>
                    <span className="text-lg font-extrabold text-[#F59E0B]">{summary.simulatedUnservedPopulation.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Affected citizens</p>
                </div>
              </div>

              {/* Affected Locations List */}
              <div className="bg-white border border-[#E5EAF0] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#F4F7FA] border-b border-[#E5EAF0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#102A43]">Simulated Node Priority Changes</span>
                  <span className="text-[11px] text-[#64748B]">Showing top impacted locations</span>
                </div>
                <div className="divide-y divide-[#E5EAF0] max-h-60 overflow-y-auto">
                  {simulatedLocations.slice(0, 6).map(loc => (
                    <div key={loc.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-[#1677E8]" />
                        <div>
                          <p className="text-xs font-bold text-[#102A43]">{loc.name}</p>
                          <p className="text-[11px] text-[#64748B]">{loc.region} • Pop {loc.population.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-[#102A43]">
                          Stress {loc.occupancyOrDeficitPct}%
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          loc.urgencyLevel === 'critical' ? 'bg-rose-50 text-[#EF4444] border-rose-200' :
                          loc.urgencyLevel === 'high' ? 'bg-amber-50 text-[#F59E0B] border-amber-200' :
                          'bg-emerald-50 text-[#16A974] border-emerald-200'
                        }`}>
                          {loc.urgencyLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 3: MULTI-SCENARIO MATRIX */
            <div className="space-y-6">
              <p className="text-xs text-[#64748B]">
                Compare multiple hypothetical crisis scenarios side-by-side against current baseline conditions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Baseline */}
                <div className="bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl p-4 space-y-3">
                  <div className="border-b border-[#E5EAF0] pb-2">
                    <span className="text-xs font-bold text-[#102A43] uppercase tracking-wider">Current Baseline</span>
                    <p className="text-[11px] text-[#64748B]">Live active state</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Demand Load:</span>
                      <span className="font-bold text-[#102A43]">{summary.expectedDemand.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Shortage Deficit:</span>
                      <span className="font-bold text-[#102A43]">{summary.shortagePct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Critical Nodes:</span>
                      <span className="font-bold text-[#16A974]">{summary.criticalLocationsCount} nodes</span>
                    </div>
                  </div>
                </div>

                {/* Scenario 1 */}
                <div className="bg-white border-2 border-[#1677E8]/40 rounded-xl p-4 space-y-3 shadow-sm">
                  <div className="border-b border-[#E5EAF0] pb-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#1677E8] uppercase tracking-wider">Scenario 1</span>
                      <p className="text-[11px] text-[#64748B]">Demand Surge +20%</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#1677E8]">Moderate</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Demand Load:</span>
                      <span className="font-bold text-[#102A43]">{sim1Summary.simulatedExpectedDemand.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Shortage Deficit:</span>
                      <span className="font-bold text-[#F59E0B]">{sim1Summary.simulatedShortagePct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Critical Nodes:</span>
                      <span className="font-bold text-[#F59E0B]">{sim1Summary.simulatedCriticalLocationsCount} nodes</span>
                    </div>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div className="bg-white border-2 border-rose-300 rounded-xl p-4 space-y-3 shadow-sm">
                  <div className="border-b border-[#E5EAF0] pb-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#EF4444] uppercase tracking-wider">Scenario 2</span>
                      <p className="text-[11px] text-[#64748B]">Demand +30% + Road Disruption</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-[#EF4444]">High Crisis</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Demand Load:</span>
                      <span className="font-bold text-[#102A43]">{sim2Summary.simulatedExpectedDemand.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Shortage Deficit:</span>
                      <span className="font-bold text-[#EF4444]">{sim2Summary.simulatedShortagePct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Critical Nodes:</span>
                      <span className="font-bold text-[#EF4444]">{sim2Summary.simulatedCriticalLocationsCount} nodes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#E5EAF0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#102A43] text-xs font-semibold border border-[#E5EAF0] flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Simulation</span>
            </button>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#102A43] text-xs font-semibold border border-[#E5EAF0] transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleRunSimulation}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Simulation</span>
            </button>

            <button
              onClick={() => setShowApplyConfirm(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#1677E8] hover:bg-[#1366C8] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-1.5 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Scenario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Apply Scenario */}
      {showApplyConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-[#E5EAF0] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center space-x-3 text-[#F59E0B]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#102A43]">Confirm Scenario Application</h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Applying this What-If simulation will update the active operational dataset for the {domain.toUpperCase()} workspace. Are you sure you want to proceed?
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowApplyConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A43] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyScenario}
                className="px-4 py-2 rounded-xl bg-[#1677E8] hover:bg-[#1366C8] text-white text-xs font-bold"
              >
                Confirm & Apply State
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
