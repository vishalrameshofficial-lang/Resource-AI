import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Users,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { recalculateOverrideImpact } from '../../lib/optimizationEngine';

export const AllocationModal: React.FC = () => {
  const { 
    selectedAllocationModal, 
    setSelectedAllocationModal, 
    approveAllocation,
    locations
  } = useApp();

  const [overrideAmount, setOverrideAmount] = useState<number>(0);

  useEffect(() => {
    if (selectedAllocationModal) {
      setOverrideAmount(selectedAllocationModal.userOverrideAmount);
    }
  }, [selectedAllocationModal]);

  if (!selectedAllocationModal) return null;

  const rec = selectedAllocationModal;
  const targetLocation = locations.find(l => l.id === rec.locationId);

  const { impactCoveragePct, newExplainabilityReason } = recalculateOverrideImpact(rec, overrideAmount);
  const isOverridden = overrideAmount !== rec.recommendedAmount;

  const urgencyColorMap: Record<string, string> = {
    critical: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    high: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-100">{rec.locationName}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${urgencyColorMap[rec.urgencyLevel]}`}>
                  {rec.urgencyLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Resource Allocation Dispatch Rationale • Priority Score {rec.priorityScore}/100
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedAllocationModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content scrollable body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Telemetry Snapshot Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 text-center">
              <p className="text-[11px] font-medium text-slate-400">Current Stock</p>
              <p className="text-lg font-bold text-slate-100 mt-0.5">
                {rec.currentStock} <span className="text-xs font-normal text-slate-400">{rec.unit}</span>
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 text-center">
              <p className="text-[11px] font-medium text-slate-400">Net Shortage</p>
              <p className="text-lg font-bold text-rose-400 mt-0.5">
                {rec.neededAmount} <span className="text-xs font-normal text-slate-400">{rec.unit}</span>
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 text-center">
              <p className="text-[11px] font-medium text-slate-400">Transit ETA</p>
              <p className="text-lg font-bold text-amber-400 mt-0.5 flex items-center justify-center space-x-1">
                <Truck className="w-4 h-4 mr-1 text-amber-400" />
                <span>{rec.transportEtaHours} hrs</span>
              </p>
            </div>
          </div>

          {/* AI Rationale Block */}
          <div className="bg-brand-950/40 border border-brand-500/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-brand-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Explainability Rationale</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {newExplainabilityReason}
            </p>
          </div>

          {/* Interactive Slider for Manual Override */}
          <div className="space-y-3 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-2">
                <span>Dispatch Amount ({rec.resourceName})</span>
                {isOverridden && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold border border-amber-500/20">
                    User Overridden
                  </span>
                )}
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-brand-400">
                  {overrideAmount} <span className="text-xs font-normal text-slate-400">{rec.unit}</span>
                </span>
                {isOverridden && (
                  <button
                    onClick={() => setOverrideAmount(rec.recommendedAmount)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 underline flex items-center space-x-1"
                    title="Reset to AI Recommended default"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={rec.neededAmount * 1.2}
              step={1}
              value={overrideAmount}
              onChange={(e) => setOverrideAmount(parseInt(e.target.value) || 0)}
              className="w-full accent-brand-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
            />

            {/* Live recalculation metric */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/40">
              <span className="text-slate-400">Shortage Coverage Impact:</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      impactCoveragePct >= 80 ? 'bg-emerald-500' : impactCoveragePct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, impactCoveragePct)}%` }}
                  />
                </div>
                <span className="font-bold text-slate-200 text-xs">{impactCoveragePct}%</span>
              </div>
            </div>
          </div>

          {/* Location Details metadata */}
          {targetLocation && (
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 bg-slate-800/20 p-3 rounded-xl border border-slate-700/30">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span>Population: <strong className="text-slate-200">{targetLocation.population.toLocaleString()}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-slate-500" />
                <span>Severity Score: <strong className="text-slate-200">{targetLocation.severityScore}/10</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end space-x-3 shrink-0">
          <button
            onClick={() => setSelectedAllocationModal(null)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => approveAllocation(rec.id, overrideAmount)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-2 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Dispatch ({overrideAmount} {rec.unit})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
