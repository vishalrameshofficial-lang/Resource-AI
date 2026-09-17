import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  FileText, 
  Sparkles, 
  UserCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReallocationAlert, ReallocationOverride } from '../../types';

interface ReallocationReviewModalProps {
  alert: ReallocationAlert;
  isOpen: boolean;
  onClose: () => void;
}

export const ReallocationReviewModal: React.FC<ReallocationReviewModalProps> = ({
  alert,
  isOpen,
  onClose
}) => {
  const { approveReallocationAlert, user, addToast } = useApp();

  const [isOverrideMode, setIsOverrideMode] = useState<boolean>(false);
  const [overrideAmount, setOverrideAmount] = useState<number>(alert.recommendedAmount);
  const [overrideReason, setOverrideReason] = useState<string>('Operational emergency directive based on ground coordinator update.');

  if (!isOpen) return null;

  const handleApprove = () => {
    if (isOverrideMode) {
      const customOverride: ReallocationOverride = {
        alertId: alert.id,
        originalRecText: `Move ${alert.recommendedAmount} ${alert.resourceName} from ${alert.sourceLocationName} to ${alert.locationName}`,
        humanOverrideText: `Move ${overrideAmount} ${alert.resourceName} from ${alert.sourceLocationName} to ${alert.locationName}`,
        finalApprovedAmount: overrideAmount,
        overrideReason: overrideReason,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userName: user.name
      };

      approveReallocationAlert(alert.id, customOverride);
      addToast(`Human Override logged & dispatched (${overrideAmount} ${alert.unit})`, 'warning');
    } else {
      approveReallocationAlert(alert.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5EAF0] rounded-[16px] shadow-[0_20px_50px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EAF0] bg-[#F8FAFC]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#F59E0B]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#102A43]">Reallocation Review & Human Approval</h2>
              <p className="text-xs text-[#64748B]">
                {alert.locationName} • {alert.domain.toUpperCase()} Domain
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
          {/* AI Recommendation Explanation */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-[#1677E8] font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Reallocation Rationale</span>
            </div>
            <p className="text-xs text-[#102A43] font-semibold leading-relaxed">
              "{alert.reason}"
            </p>
          </div>

          {/* BEFORE vs AFTER Allocation Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* BEFORE */}
            <div className="bg-[#F8FAFC] border border-[#E5EAF0] rounded-xl p-4 space-y-3">
              <div className="border-b border-[#E5EAF0] pb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">BEFORE REALLOCATION</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-[#64748B]">Previous</span>
              </div>

              <div className="space-y-2 text-xs">
                {alert.beforeAllocations.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-[#E5EAF0]">
                    <span className="font-medium text-[#102A43]">{item.fromLocationName} → {item.toLocationName}</span>
                    <span className="font-extrabold text-[#102A43]">{item.amount} {item.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AFTER AI REALLOCATION */}
            <div className="bg-white border-2 border-[#1677E8]/40 rounded-xl p-4 space-y-3 shadow-sm">
              <div className="border-b border-[#E5EAF0] pb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-[#1677E8] uppercase tracking-wider">AFTER AI REALLOCATION</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#1677E8]">Proposed</span>
              </div>

              <div className="space-y-2 text-xs">
                {alert.afterAllocations.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5EAF0]">
                    <span className="font-medium text-[#102A43]">{item.fromLocationName} → {item.toLocationName}</span>
                    <span className="font-extrabold text-[#1677E8]">{item.amount} {item.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expected Impact Stats */}
          <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5EAF0]">
            <div>
              <p className="text-[11px] text-[#64748B] font-semibold">Critical Shortage Nodes</p>
              <p className="text-base font-extrabold text-[#102A43]">
                {alert.impactCriticalCountBefore} → <span className="text-[#16A974]">{alert.impactCriticalCountAfter} nodes</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#64748B] font-semibold">Resource Systemic Coverage</p>
              <p className="text-base font-extrabold text-[#102A43]">
                {alert.impactCoveragePctBefore}% → <span className="text-[#1677E8]">{alert.impactCoveragePctAfter}%</span>
              </p>
            </div>
          </div>

          {/* Human-in-the-loop Override Form */}
          <div className="border-t border-[#E5EAF0] pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOverrideMode}
                  onChange={(e) => setIsOverrideMode(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1677E8] focus:ring-[#1677E8]"
                />
                <span className="text-xs font-bold text-[#102A43] flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-[#F59E0B]" />
                  <span>Enable Human Decision Override</span>
                </span>
              </label>

              {isOverrideMode && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-[#F59E0B] border border-amber-200">
                  Override Active
                </span>
              )}
            </div>

            {isOverrideMode && (
              <div className="space-y-4 bg-amber-50/50 p-4 rounded-xl border border-amber-200 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#102A43]">
                    Custom Allocation Quantity ({alert.unit})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={overrideAmount}
                    onChange={(e) => setOverrideAmount(parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-[#E5EAF0] rounded-lg px-3 py-2 text-xs text-[#102A43] font-bold focus:outline-none focus:ring-2 focus:ring-[#1677E8]/30"
                  />
                  <p className="text-[11px] text-[#64748B]">Original AI Recommendation: {alert.recommendedAmount} {alert.unit}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#102A43]">
                    Reason for Human Override (Logged to Audit Trail)
                  </label>
                  <textarea
                    rows={2}
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full bg-white border border-[#E5EAF0] rounded-lg p-2.5 text-xs text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#1677E8]/30"
                    placeholder="Enter justification for manual override..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#E5EAF0] bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B] hidden sm:block">
            Signed in as <strong>{user.name}</strong> ({user.role})
          </span>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#102A43] text-xs font-semibold border border-[#E5EAF0]"
            >
              Cancel
            </button>

            <button
              onClick={handleApprove}
              className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all active:scale-95 ${
                isOverrideMode ? 'bg-[#F59E0B] hover:bg-amber-600' : 'bg-[#1677E8] hover:bg-[#1366C8]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isOverrideMode ? 'Submit Human Override' : 'Approve & Dispatch AI Rec'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
