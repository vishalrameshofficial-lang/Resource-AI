import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  RotateCw, 
  X, 
  TrendingUp, 
  ShieldAlert, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReallocationAlert } from '../../types';
import { ReallocationReviewModal } from './ReallocationReviewModal';

export const LiveResourceMonitor: React.FC = () => {
  const { 
    domain, 
    reallocationAlerts, 
    approveReallocationAlert, 
    dismissReallocationAlert, 
    triggerTelemetrySurge,
    addToast 
  } = useApp();

  const [selectedAlertForReview, setSelectedAlertForReview] = useState<ReallocationAlert | null>(null);

  const pendingAlerts = reallocationAlerts.filter(a => a.status === 'pending');

  return (
    <>
      <div className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] rounded-[20px] p-6 space-y-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5EAF0] pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center">
              <motion.span 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inline-flex h-3 w-3 rounded-full bg-[#16A974]" 
              />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A974]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102A43] flex items-center space-x-2">
                <span>LIVE RESOURCE MONITOR</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-[#16A974] border border-emerald-200">
                  REAL-TIME TELEMETRY
                </span>
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Continuous automated condition change monitoring and dynamic reallocation engine.
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 4px 14px rgba(22,119,232,0.18)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => triggerTelemetrySurge()}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-[#1677E8] text-[#1677E8] hover:text-white border border-blue-200 text-xs font-semibold flex items-center space-x-1.5 transition-all self-start sm:self-auto"
            title="Simulate sudden occupancy spike on test node to evaluate reallocation engine"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Simulate Telemetry Spike</span>
          </motion.button>
        </div>

        {/* Alerts Container */}
        {pendingAlerts.length === 0 ? (
          <div className="py-8 text-center space-y-2 bg-[#F8FAFC] rounded-xl border border-[#E5EAF0]">
            <CheckCircle2 className="w-8 h-8 text-[#16A974] mx-auto opacity-80" />
            <p className="text-xs font-bold text-[#102A43]">System Balance Optimal</p>
            <p className="text-[11px] text-[#64748B] max-w-sm mx-auto">
              All location nodes are operating within normal capacity thresholds. Click "Simulate Telemetry Spike" to test real-time reallocation triggers.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAlerts.map(alert => (
              <div 
                key={alert.id}
                className="bg-white border-2 border-[#F59E0B]/40 rounded-xl p-4 space-y-3 shadow-sm hover:border-[#F59E0B] transition-all"
              >
                {/* Alert Top Line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-amber-50 text-[#F59E0B]">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#102A43]">{alert.locationName}</h3>
                      <p className="text-[11px] text-[#64748B]">
                        Occupancy: <span className="font-bold text-[#EF4444]">{alert.currentOccupancyPct}% (Critical)</span> • Trend: <span className="font-bold text-[#EF4444]">↑ Rapid Surge</span>
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-[#F59E0B] border border-amber-200 self-start sm:self-auto">
                    ⚠️ Reallocation Required
                  </span>
                </div>

                {/* AI Recommendation Summary Box */}
                <div className="bg-[#F8FAFC] border border-[#E5EAF0] p-3 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-[#1677E8] flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Reallocation Proposal:</span>
                  </p>
                  <p className="font-semibold text-[#102A43]">
                    Move {alert.recommendedAmount} {alert.resourceName} from <span className="text-[#1677E8]">{alert.sourceLocationName}</span> → <span className="text-[#EF4444]">{alert.locationName}</span>
                  </p>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    Reason: "{alert.reason}"
                  </p>
                </div>

                {/* Bottom Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center space-x-2 text-[11px] text-[#64748B]">
                    <span>Expected Shortage Impact: <strong className="text-[#16A974]">8 → 3 critical nodes</strong></span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => dismissReallocationAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#64748B] hover:text-[#102A43] text-xs font-semibold border border-[#E5EAF0]"
                    >
                      Dismiss
                    </button>

                    <button
                      onClick={() => setSelectedAlertForReview(alert)}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#102A43] text-xs font-bold border border-[#E5EAF0] flex items-center space-x-1 shadow-sm"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-500" />
                      <span>Review / Override</span>
                    </button>

                    <button
                      onClick={() => approveReallocationAlert(alert.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1677E8] hover:bg-[#1366C8] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Allocation</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review & Override Modal */}
      {selectedAlertForReview && (
        <ReallocationReviewModal
          alert={selectedAlertForReview}
          isOpen={!!selectedAlertForReview}
          onClose={() => setSelectedAlertForReview(null)}
        />
      )}
    </>
  );
};
