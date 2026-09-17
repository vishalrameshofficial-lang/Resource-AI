import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Truck, 
  ChevronRight, 
  Hospital,
  HeartPulse,
  Syringe,
  Ambulance,
  MapPin,
  ArrowRight,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeading } from '../components/common/PageHeading';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' }
  }
};

export const HealthcareDashboard: React.FC = () => {
  const { 
    locations, 
    categories, 
    recommendations, 
    setSelectedAllocationModal, 
    setSelectedLocationId, 
    setActiveTab,
    runOptimization,
    setIsSimulationOpen 
  } = useApp();

  const hcLocations = locations.filter(l => l.domain === 'healthcare');
  const criticalHospitals = hcLocations.filter(l => l.urgencyLevel === 'critical');
  const totalIcuBeds = categories.find(c => c.id === 'res-icu')?.availableStock || 320;
  const totalVents = categories.find(c => c.id === 'res-vent')?.availableStock || 110;
  const totalOxygen = categories.find(c => c.id === 'res-oxy')?.availableStock || 920;

  const rankedHospitals = [...hcLocations].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 6);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6 pb-16 relative z-10"
    >
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          prefixText=""
          highlightText="Healthcare Operations"
          suffixText=""
          subtitle="Real-time ICU bed occupancy, ventilator allocation, and oxygen cylinder supply optimization across Indian hospital networks."
        />

        <div className="flex items-center space-x-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSimulationOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/90 hover:bg-white text-[#102A43] text-xs font-bold border border-[#E5EAF0] shadow-sm flex items-center space-x-2 transition-all duration-200 active:scale-95 hover:shadow-md"
          >
            <Sliders className="w-4 h-4 text-[#1677E8]" />
            <span>What-If Simulation</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(22,119,232,0.25)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              runOptimization('res-icu');
              setActiveTab('map');
            }}
            className="group px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1677E8] to-[#08A8C8] hover:opacity-95 text-white text-xs font-bold shadow-md transition-all duration-200 flex items-center space-x-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Dispatch Emergency ICU Recs</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </motion.button>
        </div>
      </div>

      {/* KPI CARDS (Staggered Fade and Rise Into Place) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* Card 1: Critical Occupancy */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(239,68,68,0.12)] bg-gradient-to-br from-rose-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#EF4444] uppercase tracking-wider">
              CRITICAL OCCUPANCY
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center shadow-xs">
              <Hospital className="w-4.5 h-4.5 text-[#EF4444]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={criticalHospitals.length || 11} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-rose-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '92%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
              className="bg-[#EF4444] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-rose-100/60">
            <span className="inline-flex items-center space-x-1.5 font-bold text-[11px] text-[#EF4444] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
              <span>Bed stress &gt; 90%</span>
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">Immediate attention</span>
          </div>
        </motion.div>

        {/* Card 2: ICU Beds Pool */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(22,119,232,0.12)] bg-gradient-to-br from-blue-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#1677E8] uppercase tracking-wider">
              ICU BEDS POOL
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shadow-xs">
              <HeartPulse className="w-4.5 h-4.5 text-[#1677E8]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={totalIcuBeds} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-blue-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '74%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
              className="bg-[#1677E8] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-blue-100/60">
            <span className="font-bold text-[11px] text-[#1677E8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Available Reserve
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">AIIMS & Medical Hubs</span>
          </div>
        </motion.div>

        {/* Card 3: D-Type Oxygen Cylinders */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(22,184,166,0.12)] bg-gradient-to-br from-teal-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#16B8A6] uppercase tracking-wider">
              D-TYPE OXYGEN CYLINDERS
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center shadow-xs">
              <Syringe className="w-4.5 h-4.5 text-[#16B8A6]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={totalOxygen} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-teal-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
              className="bg-[#16B8A6] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-teal-100/60">
            <span className="font-bold text-[11px] text-[#16B8A6] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              47L Capacity
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">Central Depots</span>
          </div>
        </motion.div>

        {/* Card 4: Ventilators Reserve */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] p-5.5 rounded-[20px] shadow-[0_4px_20px_rgba(15,23,42,0.05)] space-y-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(114,87,232,0.12)] bg-gradient-to-br from-purple-50/40 via-white to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#7257E8] uppercase tracking-wider">
              VENTILATORS RESERVE
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center shadow-xs">
              <Ambulance className="w-4.5 h-4.5 text-[#7257E8]" />
            </div>
          </div>

          <div className="text-[34px] font-black text-[#102A43] leading-none tracking-tight">
            <AnimatedCounter value={totalVents} duration={1200} />
          </div>

          {/* Smooth filling progress bar */}
          <div className="w-full bg-purple-100/60 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '68%' }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
              className="bg-[#7257E8] h-full rounded-full"
            />
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-purple-100/60">
            <span className="font-bold text-[11px] text-[#7257E8] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              ICU Units
            </span>
            <span className="text-[11px] font-medium text-[#64748B]">Ready for transit</span>
          </div>
        </motion.div>
      </motion.div>

      {/* RANKED HOSPITAL INTERVENTION PRIORITY SECTION */}
      <div className="bg-white/90 backdrop-blur-md border border-[#E5EAF0] rounded-[20px] p-6 space-y-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#102A43] flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
                <Hospital className="w-4 h-4 text-[#16B8A6]" />
              </div>
              <span>Ranked Hospital Intervention Priority</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Hospitals ranked by ICU bed stress, admission surges, and severity rating
            </p>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="text-xs text-[#1677E8] hover:text-[#1366C8] font-bold flex items-center space-x-1 transition-colors"
          >
            <span>View Hospital Map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hospital Cards Grid with Staggered Fade-Up */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {rankedHospitals.map((hosp, idx) => {
            const rec = recommendations.find(r => r.locationId === hosp.id);
            const isCritical = hosp.urgencyLevel === 'critical';

            return (
              <motion.div
                key={hosp.id}
                variants={itemVariants}
                className="bg-slate-50/70 border border-[#E5EAF0] rounded-2xl p-4.5 space-y-3.5 hover:border-[#16B8A6]/40 hover:bg-white transition-all duration-200 shadow-xs hover:shadow-md group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-white border border-[#E5EAF0] font-mono text-xs font-black text-[#102A43] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#16B8A6] group-hover:text-white group-hover:border-[#16B8A6] transition-colors">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#102A43]">
                        {hosp.name}
                      </h3>
                      <p className="text-xs text-[#64748B] flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>📍 {hosp.region}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    isCritical ? 'bg-rose-50 text-[#EF4444] border-rose-200' : 'bg-amber-50 text-[#F59E0B] border-amber-200'
                  }`}>
                    {hosp.urgencyLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-xl border border-[#E5EAF0]">
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B]">Bed Stress</p>
                    <p className="text-sm font-black text-[#EF4444] mt-0.5">{hosp.occupancyOrDeficitPct}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B]">Severity</p>
                    <p className="text-sm font-black text-[#F59E0B] mt-0.5">{hosp.severityScore}/10</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#64748B]">Priority Score</p>
                    <p className="text-sm font-black text-[#1677E8] mt-0.5">{hosp.priorityScore}%</p>
                  </div>
                </div>

                {/* Micro progress bar for bed stress */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(hosp.occupancyOrDeficitPct, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 * idx }}
                    className={`h-full rounded-full ${isCritical ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'}`}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#64748B] font-mono">{hosp.contactPhone}</span>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedLocationId(hosp.id);
                      if (rec) setSelectedAllocationModal(rec);
                      else setActiveTab('map');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1677E8] to-[#08A8C8] hover:opacity-95 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1 active:scale-95"
                  >
                    <span>{rec ? 'Dispatch Allocation' : 'Inspect Hospital'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

