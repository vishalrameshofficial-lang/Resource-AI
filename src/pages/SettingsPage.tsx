import React from 'react';
import { 
  Sliders, 
  Sparkles, 
  RefreshCw, 
  User, 
  ShieldCheck, 
  Moon, 
  Sun
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_WEIGHTS } from '../lib/optimizationEngine';
import { PageBackground } from '../components/common/PageBackground';
import { PageHeading } from '../components/common/PageHeading';

export const SettingsPage: React.FC = () => {
  const { 
    weights, 
    setWeights, 
    user, 
    isDarkMode, 
    toggleDarkMode, 
    addToast,
    domain
  } = useApp();

  const handleSliderChange = (key: keyof typeof weights, val: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const resetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
    addToast('Optimization algorithm weights reset to factory default configuration.', 'info');
  };

  const totalWeightSum = Math.round(
    (weights.severityWeight + weights.deficitWeight + weights.populationWeight + weights.accessibilityWeight) * 100
  );

  return (
    <PageBackground>
      <div className="space-y-6 pb-16 max-w-4xl mx-auto">
        {/* Page Title & Highlight Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeading
            category="CORE OPERATIONS"
            title="MCDA Settings"
            highlightKeyword="MCDA"
            description={`Configure Multi-Criteria Decision Analysis (MCDA) weightings for live priority scoring across ${domain.toUpperCase()}.`}
          />

          <button
            onClick={resetWeights}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#102A43] text-xs font-semibold border border-[#E5EAF0] flex items-center space-x-1.5 transition-colors shadow-sm self-start sm:self-auto active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Weights</span>
          </button>
        </div>

        {/* Algorithm Weights Configuration Box */}
        <div className="bg-white border border-[#E5EAF0] rounded-[16px] p-6 space-y-6 shadow-card">
          <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-3">
            <div className="flex items-center space-x-2 text-[#1677E8]">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-base font-bold text-[#102A43]">Live MCDA Priority Score Weights</h2>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              totalWeightSum === 100 ? 'bg-emerald-50 text-[#16A974] border border-emerald-200' : 'bg-amber-50 text-[#F59E0B] border border-amber-200'
            }`}>
              Sum Weight: {totalWeightSum}%
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Adjusting these sliders instantly recalculates the Priority Score (0-100) for all location nodes in real-time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Severity Weight */}
            <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#102A43]">Severity / Urgency Score Weight</span>
                <span className="text-[#1677E8] font-mono font-bold">{Math.round(weights.severityWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weights.severityWeight}
                onChange={(e) => handleSliderChange('severityWeight', parseFloat(e.target.value))}
                className="w-full accent-[#1677E8] bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Prioritizes nodes with higher crisis severity ratings.</p>
            </div>

            {/* Deficit Weight */}
            <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#102A43]">Resource Stock Deficit Weight</span>
                <span className="text-[#1677E8] font-mono font-bold">{Math.round(weights.deficitWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weights.deficitWeight}
                onChange={(e) => handleSliderChange('deficitWeight', parseFloat(e.target.value))}
                className="w-full accent-[#1677E8] bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Prioritizes facilities with highest net shortage %.</p>
            </div>

            {/* Population Weight */}
            <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#102A43]">Logarithmic Population Density</span>
                <span className="text-[#1677E8] font-mono font-bold">{Math.round(weights.populationWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weights.populationWeight}
                onChange={(e) => handleSliderChange('populationWeight', parseFloat(e.target.value))}
                className="w-full accent-[#1677E8] bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Scales priority proportional to affected citizen population.</p>
            </div>

            {/* Accessibility Weight */}
            <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#102A43]">Route Accessibility / Transit Penalty</span>
                <span className="text-[#1677E8] font-mono font-bold">{Math.round(weights.accessibilityWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={weights.accessibilityWeight}
                onChange={(e) => handleSliderChange('accessibilityWeight', parseFloat(e.target.value))}
                className="w-full accent-[#1677E8] bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">Gives preference to dispatching early to hard-to-reach zones.</p>
            </div>
          </div>
        </div>

        {/* User Profile & Interface Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white border border-[#E5EAF0] rounded-[16px] p-5 space-y-4 shadow-card">
            <h2 className="text-base font-bold text-[#102A43] flex items-center space-x-2">
              <User className="w-4 h-4 text-[#16A974]" />
              <span>Active Executive Profile</span>
            </h2>
            <div className="flex items-center space-x-3 bg-[#F8FAFC] p-3 rounded-xl border border-[#E5EAF0]">
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20" />
              <div>
                <p className="text-sm font-bold text-[#102A43]">{user.name}</p>
                <p className="text-xs text-[#1677E8] font-semibold">{user.role}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.organization}</p>
              </div>
            </div>
          </div>

          {/* System & Theme Card */}
          <div className="bg-white border border-[#E5EAF0] rounded-[16px] p-5 space-y-4 shadow-card">
            <h2 className="text-base font-bold text-[#102A43] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#1677E8]" />
              <span>Interface & Display Preferences</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-xl border border-[#E5EAF0]">
                <div className="flex items-center space-x-2.5">
                  {isDarkMode ? <Moon className="w-4 h-4 text-[#7257E8]" /> : <Sun className="w-4 h-4 text-[#F59E0B]" />}
                  <span className="text-xs font-semibold text-[#102A43]">
                    {isDarkMode ? 'Dark Mode (SaaS Premium)' : 'Light Mode (High Contrast Enterprise)'}
                  </span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-[#102A43] border border-[#E5EAF0] shadow-sm hover:bg-slate-50"
                >
                  Toggle Theme
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#F8FAFC] p-3 rounded-xl border border-[#E5EAF0]">
                <span className="text-xs font-semibold text-[#102A43]">Auto-Dispatch Confidence Threshold</span>
                <span className="text-xs font-bold text-[#16A974] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Score ≥ 85
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  );
};
